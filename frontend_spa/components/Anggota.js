// ── ANGGOTA PAGE ────────────────────────────────────────────────────
async function anggotaPage() {
  try {
    const res  = await fetch(`${BASE_URL}/anggota`, { headers: authHeaders() });
    const json = await res.json();
    const data = json.data || [];

    let rows = "";
    data.forEach((a) => {
      rows += `
        <tr class="hover:bg-[#FFF1E6] border-b border-[#E8D5C4]">
          <td class="p-3">${a.id}</td>
          <td class="p-3 font-medium">${a.nama}</td>
          <td class="p-3">${a.email}</td>
          <td class="p-3">${a.no_hp ?? "-"}</td>
          <td class="p-3">${a.alamat ?? "-"}</td>
          <td class="p-3 flex gap-2">
            <button onclick="editAnggota(${a.id}, '${(a.nama ?? "").replace(/'/g, "\\'")}', '${(a.email ?? "").replace(/'/g, "\\'")}', '${(a.no_hp ?? "").replace(/'/g, "\\'")}', '${(a.alamat ?? "").replace(/'/g, "\\'")}')"
              class="bg-[#D2B48C] hover:bg-[#C4A882] text-[#5C4033] px-3 py-1 rounded-lg text-sm font-medium">
              ✏️ Edit
            </button>
            <button onclick="hapusAnggota(${a.id})"
              class="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm font-medium">
              🗑️ Hapus
            </button>
          </td>
        </tr>`;
    });

    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Data Anggota 👥</h1>
        <button onclick="tambahAnggota()"
          class="bg-[#6F4E37] hover:bg-[#5C4033] text-white px-4 py-2 rounded-xl font-medium">
          + Tambah Anggota
        </button>
      </div>

      <div class="bg-white rounded-xl shadow border border-[#E8D5C4] overflow-hidden">
        <table class="w-full">
          <thead class="bg-[#D2B48C] text-[#5C4033]">
            <tr>
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Nama</th>
              <th class="p-3 text-left">Email</th>
              <th class="p-3 text-left">No. HP</th>
              <th class="p-3 text-left">Alamat</th>
              <th class="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="6" class="p-4 text-center text-gray-400">Belum ada data anggota.</td></tr>'}</tbody>
        </table>
      </div>

      <!-- MODAL -->
      <div id="modal-anggota" class="hidden fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
          <h2 id="modal-anggota-title" class="text-xl font-bold mb-4 text-[#5C4033]">Tambah Anggota</h2>
          <input type="hidden" id="anggota-id">

          <label class="block text-sm font-medium mb-1">Nama <span class="text-red-500">*</span></label>
          <input id="anggota-nama" type="text" placeholder="Nama lengkap..."
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Email <span class="text-red-500">*</span></label>
          <input id="anggota-email" type="email" placeholder="email@contoh.com"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">No. HP</label>
          <input id="anggota-nohp" type="text" placeholder="08xxxxxxxxxx"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Alamat</label>
          <textarea id="anggota-alamat" placeholder="Alamat lengkap..." rows="2"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"></textarea>

          <p id="anggota-error" class="text-red-500 text-sm mb-3 hidden"></p>

          <div class="flex gap-3 justify-end">
            <button onclick="tutupModalAnggota()"
              class="px-4 py-2 rounded-xl border border-[#E8D5C4] hover:bg-gray-50">Batal</button>
            <button onclick="simpanAnggota()"
              class="px-4 py-2 rounded-xl bg-[#6F4E37] text-white hover:bg-[#5C4033]">Simpan</button>
          </div>
        </div>
      </div>`;
  } catch (err) {
    return `<div class="bg-red-100 text-red-700 p-4 rounded-xl">❌ Gagal memuat anggota. ${err.message}</div>`;
  }
}

function tambahAnggota() {
  document.getElementById("modal-anggota-title").textContent = "Tambah Anggota";
  document.getElementById("anggota-id").value    = "";
  document.getElementById("anggota-nama").value  = "";
  document.getElementById("anggota-email").value = "";
  document.getElementById("anggota-nohp").value  = "";
  document.getElementById("anggota-alamat").value = "";
  document.getElementById("anggota-error").classList.add("hidden");
  document.getElementById("modal-anggota").classList.remove("hidden");
}

function editAnggota(id, nama, email, nohp, alamat) {
  document.getElementById("modal-anggota-title").textContent = "Edit Anggota";
  document.getElementById("anggota-id").value    = id;
  document.getElementById("anggota-nama").value  = nama;
  document.getElementById("anggota-email").value = email;
  document.getElementById("anggota-nohp").value  = nohp;
  document.getElementById("anggota-alamat").value = alamat;
  document.getElementById("anggota-error").classList.add("hidden");
  document.getElementById("modal-anggota").classList.remove("hidden");
}

function tutupModalAnggota() {
  document.getElementById("modal-anggota").classList.add("hidden");
}

async function simpanAnggota() {
  const id    = document.getElementById("anggota-id").value;
  const nama  = document.getElementById("anggota-nama").value.trim();
  const email = document.getElementById("anggota-email").value.trim();
  const nohp  = document.getElementById("anggota-nohp").value.trim();
  const alamat = document.getElementById("anggota-alamat").value.trim();
  const errEl = document.getElementById("anggota-error");

  if (!nama || !email) {
    errEl.textContent = "Nama dan Email wajib diisi.";
    errEl.classList.remove("hidden");
    return;
  }

  const body   = { nama, email, no_hp: nohp, alamat };
  const url    = id ? `${BASE_URL}/anggota/${id}` : `${BASE_URL}/anggota`;
  const method = id ? "PUT" : "POST";

  try {
    const res  = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
    const json = await res.json();

    if (res.ok || json.status === 200 || json.status === 201) {
      tutupModalAnggota();
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      anggotaPage().then((html) => (content.innerHTML = html));
    } else {
      errEl.textContent = json.message || "Gagal menyimpan data.";
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    errEl.textContent = "Terjadi kesalahan: " + err.message;
    errEl.classList.remove("hidden");
  }
}

async function hapusAnggota(id) {
  if (!confirm("Yakin ingin menghapus anggota ini?")) return;

  try {
    const res  = await fetch(`${BASE_URL}/anggota/${id}`, { method: "DELETE", headers: authHeaders() });
    const json = await res.json();

    if (res.ok || json.status === 200) {
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      anggotaPage().then((html) => (content.innerHTML = html));
    } else {
      alert(json.message || "Gagal menghapus anggota.");
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}