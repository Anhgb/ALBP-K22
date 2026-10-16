<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMatchPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'booking_id'                => ['nullable', 'exists:bookings,id'],
            'level_required'            => ['required', 'string', 'max:50'],
            'slots_needed'              => ['required', 'integer', 'min:1', 'max:20'],
            'estimated_cost_per_person' => ['required', 'numeric', 'min:0'],
            'note'                      => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * Custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'booking_id.exists'                  => 'Thông tin đặt sân không tồn tại.',
            'level_required.required'            => 'Vui lòng chọn trình độ yêu cầu.',
            'slots_needed.required'              => 'Vui lòng nhập số lượng người cần ghép.',
            'slots_needed.min'                   => 'Số lượng người cần ghép tối thiểu là 1.',
            'estimated_cost_per_person.required' => 'Vui lòng nhập chi phí ước tính mỗi người.',
            'estimated_cost_per_person.numeric'  => 'Chi phí phải là một số hợp lệ.',
            'note.required'                      => 'Vui lòng nhập mô tả / ghi chú cho kèo đấu.',
            'note.max'                           => 'Mô tả không được vượt quá 1000 ký tự.',
        ];
    }
}
