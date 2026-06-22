<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['status' => 401, 'message' => 'Token tidak ditemukan. Akses ditolak.']);
        }

        $token = trim(substr($authHeader, 7));
        $db    = \Config\Database::connect();
        $user  = $db->table('users')->where('token', $token)->get()->getRowArray();

        if (!$user) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['status' => 401, 'message' => 'Token tidak valid atau sudah kadaluarsa.']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // nothing
    }
}
