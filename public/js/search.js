document.addEventListener("DOMContentLoaded", async () => {
  const formEl = document.getElementById("event-search-form");
  const categorySelectEl = document.getElementById("filter-category");
  const resultsEl = document.getElementById("search-results");
  const countEl = document.getElementById("results-count");
  const clearBtn = document.getElementById("clear-filters");
  const dateInputEl = document.getElementById("filter-date");

  // 设置日期最小值为今天
  dateInputEl.min = new Date().toISOString().split("T")[0];

  // 加载活动分类
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
      CharityCommon.showErrorMsg("分类加载失败，筛选功能可能受限");
    }
  }

  // 执行搜索
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);
    const params = Object.fromEntries(formData.entries());

    resultsEl.innerHTML = `
      <div class="loading-state">
        <i class="fa fa-spinner fa-spin"></i>
        <p>正在搜索活动...</p>
      </div>
    `;

    try {
      const results = await CharityCommon.fetchApi("/events/search", params);
      countEl.textContent = `找到 ${results.length} 个符合条件的活动`;

      if (results.length === 0) {
        resultsEl.innerHTML = `
          <div class="empty-state">
            <i class="fa fa-search"></i>
            <p>未找到符合条件的活动，请调整筛选条件</p>
          </div>
        `;
        return;
      }

      // 渲染搜索结果
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
            <div class="event-card-org">主办方：${event.org_name}</div>
            <div class="event-card-price">
              票价：${event.ticket_price > 0 ? `¥${event.ticket_price.toFixed(2)}` : "免费"}
            </div>
            <a href="event-detail.html?id=${event.event_id}" class="btn btn-view-detail">查看详情</a>
          </div>
        </div>
      `).join("");
    } catch (err) {
      resultsEl.innerHTML = `
        <div class="error-state">
          <i class="fa fa-exclamation-triangle"></i>
          <p>搜索失败，请稍后重试</p>
        </div>
      `;
    }
  });

  // 清除筛选
  clearBtn.addEventListener("click", () => {
    formEl.reset();
    resultsEl.innerHTML = `
      <div class="empty-state">
        <i class="fa fa-search-plus"></i>
        <p>暂无筛选条件，请填写上方表单进行搜索</p>
      </div>
    `;
    countEl.textContent = "请选择筛选条件并点击“搜索活动”";
  });

  // 初始化加载分类
  await loadCategories();
});