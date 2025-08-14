function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "" : "dark";
}

// Example: attach to a button
document.getElementById('theme-toggle').onclick = toggleTheme;
// ...existing code...

 const themeToggle = document.getElementById('theme-toggle');
      function updateThemeIcon() {
        const isDark = document.documentElement.dataset.theme === "dark";
        themeToggle.textContent = isDark ? "☀️" : "🌙";
      }
      function toggleTheme() {
        const html = document.documentElement;
        html.dataset.theme = html.dataset.theme === "dark" ? "" : "dark";
        updateThemeIcon();
      }
      themeToggle.onclick = toggleTheme;
      // Set correct icon on load
      updateThemeIcon();