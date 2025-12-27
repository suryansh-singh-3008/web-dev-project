document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) {
    document.getElementById("errorMessage").textContent = result.message;
    document.getElementById("errorMessage").style.display = "block";
    return;
  }

  localStorage.setItem("token", result.token);

  if (result.role === "landowner") {
    window.location.href = "landowner.html";
  } else {
    window.location.href = "car-owners.html";
  }
});
