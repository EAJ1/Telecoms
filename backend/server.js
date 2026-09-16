require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
if (process.env.FRONTEND_ORIGIN) app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Serve only public assets; never expose backend configuration.
for (const asset of ['index.html', 'styles.css', 'script.js', 'Imbali Telecoms.jpeg']) {
  app.get(asset === 'index.html' ? '/' : '/' + asset, (req, res) => res.sendFile(path.join(__dirname, '..', asset)));
}

app.use('/api', (req, res, next) => {
  if (!supabase && req.path !== '/services') return res.status(503).json({ error: 'Enquiries and news are unavailable until the database is configured. Please try again later.' });
  next();
});

// API Routes
// Example connection categories. Commercial details are supplied in a quote.
const exampleServices = [
  { id: 'home-wifi', name: 'Home Wi-Fi', description: 'Discuss internet access and a Wi-Fi setup for your home.' },
  { id: 'business-internet', name: 'Business connectivity', description: 'Explore office internet, team requirements and guest Wi-Fi.' },
  { id: 'whole-home-wifi', name: 'Whole-home Wi-Fi', description: 'Ask about router placement, mesh options and coverage around your space.' }
];
app.get('/api/services', async (req, res) => {
  if (!supabase) return res.json(exampleServices);
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    res.json(data && data.length ? data : exampleServices);
  } catch (error) {
    res.json(exampleServices);
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (![name, email, message].every(value => typeof value === 'string' && value.trim() && value.length <= 5000) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);
    if (error) throw error;
    res.json({ message: 'Contact submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to complete your request. Please try again later.' });
  }
});

app.post('/api/contracts', async (req, res) => {
  const { company, email, plan, message } = req.body || {};
  if (![company, email, plan].every(value => typeof value === 'string' && value.trim() && value.length <= 5000) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['basic', 'pro', 'enterprise'].includes(plan) || (message != null && (typeof message !== 'string' || message.length > 5000))) {
    return res.status(400).json({ error: 'Company, email, and plan are required' });
  }

  try {
    const { data, error } = await supabase
      .from('contracts')
      .insert([{ company, email, plan, message }]);
    if (error) throw error;
    res.json({ message: 'Contract inquiry submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to complete your request. Please try again later.' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })
      .limit(6);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to complete your request. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
