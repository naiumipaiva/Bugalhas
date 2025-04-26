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

//Seleciona os pontos
const pont = document.querySelectorAll('.pont')

// Seleciona a img da div dado de cada jogador
const imgDadoCordeiro = document.querySelector('#imagemDadoCordeiro')
const imgDadoLobo = document.querySelector('#imagemDadoLobo')

// Seleciona o texto de resultado e o botão de replay
const textResult = document.querySelector('#txtResult')
const replay = document.querySelector('#replay')

//Variaveis para rastrear o jogador e dado atual
let jogadorAtualSelecionado = null
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
  //Por padrão define nenhum display
  imgDadoCordeiro.style.display = 'none'
  imgDadoLobo.style.display = 'none'

  if (!jogadorAtualSelecionado) return

  //Vai definir em qual espaço de dado o dado aparecerá de acordo com o jogador selecionado
  const isCordeiro =
    jogadorAtualSelecionado.classList.contains('playerCordeiro')
  const imgDado = isCordeiro ? imgDadoCordeiro : imgDadoLobo

  imgDado.src = `dados/${n}.png`
  imgDado.alt = `Dado de número ${n}`
  imgDado.style.display = 'block'
}

//2- Jogador escolhe a coluna
function clicaNaColuna() {
  //Torna as cells clicaveis e chama a função que vai possibilitar a jogada
  cells.forEach((cell) => {
    cell.onclick = () => {
      const coluna = parseInt(cell.getAttribute('data-coluna'))
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

  //Muda a orientação para que no tabuleiro do cordeiro comece de baixo
  if (isCordeiro) {
    celulasDaColuna.reverse()
  }

  // Encontra a primeira célula vazia
  const celulaDisponivel = celulasDaColuna.find(
    (cel) => cel.innerHTML.trim() === ''
  )

  //Ao encontrar a celula vazia adiciona o dado a ela
  if (celulaDisponivel) {
    celulaDisponivel.innerHTML = `<img src="${
      isCordeiro ? imgDadoCordeiro.src : imgDadoLobo.src
    }" alt="dado" width="100em" data-valor="${dadoAtual}">`
    regraDestruicao(coluna, dadoAtual, isCordeiro)
    atualizaTabuleiro(coluna, isCordeiro)
    atualizaPontos()
    trocarJogador()
  } else {
    alert('Essa coluna está cheia! Escolha outra.')
  }
}

//3- Atualiza Tabuleiro
function atualizaTabuleiro(coluna, isCordeiro) {
  //Define qual tabuleiro deve ser atualizado
  const tabuleiro = isCordeiro
    ? document.querySelector('.TabCord .tabuleiro')
    : document.querySelector('.TabLob .tabuleiro')

  //Pega todas as celulas da coluna selecionada
  const celulasDaColuna = Array.from(
    tabuleiro.querySelectorAll(`.cell[data-coluna='${coluna}']`)
  )

  //Cria um obj para verificar quantas vezes o valor aparece na coluna
  const contagem = {} // Ex: {1: 2, 3: 1}

  //Pega a img que representa o dado e extrai o valor dela para saber quantas vezes ela se repete
  celulasDaColuna.forEach((celula) => {
    const img = celula.querySelector('img')
    if (img) {
      const valor = parseInt(img.getAttribute('data-valor'))
      if (valor) {
        contagem[valor] = (contagem[valor] || 0) + 1
      }
    }
  })

  // Aplica os IDs conforme a repetição, mas somente se tiver 2 ou mais
  Object.keys(contagem).forEach((valor) => {
    const repeticoes = contagem[valor]
    if (repeticoes >= 2) {
      celulasDaColuna.forEach((celula) => {
        const img = celula.querySelector('img')
        if (img && img.getAttribute('data-valor') === valor) {
          if (repeticoes === 2) {
            celula.id = 'fundo-2d'
          } else if (repeticoes >= 3) {
            celula.id = 'fundo-3d'
          }
        }
      })
    }
  })
}

function regraDestruicao(coluna, valorDado, isCordeiro) {
  //Pega o tabuleiro adversário
  const tabuleiroAdversario = isCordeiro
    ? document.querySelector('.TabLob .tabuleiro')
    : document.querySelector('.TabCord .tabuleiro')

  //Pega as celulas da coluna do adversario e trasnforma num array
  const celulasDaColunaAdversaria = Array.from(
    tabuleiroAdversario.querySelectorAll(`.cell[data-coluna='${coluna}']`)
  )

  //Verifica se o valor da imagem é igual o do dado e remove a imagem da celula caso seja
  celulasDaColunaAdversaria.forEach((celula) => {
    const img = celula.querySelector('img')
    if (img) {
      const valorImagem = extrairNumeroDoSrc(img.src)
      if (valorImagem === valorDado) {
        celula.innerHTML = '' // Remove o dado da célula
        celula.removeAttribute('id')
      }
    }
  })
}

//Pega o número do dado a partir do nome do arquivo de imagem
function extrairNumeroDoSrc(src) {
  const match = src.match(/(\d+)\.png$/)
  return match ? parseInt(match[1]) : null
}

function verificaFimJogo() {}

function verificaVencedor() {}

//Atualiza o número de pontos de cada jogador
function atualizaPontos() {
  calcularPontuacao('.TabCord', 'cordeiro')
  calcularPontuacao('.TabLob', 'lobo')
}

function calcularPontuacao(selectorTabuleiro, jogador) {
  //Define as colunas, o total e de qual tabuleiro esta tirando os dados
  const tabuleiro = document.querySelector(`${selectorTabuleiro} .tabuleiro`)
  const colunas = [0, 1, 2]
  let total = 0

  //Percorre cada uma das colunas para calcular a pontuação
  colunas.forEach((colIndex) => {
    //Converte a lista de celulas em um array
    const celulasColuna = Array.from(
      tabuleiro.querySelectorAll(`.cell[data-coluna="${colIndex}"]`) //Seleciona todas as celulas que pertencem a coluna atual
    )
    const valores = []

    // Coleta os valores dos dados na coluna
    celulasColuna.forEach((cell) => {
      const img = cell.querySelector('img')
      if (img) {
        const valor = parseInt(img.getAttribute('data-valor'))
        if (!isNaN(valor)) valores.push(valor) //adiciona o valor coletado ao array valores
      }
    })

    // Agrupa os dados iguais
    const contagem = {} // Conta a quantidade de dados iguais na coluna
    valores.forEach((valor) => {
      contagem[valor] = (contagem[valor] || 0) + 1
    }) //Se o numero já existe ele incrementa senão, inicia uma contagem

    // Calcula o total da coluna com base na lógica de multiplicação
    let somaColuna = 0 //guarda a pontuação da coluna
    for (let num in contagem) {
      const qtde = contagem[num]
      const soma = num * qtde
      somaColuna += soma * qtde // (num * qtde) * qtde
    }

    // Atualiza a pontuação da coluna
    const topo = document.querySelector(
      `${selectorTabuleiro} .pont[data-coluna="${colIndex}"]`
    )
    if (topo) topo.textContent = somaColuna

    total += somaColuna
  })

  // Atualiza o total geral
  const totalDiv = document.querySelector(`${selectorTabuleiro} .total`)
  if (totalDiv) totalDiv.textContent = `Total: ${total}`
}

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
