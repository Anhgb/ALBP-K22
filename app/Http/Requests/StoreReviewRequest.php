<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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
            'court_id'    => ['nullable', 'required_without:reviewee_id', 'exists:courts,id'],
            'reviewee_id' => ['nullable', 'required_without:court_id', 'exists:users,id'],
            'score'       => ['required', 'integer', 'min:1', 'max:5'],
            'comment'     => ['required', 'string', 'min:5', 'max:1000'],
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
            'court_id.required_without'    => 'Vui lòng chọn sân hoặc người chơi cần đánh giá.',
            'reviewee_id.required_without' => 'Vui lòng chọn người chơi hoặc sân cần đánh giá.',
            'score.required'               => 'Vui lòng chọn điểm đánh giá (1-5 sao).',
            'score.min'                    => 'Điểm đánh giá tối thiểu là 1 sao.',
            'score.max'                    => 'Điểm đánh giá tối đa là 5 sao.',
            'comment.required'             => 'Vui lòng để lại nhận xét.',
            'comment.min'                  => 'Nhận xét tối thiểu phải có 5 ký tự.',
        ];
    }
}
