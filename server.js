const express = require('express');
const { executeQuery } = require('./event_db'); 
const app = express();
const PORT = 3001; 
const path = require('path');

// 1. 优先配置 CSP 中间件（允许 CDN 资源，解决 Font Awesome 加载问题）
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " + // 默认允许本域资源
    "connect-src 'self' http://localhost:3001; " + // 允许本域 API 请求
    "img-src 'self' data:; " + // 允许本域图片和 data 协议图片（默认图）
    "script-src 'self'; " + // 允许本域 JS（无外部 JS CDN 时无需修改）
    "style-src 'self' https://cdn.jsdelivr.net; " + // 关键：允许 Font Awesome CDN 样式
    "font-src 'self' https://cdn.jsdelivr.net; " + // 关键：允许 Font Awesome CDN 字体
    "frame-src 'self'" // 允许本域 iframe（如需可扩展）
  );
  next();
});

// 2. 配置 CORS（开发环境允许跨域，生产环境可限制具体域名）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 3. 关键：配置静态文件托管（public 目录，解决 JS/CSS MIME 错误）
// 作用：让服务器能直接返回 public 下的静态资源（如 css/style.css、js/common.js）
const publicDirPath = path.resolve(__dirname, 'public');
console.log('静态资源托管目录：', publicDirPath); // 启动时打印路径，方便验证
app.use(express.static(publicDirPath));

// 4. 根路径（/）处理——返回首页（静态托管已覆盖，此处可保留做兜底）
app.get('/', (req, res) => {
  const indexHtmlPath = path.join(publicDirPath, 'index.html'); // 用 join 更安全
  res.sendFile(indexHtmlPath, (err) => {
    if (err) {
      res.status(404).send(`
        <h1>首页文件未找到</h1>
        <p>请检查以下路径是否存在：${indexHtmlPath}</p>
        <p>建议：确认 public 目录下有 index.html 文件</p>
      `);
    }
  });
});

// 5. 首页活动列表 API
app.get('/api/home/events', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; 
    const sql = `
      SELECT 
        ce.event_id, ce.title, ce.description, ce.event_date, ce.location, 
        ce.image_url, ce.ticket_price, ce.fundraising_goal, ce.current_funds,
        co.name AS org_name, ec.category_name      
      FROM charity_events ce
      LEFT JOIN charitable_organisations co 
        ON ce.organisation_id = co.organisation_id
      LEFT JOIN event_categories ec 
        ON ce.category_id = ec.category_id
      WHERE 
        ce.is_active = 1        
        AND ce.is_suspended = 0 
        AND DATE(ce.event_date) >= ? 
      ORDER BY ce.event_date ASC; 
    `;
    const events = await executeQuery(sql, [currentDate]); 
    // 计算筹款进度（前端直接使用，避免重复计算）
    const eventsWithProgress = events.map(event => ({
      ...event,
      progressPercent: event.fundraising_goal > 0 
        ? Math.round((event.current_funds / event.fundraising_goal) * 100) 
        : 0
    }));
    res.status(200).json(eventsWithProgress); 
  } catch (err) {
    res.status(500).json({ error: '获取首页活动失败：' + err.message });
  }
});

// 6. 活动分类 API
app.get('/api/categories', async (req, res) => {
  try {
    const sql = 'SELECT category_id, category_name FROM event_categories ORDER BY category_name';
    const categories = await executeQuery(sql);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: '获取活动分类失败：' + err.message });
  }
});

// 7. 活动搜索 API（优化参数处理，避免无效查询）
app.get('/api/events/search', async (req, res) => {
  try {
    const { date, location, category_id } = req.query; 
    const currentDate = new Date().toISOString().split('T')[0];
    let sql = `
      SELECT 
        ce.event_id, ce.title, ce.description, ce.event_date, ce.location, 
        ce.image_url, ce.ticket_price, co.name AS org_name, ec.category_name
      FROM charity_events ce
      LEFT JOIN charitable_organisations co ON ce.organisation_id = co.organisation_id
      LEFT JOIN event_categories ec ON ce.category_id = ec.category_id
      WHERE 
        ce.is_active = 1 
        AND ce.is_suspended = 0 
        AND DATE(ce.event_date) >= ?
    `;
    const params = [currentDate]; 
    
    // 仅当参数有效时才添加查询条件（避免空值导致 SQL 错误）
    if (date?.trim()) {
      sql += ' AND DATE(ce.event_date) = ?';
      params.push(date.trim());
    }
    if (location?.trim()) {
      sql += ' AND (ce.location LIKE ? OR ce.venue_name LIKE ?)';
      const locationParam = `%${location.trim()}%`;
      params.push(locationParam, locationParam); 
    }
    if (category_id && !isNaN(Number(category_id))) {
      sql += ' AND ce.category_id = ?';
      params.push(Number(category_id));
    }
    
    sql += ' ORDER BY ce.event_date ASC';
    const results = await executeQuery(sql, params);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: '搜索活动失败：' + err.message });
  }
});

// 8. 活动详情 API（返回单个对象，方便前端处理）
app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id; 
    // 验证 ID 有效性（避免非数字 ID 导致 SQL 错误）
    if (isNaN(Number(eventId))) {
      return res.status(400).json({ error: '无效的活动 ID（必须为数字）' });
    }

    const sql = `
      SELECT 
        ce.*, 
        co.name AS org_name, co.description AS org_desc, 
        co.contact_email AS org_email, co.phone_number AS org_phone,
        ec.category_name, ec.description AS category_desc
      FROM charity_events ce
      LEFT JOIN charitable_organisations co ON ce.organisation_id = co.organisation_id
      LEFT JOIN event_categories ec ON ce.category_id = ec.category_id
      WHERE ce.event_id = ?;
    `;
    const events = await executeQuery(sql, [Number(eventId)]);
    
    if (events.length === 0) {
      return res.status(404).json({ error: '未找到该活动（ID 不存在）' });
    }
    
    // 补充筹款进度（前端详情页可用）
    const event = events[0];
    event.progressPercent = event.fundraising_goal > 0 
      ? Math.round((event.current_funds / event.fundraising_goal) * 100) 
      : 0;
    
    res.status(200).json(event); // 返回单个对象，而非数组
  } catch (err) {
    res.status(500).json({ error: '获取活动详情失败：' + err.message });
  }
});

// 9. 启动服务器（打印关键信息，方便调试）
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`服务器已启动！端口：${PORT}`);
  console.log(`首页访问：http://localhost:${PORT}`);
  console.log(`搜索页访问：http://localhost:${PORT}/search.html`);
  console.log(`API 测试（首页活动）：http://localhost:${PORT}/api/home/events`);
  console.log(`静态资源托管目录：${publicDirPath}`);
  console.log(`=================================`);
});