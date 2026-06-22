function loginPage() {
  return `
    <div class="flex justify-center items-center h-screen">

      <div class="bg-white p-8 rounded-2xl shadow-xl w-80 border border-[#E8D5C4]">

        <h1 class="text-2xl font-bold text-center mb-4 text-[#6F4E37]">
          🧸 Login
        </h1>

        <input id="username" class="w-full p-2 border rounded mb-3" placeholder="Email">
        <input id="password" type="password" class="w-full p-2 border rounded mb-3" placeholder="Password">

        <button onclick="doLogin()" class="w-full bg-[#6F4E37] text-white p-2 rounded-xl">
          Login
        </button>

        <p id="error" class="text-red-500 text-sm mt-2"></p>

      </div>

    </div>
  `;
}

async function doLogin() {
  const emailEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");

  if (!emailEl || !passwordEl) return;

  const res = await fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailEl.value,
      password: passwordEl.value,
    }),
  });

  const data = await res.json();

  if (data.status === 200) {
    localStorage.setItem("login", "1");
    localStorage.setItem("token", data.data.token);
    showPage("dashboard"); // ← langsung panggil saja, tidak perlu clear dulu
  } else {
    document.getElementById("error").innerText = data.message || "Login gagal";
  }
}