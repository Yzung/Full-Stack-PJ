const jwt = require('jsonwebtoken');

// Função para gerar o token JWT
// Gera um token JWT com base nas informações do usuário fornecidas (id e email).
// O token será válido por 1 hora.
function generateToken(user) {
    const payload = { userId: user.id, email: user.email }; // Dados que serão codificados no token
    const secretKey = process.env.JWT_SECRET || 'seuSegredoSuperSecreto'; // Chave secreta usada para assinar o token
    const options = { expiresIn: '1h' };  // O token irá expirar em 1 hora

    // Gera e retorna o token JWT
    return jwt.sign(payload, secretKey, options);
}

/**
 * Middleware para verificar o token JWT
 * 
 * Este middleware verifica se o token JWT foi enviado na requisição e se é válido.
 * Se o token for válido, ele adiciona as informações do usuário no objeto 'req' para ser usado nas rotas protegidas.
 * Caso o token não seja fornecido ou seja inválido, retorna um erro.
 */
function authenticateToken(req, res, next) {
    // Obtém o token da autorização no cabeçalho da requisição
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Se o token não for fornecido, retorna um erro 403
    if (!token) {
        return res.status(403).json({ error: 'Token não fornecido.' });
    }

    try {
        // Verifica e decodifica o token com a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seuSegredoSuperSecreto');
        
        // Adiciona as informações do usuário decodificado no objeto 'req' para que possam ser usadas nas próximas etapas
        req.user = decoded;

        // Chama o próximo middleware ou função de rota
        next();
    } catch (err) {
        // Se o token for inválido ou expirado, retorna um erro 401
        console.error('Token inválido ou expirado:', err);
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

// Exportando as funções para uso em outras partes do sistema
module.exports = { generateToken, authenticateToken };
