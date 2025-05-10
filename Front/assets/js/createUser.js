// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  
  // Obtém o formulário e os campos de entrada dos dados do usuário
  const userForm = document.getElementById('userForm');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Adiciona um ouvinte de evento para o envio do formulário
  userForm.addEventListener('submit', async (event) => {
    // Evita que o formulário seja enviado de forma tradicional (recarregando a página)
    event.preventDefault();

    // Cria o objeto de dados (payload) com as informações do formulário
    const payload = {
      firstName: firstNameInput.value,  // Nome do usuário
      lastName: lastNameInput.value,    // Sobrenome do usuário
      email: emailInput.value,          // Email do usuário
      password: passwordInput.value,    // Senha do usuário
    };

    try {
      // Realiza uma requisição POST para o servidor para criar um novo usuário
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',  // Método HTTP POST
        headers: { 'Content-Type': 'application/json' },  // Define o tipo de conteúdo como JSON
        body: JSON.stringify(payload),  // Envia os dados do usuário no formato JSON
      });

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
        alert('✅ Usuário Cadastrado!');  // Informa ao usuário que o cadastro foi realizado com sucesso
        userForm.reset();  // Limpa os campos do formulário
        window.location.replace('index.html'); // Redireciona para a página principal (index.html)
      } else {
        // Se a resposta não for OK, exibe a mensagem de erro retornada pelo servidor
        const errorText = await response.text();
        alert('⚠️ Erro ao cadastrar usuário: ' + errorText);
      }
    } catch (error) {
      // Se ocorrer algum erro na requisição, exibe uma mensagem de erro
      console.error('Requisição Falhou:', error);
      alert('❌ Erro de comunicação com o servidor.');
    }
  });
});
