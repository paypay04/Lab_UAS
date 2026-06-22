<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class MainSeeder extends Seeder
{
    public function run()
    {
        // Seed admin user
        $this->db->table('users')->insert([
            'name'       => 'Administrator',
            'email'      => 'admin@elibrary.com',
            'password'   => password_hash('admin123', PASSWORD_BCRYPT),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        // Seed genres
        $genres = [
            ['nama_genre' => 'Novel', 'deskripsi' => 'Karya fiksi panjang'],
            ['nama_genre' => 'Komik', 'deskripsi' => 'Cerita bergambar'],
            ['nama_genre' => 'Manga', 'deskripsi' => 'Komik asal Jepang'],
            ['nama_genre' => 'Non-Fiksi', 'deskripsi' => 'Buku berbasis fakta'],
            ['nama_genre' => 'Fantasi', 'deskripsi' => 'Cerita dunia khayalan'],
        ];
        foreach ($genres as $g) {
            $g['created_at'] = date('Y-m-d H:i:s');
            $g['updated_at'] = date('Y-m-d H:i:s');
            $this->db->table('genres')->insert($g);
        }

        // Seed penulis
        $penulis = [
            ['nama' => 'Eiichiro Oda', 'penerbit' => 'Shueisha', 'bio' => 'Mangaka One Piece'],
            ['nama' => 'Andrea Hirata', 'penerbit' => 'Bentang Pustaka', 'bio' => 'Penulis Laskar Pelangi'],
            ['nama' => 'Masashi Kishimoto', 'penerbit' => 'Shueisha', 'bio' => 'Mangaka Naruto'],
        ];
        foreach ($penulis as $p) {
            $p['created_at'] = date('Y-m-d H:i:s');
            $p['updated_at'] = date('Y-m-d H:i:s');
            $this->db->table('penulis')->insert($p);
        }

        // Seed buku
        $buku = [
            ['judul' => 'One Piece Vol.1', 'genre_id' => 3, 'penulis_id' => 1, 'tahun_terbit' => 1997, 'stok' => 5, 'sinopsis' => 'Petualangan Monkey D. Luffy'],
            ['judul' => 'Laskar Pelangi', 'genre_id' => 1, 'penulis_id' => 2, 'tahun_terbit' => 2005, 'stok' => 3, 'sinopsis' => 'Kisah 10 anak Belitung'],
            ['judul' => 'Naruto Vol.1', 'genre_id' => 3, 'penulis_id' => 3, 'tahun_terbit' => 1999, 'stok' => 4, 'sinopsis' => 'Petualangan ninja muda'],
        ];
        foreach ($buku as $b) {
            $b['created_at'] = date('Y-m-d H:i:s');
            $b['updated_at'] = date('Y-m-d H:i:s');
            $this->db->table('buku')->insert($b);
        }

        // Seed anggota
        $anggota = [
            ['nama' => 'Budi Santoso', 'email' => 'budi@mail.com', 'no_hp' => '081234567890', 'alamat' => 'Jl. Merdeka No.1'],
            ['nama' => 'Siti Rahayu', 'email' => 'siti@mail.com', 'no_hp' => '089876543210', 'alamat' => 'Jl. Pahlawan No.5'],
        ];
        foreach ($anggota as $a) {
            $a['created_at'] = date('Y-m-d H:i:s');
            $a['updated_at'] = date('Y-m-d H:i:s');
            $this->db->table('anggota')->insert($a);
        }
    }
}