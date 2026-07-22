<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MechanicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mechanicId = $this->route('mechanic') ? $this->route('mechanic')->id : null;

        return [
            'name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:50|unique:mechanics,employee_id,' . $mechanicId,
            'specialization' => 'nullable|string|max:255',
            'contact' => 'required|string|max:20',
        ];
    }
}
