<?php

namespace App\Controllers;

use App\Models\PenulisModel;
use CodeIgniter\RESTful\ResourceController;

class PenulisController extends ResourceController
{
    protected $modelName = PenulisModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond([
            'status' => 200,
            'data'   => $this->model->orderBy('id', 'DESC')->findAll(),
        ]);
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound('Penulis tidak ditemukan.');
        }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$this->model->validate($input)) {
            return $this->respond([
                'status'  => 422,
                'message' => 'Validasi gagal.',
                'errors'  => $this->model->errors(),
            ], 422);
        }

        $id = $this->model->insert($input);
        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Penulis berhasil ditambahkan.',
            'data'    => $this->model->find($id),
        ]);
    }

    public function update($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound('Penulis tidak ditemukan.');
        }

        $input = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (!$this->model->update($id, $input)) {
            return $this->respond([
                'status'  => 422,
                'message' => 'Validasi gagal.',
                'errors'  => $this->model->errors(),
            ], 422);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Penulis berhasil diperbarui.',
            'data'    => $this->model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound('Penulis tidak ditemukan.');
        }

        $this->model->delete($id);
        return $this->respond([
            'status'  => 200,
            'message' => 'Penulis berhasil dihapus.',
        ]);
    }
}
