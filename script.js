// Seleção de elementos
//Cria funções para não ter que ficar repetindo o document.querySelector...
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// Criou Variáveis para todas os elementos necessario retirados do HTML
const inicio = $('#home'),
  meio = $('main'),
  fim = $('#fim'),
  selecionaLobo = $('#lobo'),
  selecionaCordeiro = $('#cordeiro'),
  jogadorLobo = $('.playerLobo'),
  jogadorCordeiro = $('.playerCordeiro'),
  imgDadoCordeiro = $('#imagemDadoCordeiro'),
  imgDadoLobo = $('#imagemDadoLobo'),
  imgDadoCentro = $(`#imagemDadoCentral`),
  textResult = $('#txtResult'),
  replay = $('#replay'),
  cells = $$('.cell')

// Criou variaveis sem valor que ganharam valor futuramente
let jogadorAtualSelecionado = null,
  dadoAtual = null

//Inicializa o Jogo
const iniciarJogo = (jogador) => {
  inicio.classList.add('hide')
  meio.classList.remove('hide')
  //Coloca os jogadores em um array de forma que fica mais facil retirar o id caso algum tenha e adicionar no que foi escolhido
  ;[jogadorLobo, jogadorCordeiro].forEach((j) => j.removeAttribute('id'))
  jogador.setAttribute('id', 'selecionado')
  jogadorAtualSelecionado = jogador
  // Aplica o id="selecionado" na pontSmal correta em telas pequenas
  if (window.matchMedia('(max-width: 600px)').matches) {
    document
      .querySelectorAll('.pontSmal')
      .forEach((el) => el.removeAttribute('id'))

    const pontSmalAlvo = jogador.classList.contains('playerCordeiro')
      ? document.querySelector('.TabCord .pontSmal')
      : document.querySelector('.TabLob .pontSmal')

    if (pontSmalAlvo) {
      pontSmalAlvo.setAttribute('id', 'selecionado')
    }
  }
  iniciarTurno()
}

// Eventos para iniciar o jogo
selecionaLobo.onclick = () => iniciarJogo(jogadorLobo)
selecionaCordeiro.onclick = () => iniciarJogo(jogadorCordeiro)

// Turno
const iniciarTurno = () => {
  dadoAtual = Math.floor(Math.random() * 6) + 1
  mostrarDado()
}

const mostrarDado = () => {
  //Oculta todas as imgs
  ;[imgDadoCordeiro, imgDadoLobo].forEach((img) => (img.style.display = 'none'))
  //Verifica se tem um jogador atual
  if (!jogadorAtualSelecionado) return

  //Determina quem tá jogando e então mostra o dado na mesa de quem tá jogando
  const isCordeiro =
    jogadorAtualSelecionado.classList.contains('playerCordeiro')
  const imgDado = isCordeiro ? imgDadoCordeiro : imgDadoLobo
  imgDado.src = `dados/${dadoAtual}.png`
  imgDado.alt = `Dado ${dadoAtual}`
  imgDado.style.display = 'block'

  //Mostra o dado no espaço do dado em telas pequenas
  if (!window.matchMedia('(max-width: 600px)').matches) return

  if (!jogadorAtualSelecionado) return

  imgDadoCentro.src = `dados/${dadoAtual}.png`
  imgDadoCentro.alt = `Dado do ${nomeJogador}: ${dadoAtual}`
  imgDadoCentro.style.display = 'block'
  imgDadoCentro.style.width = '8em'
}

// Jogar na coluna

//Torna as cell clicaveis ao mesmo tempo que chama a função jogar na coluna
cells.forEach(
  (cell) => (cell.onclick = () => jogarNaColuna(+cell.dataset.coluna)) //nesse caso o +cell.dataset.coluna passa como parametro para a função o numero da coluna da cell
)

const jogarNaColuna = (coluna) => {
  // Descobre quem está jogando
  if (!jogadorAtualSelecionado) return
  const isCordeiro =
    jogadorAtualSelecionado.classList.contains('playerCordeiro')
  //Simplifica a seleção do tabuleiro usando a função $
  const tabuleiro = $(`${isCordeiro ? '.TabCord' : '.TabLob'} .tabuleiro`)
  const tabuleiroOponente = $(
    `${isCordeiro ? '.TabLob' : '.TabCord'} .tabuleiro`
  )

  // Seleciona todas as células da coluna e armazena num array
  const celulasDaColuna = Array.from(
    tabuleiro.querySelectorAll(`[data-coluna="${coluna}"]`)
  )

  //Muda a orientação para que no tabuleiro do cordeiro comece de baixo
  if (isCordeiro) celulasDaColuna.reverse()

  // Encontra a primeira célula vazia usando metodos para facilitar essa busca
  const celulaDisponivel = celulasDaColuna.find((c) => !c.innerHTML.trim())

  //Ao encontrar a celula vazia adiciona o dado a ela
  if (celulaDisponivel) {
    const src = isCordeiro ? imgDadoCordeiro.src : imgDadoLobo.src
    const dadoHTML = window.matchMedia('(max-width: 600px)').matches
      ? `<img src="${src}" alt="dado" width="80em" data-valor="${dadoAtual}">`
      : `<img src="${src}" alt="dado" width="100em" data-valor="${dadoAtual}">`

    celulaDisponivel.innerHTML = dadoHTML

    aplicarRegras(coluna, dadoAtual, isCordeiro)
    atualizaPontos()
    if (verificaFimJogo()) verificaVencedor()
    else trocarJogador()
  } else {
    alert('Essa coluna está cheia! Escolha outra.')
  }
}

// Aplica as regras do Jogo
const aplicarRegras = (coluna, valorDado, isCordeiro) => {
  regraDestruicao(coluna, valorDado, isCordeiro)
  atualizaTabuleiro(coluna, isCordeiro)
}

//Atualiza os pontos do tabuleiro e o fundo de acordo com eles
const atualizaTabuleiro = (coluna, isCordeiro) => {
  const tabuleiro = $(`${isCordeiro ? '.TabCord' : '.TabLob'} .tabuleiro`)
  //Busca todas as celulas na coluna específica usando data-coluna="${coluna}" e trasnforma em array
  const celulas = Array.from(
    tabuleiro.querySelectorAll(`[data-coluna="${coluna}"]`)
  )
  const contagem = {} // Mapeia quantas vezes cada numero aparece na coluna

  //Extrai o valor dos dados de cada cell
  celulas.forEach((cel) => {
    const img = cel.querySelector('img')
    if (img) {
      const valor = +img.dataset.valor
      contagem[valor] = (contagem[valor] || 0) + 1 // Se contagem[valor] ainda não existe, ele começa em 0. Se já existe, ele incrementa +1
    }
  })

  //Transforma o objeto contagem[valor] em um array de pares chave-valor sendo contagem[valor,rep]
  Object.entries(contagem).forEach(([valor, rep]) => {
    //Define que só vai executar o codigo se ele aparecer 2 ou + vezes
    if (rep >= 2) {
      celulas.forEach((cel) => {
        const img = cel.querySelector('img')
        if (img?.dataset.valor == valor)
          //id da cell recebe rep, se rep é >= a 3 então a, senão então b
          cel.id = rep >= 3 ? 'fundo-3d' : 'fundo-2d'
      })
    }
  })
}

const regraDestruicao = (coluna, valor, isCordeiro) => {
  const adversario = $(`${isCordeiro ? '.TabLob' : '.TabCord'} .tabuleiro`)
  //Seleciona todas as imagens de dados dentro da coluna escolhida
  adversario
    .querySelectorAll(`[data-coluna="${coluna}"] img`)
    .forEach((img) => {
      //Para cada img ele vai aplicar a regra de extrair o numero da imagem pra então remover se o valor dele for igual ao valor do parametro recebido
      if (+extrairNumeroDoSrc(img.src) === valor) {
        const cell = img.parentElement // Pegamos a célula que contém o dado
        cell.innerHTML = '' // Removemos o dado
        cell.removeAttribute('id') // Também limpamos qualquer fundo especial
      }
    })
}

//Extrai o valor da imagem e ele sendo >= 1 ele é retornado
const extrairNumeroDoSrc = (src) => +(src.match(/(\d+)\.png$/)?.[1] || 0)

// Atualizar Pontuação
const atualizaPontos = () =>
  ['.TabCord', '.TabLob'].forEach((tab) => calcularPontuacao(tab))

const calcularPontuacao = (selectorTabuleiro) => {
  const tabuleiro = $(`${selectorTabuleiro} .tabuleiro`)
  let total = 0

  //Percorre cada coluna
  ;[0, 1, 2].forEach((col) => {
    //Armazena os valores retirados da coluna em um array
    const valores = Array.from(
      tabuleiro.querySelectorAll(`[data-coluna="${col}"] img`)
    ).map((img) => +img.dataset.valor)
    //Verifica quantas vezes o nuemro aparece
    const contagem = valores.reduce(
      (acc, val) => ((acc[val] = (acc[val] || 0) + 1), acc),
      {}
    )

    //Calcula a pontuação da coluna
    let somaColuna = Object.entries(contagem).reduce(
      (soma, [val, qtde]) => soma + val * qtde * qtde,
      0
    ) //soma += valor * quantidade * quantidade

    //Atualiza visualmente o valor da coluna na tela
    $(`${selectorTabuleiro} .pont[data-coluna="${col}"]`).textContent =
      somaColuna
    total += somaColuna
  })

  $(`${selectorTabuleiro} .total`).textContent = `Total: ${total}`

  const nomeJogador = selectorTabuleiro.includes('Lob') ? 'Lobo' : 'Cordeiro'

  const textoTotal = window.matchMedia('(max-width: 600px)').matches
    ? `${nomeJogador}: ${total}`
    : `Total:`

  $(`${selectorTabuleiro} .pontSmal`).textContent = textoTotal
}

// Verificar fim do jogo
const verificaFimJogo = () => {
  const tabuleiros = ['.TabLob .cell', '.TabCord .cell']
  //Verifica se os tabuleiros estão cheios
  const jogoCheio = tabuleiros.some((tab) =>
    Array.from($$(tab)).every((c) => c.querySelector('img'))
  )

  if (jogoCheio) {
    meio.classList.add('hide')
    fim.classList.remove('hide')
    return true
  }
  return false
}

// Verificar vencedor
const verificaVencedor = () => {
  const totalLobo = calcularTotal('.TabLob')
  const totalCordeiro = calcularTotal('.TabCord')

  textResult.textContent =
    totalLobo > totalCordeiro
      ? 'Vitória do Lobo!'
      : totalCordeiro > totalLobo
      ? 'Vitória do Cordeiro!'
      : 'Empate!'
}

const calcularTotal = (selector) => {
  //Com o .pont armazena todos os pontos num array para com o reduce somar eles
  return Array.from($$(`${selector} .pont`)).reduce(
    (sum, p) => sum + (+p.textContent || 0),
    0
  )
}

//Muda de jogador
const trocarJogador = () => {
  // Define quem será o próximo
  const novoJogador =
    jogadorAtualSelecionado === jogadorCordeiro ? jogadorLobo : jogadorCordeiro

  // Atualiza id visual dos nomes dos jogadores (em cima/embaixo)
  ;[jogadorCordeiro, jogadorLobo].forEach((j) => j.removeAttribute('id'))
  novoJogador.setAttribute('id', 'selecionado')
  jogadorAtualSelecionado = novoJogador

  // Atualiza id="selecionado" em .pontSmal nas telas pequenas
  if (window.matchMedia('(max-width: 600px)').matches) {
    // Remove id anterior de ambas as pontSmal
    document
      .querySelectorAll('.pontSmal')
      .forEach((el) => el.removeAttribute('id'))

    // Aplica id="selecionado" na pontSmal correta
    const pontSmalAlvo = novoJogador.classList.contains('playerCordeiro')
      ? document.querySelector('.TabCord .pontSmal')
      : document.querySelector('.TabLob .pontSmal')

    if (pontSmalAlvo) {
      pontSmalAlvo.setAttribute('id', 'selecionado')
    }
  }

  // Inicia o próximo turno
  iniciarTurno()
}

// Botão de replay
replay.onclick = () => window.location.reload()
