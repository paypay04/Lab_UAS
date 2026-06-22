const BASE_URL = "http://localhost:8080/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── GENRE PAGE ──────────────────────────────────────────────────────
async function genrePage() {
  try {
    const res = await fetch(`${BASE_URL}/genres`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    const data = json.data || [];

    let rows = "";
    data.forEach((g) => {
      rows += `
        <tr class="hover:bg-[#FFF1E6] border-b border-[#E8D5C4]">
          <td class="p-3">${g.id}</td>
          <td class="p-3 font-medium">${g.nama_genre ?? g.name ?? "-"}</td>
          <td class="p-3 text-sm text-gray-500">${g.deskripsi ?? g.description ?? "-"}</td>
          <td class="p-3 flex gap-2">
            <button onclick="editGenre(${g.id}, '${(g.nama_genre ?? g.name ?? "").replace(/'/g, "\\'")}', '${(g.deskripsi ?? g.description ?? "").replace(/'/g, "\\'")}')"
              class="bg-[#D2B48C] hover:bg-[#C4A882] text-[#5C4033] px-3 py-1 rounded-lg text-sm font-medium">
              ✏️ Edit
            </button>
            <button onclick="hapusGenre(${g.id})"
              class="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm font-medium">
              🗑️ Hapus
            </button>
          </td>
        </tr>`;
    });

    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Data Genre 📚</h1>
        <button onclick="tambahGenre()"
          class="bg-[#6F4E37] hover:bg-[#5C4033] text-white px-4 py-2 rounded-xl font-medium">
          + Tambah Genre
        </button>
      </div>

      <div class="bg-white rounded-xl shadow border border-[#E8D5C4] overflow-hidden">
        <table class="w-full">
          <thead class="bg-[#D2B48C] text-[#5C4033]">
            <tr>
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Nama Genre</th>
              <th class="p-3 text-left">Deskripsi</th>
              <th class="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="4" class="p-4 text-center text-gray-400">Belum ada data genre.</td></tr>'}</tbody>
        </table>
      </div>

      <!-- MODAL -->
      <div id="modal-genre" class="hidden fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
          <h2 id="modal-genre-title" class="text-xl font-bold mb-4 text-[#5C4033]">Tambah Genre</h2>
          <input type="hidden" id="genre-id">

          <label class="block text-sm font-medium mb-1">Nama Genre <span class="text-red-500">*</span></label>
          <input id="genre-nama" type="text" placeholder="Contoh: Novel, Manga, Komik..."
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea id="genre-deskripsi" placeholder="Deskripsi singkat genre..." rows="3"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"></textarea>

          <p id="genre-error" class="text-red-500 text-sm mb-3 hidden"></p>

          <div class="flex gap-3 justify-end">
            <button onclick="tutupModalGenre()"
              class="px-4 py-2 rounded-xl border border-[#E8D5C4] hover:bg-gray-50">Batal</button>
            <button onclick="simpanGenre()"
              class="px-4 py-2 rounded-xl bg-[#6F4E37] text-white hover:bg-[#5C4033]">Simpan</button>
          </div>
        </div>
      </div>`;
  } catch (err) {
    return `<div class="bg-red-100 text-red-700 p-4 rounded-xl">❌ Gagal memuat genre. ${err.message}</div>`;
  }
}

function tambahGenre() {
  document.getElementById("modal-genre-title").textContent = "Tambah Genre";
  document.getElementById("genre-id").value = "";
  document.getElementById("genre-nama").value = "";
  document.getElementById("genre-deskripsi").value = "";
  document.getElementById("genre-error").classList.add("hidden");
  document.getElementById("modal-genre").classList.remove("hidden");
}

function editGenre(id, nama, deskripsi) {
  document.getElementById("modal-genre-title").textContent = "Edit Genre";
  document.getElementById("genre-id").value = id;
  document.getElementById("genre-nama").value = nama;
  document.getElementById("genre-deskripsi").value = deskripsi;
  document.getElementById("genre-error").classList.add("hidden");
  document.getElementById("modal-genre").classList.remove("hidden");
}

function tutupModalGenre() {
  document.getElementById("modal-genre").classList.add("hidden");
}

async function simpanGenre() {
  const id = document.getElementById("genre-id").value;
  const nama = document.getElementById("genre-nama").value.trim();
  const deskripsi = document.getElementById("genre-deskripsi").value.trim();
  const errEl = document.getElementById("genre-error");

  if (!nama) {
    errEl.textContent = "Nama genre wajib diisi.";
    errEl.classList.remove("hidden");
    return;
  }

  const body = { nama_genre: nama, deskripsi };
  const url = id ? `${BASE_URL}/genres/${id}` : `${BASE_URL}/genres`;
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (res.ok || json.status === 200 || json.status === 201) {
      tutupModalGenre();
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      genrePage().then((html) => (content.innerHTML = html));
    } else {
      errEl.textContent = json.message || "Gagal menyimpan data.";
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    errEl.textContent = "Terjadi kesalahan: " + err.message;
    errEl.classList.remove("hidden");
  }
}

async function hapusGenre(id) {
  if (!confirm("Yakin ingin menghapus genre ini?")) return;

  try {
    const res = await fetch(`${BASE_URL}/genres/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const json = await res.json();

    if (res.ok || json.status === 200) {
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      genrePage().then((html) => (content.innerHTML = html));
    } else {
      alert(json.message || "Gagal menghapus genre.");
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}