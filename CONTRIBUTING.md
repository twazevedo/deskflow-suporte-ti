# Guia de Contribuição • DeskFlow

Obrigado pelo interesse em contribuir com o **DeskFlow**! Este projeto demonstra a aplicação de **Estruturas de Dados Puras (Filas e Pilhas)** em sistemas corporativos.

---

## 🛠️ Como Começar

1. Faça um **Fork** do repositório.
2. Crie uma branch para sua funcionalidade ou correção:
   ```bash
   git checkout -b feature/minha-melhoria
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute os testes unitários para garantir que tudo está funcionando:
   ```bash
   npm test
   ```

---

## 🧪 Regras de Ouro para Estruturas de Dados

- **Complexidade $O(1)$**: Qualquer alteração em `Queue<T>` ou `Stack<T>` deve manter estritamente a complexidade de tempo $O(1)$ para as operações fundamentais (`enqueue`, `dequeue`, `push`, `pop`).
- **Zero Dependências em Estruturas**: As classes na pasta `src/structures/` devem permanecer em TypeScript puro, manipulando nós e ponteiros diretamente.
- **Testes Obrigatórios**: Todo novo método ou caso de borda deve vir acompanhado de testes unitários no Vitest em `src/structures/__tests__/`.

---

## 📝 Padrão de Commits

Utilizamos o padrão **Conventional Commits**:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `test:` Adição ou ajuste de testes
- `docs:` Alterações na documentação
- `refactor:` Refatoração sem alteração de comportamento

---

## 🚀 Enviando seu Pull Request

1. Garanta que o build compila sem erros (`npm run build`).
2. Garanta que todos os testes passem (`npm test`).
3. Abra um **Pull Request** detalhando as alterações propostas.
