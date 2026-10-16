<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Chỉ user đã đăng nhập mới được đặt sân.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Các quy tắc validate đầu vào.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'court_slot_id' => [
                'required',
                'integer',
                // Kiểm tra slot tồn tại trong database
                'exists:court_slots,id',
            ],
        ];
    }

    /**
     * Thông báo lỗi bằng tiếng Việt.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'court_slot_id.required' => 'Vui lòng chọn khung giờ cần đặt.',
            'court_slot_id.integer'  => 'ID khung giờ không hợp lệ.',
            'court_slot_id.exists'   => 'Khung giờ này không tồn tại.',
        ];
    }
}
