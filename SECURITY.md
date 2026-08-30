# 🛡️ Política de Segurança • DeskFlow

A segurança, integridade de dados e estabilidade da aplicação são prioridades fundamentais no **DeskFlow**.

---

## 📦 Versões Suportadas

| Versão | Suportada | Notas de Segurança |
| :--- | :---: | :--- |
| `1.x.x` | :white_check_mark: | Versão ativa com correções de segurança contínuas |
| `< 1.0.0` | :x: | Descontinuada |

---

## 🔒 Diretrizes de Segurança da Aplicação

1. **Zero Vulnerabilidades de Dependências**: Código-fonte auditado periodicamente sem dependências obsoletas ou vulneráveis.
2. **Prevenção de XSS e Sanitização**: Todas as entradas de dados (títulos de chamados, descrições, pareceres técnicos, dados de solicitantes e tags) passam por validação de tamanho (`maxLength`), remoção de espaços espúrios (*trimming*) e escape nativo do React Virtual DOM contra injeção de HTML/scripts.
3. **Isolamento de Memória & Prevenção de Memory Leaks**:
   - As estruturas de dados `Queue<T>`, `Stack<T>` e `PriorityQueue<T>` garantem o desvínculo explícito de nós (`next = null; prev = null`) na desalocação para coleta eficiente pelo Garbage Collector.
   - O histórico de operações (*Command Pattern Undo/Redo*) possui limitação programática de profundidade (`maxHistorySize`) para evitar sobrecarga de memória heap no navegador.
4. **Resiliência de APIs Web**:
   - Tratamento defensivo de APIs do navegador (`navigator.clipboard` com fallback de cópia e Web Audio API com tratamento assíncrono de políticas de interação do usuário).

---

## 🚨 Reportando Vulnerabilidades (Divulgação Responsável)

Se você identificar qualquer vulnerabilidade de segurança, potencial vetor de ataque ou falha de integridade:

1. **Não abra issues públicas** para reportar falhas de segurança críticas.
2. Envie um e-mail com o assunto `[Security Disclosure] DeskFlow` para o mantenedor:
   - **E-mail:** [thiagowillian1190695@gmail.com](mailto:thiagowillian1190695@gmail.com)
   - **GitHub Security Advisory:** Utilize a aba [Security Advisories](https://github.com/twazevedo/deskflow-suporte-ti/security/advisories) se disponível.
3. **Inclua no relatório:**
   - Descrição detalhada da vulnerabilidade.
   - Passos reprodutíveis ou prova de conceito (PoC).
   - Impacto potencial estimado.

Agradecemos e valorizamos a contribuição da comunidade de segurança em prol de um software mais seguro e robusto.

