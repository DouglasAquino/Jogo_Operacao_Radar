'use strict';

/* =============================================================
   MÓDULO: BARALHO DE CONEXÕES
   ============================================================= */
(function(){

  const CATEGORIES = [
    {
      id: 'sinais', name: 'Sinais', icon: '🛎️', color: '#8b7cf6',
      subtitle: 'Interesses, gostos e curiosidades.',
      cards: [
        'Um filme que você recomendaria.',
        'Uma música que representa algo importante para você.',
        'Um personagem que você admira.',
        'Um jogo que considera criativo.',
        'Um canal ou criador que acompanha.',
        'Uma história que te marcou.',
        'Uma habilidade que gostaria de aprender.',
        'Algo que desperta sua curiosidade.',
        'Um hobby que gostaria de experimentar.',
        'Um assunto que gosta de conversar.'
      ]
    },
    {
      id: 'experiencias', name: 'Experiências', icon: '📸', color: '#2dd4bf',
      subtitle: 'Lugares, culturas e vivências.',
      cards: [
        'Um país que gostaria de visitar.',
        'Um lugar do Brasil que deseja conhecer.',
        'Um lugar onde moraria por um ano.',
        'Uma cultura que desperta sua curiosidade.',
        'Um lugar que recomendaria.',
        'Se pudesse viajar amanhã, para onde iria?',
        'Um ambiente natural que gostaria de explorar.',
        'Um lugar fictício que gostaria de visitar.',
        'Um local histórico que gostaria de conhecer.',
        'Uma cidade que combina com você.'
      ]
    },
    {
      id: 'sonhos', name: 'Sonhos', icon: '💭', color: '#fbbf24',
      subtitle: 'Projetos, metas e futuros possíveis.',
      cards: [
        'Uma profissão interessante.',
        'Algo que gostaria de aprender.',
        'Um projeto que gostaria de criar.',
        'Uma meta importante.',
        'Uma invenção que gostaria de desenvolver.',
        'Um talento que gostaria de possuir.',
        'Uma experiência que gostaria de viver.',
        'Uma causa que gostaria de apoiar.',
        'Um desafio que gostaria de superar.',
        'Algo que deseja realizar antes da vida adulta.'
      ]
    },
    {
      id: 'historias', name: 'Histórias', icon: '📖', color: '#fb7185',
      subtitle: 'Narrativas e experiências.',
      cards: [
        'Um momento engraçado.',
        'Uma situação surpreendente.',
        'Algo que te ensinou uma lição.',
        'Um dia inesquecível.',
        'Uma aventura que gostaria de viver.',
        'Uma história que gosta de contar.',
        'Uma lembrança da infância.',
        'Um desafio que já enfrentou.',
        'Algo que mudou sua forma de pensar.',
        'Uma história que mereceria virar filme.'
      ]
    },
    {
      id: 'conexoes', name: 'Conexões', icon: '🤝', color: '#38bdf8',
      subtitle: 'Descobertas sobre outras pessoas.',
      cards: [
        'Descubram algo em comum.',
        'Descubram um sonho parecido.',
        'Descubram um interesse parecido.',
        'Descubram uma experiência parecida.',
        'Descubram algo que gostariam de aprender.',
        'Descubram algo que ambos recomendariam.',
        'Descubram algo surpreendente.',
        'Descubram uma opinião compartilhada.',
        'Descubram uma curiosidade um sobre o outro.',
        'Descubram uma habilidade que ambos admiram.'
      ]
    },
    {
      id: 'perguntas', name: 'Perguntas', icon: '❓', color: '#a3e635',
      subtitle: 'A arte de perguntar.',
      cards: [
        'Criem uma pergunta interessante para outra dupla.',
        'Façam uma pergunta para a instrutora.',
        'Criem uma pergunta que não possa ser respondida com sim ou não.',
        'Criem uma pergunta sobre sonhos.',
        'Criem uma pergunta sobre viagens.',
        'Criem uma pergunta sobre interesses.',
        'Criem uma pergunta sobre criatividade.',
        'Criem uma pergunta sobre futuro.',
        'Criem uma pergunta que gere uma boa conversa.',
        'Criem a melhor pergunta da missão.'
      ]
    },
    {
      id: 'ideias', name: 'Ideias', icon: '💡', color: '#fb923c',
      subtitle: 'Imaginação e soluções.',
      cards: [
        'Uma ideia para melhorar a escola.',
        'Uma ideia para melhorar a cidade.',
        'Uma invenção simples que ajudaria pessoas.',
        'Uma atividade que deveria existir para adolescentes.',
        'Uma solução para um problema cotidiano.',
        'Uma campanha que você criaria.',
        'Uma ideia para aproximar pessoas.',
        'Uma ideia para cuidar do planeta.',
        'Uma ideia aparentemente maluca.',
        'Uma ideia que gostaria de testar.'
      ]
    },
    {
      id: 'perspectivas', name: 'Perspectivas', icon: '👁️', color: '#e879f9',
      subtitle: 'Significados e visões de mundo.',
      cards: [
        'O que significa sucesso?',
        'O que significa coragem?',
        'O que significa amizade?',
        'O que significa liberdade?',
        'O que significa criatividade?',
        'O que significa aprender?',
        'O que significa responsabilidade?',
        'O que significa respeito?',
        'O que significa felicidade?',
        'O que significa fazer diferença no mundo?'
      ]
    }
  ];

  const revealed = {};
  CATEGORIES.forEach(c => revealed[c.id] = new Set());

  let currentCat = CATEGORIES[0].id;

  const tabsEl = document.getElementById('tabs');
  const panelIcon = document.getElementById('panelIcon');
  const panelTitle = document.getElementById('panelTitle');
  const panelSub = document.getElementById('panelSub');
  const panelProgress = document.getElementById('panelProgress');
  const deckEl = document.getElementById('deck');
  const overviewNum = document.getElementById('overviewNum');
  const overviewBar = document.getElementById('overviewBar');
  const resetCatBtn = document.getElementById('resetCatBtn');
  const resetAllBtn = document.getElementById('resetAllBtn');

  function getCat(id){ return CATEGORIES.find(c => c.id === id); }

  function buildTabs(){
    tabsEl.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (cat.id === currentCat ? ' active' : '') + (revealed[cat.id].size === 10 ? ' done' : '');
      btn.style.setProperty('--cat-color', cat.color);
      btn.innerHTML = `<span class="ic">${cat.icon}</span><span class="name">${cat.name}</span><span class="count">${revealed[cat.id].size}/10</span>`;
      btn.addEventListener('click', () => { currentCat = cat.id; renderAll(); });
      tabsEl.appendChild(btn);
    });
  }

  function buildDeck(){
    const cat = getCat(currentCat);
    deckEl.innerHTML = '';
    cat.cards.forEach((text, i) => {
      const isRevealed = revealed[cat.id].has(i);
      const card = document.createElement('div');
      card.className = 'card' + (isRevealed ? ' flipped revealed' : '');
      card.style.setProperty('--cat-color', cat.color);
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front">
            <span class="front-ic">${cat.icon}</span>
            <span class="front-num">Carta ${i+1}</span>
          </div>
          <div class="card-face card-back">
            <span class="back-num">${i+1}/10</span>
            <span class="back-text">${text}</span>
          </div>
        </div>`;
      card.addEventListener('click', () => {
        revealed[cat.id].add(i);
        card.classList.add('flipped', 'revealed');
        renderTabsAndProgress();
      });
      deckEl.appendChild(card);
    });
  }

  function renderTabsAndProgress(){
    buildTabs();
    const cat = getCat(currentCat);
    const count = revealed[cat.id].size;
    panelProgress.textContent = `${count} / 10 reveladas`;
    panelProgress.style.color = cat.color;
    panelProgress.style.border = `1px solid ${cat.color}`;
    panelProgress.style.background = `color-mix(in srgb, ${cat.color} 10%, transparent)`;
    renderOverview();
  }

  function renderPanel(){
    const cat = getCat(currentCat);
    panelIcon.textContent = cat.icon;
    panelIcon.style.setProperty('--cat-color', cat.color);
    panelTitle.textContent = cat.name;
    panelSub.textContent = cat.subtitle;
    buildDeck();
    renderTabsAndProgress();
  }

  function renderOverview(){
    let total = 0;
    CATEGORIES.forEach(c => total += revealed[c.id].size);
    const max = CATEGORIES.length * 10;
    overviewNum.textContent = `${total}/${max}`;
    overviewBar.style.width = (total/max*100) + '%';
  }

  function renderAll(){
    buildTabs();
    renderPanel();
  }

  resetCatBtn.addEventListener('click', () => {
    const cat = getCat(currentCat);
    if(revealed[cat.id].size === 0) return;
    if(confirm(`Virar de volta todas as cartas de "${cat.name}"?`)){
      revealed[cat.id] = new Set();
      renderAll();
    }
  });

  resetAllBtn.addEventListener('click', () => {
    if(confirm('Reiniciar o baralho inteiro, todas as categorias?')){
      CATEGORIES.forEach(c => revealed[c.id] = new Set());
      renderAll();
    }
  });

  renderAll();
})();

/* =============================================================
   MÓDULO: TRILHA DA MISSÃO (OPERAÇÃO R.A.D.A.R.)
   ============================================================= */
const Trilha = (function(){

  const TOTEMS = [
    {
      color: 'purple',
      name: 'Missão Interação',
      steps: [
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'📸', title:'Experiências',       desc:'Categorias de Descobertas.' },
        { icon:'💭', title:'Sonhos',             desc:'Categorias de Descobertas.' },
        { icon:'📖', title:'Histórias',          desc:'Categorias de Descobertas.' },
        { icon:'🗼', title:'Torre de Controle',  desc:'⚠️ Façam uma pergunta para a instrutora.' },
        { icon:'🤝', title:'Conexões',           desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🗼', title:'Torre de Controle',  desc:'⚠️ Façam uma pergunta para a instrutora.' },
        { icon:'❓', title:'Perguntas',          desc:'Categorias de Descobertas.' },
        { icon:'💡', title:'Ideias',             desc:'Categorias de Descobertas.' },
        { icon:'🗼', title:'Torre de Controle',  desc:'⚠️ Façam uma pergunta para a instrutora.' },
        { icon:'👁️', title:'Perspectivas',      desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
      ]
    },
    {
      color: 'teal',
      name: 'Missão Conteúdo',
      steps: [
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'📸', title:'Experiências',       desc:'Categorias de Descobertas.' },
        { icon:'💭', title:'Sonhos',             desc:'Categorias de Descobertas.' },
        { icon:'📖', title:'Histórias',          desc:'Categorias de Descobertas.' },
        { icon:'🗼', title:'Torre de Controle',  desc:'⚠️ Façam uma pergunta para a instrutora.' },
        { icon:'🤝', title:'Conexões',           desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🗼', title:'Torre de Controle',  desc:'⚠️ Façam uma pergunta para a instrutora.' },
        { icon:'❓', title:'Perguntas',          desc:'Categorias de Descobertas.' },
        { icon:'💡', title:'Ideias',             desc:'Categorias de Descobertas.' },
        { icon:'🗼', title:'Torre de Controle',  desc:'⚠️ Façam uma pergunta para a instrutora.' },
        { icon:'👁️', title:'Perspectivas',      desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
        { icon:'🎙️', title:'Microfone Cruzado', desc:'⚠️ Façam uma pergunta para outra dupla.' },
        { icon:'🛎️', title:'Sinais',            desc:'Categorias de Descobertas.' },
      ]
    }
  ];

  const state = TOTEMS.map(t => ({
    completed: new Array(t.steps.length).fill(false),
    currentStep: -1
  }));

  let activeModal = null;
  let nodePoints = [];
  let dragCtx = null;

  function getTrilhaCss(varName){
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  function buildTotem(totemIndex){
    const totem = TOTEMS[totemIndex];
    const track = document.getElementById('track-'+totemIndex);
    const n = totem.steps.length;

    track.querySelectorAll('.node, .piece').forEach(el => el.remove());

    const rect = track.getBoundingClientRect();
    const trackH = rect.height || 140;
    const centerY = trackH / 2;
    const amp = Math.min(trackH * 0.34, 60);
    const marginX = 12;
    const usableWidth = 100 - marginX*2;

    const points = [];

    for(let i=0;i<n;i++){
      const t = n === 1 ? 0.5 : i/(n-1);
      const leftPct = marginX + t*usableWidth;
      const wave = Math.sin(i*1.05) * amp;
      const topPx = centerY + wave;

      points.push({leftPct, topPx});

      const btn = document.createElement('button');
      btn.className = 'node';
      btn.style.left = leftPct+'%';
      btn.style.top = topPx+'px';
      btn.dataset.step = i;

      const stone = document.createElement('div');
      stone.className = 'stone';
      stone.textContent = (i+1);
      btn.appendChild(stone);

      btn.addEventListener('click', () => onNodeClick(totemIndex, i));
      track.appendChild(btn);
    }

    nodePoints[totemIndex] = points;

    drawPath(totemIndex, points, track);
    buildPiece(totemIndex, track, rect);
    refreshNodeStates(totemIndex);
  }

  function drawPath(totemIndex, points, track){
    const svg = track.querySelector('svg');
    const path = document.getElementById('path-'+totemIndex);
    const rect = track.getBoundingClientRect();
    const w = rect.width || 1000;
    const h = rect.height || 190;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    let d = '';
    points.forEach((p,i) => {
      const x = (p.leftPct/100)*w;
      const y = p.topPx;
      d += (i===0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    });
    path.setAttribute('d', d);
    const color = TOTEMS[totemIndex].color === 'purple' ? getTrilhaCss('--purple') : getTrilhaCss('--teal');
    path.setAttribute('stroke', color);
  }

  function buildPiece(totemIndex, track, rect){
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.id = 'piece-'+totemIndex;
    piece.textContent = '👩‍🚀';
    track.appendChild(piece);
    positionPieceAtStart(totemIndex, rect);

    piece.addEventListener('pointerdown', (e) => startDrag(e, totemIndex));
  }

  function positionPieceAtStart(totemIndex, rect){
    const piece = document.getElementById('piece-'+totemIndex);
    const step = state[totemIndex].currentStep;
    if(step === -1){
      piece.style.left = '2%';
      piece.style.top = ((rect.height||140)/2) + 'px';
    } else {
      const p = nodePoints[totemIndex][step];
      piece.style.left = p.leftPct + '%';
      piece.style.top = p.topPx + 'px';
    }
  }

  function startDrag(e, totemIndex){
    const piece = document.getElementById('piece-'+totemIndex);
    const track = document.getElementById('track-'+totemIndex);
    piece.setPointerCapture(e.pointerId);
    piece.classList.add('dragging');
    dragCtx = { totemIndex, piece, track };
    piece.style.left = '';
    piece.style.top = '';
    movePieceToClient(e.clientX, e.clientY);

    piece.addEventListener('pointermove', onDragMove);
    piece.addEventListener('pointerup', onDragEnd);
    piece.addEventListener('pointercancel', onDragEnd);
  }

  function onDragMove(e){
    if(!dragCtx) return;
    movePieceToClient(e.clientX, e.clientY);
    highlightClosestNode(e.clientX, e.clientY);
  }

  function movePieceToClient(clientX, clientY){
    const { track, piece } = dragCtx;
    const rect = track.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
  }

  function findClosestNode(track, clientX, clientY){
    let closest = null, closestDist = Infinity;
    track.querySelectorAll('.node').forEach(btn => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dist = Math.hypot(clientX - cx, clientY - cy);
      if(dist < closestDist){ closestDist = dist; closest = btn; }
    });
    return { closest, closestDist };
  }

  function highlightClosestNode(clientX, clientY){
    const { track } = dragCtx;
    const { closest, closestDist } = findClosestNode(track, clientX, clientY);
    track.querySelectorAll('.node').forEach(btn => btn.classList.remove('drop-hover'));
    if(closest && closestDist < 70){
      closest.classList.add('drop-hover');
    }
  }

  function onDragEnd(e){
    if(!dragCtx) return;
    const { totemIndex, piece, track } = dragCtx;
    piece.classList.remove('dragging');
    piece.removeEventListener('pointermove', onDragMove);
    piece.removeEventListener('pointerup', onDragEnd);
    piece.removeEventListener('pointercancel', onDragEnd);

    const { closest, closestDist } = findClosestNode(track, e.clientX, e.clientY);
    track.querySelectorAll('.node').forEach(btn => btn.classList.remove('drop-hover'));

    dragCtx = null;

    if(closest && closestDist < 70){
      const stepIndex = parseInt(closest.dataset.step, 10);
      landOnStep(totemIndex, stepIndex);
    } else {
      const rect = track.getBoundingClientRect();
      positionPieceAtStart(totemIndex, rect);
    }
  }

  function landOnStep(totemIndex, stepIndex){
    state[totemIndex].currentStep = stepIndex;
    const track = document.getElementById('track-'+totemIndex);
    const rect = track.getBoundingClientRect();
    positionPieceAtStart(totemIndex, rect);
    openModal(totemIndex, stepIndex, state[totemIndex].completed[stepIndex]);
  }

  function refreshNodeStates(totemIndex){
    const comp = state[totemIndex].completed;
    const track = document.getElementById('track-'+totemIndex);

    track.querySelectorAll('.node').forEach(btn => {
      const i = parseInt(btn.dataset.step,10);
      const stone = btn.querySelector('.stone');
      btn.classList.toggle('done', comp[i]);
      stone.textContent = comp[i] ? '✓' : (i+1);
    });

    const doneCount = comp.filter(Boolean).length;
    document.getElementById('progress-'+totemIndex).textContent = `${doneCount} / ${comp.length} reveladas`;

    const endBadge = document.getElementById('end-badge-'+totemIndex);
    if(doneCount === comp.length){
      if(!endBadge.classList.contains('done')){
        endBadge.classList.add('done');
        showWinMessage(TOTEMS[totemIndex].name);
      }
    } else {
      endBadge.classList.remove('done');
    }
  }

  function showWinMessage(name){
    const el = document.getElementById('winMsg');
    el.textContent = `🎉 ${name} concluída com sucesso!`;
    el.classList.add('show');
    setTimeout(()=> el.classList.remove('show'), 2600);
  }

  function onNodeClick(totemIndex, stepIndex){
    landOnStep(totemIndex, stepIndex);
  }

  function openModal(totemIndex, stepIndex, alreadyDone){
    activeModal = {totemIndex, stepIndex};
    const totem = TOTEMS[totemIndex];
    const step = totem.steps[stepIndex];

    document.getElementById('modalTag').textContent = `Casa ${stepIndex+1} de ${totem.steps.length} · ${totem.name}`;
    document.getElementById('modalIcon').textContent = step.icon;
    document.getElementById('modalTitle').textContent = step.title;
    document.getElementById('modalDesc').textContent = step.desc;

    const iconWrap = document.getElementById('modalIconWrap');
    iconWrap.className = 'icon-circle ' + (totem.color === 'purple' ? 'totem-purple-icon' : 'totem-teal-icon');

    const confirmBtn = document.getElementById('modalConfirm');
    confirmBtn.className = 'confirm ' + (totem.color === 'purple' ? 'btn-purple' : 'btn-teal');
    confirmBtn.textContent = alreadyDone ? 'Concluído ✓' : 'Marcar como feito';
    confirmBtn.disabled = false;

    document.getElementById('overlay').classList.add('open');
  }

  function closeModal(){
    document.getElementById('overlay').classList.remove('open');
    activeModal = null;
  }

  function confirmActiveStep(){
    if(!activeModal) return;
    const {totemIndex, stepIndex} = activeModal;
    state[totemIndex].completed[stepIndex] = true;
    refreshNodeStates(totemIndex);
    closeModal();
  }

  function buildAll(){
    TOTEMS.forEach((_, i) => buildTotem(i));
  }

  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('overlay').addEventListener('click', (e) => {
    if(e.target.id === 'overlay') closeModal();
  });
  document.getElementById('modalConfirm').addEventListener('click', confirmActiveStep);

  window.addEventListener('resize', () => {
    if(document.getElementById('trilhaScreen').classList.contains('active')){
      buildAll();
    }
  });

  return { buildAll };
})();

/* =============================================================
   MÓDULO: NAVEGAÇÃO ENTRE TELAS
   ============================================================= */
(function(){

  function showView(id){
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
  }

  function goHome(){ showView('homeScreen'); }

  function openTrilha(){
    showView('trilhaScreen');
    // (re)constrói a trilha agora que o contêiner está visível e com tamanho real
    Trilha.buildAll();
  }

  function openBaralho(){ showView('baralhoScreen'); }

  document.getElementById('openBaralho').addEventListener('click', openBaralho);
  document.getElementById('openTrilha').addEventListener('click', openTrilha);
  document.getElementById('toTrilhaBtn').addEventListener('click', openTrilha);
  document.getElementById('toBaralhoBtn').addEventListener('click', openBaralho);

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      const trilhaAtiva = document.getElementById('trilhaScreen').classList.contains('active');
      const baralhoAtivo = document.getElementById('baralhoScreen').classList.contains('active');
      if(trilhaAtiva || baralhoAtivo) goHome();
    }
  });
})();
