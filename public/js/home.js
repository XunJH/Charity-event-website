document.addEventListener("DOMContentLoaded", async () => {
  const eventsListEl = document.getElementById("events-list");
  try {
    console.log("开始请求活动数据，接口地址: /home/events");
    const events = await CharityCommon.fetchApi("/home/events");
    
    console.log("数据请求成功，返回数据:", events);
    if (!Array.isArray(events)) {
      throw new Error("接口返回数据格式错误，预期是数组");
    }

    if (events.length === 0) {
      eventsListEl.innerHTML = `
        <div class="empty-state">
          <i class="fa fa-calendar-o"></i>
          <p>暂无即将举办的慈善活动</p>
        </div>
      `;
      return;
    }

    // 渲染活动列表：添加数据类型校验，避免非数字调用toFixed()
    eventsListEl.innerHTML = events.map(event => {
      // 1. 处理 current_funds（当前筹款）：转为数字，默认0
      const currentFunds = Number(event.current_funds) || 0;
      // 2. 处理 fundraising_goal（筹款目标）：转为数字，默认0
      const fundraisingGoal = Number(event.fundraising_goal) || 0;
      // 3. 处理 ticket_price（票价）：转为数字，默认0（避免免费判断出错）
      const ticketPrice = Number(event.ticket_price) || 0;
      // 4. 处理 progressPercent（筹款进度）：避免除以0，默认0
      const progressPercent = fundraisingGoal > 0 
        ? Math.round((currentFunds / fundraisingGoal) * 100) // 四舍五入到整数，更直观
        : 0;

      return `
        <div class="event-card">
          <img src="${CharityCommon.getSafeImageUrl(event.image_url)}" alt="${event.title || '活动图片'}" class="event-card-img">
          <div class="event-card-content">
            <h3 class="event-card-title">
              <a href="event-detail.html?id=${event.event_id}">${event.title || '未命名活动'}</a>
            </h3>
            <div class="event-card-meta">
              <span><i class="fa fa-tags"></i> ${event.category_name || '未分类'}</span>
              <span><i class="fa fa-calendar"></i> ${CharityCommon.formatDate(event.event_date) || '日期未确定'}</span>
              <span><i class="fa fa-map-marker"></i> ${event.location || '地点未确定'}</span>
            </div>
            <p class="event-card-desc">${event.description || '暂无活动描述'}</p>
            <div class="event-card-progress">
              <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <div class="event-card-progress-text">
              <span>筹款进度：${progressPercent}%</span>
              <span>¥${currentFunds.toFixed(2)}/${fundraisingGoal.toFixed(2)}</span>
            </div>
            <div class="event-card-price">
              票价：${ticketPrice > 0 ? `¥${ticketPrice.toFixed(2)}` : "免费"}
            </div>
            <a href="event-detail.html?id=${event.event_id}" class="btn btn-view-detail">查看详情</a>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("===== 活动加载失败详情 =====");
    console.error("错误类型:", err.name);
    console.error("错误消息:", err.message);
    console.error("错误堆栈:", err.stack);
    console.error("===========================");
    
    eventsListEl.innerHTML = `
      <div class="error-state">
        <i class="fa fa-exclamation-triangle"></i>
        <p>活动加载失败，请稍后重试</p>
      </div>
    `;
  }
});