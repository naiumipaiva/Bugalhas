//Seleção de Elementos do HTML

// Seleciona as principais telas do jogo, o inicio, meio e fim
const inicio = document.querySelector('#home')
const meio = document.querySelector('main')
const fim = document.querySelector('#fim')

// Seleciona os id´s dos players para saber qual começa
const selecionaLobo = document.querySelector('#lobo')
const selecionaCordeiro = document.querySelector('#cordeiro')

// Seleciona a vez dos jogadores
const jogadorLobo = document.querySelector('.playerLobo')
const jogadorCordeiro = document.querySelector('.playerCordeiro')

// Seleciona as celulas do tabuleiro
const cells = document.querySelectorAll('.cell')

// Seleciona a img da div dado de cada jogador
const imgDadoCordeiro = document.querySelector('#imagemDadoCordeiro')
const imgDadoLobo = document.querySelector('#imagemDadoLobo')

// Seleciona o texto de resultado e o botão de replay
const textResult = document.querySelector('#txtResult')
const replay = document.querySelector('#replay')

let jogadorAtualSelecionado = null // Variável para rastrear o jogador atual
let dadoAtual = null

//Função para Iniciar o Jogo e definir o jogador que inicia
function iniciarJogo(jogador) {
  inicio.classList.add('hide')
  meio.classList.remove('hide')

  jogadorLobo.removeAttribute('id')
  jogadorCordeiro.removeAttribute('id')

  jogador.setAttribute('id', 'selecionado')
  jogadorAtualSelecionado = jogador
  iniciarTurno()
}

// Event listeners para os botões de escolha do jogador
selecionaLobo.onclick = () => iniciarJogo(jogadorLobo)
selecionaCordeiro.onclick = () => iniciarJogo(jogadorCordeiro)

//1- Inicio do turno
function iniciarTurno() {
  dadoAtual = sortearDado()
  mostrarDado(dadoAtual)
}

function sortearDado() {
  return Math.floor(Math.random() * 6) + 1
}

function mostrarDado(n) {
  imgDadoCordeiro.style.display = 'none'
  imgDadoLobo.style.display = 'none'

  if (!jogadorAtualSelecionado) return

  const isCordeiro =
    jogadorAtualSelecionado.classList.contains('playerCordeiro')
  const imgDado = isCordeiro ? imgDadoCordeiro : imgDadoLobo

  imgDado.src = `dados/${n}.png`
  imgDado.alt = `Dado de número ${n}`
  imgDado.style.display = 'block'
}

//2- Jogador escolhe a coluna
function clicaNaColuna() {
  cells.forEach((cell) => {
    cell.onclick = () => {
      // Usando onclick diretamente para simplificar
      const coluna = parseInt(cell.getAttribute('data-coluna'))
      console.log(`Célula clicada na coluna: ${coluna}`)
      jogarNaColuna(coluna)
    }
  })
}

function jogarNaColuna(coluna) {
  // Descobre quem está jogando
  if (!jogadorAtualSelecionado) return
  const isCordeiro =
    jogadorAtualSelecionado.classList.contains('playerCordeiro')
  const tabuleiro = isCordeiro
    ? document.querySelector('.TabCord .tabuleiro')
    : document.querySelector('.TabLob .tabuleiro')
  const tabuleiroOponente = isCordeiro
    ? document.querySelector('.TabLob .tabuleiro')
    : document.querySelector('.TabCord .tabuleiro')

  // Seleciona todas as células da coluna
  const celulasDaColuna = Array.from(
    tabuleiro.querySelectorAll(`.cell[data-coluna='${coluna}']`)
  )

  if (isCordeiro) {
    celulasDaColuna.reverse()
  }

  // Encontra a primeira célula vazia
  const celulaDisponivel = celulasDaColuna.find(
    (cel) => cel.innerHTML.trim() === ''
  )

  if (celulaDisponivel) {
    celulaDisponivel.innerHTML = `<img src="${
      isCordeiro ? imgDadoCordeiro.src : imgDadoLobo.src
    }" alt="dado" width="100em" data-valor="${dadoAtual}">`
    regraDestruicao(coluna, dadoAtual, isCordeiro)
    trocarJogador()
  } else {
    alert('Essa coluna está cheia! Escolha outra.')
  }
}

//3- Atualiza Tabuleiro

function atualizaTabuleiro() {}

function regraDestruicao(coluna, valorDado, isCordeiro) {
  const tabuleiroAdversario = isCordeiro
    ? document.querySelector('.TabLob .tabuleiro')
    : document.querySelector('.TabCord .tabuleiro')

  const celulasDaColunaAdversaria = Array.from(
    tabuleiroAdversario.querySelectorAll(`.cell[data-coluna='${coluna}']`)
  )

  celulasDaColunaAdversaria.forEach((celula) => {
    const img = celula.querySelector('img')
    if (img) {
      const valorImagem = extrairNumeroDoSrc(img.src)
      if (valorImagem === valorDado) {
        celula.innerHTML = '' // Remove o dado da célula
      }
    }
  })
}

function extrairNumeroDoSrc(src) {
  const match = src.match(/(\d+)\.png$/)
  return match ? parseInt(match[1]) : null
}

function verificaFimJogo() {}

function verificaVencedor() {}

function atualizaPontos() {}

function trocarJogador() {
  if (jogadorAtualSelecionado === jogadorCordeiro) {
    jogadorAtualSelecionado = jogadorLobo
    jogadorLobo.setAttribute('id', 'selecionado')
    jogadorCordeiro.removeAttribute('id')
  } else {
    jogadorAtualSelecionado = jogadorCordeiro
    jogadorCordeiro.setAttribute('id', 'selecionado')
    jogadorLobo.removeAttribute('id')
  }
  iniciarTurno() // Inicia o turno do próximo jogador
}

// Da F5 na pag
replay.onclick = () => window.location.reload()

// Inicializar a possibilidade de clicar nas colunas apenas uma vez
clicaNaColuna()
