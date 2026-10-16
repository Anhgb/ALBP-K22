<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourtResource;
use App\Http\Resources\CourtSlotResource;
use App\Models\Court;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourtController extends Controller
{
    /**
     * Danh sách tất cả sân đang hoạt động.
     * GET /api/v1/courts
     */
    public function index(): JsonResponse
    {
        $courts = Court::active()
            ->with('owner:id,name')
            ->withAvg('reviews', 'score')
            ->withCount('reviews')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => CourtResource::collection($courts),
            'meta'    => [
                'current_page' => $courts->currentPage(),
                'last_page'    => $courts->lastPage(),
                'total'        => $courts->total(),
            ],
        ]);
    }

    /**
     * Chi tiết một sân.
     * GET /api/v1/courts/{court}
     */
    public function show(Court $court): JsonResponse
    {
        if (! $court->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Sân này hiện đang tạm đóng cửa.',
            ], 404);
        }

        $court->load('owner:id,name')
              ->loadAvg('reviews', 'score')
              ->loadCount('reviews');

        return response()->json([
            'success' => true,
            'data'    => new CourtResource($court),
        ]);
    }

    /**
     * Lịch slot của sân theo ngày (grid view cho frontend).
     * GET /api/v1/courts/{court}/slots?date=YYYY-MM-DD
     */
    public function slots(Request $request, Court $court): JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
        ], [
            'date.required'         => 'Vui lòng cung cấp ngày cần xem lịch.',
            'date.date_format'      => 'Định dạng ngày phải là YYYY-MM-DD.',
            'date.after_or_equal'   => 'Chỉ có thể xem lịch từ ngày hôm nay trở đi.',
        ]);

        $slots = $court->courtSlots()
            ->where('play_date', $request->date)
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'court_id'   => $court->id,
                'court_name' => $court->name,
                'date'       => $request->date,
                'slots'      => CourtSlotResource::collection($slots),
            ],
        ]);
    }
}
