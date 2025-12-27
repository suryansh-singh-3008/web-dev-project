document.getElementById("signupForm").addEventListener("submit", async e => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password,
    role: document.getElementById("role").value === "landowner"
      ? "landowner"
      : "carowner"
  };

  const res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.message);
    return;
  }

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
});
