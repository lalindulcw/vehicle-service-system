<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $partId = $this->route('part') ? $this->route('part')->id : null;

        return [
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:50|unique:parts,sku,' . $partId,
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock_threshold' => 'required|integer|min:0',
        ];
    }
}
