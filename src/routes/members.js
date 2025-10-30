// src/routes/members.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/members — lista
router.get('/', async (req, res) => {
  const members = await prisma.member.findMany({
    orderBy: { id: 'asc' }
  });
  res.json(members);
});

// POST /api/members {name,email}
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Imię i email są wymagane' });
  }
  try {
    const member = await prisma.member.create({
      data: { name, email }
    });
    res.status(201)
      .location(`/api/members/${member.id}`)
      .json(member);
  } catch (err) {
    // np. unikalny email
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Ten adres email już istnieje w bazie danych' });
    }
    console.error(err);
    res.status(500).json({ error: 'Wystąpił błąd serwera' });
  }
});

// GET /api/members/:id — szczegóły
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const member = await prisma.member.findUnique({
    where: { id },
    include: { loans: true }
  });
  if (!member) return res.status(404).json({ error: 'Nie znaleziono' });
  res.json(member);
});

export default router;
