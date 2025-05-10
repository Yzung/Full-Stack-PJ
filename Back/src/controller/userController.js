const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/jwt'); // Importando a função para gerar o token JWT
const prisma = new PrismaClient();

// Função de validação de email
// Verifica se o email fornecido segue o padrão de um email válido.
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Função de validação de senha
// A senha deve conter pelo menos 6 caracteres, incluindo letras e números.
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
}

/**
 * Função de login
 * 
 * Realiza o login do usuário verificando o email e a senha fornecidos.
 * Se os dados estiverem corretos, retorna um token JWT e as informações do usuário.
 */
async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Busca o usuário pelo email
        const user = await prisma.user.findFirst({
            where: {
                emails: {
                    some: {
                        email: email, // Verifica se o email existe na lista de emails
                    }
                }
            },
            include: {
                emails: true // Inclui os emails para garantir que temos o campo email
            }
        });

        // Se o usuário não for encontrado, retorna erro
        if (!user) {
            return res.status(400).json({ error: 'Usuário ou senha inválidos' });
        }

        // Verifica se a senha fornecida corresponde ao hash da senha no banco de dados
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Usuário ou senha inválidos' });
        }

        // Gera um novo token JWT para o usuário após login
        const token = generateToken(user);

        // Retorna o token e as informações do usuário para o cliente
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.emails[0].email, // Retorna o primeiro email da lista
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
}

/**
 * Função para obter todos os usuários
 * 
 * Retorna uma lista com todos os usuários cadastrados no sistema.
 */
async function getUsers(req, res) {
    try {
        // Busca todos os usuários no banco de dados
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}

/**
 * Função para obter um usuário específico pelo ID
 * 
 * Retorna os dados de um usuário com base no ID fornecido.
 */
async function getUserById(req, res) {
    const id = parseInt(req.params.id);
    try {
        // Busca o usuário pelo ID
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
}

/**
 * Função para criar um novo usuário
 * 
 * Cria um novo usuário com base nos dados fornecidos, após validar o email e a senha.
 */
async function createUser(req, res) {
    const { firstName, lastName, email, password } = req.body;

    // Valida os dados de entrada
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Senha inválida. A senha deve ter pelo menos 6 caracteres e incluir letras e números.' });
    }

    try {
        // Verifica se o email já está em uso
        const emailExists = await prisma.email.findUnique({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ error: 'Email já em uso' });
        }

        // Cria o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo usuário no banco de dados
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                password: hashedPassword,
                emails: { create: { email } }, // Cria o email vinculado ao usuário
            },
            include: {
                emails: true // Inclui os emails na resposta
            }
        });

        // Retorna o usuário criado com status 201
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

/**
 * Função para deletar um usuário
 * 
 * Deleta um usuário com base no ID fornecido. Retorna status 204 em caso de sucesso.
 */
async function deleteUser(req, res) {
    const id = parseInt(req.params.id);
    try {
        // Verifica se o usuário existe antes de deletar
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Deleta o usuário do banco de dados
        await prisma.user.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
}

/**
 * Função para atualizar os dados de um usuário
 * 
 * Atualiza as informações de um usuário, incluindo o nome, sobrenome e senha, se fornecidos.
 */
async function updateUser(req, res) {
    const id = parseInt(req.params.id);
    const { firstName, lastName, currentPassword, newPassword, confirmNewPassword } = req.body;

    // Verifica se a senha atual foi fornecida
    if (!currentPassword) {
        return res.status(400).json({ error: 'Senha atual é obrigatória para atualização.' });
    }

    try {
        // Busca o usuário no banco de dados
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Verifica se a senha atual está correta
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Senha atual incorreta.' });
        }

        // Inicializa o valor de hashedPassword como a senha atual
        let hashedPassword = user.password;

        // Se nova senha for fornecida, valida e atualiza
        if (newPassword && confirmNewPassword) {
            // Remove espaços extras
            const trimmedNewPassword = newPassword.trim();
            const trimmedConfirmNewPassword = confirmNewPassword.trim();

            // Valida a nova senha
            if (!validatePassword(trimmedNewPassword)) {
                return res.status(400).json({ error: 'Nova senha inválida. Deve conter pelo menos 6 caracteres, letras e números.' });
            }

            // Verifica se as novas senhas coincidem
            if (trimmedNewPassword !== trimmedConfirmNewPassword) {
                return res.status(400).json({ error: 'A nova senha e a confirmação não coincidem.' });
            }

            // Gera o hash da nova senha
            hashedPassword = await bcrypt.hash(trimmedNewPassword, 10);
        }

        // Cria um objeto com os dados que precisam ser atualizados
        const updateData = {};

        if (firstName) {
            updateData.firstName = firstName;
        }
        if (lastName) {
            updateData.lastName = lastName;
        }
        if (newPassword) {
            updateData.password = hashedPassword; // Atualiza a senha, se fornecida
        }

        // Atualiza os dados do usuário no banco de dados
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        // Se a senha foi atualizada, gera um novo token JWT
        let token = null;
        if (newPassword) {
            token = generateToken(updatedUser);  // Gera um novo token JWT
        }

        // Retorna o usuário atualizado e o novo token (se houver)
        res.status(200).json({
            user: updatedUser,
            token: token || null  // Retorna o token apenas se ele foi gerado
        });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
}

// Exportando as funções para uso em outras partes do sistema
module.exports = {
    login,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
