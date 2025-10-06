document.addEventListener("DOMContentLoaded", async () => {
  // 1. 获取 DOM 元素（与 HTML 中 ID 对应）
  const body = document.body;
  const errorMsgEl = document.getElementById("error-msg");
  const loadingStateEl = document.getElementById("loading-state"); // 新增：加载状态元素
  const eventDetailContent = document.getElementById("event-detail-content");
  
  // 详情头部元素
  const eventImgEl = document.getElementById("detail-event-img");
  const eventTitleEl = document.getElementById("detail-event-title");
  const eventCategoryEl = document.getElementById("detail-category");
  const eventDateEl = document.getElementById("detail-date");
  const eventLocationEl = document.getElementById("detail-location");
  
  // 筹款进度元素
  const progressFillEl = document.getElementById("detail-progress-fill");
  const progressPercentEl = document.getElementById("detail-progress-percent");
  const fundsEl = document.getElementById("detail-funds");
  
  // 其他详情元素
  const eventDescEl = document.getElementById("detail-description");

  // 2. 获取 URL 中的活动 ID
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");
  
  if (!eventId) { 
    // 无ID时直接显示错误（补充加载状态隐藏）
    loadingStateEl.style.display = "none";
    body.className = "page-error";
    errorMsgEl.innerHTML = `<i class="fa fa-exclamation-triangle"></i><p>活动 ID 不存在，请返回首页选择活动</p>`;
    return;
  }

  try {
    // 3. 请求活动详情接口（修复可能的重复/api前缀问题）
    console.log(`请求活动 ID: ${eventId} 的详情`);
    // 注意：根据实际后端接口路径调整，若404则去掉多余的/api或补充正确前缀
    const response = await CharityCommon.fetchApi(`/events/${eventId}`); 

    // 4. 数据校验（增强容错性）
    if (!response || typeof response !== "object") {
      throw new Error("接口返回数据格式错误，预期是对象");
    }
    
    // 兼容两种常见接口返回格式：直接返回event对象 或 {data: event}
    const event = response.data ? response.data : response; 
    if (!event || Object.keys(event).length === 0) {
      throw new Error("未找到该活动的详情数据");
    }

    // 5. 处理数据：添加默认值
    const eventData = {
      title: event.title || "未命名活动",
      category: event.category_name || "未分类",
      date: CharityCommon.formatDate(event.event_date) || "日期未确定",
      location: event.location || "地点未确定",
      imageUrl: CharityCommon.getSafeImageUrl(event.image_url) || "./images/default-event.jpg",
      description: event.description || "暂无活动介绍",
      currentFunds: Number(event.current_funds) || 0,
      fundraisingGoal: Number(event.fundraising_goal) || 0
    };

    // 6. 计算筹款进度（避免除以0）
    const progressPercent = eventData.fundraisingGoal > 0 
      ? Math.round((eventData.currentFunds / eventData.fundraisingGoal) * 100) 
      : 0;
    const fundsText = `¥${eventData.currentFunds.toFixed(2)}/¥${eventData.fundraisingGoal.toFixed(2)}`;

    // 7. 动态渲染页面（解决CSP内联样式问题）
    eventImgEl.src = eventData.imageUrl;
    eventImgEl.alt = eventData.title;
    eventTitleEl.textContent = eventData.title;
    eventCategoryEl.textContent = eventData.category;
    eventDateEl.textContent = eventData.date;
    eventLocationEl.textContent = eventData.location;
    eventDescEl.textContent = eventData.description;
    
    // 修复CSP：用CSS类替代直接设置style.width
    // 预先在CSS中定义.progress-0到.progress-100的类（宽度0%到100%）
    progressFillEl.className = `detail-progress-fill progress-${progressPercent}`;
    
    progressPercentEl.textContent = `筹款进度：${progressPercent}%`;
    fundsEl.textContent = fundsText;

    // 8. 切换页面状态：隐藏加载，显示内容
    loadingStateEl.style.display = "none";
    body.className = "page-success";
    eventDetailContent.style.display = "block";

  } catch (err) {
    // 9. 加载失败处理（补充隐藏加载状态）
    console.error("活动详情加载失败：", err);
    loadingStateEl.style.display = "none";
    body.className = "page-error";
    errorMsgEl.innerHTML = `<i class="fa fa-exclamation-triangle"></i><p>活动详情加载失败：${err.message}</p>`;
  }
});
