const BASE_API_URL = "http://localhost:3001/api";
const EMPTY_IMAGE_URL = "/images/default-event.jpg";

async function fetchApi(url, params = {}) {
  try {
    const validParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== undefined)
    );
    const queryString = new URLSearchParams(validParams).toString();
    const requestUrl = queryString 
      ? `${BASE_API_URL}${url}?${queryString}` 
      : `${BASE_API_URL}${url}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "API request failed" }));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API request exception:", err);
    showErrorMsg(err.message);
    throw err;
  }
}

function showErrorMsg(message) {
  const errorElement = document.getElementById("error-msg");
  if (!errorElement) return;

  errorElement.innerHTML = `
    <div class="error-alert">
      <i class="error-icon">⚠️</i>
      <span class="error-text">${message}</span>
    </div>
  `;

  setTimeout(() => {
    errorElement.innerHTML = "";
  }, 3000);
}

function renderNavbar() {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  navbarContainer.innerHTML = `
    <nav class="navbar">
      <div class="navbar-container container">
        <a href="index.html" class="navbar-logo">
          Love Charity Event Platform
        </a>
        <ul class="navbar-menu">
          <li class="navbar-item">
            <a href="index.html" class="navbar-link">Home</a>
          </li>
          <li class="navbar-item">
            <a href="search.html" class="navbar-link">Search Events</a>
          </li>
          <li class="navbar-item">
            <a href="javascript:;" class="navbar-link about-link">About Us</a>
          </li>
        </ul>
      </div>
    </nav>
  `;

  const aboutLink = document.querySelector(".about-link");
  aboutLink?.addEventListener("click", () => {
    alert("Love Charity Event Platform: Connecting public welfare organizations with caring people to build a better society!\nContact email: contact@charityplatform.org");
  });
}

function formatDate(isoDateStr) {
  if (!isoDateStr) return "Date not set";
  const date = new Date(isoDateStr);
  
  if (isNaN(date.getTime())) return "Invalid date";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function getSafeImageUrl(imageUrl) {
  return imageUrl && imageUrl.trim() !== "" ? imageUrl : EMPTY_IMAGE_URL;
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  document.body.classList.add("page-loaded");
});

window.CharityCommon = {
  fetchApi,
  showErrorMsg,
  formatDate,
  getSafeImageUrl,
  BASE_API_URL,
  EMPTY_IMAGE_URL
};