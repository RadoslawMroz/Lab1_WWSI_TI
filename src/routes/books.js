// src/routes/books.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/books — lista z available
router.get('/', async (req, res) => {
  // pobieramy wszystkie książki
  const books = await prisma.book.findMany({
    orderBy: { id: 'asc' },
    include: {
      loans: {
        where: {
          returnDate: null
        }
      }
    }
  });

  const withAvailable = books.map(b => {
    const activeLoans = b.loans.length;
    return {
      id: b.id,
      title: b.title,
      author: b.author,
      copies: b.copies,
      available: Math.max(b.copies - activeLoans, 0)
    };
  });

  res.json(withAvailable);
});

// POST /api/books
router.post('/', async (req, res) => {
  let { title, author, copies } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Tytuł i autor są wymagane.' });
  }
  copies = copies ? Number(copies) : 1;
  if (Number.isNaN(copies) || copies < 1) {
    return res.status(400).json({ error: 'Liczba egzemplarzy musi być większa lub równa 1.' });
  }

  // Sprawdź, czy książka o tym samym tytule i autorze już istnieje
  const existingBook = await prisma.book.findFirst({
    where: {
      title: title,
      author: author
    }
  });

  if (existingBook) {
    // Jeżeli istnieje → zwiększ liczbę egzemplarzy
    const updated = await prisma.book.update({
      where: { id: existingBook.id },
      data: {
        copies: existingBook.copies + copies
      }
    });
    return res.status(200).json({
      message: `Zwiększono liczbę egzemplarzy książki "${updated.title}" do ${updated.copies}.`,
      book: updated
    });
  }

  // Jeśli nie istnieje → dodaj nową
  const book = await prisma.book.create({
    data: { title, author, copies }
  });

  res.status(201).json(book);
});

export default router;
