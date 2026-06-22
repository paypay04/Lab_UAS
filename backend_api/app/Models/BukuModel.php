<?php

namespace App\Models;

use CodeIgniter\Model;

class BukuModel extends Model
{
    protected $table         = 'buku';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'judul',
        'genre_id',
        'penulis_id',
        'tahun_terbit',
        'stok',
        'sinopsis',
        'cover_url',
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}