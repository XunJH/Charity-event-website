document.addEventListener("DOMContentLoaded", async () => {
  const formEl = document.getElementById("event-search-form");
  const categorySelectEl = document.getElementById("filter-category");
  const resultsEl = document.getElementById("search-results");
  const countEl = document.getElementById("results-count");
  const clearBtn = document.getElementById("clear-filters");
  const dateInputEl = document.getElementById("filter-date");

  dateInputEl.min = new Date().toISOString().split("T")[0];

  async function loadCategories() {
    try {
      const categories = await CharityCommon.fetchApi("/categories");
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.category_id;
        option.textContent = cat.category_name;
        categorySelectEl.appendChild(option);
      });
    } catch (err) {
      CharityCommon.showErrorMsg("Classification loading failed. The filtering function may be restricted");
    }
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);
    const params = Object.fromEntries(formData.entries());

    resultsEl.innerHTML = `
      <div class="loading-state">
        <i class="fa fa-spinner fa-spin"></i>
        <p>Searching for activities...</p>
      </div>
    `;

    try {
      const results = await CharityCommon.fetchApi("/events/search", params);
      countEl.textContent = `Find ${results.length} activities that meet the requirements`;

      if (results.length === 0) {
        resultsEl.innerHTML = `
          <div class="empty-state">
            <i class="fa fa-search"></i>
            <p>No activities meeting the criteria were found. Please adjust the filtering conditions</p>
          </div>
        `;
        return;
      }

      resultsEl.innerHTML = results.map(event => `
        <div class="event-card">
          <img src="${CharityCommon.getSafeImageUrl(event.image_url)}" alt="${event.title}" class="event-card-img">
          <div class="event-card-content">
            <h3 class="event-card-title">
              <a href="event-detail.html?id=${event.event_id}">${event.title}</a>
            </h3>
            <div class="event-card-meta">
              <span><i class="fa fa-tags"></i> ${event.category_name}</span>
              <span><i class="fa fa-calendar"></i> ${CharityCommon.formatDate(event.event_date)}</span>
              <span><i class="fa fa-map-marker"></i> ${event.location}</span>
            </div>
            <p class="event-card-desc">${event.description}</p>
            <div class="event-card-org">sponsor：${event.org_name}</div>
            <div class="event-card-price">
              ticket rates：${event.ticket_price > 0 ? `¥${event.ticket_price.toFixed(2)}` : "free of charge"}
            </div>
            <a href="event-detail.html?id=${event.event_id}" class="btn btn-view-detail">view details</a>
          </div>
        </div>
      `).join("");
    } catch (err) {
      resultsEl.innerHTML = `
        <div class="error-state">
          <i class="fa fa-exclamation-triangle"></i>
          <p>Search failed. Please try again later</p>
        </div>
      `;
    }
  });

  clearBtn.addEventListener("click", () => {
    formEl.reset();
    resultsEl.innerHTML = `
      <div class="empty-state">
        <i class="fa fa-search-plus"></i>
        <p>There are no filtering conditions at present. Please fill in the form above to conduct the search</p>
      </div>
    `;
    countEl.textContent = "Please select the filtering criteria";
  });

  await loadCategories();
});