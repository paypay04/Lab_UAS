<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class StatsController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();

        $totalBuku       = $db->table('buku')->countAllResults();
        $totalGenre      = $db->table('genres')->countAllResults();
        $totalPenulis    = $db->table('penulis')->countAllResults();
        $totalAnggota    = $db->table('anggota')->countAllResults();
        $totalPeminjaman = $db->table('peminjaman')->countAllResults();
        $sedangDipinjam  = $db->table('peminjaman')->where('status', 'dipinjam')->countAllResults();

        return $this->respond([
            'status' => 200,
            'data'   => [
                'total_buku'        => $totalBuku,
                'total_genre'       => $totalGenre,
                'total_penulis'     => $totalPenulis,
                'total_anggota'     => $totalAnggota,
                'total_peminjaman'  => $totalPeminjaman,
                'sedang_dipinjam'   => $sedangDipinjam,
            ],
        ]);
    }
}
