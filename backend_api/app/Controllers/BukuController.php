<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class BukuController extends ResourceController
{
    protected $format = 'json';

    // ── GET ALL ─────────────────────────────────────────────────────
    public function index()
    {
        $db = \Config\Database::connect();

        $data = $db->table('buku b')
            ->select('b.*, g.nama_genre, p.nama AS nama_penulis, p.penerbit')
            ->join('genres g', 'g.id = b.genre_id', 'left')
            ->join('penulis p', 'p.id = b.penulis_id', 'left')
            ->orderBy('b.id', 'DESC')
            ->get()
            ->getResultArray();

        return $this->respond([
            'status' => 200,
            'data'   => $data,
        ]);
    }

    // ── GET ONE ─────────────────────────────────────────────────────
    public function show($id = null)
    {
        $db = \Config\Database::connect();

        $data = $db->table('buku b')
            ->select('b.*, g.nama_genre, p.nama AS nama_penulis, p.penerbit')
            ->join('genres g', 'g.id = b.genre_id', 'left')
            ->join('penulis p', 'p.id = b.penulis_id', 'left')
            ->where('b.id', $id)
            ->get()
            ->getRowArray();

        if (!$data) {
            return $this->failNotFound('Buku tidak ditemukan.');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $data,
        ]);
    }

    // ── CREATE ──────────────────────────────────────────────────────
    public function create()
    {
        $db    = \Config\Database::connect();
        $input = $this->request->getPost();

        if (empty($input['judul']) || empty($input['genre_id']) || empty($input['penulis_id'])) {
            return $this->respond([
                'status'  => 422,
                'message' => 'Judul, Genre, dan Penulis wajib diisi.',
            ], 422);
        }

        // Handle upload gambar
        $coverUrl = null;
        $file     = $this->request->getFile('cover');

        if ($file && $file->isValid() && !$file->hasMoved()) {
            $namaFile = $file->getRandomName();
            $file->move(FCPATH . 'covers', $namaFile);
            $coverUrl = base_url('covers/' . $namaFile);
        }

        $data = [
            'judul'        => $input['judul'],
            'genre_id'     => (int) $input['genre_id'],
            'penulis_id'   => (int) $input['penulis_id'],
            'tahun_terbit' => $input['tahun_terbit'] ?? null,
            'stok'         => (int) ($input['stok'] ?? 0),
            'sinopsis'     => $input['sinopsis'] ?? null,
            'cover_url'    => $coverUrl,
        ];

        $db->table('buku')->insert($data);
        $id = $db->insertID();

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Buku berhasil ditambahkan.',
            'data'    => $this->getBukuById($id),
        ]);
    }

    // ── UPDATE ──────────────────────────────────────────────────────
    public function update($id = null)
    {
        $db   = \Config\Database::connect();
        $buku = $db->table('buku')->where('id', $id)->get()->getRowArray();

        if (!$buku) {
            return $this->failNotFound('Buku tidak ditemukan.');
        }

        // CI4 tidak bisa getPost() untuk PUT dengan multipart
        // Gunakan getRawInput() untuk JSON atau getPost() untuk form-data
        $input = $this->request->getPost();
        if (empty($input)) {
            $input = $this->request->getJSON(true) ?? [];
        }

        // Handle upload gambar baru
        $coverUrl = $buku['cover_url']; // Pakai yang lama kalau tidak ada upload baru
        $file     = $this->request->getFile('cover');

        if ($file && $file->isValid() && !$file->hasMoved()) {
            // Hapus gambar lama kalau ada
            if (!empty($buku['cover_url'])) {
                $namaLama = basename($buku['cover_url']);
                $pathLama = FCPATH . 'covers/' . $namaLama;
                if (file_exists($pathLama)) {
                    unlink($pathLama);
                }
            }

            $namaFile = $file->getRandomName();
            $file->move(FCPATH . 'covers', $namaFile);
            $coverUrl = base_url('covers/' . $namaFile);
        }

        $data = [];
        if (!empty($input['judul']))        $data['judul']        = $input['judul'];
        if (!empty($input['genre_id']))     $data['genre_id']     = (int) $input['genre_id'];
        if (!empty($input['penulis_id']))   $data['penulis_id']   = (int) $input['penulis_id'];
        if (isset($input['tahun_terbit']))  $data['tahun_terbit'] = $input['tahun_terbit'];
        if (isset($input['stok']))          $data['stok']         = (int) $input['stok'];
        if (isset($input['sinopsis']))      $data['sinopsis']     = $input['sinopsis'];
        $data['cover_url'] = $coverUrl;

        $db->table('buku')->where('id', $id)->update($data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Buku berhasil diperbarui.',
            'data'    => $this->getBukuById($id),
        ]);
    }

    // ── DELETE ──────────────────────────────────────────────────────
    public function delete($id = null)
    {
        $db   = \Config\Database::connect();
        $buku = $db->table('buku')->where('id', $id)->get()->getRowArray();

        if (!$buku) {
            return $this->failNotFound('Buku tidak ditemukan.');
        }

        // Hapus file gambar kalau ada
        if (!empty($buku['cover_url'])) {
            $namaFile = basename($buku['cover_url']);
            $path     = FCPATH . 'covers/' . $namaFile;
            if (file_exists($path)) {
                unlink($path);
            }
        }

        $db->table('buku')->where('id', $id)->delete();

        return $this->respond([
            'status'  => 200,
            'message' => 'Buku berhasil dihapus.',
        ]);
    }

    // ── HELPER ──────────────────────────────────────────────────────
    private function getBukuById($id)
    {
        $db = \Config\Database::connect();
        return $db->table('buku b')
            ->select('b.*, g.nama_genre, p.nama AS nama_penulis, p.penerbit')
            ->join('genres g', 'g.id = b.genre_id', 'left')
            ->join('penulis p', 'p.id = b.penulis_id', 'left')
            ->where('b.id', $id)
            ->get()
            ->getRowArray();
    }
}