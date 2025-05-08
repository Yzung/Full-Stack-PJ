// Evento disparado quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos da página
    const userTableBody = document.querySelector('#userTable tbody');
    const modal = document.getElementById('editModal');
    const modalClose = document.querySelector('.close');
    const modalForm = document.getElementById('editUserForm');
    const nomeInput = document.getElementById('editNome');
    const sobrenomeInput = document.getElementById('editSobrenome');
    const senhaInput = document.getElementById('editSenha');
    let editingId = null;

    // Função para carregar os usuários na tabela
    async function loadUsers() {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json(); // Converte a resposta para JSON
        console.log(users);  // Verifica os dados retornados da API no console
        userTableBody.innerHTML = ''; // Limpa a tabela antes de preencher com os novos dados

        // Preenche a tabela com os dados dos usuários
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nome}</td>
                <td>${user.sobrenome}</td>
                <td>${new Date(user.criadoEm).toLocaleString().replace(/:\d{2}$/, '')}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${user.id}">Editar</button>
                    <button class="delete-btn" data-id="${user.id}">Deletar</button>
                </td>
            `;
            userTableBody.appendChild(row); // Adiciona a linha na tabela
        });

        attachActions(); // Anexa as ações de editar e deletar aos botões
    }

    // Função para associar as ações de editar e deletar aos botões
    function attachActions() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                editingId = btn.dataset.id; // Guarda o ID do usuário que será editado
                const res = await fetch(`http://localhost:3000/users/${editingId}`);
                const user = await res.json();
                nomeInput.value = user.nome; // Preenche o formulário de edição com os dados do usuário
                sobrenomeInput.value = user.sobrenome;
                senhaInput.value = ''; // Limpa o campo de senha
                modal.style.display = 'flex'; // Abre o modal de edição
            });
        });

        // Ação de deletar usuário
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' }); // Deleta o usuário
                loadUsers(); // Recarrega a lista de usuários após a exclusão
            });
        });
    }

    // Fechar o modal de edição
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Evento de envio do formulário de edição
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio padrão do formulário
        const payload = {
            nome: nomeInput.value,
            sobrenome: sobrenomeInput.value,
            senha: senhaInput.value
        };

        // Envia a requisição PUT para atualizar os dados do usuário
        await fetch(`http://localhost:3000/users/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        modal.style.display = 'none'; // Fecha o modal
        loadUsers(); // Recarrega a lista de usuários após a edição
    });

    loadUsers(); // Carrega os usuários ao inicializar a página
});
