// Thin localStorage wrapper for the one UI preference this app keeps:
// which theme you last picked. Nothing here is ever sent anywhere — it's
// just for remembering your choice on your next visit.

const THEME_KEY = "subtracker.theme.v1";

function loadTheme() {
  return localStorage.getItem(THEME_KEY);
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
