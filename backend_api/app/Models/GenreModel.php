<?php

namespace App\Models;

use CodeIgniter\Model;

class GenreModel extends Model
{
    protected $table         = 'genres';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['nama_genre', 'deskripsi'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'nama_genre' => 'required|min_length[2]|max_length[100]',
        'deskripsi'  => 'permit_empty',
    ];

    protected $validationMessages = [
        'nama_genre' => [
            'required'   => 'Nama genre wajib diisi.',
            'min_length' => 'Nama genre minimal 2 karakter.',
        ],
    ];
}