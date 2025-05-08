document.addEventListener('DOMContentLoaded', () => {
  const userTableBody = document.querySelector('#user-table tbody');
  const addUserForm = document.getElementById('addUserForm');
  const nomeInput = document.getElementById('nome');
  const sobrenomeInput = document.getElementById('sobrenome');
  const senhaInput = document.getElementById('senha');

  // Carrega os usuários ao abrir a página
  async function loadUsers() {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    userTableBody.innerHTML = ''; // Limpa a tabela antes de inserir os dados

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${user.sobrenome}</td>
        <td><button onclick="deleteUser(${user.id})">Deletar</button></td>
      `;
      userTableBody.appendChild(row);
    });
  }

  // Envia dados para criar um novo usuário
  addUserForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio do formulário

    const nome = nomeInput.value;
    const sobrenome = sobrenomeInput.value;
    const senha = senhaInput.value;

    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, sobrenome, senha }),
    });

    const newUser = await response.json();
    console.log('Usuário criado:', newUser);

    loadUsers(); // Recarrega a lista de usuários
    addUserForm.reset(); // Limpa os campos do formulário
  });

  // Deleta um usuário
  window.deleteUser = async (id) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      loadUsers(); // Recarrega a lista de usuários após exclusão
      console.log(`Usuário ${id} deletado`);
    } else {
      console.log('Erro ao deletar usuário');
    }
  };

  // Carrega os usuários ao iniciar
  loadUsers();
});
