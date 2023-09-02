<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PricePercentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return !!auth()->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'percent' => ['required', 'numeric', 'min:1']
        ];
    }
}
