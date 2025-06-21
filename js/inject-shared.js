document.addEventListener("DOMContentLoaded", () => {
  // Anzahl der Verzeichnistiefen ermitteln
  const pathDepth = location.pathname.split("/").filter(Boolean).length;
  const base = "../".repeat(pathDepth - 1); // z. B. bei /modules/safety/warning.html → "../../"

  fetch(`${base}includes/header.html`)
    .then(res => res.text())
    .then(html => {
      document.querySelector(".header-placeholder").innerHTML = html;

      // Benutzer-Daten einsetzen
      const user = JSON.parse(localStorage.getItem("avoUserData")) || {};
      document.getElementById("greeting").textContent = "Hallo " + (user.nickname || "Käfer");
      if (user.avatar) {
        document.getElementById("header-avatar").src = user.avatar;
      }
    });

  fetch(`${base}includes/footer.html`)
    .then(res => res.text())
    .then(html => {
      document.querySelector(".footer-placeholder").innerHTML = html;
    });
});