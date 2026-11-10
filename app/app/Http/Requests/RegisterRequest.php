<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
            'zip_code' => ['nullable', 'string', 'regex:/^[0-9]{5}$/'],
            'accessibility_needs' => ['nullable', 'string', 'max:255'],
            // RGPD: solo se guarda accessibility_needs si el usuario consiente expresamente
            'accessibility_consent' => $this->filled('accessibility_needs')
                ? ['required', 'accepted']
                : ['nullable', 'boolean'],
        ];
    }
}
