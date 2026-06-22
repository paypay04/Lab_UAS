const content = document.getElementById("content");

function isLogin() {
    return localStorage.getItem("login") === "1";
}

// NAVIGATION
document.getElementById("menu-dashboard").onclick = () => showPage("dashboard");
document.getElementById("menu-buku").onclick = () => showPage("buku");
document.getElementById("menu-anggota").onclick = () => showPage("anggota");
document.getElementById("menu-penulis").onclick = () => showPage("penulis");
document.getElementById("menu-genre").onclick = () => showPage("genre");
document.getElementById("menu-peminjaman").onclick = () => showPage("peminjaman");

// ROUTER SIMPLE
function showPage(page) {
    const content = document.getElementById("content");

    const isLoggedIn = localStorage.getItem("login") === "1";

    if (!isLoggedIn && page !== "login") {
    content.innerHTML = loginPage();
    return;
    }

    switch (page) {
    case "dashboard":
        content.innerHTML = `<p class="text-gray-400">⏳ Memuat dashboard...</p>`;
        dashboardPage().then((html) => (content.innerHTML = html));
        break;

    case "buku":
        content.innerHTML = `<p class="text-gray-400">⏳ Memuat data buku...</p>`;
        bukuPage().then((html) => (content.innerHTML = html));
        break;

    case "anggota":
        content.innerHTML = `<p class="text-gray-400">⏳ Memuat data anggota...</p>`;
        anggotaPage().then((html) => (content.innerHTML = html));
        break;

    case "penulis":
        content.innerHTML = `<p class="text-gray-400">⏳ Memuat data penulis...</p>`;
        penulisPage().then((html) => (content.innerHTML = html));
        break;

    case "genre":
        content.innerHTML = `<p class="text-gray-400">⏳ Memuat data genre...</p>`;
        genrePage().then((html) => (content.innerHTML = html));
        break;

    case "peminjaman":
        content.innerHTML = `<p class="text-gray-400">⏳ Memuat data peminjaman...</p>`;
        peminjamanPage().then((html) => (content.innerHTML = html));
        break;

    case "login":
        content.innerHTML = loginPage();
        break;
    }
}

// Fungsi untuk set menu aktif
function setActiveMenu(menuId) {
    // Hapus active state dari semua tombol
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('bg-[#5a3e2b]', 'ring-2', 'ring-[#FFF8F0]');
        btn.classList.add('bg-[#8B6B4A]');
    });

    // Tambahkan active state ke tombol yang dipilih
    const activeBtn = document.getElementById(menuId);
    if (activeBtn) {
        activeBtn.classList.remove('bg-[#8B6B4A]');
        activeBtn.classList.add('bg-[#5a3e2b]', 'ring-2', 'ring-[#FFF8F0]');
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    showPage("login");
}

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("login") === "1") {
    showPage("dashboard");
    } else {
    showPage("login");
    }
});