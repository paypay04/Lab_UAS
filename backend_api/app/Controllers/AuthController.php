<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $input = $this->request->getJSON(true);

        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 422,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ], 422);
        }

        $db = \Config\Database::connect();

        $user = $db->table('users')
            ->where('email', $input['email'])
            ->get()->getRowArray();

        if (!$user || !password_verify($input['password'], $user['password'])) {
            return $this->respond([
                'status'  => 401,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Kalau sudah punya token, pakai yang lama
        if (!empty($user['token'])) {
            $token = $user['token'];
        } else {
            // Baru generate kalau belum ada
            $token = bin2hex(random_bytes(32));
            $db->table('users')
                ->where('id', $user['id'])
                ->update(['token' => $token]);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Login berhasil.',
            'data'    => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'token' => $token,
            ],
        ], 200);
    }

    public function logout()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!empty($authHeader) && str_starts_with($authHeader, 'Bearer ')) {
            $token = trim(substr($authHeader, 7));
            $db    = \Config\Database::connect();
            $db->table('users')->where('token', $token)->update(['token' => null]);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Logout berhasil.',
        ], 200);
    }
}