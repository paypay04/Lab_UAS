<?php

namespace App\Models;

use CodeIgniter\Model;

class PenulisModel extends Model
{
    protected $table         = 'penulis';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['nama', 'penerbit', 'email', 'bio'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'nama'     => 'required|min_length[2]|max_length[100]',
        'penerbit' => 'permit_empty|max_length[100]',
    ];

    protected $validationMessages = [
        'nama' => [
            'required'   => 'Nama penulis wajib diisi.',
            'min_length' => 'Nama minimal 2 karakter.',
        ],
    ];
}