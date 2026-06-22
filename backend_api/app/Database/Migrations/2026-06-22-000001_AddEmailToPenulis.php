<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddEmailToPenulis extends Migration
{
    public function up()
    {
        $this->forge->addColumn('penulis', [
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'null'       => true,
                'after'      => 'penerbit',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('penulis', 'email');
    }
}