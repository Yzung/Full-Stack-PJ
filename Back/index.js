const express = require('express');
const cors = require('cors');
const userRoute = require('./src/route/userRoute.js');
const loginRoute = require('./src/route/loginRoute.js'); // Adicionando a rota de login
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/users', userRoute); // Mantém a rota de usuários que você já criou
app.use('/login', loginRoute); // Usa a nova rota de login

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
