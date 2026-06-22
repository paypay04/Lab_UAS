// ── PEMINJAMAN PAGE ─────────────────────────────────────────────────
async function peminjamanPage() {
  try {
    const [resPinjam, resBuku, resAnggota] = await Promise.all([
      fetch(`${BASE_URL}/peminjaman`, { headers: authHeaders() }),
      fetch(`${BASE_URL}/buku`,       { headers: authHeaders() }),
      fetch(`${BASE_URL}/anggota`,    { headers: authHeaders() }),
    ]);

    const dataPinjam  = (await resPinjam.json()).data  || [];
    const dataBuku    = (await resBuku.json()).data    || [];
    const dataAnggota = (await resAnggota.json()).data || [];

    const statusBadge = (s) => {
      if (s === "dipinjam")    return `<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">Dipinjam</span>`;
      if (s === "dikembalikan") return `<span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Dikembalikan</span>`;
      if (s === "terlambat")   return `<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">Terlambat</span>`;
      return `<span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">${s}</span>`;
    };

    let rows = "";
    dataPinjam.forEach((p) => {
      rows += `
        <tr class="hover:bg-[#FFF1E6] border-b border-[#E8D5C4]">
          <td class="p-3">${p.id}</td>
          <td class="p-3 font-medium">${p.nama_anggota ?? "-"}</td>
          <td class="p-3">${p.judul_buku ?? "-"}</td>
          <td class="p-3">${p.tanggal_pinjam ?? "-"}</td>
          <td class="p-3">${p.tanggal_kembali ?? "-"}</td>
          <td class="p-3">${statusBadge(p.status)}</td>
          <td class="p-3 flex gap-2">
            <button onclick="editPeminjaman(${p.id}, ${p.anggota_id}, ${p.buku_id}, '${p.tanggal_pinjam ?? ""}', '${p.tanggal_kembali ?? ""}', '${p.status ?? "dipinjam"}')"
              class="bg-[#D2B48C] hover:bg-[#C4A882] text-[#5C4033] px-3 py-1 rounded-lg text-sm font-medium">
              ✏️ Edit
            </button>
            <button onclick="hapusPeminjaman(${p.id})"
              class="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm font-medium">
              🗑️ Hapus
            </button>
          </td>
        </tr>`;
    });

    // Opsi dropdown anggota & buku
    const opsiAnggota = dataAnggota.map((a) => `<option value="${a.id}">${a.nama}</option>`).join("");
    const opsiBuku    = dataBuku.map((b) => `<option value="${b.id}">${b.judul}</option>`).join("");

    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Data Peminjaman 📋</h1>
        <button onclick="tambahPeminjaman()"
          class="bg-[#6F4E37] hover:bg-[#5C4033] text-white px-4 py-2 rounded-xl font-medium">
          + Tambah Peminjaman
        </button>
      </div>

      <div class="bg-white rounded-xl shadow border border-[#E8D5C4] overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#D2B48C] text-[#5C4033]">
            <tr>
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Anggota</th>
              <th class="p-3 text-left">Buku</th>
              <th class="p-3 text-left">Tgl Pinjam</th>
              <th class="p-3 text-left">Tgl Kembali</th>
              <th class="p-3 text-left">Status</th>
              <th class="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="7" class="p-4 text-center text-gray-400">Belum ada data peminjaman.</td></tr>'}</tbody>
        </table>
      </div>

      <!-- MODAL -->
      <div id="modal-peminjaman" class="hidden fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
          <h2 id="modal-peminjaman-title" class="text-xl font-bold mb-4 text-[#5C4033]">Tambah Peminjaman</h2>
          <input type="hidden" id="peminjaman-id">

          <label class="block text-sm font-medium mb-1">Anggota <span class="text-red-500">*</span></label>
          <select id="peminjaman-anggota"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">
            <option value="">-- Pilih Anggota --</option>
            ${opsiAnggota}
          </select>

          <label class="block text-sm font-medium mb-1">Buku <span class="text-red-500">*</span></label>
          <select id="peminjaman-buku"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">
            <option value="">-- Pilih Buku --</option>
            ${opsiBuku}
          </select>

          <label class="block text-sm font-medium mb-1">Tanggal Pinjam <span class="text-red-500">*</span></label>
          <input id="peminjaman-tglpinjam" type="date"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Tanggal Kembali</label>
          <input id="peminjaman-tglkembali" type="date"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">

          <label class="block text-sm font-medium mb-1">Status</label>
          <select id="peminjaman-status"
            class="w-full border border-[#E8D5C4] rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]">
            <option value="dipinjam">Dipinjam</option>
            <option value="dikembalikan">Dikembalikan</option>
            <option value="terlambat">Terlambat</option>
          </select>

          <p id="peminjaman-error" class="text-red-500 text-sm mb-3 hidden"></p>

          <div class="flex gap-3 justify-end">
            <button onclick="tutupModalPeminjaman()"
              class="px-4 py-2 rounded-xl border border-[#E8D5C4] hover:bg-gray-50">Batal</button>
            <button onclick="simpanPeminjaman()"
              class="px-4 py-2 rounded-xl bg-[#6F4E37] text-white hover:bg-[#5C4033]">Simpan</button>
          </div>
        </div>
      </div>`;
  } catch (err) {
    return `<div class="bg-red-100 text-red-700 p-4 rounded-xl">❌ Gagal memuat peminjaman. ${err.message}</div>`;
  }
}

function tambahPeminjaman() {
  document.getElementById("modal-peminjaman-title").textContent = "Tambah Peminjaman";
  document.getElementById("peminjaman-id").value         = "";
  document.getElementById("peminjaman-anggota").value    = "";
  document.getElementById("peminjaman-buku").value       = "";
  document.getElementById("peminjaman-tglpinjam").value  = new Date().toISOString().split("T")[0];
  document.getElementById("peminjaman-tglkembali").value = "";
  document.getElementById("peminjaman-status").value     = "dipinjam";
  document.getElementById("peminjaman-error").classList.add("hidden");
  document.getElementById("modal-peminjaman").classList.remove("hidden");
}

function editPeminjaman(id, anggotaId, bukuId, tglPinjam, tglKembali, status) {
  document.getElementById("modal-peminjaman-title").textContent = "Edit Peminjaman";
  document.getElementById("peminjaman-id").value         = id;
  document.getElementById("peminjaman-anggota").value    = anggotaId;
  document.getElementById("peminjaman-buku").value       = bukuId;
  document.getElementById("peminjaman-tglpinjam").value  = tglPinjam;
  document.getElementById("peminjaman-tglkembali").value = tglKembali;
  document.getElementById("peminjaman-status").value     = status;
  document.getElementById("peminjaman-error").classList.add("hidden");
  document.getElementById("modal-peminjaman").classList.remove("hidden");
}

function tutupModalPeminjaman() {
  document.getElementById("modal-peminjaman").classList.add("hidden");
}

async function simpanPeminjaman() {
  const id         = document.getElementById("peminjaman-id").value;
  const anggotaId  = document.getElementById("peminjaman-anggota").value;
  const bukuId     = document.getElementById("peminjaman-buku").value;
  const tglPinjam  = document.getElementById("peminjaman-tglpinjam").value;
  const tglKembali = document.getElementById("peminjaman-tglkembali").value;
  const status     = document.getElementById("peminjaman-status").value;
  const errEl      = document.getElementById("peminjaman-error");

  if (!anggotaId || !bukuId || !tglPinjam) {
    errEl.textContent = "Anggota, Buku, dan Tanggal Pinjam wajib diisi.";
    errEl.classList.remove("hidden");
    return;
  }

  const body = {
    anggota_id:      parseInt(anggotaId),
    buku_id:         parseInt(bukuId),
    tanggal_pinjam:  tglPinjam,
    tanggal_kembali: tglKembali || null,
    status,
  };

  const url    = id ? `${BASE_URL}/peminjaman/${id}` : `${BASE_URL}/peminjaman`;
  const method = id ? "PUT" : "POST";

  try {
    const res  = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
    const json = await res.json();

    if (res.ok || json.status === 200 || json.status === 201) {
      tutupModalPeminjaman();
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      peminjamanPage().then((html) => (content.innerHTML = html));
    } else {
      errEl.textContent = json.message || "Gagal menyimpan data.";
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    errEl.textContent = "Terjadi kesalahan: " + err.message;
    errEl.classList.remove("hidden");
  }
}

async function hapusPeminjaman(id) {
  if (!confirm("Yakin ingin menghapus data peminjaman ini?")) return;

  try {
    const res  = await fetch(`${BASE_URL}/peminjaman/${id}`, { method: "DELETE", headers: authHeaders() });
    const json = await res.json();

    if (res.ok || json.status === 200) {
      const content = document.getElementById("content");
      content.innerHTML = `<p class="text-gray-400">⏳ Memuat ulang...</p>`;
      peminjamanPage().then((html) => (content.innerHTML = html));
    } else {
      alert(json.message || "Gagal menghapus peminjaman.");
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
}