// 等待DOM完全加载后执行（修正：补充所有闭合括号）
document.addEventListener("DOMContentLoaded", async () => {
  const loadingEl = document.getElementById("loading-state");
  const contentEl = document.getElementById("event-detail-content");
  const errorEl = document.getElementById("error-msg");

  // 1. 从URL参数中获取活动ID（如：event-detail.html?id=1）
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

  // 2. 验证活动ID有效性（非空且为数字）
  if (!eventId || isNaN(Number(eventId))) {
    loadingEl.style.display = "none"; // 隐藏加载动画
    errorEl.innerHTML = `
      <div class="error-alert">
        <i class="fa fa-exclamation-circle"></i> 无效的活动ID，请从首页或搜索页进入
      </div>
    `;
    return; // 终止后续执行
  }

  try {
    // 3. 调用公共API函数，获取指定ID的活动详情
    const events = await CharityCommon.fetchApi(`/events/${eventId}`);
    // 检查是否查询到活动（避免空数组）
    if (events.length === 0) throw new Error("未找到该活动，请确认活动ID是否正确");
    
    const event = events[0]; // 提取唯一活动数据

    // 4. 计算筹款进度百分比（避免除以0）
    const progressPercent = event.fundraising_goal > 0 
      ? Math.round((event.current_funds / event.fundraising_goal) * 100) 
      : 0;

    // 5. 渲染活动详情到页面（使用模板字符串动态填充数据）
    contentEl.innerHTML = `
      <div class="detail-header">
        <!-- 活动主图 -->
        <div class="detail-img-wrapper">
          <img 
            src="${CharityCommon.getSafeImageUrl(event.image_url)}" 
            alt="${event.title}" 
            class="detail-img"
          >
        </div>
        <!-- 活动基础信息 -->
        <div class="detail-header-info">
          <h1 class="detail-title">${event.title}</h1>
          <div class="detail-meta">
            <span class="meta-item"><i class="fa fa-tags"></i> ${event.category_name}</span>
            <span class="meta-item"><i class="fa fa-calendar"></i> ${CharityCommon.formatDate(event.event_date)}</span>
            <span class="meta-item"><i class="fa fa-map-marker"></i> ${event.location}</span>
            <span class="meta-item"><i class="fa fa-building"></i> ${event.org_name}</span>
          </div>
          <div class="detail-price">
            票价：${event.ticket_price > 0 ? `¥${event.ticket_price.toFixed(2)}` : "免费"}
          </div>
          <div class="detail-attendees">
            参与人数：${event.current_attendees || 0}/${event.max_attendees || "不限"}
          </div>
          <!-- 筹款进度条 -->
          <div class="detail-progress">
            <div class="progress-bar" style="width: ${progressPercent}%"></div>
          </div>
          <div class="detail-progress-text">
            <span>筹款进度：${progressPercent}%</span>
            <span>已筹：¥${event.current_funds.toFixed(2)} / 目标：¥${event.fundraising_goal.toFixed(2)}</span>
          </div>
          <!-- 报名按钮 -->
          <button id="register-btn" class="btn btn-register">立即报名</button>
        </div>
      </div>

      <!-- 活动详细内容 -->
      <div class="detail-content">
        <div class="detail-section">
          <h2 class="section-heading">活动详情</h2>
          <p class="detail-full-desc">${event.full_description || "暂无详细描述"}</p>
        </div>
        <div class="detail-section">
          <h2 class="section-heading">活动目的</h2>
          <p class="detail-purpose">${event.event_purpose || "暂无活动目的说明"}</p>
        </div>
        <div class="detail-section">
          <h2 class="section-heading">主办方信息</h2>
          <div class="org-info">
            <h3>${event.org_name}</h3>
            <p class="org-desc">${event.org_desc || "暂无主办方描述"}</p>
            <div class="org-contact">
              <p><i class="fa fa-envelope"></i> 邮箱：${event.org_email || "未公开"}</p>
              <p><i class="fa fa-phone"></i> 电话：${event.org_phone || "未公开"}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // 6. 切换显示状态：隐藏加载动画，显示详情内容
    loadingEl.style.display = "none";
    contentEl.style.display = "block";

    // 7. 报名按钮点击事件（弹出提示弹窗）
    document.getElementById("register-btn").addEventListener("click", () => {
      // 创建弹窗元素
      const modal = document.createElement("div");
      modal.className = "register-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h3 class="modal-title">报名功能提示</h3>
          <p class="modal-desc">该功能目前正在开发中，敬请期待！</p>
          <button id="close-modal" class="btn btn-close-modal">关闭</button>
        </div>
      `;
      // 添加弹窗到页面
      document.body.appendChild(modal);
      document.body.style.overflow = "hidden"; // 禁止背景滚动（避免弹窗时页面可滚动）

      // 关闭弹窗逻辑
      document.getElementById("close-modal").addEventListener("click", () => {
        document.body.removeChild(modal); // 移除弹窗
        document.body.style.overflow = ""; // 恢复背景滚动
      });
    });

  } catch (err) {
    // 8. 捕获所有异常（API请求失败、数据异常等）
    loadingEl.style.display = "none";
    errorEl.innerHTML = `
      <div class="error-alert">
        <i class="fa fa-exclamation-circle"></i> ${err.message}
      </div>
    `;
    console.error("活动详情加载失败：", err); // 控制台打印错误，方便调试
  }

});