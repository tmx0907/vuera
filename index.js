const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

// __dirname is already available in CommonJS

const app = express();

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist', 'public'), {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'vuera-ai'
  });
});

// Placeholder API routes - these would be replaced with actual implementation
app.post('/api/upload', (req, res) => {
  res.status(501).json({ error: 'Upload endpoint not yet implemented for serverless' });
});

app.post('/api/analyze', (req, res) => {
  res.status(501).json({ error: 'Analysis endpoint not yet implemented for serverless' });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not found - build required');
  }
});

// Export the app for serverless usage
module.exports = app;

// Only start the server when not in Vercel environment
const PORT = process.env.PORT || 5000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}