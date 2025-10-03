// 1. 基础配置（全团队统一，确保与server.js端口一致）
const BASE_API_URL = "http://localhost:3001/api"; // 服务器API根地址
const EMPTY_IMAGE_URL = "/images/default-event.jpg"; // 默认活动图片（避免图片加载失败）

// 2. 封装API请求（处理GET请求，统一错误捕获）
async function fetchApi(url, params = {}) {
  try {
    // 拼接GET请求参数（空值不传递）
    const validParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== undefined)
    );
    const queryString = new URLSearchParams(validParams).toString();
    const requestUrl = queryString 
      ? `${BASE_API_URL}${url}?${queryString}` 
      : `${BASE_API_URL}${url}`;

    // 发送请求
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin", // 跨域兼容（如需部署可调整）
    });

    // 处理HTTP错误（404、500等）
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "API请求失败" }));
      throw new Error(errorData.error || `HTTP错误: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API请求异常:", err);
    // 统一错误提示（页面需有id为"error-msg"的元素）
    showErrorMsg(err.message);
    throw err; // 抛出错误，让页面自行处理后续逻辑
  }
}

// 3. 错误提示渲染（全页面统一样式入口）
function showErrorMsg(message) {
  const errorElement = document.getElementById("error-msg");
  if (!errorElement) return;

  // 错误提示HTML结构（样式由CSS控制）
  errorElement.innerHTML = `
    <div class="error-alert">
      <i class="error-icon">⚠️</i>
      <span class="error-text">${message}</span>
    </div>
  `;

  // 3秒后自动隐藏错误
  setTimeout(() => {
    errorElement.innerHTML = "";
  }, 3000);
}

// 4. 导航栏渲染（全页面统一导航结构）
function renderNavbar() {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  navbarContainer.innerHTML = `
    <nav class="navbar">
      <div class="navbar-container container">
        <!-- Logo区域 -->
        <a href="index.html" class="navbar-logo">
          爱心慈善活动平台
        </a>
        <!-- 导航菜单 -->
        <ul class="navbar-menu">
          <li class="navbar-item">
            <a href="index.html" class="navbar-link">首页</a>
          </li>
          <li class="navbar-item">
            <a href="search.html" class="navbar-link">搜索活动</a>
          </li>
          <li class="navbar-item">
            <a href="javascript:;" class="navbar-link about-link">关于我们</a>
          </li>
        </ul>
      </div>
    </nav>
  `;

  // 可选：添加"关于我们"弹窗（全团队统一逻辑）
  const aboutLink = document.querySelector(".about-link");
  aboutLink?.addEventListener("click", () => {
    alert("爱心慈善活动平台：连接公益组织与爱心人士，共建美好社会！\n联系邮箱：contact@charityplatform.org");
  });
}

// 5. 日期格式化工具（全页面统一日期显示格式）
function formatDate(isoDateStr) {
  if (!isoDateStr) return "未设置日期";
  const date = new Date(isoDateStr);
  
  // 处理无效日期
  if (isNaN(date.getTime())) return "无效日期";

  // 格式：YYYY-MM-DD HH:MM（如 2025-12-10 19:00）
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 6. 图片地址处理（避免图片加载失败）
function getSafeImageUrl(imageUrl) {
  return imageUrl && imageUrl.trim() !== "" ? imageUrl : EMPTY_IMAGE_URL;
}

// 7. 页面加载时自动执行（导航栏+基础初始化）
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  // 可选：添加页面加载动画（全团队统一）
  document.body.classList.add("page-loaded");
});

// 暴露公共方法（供其他JS文件调用）
window.CharityCommon = {
  fetchApi,
  showErrorMsg,
  formatDate,
  getSafeImageUrl,
  BASE_API_URL,
  EMPTY_IMAGE_URL
};