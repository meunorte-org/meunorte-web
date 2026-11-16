// URLs extraídas das páginas anuais do Inep; HTTP 200 e tipo PDF conferidos em 16/11/2026.
export const ACERVO_OFICIAL = 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos'
// A prova azul do 1º dia de 2025 respondeu HTTP 200 na primeira verificação; houve oscilação de conexão na segunda.
export const ACERVO_ENEM = [
  {
    "ano": 2025,
    "fonte": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2025",
    "verificadoEm": "2026-11-16",
    "materiais": [
      {
        "id": "2025-1-1-0",
        "dia": 1,
        "caderno": 1,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "nome": "Prova",
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD1.pdf"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD1.pdf",
            "nome": "Gabarito"
          }
        ],
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD1.pdf",
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD1.pdf"
      },
      {
        "id": "2025-1-2-1",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD2.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD2.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2025-1-3-2",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD3.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD3.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2025-1-4-3",
        "dia": 1,
        "caderno": 4,
        "cor": "Verde",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD4.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD4.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2025-1-9-4",
        "dia": 1,
        "caderno": 9,
        "cor": "Laranja (Braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9.pdf",
            "nome": "Prova (Atendimento Especializado)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9_ledor.pdf",
            "nome": "Prova (Ledor)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_1_P1_LC_CH_Caderno_09_Laranja_NVDA.pdf",
            "nome": "Prova | Leitor de tela (NVDA)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD9.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD9.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD9.pdf"
      },
      {
        "id": "2025-1-10-5",
        "dia": 1,
        "caderno": 10,
        "cor": "Roxo (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD10.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD10_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD10_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD10.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2025-2-5-6",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD5.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD5.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2025-2-6-7",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD6.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD6.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2025-2-7-8",
        "dia": 2,
        "caderno": 7,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD7.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD7.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD7.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD7.pdf"
      },
      {
        "id": "2025-2-8-9",
        "dia": 2,
        "caderno": 8,
        "cor": "Verde",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD8.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD8.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2025-2-11-10",
        "dia": 2,
        "caderno": 11,
        "cor": "Laranja (Braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11.pdf",
            "nome": "Prova (Atendimento Especializado)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11_ledor.pdf",
            "nome": "Prova (Ledor)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_Dia_2_P1_CN_MT_Caderno_11_Laranja_NVDA.pdf",
            "nome": "Prova | Leitor de tela (NVDA)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD11.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD11.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD11.pdf"
      },
      {
        "id": "2025-2-12-11",
        "dia": 2,
        "caderno": 12,
        "cor": "Roxo (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD12.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD12_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD12_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD12.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2025_GB_impresso_D2_CD12.pdf"
      }
    ],
    "pendencia": "Aplicação regular impressa. Outras aplicações estão disponíveis na página oficial de cada edição."
  },
  {
    "ano": 2024,
    "fonte": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2024",
    "verificadoEm": "2026-11-16",
    "materiais": [
      {
        "id": "2024-1-1-0",
        "dia": 1,
        "caderno": 1,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD1.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD1.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD1.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD1.pdf"
      },
      {
        "id": "2024-1-2-1",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD2.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD2.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2024-1-3-2",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD3.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD3.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2024-1-4-3",
        "dia": 1,
        "caderno": 4,
        "cor": "Verde",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD4.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD4_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD4_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD4.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2024-1-9-4",
        "dia": 1,
        "caderno": 9,
        "cor": "Laranja (Braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD9.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_Dia_1_P1_LC_CH_Caderno_09_Laranja_NVDA.pdf",
            "nome": "Prova | Leitor de tela (NVDA)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD9.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD9.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD9.pdf"
      },
      {
        "id": "2024-1-10-5",
        "dia": 1,
        "caderno": 10,
        "cor": "Roxo (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD10.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD10_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD10_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD10.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2024-2-5-6",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD5.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD5.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2024-2-6-7",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD6.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD6.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2024-2-7-8",
        "dia": 2,
        "caderno": 7,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD7.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD7.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD7.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD7.pdf"
      },
      {
        "id": "2024-2-8-9",
        "dia": 2,
        "caderno": 8,
        "cor": "Verde",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD8.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD8_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD8_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD8.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2024-2-11-10",
        "dia": 2,
        "caderno": 11,
        "cor": "Laranja (braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD11.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_Dia_2_P1_CN_MT_Caderno_11_Laranja_NVDA.pdf",
            "nome": "Prova | Leitor de tela (NVDA)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD11.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD11.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD11.pdf"
      },
      {
        "id": "2024-2-12-11",
        "dia": 2,
        "caderno": 12,
        "cor": "Roxo (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD12.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD12_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD12.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_GB_impresso_D2_CD12.pdf"
      }
    ],
    "pendencia": "Aplicação regular impressa. O PDF superampliado do caderno 12 (Libras), 2º dia, não respondeu como disponível nesta revisão; consulte o acervo oficial. Outras aplicações também estão no Inep."
  },
  {
    "ano": 2023,
    "fonte": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2023",
    "verificadoEm": "2026-11-16",
    "materiais": [
      {
        "id": "2023-1-1-0",
        "dia": 1,
        "caderno": 1,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD1.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD1.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD1.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD1.pdf"
      },
      {
        "id": "2023-1-2-1",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD2.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD2.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2023-1-3-2",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD3.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD3.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2023-1-4-3",
        "dia": 1,
        "caderno": 4,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2023-1-9-4",
        "dia": 1,
        "caderno": 9,
        "cor": "Laranja (Braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD9.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD9.pdf",
            "nome": "Gabarito"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_1_P1_CH_Caderno_09_Laranja_NVDA.pdf",
            "nome": "Caderno 9 – Laranja – Leitor de tela (NVDA)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_1_P1_LC_Caderno_09_Laranja_NVDA.pdf",
            "nome": "Caderno 9 – Laranja – Leitor de tela (NVDA)"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD9.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD9.pdf"
      },
      {
        "id": "2023-1-10-5",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD10.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD10_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD10_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD10.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2023-2-5-6",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD5.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD5.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2023-2-6-7",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD6.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD6.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2023-2-7-8",
        "dia": 2,
        "caderno": 7,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD7.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD7.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD7.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD7.pdf"
      },
      {
        "id": "2023-2-8-9",
        "dia": 2,
        "caderno": 8,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD8.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD8_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD8_superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD8.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2023-2-11-10",
        "dia": 2,
        "caderno": 11,
        "cor": "Laranja (braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD11.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD11.pdf",
            "nome": "Gabarito"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_2_P1_CN_Caderno_11_Laranja_NVDA.pdf",
            "nome": "Caderno 11 – Laranja – Leitor de tela (NVDA)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_Dia_2_P1_MT_Caderno_11_Laranja_NVDA.pdf",
            "nome": "Caderno 11 – Laranja – Leitor de tela (NVDA)"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD11.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD11.pdf"
      },
      {
        "id": "2023-2-12-11",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD12.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD12_ampliada.pdf",
            "nome": "Prova (Ampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD12_Superampliada.pdf",
            "nome": "Prova (Superampliada)"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD12.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_GB_impresso_D2_CD12.pdf"
      }
    ],
    "pendencia": "Aplicação regular impressa. Outras aplicações estão disponíveis na página oficial de cada edição."
  },
  {
    "ano": 2022,
    "fonte": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2022",
    "verificadoEm": "2026-11-16",
    "materiais": [
      {
        "id": "2022-1-1-0",
        "dia": 1,
        "caderno": 1,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD1.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD1.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD1.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD1.pdf"
      },
      {
        "id": "2022-1-2-1",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD2.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD2.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2022-1-3-2",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2022-1-3-3",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco (Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2022-1-3-4",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco (Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD3_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2022-1-4-5",
        "dia": 1,
        "caderno": 4,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD4.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD4.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2022-1-9-6",
        "dia": 1,
        "caderno": 9,
        "cor": "Laranja (Braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD9.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD9.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD9.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD9.pdf"
      },
      {
        "id": "2022-1-10-7",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2022-1-10-8",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras – Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2022-1-10-9",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras – Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD10_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2022-2-5-10",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD5.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD5.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2022-2-6-11",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2022-2-6-12",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza (Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2022-2-6-13",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza (Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD6_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2022-2-7-14",
        "dia": 2,
        "caderno": 7,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD7.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD7.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD7.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD7.pdf"
      },
      {
        "id": "2022-2-8-15",
        "dia": 2,
        "caderno": 8,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD8.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD8.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2022-2-11-16",
        "dia": 2,
        "caderno": 11,
        "cor": "Laranja (braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD11.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD11.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD11.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD11.pdf"
      },
      {
        "id": "2022-2-12-17",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD12.pdf"
      },
      {
        "id": "2022-2-12-18",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras – Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD12.pdf"
      },
      {
        "id": "2022-2-12-19",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras – Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD12_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2022_GB_impresso_D2_CD12.pdf"
      }
    ],
    "pendencia": "Aplicação regular impressa. Outras aplicações estão disponíveis na página oficial de cada edição."
  },
  {
    "ano": 2021,
    "fonte": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2021",
    "verificadoEm": "2026-11-16",
    "materiais": [
      {
        "id": "2021-1-1-0",
        "dia": 1,
        "caderno": 1,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD1.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD1.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD1.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD1.pdf"
      },
      {
        "id": "2021-1-2-1",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2021-1-2-2",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo (Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2021-1-2-3",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo (Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD2_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2021-1-3-4",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD3.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD3.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2021-1-4-5",
        "dia": 1,
        "caderno": 4,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD4.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD4.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2021-1-9-6",
        "dia": 1,
        "caderno": 9,
        "cor": "Laranja (Braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD9.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD9.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD9.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD9.pdf"
      },
      {
        "id": "2021-1-10-7",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2021-1-10-8",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras – Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2021-1-10-9",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras – Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD10_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2021-2-5-10",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2021-2-5-11",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo (Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2021-2-5-12",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo (Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2021-2-6-13",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD6.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD6.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2021-2-7-14",
        "dia": 2,
        "caderno": 7,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD7.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD7.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD7.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD7.pdf"
      },
      {
        "id": "2021-2-8-15",
        "dia": 2,
        "caderno": 8,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD8.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD8.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2021-2-11-16",
        "dia": 2,
        "caderno": 11,
        "cor": "Laranja (braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD11.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD11.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD11.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD11.pdf"
      },
      {
        "id": "2021-2-12-17",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD12.pdf"
      },
      {
        "id": "2021-2-12-18",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras – Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD12.pdf"
      },
      {
        "id": "2021-2-12-19",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras – Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD12_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2021_GB_impresso_D2_CD12.pdf"
      }
    ],
    "pendencia": "Aplicação regular impressa. Outras aplicações estão disponíveis na página oficial de cada edição."
  },
  {
    "ano": 2020,
    "fonte": "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/2020",
    "verificadoEm": "2026-11-16",
    "materiais": [
      {
        "id": "2020-1-1-0",
        "dia": 1,
        "caderno": 1,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD1.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD1.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD1.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD1.pdf"
      },
      {
        "id": "2020-1-2-1",
        "dia": 1,
        "caderno": 2,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD2.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD2.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD2.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD2.pdf"
      },
      {
        "id": "2020-1-3-2",
        "dia": 1,
        "caderno": 3,
        "cor": "Branco",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD3.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD3.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD3.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD3.pdf"
      },
      {
        "id": "2020-1-4-3",
        "dia": 1,
        "caderno": 4,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2020-1-4-4",
        "dia": 1,
        "caderno": 4,
        "cor": "Rosa (Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2020-1-4-5",
        "dia": 1,
        "caderno": 4,
        "cor": "Rosa (Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD4.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD4_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD4.pdf"
      },
      {
        "id": "2020-1-9-6",
        "dia": 1,
        "caderno": 9,
        "cor": "Laranja (braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD9.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD9.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD9.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD9.pdf"
      },
      {
        "id": "2020-1-10-7",
        "dia": 1,
        "caderno": 10,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD10.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD10.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D1_CD10.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D1_CD10.pdf"
      },
      {
        "id": "2020-2-5-8",
        "dia": 2,
        "caderno": 5,
        "cor": "Amarelo",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD5.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD5.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD5.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD5.pdf"
      },
      {
        "id": "2020-2-6-9",
        "dia": 2,
        "caderno": 6,
        "cor": "Cinza",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD6.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD6.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD6.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD6.pdf"
      },
      {
        "id": "2020-2-7-10",
        "dia": 2,
        "caderno": 7,
        "cor": "Azul",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD7.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD7.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD7.pdf"
      },
      {
        "id": "2020-2-8-11",
        "dia": 2,
        "caderno": 8,
        "cor": "Rosa",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2020-2-8-12",
        "dia": 2,
        "caderno": 8,
        "cor": "Rosa (Ampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8_ampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8_ampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2020-2-8-13",
        "dia": 2,
        "caderno": 8,
        "cor": "Rosa (Superampliada)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8_superampliada.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD8.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD8_superampliada.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD8.pdf"
      },
      {
        "id": "2020-2-11-14",
        "dia": 2,
        "caderno": 11,
        "cor": "Laranja (braile e ledor)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD11.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD11.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD11.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD11.pdf"
      },
      {
        "id": "2020-2-12-15",
        "dia": 2,
        "caderno": 12,
        "cor": "Verde (Libras)",
        "modalidade": "Aplicação regular · impressa",
        "documentos": [
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD12.pdf",
            "nome": "Prova"
          },
          {
            "url": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD12.pdf",
            "nome": "Gabarito"
          }
        ],
        "prova": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_PV_impresso_D2_CD12.pdf",
        "gabarito": "https://download.inep.gov.br/enem/provas_e_gabaritos/2020_GB_impresso_D2_CD12.pdf"
      }
    ],
    "pendencia": "Aplicação regular impressa. Outras aplicações estão disponíveis na página oficial de cada edição."
  }
]
