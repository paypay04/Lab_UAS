// ── BASE URL & HELPERS (didefinisikan di Genre.js, dipakai semua komponen) ──
// const BASE_URL, getToken(), authHeaders() → sudah ada di Genre.js
// CATATAN: authHeaders() biasanya berisi { Authorization: ... , 'Content-Type': 'application/json' }
// Untuk upload file kita TIDAK boleh set Content-Type manual (browser yang atur boundary-nya),
// jadi kita pakai authHeadersFile() di bawah ini.

function authHeadersFile() {
  const headers = authHeaders();
  delete headers["Content-Type"]; // biarkan browser set multipart/form-data otomatis
  return headers;
}

const DEFAULT_COVER = "https://via.placeholder.com/60x80?text=No+Cover";

// ── BUKU PAGE ────────────────────────────────────────────────────────
async function bukuPage() {
  try {
    const [resBuku, resGenre, resPenulis] = await Promise.all([
      fetch(`${BASE_URL}/buku`,    { headers: authHeaders() }),
      fetch(`${BASE_URL}/genres`,  { headers: authHeaders() }),
      fetch(`${BASE_URL}/penulis`, { headers: authHeaders() }),
    ]);

    const dataBuku    = (await resBuku.json()).data    || [];
    const dataGenre   = (await resGenre.json()).data   || [];
    const dataPenulis = (await resPenulis.json()).data || [];

    let rows = "";
    dataBuku.forEach((b) => {
      const coverSrc = b.cover_url ? b.cover_url : DEFAULT_COVER;
      rows += `
        <tr class="hover:bg-[#FFF1E6] border-b border-[#E8D5C4]">
          <td class="p-3">${b.id}</td>
          <td class="p-3">
            <img src="${coverSrc}" alt="cover ${(b.judul ?? "").replace(/"/g, "&quot;")}"
              class="w-12 h-16 object-cover rounded-md border border-[#E8D5C4] bg-gray-100"
              onerror="this.src='${DEFAULT_COVER}'">
          </td>
          <td class="p-3 font-medium">${b.judul}</td>
          <td class="p-3">${b.nama_genre ?? "-"}</td>
          <td class="p-3">${b.nama_penulis ?? "-"}</td>
          <td class="p-3">${b.tahun_terbit ?? "-"}</td>
          <td class="p-3 text-center">
            <span class="bg-[#FFF1E6] text-[#6F4E37] font-bold px-3 py-1 rounded-full">${b.stok}</span>
          </td>
          <td class="p-3 flex gap-2">
            <button onclick="editBuku(${b.id}, '${(b.judul ?? "").replace(/'/g, "\\'")}', ${b.genre_id}, ${b.penulis_id}, '${b.tahun_terbit ?? ""}', ${b.stok}, '${(b.sinopsis ?? "").replace(/'/g, "\\'").replace(/\n/g, " ")}', '${b.cover_url ?? ""}')"
              class="bg-[#D2B48C] hover:bg-[#C4A882] text-[#5C4033] px-3 py-1 rounded-lg text-sm font-medium">
              ✏️ Edit
            </button>
            <button onclick="hapusBuku(${b.id})"
              class="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm font-medium">
              🗑️ Hapus
            </button>
          </td>
        </tr>`;
    });

    const opsiGenre   = dataGenre.map((g) => `<option value="${g.id}">${g.nama_genre ?? g.name}</option>`).join("");
    const opsiPenulis = dataPenulis.map((p) => `<option value="${p.id}">${p.nama}</option>`).join("");

    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Data Buku 📚</h1>
        <button onclick="tambahBuku()"
          class="bg-[#6F4E37] hover:bg-[#5C4033] text-white px-4 py-2 rounded-xl font-medium">
          + Tambah Buku
        </button>
      </div>

      <div class="bg-white rounded-xl shadow border border-[#E8D5C4] overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#D2B48C] text-[#5C4033]">
            <tr>
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Cover</th>
              <th class="p-3 text-left">Judul</th>
              <th class="p-3 text-left">Genre</th>
              <th class="p-3 text-left">Penulis</th>
              <th class="p-3 text-left">Tahun</th>
              <th class="p-3 text-left">Stok</th>
              <th class="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="8" class="p-4 text-center text-gray-400">Belum ada data buku.</td></tr>'}</tbody>
        </table>
      </div>

      <!-- MODAL -->
      <div id="modal-buku" class="hidden fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <h2 id="modal-buku-title" class="text-xl font-bold mb-4 text-[#5C4033]">Tambah Buku</h2>
          <input type="hidden" id="buku-id">
          <input type="hidden" id="buku-cover-lama">

          <label class="block text-sm font-medium mb-1">Sampul Buku</label>
          <div class="flex items-center gap-3 mb-3">
            <img id="buku-preview-cover" src="${DEFAULT_COVER}"
              class="w-16 h-20 object-cover rounded-md border border-[#E8D5C4] bg-gray-100">
            <input id="buku-cover-file" type="file" accept="image/*"
              onchange="previewCoverBuku(event)"
              class="text-sm text-gray-600 border border-[#E8D5C4] rounded-lg p-1.5 w-full">
          </div>

          <label class="block text-sm font-medium mb-1">Judul <span class="text-red-500">*</span></label>
          <input id="buku-judul" type="text" placeholder="Judul buku..."
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Genre <span class="text-red-500">*</span></label>
          <select id="buku-genre"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">
            <option value="">-- Pilih Genre --</option>
            ${opsiGenre}
          </select>

          <label class="block text-sm font-medium mb-1">Penulis <span class="text-red-500">*</span></label>
          <select id="buku-penulis"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">
            <option value="">-- Pilih Penulis --</option>
            ${opsiPenulis}
          </select>

          <label class="block text-sm font-medium mb-1">Tahun Terbit</label>
          <input id="buku-tahun" type="number" placeholder="2024" min="1900" max="2099"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Stok <span class="text-red-500">*</span></label>
          <input id="buku-stok" type="number" placeholder="0" min="0"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Sinopsis</label>
          <textarea id="buku-sinopsis" placeholder="Sinopsis buku..." rows="3"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"></textarea>

          <p id="buku-error" class="text-red-500 text-sm mb-3 hidden"></p>

          <div class="flex gap-3 justify-end">
            <button onclick="tutupModalBuku()"
              class="px-4 py-2 rounded-xl border border-[#E8D5C4] hover:bg-gray-50">Batal</button>
            <button onclick="simpanBuku()"
              class="px-4 py-2 rounded-xl bg-[#6F4E37] text-white hover:bg-[#5C4033]">Simpan</button>
          </div>
        </div>
      </div>`;
  } catch (err) {
    return `<div class="bg-red-100 text-red-700 p-4 rounded-xl">❌ Gagal memuat buku. ${err.message}</div>`;
  }
}

// Preview gambar sebelum diupload
function previewCoverBuku(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("buku-preview-cover").src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function resetCoverInput() {
  document.getElementById("buku-cover-file").value = "";
  document.getElementById("buku-cover-lama").value = "";
  document.getElementById("buku-preview-cover").src = DEFAULT_COVER;
}

function tambahBuku() {
  document.getElementById("modal-buku-title").textContent = "Tambah Buku";
  document.getElementById("buku-id").value       = "";
  document.getElementById("buku-judul").value    = "";
  document.getElementById("buku-genre").value    = "";
  document.getElementById("buku-penulis").value  = "";
  document.getElementById("buku-tahun").value    = "";
  document.getElementById("buku-stok").value     = "";
  document.getElementById("buku-sinopsis").value = "";
  resetCoverInput();
  document.getElementById("buku-error").classList.add("hidden");
  document.getElementById("modal-buku").classList.remove("hidden");
}

function editBuku(id, judul, genreId, penulisId, tahun, stok, sinopsis, coverUrl) {
  document.getElementById("modal-buku-title").textContent = "Edit Buku";
  document.getElementById("buku-id").value       = id;
  document.getElementById("buku-judul").value    = judul;
  document.getElementById("buku-genre").value    = genreId;
  document.getElementById("buku-penulis").value  = penulisId;
  document.getElementById("buku-tahun").value    = tahun;
  document.getElementById("buku-stok").value     = stok;
  document.getElementById("buku-sinopsis").value = sinopsis;

  document.getElementById("buku-cover-file").value = "";
  document.getElementById("buku-cover-lama").value = coverUrl || "";
  document.getElementById("buku-preview-cover").src = coverUrl ? coverUrl : DEFAULT_COVER;

  document.getElementById("buku-error").classList.add("hidden");
  document.getElementById("modal-buku").classList.remove("hidden");
}

function tutupModalBuku() {
  document.getElementById("modal-buku").classList.add("hidden");
}

async function simpanBuku() {
  const id        = document.getElementById("buku-id").value;
  const judul     = document.getElementById("buku-judul").value.trim();
  const genreId   = document.getElementById("buku-genre").value;
  const penulisId = document.getElementById("buku-penulis").value;
  const tahun     = document.getElementById("buku-tahun").value;
  const stok      = document.getElementById("buku-stok").value;
  const sinopsis  = document.getElementById("buku-sinopsis").value.trim();
  const fileInput = document.getElementById("buku-cover-file");
  const errEl     = document.getElementById("buku-error");

  if (!judul || !genreId || !penulisId || stok === "") {
    errEl.textContent = "Judul, Genre, Penulis, dan Stok wajib diisi.";
    errEl.classList.remove("hidden");
    return;
  }

  // Pakai FormData karena ada kemungkinan upload file gambar
  const formData = new FormData();
  formData.append("judul", judul);
  formData.append("genre_id", genreId);
  formData.append("penulis_id", penulisId);
  formData.append("tahun_terbit", tahun);
  formData.append("stok", stok);
  formData.append("sinopsis", sinopsis);

  if (fileInput.files && fileInput.files[0]) {
    formData.append("cover", fileInput.files[0]);
  }

  // CREATE → POST /buku
  // EDIT   → POST /buku/{id}  (route khusus spoof-PUT, lihat catatan di Routes.php)
  const url = id ? `${BASE_URL}/buku/${id}` : `${BASE_URL}/buku`;

  try {
    const res  = await fetch(url, {
      method: "POST",
      headers: authHeadersFile(),
      body: formData,
    });
    const json = await res.json();

    if (res.ok || json.status === 200 || json.status === 201) {
      tutupModalBuku();
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      bukuPage().then((html) => (content.innerHTML = html));
    } else {
      errEl.textContent = json.message || "Gagal menyimpan data.";
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    errEl.textContent = "Terjadi kesalahan: " + err.message;
    errEl.classList.remove("hidden");
  }
}

async function hapusBuku(id) {
  if (!confirm("Yakin ingin menghapus buku ini?")) return;

  try {
    const res  = await fetch(`${BASE_URL}/buku/${id}`, { method: "DELETE", headers: authHeaders() });
    const json = await res.json();

    if (res.ok || json.status === 200) {
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      bukuPage().then((html) => (content.innerHTML = html));
    } else {
      alert(json.message || "Gagal menghapus buku.");
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}