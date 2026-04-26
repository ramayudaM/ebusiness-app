<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Hanya user yang sudah login yang boleh update profil
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name'        => ['sometimes', 'string', 'max:255'],
            'phone'       => ['sometimes', 'nullable', 'string', 'max:20'],
            'address'     => ['sometimes', 'nullable', 'string', 'max:500'],
            'city'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'province'    => ['sometimes', 'nullable', 'string', 'max:100'],
            'postal_code' => ['sometimes', 'nullable', 'string', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max'        => 'Nama maksimal 255 karakter.',
            'phone.max'       => 'Nomor telepon maksimal 20 karakter.',
            'address.max'     => 'Alamat maksimal 500 karakter.',
            'city.max'        => 'Nama kota maksimal 100 karakter.',
            'province.max'    => 'Nama provinsi maksimal 100 karakter.',
            'postal_code.max' => 'Kode pos maksimal 10 karakter.',
        ];
    }
}

