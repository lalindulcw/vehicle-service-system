<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'mechanic_id' => 'nullable|exists:mechanics,id',
            'scheduled_at' => 'required|date',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'labor_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'parts' => 'nullable|array',
            'parts.*.part_id' => 'required|exists:parts,id',
            'parts.*.quantity' => 'required|integer|min:1',
            'parts.*.price' => 'nullable|numeric|min:0',
        ];
    }
}
