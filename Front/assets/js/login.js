// Aguarda o carregamento completo do DOM antes de adicionar os ouvintes de evento
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário (recarga da página)
  
    // Obtém os valores dos campos de entrada do email e da senha
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Cria o objeto payload com os dados para enviar ao servidor
    const payload = { email, password };
  
    try {
      // Realiza uma requisição POST para o servidor de login
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',  // Método HTTP POST
        headers: { 'Content-Type': 'application/json' },  // Define o tipo de conteúdo como JSON
        body: JSON.stringify(payload),  // Converte os dados em JSON e envia no corpo da requisição
      });
  
      // Converte a resposta para JSON
      const data = await response.json();
  
      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
        // Se o login for bem-sucedido, armazena o token JWT no localStorage
        localStorage.setItem('token', data.token);  // Armazena o token JWT no localStorage
        
        // Exibe uma mensagem de sucesso ao usuário
        alert('Login bem-sucedido!');
        
        // Redireciona para a página de lista de usuários (ou outra página conforme necessário)
        window.location.replace('userList.html'); // Substitua com a URL correta de sua página
      } else {
        // Exibe a mensagem de erro recebida do servidor (caso haja)
        alert(data.error || 'Ocorreu um erro no login');
      }
    } catch (error) {
      // Em caso de erro na requisição ou no servidor
      console.error('Erro de conexão', error);
      alert('Erro de conexão, tente novamente mais tarde');
    }
});
