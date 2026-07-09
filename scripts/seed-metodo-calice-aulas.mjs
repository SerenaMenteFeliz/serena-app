import { createClient } from "@supabase/supabase-js";

const url = "https://ddgtoebsmmyneumolycy.supabase.co";
const serviceKey = process.argv[2];
if (!serviceKey) {
  console.error("uso: node scripts/seed-metodo-calice-aulas.mjs <service_role_key>");
  process.exit(1);
}
const supabase = createClient(url, serviceKey);

// Aulas práticas reais do Método Cálice — Dias 1 a 10, a partir do documento
// da Ge. Cada dia vira 3 blocos de texto (Leitura → Prática → Reflexão),
// mesmo padrão nos 10 dias independente do "formato" anunciado (📝/🎧/🎥),
// porque ainda não existem os áudios/vídeos gravados de verdade — o roteiro
// da meditação/vídeo entra como texto de leitura por enquanto. Quando a Ge
// gravar, o bloco 2 vira um block_type "video"/"audio" de verdade, sem
// precisar mexer no resto da estrutura.
const lessons = [
  {
    order_index: 1,
    title: "Dia 1 — Detox Mental",
    blocks: [
      {
        markdown: `**Formato:** 📝 Leitura + Exercício escrito

## O Esvaziamento do Cálice

Antes de colocar algo novo dentro de um cálice, você precisa esvaziá-lo.

Parece óbvio. Mas a maioria das pessoas chega em processos de mudança tentando empilhar o novo em cima do velho. Mais informação. Mais técnica. Mais esforço. E aí fica pesado. Confuso. Cansativo.

Não porque a mudança é difícil demais. Mas porque o cálice estava cheio demais.

Hoje não tem tarefa grande. Hoje tem uma única coisa: parar de alimentar o barulho.

Nas próximas horas, você vai fazer um detox de estímulos. Sem redes sociais por 2 horas. Sem notícias. Sem conteúdo no automático. Não porque tudo isso é ruim. Mas porque sua mente precisa ouvir a si mesma antes de ouvir qualquer outra coisa.

Existe uma janela entre o que acontece e a sua reação. A maioria das pessoas nunca encontra essa janela porque nunca para. Hoje você para. E dentro desse silêncio, algo começa.

A clareza não chega antes do movimento. Mas o primeiro movimento, às vezes, é simplesmente parar.

O Detox Mental funciona como um comando direto ao seu sistema nervoso:

> "A guerra acabou. Eu retomo o comando."`,
      },
      {
        markdown: `## Exercício — O Inventário

Pegue papel e caneta. Não o celular.

Responda com honestidade, sem filtro, sem julgamento, sem tentar escrever bonito:

1. **O que está pesando na sua mente agora?** (liste tudo: problemas, pensamentos soltos, preocupações, qualquer coisa)
2. **O que você está evitando pensar?** (o que você empurra pra baixo do tapete mental?)
3. **Qual padrão você mais quer mudar?** (não precisa saber como, só o quê)

Escreva. Não edite. Não organize. Apenas deixe sair.

Esse papel é só seu. Você pode rasgar depois se quiser. O objetivo não é guardar, é esvaziar.`,
      },
      {
        markdown: `### Reflexão

> "O que dentro de mim está pedindo espaço para ser visto?"

### Para desbloquear o Dia 2

Você fez o inventário. Isso já é mais do que a maioria faz.

Lembre: você não precisa resolver tudo hoje. Você só precisava ver. E você viu.

Amanhã começa o esvaziamento mais profundo.`,
      },
    ],
  },
  {
    order_index: 2,
    title: "Dia 2 — O Despejo",
    blocks: [
      {
        markdown: `**Formato:** 📝 Leitura + Exercício escrito

Existe uma coisa que a mente faz que drena mais energia do que qualquer problema real: ela fica girando. O mesmo pensamento. A mesma preocupação. A mesma cena. Em loop.

Não porque você quer pensar nisso. Mas porque o que não é processado fica em suspensão. Ocupando espaço. Consumindo energia. Impedindo o novo de entrar.

Isso tem um nome na neurociência, e tem um nome no senso comum também: ruminação.

E o antídoto não é parar de pensar. É tirar de dentro.

Quando você coloca no papel o que está na cabeça, algo muda fisicamente no seu cérebro. A região responsável pelo estresse desativa. O que parecia enorme na cabeça, no papel, tem tamanho real.

Hoje você vai fazer um despejo mental completo. Sem forma. Sem gramática. Sem julgamento.

O cálice só recebe o novo quando o velho encontra saída.`,
      },
      {
        markdown: `## Exercício — O Despejo Mental

Você vai escrever por 5 minutos sem parar. As regras são simples:

- Não tire a caneta do papel
- Não releia enquanto escreve
- Não corrija nada
- Escreve tudo que vier: pensamentos, sensações, frases soltas, nomes, medos, desejos, raiva, qualquer coisa

Se travar, escreva "não sei o que escrever" até surgir algo. Sempre surge.

Começa agora. 5 minutos.

Quando terminar: leia uma vez com distância, como se fosse de outra pessoa. Observe sem julgar. Depois rasgue ou guarde, você decide.`,
      },
      {
        markdown: `### Reflexão

> "O que eu estava carregando que nem sabia que estava carregando?"

### Para desbloquear o Dia 3

Esvaziamento não é fraqueza. É preparação. Um cálice limpo conduz melhor. Você está conduzindo melhor.

Amanhã vamos ouvir o que o corpo tem a dizer.`,
      },
    ],
  },
  {
    order_index: 3,
    title: "Dia 3 — O Corpo Fala",
    blocks: [
      {
        markdown: `**Formato:** 🎧 Leitura + Áudio de meditação guiada

Você já sentiu aquele aperto no peito antes de uma conversa difícil? Aquela sensação na barriga que dizia "não vai por aí", antes mesmo de você pensar?

Isso não é ansiedade sem motivo. É o seu corpo se comunicando.

A maioria das pessoas vive da cabeça para cima. Analisa, planeja, racionaliza, processa tudo pela mente. E ignora o corpo inteiro.

Mas o seu sistema nervoso registra tudo que a mente ainda não processou. Emoções que você não expressou. Situações que você não digeriu. Tensões que você normalizou. Elas ficam guardadas como contrações musculares, como respiração curta, como desconforto que você nem percebe mais porque já virou parte do "normal".

Hoje você vai ouvir o que está lá. Não para resolver. Não para analisar. Só para ouvir. Porque o primeiro passo para mudar um padrão é percebê-lo. E o corpo é o lugar mais honesto onde os padrões vivem.

Aperte o play na meditação quando estiver em um lugar tranquilo, sem interrupções.`,
      },
      {
        markdown: `## Áudio — Roteiro da Meditação Guiada

*⏱ Duração sugerida: 12–15 minutos · 🎵 Sons da natureza ou instrumental suave, bem baixo*

*(áudio ainda não gravado — leia o roteiro devagar, respeitando as pausas, como uma meditação por conta própria)*

Encontre uma posição confortável. Pode ser sentada ou deitada. Feche seus olhos.

Respire fundo pelo nariz… e solte lentamente pela boca. Mais uma vez. Inspira… e solta. Mais uma vez. Inspira… e solta. *(3x)*

*[pausa de 5 segundos]*

Agora deixa a respiração voltar ao seu ritmo natural. Você não precisa controlar nada. Só observa.

*[pausa]*

Traga a atenção para os seus pés. Só percebe: existe tensão ali? Formigamento? Calor? Não precisa mudar nada. Só sente.

*[pausa de 8 segundos]*

Sobe para as panturrilhas e joelhos. O que você sente? Pesado ou leve? Contraído ou solto? Só observa.

*[pausa de 8 segundos]*

Quadris, barriga, parte baixa das costas. Essa região costuma guardar muito. Respira em direção a ela. Só isso.

*[pausa de 10 segundos]*

Peito e coração. Como está aqui? Existe algum aperto? Alguma emoção que você não nomeou ainda? Não precisa entender. Só sente.

*[pausa de 10 segundos]*

Ombros, pescoço, mandíbula. Três lugares onde o estresse gosta de morar. Respira. E se quiser, na próxima expiração, solta um pouco mais.

*[pausa de 8 segundos]*

Agora percebe o corpo inteiro de uma vez. Se você encontrou tensão em algum lugar, coloca a mão ali, com gentileza. E respira em direção a essa parte. Não para forçar relaxamento. Mas para sinalizar: "Eu te vejo. Pode soltar."

*[pausa de 15 segundos]*

Permaneça aqui por mais um momento.

*[pausa de 20 segundos]*

Quando estiver pronta, começa a mover os dedos das mãos e dos pés. Respira fundo mais uma vez. E abre os olhos no seu tempo.`,
      },
      {
        markdown: `### Reflexão

> "O que meu corpo estava tentando me dizer que eu ainda não tinha ouvido?"

### Para desbloquear o Dia 4

O que não é sentido não pode ser transformado. Hoje você sentiu. Isso importa mais do que parece agora.

Amanhã vamos encontrar a voz que fala mais alto dentro de você, e descobrir de onde ela veio.`,
      },
    ],
  },
  {
    order_index: 4,
    title: "Dia 4 — A Voz Invisível",
    blocks: [
      {
        markdown: `**Formato:** 📝 Leitura + Exercício escrito

Existe uma voz dentro de você que fala o tempo todo. "Isso não é pra mim." "Não vou conseguir." "Sempre acaba assim." "Não mereço."

Você já ouviu ela também né?

Essa voz não é sua intuição. Não é a verdade. É um programa instalado, na infância, por experiências dolorosas, por repetição, por tudo que você ouviu quando ainda não sabia questionar.

O problema não é que essa voz existe. O problema é que, durante anos, você acreditou que ela era você.

E o que você acredita sobre si mesmo... se torna o filtro por onde você enxerga tudo. Suas decisões. Suas relações. O que você permite. O que você evita. Tudo passa por esse filtro invisível.

Mas aqui está o que muda tudo: você não é a voz. Você é quem a ouve. E quem ouve, pode escolher o que faz com o que ouviu.

Hoje você vai trazer essa voz para a luz. Porque o que você vê, você pode mudar. O que permanece no escuro, te controla.`,
      },
      {
        markdown: `## Exercício — Rastreando o Programa

**Parte 1 — Identifica.** Complete essas frases sem pensar muito. Escreva a primeira coisa que vier:

- "Dinheiro é..."
- "Eu sempre..."
- "Pessoas como eu..."
- "Quando as coisas vão bem, geralmente..."
- "No fundo, eu acredito que não mereço..."
- "Eu nunca consigo..."
- "O amor é..."
- "Pra mim, mudar é..."

**Parte 2 — Investiga.** Escolha a frase que mais te impactou. Agora responda:

- Quem falava assim quando eu era criança?
- Que situação me ensinou a acreditar nisso?
- Isso é um fato real — ou é uma crença que virou fato por repetição?

**Parte 3 — Interrompe.** Escreva a crença identificada em uma folha. Abaixo dela, escreva:

> "Eu aprendi isso quando precisava sobreviver. Mas não preciso mais disso para me proteger."
>
> "Eu não sou essa versão. Eu sou quem escolhe o próximo passo."

Não precisa acreditar 100% ainda. Só planta a semente.`,
      },
      {
        markdown: `### Reflexão

> "Que voz dentro de mim está pronta para ser atualizada?"

### Para desbloquear o Dia 5

Ver, é o começo de sair do automático. Não precisa resolver tudo de uma vez. O cérebro não muda em um dia, mas muda com consistência. Você está construindo algo real. Tijolo por tijolo.

Amanhã você vai aprender a criar espaço onde antes havia apenas ruído.`,
      },
    ],
  },
  {
    order_index: 5,
    title: "Dia 5 — O Silêncio Como Ferramenta",
    blocks: [
      {
        markdown: `**Formato:** 🎧 Leitura + Áudio de meditação

O silêncio desconforta porque você não está acostumada a ele. A maioria das pessoas acorda com celular, vive com fone, dorme com série. O barulho virou anestesia. E anestesia não cura. Só adia.

Aqui está o que acontece quando você finalmente para: os pensamentos que você estava evitando aparecem. As emoções que você estava empurrando sobem. E é por isso que o silêncio parece perigoso.

Mas esses pensamentos e emoções já estavam lá. O silêncio não os criou. Só revelou. E o que é revelado pode ser trabalhado.

Existe um estado que o cérebro acessa naturalmente no silêncio — uma frequência onde a criatividade, a intuição e a reorganização interna acontecem. É o mesmo estado dos grandes insights, das ideias que surgem no banho, dos momentos de clareza que ninguém sabe explicar.

Você não precisa meditar por horas. Não precisa esvaziar a mente — isso é impossível. Você só precisa de 12 minutos. E observar o que surge.

O silêncio não é ausência. É onde você se encontra.`,
      },
      {
        markdown: `## Áudio — Meditação do Silêncio Ativo

*⏱ Duração sugerida: 12 minutos · 🎵 Silêncio, ou som muito suave de natureza*

*(áudio ainda não gravado — leia o roteiro devagar, respeitando as pausas)*

Senta confortavelmente. Coluna ereta, mas sem tensão. Mãos no colo. Fecha os olhos.

Respira fundo três vezes. Cada expiração um pouco mais longa que a inspiração.

*[pausa]*

Agora deixa a respiração voltar ao natural. Você não precisa fazer nada. Não precisa chegar em lugar nenhum. Não precisa esvaziar a mente. Só observa.

*[pausa de 10 segundos]*

Os pensamentos vão aparecer. Isso é certo. Quando aparecerem, não briga com eles. Só nota: "Pensamento." E volta para a respiração.

*[pausa de 15 segundos]*

Se vier uma emoção — uma inquietação, um desconforto, uma vontade de abrir o olho — nota também: "Sensação." E volta para a respiração.

*[pausa de 20 segundos]*

Você não é o pensamento. Você é quem observa o pensamento passar.

*[pausa de 20 segundos]*

Permaneça aqui. Só aqui. Só agora.

*[pausa de 30 segundos]*

Se a mente foi longe, tudo bem. Só percebe que foi... e volta. Sem julgamento. Sem culpa. Volta.

*[pausa de 40 segundos]*

Nos próximos momentos, vai surgindo uma pergunta. Não precisa respondê-la agora. Só deixa ela existir: "Quando paro de correr... quem sou eu?"

*[pausa de 30 segundos]*

Respira fundo. Começa a trazer a atenção de volta ao ambiente ao redor. Sons. Temperatura. O peso do corpo. E quando estiver pronta, abre os olhos.`,
      },
      {
        markdown: `### Reflexão

> "O que surgiu quando parei de fugir do silêncio?"

### Para desbloquear o Dia 6

O silêncio é uma prática. Não uma habilidade que você tem ou não tem. Quanto mais você volta a ele, mais fácil fica. Quanto mais fácil fica, mais você acessa o que estava escondido pelo barulho.

Amanhã vamos trabalhar com algo que você usa o dia inteiro sem perceber: sua linguagem interna.`,
      },
    ],
  },
  {
    order_index: 6,
    title: "Dia 6 — A Linguagem que Cria",
    blocks: [
      {
        markdown: `**Formato:** 📝 Leitura + Exercício escrito

Você fala com você mesma o dia inteiro. Não em voz alta, necessariamente. Mas em pensamentos, em frases internas, em histórias que você conta sobre si mesma e sobre o mundo.

E essas palavras não são neutras. Cada vez que você diz "eu nunca consigo", o cérebro trata isso como comando. Cada vez que você diz "sempre é assim comigo", o sistema nervoso confirma o padrão.

Não porque as palavras têm magia. Mas porque o cérebro literalmente ativa os mesmos circuitos neurais da experiência real quando você verbaliza algo, seja em voz alta ou na cabeça.

Falar "estou exausta" produz química de cansaço. Falar "preciso recuperar energia" ativa circuitos de solução. A diferença parece pequena. O efeito acumulado, não.

Isso não é sobre mentir para si mesma. Não é sobre fingir que está bem quando não está. É sobre escolher palavras que abrem possibilidade em vez de travar.

As palavras que você repete constroem a realidade que você habita.`,
      },
      {
        markdown: `## Exercício — Auditoria e Reescrita

**Parte 1 — Auditoria.** Anote todas as frases negativas que você costuma falar ou pensar sobre si mesma. Não censura. Escreve tudo. Exemplos comuns:

- "Sou desorganizada."
- "Não tenho disciplina."
- "Sou muito sensível."
- "Nunca termino o que começo."

Escreva as suas.

**Parte 2 — Reescrita.** Para cada frase, reescreve usando uma dessas estruturas:

- ❌ "Sou desorganizada." → ✅ "Estou desenvolvendo mais organização."
- ❌ "Não tenho disciplina." → ✅ "Estou aprendendo a criar consistência."
- ❌ "Nunca termino o que começo." → ✅ "Estou praticando terminar o que começo."

A chave não é negar a realidade. É reformular para "processo" em vez de identidade fixa.

**Parte 3 — Os próximos 3 dias.** Escolha 3 das frases reescritas. Escreva em um papel pequeno e coloca onde você vai ver — espelho, mesa, carteira. Não precisa acreditar ainda. Só expõe o cérebro à nova versão repetidamente. A repetição faz o trabalho.`,
      },
      {
        markdown: `### Reflexão

> "Que história sobre mim eu repito que pode não ser verdade, ou que foi verdade uma vez, mas não precisa ser mais?"

### Para desbloquear o Dia 7

Aqui está algo que ninguém te conta sobre mudança: você não precisa sentir a mudança acontecer para ela estar acontecendo.

Cada vez que você interrompe uma frase antiga e escolhe uma nova, você enfraquece um caminho neural e fortalece outro. Não é imediato. Mas é real.

Amanhã vamos trabalhar com algo que o seu cérebro absorve 24 horas por dia sem você perceber: o seu ambiente.`,
      },
    ],
  },
  {
    order_index: 7,
    title: "Dia 7 — O Ambiente como Sinal",
    blocks: [
      {
        markdown: `**Formato:** 🎥 Leitura + Vídeo curto

Existe algo que influencia o seu estado interno o tempo todo, sem pedir licença, sem você perceber, sem fazer barulho. O seu ambiente.

O espaço onde você vive manda sinais constantes para o seu sistema nervoso. Uma mesa bagunçada diz: caos. Um quarto desorganizado diz: você não tem controle. Um feed cheio de comparação e conflito diz: você não é suficiente. Não de forma consciente. Mas o subconsciente recebe tudo. E o subconsciente não analisa. Ele absorve.

Isso funciona no outro sentido também: um espaço limpo sinaliza ordem possível. Uma mesa organizada diz que você tem clareza. Conteúdo que te eleva diz que crescimento é real.

Você não está apenas em um ambiente. Você está sendo moldada por ele.

O trabalho interno que você está fazendo aqui precisa de um solo compatível. Não precisa de um apartamento perfeito. Não precisa de uma vida arrumada. Precisa de alguns sinais intencionais que dizem ao seu cérebro: "A nova versão mora aqui."

Assista ao vídeo para entender como aplicar isso na prática.`,
      },
      {
        markdown: `## Vídeo — Roteiro

*⏱ Duração: 5–7 minutos · 📍 Ge falando direto para a câmera, ambiente organizado ao fundo*

*(vídeo ainda não gravado — leia o roteiro como texto por enquanto)*

**Abertura.** "O seu ambiente está te reprogramando agora. A questão é: para qual direção?"

**Desenvolvimento — 3 mudanças práticas**

1. **A regra dos 2 minutos no espaço físico.** Qualquer coisa que você puder organizar em 2 minutos, faz agora. Não é sobre perfeição. É sobre sinal. Cada objeto no lugar diz ao seu cérebro: você tem controle.
2. **O que fica na sua linha de visão importa.** O que você vê primeiro ao acordar, ao sentar para trabalhar, ao chegar em casa — isso importa. Coloque algo que represente quem você está se tornando. Pode ser uma frase, uma imagem, um objeto com significado. O cérebro trata evidências visuais como provas de identidade.
3. **Dieta digital é dieta real.** Passa três dias observando como você se sente depois de cada conteúdo que consome. Elevada ou drenada? Inspirada ou se comparando? O seu feed é extensão do seu campo interno. Cuide com a mesma atenção que cuida do que come.

**Fechamento.** "Você não precisa reformar a vida toda amanhã. Comece com o que está na sua frente. Um espaço mais limpo. Uma conta deixada de seguir. Uma frase colada no espelho. Esses são sinais que o subconsciente recebe. E o subconsciente trabalha enquanto você dorme."`,
      },
      {
        markdown: `## Exercício — O Sinal Físico

Escolha uma das três ações abaixo e faça hoje:

- Organize um espaço, só um. Sua mesa, sua cama, sua sala...
- Coloque algo visível que represente sua nova versão: uma frase, uma imagem, qualquer coisa.
- Deixe de seguir três contas que te drenam. Só uma, mas faz de verdade.

### Reflexão

> "O meu ambiente está me puxando para frente ou me ancorando no que eu quero deixar para trás?"

### Para desbloquear o Dia 8

Uma coisa a lembrar: você vai ter dias em que o ambiente vai bagunçar de novo. A vida vai bagunçar. Isso não significa que você voltou ao ponto zero. Significa que é hora de reorientar, sem drama, sem culpa. Apenas reorganiza e continua.

Amanhã você vai responder a pergunta mais importante de todo esse processo: quem você está escolhendo ser?`,
      },
    ],
  },
  {
    order_index: 8,
    title: "Dia 8 — A Identidade que Você Escolhe",
    blocks: [
      {
        markdown: `**Formato:** 📝 Leitura + Exercício escrito

A maioria das pessoas tenta mudar o comportamento. Para de fumar. Começar academia. Organizar as finanças. E funciona por um tempo. Até que o antigo eu puxa de volta.

Porque o comportamento não muda de verdade quando a identidade não muda. Se no fundo você ainda se vê como "alguém que não tem disciplina", qualquer hábito novo vai parecer uma fantasia que não é sua de verdade.

O cérebro busca consistência com quem você acredita ser. Comportamento inconsistente com a identidade gera desconforto. E o desconforto te puxa de volta ao padrão conhecido.

Mas isso funciona nos dois sentidos. Quando você começa a se ver como "alguém que escolhe com consciência", comportamento inconsistente com isso começa a incomodar também. E é esse incômodo que sustenta a mudança.

Não é força de vontade. É identidade.

A pergunta não é "o que quero fazer?" A pergunta é "quem estou escolhendo ser?"`,
      },
      {
        markdown: `## Exercício — A Declaração de Identidade

**Parte 1.** Complete a frase com 5 qualidades que a sua próxima versão encarna: "Eu sou alguém que..."

Exemplos: age mesmo sem certeza · retorna sem culpa quando erra · cuida do próprio espaço interno · escolhe com consciência · confia no processo mesmo quando não vê o resultado.

Escreve as suas. Que sejam reais para você — não idealizadas.

**Parte 2 — O Teste das Micro Escolhas.** Durante os próximos dias, quando estiver diante de qualquer decisão — pequena ou grande — faça essa pergunta antes de agir: "O que a pessoa que eu escolhi ser faria aqui?"

Não precisa ser dramático. "Essa pessoa lavaria a louça agora ou deixaria pra depois?" "Essa pessoa abriria o celular ou continuaria o que estava fazendo?" Micro escolhas, repetidas. São essas que mudam quem você é.

**Parte 3.** Escreva sua declaração em algum lugar que você vai ver todo dia. Não como um lembrete de quem você deve ser. Como uma confirmação de quem você está se tornando.`,
      },
      {
        markdown: `### Reflexão

> "Quem é a pessoa que eu estou escolhendo ser — e o que ela faria diferente de mim hoje?"

### Para desbloquear o Dia 9

Aqui está a verdade sobre a identidade: você não vai acordar um dia sendo essa "nova pessoa" completamente. Ela vai aparecer em pedaços. Em momentos. Em escolhas que parecem pequenas mas não são.

E cada vez que você age como ela, mesmo por um minuto, você está pavimentando o caminho neural que a torna real. A repetição não é detalhe. A repetição é o método.

Amanhã você vai aprender a sustentar um estado interno, e entender por que isso é mais poderoso do que qualquer técnica.`,
      },
    ],
  },
  {
    order_index: 9,
    title: "Dia 9 — O Campo e a Coerência",
    blocks: [
      {
        markdown: `**Formato:** 🎧 Leitura + Áudio de meditação

Você já quis muito algo — e quanto mais queria, mais parecia que aquilo se afastava de você?

Isso acontece porque existe uma diferença fundamental entre querer e ser. Quando você quer algo com desespero, o que você está vibrando de verdade é a falta. E você atrai o que você sustenta, não o que você pede.

Se o seu estado interno é de tensão, escassez e urgência... mesmo que você esteja fazendo "tudo certo" por fora... o campo que você emite é de falta.

Mas quando você entra em coerência, quando o que você pensa e o que você sente se alinham, algo muda. O sistema nervoso desacelera. O corpo sai do modo de alerta. E você começa a agir a partir da clareza, não do medo.

Isso não é teoria. É o que acontece fisiologicamente quando o cérebro e o coração entram em sincronia. O coração, literalmente, emite um campo eletromagnético. E quando esse campo está em coerência, ele começa a interagir com o ambiente de outra forma.

A meditação de hoje vai te levar a sentir o estado da sua próxima versão, não imaginar, sentir. Porque o cérebro não diferencia experiência real de experiência interna vivida com intensidade emocional suficiente. Se você consegue sustentar o sentimento de quem você está se tornando, o cérebro começa a tratar isso como memória do futuro. E começa a trabalhar para confirmar essa realidade.`,
      },
      {
        markdown: `## Áudio — Meditação da Coerência

*⏱ Duração sugerida: 15–18 minutos · 🎵 Música instrumental suave, frequência calma*

*(áudio ainda não gravado — leia o roteiro bem devagar, respeitando as pausas)*

Senta ou deita em um lugar confortável. Feche os olhos.

Respira fundo pelo nariz... solta pela boca. Mais uma vez. Fundo... e solta.

*[pausa]*

Deixa a respiração encontrar seu ritmo natural.

*[pausa de 10 segundos]*

Agora traz a atenção para o centro do peito. A região do coração. Coloca a mão ali, se quiser. Respira como se o ar entrasse e saísse por aqui. Suave. Constante.

*[pausa de 15 segundos]*

Agora pensa em um momento — qualquer momento — onde você se sentiu bem de verdade. Em paz. Em clareza. Em presença. Não precisa ser um momento grande. Pode ser um instante simples. Encontrou? Fica com ele.

*[pausa de 15 segundos]*

Deixa o corpo sentir como estava nesse momento. Não descreve mentalmente. Sente. Como estava sua respiração? Como estava seu peito? O que havia no seu corpo nesse instante?

*[pausa de 20 segundos]*

Agora... imagina a sua próxima versão. A pessoa que você está escolhendo ser. Como ela se sente? Não como ela parece. Como ela se sente por dentro. Tranquila? Clara? Presente? Inteira? Deixa isso surgir como uma sensação no corpo. Não como pensamento. Como sensação.

*[pausa de 20 segundos]*

E agora... sustenta isso. Respira dentro dessa sensação.

*[pausa de 30 segundos]*

Esse estado que você está sentindo agora — esse é o sinal que você emite quando está em coerência. Não é o futuro que você está pedindo. É o futuro que você está sendo. Aqui, agora.

*[pausa de 30 segundos]*

Fica mais um momento nesse estado.

*[pausa de 40 segundos]*

Quando sentir que é hora, respira fundo. Começa a mover o corpo suavemente. E abre os olhos.`,
      },
      {
        markdown: `### Reflexão

> "Como é o estado interno da pessoa que estou me tornando, e o que preciso sustentar para que ela se torne real?"

### Para desbloquear o Dia 10

Você chegou ao último dia. Mas antes de abrir, uma coisa importante: 10 dias não reprogramam anos de padrão. O que esses 10 dias fizeram, foi te mostrar o caminho.

A mudança real acontece quando você escolhe continuar. Não porque precisa. Porque quer. Porque viu que é possível.

Amanhã é sobre integrar o que você construiu, e decidir o que vai levar com você.`,
      },
    ],
  },
  {
    order_index: 10,
    title: "Dia 10 — A Integração",
    blocks: [
      {
        markdown: `**Formato:** 📝 Leitura + Exercício final

Você chegou até aqui. E isso já é mais do que a maioria faz. A maioria começa. Poucos terminam. E menos ainda continuam depois.

Aqui está o que você precisa entender antes de fechar esse ciclo: você não terminou um método. Você abriu uma direção.

O que aconteceu nesses 10 dias foi isso: você esvaziou o que estava bloqueando, identificou padrões, ouviu o corpo, silenciou o ruído, ajustou o ambiente, reescreveu a linguagem e começou a sentir quem você está se tornando. Isso é começo. Não é fim.

E aqui está o ponto mais importante de todos: o cérebro não muda por insight. Muda por repetição.

Aquela prática que te impactou mais, ela não vai se fixar por você ter feito uma vez. Vai se fixar quando você voltar a ela. E voltar de novo. E mais uma vez. E quantas vezes necessárias. Não porque você é fraca. Mas porque é assim que a biologia funciona.

O chumbo não vira ouro em um aquecimento. Precisa do fogo, do tempo, da constância.

E quando você voltar para um padrão antigo — e vai voltar, em algum momento — isso não significa que falhou. Significa que o processo ainda está acontecendo.

A diferença entre quem muda e quem não muda não é quem nunca escorrega. É quem volta sem transformar o escorregão em identidade. Você escorregou. Você volta. Sem culpa. Sem drama. Só volta.

Esse é o trabalho. Simples. Não fácil. Mas simples. E você já provou nesses 10 dias que consegue.`,
      },
      {
        markdown: `## Exercício — A Escolha que Continua

**Parte 1 — Revisão.** Releia suas anotações dos 10 dias. Todos os exercícios, todas as reflexões. Observe com distância e gentileza. Quem era você no Dia 1? O que mudou, mesmo que sutilmente?

**Parte 2 — A Prática que Fica.** Identifique uma prática desses 10 dias que gerou mais impacto em você. Só uma. Escreva: "Nos próximos 30 dias, vou praticar [escolha] porque [motivo real, não o que soa bonito]."

**Parte 3 — O Compromisso Real.** Escreva uma carta para você mesma. Não longa. Não precisa ser perfeita. Escreve para a versão de você que vai querer desistir. A que vai ter um dia ruim e pensar que não adianta. O que você diria a ela agora, depois de tudo que você viveu aqui? Guarda essa carta. Abre quando precisar.`,
      },
      {
        markdown: `### Reflexão final

> "Quem eu era no Dia 1 — e quem estou escolhendo ser a partir de hoje?"

### Mensagem de encerramento

Você terminou os 10 dias. Mas a verdade é que o método não acaba aqui.

Ele continua cada vez que você escolhe a respiração antes da reação. Cada vez que você pega o papel em vez de ruminar. Cada vez que volta sem culpa depois de um dia difícil.

Reprogramação não é um evento. É uma direção. E você já está nela.

Continue. Um dia de cada vez. Uma escolha de cada vez. Como dentro, assim fora.`,
      },
    ],
  },
];

async function main() {
  const { data: existingLessons } = await supabase.from("lessons").select("id").eq("product", "metodo_calice");
  const existingIds = (existingLessons ?? []).map((l) => l.id);
  if (existingIds.length > 0) {
    await supabase.from("lesson_progress").delete().in("lesson_id", existingIds);
    await supabase.from("lesson_blocks").delete().in("lesson_id", existingIds);
    await supabase.from("lessons").delete().in("id", existingIds);
  }

  for (const spec of lessons) {
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .insert({ product: "metodo_calice", order_index: spec.order_index, title: spec.title })
      .select("id")
      .single();
    if (lessonError) throw lessonError;

    const blockRows = spec.blocks.map((block, i) => ({
      lesson_id: lesson.id,
      order_index: i + 1,
      block_type: "text",
      content: { markdown: block.markdown },
    }));
    const { error: blocksError } = await supabase.from("lesson_blocks").insert(blockRows);
    if (blocksError) throw blocksError;
  }

  console.log(`aulas reais inseridas: ${lessons.length} dias. progresso de teste resetado.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
