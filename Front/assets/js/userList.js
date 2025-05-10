// Aguarda o carregamento completo do DOM antes de inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.querySelector('#userTable tbody');  // Corpo da tabela de usuários
    const modal = document.getElementById('editModal');  // Modal de edição de usuário
    const modalClose = document.querySelector('.close');  // Botão de fechar o modal
    const modalForm = document.getElementById('editUserForm');  // Formulário de edição de usuário
  
    // Inputs do formulário de edição
    const firstNameInput = document.getElementById('editFirstName');
    const lastNameInput = document.getElementById('editLastName');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
  
    let editingId = null;  // Armazena o ID do usuário que está sendo editado
  
    // Função para carregar a lista de usuários
    async function loadUsers() {
        try {
            // Faz uma requisição para buscar a lista de usuários
            const response = await fetch('http://localhost:3000/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Adiciona o token JWT ao cabeçalho
                }
            });
            const users = await response.json();
            userTableBody.innerHTML = '';  // Limpa o corpo da tabela
  
            // Preenche a tabela com os dados dos usuários
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()} ${new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${user.id}">Editar</button>
                        <button class="delete-btn" data-id="${user.id}">Excluir</button>
                    </td>
                `;
                userTableBody.appendChild(row);  // Adiciona a linha na tabela
            });
  
            // Adiciona eventos para os botões de editar e excluir
            attachActions();
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            alert('Erro ao carregar usuários. Verifique a conexão com o servidor.');
        }
    }
  
    // Função para associar as ações de editar e excluir aos botões
    function attachActions() {
        // Evento para o botão de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                editingId = btn.dataset.id;  // Armazena o ID do usuário a ser editado
                try {
                    // Busca os dados do usuário a ser editado
                    const res = await fetch(`http://localhost:3000/users/${editingId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Adiciona o token JWT
                        }
                    });
                    const user = await res.json();
                    // Preenche os campos do formulário com os dados do usuário
                    firstNameInput.value = user.firstName;
                    lastNameInput.value = user.lastName;
                    currentPasswordInput.value = '';  // Limpa os campos de senha
                    newPasswordInput.value = '';
                    confirmNewPasswordInput.value = '';
                    modal.style.display = 'block';  // Exibe o modal de edição
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                    alert('Erro ao buscar dados do usuário.');
                }
            });
        });
  
        // Evento para o botão de excluir
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const confirmDelete = confirm('Tem certeza que deseja excluir este usuário?');
                if (!confirmDelete) return;  // Se o usuário cancelar, não faz nada
  
                try {
                    // Faz uma requisição DELETE para excluir o usuário
                    await fetch(`http://localhost:3000/users/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Adiciona o token JWT
                        }
                    });
                    loadUsers();  // Recarrega a lista de usuários após a exclusão
                } catch (error) {
                    console.error('Erro ao excluir usuário:', error);
                    alert('Erro ao excluir usuário.');
                }
            });
        });
    }
  
    // Evento para fechar o modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';  // Fecha o modal
    });
  
    // Envio do formulário de edição
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Previne o comportamento padrão de recarregar a página
  
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;
  
        // Validação dos campos obrigatórios
        if (!firstName || !lastName || !currentPassword) {
            alert('Nome, sobrenome e senha atual são obrigatórios.');
            return;
        }
  
        // Verifica se as senhas coincidem
        if (newPassword && newPassword !== confirmNewPassword) {
            alert('A nova senha e a confirmação não coincidem.');
            return;
        }
  
        try {
            // Cria o payload com os dados do formulário
            const payload = {
                firstName,
                lastName,
                currentPassword,
                newPassword: newPassword || undefined  // Se não houver nova senha, define como undefined
            };
  
            // Envia a requisição para atualizar os dados do usuário
            const response = await fetch(`http://localhost:3000/users/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Adiciona o token JWT
                },
                body: JSON.stringify(payload)
            });
  
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao atualizar usuário.');
            }
  
            // Fecha o modal e recarrega a lista de usuários
            modal.style.display = 'none';
            loadUsers();
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert(error.message);
        }
    });
  
    // Carregar os usuários assim que a página for carregada
    loadUsers();
});
