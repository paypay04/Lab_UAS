// ── PENULIS PAGE ────────────────────────────────────────────────────
async function penulisPage() {
  try {
    const res = await fetch(`${BASE_URL}/penulis`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    const data = json.data || [];

    let rows = "";
    data.forEach((p) => {
      rows += `
        <tr class="hover:bg-[#FFF1E6] border-b border-[#E8D5C4]">
          <td class="p-3">${p.id}</td>
          <td class="p-3 font-medium">${p.nama}</td>
          <td class="p-3">${p.penerbit ?? "-"}</td>
          <td class="p-3">${p.email ?? "-"}</td>
          <td class="p-3 flex gap-2">
            <button onclick="editPenulis(${p.id}, '${(p.nama ?? "").replace(/'/g, "\\'")}', '${(p.penerbit ?? "").replace(/'/g, "\\'")}', '${(p.email ?? "").replace(/'/g, "\\'")}')"
              class="bg-[#D2B48C] hover:bg-[#C4A882] text-[#5C4033] px-3 py-1 rounded-lg text-sm font-medium">
              ✏️ Edit
            </button>
            <button onclick="hapusPenulis(${p.id})"
              class="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm font-medium">
              🗑️ Hapus
            </button>
          </td>
        </tr>`;
    });

    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Data Penulis ✍️</h1>
        <button onclick="tambahPenulis()"
          class="bg-[#6F4E37] hover:bg-[#5C4033] text-white px-4 py-2 rounded-xl font-medium">
          + Tambah Penulis
        </button>
      </div>

      <div class="bg-white rounded-xl shadow border border-[#E8D5C4] overflow-hidden">
        <table class="w-full">
          <thead class="bg-[#D2B48C] text-[#5C4033]">
            <tr>
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Nama</th>
              <th class="p-3 text-left">Penerbit</th>
              <th class="p-3 text-left">Email</th>
              <th class="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="5" class="p-4 text-center text-gray-400">Belum ada data penulis.</td></tr>'}</tbody>
        </table>
      </div>

      <!-- MODAL -->
      <div id="modal-penulis" class="hidden fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
          <h2 id="modal-penulis-title" class="text-xl font-bold mb-4 text-[#5C4033]">Tambah Penulis</h2>
          <input type="hidden" id="penulis-id">

          <label class="block text-sm font-medium mb-1">Nama <span class="text-red-500">*</span></label>
          <input id="penulis-nama" type="text" placeholder="Nama penulis..."
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Penerbit</label>
          <input id="penulis-penerbit" type="text" placeholder="Nama penerbit..."
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Email</label>
          <input id="penulis-email" type="email" placeholder="email@contoh.com"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <p id="penulis-error" class="text-red-500 text-sm mb-3 hidden"></p>

          <div class="flex gap-3 justify-end">
            <button onclick="tutupModalPenulis()"
              class="px-4 py-2 rounded-xl border border-[#E8D5C4] hover:bg-gray-50">Batal</button>
            <button onclick="simpanPenulis()"
              class="px-4 py-2 rounded-xl bg-[#6F4E37] text-white hover:bg-[#5C4033]">Simpan</button>
          </div>
        </div>
      </div>`;
  } catch (err) {
    return `<div class="bg-red-100 text-red-700 p-4 rounded-xl">❌ Gagal memuat penulis. ${err.message}</div>`;
  }
}

function tambahPenulis() {
  document.getElementById("modal-penulis-title").textContent = "Tambah Penulis";
  document.getElementById("penulis-id").value = "";
  document.getElementById("penulis-nama").value = "";
  document.getElementById("penulis-penerbit").value = "";
  document.getElementById("penulis-email").value = "";
  document.getElementById("penulis-error").classList.add("hidden");
  document.getElementById("modal-penulis").classList.remove("hidden");
}

function editPenulis(id, nama, penerbit, email) {
  document.getElementById("modal-penulis-title").textContent = "Edit Penulis";
  document.getElementById("penulis-id").value = id;
  document.getElementById("penulis-nama").value = nama;
  document.getElementById("penulis-penerbit").value = penerbit;
  document.getElementById("penulis-email").value = email;
  document.getElementById("penulis-error").classList.add("hidden");
  document.getElementById("modal-penulis").classList.remove("hidden");
}

function tutupModalPenulis() {
  document.getElementById("modal-penulis").classList.add("hidden");
}

async function simpanPenulis() {
  const id       = document.getElementById("penulis-id").value;
  const nama     = document.getElementById("penulis-nama").value.trim();
  const penerbit = document.getElementById("penulis-penerbit").value.trim();
  const email    = document.getElementById("penulis-email").value.trim();
  const errEl    = document.getElementById("penulis-error");

  if (!nama) {
    errEl.textContent = "Nama penulis wajib diisi.";
    errEl.classList.remove("hidden");
    return;
  }

  const body   = { nama, penerbit, email };
  const url    = id ? `${BASE_URL}/penulis/${id}` : `${BASE_URL}/penulis`;
  const method = id ? "PUT" : "POST";

  try {
    const res  = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
    const json = await res.json();

    if (res.ok || json.status === 200 || json.status === 201) {
      tutupModalPenulis();
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      penulisPage().then((html) => (content.innerHTML = html));
    } else {
      errEl.textContent = json.message || "Gagal menyimpan data.";
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    errEl.textContent = "Terjadi kesalahan: " + err.message;
    errEl.classList.remove("hidden");
  }
}

async function hapusPenulis(id) {
  if (!confirm("Yakin ingin menghapus penulis ini?")) return;

  try {
    const res  = await fetch(`${BASE_URL}/penulis/${id}`, { method: "DELETE", headers: authHeaders() });
    const json = await res.json();

    if (res.ok || json.status === 200) {
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      penulisPage().then((html) => (content.innerHTML = html));
    } else {
      alert(json.message || "Gagal menghapus penulis.");
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}