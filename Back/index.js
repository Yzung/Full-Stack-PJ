const express = require('express');
const cors = require('cors');
const userRoute = require('./src/route/userRoute.js');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/users', userRoute);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});