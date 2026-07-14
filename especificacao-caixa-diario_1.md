# Especificação do projeto — Caixa Diário Web App

## Visão geral

Aplicação web para análise e criação de arquivos Excel de caixa diário financeiro. O sistema não possui banco de dados — todos os dados são fornecidos pelo usuário em cada sessão. A aplicação é composta por dois repositórios independentes: backend e frontend.

---

## Repositório 1 — `caixa-diario-backend`

### Tecnologias

- Python 3.11+
- FastAPI
- openpyxl (leitura e escrita de arquivos `.xlsx`)
- Pydantic (validação de dados)

### Responsabilidades

- Receber e validar arquivos `.xlsx` enviados pelo frontend
- Parsear os dados e calcular as métricas do dashboard
- Receber lançamentos novos e mesclar com um arquivo existente (se houver)
- Gerar e retornar o arquivo `.xlsx` atualizado ou criado do zero

### Estrutura de pastas

```
caixa-diario-backend/
├── app/
│   ├── main.py
│   ├── routers/
│   │   ├── upload.py
│   │   ├── export.py
│   │   └── template.py
│   ├── schemas/
│   │   ├── lancamento.py
│   │   └── dashboard.py
│   └── services/
│       ├── excel_parser.py
│       ├── excel_writer.py
│       └── calculos.py
├── requirements.txt
└── .env.example
```

### Colunas do Excel (fixas e obrigatórias)

| Coluna | Tipo | Valores aceitos |
|---|---|---|
| `data` | int | qualquer numero |
| `descricao` | string | texto livre |
| `tipo` | string | `"entrada"` ou `"saida"` |
| `categoria` | string | texto livre |
| `valor` | float | número positivo |

O backend deve rejeitar qualquer arquivo que não possua exatamente essas colunas, retornando um erro descritivo ao frontend.

### Endpoints

#### `GET /template`

Retorna a estrutura de colunas esperada pelo sistema. Usado pelo frontend para montar o formulário e informar o usuário sobre o formato correto.

**Resposta:**
```json
{
  "colunas": ["data", "descricao", "tipo", "categoria", "valor"],
  "tipos": {
    "data": "número positivo",
    "tipo": ["receita", "despesa"],
    "valor": "número positivo"
  }
}
```

---

#### `POST /upload`

Recebe um arquivo `.xlsx`, valida as colunas, lê os lançamentos e retorna os dados calculados para o dashboard.

**Request:** `multipart/form-data` com campo `file` (`.xlsx`)

**Validações:**
- Colunas obrigatórias presentes
- Coluna `tipo` contém apenas `"receita"` ou `"despesa"`
- Coluna `valor` contém apenas números positivos
- Coluna `data` em formato válido

**Resposta:**
```json
{
  "total_receitas": 18400.00,
  "total_despesas": 12750.00,
  "lucro_acumulado": 5650.00,
  "margem_lucro": 30.7,
  "serie_diaria": [
    { "data": "01", "receita": 2100.00, "despesa": 1400.00 }
  ],
  "serie_acumulado": [
    { "data": "01", "saldo": 700.00 }
  ]
}
```

---

#### `POST /export`

Recebe os novos lançamentos em JSON e, opcionalmente, um arquivo `.xlsx` existente. Se o arquivo existir, o backend lê os dados anteriores e adiciona os novos lançamentos ao final, preservando tudo. Se não houver arquivo, cria do zero.

**Request:** `multipart/form-data` com:
- `lancamentos` — JSON com lista de lançamentos novos
- `file` (opcional) — arquivo `.xlsx` existente

**Resposta:** arquivo `.xlsx` pronto para download (`StreamingResponse`, `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

---

### Cálculos (`calculos.py`)

| Métrica | Fórmula |
|---|---|
| Total de receitas | soma de todos os lançamentos com `tipo = "entrada"` |
| Total de despesas | soma de todos os lançamentos com `tipo = "saida"` |
| Lucro acumulado | `receitas - despesas` |
| Margem de lucro | `(lucro / receitas) × 100` — retorna `0` se receitas forem zero |
| Série diária | agrupamento por data com soma de receitas e despesas de cada dia |
| Série acumulada | saldo acumulado dia a dia em ordem cronológica |

---

### Variáveis de ambiente

```
# .env.example
ALLOWED_ORIGINS=http://localhost:5173
```

---

## Repositório 2 — `caixa-diario-frontend`

### Tecnologias

A stack será definida pelo time de frontend. As opções recomendadas são React + Vite, Next.js ou Vue. A especificação abaixo é agnóstica de framework.

### Responsabilidades

- Oferecer interface para upload e visualização do dashboard
- Oferecer formulário para criação e edição de lançamentos
- Comunicar-se com o backend via HTTP
- Gerenciar os dados em memória durante a sessão (sem banco de dados)

### Estrutura de pastas sugerida

```
caixa-diario-frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage
│   │   ├── UploadPage
│   │   ├── DashboardPage
│   │   ├── FormPage
│   │   └── DownloadPage
│   ├── components/
│   │   ├── LancamentoForm
│   │   ├── TabelaLancamentos
│   │   ├── GraficoBarras
│   │   ├── GraficoLinha
│   │   ├── KpiCard
│   │   └── DropZone
│   ├── services/
│   │   └── api.js (ou api.ts)
│   └── types/
│       └── lancamento.js (ou lancamento.ts)
├── .env.example
└── README.md
```

### Telas

#### Tela 1 — Home

Ponto de entrada da aplicação. Apresenta duas opções bem visíveis:

- **Analisar um Excel** → leva para a tela de Upload
- **Criar um Excel** → leva para o Formulário

Sem nenhum outro elemento além da navegação entre os dois fluxos.

---

#### Tela 2 — Upload + Dashboard

O usuário faz o upload de um arquivo `.xlsx`. Após o envio, a tela se transforma no dashboard com os dados calculados pelo backend.

**Componentes:**
- Drop zone para upload do arquivo (aceita apenas `.xlsx`)
- 4 cards de KPI:
  - Total de receitas (verde)
  - Total de despesas (vermelho)
  - Lucro acumulado (verde se positivo, vermelho se negativo)
  - Margem de lucro (percentual)
- Gráfico de barras: receitas vs despesas por dia
- Gráfico de linha: lucro acumulado ao longo do período

**Comportamento:**
- Antes do upload: exibe apenas a drop zone
- Após upload com sucesso: exibe os KPIs e os gráficos
- Em caso de erro de validação do backend: exibe mensagem clara sobre qual coluna está incorreta

---

#### Tela 3 — Formulário (criar ou editar Excel)

O usuário pode iniciar do zero ou subir um arquivo `.xlsx` existente para adicionar novos lançamentos.

**Componentes:**
- Opção de upload de arquivo existente (opcional)
- Formulário de entrada com os campos:
  - Data (date picker ou input de texto)
  - Descrição (texto livre)
  - Tipo (seletor: entrada ou saída)
  - Categoria (texto livre)
  - Valor (número positivo)
- Botão para adicionar a linha
- Botão para remover uma linha já adicionada
- Botão para ir para o download

**Comportamento:**
- Se o usuário subir um arquivo existente, os dados anteriores ficam armazenados em memória e serão enviados junto ao backend no momento do export
- O frontend não exibe os lançamentos anteriores, apenas permite adicionar novos
- A validação dos campos deve ocorrer no frontend antes de enviar ao backend

---

#### Tela 4 — Download

Exibida após o usuário finalizar o preenchimento. Pode ser implementada como modal ou tela separada, a critério do time de frontend.

**Componentes:**
- Mensagem de confirmação simples
- Botão de download do arquivo `.xlsx`

**Comportamento:**
- Ao confirmar, o frontend envia para `POST /export`:
  - O arquivo `.xlsx` existente (se houver)
  - Os novos lançamentos em JSON
- O backend retorna o arquivo mesclado pronto para download
- O download inicia automaticamente no navegador

---

### Comunicação com o backend (`api.js`)

| Função | Método | Endpoint | Payload |
|---|---|---|---|
| `uploadExcel(file)` | POST | `/upload` | `multipart/form-data` |
| `exportExcel(lancamentos, file?)` | POST | `/export` | `multipart/form-data` |
| `getTemplate()` | GET | `/template` | — |

### Variáveis de ambiente

```
# .env.example
VITE_API_URL=http://localhost:8000
```

---

## Fluxos da aplicação

### Fluxo 1 — Análise de Excel existente

```
Home → Upload do arquivo → Dashboard com KPIs e gráficos
```

### Fluxo 2 — Criação de Excel do zero

```
Home → Formulário → preenche lançamentos → Download
```

### Fluxo 3 — Edição de Excel existente

```
Home → Formulário → sobe arquivo existente → adiciona lançamentos → Download
```

---

## Regras gerais

- O backend é completamente stateless: não armazena nada entre requisições
- Todos os dados trafegam via HTTP entre frontend e backend
- O frontend é responsável por manter os dados em memória durante a sessão
- O arquivo `.xlsx` gerado deve sempre seguir o modelo de colunas definido
- Valores negativos não são aceitos no campo `valor` — o campo `tipo` é quem define se é entrada ou saída
