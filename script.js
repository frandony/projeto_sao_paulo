// espera a pagina carregar antes de configurar tudo
document.addEventListener('DOMContentLoaded', () => {
  configurarTema();
  configurarFormulario();
  configurarEstatisticas();
  configurarTabela();
});

// modo claro/escuro
function configurarTema() {
  const botaoTema = document.getElementById('botao-tema');
  const corpo = document.body;

  // se o usuario ja escolheu um tema antes, usa ele
  if (localStorage.getItem('tema') === 'claro') {
    corpo.classList.add('tema-claro');
    botaoTema.textContent = '☀️';
  }

  botaoTema.addEventListener('click', () => {
    corpo.classList.toggle('tema-claro');

    if (corpo.classList.contains('tema-claro')) {
      botaoTema.textContent = '☀️';
      localStorage.setItem('tema', 'claro');
    } else {
      botaoTema.textContent = '🌙';
      localStorage.setItem('tema', 'escuro');
    }
  });
}

// validacao do formulario de contato
function configurarFormulario() {
  const formulario = document.getElementById('form-contato');
  const campoNome = document.getElementById('nome');
  const campoEmail = document.getElementById('email');
  const campoTelefone = document.getElementById('telefone');
  const mensagem = document.getElementById('msg-form');

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // aceita telefones com 8 a 11 numeros, com ou sem formatacao
  const regexTelefone = /^\D*(\d\D*){8,11}$/;

  function marcarCampo(campo, valido) {
    campo.classList.toggle('campo-ok', valido);
    campo.classList.toggle('campo-erro', !valido);
    return valido;
  }

  function validarNome() {
    return marcarCampo(campoNome, campoNome.value.trim().length >= 3);
  }

  function validarEmail() {
    return marcarCampo(campoEmail, regexEmail.test(campoEmail.value.trim()));
  }

  function validarTelefone() {
    return marcarCampo(campoTelefone, regexTelefone.test(campoTelefone.value.trim()));
  }

  campoNome.addEventListener('input', validarNome);
  campoEmail.addEventListener('input', validarEmail);
  campoTelefone.addEventListener('input', validarTelefone);

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nomeOk = validarNome();
    const emailOk = validarEmail();
    const telefoneOk = validarTelefone();

    if (nomeOk && emailOk && telefoneOk) {
      mensagem.textContent = 'Mensagem enviada com sucesso!';
      mensagem.className = 'msg-form sucesso';

      formulario.reset();
      [campoNome, campoEmail, campoTelefone].forEach((campo) => {
        campo.classList.remove('campo-ok', 'campo-erro');
      });
    } else {
      mensagem.textContent = 'Verifique os campos destacados antes de enviar.';
      mensagem.className = 'msg-form erro';
    }
  });
}

// contador animado da secao "Sao Paulo em numeros"
function configurarEstatisticas() {
  const secaoEstatisticas = document.getElementById('estatisticas');
  if (!secaoEstatisticas) return;

  const numeros = secaoEstatisticas.querySelectorAll('.numero-stat');
  const duracao = 1500;

  function animarNumero(elemento) {
    const alvo = Number(elemento.dataset.alvo);
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const valorAtual = Math.floor(progresso * alvo);
      elemento.textContent = valorAtual.toLocaleString('pt-BR');

      if (progresso < 1) {
        requestAnimationFrame(passo);
      }
    }

    requestAnimationFrame(passo);
  }

  // anima os numeros so quando a secao aparece na tela, e so uma vez
  const observador = new IntersectionObserver((entradas, observer) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        numeros.forEach(animarNumero);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observador.observe(secaoEstatisticas);
}

// ordenacao da tabela comparativa de cidades
function configurarTabela() {
  const tabela = document.getElementById('tabela-comparativa');
  if (!tabela) return;

  const cabecalhos = tabela.querySelectorAll('th.th-ordenavel');
  const corpoTabela = tabela.querySelector('tbody');

  // ordem usada nas colunas de nivel (baixa, media, alta, muito alta)
  const ordemNiveis = {
    'baixa': 1,
    'média': 2,
    'alta': 3,
    'muito alta': 4
  };

  cabecalhos.forEach((cabecalho, indice) => {
    cabecalho.addEventListener('click', () => {
      const crescente = !cabecalho.classList.contains('ordenado-asc');
      const tipo = cabecalho.dataset.tipo;
      const linhas = Array.from(corpoTabela.querySelectorAll('tr'));

      linhas.sort((linhaA, linhaB) => {
        const textoA = linhaA.children[indice].textContent.trim().toLowerCase();
        const textoB = linhaB.children[indice].textContent.trim().toLowerCase();

        const valorA = tipo === 'nivel' ? (ordemNiveis[textoA] || 0) : textoA;
        const valorB = tipo === 'nivel' ? (ordemNiveis[textoB] || 0) : textoB;

        if (valorA < valorB) return crescente ? -1 : 1;
        if (valorA > valorB) return crescente ? 1 : -1;
        return 0;
      });

      linhas.forEach((linha) => corpoTabela.appendChild(linha));

      // atualiza as setinhas mostrando qual coluna esta ordenada
      cabecalhos.forEach((th) => th.classList.remove('ordenado-asc', 'ordenado-desc'));
      cabecalho.classList.add(crescente ? 'ordenado-asc' : 'ordenado-desc');
    });
  });
}
