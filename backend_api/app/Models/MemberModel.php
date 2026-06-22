<?php

namespace App\Models;

use CodeIgniter\Model;

class MemberModel extends Model
{
    protected $table = 'anggota';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'nama',
        'email',
        'no_hp',
        'alamat'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}