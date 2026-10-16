<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMatchRequestRequest;
use App\Http\Requests\UpdateMatchRequestStatusRequest;
use App\Http\Resources\MatchPostResource;
use App\Http\Resources\MatchRequestResource;
use App\Models\MatchPost;
use App\Models\MatchRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MatchRequestController extends Controller
{
    /**
     * Gửi yêu cầu tham gia kèo ghép (Join request).
     * POST /api/v1/matches/{post_id}/requests
     */
    public function store(StoreMatchRequestRequest $request, int $postId): JsonResponse
    {
        $user = $request->user();
        $post = MatchPost::findOrFail($postId);

        // 1. Kiểm tra bài đăng có đang mở không
        if (! $post->isOpen()) {
            return response()->json([
                'success' => false,
                'message' => 'Kèo này đã đóng hoặc đã đủ người, không thể gửi yêu cầu tham gia.',
            ], 422);
        }

        // 2. Không cho phép chủ bài đăng tự gửi request vào bài của mình
        if ($post->user_id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn là người tạo kèo này nên không cần gửi yêu cầu tham gia.',
            ], 422);
        }

        // 3. Kiểm tra xem user đã có yêu cầu nào đang chờ hoặc đã được nhận chưa
        $existingRequest = MatchRequest::where('post_id', $postId)
            ->where('requester_id', $user->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->first();

        if ($existingRequest) {
            $msg = $existingRequest->status === 'accepted'
                ? 'Bạn đã được chấp nhận tham gia kèo này.'
                : 'Bạn đã gửi yêu cầu tham gia rồi, vui lòng đợi chủ kèo phê duyệt.';

            return response()->json([
                'success' => false,
                'message' => $msg,
            ], 409);
        }

        // 4. Tạo yêu cầu mới
        $matchRequest = MatchRequest::create([
            'post_id'      => $postId,
            'requester_id' => $user->id,
            'status'       => 'pending',
        ]);

        $matchRequest->load(['requester', 'matchPost']);

        return response()->json([
            'success' => true,
            'message' => 'Đã gửi yêu cầu tham gia kèo thành công! Vui lòng đợi chủ kèo duyệt.',
            'data'    => new MatchRequestResource($matchRequest),
        ], 201);
    }

    /**
     * Chủ kèo chấp nhận hoặc từ chối yêu cầu tham gia.
     * PUT /api/v1/matches/{post_id}/requests/{request_id}
     *
     * Quy tắc:
     * - Chỉ chủ bài đăng (creator) mới có quyền duyệt.
     * - Nếu accepted và slots_needed về 0: bài đăng tự động chuyển trạng thái thành 'closed'.
     */
    public function updateStatus(
        UpdateMatchRequestStatusRequest $request,
        int $postId,
        int $requestId
    ): JsonResponse {
        $user = $request->user();
        $status = $request->validated()['status'];

        $post = MatchPost::findOrFail($postId);

        // 1. Kiểm tra quyền sở hữu
        if ($post->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền duyệt yêu cầu của kèo này.',
            ], 403);
        }

        // 2. Tìm yêu cầu tham gia
        $matchRequest = MatchRequest::where('post_id', $postId)
            ->findOrFail($requestId);

        if ($matchRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => "Yêu cầu này đã được xử lý trước đó (trạng thái hiện tại: {$matchRequest->status}).",
            ], 422);
        }

        // 3. Xử lý logic bằng Fat Model method
        DB::transaction(function () use ($post, $matchRequest, $status) {
            if ($status === 'accepted') {
                $post->acceptRequest($matchRequest);
            } else {
                $post->rejectRequest($matchRequest);
            }
        });

        $post->load(['user', 'booking.courtSlot.court', 'matchRequests.requester']);
        $matchRequest->refresh()->load('requester');

        $actionText = $status === 'accepted' ? 'chấp nhận' : 'từ chối';

        return response()->json([
            'success' => true,
            'message' => "Đã {$actionText} yêu cầu tham gia thành công.",
            'data'    => [
                'request' => new MatchRequestResource($matchRequest),
                'post'    => new MatchPostResource($post),
            ],
        ]);
    }

    /**
     * Lấy danh sách các yêu cầu tham gia do chính người dùng hiện tại đã gửi.
     * GET /api/v1/matches/my-requests
     */
    public function myRequests(Request $request): JsonResponse
    {
        $requests = MatchRequest::with(['matchPost.user', 'matchPost.booking.courtSlot.court'])
            ->where('requester_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => MatchRequestResource::collection($requests),
            'meta'    => [
                'current_page' => $requests->currentPage(),
                'last_page'    => $requests->lastPage(),
                'total'        => $requests->total(),
            ],
        ]);
    }
}
