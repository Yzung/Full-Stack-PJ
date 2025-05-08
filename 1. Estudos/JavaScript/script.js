// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o corpo da tabela onde os usuários serão listados
    const userTableBody = document.querySelector('#userTable tbody');
  
    // Seleciona o formulário de cadastro de usuário
    const userForm = document.getElementById('userForm');
  
    // Seleciona os inputs do formulário
    const nomeInput = document.getElementById('nome');
    const sobrenomeInput = document.getElementById('sobrenome');
    const senhaInput = document.getElementById('senha');
  
    // Função que busca os usuários no backend e renderiza na tabela
    async function loadUsers() {
      const response = await fetch('http://localhost:3000/users'); // Faz GET para buscar todos os usuários
      const users = await response.json(); // Converte a resposta para JSON
      userTableBody.innerHTML = ''; // Limpa o conteúdo da tabela antes de preencher novamente
  
      // Para cada usuário retornado, cria uma linha na tabela
      users.forEach(user => {
        const row = document.createElement('tr'); // Cria elemento de linha
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.nome}</td>
          <td>${user.sobrenome}</td>
          <td><button onclick="deleteUser(${user.id})">Deletar</button></td>
        `; // Monta as células com os dados
        userTableBody.appendChild(row); // Adiciona a linha na tabela
      });
    }
  
    // Listener para o submit do formulário de cadastro
    userForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Impede que o formulário recarregue a página
  
      // Captura os valores dos inputs
      const nome = nomeInput.value;
      const sobrenome = sobrenomeInput.value;
      const senha = senhaInput.value;
  
      // Envia os dados para o backend via POST
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST', // Método HTTP POST
        headers: {
          'Content-Type': 'application/json', // Informa que está enviando JSON
        },
        body: JSON.stringify({ nome, sobrenome, senha }), // Corpo da requisição com os dados
      });
  
      const newUser = await response.json(); // Converte a resposta em JSON
      console.log('Usuário criado:', newUser); // Loga o novo usuário criado
  
      loadUsers(); // Atualiza a lista de usuários
      userForm.reset(); // Limpa o formulário
    });
  
    // Função global (acessível no onclick do botão) para deletar usuário
    window.deleteUser = async (id) => {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE', // Método HTTP DELETE para remover o usuário
      });
  
      if (response.ok) {
        loadUsers(); // Atualiza a lista após a exclusão
        console.log(`Usuário ${id} deletado`); // Loga confirmação
      } else {
        console.log('Erro ao deletar usuário'); // Loga erro
      }
    };
  
    // Executa o carregamento da lista de usuários ao abrir a página
    loadUsers();
  });
  