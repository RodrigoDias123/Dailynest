# IAusage — DailyNest

Registo de uso de IA no desenvolvimento do projecto DailyNest.

---

## Task #01 — Frontend UI: Layout & All Pages

**Data:** 29 de maio de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)  
**Sessão:** Agente autónomo

### O que foi gerado com IA

| Ficheiro | Descrição |
|---|---|
| `frontend/style.css` | Design system completo: CSS variables, reset, sidebar, layout, botões, stat cards, tabela de tasks, modal, auth pages, landing page, notepad, agenda, responsividade |
| `frontend/app.js` | Interactividade: modal open/close, sidebar toggle (mobile), workspace toggle, password visibility, task CRUD, filtro/pesquisa de tasks, stats automáticos, notepad word count / save / clear |
| `frontend/index.html` | Landing page split-screen (esquerda: hero + about, direita: foto real Unsplash de laptop/secretária com stats card glassmorphism + painel escuro com slider de 5 dots) |
| `frontend/login.html` | Página de login com topbar azul, card centrado, campos com ícones, toggle de password, remember me |
| `frontend/register.html` | Página de registo com 4 campos, checkbox privacy policy, validação de passwords |
| `frontend/tasks.html` | Página principal: sidebar, stat cards (4), tabela com search + filtros + paginação, modal Create New Task |
| `frontend/notepad.html` | Editor de notas com título, body, stats (words/chars/read time), save/clear com localStorage |
| `frontend/agenda.html` | Agenda semanal (20–26 maio 2026) com grelha de horas, 4 eventos coloridos, mini calendário, lista upcoming |


### Critérios cumpridos (Task #01)

- [x] Sidebar com logo DailyNest (ícone casinha + texto)
- [x] Workspace toggle: Work / Personal (pills)
- [x] 4 nav links com ícones: Tasks (activo), Agenda, Notepad, Files
- [x] Avatar utilizador em baixo: "RD" circular preto + nome + email
- [x] 4 stat cards com ícones coloridos (azul, cinza, laranja, verde)
- [x] Search bar + dropdowns na tabela
- [x] Tabela com headers uppercase: TASK NAME, STATUS, DUE DATE, CREATED
- [x] Task rows com ponto de status colorido + ícone calendário + timestamp
- [x] Paginação `< 1 >` em baixo
- [x] Modal "Create New Task" funcional (abrir/fechar, Escape, click fora)
- [x] Modal com campos: Task Name, Status, Priority, Due Date, Description
- [x] Design fiel: fundo #f5f5f5, sidebar branca, botões pretos
- [x] Font Inter carregada (Google Fonts)
- [x] Responsivo (mobile: sidebar colapsa com toggle)

---

## Fix #01 — Landing Page: correcção visual para corresponder ao Figma

**Data:** 29 de maio de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)

### O que foi corrigido

| Ficheiro | Alteração |
|---|---|
| `frontend/index.html` | Stats restruturados de pills individuais para um card glassmorphism único com 3 colunas (12k+ / 98% / 4.9★) e separadores; slider actualizado para 5 dots; secção "About us" com título correcto e 6 parágrafos do Figma; painel inferior com texto correcto |
| `frontend/style.css` | `.landing-right` convertido de `position:relative` para `flex-column`; adicionado `.landing-photo` com foto real (Unsplash) + `background-size:cover`; adicionados `.stats-card`, `.stats-item`, `.stats-number`, `.stats-label`, `.stats-sep`; `.landing-panel` actualizado para `background:#111` sólido sem blur |

---

## Fix #02 — Landing Page: responsividade sem scroll

**Data:** 29 de maio de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)

### O que foi alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/style.css` | `.landing-page` e `.landing-left` passaram a `height: 100vh; overflow: hidden` — página bloqueada ao viewport sem scroll externo; `.landing-content` com `scrollbar-width: none` e `::-webkit-scrollbar { display: none }` para scroll interno invisível; espaçamentos reduzidos: `landing-content` padding `56px→32px`, `landing-h1` `3.5rem→3rem`, `landing-desc` margin `32px→20px`, `landing-actions` margin `40px→20px`, `landing-divider` margin `28px→16px`, `about-section p` padding `14px→9px`, `landing-eyebrow` margin `18px→12px`; breakpoint 768px actualizado para repor `height: auto` e `overflow: visible` em mobile |

---

## Task #02 — Tasks Page: Edit Modal + POST/PUT API Wiring

**Data:** 29 de maio de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)

### O que foi criado / alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/app.js` | Adicionadas funções `apiPost`, `apiPut`, `apiDelete` com `fetch` para `http://localhost:8000`; `buildRow()` actualizado para incluir `data-id`, `data-name`, `data-due`, `data-desc` no `<tr>` e coluna de acções com botões Edit/Delete (SVG icons); adicionado estado `_editingRow` e variável `_taskIdCounter`; nova função `openNewTaskModal()` limpa estado e abre modal em modo criação; nova função `openEditModal(btn)` pré-preenche o formulário com dados da linha e abre modal em modo edição; nova função `deleteTask(btn)` com confirmação + chamada `DELETE /tasks/{id}` + remoção local; `submitCreateTask()` refactorizado para suportar os dois modos: em edição faz `PUT /tasks/{id}` e actualiza a linha localmente; em criação faz `POST /tasks` com fallback local se a API não estiver disponível |
| `frontend/tasks.html` | Adicionado `<th>Actions</th>` na tabela; linha de exemplo actualizada com `data-id`, `data-name`, `data-due`, `data-desc` e célula de acções com botões Edit/Delete; botão "New Task" alterado para `openNewTaskModal()`; botão de submissão do modal com `id="taskSubmitBtn"` para o JS alterar o texto dinamicamente (Create Task / Save Changes) |
| `frontend/style.css` | Adicionados estilos `td.task-actions`, `.task-actions`, `.action-btn`, `.action-btn.edit-btn:hover` (azul), `.action-btn.delete-btn:hover` (vermelho) |
