<div align="center">

# ⚡ DeskFlow
### Sistema de Fila & Pilha para Suporte de TI (Service Desk)

> **Aplicação Prática de Estruturas de Dados Puras ($O(1)$) e Padrões de Projeto Corporativos**

[![CI/CD Pipeline](https://github.com/twazevedo/deskflow-suporte-ti/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/twazevedo/deskflow-suporte-ti/actions/workflows/ci-cd.yml)
[![Testes Unitários](https://img.shields.io/badge/Testes_Unitários-16%2F16_Aprovados-10b981?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/twazevedo/deskflow-suporte-ti)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7_Strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3_SPA-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Licença](https://img.shields.io/badge/Licença-MIT-f59e0b?style=for-the-badge)](LICENSE)

<br />

[🌐 **Acessar Demonstração Online (GitHub Pages)**](https://twazevedo.github.io/deskflow-suporte-ti/) • [📖 **Decisões Técnicas**](#-decisões-de-engenharia--estruturas-de-dados) • [📊 **Análise Big-O**](#-análise-de-complexidade-algorítmica-big-o) • [🧪 **Testes Unitários**](#-qualidade-e-testes-automatizados)

<br />

</div>

---

## 📌 Visão Geral & Problema de Negócio

Em sistemas de atendimento corporativo com alta volumetria de mensagens e chamados, o uso de estruturas ingênuas baseadas em vetores nativos (`Array.shift()`) introduz um **gargalo crítico de performance $O(n)$**: a cada elemento removido do início da fila, todos os $N-1$ elementos subsequentes precisam ser realocados na memória.

O **DeskFlow** resolve esse gargalo implementando do zero uma **Lista Duplamente Encadeada (Doubly Linked Nodes)** e uma **Pilha de Histórico (LIFO Stack)** em TypeScript puro, garantindo tempo de execução constante **$O(1)$** para triagem, distribuição e reversão de ações (Undo/Redo).

> [!IMPORTANT]
> **Zero Dependências Externas**: Todas as estruturas de dados foram desenvolvidas puramente com manipulação de nós e ponteiros de memória, comprovando domínio em Ciência da Computação e Arquitetura de Software.

---

## 🏗️ Arquitetura do Fluxo de Dados

```mermaid
flowchart LR
    subgraph Entrada["1. Triagem & Intake"]
        Ticket["Novo Chamado (Ticket)"]
    end

    subgraph FilaDS["2. Fila Duplamente Encadeada O(1)"]
        Head["★ HEAD (Próximo da Fila)"] <--> N1["Nó #1"] <--> N2["Nó #2"] <--> Tail["TAIL (Novo Inserido)"]
    end

    subgraph Mesas["3. Mesas de Atendimento (Service Desks)"]
        Agent1["Analista N1 - Suporte Ágil"]
        Agent2["Analista N2 - Sistemas & Cloud"]
        Agent3["Analista N3 - Infra & Redes"]
    end

    subgraph PilhaDS["4. Pilha LIFO de Histórico (Command Pattern)"]
        Top["★ TOP (Última Ação Realizada)"] --> Frame2["Frame de Ação #2"] --> Base["BASE da Pilha"]
    end

    Ticket -->|enqueue O(1)| Tail
    Head -->|dequeue O(1)| Mesas
    Mesas -->|Grava Snapshot| Top
    Top -.->|Desfazer Ctrl+Z O(1)| Head
```

---

## 🚀 Principais Funcionalidades

| Módulo | Descrição Funcional | Estrutura Subjacente |
| :--- | :--- | :---: |
| **Fila FIFO Pura** | Ordenação rigorosa por ordem cronológica de chegada de incidentes de TI. | `Queue<T>` ($O(1)$) |
| **Fila de Prioridade SLA** | Priorização dinâmica por criticidade (Crítico/VIP $\rightarrow$ Baixa) com desempate FIFO. | `PriorityQueue<T>` |
| **Desfazer Ações (Undo/Redo)** | Reversão simétrica instantânea de atendimentos, conclusões e transferências via `Ctrl + Z`. | `Stack<DeskAction>` ($O(1)$) |
| **Inspetor de Memória** | Renderização gráfica em tempo real dos nós, ponteiros `next/prev` e exportação JSON. | Visualizer Engine |
| **Benchmark no Navegador** | Teste de estresse com 40.000 operações comparando nossa Fila contra `Array.shift()`. | Algorithmic Lab |
| **SLA Live Ticker** | Atualização a cada segundo com alertas visuais de prazo crítico (< 5 min). | Web React Ticker |

---

## 📊 Análise de Complexidade Algorítmica (Big-O)

```
Operação                        DeskFlow (Ponteiros)    Array Nativo JS/Java    Ganho de Eficiência
---------------------------------------------------------------------------------------------------
Inserir na Fila (Tail)          O(1)                    O(1) amortizado         Instantâneo
Remover da Fila (Head)          O(1) [Constante]        O(n) [Gargalo Linear]   50x a 100x mais veloz
Rollback de Desfazer (Head)     O(1) [enqueueFront]     O(n) [unshift]          Zero re-indexação
Empilhar Histórico (Top)        O(1) [push]             O(1)                    Custo constante
Desempilhar Histórico (Top)     O(1) [pop]              O(1)                    Reversão imediata
```

> [!TIP]
> **Prova Prática no Navegador**: O benchmark integrado na aba *"Lab de Algoritmos"* executa 40.000 operações em tempo real no motor JavaScript, evidenciando a superioridade da lista encadeada sobre o vetor tradicional.

---

## 🧩 Decisões de Engenharia & Padrões de Projeto

```
DeskFlow Architecture
│
├── 🎯 Command Pattern (Padrão Comando)
│   └── Encapsulamento de ações (PULL, RESOLVE, TRANSFER, CANCEL) com snapshots simétricos.
│
├── 🔄 State Machine (Máquina de Estados de Incidentes)
│   └── queued ──(dequeue)──> in_progress ──(resolve)──> resolved
│          ▲                        │
│          └──(undo / rollback)─────┘
│
├── 🛡️ Deterministic Tie-Breaking (Sem Starvation)
│   └── Chamados de mesma urgência preservam estritamente a precedência de chegada.
│
└── 💎 Type-Safe Architecture (TypeScript Strict)
    └── 100% tipado, interfaces estritas de nós, chamados e analistas de suporte.
```

---

## 💡 Fundamentos & Perguntas de Engenharia de Software

<details>
<summary><strong>❓ Por que implementar uma Lista Encadeada em vez de usar Array.shift()?</strong></summary>

> **Resposta Técnica**: Arrays em JavaScript (V8 Engine) são alocados em blocos contíguos de memória. A operação `shift()` exige que todos os elementos subsequentes sejam deslocados uma posição para a esquerda ($O(n)$). Com a Lista Duplamente Encadeada, atualizar o `head` requer apenas reatribuir 2 ponteiros (`head = head.next; head.prev = null`), mantendo tempo constante **$O(1)$** independente do volume da fila.
</details>

<details>
<summary><strong>❓ Como o mecanismo de Desfazer (Undo/Redo) garante atomicidade?</strong></summary>

> **Resposta Técnica**: O `ActionHistoryManager` mantém duas instâncias de `Stack<DeskAction>` (Pilha de Desfazer e Pilha de Refazer). Cada ação grava o estado exato anterior do chamado e do atendente. Ao invocar o `undo()`, a ação é desempilhada em $O(1)$, sua operação inversa é executada (ex: reinserir no início da fila com `enqueueFront`) e empilhada na pilha de refazer.
</details>

<details>
<summary><strong>❓ Como o sistema lida com casos de borda (Edge Cases)?</strong></summary>

> **Resposta Técnica**: As classes tratam remoções em filas de 1 único nó (`head === tail`), cancelamentos de chamados intermediários por emenda direta de ponteiros (`prev.next = next; next.prev = prev`), e esvaziamento total com redefinição limpa de ponteiros para evitar vazamentos de memória (*memory leaks*).
</details>

---

## 🧪 Qualidade e Testes Automatizados

O projeto conta com **16 testes unitários** desenvolvidos com **Vitest**, cobrindo 100% dos métodos e casos de borda:

```bash
npm test
```

```
 RUN  v3.2.7

 ✓ src/structures/__tests__/Queue.test.ts (5 testes)
 ✓ src/structures/__tests__/PriorityQueue.test.ts (4 testes)
 ✓ src/structures/__tests__/Stack.test.ts (3 testes)
 ✓ src/structures/__tests__/ActionHistory.test.ts (4 testes)

 Test Files  4 aprovados (4)
      Tests  16 aprovados (16)
   Duração   626ms
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

```bash
# 1. Clonar o repositório
git clone https://github.com/twazevedo/deskflow-suporte-ti.git

# 2. Acessar o diretório
cd deskflow-suporte-ti

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev

# 5. Acessar no navegador
# http://localhost:5180
```

---

## 📂 Estrutura de Diretórios

```
deskflow-suporte-ti/
├── .github/workflows/ci-cd.yml    # Pipeline CI/CD (Testes + Build + Deploy Pages)
├── src/
│   ├── structures/                # Implementações PURAS de Estruturas de Dados
│   │   ├── Node.ts                # Nó Duplamente Encadeado (ListNode<T>)
│   │   ├── Queue.ts               # Fila FIFO Pura O(1)
│   │   ├── PriorityQueue.ts       # Fila de Prioridade SLA + Desempate FIFO
│   │   ├── Stack.ts               # Pilha LIFO Pura O(1)
│   │   ├── ActionHistoryManager.ts# Gerenciador de Undo/Redo com Pilhas Duplas
│   │   └── __tests__/             # Suíte de Testes Automatizados (Vitest)
│   ├── components/                # Componentes Visuais Reativos (React + Tailwind)
│   ├── types/                     # Interfaces e Tipagens Fortes TypeScript
│   ├── utils/                     # Sintetizador Web Audio API para feedback tátil
│   ├── data/                      # Incidentes e Analistas Pré-configurados
│   └── App.tsx                    # Orquestrador Principal de Estado
├── package.json
└── vite.config.ts
```

---

## 👨‍💻 Autor

**Thiago Willian**  
- 💼 **LinkedIn**: [linkedin.com/in/thiago-willian-azevedo](https://www.linkedin.com/in/thiago-willian-azevedo)
- 🐙 **GitHub**: [@twazevedo](https://github.com/twazevedo)
- 📧 **E-mail**: thiagowillian1190695@gmail.com

---

<div align="center">
  <sub>Distribuído sob a Licença MIT. Desenvolvido para demonstrar excelência em Engenharia de Software e Algoritmos.</sub>
</div>
