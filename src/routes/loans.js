// src/routes/loans.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/loans — lista (z joinami)
router.get('/', async (req, res) => {
  const loans = await prisma.loan.findMany({
    orderBy: { id: 'desc' },
    include: {
      member: true,
      book: true
    }
  });

  const mapped = loans.map(l => ({
    id: l.id,
    member_id: l.memberId,
    member_name: l.member.name,
    book_id: l.bookId,
    book_title: l.book.title,
    loan_date: l.loanDate,
    due_date: l.dueDate,
    return_date: l.returnDate
  }));
  res.json(mapped);
});

// POST /api/loans/borrow {member_id, book_id, days?}
router.post('/borrow', async (req, res) => {
  const { member_id, book_id, days } = req.body;
  if (!member_id || !book_id) {
    return res.status(400).json({ error: 'member_id i book_id są wymagane' });
  }

  // sprawdź czy book istnieje + liczbę aktywnych wypożyczeń
  const book = await prisma.book.findUnique({
    where: { id: Number(book_id) },
    include: {
      loans: {
        where: { returnDate: null }
      }
    }
  });
  if (!book) return res.status(404).json({ error: 'Książka nie znaleziona' });

  const activeLoans = book.loans.length;
  if (activeLoans >= book.copies) {
    return res.status(409).json({ error: 'Brak dostępnych egzemplarzy' });
  }

  // sprawdź member
  const member = await prisma.member.findUnique({
    where: { id: Number(member_id) }
  });
  if (!member) return res.status(404).json({ error: 'Czytelnik nie znaleziony' });

  const today = new Date();
  const loanDays = days ? Number(days) : 14;
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + loanDays);

  const loan = await prisma.loan.create({
    data: {
      memberId: Number(member_id),
      bookId: Number(book_id),
      loanDate: today,
      dueDate
    }
  });

  res.status(201).json(loan);
});

// POST /api/loans/return {loan_id}
router.post('/return', async (req, res) => {
  const { loan_id } = req.body;
  if (!loan_id) {
    return res.status(400).json({ error: 'loan_id jest wymagany' });
  }

  const loan = await prisma.loan.findUnique({
    where: { id: Number(loan_id) }
  });
  if (!loan) return res.status(404).json({ error: 'Nie znaleziono' });

  if (loan.returnDate) {
    return res.status(409).json({ error: 'Już zwrócono' });
  }

  const updated = await prisma.loan.update({
    where: { id: Number(loan_id) },
    data: {
      returnDate: new Date()
    }
  });

  res.json(updated);
});

export default router;
