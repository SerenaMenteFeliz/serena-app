import { createClient } from "@supabase/supabase-js";

const url = "https://ddgtoebsmmyneumolycy.supabase.co";
const serviceKey = process.argv[2];
if (!serviceKey) {
  console.error("uso: node scripts/seed-metodo-calice-livro.mjs <service_role_key>");
  process.exit(1);
}
const supabase = createClient(url, serviceKey);

// Livro real do Método Cálice (parte teórica), organizado a partir do
// documento da Ge. Os 3 capítulos originais viraram capítulos + subcapítulos
// numerados (3.1, 3.2, ...) pra caber em telas de leitura mobile — sem
// mudar o schema (book_chapters continua uma lista sequencial simples,
// só a numeração no título comunica a hierarquia).
const chapters = [
  {
    order_index: 0,
    title: "Introdução",
    body_md: `## O convite

Este é um guia místico e prático, onde você finalmente aprende a quebrar padrões, silenciar o barulho da mente e acessar estados mais elevados de consciência.

Aqui você vai entender, na prática, o que é reprogramação mental de verdade:

- Como a sua mente funciona além do que te ensinaram
- Como crenças se formam sem você perceber
- Como o ambiente molda sua percepção
- E como acessar sua intuição de forma consciente, não aleatória

### Quem sou eu pra te guiar nisso?

Ah… eu sou alguém que viveu o colapso dos próprios padrões. Que percebeu a mente criando realidades repetidas. Que precisou aprender a se observar… antes de tentar mudar.

Nada disso vem de teoria isolada. Vem de prática, de erro, de repetição… Eu vivi isso, isso me ajudou e continua me ajudando a caminhar e evoluir.

Eu não te ensino a acreditar em algo. Eu te ensino a ver. E quando você vê… você não volta a ser a mesma.

Se permita realmente estar aqui, com atenção e mente aberta, aproveite cada experiência para que você possa atingir plenamente o objetivo desse guia, que é te ajudar a usar uma ferramenta poderosa de cura, equilíbrio, autoconhecimento e manifestação.

### O piloto automático

A neurociência já confirmou que mais de 95% dos seus pensamentos são automáticos — eles vêm do seu subconsciente, a parte da sua mente que processa informações, memórias e emoções fora do foco de atenção imediato. É literalmente o "piloto automático", controlando funções corporais, reações automáticas, intuições e hábitos formados ao longo da vida.

O subconsciente não pensa, ele repete.

Ou seja… a forma como você reage, se sente, se sabota e até se limita… não surgiu do nada. Foi construído, instalado, repetido tantas vezes… que você passou a acreditar que esse é você.

Padrões. Repetições. Coisas que você ouviu quando ainda não sabia questionar. Respostas automáticas que seu corpo aprendeu pra sobreviver, não pra viver.

E você não está assim porque quer. Está assim porque foi condicionado, e se foi condicionado… pode ser reprogramado.

Reprogramar significa começar a se observar antes de reagir. Significa que o medo e padrões inconscientes deixam de te dominar; você para de se sabotar e assim, você finalmente deixa de ser refém de si mesmo.

Isso não acontece porque algo mágico surgiu do nada. Acontece porque você aprende algo importante: não repetir atitudes de quem você não quer mais ser.

Você não precisa acreditar em tudo agora. Você só precisa estar disposto a testar. Porque esse caminho não exige perfeição. Ele exige presença.

E se você chegou até aqui… não foi por acaso. Algo dentro de você já sabe, e está te chamando pra lembrar.`,
  },
  {
    order_index: 1,
    title: "Capítulo 1 · Por Que Sua Mente Está no Piloto Automático?",
    body_md: `Sabe aquela sensação de estar dentro de si… mas sem controle?

Como se tivesse uma parte sua observando indignada com o que você faz, e outra… só repetindo, reagindo, explodindo, se culpando. Repetindo padrões sabendo que não quer repetir, prometendo a si mesmo que vai mudar… e dias depois, voltando exatamente pro mesmo lugar.

Eu conheço isso. Eu já fui a pessoa que dizia "dessa vez vai ser diferente".

O pior não era nem errar. Era não entender por que eu repetia o que me fazia mal.

Mas aí, estudando neurociência eu percebi que o nosso cérebro foi feito para nos manter vivos, e não para nos transformar. E para isso, ele segue uma regra simples:

> "Repita o que já funcionou antes."

Mesmo que repetir o que já "funcionou" antes signifique:

- Sobreviver no caos
- Reagir com explosão
- Viver tensa
- Se sabotar antes mesmo de dar certo

Pro cérebro, isso é seguro porque é o que ele conhece.

Você não repete porque quer, repete porque o cérebro diz: "Isso aqui eu já conheço… então vou continuar."

Por isso você vive sempre a mesma coisa — os mesmos medos, mesmos sentimentos, mesmos pensamentos, mesmas ações — porque você está sempre repetindo a mesma história interna. Em um loop.

E por isso que quando você tenta algo novo, assusta. Isso não significa fraqueza. Significa apenas que é algo novo e desconhecido para o seu cérebro. E para o cérebro, o desconhecido parece perigoso.

Eu fui percebendo isso aos poucos… quando estava começando a mudar, mais calma, mais consciente — mas do nada… eu me sabotei. Explodi. Voltei pro caos.

Até pensei: "o que tem de errado comigo?" Mas não tinha nada errado. Eu só estava saindo do que era conhecido, da minha zona de conforto.

E existe um momento muito específico na reprogramação, quando você percebe:

Você não é sua reação automática. Você não é o padrão. Você não é o automático. Você é quem observa tudo isso acontecendo dentro de você.

E você não precisa lutar contra seu cérebro — isso gera mais resistência. Aos poucos, você vai ensinando ao seu cérebro novos caminhos. Isso acontece quando você começa a mudar:

- Seu foco
- Sua respiração
- Seu ambiente
- Sua narrativa interna

Quando esses quatro pontos mudam… o cérebro se reorganiza.

### Onde ciência e espiritualidade se encontram

A ciência chama de neuroplasticidade. A espiritualidade chama isso de vibração. Mas na prática, é a mesma coisa: você muda o seu estado interno e todo o resto acompanha.

Então a verdade que você precisa levar com você nessa jornada é:

Você não nasceu assim. Você não é fraco. Você não está quebrado.

Você foi condicionado, e tudo que foi condicionado, pode ser reprogramado.`,
  },
  {
    order_index: 2,
    title: "Capítulo 2 · Por Que Mudar é Difícil?",
    body_md: `Se mudar fosse só uma decisão… você já teria mudado. Se fosse só entender… você já estaria vivendo diferente.

Mas não é assim que funciona. E eu também precisei sentir na pele pra entender que mudar não é só mental. É biológico também.

Quando comecei, eu sabia o que precisava fazer e deixar de fazer. Eu tinha consciência. Eu queria. Mas mesmo assim voltava pros mesmos padrões. Mesmas reações… mesmo caos interno.

Por muito tempo achei que o problema era eu. Mas era só o meu cérebro condicionado. Repetindo o que já era conhecido, pra poupar energia.

Rotinas automáticas são zonas de conforto biológicas. Atalhos. Tudo que você já fez muitas vezes vira fácil, vira rápido, vira automático.

Tentar algo novo é como entrar em um cômodo escuro que ficou anos fechado… e acender a luz pela primeira vez. O cérebro precisa:

- Prestar atenção
- Gastar energia
- Sair do automático
- Aprender algo novo

E ele não gosta disso.

### As trilhas do cérebro

Dentro da sua mente, existem caminhos. Alguns leves… e outros, verdadeiras rodovias. Esses são os seus padrões.

Cada pensamento repetido, cada reação, cada emoção frequente… vai criando uma trilha. E quanto mais você repete, mais essa trilha se fortalece.

Quando você tenta mudar um hábito antigo é como sair de uma estrada asfaltada, para abrir um caminho no meio da floresta. No começo, é difícil, desconfortável e lento.

Mas isso não significa que você não consegue — significa que você está criando algo novo.

O cérebro não entende evolução, ele entende sobrevivência. Tudo que é familiar = seguro. Tudo que é novo = risco. Mesmo que o novo seja melhor.

Por isso você sente ansiedade ao mudar. A ansiedade, a resistência, a vontade de desistir… não são sinais de fraqueza. Isso é apenas seu cérebro dizendo: "Isso aqui não é familiar ainda."

Então o cérebro tenta te proteger:

- Te puxando de volta
- Criando desculpas
- Gerando autossabotagem
- Te levando pro padrão antigo

> "O cérebro prefere o desconfortável conhecido do que o desconhecido que pode libertar."

### Neuroplasticidade = transmutação

A ciência chama de neuroplasticidade o que a espiritualidade chama de transmutação. Mas estão dizendo a mesma coisa: a capacidade de mudar. De criar novos caminhos. De enfraquecer padrões antigos. De reconstruir a própria mente.

Nada em você está fixo. Você não é um sistema travado. Você não é um diagnóstico. Você não é uma identidade definitiva. Você é um sistema em constante adaptação.

Tudo o que você repete… se fortalece. Tudo o que você interrompe… enfraquece. Tudo que você foca, se expande.

A repetição cria quem você é.

### Você nunca está atrasado

Existe uma mentira silenciosa que trava muita gente: "Já é tarde pra mim."

Não, não é.

O cérebro não fecha portas, não congela — o cérebro continua adaptável e responsivo, esperando apenas um novo comando.

Mudar é difícil porque você está indo contra anos de repetição. Mas é possível, porque o cérebro foi feito para se adaptar.

Nada em você está condenado. Nada em você é fixo. Tudo pode ser reescrito.

E a partir de agora… você não está mais tentando mudar. Você ESTÁ mudando.`,
  },
  {
    order_index: 3,
    title: "Capítulo 3.1 · O Papel da Intuição",
    body_md: `Intuição não é um "palpite mágico". A intuição é a parte de você que já sabe… antes de você conseguir explicar. É silenciosa, é rápida, e muitas vezes ignorada.

Enquanto a mente lógica funciona como um processador linear analisando passo a passo, a intuição acessa padrões inteiros de uma vez. Ela conecta os pontos que a mente racional ainda não percebeu.

Eu vi isso na prática. Quantas vezes algo dentro de mim falava "não vai por aí"… mas minha mente insistia. E toda vez que eu ignorava esse sinal… eu sofria.

Foi assim que entendi: a intuição não grita, ela sussurra. E ela nunca erra.

A intuição é formada por tudo que você já captou sem perceber:

- Micropercepções
- Emoções sutis
- Memórias implícitas
- Leitura do ambiente
- Estados do corpo
- Percepções que vão além do racional

A própria neurociência já reconhece isso: o corpo capta sinais milissegundos antes da mente racional. Ou seja… você sente antes de entender.

A espiritualidade sempre chamou isso de "saber sem saber por quê." E é exatamente isso. A intuição é esse campo invisível que antecipa, guia e protege.

Quando você entra em um processo de mudança profunda, a mente lógica muitas vezes não dá conta. São muitas camadas acontecendo ao mesmo tempo, muitas emoções, muitas variáveis.

Esse é o momento que a intuição entra como um GPS interno. Ela não substitui a razão, ela direciona, ela ajusta. Ela mostra o caminho quando tudo parece confuso.

A intuição fala através do corpo, não é algo separado. É o corpo comunicando. Aquele frio na barriga, um aperto no peito, a respiração que muda "do nada". Isso não é aleatório. Isso é informação. É seu corpo te avisando.

O seu sistema nervoso inteiro registra padrões emocionais energéticos. E quando algo não vibra com você… o corpo sabe, antes da mente aceitar.

E quando algo é alinhado, é como se tudo dentro de você dissesse: "É por aqui."`,
  },
  {
    order_index: 4,
    title: "Capítulo 3.2 · O Campo Energético e a Ressonância",
    body_md: `Quando falamos de campo energético, não estamos falando de algo "viajado". Estamos falando de algo que a própria ciência já começou a observar.

O seu corpo é um sistema elétrico. Cada pensamento é um impulso elétrico. Cada emoção gera um campo magnético. E o coração é o maior gerador desse campo no corpo humano.

Isso diz uma coisa muito importante: você não só pensa, você emite.

Você já entrou em um ambiente e sentiu o clima estranho? Ou encontrou alguém e sentiu algo antes mesmo de conversarem? Isso é o campo.

Nossos sistemas começam a sincronizar nossos batimentos, nossa respiração, nossa atividade neural… tudo entra em ressonância.

E quando você está em um processo de mudança, isso se intensifica, porque o seu campo começa a reorganizar tudo ao seu redor.

Então o ponto mais importante da manifestação é: você não manifesta o que quer, você manifesta o que você É. Você manifesta o que você sustenta.

Se você pensa em mudança, mas sente medo, se sabota, se culpa… seu campo entra em incoerência. A mente quer avançar, mas seu corpo vibra perigo. E isso trava tudo.

Quando você entra em coerência, algo muda de verdade. Seu coração se estabiliza, seu sistema nervoso se regula, e o seu campo se alinha. Aqui entra a diferença entre esforço e fluxo: você para de forçar e começa a permitir.

### Ressonância: onde tudo acontece

Quando seus pensamentos (elétrico) e emoções (magnética) se alinham… você cria uma assinatura vibracional. Um código. Um sinal. E esse sinal começa a interagir com a realidade.

Você para de correr atrás, e começa a ser reconhecida. As coisas começam a se aproximar de você, com naturalidade. A se organizar, fluir.

Esse é o ponto: você muda sua vida quando muda sua frequência.

Não é pensamento positivo. É fisiologia + emoção + intenção alinhada.

Quando você atinge esse estado, você não vive mais no medo. Você vive na presença. Não age mais pela escassez, mas pela clareza. Você não cria mais pelo desespero, mas pela ressonância.

Nesse ponto, você finalmente entende algo que antes parecia distante: você não precisa forçar a vida, você permite que ela se organize a partir de você.

Isso é maestria. Ser tão coerente por dentro… que o mundo externo começa a responder.`,
  },
  {
    order_index: 5,
    title: "Capítulo 3.3 · Como Funciona a Reprogramação",
    body_md: `O cérebro nada mais é do que um organizador de padrões. Se você passou anos operando no estresse, sempre alerta, sempre resolvendo, sempre tensa… você literalmente pavimentou autoestradas neurais de sobrevivência.

Ou seja: seu cérebro se tornou excelente em repetir exatamente aquilo que você queria superar. São apenas redes de neurônios disparando no automático. É como um programa rodando em segundo plano.

Mudar um hábito, nesse contexto, é como tentar desviar o curso de um rio que corre pelo mesmo leito há décadas: a água sempre tenta voltar para onde já conhece.

O maior desafio de mudar não é começar. É sustentar. Porque mudar por um momento é fácil, mas permanecer diferente é onde quase todo mundo volta atrás.

Eu senti isso na pele. Tinha momentos que eu estava calma, bem, em paz… e do nada, voltava. Uma reação automática, uma explosão… algum padrão antigo me puxando de volta. E aí vinha o pensamento: "Não adiantou nada."

Mas não era verdade. Era meu cérebro antigo — condicionado ao estresse, à adrenalina, à reatividade — tentando me puxar de volta para o lugar que ele conhecia.

A neurociência chama isso de homeostase. O corpo busca equilíbrio, mesmo que esse "equilíbrio" seja viver no caos. Se você passou anos reagindo por impulso… a paz, no início, vai parecer estranha. Quase perigosa.

Reprogramar não é "forçar pensamento bonito". É mudar a fiação do seu cérebro e ajustar a vibração do seu campo, para que o seu corpo e a sua realidade parem de repetir quem você era e comecem a responder a quem você está se tornando.

Aqui entra algo que pouca gente entende: a vida começa a te testar quando você muda.`,
  },
  {
    order_index: 6,
    title: "Capítulo 3.4 · O Ritmo da Mudança e a Maestria",
    body_md: `No Hermetismo, existe a Lei do Ritmo. Tudo oscila. Tudo vai e volta. Tudo se move como um pêndulo.

Então quando você começa a elevar sua vibração — mais calma, mais presença, mais clareza — a vida naturalmente traz situações para "testar" isso. Algum comentário que tira do sério. Um imprevisto. Uma cobrança. Uma crítica…

Não é contra você. É apenas o movimento natural da vida perguntando: "Isso já é quem você é… ou é uma fase?"

### O que é maestria de verdade

Muita gente acha que evoluir é parar de sentir. Mas não é. É impossível impedir o pêndulo de se mover. Você não impede as emoções de virem.

Maestria é outra coisa: é desenvolver um centro tão estável, que mesmo quando tudo oscila ao redor… você não oscila junto.

Você percebe, sente, mas você não se perde. Você continua firme no seu eixo.

Você não "apaga" uma emoção. Você muda a polaridade dela. O medo não some, ele é refinado em cautela estratégica. A insegurança vira presença. A ansiedade se transforma em prontidão.

É a arte de mudar a vibração de uma ideia para que ela trabalhe a seu favor, em vez de te aprisionar. A sua atitude diante da sua emoção define seu resultado.

> "Eu não sou o que aconteceu comigo. Eu sou o que eu escolho me tornar."

Quando o caos aparece (e ele sempre aparece), a maioria reage no automático. Mas quem está em reprogramação faz outra coisa: responde a partir da nova frequência.

Isso é neuroplasticidade na prática. Cada vez que você escolhe um novo padrão, você enfraquece o padrão antigo e fortalece o novo. É assim que o cérebro muda. Não é em grandes decisões… é em micro escolhas repetidas.

O pêndulo continua existindo, mas você não é mais levado por ele.`,
  },
  {
    order_index: 7,
    title: "Capítulo 3.5 · Quando a Realidade Começa a Mudar",
    body_md: `Existe um ponto onde algo começa a acontecer… e não é misticismo. É coerência.

A forma como você vibra começa a alterar a forma como a realidade responde. Quando você sustenta um estado interno por tempo suficiente — pensamentos alinhados, emoções coerentes, corpo regulado — o seu campo muda, e o externo começa a acompanhar.

Você começa a perceber coisas estranhas. Pessoas que drenam sua energia se afastam — não por briga, mas porque não existe mais ressonância. E oportunidades que antes pareciam impossíveis começam a aparecer. Não do nada, mas porque agora você se tornou compatível com elas.

Você não apenas mudou por dentro, você mudou o que você atrai.

E aqui entra o segredo mais profundo de todos: para manifestar, você tem que soltar.

Enquanto você tá querendo demais, forçando, controlando, tentando garantir — você está vibrando na falta. Na tensão, na escassez, na ansiedade. E o campo responde com mais disso.

Mas quando você entra em coerência, você se sente tão alinhada no agora… que o resultado deixa de ser urgência. E é exatamente nesse ponto que a vida começa a fluir.

Você não corre mais atrás, você não força, você não controla. Você se alinha, e o resto se organiza. O resultado deixa de ser prioridade porque você já está inteira.

E isso não é só emocional, é biológico. Quando você entra nesse estado, o sistema nervoso desacelera, o corpo solta tensão, e você sinaliza ao seu próprio organismo: "Está tudo bem." E quando seu corpo acredita nisso, a realidade acompanha.

### A verdade final

A mudança de vida não é esforço constante. É ajuste de frequência.

Você não precisa construir uma nova versão do zero. Você só precisa parar de alimentar o que não combina mais com quem você está se tornando.

A verdadeira evolução é silenciosa. Ela acontece naquele momento em que você para de lutar consigo mesma… e começa a se permitir.

Aí você entende algo que muda tudo: tudo começa dentro. O externo não tem escolha a não ser seguir. Esse é o poder de ser, antes de ter.

O movimento começa quando você sente, como se a mudança já tivesse acontecido. A gratidão antecipada é o que gera o campo magnético capaz de atrair o novo.

Pensamento + emoção = assinatura eletromagnética. Isso é reprogramar.`,
  },
  {
    order_index: 8,
    title: "Capítulo 3.6 · A Reprogramação de Verdade",
    body_md: `Reprogramar exige atravessar esse desconforto: o período em que você ainda não é a nova versão, mas também não cabe mais na antiga. É literalmente uma abstinência do seu velho "eu".

Quem sustenta essa fase, transforma. Quem foge dela, repete.

Reprogramação mental é assumir o volante da sua própria biologia. É fazer o seu cérebro (ritmo, lógica, impulso elétrico) conversar com o seu coração (vibração, campo, assinatura energética). Quando os dois entram em coerência, a intenção deixa de ser um pedido… e vira uma ordem para a matéria.

> "Você não reprograma a mente para mudar de vida. Você reprograma a mente para mudar quem você É. E quando você muda quem É, a vida não tem outra escolha a não ser acompanhar."

Se você esperar a paz chegar para começar a ser calmo, você nunca vai ser. O universo não entrega primeiro. Ele responde. Por isso o trabalho começa dentro.

### O trabalho interno

Cultivar a frequência da paz, da ordem e da disciplina no seu laboratório interno: corpo + mente em coerência cardíaca.

Quando o seu corpo acredita que a mudança já aconteceu, porque ele sente a química da gratidão, da segurança, da clareza… as células respondem. Os genes mudam de expressão. O seu campo vira outra assinatura. E então o mundo responde.

Não porque você "quer", mas porque você se tornou algo que o mundo não tem escolha a não ser reconhecer.

Você não atrai o que deseja. Você atrai aquilo que você É.`,
  },
  {
    order_index: 9,
    title: "Capítulo 3.7 · O Subconsciente e a Voz Invisível",
    body_md: `O subconsciente é como um porão onde vive tudo que você já foi: memórias, traumas, padrões, defesas, impulsos, vícios, crenças e versões antigas que você nem lembra, mas que ainda te dirigem.

Enquanto a mente consciente — o "eu" que racionaliza, planeja e deseja — processa cerca de 40 bits por segundo, o subconsciente opera numa escala absurda de 40 milhões de bits.

A função dele é manter você viva gastando o mínimo de energia possível. O subconsciente automatiza tudo que se repete: gestos, ações, reações, emoções, pensamentos… para que o seu cérebro não precise reaprender a existir a cada instante.

Mas o subconsciente não sabe o que é "bom" ou "ruim". Ele só sabe o que é familiar.

Se você se acostumou a reagir com explosão, impulso, tensão, o subconsciente registra isso como a sua "frequência de segurança". É como um código interno dizendo: "Se você foi assim por tanto tempo, isso deve te manter viva. Então vamos repetir." E ele repete. Mesmo que te machuque. Mesmo que atrase a sua vida. Mesmo que te prenda no mesmo ciclo.

O subconsciente não é o inimigo. Ele é o guardião do antigo você. E reprogramar a mente é ensinar esse gigante silencioso a liberar o passado para abrir espaço para a sua próxima versão.

### A voz invisível: o diálogo interno dominante

Sabe aquela voz que aparece do nada e diz: "Não adianta." "Isso é muito difícil." "Isso não é pra você."

Essa voz não é o seu Eu Superior. Não é a sua intuição. É o subconsciente falando através do seu consciente, projetando antigos programas como se fossem verdades absolutas.

Essa voz é um reflexo, não do que você é agora, mas de quem você precisou ser pra sobreviver. São códigos herdados da infância, de traumas, de tensões constantes, de momentos em que você precisou se proteger.

Ela tenta criar "regras de segurança" para organizar o caos, mas acaba construindo fortalezas emocionais que viram cárceres do estresse.

"Toda causa tem seu efeito." A voz invisível é essa causa mental repetida. E o seu campo energético responde obedientemente: se você aceita a sugestão interna, o universo se espelha de volta. É por isso que quando você não questiona essa voz, você não vive, você apenas repete.

Reprogramar é justamente recuperar o comando. É ouvir a voz invisível, olhar nos olhos dela e dizer: "Eu não sou mais essa versão." E quando você faz isso, o eco vira silêncio… e o silêncio vira poder.

Reprogramar o subconsciente não é sobre lógica. É sobre frequência e emoção — as únicas linguagens que ele realmente entende.

Nos primeiros minutos ao acordar e nos últimos antes de dormir, a "parede" entre consciente e subconsciente fica fina como véu. É quando o cérebro entra em Alfa/Teta. Aqui, o que você sente e imagina entra como código-fonte. Esse é o momento perfeito para instalar o novo padrão: paz, disciplina, autocontrole.

Quando a voz invisível surgir ("Que raiva!", "É tão difícil!"), você não briga com ela. Lutar reforça o padrão. Você faz o oposto: observa com neutralidade — "Meu subconsciente acabou de disparar um programa antigo." A observação sem reação quebra o feitiço.

Identificou a voz? Agora entra o jogo sutil: você usa a sua vontade para escolher uma nova direção… e o seu sentir para sustentar essa nova versão. Você cria uma experiência interna tão real… que o cérebro é forçado a abrir um novo caminho.

Esse combo interrompe a "rota automática" e força o cérebro a abrir uma nova trilha neural. É neuroplasticidade ativa. É magia aplicada.

### Conclusão

O subconsciente é um cavalo selvagem. Se você não o guia, ele te arrasta.

A voz invisível só tem poder enquanto você acredita que ela é você. A verdade é simples e libertadora: você não é a voz. Você é quem ouve a voz. E quem ouve pode mudar a estação.

> "O subconsciente é um servo perfeito, mas um mestre tirano. Reprogramá-lo é transformar a sua 'voz invisível' de carcereira em aliada da sua evolução."`,
  },
  {
    order_index: 10,
    title: "Capítulo 3.8 · Como as Crenças se Instalam Sem Você Perceber",
    body_md: `Dos 0 aos 7 anos, nosso cérebro é como uma esponja. Ele só absorve. Não analisa, não filtra, não questiona.

Não existe "isso faz sentido ou não". O córtex pré-frontal (a parte que questiona, interpreta, decide) simplesmente não está online. Tudo que a criança presencia — tom de voz, expressões, medo, explosões emocionais, silêncios, tensão — entra direto no subconsciente como: "É assim que a vida funciona."

Se os pais explodem diante do estresse, o cérebro infantil não entende o contexto. Ele apenas registra: "Para me proteger, eu também preciso explodir." Não é uma escolha. Não é personalidade. Não é defeito. É programação biológica — o código de sobrevivência que o corpo instalou pra manter você viva no ambiente em que você cresceu.

### O impacto emocional: o "carimbo" químico

Algumas crenças não nascem da repetição. Nascem do choque. Quando algo muito intenso acontece — um trauma, uma humilhação, uma perda — o corpo libera uma enxurrada de adrenalina e cortisol. Essa química não é aleatória, ela diz ao cérebro: "Isso é importante demais para ser esquecido."

E então vem o carimbo. O subconsciente registra o momento inteiro como uma regra de sobrevivência: "Nunca mais confie." "Seja forte o tempo todo." "Se você relaxar, você se machuca." "O mundo não é seguro."

Não é racional. É biológico. O corpo grava a dor… e a transforma em programa automático.

E aí entra o Hermetismo: a Lei da Correspondência. O que você carrega dentro de si vira o filtro do que você enxerga fora. A crença invisível se torna a lente que distorce a realidade, e o seu campo energético começa a atrair situações que confirmam exatamente essa dor, como se o universo estivesse dizendo: "Olha, esse é o padrão que está ativo."

Mas tudo isso não é destino. É programação, e programação pode ser reescrita.

### A repetição hipnótica: a água que fura a pedra

Existem crenças que não entram pelo trauma. Entram pelo pingar constante. São as frases que você escuta todo dia — às vezes da família, da sociedade, do ambiente… ou até do seu próprio cansaço mental (horas de trabalho seguidas, tensão contínua, rotina automática). É o ruído de fundo que vai moldando o subconsciente sem você perceber.

E aí vem o ciclo: se você repete para si mesma, diariamente, "Nada dá certo pra mim, tudo é difícil" — isso não é um desabafo inocente. É um comando biológico. Você está dizendo ao seu cérebro, ao seu sistema nervoso e ao seu DNA: "Mantenha esse padrão. Reproduza esse estado."

A repetição cria uma trilha neural tão profunda que vira autopista. O comportamento deixa de ser uma escolha consciente… e passa a te "usar". É quando você deixa de agir, e começa a ser vivida pelo programa.

Mas o mesmo mecanismo que cristaliza… é o mecanismo que dissolve.`,
  },
  {
    order_index: 11,
    title: "Capítulo 3.9 · Como Desinstalar o Que é Invisível",
    body_md: `Você não muda o que não vê. Então o primeiro passo é trazer à consciência.

### 1. Rastreie os frutos

A vida sempre entrega pistas. Se o fruto é explosão, caos, culpa ou exaustão… a raiz não é "personalidade". É insegurança, medo ou hiperdefesa. Você identifica a crença olhando para o resultado que ela produz no corpo, nas relações e no seu campo.

### 2. Desidentificação

O passo que muda tudo é simples e radical: "Eu tenho esse pensamento, mas eu NÃO SOU esse pensamento."

Quando você separa quem você É do que você aprendeu, o subconsciente perde território. Você sai do piloto automático e volta para o comando.

### 3. Sobreposição de frequência

A crença velha não se arranca, ela atrofia. Você cria uma nova vibração, uma nova imagem interna, uma emoção tão forte e tão coerente que o cérebro começa a escolher essa rota naturalmente.

A crença antiga morre por falta de energia. É assim que se reprograma: não lutando contra o velho, mas alimentando o novo até ele se tornar inevitável.

> "As crenças são os arquitetos invisíveis da sua prisão ou do seu palácio. Elas entraram sem bater quando você estava com a guarda baixa; agora, cabe à sua consciência adulta decidir quem tem as chaves da casa."`,
  },
  {
    order_index: 12,
    title: "Capítulo 3.10 · Como a Energia do Ambiente Molda Sua Mente",
    body_md: `A neurociência moderna já provou que o ambiente não é algo que apenas observamos. É algo que nós absorvemos. Através dos neurônios-espelho, nosso cérebro sincroniza automaticamente com as frequências ao redor.

Então se você está em um ambiente de caos, pressa, barulho, ansiedade… seu cérebro dispara cortisol mesmo que você esteja "bem". Você entra em ressonância com a agitação externa.

Se o ambiente não oferece sinais de paz, o seu cérebro atrofia as vias neurais ligadas ao relaxamento. Ele aprende: "Aqui, a paz não serve pra nada" — e fortalece apenas o circuito de alerta.

Você não consegue reprogramar a mente para paz se o seu ambiente físico grita guerra.

### A Lei da Correspondência: o caos fora reflete o caos dentro

"O que está fora é como o que está dentro." Um ambiente bagunçado, sujo ou sobrecarregado de informações é a projeção material de uma mente fragmentada.

Vibração coletiva: lugares onde muitas pessoas estão estressadas criam uma "egrégora" — uma nuvem de informação eletromagnética que satura o seu campo pessoal, tornando a mudança dez vezes mais pesada.

### Como moldar o ambiente para a nova frequência

Se você quer facilitar a mudança interna, comece pelo território externo. O ambiente é o primeiro tratamento — o recado silencioso que o seu subconsciente recebe 24h por dia.

**1. Higiene sensorial.** Principalmente para mentes sensíveis ou neurodivergentes, o ambiente precisa respirar. Menos estímulos = mais segurança para o cérebro primitivo: menos objetos, luz suave, silêncio ou sons limpos. Isso não é estética, é neurofisiologia: um ambiente calmo diz ao corpo "Você está seguro. Pode relaxar." E só um corpo em segurança consegue mudar.

**2. Sinalizadores de identidade.** O ambiente deve refletir quem você está se tornando, não quem você foi. Coloque à vista pequenos lembretes da sua nova versão: um caderno de estudo aberto, uma planta saudável, uma mesa organizada, uma imagem que represente ordem e presença. Isso funciona como um sinal epigenético: o cérebro interpreta esses objetos como provas materiais da sua nova identidade, e começa a se alinhar com ela.

**3. Dieta energética (digital e física).** O que você consome também é ambiente. Se suas redes sociais são campos de comparação, disputa e conflito… você está ingerindo cortisol emocional o dia inteiro. Seu campo energético absorve isso como se fosse alimento. Assim como você cuida do que come, cuide do que entra pela sua mente: contas que elevam, conteúdos que regulam o sistema nervoso, silêncio digital quando necessário.

Seu feed é uma extensão do seu campo.

> "Seu ambiente é o molde onde sua mente repousa. Nenhuma semente de paz floresce em solo caótico. Ajuste o sinal ao seu redor e sua biologia será obrigada a acompanhar a nova frequência."`,
  },
];

async function main() {
  const { error: delError } = await supabase.from("book_chapters").delete().eq("product", "metodo_calice");
  if (delError) throw delError;

  const rows = chapters.map((c) => ({ ...c, product: "metodo_calice" }));
  const { error: insError } = await supabase.from("book_chapters").insert(rows);
  if (insError) throw insError;

  // Estrutura mudou (era 3 capítulos, agora 13) — progresso de teste antigo
  // não faz mais sentido, senão alguém fica "no meio" de um capítulo que não existe mais.
  const { error: progError } = await supabase
    .from("book_progress")
    .update({ last_chapter_order: 0, completed: false })
    .eq("product", "metodo_calice");
  if (progError) throw progError;

  console.log(`livro real inserido: ${rows.length} capítulos/subcapítulos. progresso de teste resetado.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
