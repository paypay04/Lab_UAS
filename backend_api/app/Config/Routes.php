<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->options('(:any)', function () {
    return service('response')->setStatusCode(200);
});
// ── Public routes ──────────────────────────────────────────────────
$routes->post('api/login', 'AuthController::login');
$routes->post('api/logout', 'AuthController::logout');

// Public read-only (no token needed)
$routes->get('api/buku',          'BukuController::index');
$routes->get('api/buku/(:num)',   'BukuController::show/$1');
$routes->get('api/genres',        'GenreController::index');
$routes->get('api/genres/(:num)', 'GenreController::show/$1');
$routes->get('api/penulis',       'PenulisController::index');
$routes->get('api/penulis/(:num)','PenulisController::show/$1');
$routes->get('api/stats',         'StatsController::index');

// ── Protected routes (require Bearer Token) ────────────────────────
$routes->group('api', ['filter' => 'auth'], function ($routes) {

    // Buku
    $routes->post('buku',           'BukuController::create');
    $routes->post('buku/(:num)',    'BukuController::update/$1');
    $routes->put('buku/(:num)',     'BukuController::update/$1');
    $routes->delete('buku/(:num)', 'BukuController::delete/$1');

    // Genre
    $routes->post('genres',           'GenreController::create');
    $routes->put('genres/(:num)',     'GenreController::update/$1');
    $routes->delete('genres/(:num)', 'GenreController::delete/$1');

    // Penulis
    $routes->post('penulis',           'PenulisController::create');
    $routes->put('penulis/(:num)',     'PenulisController::update/$1');
    $routes->delete('penulis/(:num)', 'PenulisController::delete/$1');

    // Anggota
    $routes->get('anggota',           'AnggotaController::index');
    $routes->get('anggota/(:num)',    'AnggotaController::show/$1');
    $routes->post('anggota',          'AnggotaController::create');
    $routes->put('anggota/(:num)',    'AnggotaController::update/$1');
    $routes->delete('anggota/(:num)','AnggotaController::delete/$1');

    // Peminjaman
    $routes->get('peminjaman',           'PeminjamanController::index');
    $routes->get('peminjaman/(:num)',    'PeminjamanController::show/$1');
    $routes->post('peminjaman',          'PeminjamanController::create');
    $routes->put('peminjaman/(:num)',    'PeminjamanController::update/$1');
    $routes->delete('peminjaman/(:num)','PeminjamanController::delete/$1');
});