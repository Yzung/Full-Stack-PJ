const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // Libera acesso para frontend
app.use(express.json()); // Suporte a JSON no corpo da requisição

// GET /users – lista todos os usuários
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// POST /users – cria um novo usuário
app.post('/users', async (req, res) => {
  const { nome, sobrenome, senha } = req.body;
  const user = await prisma.user.create({
    data: { nome, sobrenome, senha },
  });
  res.status(201).json(user);
});

// DELETE /users/:id – deleta usuário por ID
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

// Inicializa servidor
app.listen(3000, () => {
  console.log('🚀 API rodando em http://localhost:3000');
});
