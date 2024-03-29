<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PriceRequest extends FormRequest
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
            'width' => ['required', 'numeric', 'integer', 'min:0'],
            'height' => ['required', 'numeric', 'integer', 'min:0'],
            'material_id' => ['required', Rule::exists('materials', 'id')],
            'color_id' => ['required', Rule::exists('colors', 'id')]
        ];
    }
}
