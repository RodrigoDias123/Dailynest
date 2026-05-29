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
