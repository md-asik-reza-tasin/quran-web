import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import db from './database.js';

const app = new Hono();

// Enable CORS so your Next.js frontend can communicate with this server
app.use('/api/*', cors());

/**
 * 1. DEBUG ROUTE
 * Purpose: Verify database structure and column names.
 * Usage: http://localhost:3000/api/debug
 */
app.get('/api/debug', (c) => {
  try {
    const columns = db.prepare("PRAGMA table_info('ALL')").all();
    const sample = db.prepare("SELECT * FROM 'ALL' LIMIT 1").get();
    return c.json({ columns, sample_data: sample });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * 2. GET ALL SURAHS
 * Purpose: Provides data for the scrollable Surah sidebar.
 * Usage: http://localhost:3000/api/surahs
 */
app.get('/api/surahs', (c) => {
  try {
    const surahs = db.prepare('SELECT SURA_num, SURA, COUNT(*) as ayah_count FROM "ALL" GROUP BY SURA_num ORDER BY SURA_num ASC').all();
    return c.json(surahs);
  } catch (err: any) {
    return c.json({ error: "Failed to fetch surahs", details: err.message }, 500);
  }
});

/**
 * 3. GET AYAH PAGE DATA
 * Purpose: Returns all verses for a specific surah.
 * Usage: http://localhost:3000/api/surah/1
 */
app.get('/api/surah/:id', (c) => {
  const suraId = c.req.param('id');
  try {
    const verses = db.prepare('SELECT * FROM "ALL" WHERE SURA_num = ? ORDER BY AYA_num ASC').all(suraId);

    if (!verses || verses.length === 0) {
      return c.json({ error: "Surah not found" }, 404);
    }

    return c.json(verses);
  } catch (err: any) {
    return c.json({ error: "Database error", details: err.message }, 500);
  }
});

/**
 * 4. SEARCH FUNCTIONALITY
 * Purpose: Full-text search across all surahs by translation.
 * Usage: http://localhost:3000/api/search?q=peace
 */
app.get('/api/search', (c) => {
  const query = c.req.query('q');

  if (!query || query.length < 2) {
    return c.json({ error: "Search query too short" }, 400);
  }

  try {
    // Note: If /api/debug shows your translation column isn't 'AQ', change it here
    const results = db.prepare('SELECT * FROM "ALL" WHERE AQ LIKE ? LIMIT 50').all(`%${query}%`);
    return c.json(results);
  } catch (err: any) {
    return c.json({ error: "Search failed", details: err.message }, 500);
  }
});




const port = 5000;
console.log("Backend initialized on port " + port);

serve({
  fetch: app.fetch,
  port
});