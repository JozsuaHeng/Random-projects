// Thin localStorage wrapper for the two UI preferences this app keeps:
// which theme and which display currency you last picked. Nothing here
// is ever sent anywhere — it's just for remembering your choice on your
// next visit.

const THEME_KEY = "subtracker.theme.v1";
const CURRENCY_KEY = "subtracker.currency.v1";

function loadTheme() {
  return localStorage.getItem(THEME_KEY);
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function loadCurrency() {
  return localStorage.getItem(CURRENCY_KEY) || "USD";
}

function saveCurrency(currency) {
  localStorage.setItem(CURRENCY_KEY, currency);
}
