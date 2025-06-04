class FilaBanco {
  constructor() {
    this.fila = [];
    this.historico = [];
    this.limite = 102;
  }

  adicionar(nome, preferencial) {
    if (this.fila.length >= this.limite) {
      alert(`Fila cheia! Limite: ${this.limite}`);
      return false;
    }

    const cliente = {
      nome,
      preferencial,
      horario: new Date().toLocaleTimeString(),
      id: Date.now()
    };

    this.fila.push(cliente);
    this.atualizarInterface();
    return true;
  }

  atender() {
    if (this.fila.length === 0) {
      alert("Fila vazia!");
      return null;
    }

    // Encontra o primeiro preferencial ou o primeiro da fila
    const index = this.fila.findIndex(c => c.preferencial) || 0;
    const atendido = this.fila.splice(index, 1)[0];
    
    this.historico.push(atendido);
    this.atualizarInterface();
    
    return atendido;
  }

  limpar() {
    this.fila = [];
    this.atualizarInterface();
  }

  exportar() {
    return JSON.stringify({
      fila: this.fila,
      historico: this.historico,
      limite: this.limite
    }, null, 2);
  }

  atualizarInterface() {
    const filaElement = document.getElementById('fila');
    const historicoElement = document.getElementById('historico');
    
    // Atualiza fila
    filaElement.innerHTML = this.fila.map((cliente, i) => `
      <li class="${cliente.preferencial ? 'preferencial fifo-animation' : 'fifo-animation'}">
        ${i+1}º - ${cliente.nome} (${cliente.preferencial ? 'Preferencial' : 'Normal'}) - ${cliente.horario}
      </li>
    `).join('');
    
    // Atualiza histórico (mostra últimos 10)
    historicoElement.innerHTML = this.historico.slice(-10).reverse().map(cliente => `
      <li class="${cliente.preferencial ? 'preferencial' : ''}">
        ${cliente.nome} - ${cliente.horario}
      </li>
    `).join('');
    
    // Atualiza contadores
    document.getElementById('total-fila').textContent = this.fila.length;
    document.getElementById('tempo-espera').textContent = this.fila.length * 2;
  }
}

// Inicialização
const fila = new FilaBanco();

// Event Listeners
document.getElementById('btn-adicionar').addEventListener('click', () => {
  const nome = document.getElementById('nome').value.trim();
  const preferencial = document.getElementById('preferencial').checked;
  
  if (nome) {
    fila.adicionar(nome, preferencial);
    document.getElementById('nome').value = '';
    document.getElementById('preferencial').checked = false;
  }
});

document.getElementById('btn-atender').addEventListener('click', () => {
  fila.atender();
});

document.getElementById('btn-limpar').addEventListener('click', () => {
  if (confirm('Limpar toda a fila?')) {
    fila.limpar();
  }
});

document.getElementById('btn-exportar').addEventListener('click', () => {
  const data = fila.exportar();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fila-banco-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
});

// Teste rápido com 5 clientes
fila.adicionar("Cliente 1", false);
fila.adicionar("Cliente 2", true);
fila.adicionar("Cliente 3", false);
fila.adicionar("Cliente 4", true);
fila.adicionar("Cliente 5", false);

// ... (código anterior da classe FilaBanco permanece o mesmo)

// Adicione no final do arquivo, antes da inicialização:
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  document.getElementById('theme-toggle').textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Noturno';
});

// Verificar preferência salva ao carregar
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('theme-toggle').textContent = '☀️ Modo Claro';
}

document.getElementById('btn-teste').addEventListener('click', () => {
  const nomesExemplo = ['Ana', 'Carlos', 'Beatriz', 'Lucas', 'Fernanda', 'João', 'Patrícia', 'Marcos', 'Juliana', 'Mateus'];

  for (let i = 0; i < 100; i++) {
    const nomeAleatorio = nomesExemplo[Math.floor(Math.random() * nomesExemplo.length)] + ' #' + (Math.floor(Math.random() * 1000));
    const preferencial = Math.random() < 0.3; // 30% de chance de ser preferencial
    fila.adicionar(nomeAleatorio, preferencial);
  }
});

// ... (restante do código de inicialização)