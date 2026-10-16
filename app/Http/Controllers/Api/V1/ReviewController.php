<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá (cho sân hoặc người chơi).
     * GET /api/v1/reviews?court_id=1 hoặc ?reviewee_id=2
     */
    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['reviewer', 'reviewee', 'court']);

        if ($request->filled('court_id')) {
            $query->forCourt((int) $request->query('court_id'));
        }

        if ($request->filled('reviewee_id')) {
            $query->forPlayer((int) $request->query('reviewee_id'));
        }

        $reviews = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => ReviewResource::collection($reviews),
            'meta'    => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    /**
     * Tạo đánh giá mới (cho sân hoặc người chơi).
     * POST /api/v1/reviews
     */
    public function store(StoreReviewRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Không cho phép tự đánh giá bản thân
        if (isset($validated['reviewee_id']) && $validated['reviewee_id'] == $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không thể tự đánh giá chính mình.',
            ], 422);
        }

        $review = Review::create([
            'reviewer_id' => $user->id,
            'reviewee_id' => $validated['reviewee_id'] ?? null,
            'court_id'    => $validated['court_id'] ?? null,
            'score'       => $validated['score'],
            'comment'     => $validated['comment'],
        ]);

        $review->load(['reviewer', 'reviewee', 'court']);

        return response()->json([
            'success' => true,
            'message' => 'Gửi đánh giá thành công! Cảm ơn đóng góp của bạn.',
            'data'    => new ReviewResource($review),
        ], 201);
    }
}
