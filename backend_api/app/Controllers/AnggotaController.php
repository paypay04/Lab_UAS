<?php

namespace App\Controllers;

use App\Models\MemberModel;
use CodeIgniter\RESTful\ResourceController;

class AnggotaController extends ResourceController
{
    protected $modelName = MemberModel::class;
    protected $format = 'json';

    public function index()
    {
        return $this->respond([
            'status' => 200,
            'data' => $this->model->orderBy('id', 'DESC')->findAll()
        ]);
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Anggota tidak ditemukan.');
        }

        return $this->respond([
            'status' => 200,
            'data' => $data
        ]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);

        if (!$input) {
            $input = $this->request->getPost();
        }

        if (empty($input['nama']) || empty($input['email'])) {
            return $this->respond([
                'status' => 422,
                'message' => 'Nama dan Email wajib diisi.'
            ], 422);
        }

        $cek = $this->model->where('email', $input['email'])->first();

        if ($cek) {
            return $this->respond([
                'status' => 422,
                'message' => 'Email sudah terdaftar.'
            ], 422);
        }

        $id = $this->model->insert($input);

        return $this->respondCreated([
            'status' => 201,
            'message' => 'Anggota berhasil ditambahkan.',
            'data' => $this->model->find($id)
        ]);
    }

    public function update($id = null)
    {
        $anggota = $this->model->find($id);

        if (!$anggota) {
            return $this->failNotFound('Anggota tidak ditemukan.');
        }

        $input = $this->request->getJSON(true);

        if (!$input) {
            $input = $this->request->getRawInput();
        }

        if (!empty($input['email'])) {
            $cek = $this->model
                ->where('email', $input['email'])
                ->where('id !=', $id)
                ->first();

            if ($cek) {
                return $this->respond([
                    'status' => 422,
                    'message' => 'Email sudah digunakan anggota lain.'
                ], 422);
            }
        }

        $this->model->update($id, $input);

        return $this->respond([
            'status' => 200,
            'message' => 'Anggota berhasil diperbarui.',
            'data' => $this->model->find($id)
        ]);
    }

    public function delete($id = null)
    {
        $anggota = $this->model->find($id);

        if (!$anggota) {
            return $this->failNotFound('Anggota tidak ditemukan.');
        }

        $this->model->delete($id);

        return $this->respond([
            'status' => 200,
            'message' => 'Anggota berhasil dihapus.'
        ]);
    }
}