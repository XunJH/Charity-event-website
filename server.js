const express = require('express');
const { executeQuery } = require('./event_db'); 
const app = express();
const PORT = 3001; 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/home/events', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; 
    
    const sql = `
      SELECT 
        ce.event_id, ce.title, ce.description, ce.event_date, ce.location, 
        ce.image_url, ce.ticket_price, ce.fundraising_goal, ce.current_funds,
        co.name AS org_name,  
        ec.category_name      
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
    
    const eventsWithProgress = events.map(event => {
      const progressPercent = event.fundraising_goal > 0 
        ? Math.round((event.current_funds / event.fundraising_goal) * 100) 
        : 0;
      return { ...event, progressPercent };
    });
    
    res.status(200).json(eventsWithProgress); 
  } catch (err) {
    res.status(500).json({ error: '获取首页活动失败：' + err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const sql = 'SELECT category_id, category_name FROM event_categories ORDER BY category_name';
    const categories = await executeQuery(sql);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: '获取活动分类失败：' + err.message });
  }
});

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
    
    if (date) {
      sql += ' AND DATE(ce.event_date) = ?';
      params.push(date);
    }
    if (location) {
      sql += ' AND (ce.location LIKE ? OR ce.venue_name LIKE ?)';
      params.push(`%${location}%`, `%${location}%`); 
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

app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id; 
    
    const sql = `
      SELECT 
        ce.*,  -- 活动所有字段
        co.name AS org_name, co.description AS org_desc, 
        co.contact_email AS org_email, co.phone_number AS org_phone,
        ec.category_name, ec.description AS category_desc
      FROM charity_events ce
      LEFT JOIN charitable_organisations co ON ce.organisation_id = co.organisation_id
      LEFT JOIN event_categories ec ON ce.category_id = ec.category_id
      WHERE ce.event_id = ?;
    `;
    
    const events = await executeQuery(sql, [eventId]);
    
    if (events.length === 0) {
      return res.status(404).json({ error: '未找到该活动' });
    }
    
    const event = events[0];
    event.progressPercent = event.fundraising_goal > 0 
      ? Math.round((event.current_funds / event.fundraising_goal) * 100) 
      : 0;
    
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: '获取活动详情失败：' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API 服务器已启动：http://localhost:${PORT}`);
});