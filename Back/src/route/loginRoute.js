const express = require('express');
const { login } = require('../controller/userController'); // Importa a função de login do controller
const router = express.Router();

// Rota de Login
router.post('/', login); // Delegar a chamada para a função 'login' no controller

module.exports = router;
