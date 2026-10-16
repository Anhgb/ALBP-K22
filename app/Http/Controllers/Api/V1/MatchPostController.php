<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMatchPostRequest;
use App\Http\Resources\MatchPostResource;
use App\Models\MatchPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchPostController extends Controller
{
    /**
     * Lấy danh sách các bài đăng ghép kèo đang mở (open).
     * GET /api/v1/matches
     */
    public function index(Request $request): JsonResponse
    {
        $query = MatchPost::query()
            ->with([
                'user',
                'booking.courtSlot.court',
                'booking.user',
                'matchRequests.requester',
            ]);

        // Mặc định chỉ lấy các bài 'open', hoặc cho phép lọc theo status
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        } else {
            $query->open();
        }

        // Lọc theo level_required (ví dụ: Mới chơi, Trung bình, Khá...)
        if ($request->filled('level')) {
            $query->where('level_required', $request->query('level'));
        }

        // Tìm kiếm theo từ khóa trong note hoặc tên sân
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%{$search}%")
                  ->orWhereHas('booking.courtSlot.court', function ($courtQuery) use ($search) {
                      $courtQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $matches = $query->latest()->paginate(12);

        return response()->json([
            'success' => true,
            'data'    => MatchPostResource::collection($matches),
            'meta'    => [
                'current_page' => $matches->currentPage(),
                'last_page'    => $matches->lastPage(),
                'total'        => $matches->total(),
            ],
        ]);
    }

    /**
     * Tạo một bài đăng ghép kèo mới.
     * POST /api/v1/matches
     */
    public function store(StoreMatchPostRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // Tạo match post
        $matchPost = MatchPost::create([
            'user_id'                   => $user->id,
            'booking_id'                => $validated['booking_id'] ?? null,
            'level_required'            => $validated['level_required'],
            'slots_needed'              => $validated['slots_needed'],
            'estimated_cost_per_person' => $validated['estimated_cost_per_person'],
            'note'                      => $validated['note'],
            'status'                    => 'open',
        ]);

        $matchPost->load([
            'user',
            'booking.courtSlot.court',
            'booking.user',
            'matchRequests.requester',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo bài đăng ghép kèo thành công!',
            'data'    => new MatchPostResource($matchPost),
        ], 201);
    }

    /**
     * Xem chi tiết một bài đăng ghép kèo.
     * GET /api/v1/matches/{id}
     */
    public function show(int $id): JsonResponse
    {
        $matchPost = MatchPost::with([
            'user',
            'booking.courtSlot.court',
            'booking.user',
            'matchRequests.requester',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => new MatchPostResource($matchPost),
        ]);
    }

    /**
     * Lấy các bài đăng ghép kèo do chính người dùng hiện tại tạo.
     * GET /api/v1/matches/my-posts
     */
    public function myPosts(Request $request): JsonResponse
    {
        $posts = MatchPost::with([
            'user',
            'booking.courtSlot.court',
            'booking.user',
            'matchRequests.requester',
        ])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => MatchPostResource::collection($posts),
            'meta'    => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'total'        => $posts->total(),
            ],
        ]);
    }
}
