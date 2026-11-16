// Conteúdo introdutório conferido em fontes oficiais. Revalidar antes de cada edição.
export const REVISAO_INGRESSOS = '2026-11-16'
export const INGRESSOS = [
  {
    "id": "enem",
    "nome": "ENEM",
    "icone": "editar",
    "resumo": "Uma prova, diferentes portas de entrada.",
    "cor": "#334aee",
    "oQue": "O Exame Nacional do Ensino Médio avalia aprendizagens da educação básica. Sua nota pode ser usada em seleções de graduação, bolsas e financiamento.",
    "como": "Na aplicação regular, são dois dias: no primeiro, Linguagens, Ciências Humanas e redação; no segundo, Ciências da Natureza e Matemática. São 180 questões objetivas no total e uma redação dissertativo-argumentativa.",
    "participacao": "Quem concluiu ou está concluindo o ensino médio pode usar o resultado para acesso ao ensino superior. Quem ainda não conclui nessa edição pode participar como treineiro, conforme o edital.",
    "etapas": [
      "Leia o edital e faça a inscrição na Página do Participante.",
      "Confira a confirmação da inscrição, o local de prova e os documentos exigidos.",
      "Realize os dois dias do exame e acompanhe o resultado.",
      "Consulte as seleções que aceitam a edição da sua nota."
    ],
    "duvidas": [
      [
        "Como funciona a redação?",
        "Você desenvolve um texto dissertativo-argumentativo em português sobre o tema proposto. Consulte a cartilha do participante do Inep para conhecer as competências e a proposta de intervenção."
      ],
      [
        "Posso separar o caderno por disciplina?",
        "Os cadernos oficiais reúnem áreas do mesmo dia. As cores identificam versões; confira sempre dia, modalidade e caderno antes do gabarito."
      ],
      [
        "A nota garante uma vaga?",
        "Não. Cada processo tem suas próprias vagas, critérios e prazos."
      ]
    ],
    "links": [
      {
        "nome": "ENEM no Inep",
        "url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem"
      },
      {
        "nome": "Página do Participante",
        "url": "https://enem.inep.gov.br/participante/"
      },
      {
        "nome": "Cartilhas e orientações de redação no Inep",
        "url": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/outros-documentos"
      }
    ]
  },
  {
    "id": "sisu",
    "nome": "SISU",
    "icone": "faculdades",
    "resumo": "Vagas em instituições públicas usando o ENEM.",
    "cor": "#147954",
    "oQue": "O Sistema de Seleção Unificada reúne vagas de graduação de instituições públicas participantes. A seleção utiliza a nota do ENEM.",
    "como": "Pesquise vagas e escolha até duas opções, em ordem de preferência. A classificação considera a nota e a modalidade de concorrência. A nota de corte parcial é uma referência, não uma garantia.",
    "participacao": "Confira no edital quais edições do ENEM são aceitas. É necessário não ter zerado a redação e não ter feito a edição utilizada como treineiro. Algumas instituições exigem notas mínimas.",
    "etapas": [
      "Acesse o sistema com sua conta gov.br e confira seus dados.",
      "Pesquise cursos, locais de oferta e modalidades de concorrência.",
      "Escolha suas opções e acompanhe a classificação até o encerramento.",
      "Confira o resultado e siga as orientações da instituição para matrícula."
    ],
    "duvidas": [
      [
        "O que é nota de corte?",
        "É uma referência da pontuação necessária naquele momento para estar entre os classificados. Pode mudar durante as inscrições."
      ],
      [
        "E a lista de espera?",
        "Se não for selecionado em nenhuma opção na chamada regular, confira a possibilidade de manifestar interesse na lista de espera. Prazos e convocações seguem o edital e a instituição."
      ]
    ],
    "links": [
      {
        "nome": "Informações e etapas no gov.br",
        "url": "https://www.gov.br/pt-br/servicos/inscrever-se-no-sisu-sistema-de-selecao-unificada"
      },
      {
        "nome": "Portal oficial do SISU",
        "url": "https://acessounico.mec.gov.br/sisu"
      }
    ]
  },
  {
    "id": "prouni",
    "nome": "PROUNI",
    "icone": "objetivos",
    "resumo": "Bolsas de estudo em instituições privadas.",
    "cor": "#703fd5",
    "oQue": "O Programa Universidade para Todos oferece bolsas de estudo em cursos de instituições privadas participantes: integrais, de 100%, e parciais, de 50%.",
    "como": "Você usa a nota do ENEM para concorrer às bolsas disponíveis. A pré-seleção precisa ser seguida da comprovação das informações na instituição.",
    "participacao": "O programa atende estudantes sem diploma de graduação que cumpram os critérios do edital. Em geral, exige média mínima de 450 no ENEM e redação acima de zero. A bolsa integral tem limite de renda de até 1,5 salário mínimo por pessoa; a parcial, até 3. Há condições e exceções específicas a conferir.",
    "etapas": [
      "Confira o edital, as edições do ENEM aceitas e os critérios de participação.",
      "Inscreva-se no portal e selecione as opções de bolsa.",
      "Acompanhe chamadas e eventuais etapas de lista de espera.",
      "Se pré-selecionado, apresente os comprovantes no prazo e conclua a matrícula."
    ],
    "duvidas": [
      [
        "Bolsa é financiamento?",
        "Não. A bolsa cobre a parte concedida da mensalidade e não é um empréstimo a ser devolvido."
      ],
      [
        "Na bolsa parcial, pago alguma coisa?",
        "Sim. A bolsa de 50% cobre metade da mensalidade. Confira com a instituição o valor restante e as condições do curso."
      ],
      [
        "Basta atingir a nota mínima?",
        "Não. É necessário cumprir os demais critérios e ser selecionado entre as vagas disponíveis."
      ]
    ],
    "links": [
      {
        "nome": "Regras e dúvidas do PROUNI",
        "url": "https://prouniportal.mec.gov.br/tire-suas-duvidas-pesquisa/documentacao/76-comprovantes-de-rendimentos"
      },
      {
        "nome": "Portal oficial do PROUNI",
        "url": "https://acessounico.mec.gov.br/prouni"
      }
    ]
  },
  {
    "id": "fies",
    "nome": "FIES",
    "icone": "ingressos",
    "resumo": "Financiamento para planejar com responsabilidade.",
    "cor": "#b54909",
    "oQue": "O Fundo de Financiamento Estudantil financia cursos de graduação em instituições privadas participantes. É financiamento, com obrigações contratuais e financeiras.",
    "como": "Depois da seleção, há etapas de complementação de informações, validação pela instituição e contratação. Ser pré-selecionado ainda não significa ter um contrato aprovado.",
    "participacao": "Consulte o edital e as condições da edição. As referências gerais incluem ENEM a partir de 2010, média mínima de 450, redação acima de zero e renda familiar por pessoa de até 3 salários mínimos. O Fies Social possui critérios próprios.",
    "etapas": [
      "Consulte as vagas, os requisitos e o edital no portal oficial.",
      "Inscreva-se e acompanhe a seleção.",
      "Se pré-selecionado, complemente a inscrição e valide os documentos.",
      "Leia as condições e conclua a contratação no prazo informado."
    ],
    "duvidas": [
      [
        "Financiamento significa faculdade gratuita?",
        "Não. O contrato estabelece responsabilidades, valores e formas de pagamento. Entenda essas obrigações antes de contratar."
      ],
      [
        "Posso financiar qualquer curso?",
        "Não. É necessário haver oferta participante e cumprir os critérios. Não presuma adesão de uma instituição."
      ],
      [
        "Qual será o valor que vou pagar?",
        "Depende das condições do seu contrato e da oferta. Consulte os canais oficiais; o MeuNorte não calcula nem promete valores."
      ]
    ],
    "links": [
      {
        "nome": "FIES na CAIXA",
        "url": "https://www.caixa.gov.br/programas-sociais/fies/Paginas/default.aspx"
      },
      {
        "nome": "Portal oficial do FIES",
        "url": "https://acessounico.mec.gov.br/fies"
      }
    ]
  },
  {
    "id": "vestibulares",
    "nome": "Vestibulares",
    "icone": "editar",
    "resumo": "Conheça os processos de cada instituição.",
    "cor": "#aa187b",
    "oQue": "Vestibulares são processos de seleção organizados por instituições ou bancas. Cada edital define como as vagas serão disputadas.",
    "como": "O formato varia: pode incluir questões objetivas, redação, provas específicas ou outras etapas. Algumas seleções aceitam nota do ENEM, com regras próprias.",
    "participacao": "Consulte o edital da instituição: ele informa escolaridade, documentos, vagas, critérios, condições de inscrição e matrícula.",
    "etapas": [
      "Encontre o edital no site oficial da instituição.",
      "Confira curso, campus, vagas e requisitos antes de se inscrever.",
      "Prepare-se para as provas e demais etapas previstas.",
      "Acompanhe resultados, chamadas e documentos para matrícula."
    ],
    "duvidas": [
      [
        "É igual ao ENEM?",
        "Não necessariamente. O ENEM é um exame nacional; o vestibular segue o formato e o conteúdo definidos no edital de cada seleção."
      ],
      [
        "Toda instituição tem vestibular?",
        "Não. As formas de ingresso variam. Confira o processo do curso e do campus desejados."
      ],
      [
        "Onde vejo datas e resultados?",
        "No edital e nos canais oficiais da instituição ou banca. Evite confiar em calendários de seleções já encerradas."
      ]
    ],
    "links": [
      {
        "nome": "Consultar instituições no e-MEC",
        "url": "https://emec.mec.gov.br/"
      }
    ]
  }
]
