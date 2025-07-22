import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 5001;

// Serve uploads directory
app.use('/uploads', express.static('uploads'));

// Test endpoint to list all files in uploads directory
app.get('/test-files', (req, res) => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    return res.json({ error: 'Uploads directory does not exist' });
  }
  
  const files = fs.readdirSync(uploadsDir);
  const fileUrls = files.map(file => `http://localhost:${PORT}/uploads/${file}`);
  
  res.json({
    uploadsDirectory: uploadsDir,
    files: files,
    urls: fileUrls
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Test files endpoint: http://localhost:${PORT}/test-files`);
}); 