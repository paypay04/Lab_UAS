<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAllTables extends Migration
{
    public function up()
    {
        // =====================
        // TABLE: users (admin)
        // =====================
        $this->forge->addField([
            'id'         => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'name'       => ['type' => 'VARCHAR', 'constraint' => 100],
            'email'      => ['type' => 'VARCHAR', 'constraint' => 150],
            'password'   => ['type' => 'VARCHAR', 'constraint' => 255],
            'token'      => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('email');
        $this->forge->createTable('users');

        // =====================
        // TABLE: genres
        // =====================
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'nama_genre'  => ['type' => 'VARCHAR', 'constraint' => 100],
            'deskripsi'   => ['type' => 'TEXT', 'null' => true],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->createTable('genres');

        // =====================
        // TABLE: penulis (authors/publishers)
        // =====================
        $this->forge->addField([
            'id'         => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'nama'       => ['type' => 'VARCHAR', 'constraint' => 150],
            'penerbit'   => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
            'bio'        => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->createTable('penulis');

        // =====================
        // TABLE: buku (books)
        // =====================
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'judul'       => ['type' => 'VARCHAR', 'constraint' => 255],
            'genre_id'    => ['type' => 'INT', 'unsigned' => true],
            'penulis_id'  => ['type' => 'INT', 'unsigned' => true],
            'tahun_terbit'=> ['type' => 'YEAR', 'null' => true],
            'stok'        => ['type' => 'INT', 'default' => 0],
            'sinopsis'    => ['type' => 'TEXT', 'null' => true],
            'cover_url'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('genre_id', 'genres', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('penulis_id', 'penulis', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('buku');

        // =====================
        // TABLE: anggota (members)
        // =====================
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'nama'        => ['type' => 'VARCHAR', 'constraint' => 150],
            'email'       => ['type' => 'VARCHAR', 'constraint' => 150],
            'no_hp'       => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'alamat'      => ['type' => 'TEXT', 'null' => true],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('email');
        $this->forge->createTable('anggota');

        // =====================
        // TABLE: peminjaman (rentals)
        // =====================
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'anggota_id'     => ['type' => 'INT', 'unsigned' => true],
            'buku_id'        => ['type' => 'INT', 'unsigned' => true],
            'tanggal_pinjam' => ['type' => 'DATE'],
            'tanggal_kembali'=> ['type' => 'DATE', 'null' => true],
            'status'         => ['type' => 'ENUM', 'constraint' => ['dipinjam', 'dikembalikan', 'terlambat'], 'default' => 'dipinjam'],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
            'updated_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('anggota_id', 'anggota', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('buku_id', 'buku', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('peminjaman');
    }

    public function down()
    {
        $this->forge->dropTable('peminjaman', true);
        $this->forge->dropTable('anggota', true);
        $this->forge->dropTable('buku', true);
        $this->forge->dropTable('penulis', true);
        $this->forge->dropTable('genres', true);
        $this->forge->dropTable('users', true);
    }
}