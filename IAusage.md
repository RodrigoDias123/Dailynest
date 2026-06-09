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

---

## Task #03 — Task Filters & Search

**Data:** 1 de junho de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)  
**Sessão:** Agente autónomo

### O que foi alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/tasks.html` | Select `#statusFilter` actualizado para três opções: **All / Pending / Done**; evento do search input alterado de `oninput="filterTasks()"` para `oninput="onSearchInput(this.value)"`; evento do status select alterado para `onchange="onStatusFilterChange(this.value)"` |
| `frontend/js/modules/tasks.js` | Adicionadas variáveis de estado `filterSearch` e `filterStatus` que guardam o valor actual de cada controlo; adicionadas funções handler `onSearchInput(value)` e `onStatusFilterChange(value)` que actualizam o estado e chamam `filterTasks()`; `filterTasks()` refactorizado para ler os valores dos JS state variables em vez do DOM, e para mapear `pending` → `not-started \| in-progress` e `done` → `completed` |

### Critérios cumpridos (Task #03)

- [x] Filtro de status com opções: All / Pending / Done
- [x] "Pending" filtra tarefas `not-started` e `in-progress`; "Done" filtra `completed`
- [x] Campo de pesquisa filtra por título em tempo real (via `oninput`)
- [x] Estado mantido em variáveis JS (`filterSearch`, `filterStatus`)
- [x] Lógica client-side pura — sem chamadas ao servidor

---

## Task #04 — Task Mark Complete & Delete

**Data:** 1 de junho de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)  
**Sessão:** Agente autónomo

### O que foi alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/js/api.js` | Adicionada função `apiPatch(path, body)` que faz `PATCH` com JSON body, para suportar o endpoint `PATCH /tasks/{id}` |
| `frontend/js/modules/tasks.js` | `buildRow()` actualizado: adicionada coluna de checkbox (`<td class="task-check-cell">`) como primeira célula de cada linha, com `checked` se o status for `completed` e atributo `onchange="markComplete(this)"`; nome da tarefa com `text-decoration:line-through` quando concluída; adicionada função `markComplete(cb)` que lê o estado do checkbox, calcula o novo status (`completed` ou `not-started`), chama `apiPatch('/tasks/{id}', {status})` (com fallback local), actualiza `data-status`, o badge de status e o estilo do nome da tarefa na linha, e chama `updateStatCards()` |
| `frontend/tasks.html` | Adicionado `<th></th>` vazio como primeiro cabeçalho da tabela (coluna do checkbox); linha de exemplo estática actualizada com `<td class="task-check-cell"><input type="checkbox" ...></td>` como primeira célula |
| `frontend/css/modules/tasks.css` | Adicionados estilos `td.task-check-cell` (largura 40px, centrado) e `.task-check` (16×16px, cursor pointer, `accent-color: #111`) |

### Critérios cumpridos (Task #04)

- [x] Checkbox na primeira coluna de cada linha da tabela
- [x] Checkbox pré-marcado se a tarefa já tiver status `completed`
- [x] Click no checkbox chama `PATCH /tasks/{id}` com `{status: "completed" | "not-started"}`
- [x] Fallback local se o backend não estiver disponível
- [x] Badge de status actualizado instantaneamente (sem reload)
- [x] Nome da tarefa com strikethrough + cor muted quando concluída
- [x] Botão Delete com `confirm()` nativo e chamada `DELETE /tasks/{id}` (já existia, mantido)
- [x] `updateStatCards()` chamado após ambas as acções para reflectir os contadores

---

## Task #05 — Agenda Calendar: Month View

**Data:** 1 de junho de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)  
**Sessão:** Agente autónomo

### O que foi alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/js/modules/agenda.js` | Ficheiro criado de raiz; array `EVENTS` com 8 eventos de exemplo para junho 2026; função `buildMonthGrid()` que gera dinamicamente a grelha do mês actual (offset Monday-based, células de outros meses, marcação do dia de hoje, dots coloridos por evento); função `selectDay(dateStr, date)` que selecciona um dia, re-renderiza a grelha com highlight e popula o painel lateral com os eventos do dia; funções `prevMonth()` / `nextMonth()` para navegação entre meses (com reset da selecção); `resetDayPanel()` para limpar o painel; `setView(btn)` redefinida para gerir a troca entre Week View e Month View (mostra/esconde `#week-view`, `#month-view`, `#mini-cal-card`, `#upcoming-panel`, `#day-events-panel`) |
| `frontend/agenda.html` | Week header + week grid envolvidos em `<div id="week-view">`; adicionado `<div id="month-view">` com nav interna (prev/next + título `#month-nav-title`), row de nomes dos dias e `<div id="month-grid-body">`; adicionado `<div id="day-events-panel">` no sidebar com `.day-events-title` e `.day-events-list`; IDs `mini-cal-card` e `upcoming-panel` adicionados aos painéis existentes do sidebar; bloco `<script>` inline com `setView` removido (função movida para `agenda.js`) |
| `frontend/css/modules/agenda.css` | Adicionadas classes: `.month-nav`, `.month-nav-title`, `.month-weekdays`, `.month-grid-body`, `.month-day-cell`, `.month-day-cell.other-month`, `.month-day-cell.is-today`, `.month-day-cell.is-selected`, `.month-day-num`, `.month-day-dots`, `.event-dot` (`.blue`, `.yellow`, `.green`, `.purple`), `.day-events-title`, `.no-events-msg`, `.day-event-item` |

### Critérios cumpridos (Task #05)

- [x] Grelha de calendário mensal gerada dinamicamente em vanilla JS a partir do mês actual
- [x] Offset Monday-based correcto (primeiros dias do mês alinhados ao dia da semana certo)
- [x] Dias de outros meses renderizados com cor muted
- [x] Dia de hoje marcado com círculo preto
- [x] Dots coloridos em dias com eventos (máx. 3 dots por dia)
- [x] Click num dia destaca-o (`.is-selected`) e popula o painel lateral com os eventos desse dia
- [x] Painel lateral mostra título do dia seleccionado + lista de eventos com dot colorido e hora
- [x] Mensagem "No events for this day." quando o dia não tem eventos
- [x] Navegação prev/next mês com reset da selecção e reconstrução da grelha
- [x] Botão "Month" no view-toggle activa a Month View; "Week"/"Day" retorna à Week View
- [x] Week View e Month View mutuamente exclusivos (show/hide via JS)
- [x] Mini calendário e painel Upcoming ocultados na Month View

---

## Task #06 — Agenda: Day & Week Views + Navigation

**Data:** 1 de junho de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)  
**Sessão:** Agente autónomo

### O que foi alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/js/modules/agenda.js` | Adicionadas variáveis de estado `weekViewDate` e `dayViewDate`; `setView()` refactorizado para gerir três vistas (day/week/month) com show/hide correcto dos painéis; adicionada `buildWeekView()` que gera dinamicamente o header da semana (Mon–Sun com hoje marcado) e a grelha de horas (7h–17h) com eventos filtrados por data e hora a partir do array `EVENTS`; adicionada `buildDayView()` que renderiza a lista de eventos do dia seleccionado ordenados por hora, com mensagem "No events" quando vazio; adicionada `updateDateRangeLabel()` que actualiza o texto do toolbar consoante a vista activa (range semanal, data única ou mês); adicionadas `prevPeriod()` e `nextPeriod()` que despacham navegação para a função correcta consoante `currentView` (-7/+7 dias na week view, -1/+1 dia na day view, prevMonth/nextMonth na month view); `prevMonth()` e `nextMonth()` actualizados para chamar `updateDateRangeLabel()`; bloco `init()` adicionado no fim do ficheiro que calcula a segunda-feira da semana actual, inicializa `weekViewDate` e `dayViewDate`, e chama `buildWeekView()` + `updateDateRangeLabel()` para renderizar o estado inicial |
| `frontend/agenda.html` | Botões de navegação do toolbar alterados de estáticos para `onclick="prevPeriod()"` / `onclick="nextPeriod()"`; texto estático da data range substituído por `<span id="agenda-date-range-text"></span>` (populado dinamicamente pelo JS); conteúdo estático do week header (7 colunas de dias fixos) removido e substituído por `<div class="week-header" id="week-header"></div>`; conteúdo estático do week grid (11 linhas horárias hardcoded) removido e substituído por `<div class="week-grid" id="week-grid"></div>`; adicionado `<div id="day-view">` com `#day-view-title` e `#day-view-list` como contentor da Day View |
| `frontend/css/modules/agenda.css` | Adicionadas classes: `.day-view-header`, `.day-view-title`, `.day-view-list`, `.day-view-event`, `.day-view-event-time`, `.day-view-event-body`, `.day-view-event-title` |

### Critérios cumpridos (Task #06)

- [x] Botão "Day" no view-toggle activa a Day View; "Week" activa a Week View; "Month" activa a Month View
- [x] Day View mostra lista de eventos do dia seleccionado, ordenados por hora, com badge colorido
- [x] Day View mostra mensagem "No events for this day." quando não há eventos
- [x] Week View renderizada dinamicamente (7 colunas Mon–Sun) a partir do `weekViewDate`
- [x] Week View marca o dia de hoje com círculo da brand color no header
- [x] Week View coloca eventos na célula da hora certa (parse do `time` do evento)
- [x] Setas `‹` / `›` do toolbar chamam `prevPeriod()` / `nextPeriod()`
- [x] Na Week View, as setas deslocam o período em ±7 dias e re-renderizam
- [x] Na Day View, as setas deslocam o período em ±1 dia e re-renderizam
- [x] Na Month View, as setas delegam em `prevMonth()` / `nextMonth()` (comportamento anterior mantido)
- [x] Label da data range no toolbar actualizada dinamicamente para cada vista e período
- [x] Inicialização automática no carregamento da página (semana actual com Monday-offset)

---

## Task #07 — Agenda Event Form: Create & Edit

**Data:** 2 de junho de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)  
**Sessão:** Agente autónomo

### O que foi criado / alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/js/api.js` | Adicionada função `apiGet(path)` que faz `GET` e retorna JSON, usada para carregar eventos do backend |
| `frontend/agenda.html` | Modal do evento substituído: campos `eventName`/`eventDate`/`eventTime`/`eventColor` removidos; novos campos `eventTitle` (text), `eventDescription` (textarea), `eventStartDate` (datetime-local), `eventEndDate` (datetime-local) e hidden `editingEventId`; `onsubmit` do form aponta para `submitEventForm(event)`; botão de submissão com `id="eventSubmitBtn"` (texto dinâmico: *Create Event* / *Save Changes*); botão "New Event" alterado para `openEventModal('create')`; painel `#upcoming-panel` simplificado para conter apenas `<div id="upcoming-list">` (populado dinamicamente pelo JS) |
| `frontend/js/modules/agenda.js` | Array `EVENTS` convertido de `const` estático para `var` dinâmico (inicialmente vazio); adicionados helpers `evtColor(id)`, `evtDate(isoStr)`, `evtTime(isoStr)` para converter eventos do formato API; adicionada variável de estado `_editingEventId`; adicionada `loadEvents()` que chama `GET /events` e em caso de falha usa dados de exemplo com `start_date`/`end_date` no formato ISO; adicionada `rebuildViews()` que despacha para a view activa; adicionadas `openEventModal(mode, eventId)` e `closeEventModal()` que gerem o estado create/edit do modal (título, botão de submissão, pré-preenchimento dos campos); adicionada `submitEventForm(e)` que faz `POST /events` (create) ou `PUT /events/{id}` (edit) com fallback local em ambos os casos; adicionada `renderUpcomingPanel()` que filtra eventos futuros, ordena por `start_date` crescente, e renderiza os primeiros 5 no `#upcoming-list`; `buildMonthGrid()`, `selectDay()`, `buildWeekView()` e `buildDayView()` actualizados para usar `evtDate(e.start_date)`, `evtTime(e.start_date)` e `evtColor(e.id)` em vez dos campos `date`, `time`, `color` do modelo antigo; eventos na Week View e Day View recebem `onclick="openEventModal('edit', id)"` para edição directa; eventos no painel lateral da Month View recebem um botão de edição `event-edit-btn`; `init()` actualizado para chamar `loadEvents()` no arranque |
| `frontend/css/modules/agenda.css` | Adicionadas classes: `.form-textarea` (resize vertical, min-height 72px, font-family inherit); `.event-edit-btn` (botão de edição inline nos event items do painel lateral, com hover na brand color) |

### Critérios cumpridos (Task #07)

- [x] Modal com campos: Title (text), Description (textarea), Start (datetime-local), End (datetime-local)
- [x] Botão "New Event" abre modal em modo criação (título "New Event", botão "Create Event")
- [x] Click num evento na Week View / Day View / painel lateral abre modal em modo edição pré-preenchido
- [x] Modo edição mostra título "Edit Event" e botão "Save Changes"
- [x] `submitEventForm()` faz `POST /events` no modo criação; `PUT /events/{id}` no modo edição
- [x] Fallback local se o backend não estiver disponível (cria/actualiza `EVENTS` em memória)
- [x] `renderUpcomingPanel()` filtra eventos com `start_date >= now`, ordena por `start_date` ascendente, mostra os primeiros 5 no painel "Upcoming"
- [x] Painel "Upcoming" renderizado dinamicamente (substituiu HTML estático)
- [x] `loadEvents()` chamado no arranque: tenta `GET /events`; em falha usa dados de exemplo no novo formato
- [x] Todas as vistas (Week, Day, Month) actualizadas para usar o novo modelo de dados com `start_date`/`end_date`

---

## Fix #03 — Agenda: api.js em falta + criação de evento + Day View

**Data:** 2 de junho de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)

### O que foi corrigido

| Ficheiro | Alteração |
|---|---|
| `frontend/agenda.html` | Adicionado `<script src="js/api.js"></script>` antes dos outros scripts — estava em falta, tornando `apiPost`/`apiGet` indefinidos e impedindo qualquer operação de eventos |
| `frontend/js/modules/agenda.js` | `submitEventForm()` reescrito com lógica **síncrona-primeiro**: o evento é adicionado/editado em `EVENTS` imediatamente, o modal fecha e as vistas reconstroem-se antes de qualquer chamada à API; a chamada à API corre em background (fire-and-forget) sem bloquear a UI |
| `frontend/js/modules/agenda.js` | `setView()` corrigido: o ramo `else` tratava "day" e "week" de forma idêntica, mostrando sempre `#week-view` e nunca chamando `buildDayView()`; substituído por três ramos explícitos (`month` / `day` / `week`) cada um com o seu show/hide correcto e chamada à função de build correspondente |

### Bugs corrigidos

- [x] Criação de evento não funcionava — `api.js` não estava carregado em `agenda.html`
- [x] Fallback local também não corria — o erro era síncrono, antes do `.catch()`
- [x] `submitEventForm()` agora aplica a mudança localmente de forma imediata (sem depender de callbacks assíncronos)
- [x] Day View mostrava o mesmo conteúdo que a Week View — `setView()` nunca activava `#day-view` nem chamava `buildDayView()`

---

## Task #08 — Notepad: Note List & Editor

**Data:** 2 de junho de 2026  
**Modelo:** GitHub Copilot (Claude Sonnet 4.6)  
**Sessão:** Agente autónomo

### O que foi criado / alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/notepad.html` | Página reestruturada com layout de dois painéis: painel esquerdo (lista de notas com título + preview truncado) e painel direito (editor com toolbar); removidos o bloco de estatísticas (words/chars/read time) e os botões Save/Clear anteriores; adicionado bloco `.notepad-layout` com `aside.notes-list-panel` (header com contador de notas + lista `#notesList`) e `section.notes-editor-panel` (estado vazio `#editorEmptyState` + conteúdo `#editorContent` com toolbar e editor); toolbar do editor contém: indicador de status (`#saveStatus`), contador de palavras (`#wordCount`), botão Delete e botão Save; adicionado `<script src="js/api.js"></script>` antes dos outros scripts |
| `frontend/js/modules/notepad.js` | Ficheiro reescrito de raiz; variáveis de estado globais: `NOTES` (array), `_selectedNoteId`, `_localIdCounter`, `_isDirty`; `loadNotes()` tenta `GET /notes` e em caso de falha carrega do `localStorage` (com 2 notas de exemplo se estiver vazio); `renderNoteList()` renderiza os items da lista esquerda com título e preview truncado (80 chars), destacando a nota activa; `selectNote(id)` popula o editor e mostra o painel direito; `newNote()` cria nota em branco localmente (com `POST /notes` em background), adiciona-a ao topo da lista e abre-a no editor; `saveNote()` actualiza `NOTES` e `localStorage` imediatamente, depois faz `PUT /notes/{id}` em background; `deleteNote()` com `confirm()` nativo — captura o `id` antes de o nulificar, remove da lista, actualiza `localStorage` e chama `DELETE /notes/{id}` em background; `onEditorInput()` marca `_isDirty = true` e actualiza o contador de palavras em tempo real; `setSaveStatus()` actualiza o indicador com ícone ✓ (saved), "Saving…" ou dot laranja (unsaved); `persistLocal()` e `loadFromLocal()` gerem a persistência em `localStorage` como fallback |
| `frontend/css/modules/notepad.css` | Ficheiro reescrito: adicionadas classes `.notepad-main` (flex column, min-height calc), `.notepad-layout` (flex row, min-height 560px, border + radius + shadow), `.notes-list-panel` (width 280px, border-right, background surface-alt), `.notes-list-header`, `.notes-list-count`, `.notes-list-items` (overflow-y auto), `.note-list-item` (hover + active state com border-left brand), `.note-item-title`, `.note-item-preview`, `.notes-empty-msg`, `.notes-editor-panel` (flex: 1), `.editor-empty-state` (centered SVG + text), `.editor-content` (flex column), `.editor-toolbar` (space-between), `.editor-status`, `.editor-actions`, `.editor-wordcount`, `.btn-sm`, `.unsaved-dot`; estilos do editor interno mantidos e adaptados para flex |

### Critérios cumpridos (Task #08)

- [x] Layout de dois painéis: lista de notas à esquerda, editor à direita
- [x] Lista mostra título + preview truncado de cada nota
- [x] Nota activa destacada com border-left preta + fundo branco
- [x] Estado vazio (SVG + mensagem) quando nenhuma nota está seleccionada
- [x] Botão "New Note" no page header cria nota em branco, abre-a no editor e foca o título
- [x] `POST /notes` chamado na criação (com fallback local)
- [x] `PUT /notes/{id}` chamado ao guardar (com fallback local)
- [x] `DELETE /notes/{id}` chamado ao eliminar (com confirm + fallback local)
- [x] Contador de palavras actualizado em tempo real (`oninput`)
- [x] Indicador de estado: "Unsaved changes" (dot laranja) → "Saving…" → ✓ Saved
- [x] Persistência em `localStorage` como fallback quando backend indisponível
- [x] Responsivo: em mobile os dois painéis empilham verticalmente

---

## Task #09 — Responsividade Mobile

**Data:** 8 de junho de 2026
**Modelo:** Claude Sonnet 4.6
**Sessão:** Agente autónomo

### O que foi criado / alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/css/reset.css` | Adicionado `overflow-x: hidden` em `html` e `body` para impedir scroll horizontal a nível da página |
| `frontend/css/layout.css` | Adicionado `overflow-x: hidden` em `.app-layout` e `min-width: 0` em `.main-content` (evita que filho flex expanda o contentor); substituído `.sidebar-toggle` flutuante por `.mobile-topbar` (barra fixa no topo, 54 px de altura, com logo + botão hambúrguer integrado); adicionado `.sidebar-backdrop` (overlay escuro semi-transparente atrás do sidebar aberto); `padding-top` do `.main-content` em mobile ajustado para `calc(54px + 20px)` para compensar a topbar; modal redesenhado como bottom sheet em mobile (`align-items: flex-end`, `border-radius` só nos cantos superiores, `max-height: 90vh` com scroll interno); reduzido `padding` do `.auth-topbar` em mobile; adicionadas regras para landing page em 480 px (foto menor, stats card mais compacto) |
| `frontend/js/router.js` | `toggleSidebar()` refactorizado para gerir o `.sidebar-backdrop`: cria o elemento via JS no arranque, mostra-o ao abrir o sidebar e esconde-o ao fechar; handler de click fora do sidebar actualizado para também esconder o backdrop |
| `frontend/css/modules/tasks.css` | Em `≤640 px`: tabela convertida em cards com CSS Grid (`grid-template-columns: auto minmax(0,1fr) auto`, 3 linhas); checkbox e acções atravessam as 3 linhas; nome da task com `overflow-wrap: break-word`; status badge na linha 2; data de entrega visível na linha 3; coluna "Created" ocultada; botões de acção com 36×36 px para conforto táctil; barra de pesquisa ocupa 100% na primeira linha; footer empilha verticalmente |
| `frontend/css/modules/agenda.css` | Em `≤768 px`: `.agenda-layout` usa `minmax(0,1fr)` em vez de `1fr` para impedir expansão do grid além do viewport; `.calendar-wrap` com `overflow-x: auto` e `min-width: 0` (scroll horizontal contido dentro do card); week header e week grid com `min-width: 560 px`; células do mês menores; mini-calendário em linha quando há espaço |
| `frontend/css/modules/notepad.css` | Em `≤700 px`: layout muda para single-panel; por defeito só o painel de lista é visível; ao seleccionar uma nota, a classe `.mobile-editor-open` no `.notepad-layout` oculta a lista e mostra apenas o editor; adicionado `.mobile-back-btn` (oculto em desktop, visível em mobile) |
| `frontend/notepad.html` | Adicionado botão "← Notes" (classe `mobile-back-btn`) na toolbar do editor, antes do indicador de estado; substitui o `<button class="sidebar-toggle">` standalone pelo novo `<header class="mobile-topbar">` com logo integrado |
| `frontend/js/modules/notepad.js` | Adicionadas `mobileBackToList()` (remove `.mobile-editor-open` do layout) e `_mobileOpenEditor()` (adiciona a classe quando `window.innerWidth ≤ 700`); `selectNote()` e `newNote()` chamam `_mobileOpenEditor()` ao abrir o editor; `deleteNote()` chama `mobileBackToList()` após eliminar |
| `frontend/tasks.html` | `<button class="sidebar-toggle">` substituído por `<header class="mobile-topbar">` com botão hambúrguer + logo |
| `frontend/agenda.html` | Idem |

### Critérios cumpridos (Task #09)

- [x] Sidebar abre sobre um backdrop escuro em mobile; fechar no backdrop ou fora do painel funciona
- [x] Topbar móvel fixa (54 px) com hambúrguer e logo em todas as páginas de app
- [x] Tabela de tasks converte-se em cards legíveis em ecrãs ≤ 640 px (nome + status + data)
- [x] Calendário semanal faz scroll horizontal dentro do seu card sem causar scroll na página
- [x] Notepad alterna entre painel de lista e painel de editor em mobile (botão "← Notes")
- [x] Modal aparece como bottom sheet em mobile (desliza do fundo do ecrã)
- [x] Nenhum elemento causa scroll horizontal na página (`overflow-x: hidden` em html/body/app-layout)

---

## Fix #04 — Stat Cards: bug de cascata CSS

**Data:** 8 de junho de 2026
**Modelo:** Claude Sonnet 4.6

### O que foi corrigido

| Ficheiro | Alteração |
|---|---|
| `frontend/css/components.css` | Adicionadas media queries responsive dos stat cards **dentro** do `components.css`, logo após a definição base: `≤1024 px → repeat(2,1fr)` e `≤480 px → 1fr`; padding e tamanho do ícone reduzidos em `≤480 px` para melhor leitura; em mobile os cards ocupam 1 coluna (largura total) |
| `frontend/css/layout.css` | Removidas as regras `stat-cards` do `layout.css` (estavam a ser sobrescritas pelo `components.css` que carrega depois) |

### Bug corrigido

O `components.css` é carregado depois do `layout.css` no HTML. Por isso a regra base `.stat-cards { grid-template-columns: repeat(4,1fr) }` no `components.css` sobrescrevia as media queries do `layout.css` em qualquer largura de ecrã, mesmo em 430 px. A solução foi mover as media queries para o `components.css`, depois da definição base, garantindo que têm prioridade na cascata.

- [x] Stat cards mostram 2 colunas em tablet (≤1024 px) e 1 coluna em mobile (≤480 px)
- [x] Cards não ficam cortados em ecrãs iPhone (430 px)

---

## Task #10 — Files Page: Layout, New Panel & Upload Modal

**Data:** 8 de junho de 2026  
**Modelo:** Claude Sonnet 4.6  
**Sessão:** Agente autónomo

### O que foi criado / alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/files.html` | Página criada de raiz: sidebar padrão com Files marcado como activo + badge de contagem; main content com header ("Files" + subtítulo + botão "+ New"); body dividido em dois painéis — `files-content` (toolbar + breadcrumb + tabela + grid view) e `files-new-panel` (campo de nome + 4 type cards + botão Create); modal "Upload File" com dropzone drag-and-drop, campos File Name / Category / Description e botões Cancel / Upload File; menu floating de acções por ficheiro (Rename / Download / Delete) |
| `frontend/css/modules/files.css` | Ficheiro criado de raiz (~280 linhas): estilos para `.files-body` (flex row), `.files-content` (card com border + shadow), `.files-toolbar` (search + view toggle), `.files-breadcrumb`, `.files-table` (list view com hover), `.file-icon` com variantes de cor por tipo (`fi-folder` laranja, `fi-doc` azul, `fi-sheet` verde, `fi-pdf` vermelho, `fi-code` verde escuro, `fi-image` roxo), `.files-grid` (grid view auto-fill), `.files-new-panel` (painel direito fixo), `.type-card` (seleccionável com borda dupla quando activo), `.upload-dropzone` (dashed border + drag-over state), `.file-actions-menu` (menu floating), `.nav-badge` (badge circular no nav link); breakpoints em 1024 px, 860 px e 600 px |
| `frontend/js/modules/files.js` | Ficheiro criado de raiz: array `_files` com 8 entradas de exemplo marcadas com `example: true`; `renderFiles()` despacha para `renderListView()` e `renderGridView()`; `setView()` alterna entre list e grid com toggle de botões activos; `filterFiles()` filtra em tempo real por nome; `selectType()` e `onNewNameInput()` gerem o estado do painel New (botão Create desactivado até nome + tipo preenchidos); `createItem()` chama `clearExamples()` na primeira criação e adiciona o novo item ao topo; `uploadFile()` idem, detecta o tipo pelo extension do nome; `openActionsMenu()` posiciona o menu floating junto ao botão "..."; `renameFile()` e `deleteFile()` guardam o `id` antes de chamar `hideActionsMenu()` (evita race com `_activeMenuFileId = null`); dropzone com handlers `onDragOver`, `onDragLeave`, `onDrop`; `updateNavBadge()` actualiza o badge com o total de ficheiros |
| `frontend/tasks.html` | Link de Files no nav actualizado de `href="#"` para `href="files.html"` |
| `frontend/agenda.html` | Idem |
| `frontend/notepad.html` | Idem |

### Critérios cumpridos (Task #10)

- [x] Sidebar com Files activo e badge com contagem de ficheiros
- [x] List view com colunas Name / Modified / Size e botão "..." por linha
- [x] Grid view com cards de ficheiro (icon + nome + meta)
- [x] Toggle list/grid funcional com botão activo destacado
- [x] Search em tempo real por nome de ficheiro
- [x] Breadcrumb "All Files › My Files" (clicável para reset)
- [x] Ícones coloridos por tipo de ficheiro (folder, doc, spreadsheet, pdf, code, image)
- [x] Painel "New" sempre visível: campo de nome + 4 type cards seleccionáveis + botão Create
- [x] Botão Create desactivado até nome e tipo estarem preenchidos
- [x] Modal "Upload File" com dropzone (click + drag-and-drop), campos e botão Upload
- [x] Upload detecta o tipo do ficheiro pela extensão
- [x] Menu "..." com Rename (prompt nativo), Download (stub) e Delete (confirm nativo)
- [x] Responsivo: painel New passa para baixo em ≤860 px; colunas Modified/Size ocultadas em ≤600 px
- [x] Nav links de Files corrigidos em todas as páginas

---

## Fix #05 — Files: delete e rename não funcionavam

**Data:** 8 de junho de 2026  
**Modelo:** Claude Sonnet 4.6

### O que foi corrigido

| Ficheiro | Alteração |
|---|---|
| `frontend/js/modules/files.js` | `deleteFile()` e `renameFile()` agora guardam `_activeMenuFileId` numa variável local `id` **antes** de chamar `hideActionsMenu()`, que zerava a variável global; sem esta correcção, `_files.find(...)` recebia `null` e retornava imediatamente sem executar a acção |

### Bug corrigido

- [x] Delete e Rename no menu "..." passaram a funcionar correctamente após preservar o `id` antes de fechar o menu

---

## Fix #06 — Files: limpar exemplos ao criar o primeiro item real

**Data:** 8 de junho de 2026  
**Modelo:** Claude Sonnet 4.6

### O que foi alterado

| Ficheiro | Alteração |
|---|---|
| `frontend/js/modules/files.js` | Todos os ficheiros de exemplo passaram a ter `example: true` no array `_files`; adicionada função `clearExamples()` que filtra `_files` removendo todas as entradas com `example: true`; `createItem()` e `uploadFile()` chamam `clearExamples()` antes de inserir o novo item, garantindo que os exemplos desaparecem no primeiro uso real |

### Comportamento corrigido

- [x] Os ficheiros de exemplo são removidos automaticamente quando o utilizador cria ou faz upload do primeiro ficheiro real

