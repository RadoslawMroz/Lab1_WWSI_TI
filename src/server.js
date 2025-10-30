// src/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import membersRouter from './routes/members.js';
import booksRouter from './routes/books.js';
import loansRouter from './routes/loans.js';

const app = express();
app.use(cors());
app.use(express.json());

// statyczne pliki
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/api/members', membersRouter);
app.use('/api/books', booksRouter);
app.use('/api/loans', loansRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Library API running on http://localhost:${PORT}`);
});
