const express = require('express');
const { executeQuery } = require('./event_db'); 
const app = express();
const PORT = 3001; 
const path = require('path');

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "connect-src 'self' http://localhost:3001; " +
    "img-src 'self' data:; " +
    "script-src 'self'; " +
    "style-src 'self' https://cdn.jsdelivr.net; " +
    "font-src 'self' https://cdn.jsdelivr.net; " +
    "frame-src 'self'"
  );
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const publicDirPath = path.resolve(__dirname, 'public');
console.log('Static resource hosting directory:', publicDirPath);
app.use(express.static(publicDirPath));

app.get('/', (req, res) => {
  const indexHtmlPath = path.join(publicDirPath, 'index.html');
  res.sendFile(indexHtmlPath, (err) => {
    if (err) {
      res.status(404).send(`
        <h1>Home page file not found</h1>
        <p>Please check if the following path exists: ${indexHtmlPath}</p>
        <p>Suggestion: Confirm there is an index.html file in the public directory</p>
      `);
    }
  });
});

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
    const eventsWithProgress = events.map(event => ({
      ...event,
      progressPercent: event.fundraising_goal > 0 
        ? Math.round((event.current_funds / event.fundraising_goal) * 100) 
        : 0
    }));
    res.status(200).json(eventsWithProgress); 
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve home page events: ' + err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const sql = 'SELECT category_id, category_name FROM event_categories ORDER BY category_name';
    const categories = await executeQuery(sql);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve event categories: ' + err.message });
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
    res.status(500).json({ error: 'Failed to search events: ' + err.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id; 
    if (isNaN(Number(eventId))) {
      return res.status(400).json({ error: 'Invalid event ID (must be a number)' });
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
      return res.status(404).json({ error: 'Event not found (ID does not exist)' });
    }
    
    const event = events[0];
    event.progressPercent = event.fundraising_goal > 0 
      ? Math.round((event.current_funds / event.fundraising_goal) * 100) 
      : 0;
    
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve event details: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Server started! Port: ${PORT}`);
  console.log(`Home page: http://localhost:${PORT}`);
  console.log(`Search page: http://localhost:${PORT}/search.html`);
  console.log(`API test (home page events): http://localhost:${PORT}/api/home/events`);
  console.log(`Static resource hosting directory: ${publicDirPath}`);
  console.log(`=================================`);
});