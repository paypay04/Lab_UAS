<?php

namespace App\Models;

use CodeIgniter\Model;

class PeminjamanModel extends Model
{
    protected $table         = 'peminjaman';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'anggota_id',
        'buku_id',
        'tanggal_pinjam',
        'tanggal_kembali',
        'status',
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'anggota_id'     => 'required|integer',
        'buku_id'        => 'required|integer',
        'tanggal_pinjam' => 'required|valid_date',
        'status'         => 'permit_empty|in_list[dipinjam,dikembalikan,terlambat]',
    ];

    protected $validationMessages = [
        'anggota_id'     => ['required' => 'Anggota wajib dipilih.'],
        'buku_id'        => ['required' => 'Buku wajib dipilih.'],
        'tanggal_pinjam' => ['required' => 'Tanggal pinjam wajib diisi.'],
    ];

    public function getAllWithRelations()
    {
        return $this->db->table('peminjaman p')
            ->select('p.*, a.nama AS nama_anggota, b.judul AS judul_buku')
            ->join('anggota a', 'a.id = p.anggota_id', 'left')
            ->join('buku b',    'b.id = p.buku_id',    'left')
            ->orderBy('p.id', 'DESC')
            ->get()
            ->getResultArray();
    }

    public function getOneWithRelations(int $id)
    {
        return $this->db->table('peminjaman p')
            ->select('p.*, a.nama AS nama_anggota, b.judul AS judul_buku')
            ->join('anggota a', 'a.id = p.anggota_id', 'left')
            ->join('buku b',    'b.id = p.buku_id',    'left')
            ->where('p.id', $id)
            ->get()
            ->getRowArray();
    }
}