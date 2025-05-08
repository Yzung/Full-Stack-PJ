const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

// Método Get para listar todos os usuários
async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany()
        res.json(users)
    } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
}

// Buscar usuário por ID
async function getUserById(req, res) {
    const id = parseInt(req.params.id);
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
  
// Método Post para criar um novo usuário
async function createUser(req, res) {
    const { nome, sobrenome, senha } = req.body
    try{
        const newUser = await prisma.user.create({
            data: {
                nome,
                sobrenome,
                senha
            }
        });
        res.status(201).json(newUser)
    }catch (error){
        console.error('Erro ao criar usuário:', error)
        res.status(500).json({ error: 'Erro ao criar usuário' })
    }
}

// Método Delete para deletar um usuário
async function deleteUser(req, res) {
    const id = parseInt(req.params.id)
    try {
        await prisma.user.delete({
            where: { id }
        })
        res.status(204).send()
    } catch (error) {
        console.error('Erro ao deletar usuário:', error)
        res.status(500).json({ error: 'Erro ao deletar usuário' })
    }
}
// Update de usuário
async function updateUser(req, res) {
    const id = parseInt(req.params.id);
    const { nome, sobrenome, senha } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { nome, sobrenome, senha },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  };