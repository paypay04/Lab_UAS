async function dashboardPage() {
  try {
    const res  = await fetch(`${BASE_URL}/stats`);
    const json = await res.json();
    const d    = json.data || {};

    return `
      <!-- HEADER -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#5C4033]">Selamat Datang! 🧸</h1>
        <p class="text-[#A0826D] mt-1">Berikut ringkasan data E-Library Teddy Bear hari ini.</p>
      </div>

      <!-- STAT CARDS -->
      <div class="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-3">

        <div class="bg-white rounded-2xl shadow-sm border border-[#E8D5C4] p-5 flex items-center gap-4 hover:shadow-md transition">
          <div class="text-4xl">📚</div>
          <div>
            <p class="text-xs text-[#A0826D] font-medium uppercase tracking-wide">Total Buku</p>
            <p class="text-3xl font-bold text-[#5C4033]">${d.total_buku ?? 0}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-[#E8D5C4] p-5 flex items-center gap-4 hover:shadow-md transition">
          <div class="text-4xl">👥</div>
          <div>
            <p class="text-xs text-[#A0826D] font-medium uppercase tracking-wide">Total Anggota</p>
            <p class="text-3xl font-bold text-[#5C4033]">${d.total_anggota ?? 0}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-[#E8D5C4] p-5 flex items-center gap-4 hover:shadow-md transition">
          <div class="text-4xl">✍️</div>
          <div>
            <p class="text-xs text-[#A0826D] font-medium uppercase tracking-wide">Total Penulis</p>
            <p class="text-3xl font-bold text-[#5C4033]">${d.total_penulis ?? 0}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-[#E8D5C4] p-5 flex items-center gap-4 hover:shadow-md transition">
          <div class="text-4xl">🏷️</div>
          <div>
            <p class="text-xs text-[#A0826D] font-medium uppercase tracking-wide">Total Genre</p>
            <p class="text-3xl font-bold text-[#5C4033]">${d.total_genre ?? 0}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-[#E8D5C4] p-5 flex items-center gap-4 hover:shadow-md transition">
          <div class="text-4xl">📋</div>
          <div>
            <p class="text-xs text-[#A0826D] font-medium uppercase tracking-wide">Total Peminjaman</p>
            <p class="text-3xl font-bold text-[#5C4033]">${d.total_peminjaman ?? 0}</p>
          </div>
        </div>

        <div class="bg-[#6F4E37] rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition">
          <div class="text-4xl">⏳</div>
          <div>
            <p class="text-xs text-[#D2B48C] font-medium uppercase tracking-wide">Sedang Dipinjam</p>
            <p class="text-3xl font-bold text-white">${d.sedang_dipinjam ?? 0}</p>
          </div>
        </div>

      </div>

      <!-- TEDDY BEAR BANNER -->
      <div class="bg-white rounded-2xl border border-[#E8D5C4] shadow-sm p-6 flex items-center gap-6">
        
        <!-- SVG Teddy Bear -->
        <div class="shrink-0">
          <svg width="100" height="110" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
            <!-- Telinga kiri -->
            <circle cx="22" cy="22" r="13" fill="#8B6B4A"/>
            <circle cx="22" cy="22" r="8"  fill="#C49A6C"/>
            <!-- Telinga kanan -->
            <circle cx="78" cy="22" r="13" fill="#8B6B4A"/>
            <circle cx="78" cy="22" r="8"  fill="#C49A6C"/>
            <!-- Kepala -->
            <circle cx="50" cy="38" r="28" fill="#A0724A"/>
            <!-- Muka -->
            <circle cx="50" cy="43" r="14" fill="#C49A6C"/>
            <!-- Mata kiri -->
            <circle cx="41" cy="33" r="4" fill="#3E2723"/>
            <circle cx="42" cy="32" r="1.5" fill="white"/>
            <!-- Mata kanan -->
            <circle cx="59" cy="33" r="4" fill="#3E2723"/>
            <circle cx="60" cy="32" r="1.5" fill="white"/>
            <!-- Hidung -->
            <ellipse cx="50" cy="42" rx="4" ry="3" fill="#3E2723"/>
            <!-- Mulut -->
            <path d="M44 48 Q50 54 56 48" stroke="#3E2723" stroke-width="2" fill="none" stroke-linecap="round"/>
            <!-- Badan -->
            <ellipse cx="50" cy="85" rx="22" ry="20" fill="#A0724A"/>
            <!-- Perut -->
            <ellipse cx="50" cy="87" rx="13" ry="12" fill="#C49A6C"/>
            <!-- Tangan kiri -->
            <ellipse cx="22" cy="78" rx="9" ry="7" fill="#A0724A" transform="rotate(-20 22 78)"/>
            <!-- Tangan kanan -->
            <ellipse cx="78" cy="78" rx="9" ry="7" fill="#A0724A" transform="rotate(20 78 78)"/>
            <!-- Kaki kiri -->
            <ellipse cx="36" cy="103" rx="10" ry="7" fill="#A0724A"/>
            <!-- Kaki kanan -->
            <ellipse cx="64" cy="103" rx="10" ry="7" fill="#A0724A"/>
          </svg>
        </div>

        <div>
          <h2 class="text-xl font-bold text-[#5C4033] mb-1">Halo, Admin! 👋</h2>
          <p class="text-[#A0826D] text-sm leading-relaxed">
            Kelola koleksi buku, data anggota, dan peminjaman dengan mudah.<br>
            Teddy Bear siap menemani aktivitasmu hari ini! 🐻
          </p>
          <div class="mt-3 flex gap-2 flex-wrap">
            <button onclick="showPage('buku')"     class="bg-[#FFF1E6] text-[#6F4E37] border border-[#E8D5C4] px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-[#E8D5C4] transition">📚 Kelola Buku</button>
            <button onclick="showPage('anggota')"  class="bg-[#FFF1E6] text-[#6F4E37] border border-[#E8D5C4] px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-[#E8D5C4] transition">👥 Kelola Anggota</button>
            <button onclick="showPage('peminjaman')" class="bg-[#FFF1E6] text-[#6F4E37] border border-[#E8D5C4] px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-[#E8D5C4] transition">📋 Kelola Peminjaman</button>
          </div>
        </div>

      </div>
    `;
  } catch (err) {
    return `
      <h1 class="text-3xl font-bold mb-6">Dashboard 🧸</h1>
      <div class="bg-red-100 text-red-700 p-4 rounded-xl">❌ Gagal memuat data. ${err.message}</div>
    `;
  }
}