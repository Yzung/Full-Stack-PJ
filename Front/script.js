document.addEventListener('DOMContentLoaded', () => {
  const userTableBody = document.querySelector('#userTable tbody');
  const userForm = document.getElementById('userForm');
  const nomeInput = document.getElementById('nome');
  const sobrenomeInput = document.getElementById('sobrenome');
  const senhaInput = document.getElementById('senha');
  const submitButton = userForm.querySelector('button[type="submit"]');

  async function loadUsers() {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    userTableBody.innerHTML = '';

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${user.sobrenome}</td>
        <td class="actions">
          <button class="edit-btn" data-id="${user.id}">Editar</button>
          <button class="delete-btn" data-id="${user.id}">Deletar</button>
        </td>
      `;
      userTableBody.appendChild(row);
    });

    attachActionListeners();
  }

  function attachActionListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        const response = await fetch(`http://localhost:3000/users/${id}`);
        const user = await response.json();

        nomeInput.value = user.nome;
        sobrenomeInput.value = user.sobrenome;
        senhaInput.value = '';
        userForm.dataset.editingId = id;
        submitButton.textContent = 'Atualizar Usuário';
      });
    });

    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) loadUsers();
        else console.error('Erro ao deletar usuário');
      });
    });
  }

  userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = nomeInput.value;
    const sobrenome = sobrenomeInput.value;
    const senha = senhaInput.value;
    const editingId = userForm.dataset.editingId;

    const payload = { nome, sobrenome, senha };

    let response;
    if (editingId) {
      response = await fetch(`http://localhost:3000/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      delete userForm.dataset.editingId;
      submitButton.textContent = 'Criar Usuário';
    } else {
      response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (response.ok) {
      loadUsers();
      userForm.reset();
    } else {
      console.error('Erro ao salvar usuário');
    }
  });

  loadUsers();
});
