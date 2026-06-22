<?php

namespace App\Controllers;

use App\Models\PeminjamanModel;
use App\Models\BukuModel;
use CodeIgniter\RESTful\ResourceController;

class PeminjamanController extends ResourceController
{
    protected $modelName = PeminjamanModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond([
            'status' => 200,
            'data'   => $this->model->getAllWithRelations(),
        ]);
    }

    public function show($id = null)
    {
        $data = $this->model->getOneWithRelations((int) $id);
        if (!$data) {
            return $this->failNotFound('Data peminjaman tidak ditemukan.');
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

        // Check stok buku
        $bukuModel = new BukuModel();
        $buku      = $bukuModel->find($input['buku_id']);
        if (!$buku) {
            return $this->failNotFound('Buku tidak ditemukan.');
        }
        if ((int) $buku['stok'] <= 0) {
            return $this->respond([
                'status'  => 422,
                'message' => 'Stok buku tidak tersedia.',
            ], 422);
        }

        // Set default status
        if (empty($input['status'])) {
            $input['status'] = 'dipinjam';
        }

        $db = \Config\Database::connect();
        $db->transStart();

        $id = $this->model->insert($input);
        // Kurangi stok
        $bukuModel->update($input['buku_id'], ['stok' => (int) $buku['stok'] - 1]);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => 500, 'message' => 'Transaksi gagal.'], 500);
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Peminjaman berhasil dicatat.',
            'data'    => $this->model->getOneWithRelations((int) $id),
        ]);
    }

    public function update($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Data peminjaman tidak ditemukan.');
        }

        $input = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $db        = \Config\Database::connect();
        $bukuModel = new BukuModel();

        $db->transStart();

        // If status changes to 'dikembalikan', restore stok
        $oldStatus = $existing['status'];
        $newStatus = $input['status'] ?? $oldStatus;

        if ($oldStatus !== 'dikembalikan' && $newStatus === 'dikembalikan') {
            $buku = $bukuModel->find($existing['buku_id']);
            if ($buku) {
                $bukuModel->update($existing['buku_id'], ['stok' => (int) $buku['stok'] + 1]);
            }
            // Auto set tanggal_kembali if not provided
            if (empty($input['tanggal_kembali'])) {
                $input['tanggal_kembali'] = date('Y-m-d');
            }
        }

        if (!$this->model->update($id, $input)) {
            $db->transRollback();
            return $this->respond([
                'status'  => 422,
                'message' => 'Validasi gagal.',
                'errors'  => $this->model->errors(),
            ], 422);
        }

        $db->transComplete();

        return $this->respond([
            'status'  => 200,
            'message' => 'Peminjaman berhasil diperbarui.',
            'data'    => $this->model->getOneWithRelations((int) $id),
        ]);
    }

    public function delete($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Data peminjaman tidak ditemukan.');
        }

        $this->model->delete($id);
        return $this->respond([
            'status'  => 200,
            'message' => 'Data peminjaman berhasil dihapus.',
        ]);
    }
}
