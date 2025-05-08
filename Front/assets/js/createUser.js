document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  const nomeInput = document.getElementById('nome');
  const sobrenomeInput = document.getElementById('sobrenome');
  const senhaInput = document.getElementById('senha');

  userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      nome: nomeInput.value,
      sobrenome: sobrenomeInput.value,
      senha: senhaInput.value,
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('✅ Usuário cadastrado com sucesso!');
        userForm.reset();
      } else {
        const errorText = await response.text();
        alert('⚠️ Erro ao cadastrar usuário: ' + errorText);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('❌ Falha na comunicação com o servidor.');
    }
  });
});
