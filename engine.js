// ============ SHARED ENGINE for Dimaag Tezz ============
// Used by all game pages. Provides: background fx, sound, save/load,
// level difficulty, task progress UI, and the level-complete/fail flow.

// ===== BACKGROUND STARFIELD =====
(function(){
  const c=document.getElementById('bgc');if(!c)return;const x=c.getContext('2d');let s=[];
  function r(){c.width=window.innerWidth;c.height=window.innerHeight;s=Array.from({length:120},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2,sp:.04+Math.random()*.1,a:.1+Math.random()*.5}));}
  function d(){x.clearRect(0,0,c.width,c.height);s.forEach(p=>{x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=`rgba(180,200,255,${p.a})`;x.fill();p.y+=p.sp;if(p.y>c.height){p.y=0;p.x=Math.random()*c.width;}});requestAnimationFrame(d);}
  r();window.addEventListener('resize',r);d();
})();

// ===== PARTICLES =====
let pts=[];
(function(){
  const pc=document.getElementById('fxc');if(!pc)return;const px=pc.getContext('2d');
  function r(){pc.width=window.innerWidth;pc.height=window.innerHeight;}
  function d(){px.clearRect(0,0,pc.width,pc.height);pts=pts.filter(p=>p.a>0);pts.forEach(p=>{px.beginPath();px.arc(p.x,p.y,p.r,0,Math.PI*2);px.fillStyle=p.c+Math.floor(p.a*255).toString(16).padStart(2,'0');px.fill();p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.a-=p.d;});requestAnimationFrame(d);}
  r();window.addEventListener('resize',r);d();
})();
function burst(x,y,c,n=18){for(let i=0;i<n;i++)pts.push({x,y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7-2,r:2+Math.random()*3,c,a:1,d:.04+Math.random()*.02});}

// ===== AUDIO =====
let AC;
function snd(t){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);
if(t==='ok'){o.frequency.setValueAtTime(523,AC.currentTime);o.frequency.setValueAtTime(784,AC.currentTime+.1);g.gain.setValueAtTime(.2,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.4);o.start();o.stop(AC.currentTime+.4);}
else if(t==='bad'){o.type='sawtooth';o.frequency.value=180;g.gain.setValueAtTime(.12,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.3);o.start();o.stop(AC.currentTime+.3);}
else if(t==='lvl'){[0,.1,.2].forEach((d,i)=>{const o2=AC.createOscillator(),g2=AC.createGain();o2.connect(g2);g2.connect(AC.destination);o2.frequency.value=[523,659,784][i];g2.gain.setValueAtTime(.2,AC.currentTime+d);g2.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d+.3);o2.start(AC.currentTime+d);o2.stop(AC.currentTime+d+.4);});}
else if(t==='fail'){o.type='sawtooth';o.frequency.setValueAtTime(300,AC.currentTime);o.frequency.setValueAtTime(150,AC.currentTime+.2);g.gain.setValueAtTime(.15,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.5);o.start();o.stop(AC.currentTime+.5);}
else if(t==='tick'){o.frequency.value=880;g.gain.setValueAtTime(.03,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.05);o.start();o.stop(AC.currentTime+.06);}
}catch(e){}}

function flash(t){const el=document.getElementById('fl');if(!el)return;el.className='flash';void el.offsetWidth;el.className='flash '+(t==='ok'?'ok':'bad');setTimeout(()=>el.className='flash',400);}
function spop(txt,color){const el=document.createElement('div');el.className='spop';el.textContent=txt;el.style.cssText=`color:${color};left:${window.innerWidth/2-40}px;top:${window.innerHeight/2}px;text-shadow:0 0 10px ${color}`;document.body.appendChild(el);setTimeout(()=>el.remove(),1000);}

// ===== GAMES REGISTRY (used on home page) =====
const GAMES=[
  {id:'pattern',name:'Pattern',nameHi:'पैटर्न पहचानो',icon:'🔢',color:'#00e5ff',page:'pattern.html'},
  {id:'math',name:'Math Quiz',nameHi:'गणित',icon:'➕',color:'#ff6b35',page:'math.html'},
  {id:'memory',name:'Memory',nameHi:'याददाश्त',icon:'🃏',color:'#ffd700',page:'memory.html'},
  {id:'word',name:'Word Puzzle',nameHi:'शब्द खेल',icon:'🔤',color:'#bf5fff',page:'word.html'},
  {id:'reaction',name:'Reaction',nameHi:'प्रतिक्रिया',icon:'⚡',color:'#00e676',page:'reaction.html'},
  {id:'color',name:'Color Match',nameHi:'रंग पहचानो',icon:'🎨',color:'#ff1744',page:'color.html'},
  {id:'simon',name:'Simon Says',nameHi:'रंग क्रम',icon:'🔴',color:'#ff9500',page:'simon.html'},
  {id:'riddles',name:'Riddles',nameHi:'पहेलियाँ',icon:'🧩',color:'#7b1fa2',page:'riddles.html'},
  {id:'shell',name:'Shell Game',nameHi:'गेंद ढूंढो',icon:'🎯',color:'#ffd700',page:'shell.html'},
  {id:'speed',name:'Speed Typing',nameHi:'तेज़ टाइपिंग',icon:'⌨️',color:'#00e5ff',page:'speed.html'},
  {id:'oddone',name:'Odd One Out',nameHi:'अलग ढूंढो',icon:'🔍',color:'#ff6b35',page:'oddone.html'},
  {id:'truefalse',name:'True or False',nameHi:'सही या गलत',icon:'✅',color:'#00e676',page:'truefalse.html'},
  {id:'flags',name:'Flag Quiz',nameHi:'झंडा पहचानो',icon:'🌍',color:'#00bcd4',page:'flags.html'},
  {id:'spelling',name:'Spelling Bee',nameHi:'शब्द जोड़ो',icon:'🔡',color:'#bf5fff',page:'spelling.html'},
  {id:'tappuzzle',name:'Tap Puzzle',nameHi:'क्रम से tap करो',icon:'👆',color:'#00e5ff',page:'tappuzzle.html'},
  {id:'countmem',name:'Count & Remember',nameHi:'देखो और याद करो',icon:'🔢',color:'#ffd700',page:'countmem.html'},
];

// ===== SAVE / LOAD (shared across all game pages via localStorage) =====
let GS={};
function saveGS(){try{localStorage.setItem('dtzGS2',JSON.stringify(GS));}catch(e){}}
function loadGS(){
  try{const d=localStorage.getItem('dtzGS2');if(d)GS=JSON.parse(d);}catch(e){}
  GAMES.forEach(g=>{if(!GS[g.id])GS[g.id]={unlocked:1,levels:{}};});
}
function getLvlData(gid,lv){return (GS[gid]&&GS[gid].levels[lv])||{stars:0,score:0,completed:false};}
function saveLvlData(gid,lv,data){
  if(!GS[gid])GS[gid]={unlocked:1,levels:{}};
  GS[gid].levels[lv]=data;
  if(data.completed&&GS[gid].unlocked<=lv&&lv<100)GS[gid].unlocked=lv+1;
  saveGS();
}

// ===== LEVEL DIFFICULTY =====
function getDiff(lv){
  if(lv<=20)return{name:'Easy',nameHi:'आसान',zone:1,timeScale:1,numRange:20,complexity:1};
  if(lv<=40)return{name:'Normal',nameHi:'सामान्य',zone:2,timeScale:.9,numRange:50,complexity:1.5};
  if(lv<=60)return{name:'Hard',nameHi:'कठिन',zone:3,timeScale:.8,numRange:100,complexity:2};
  if(lv<=80)return{name:'Expert',nameHi:'विशेषज्ञ',zone:4,timeScale:.7,numRange:200,complexity:2.5};
  return{name:'EXTREME',nameHi:'अत्यंत कठिन',zone:5,timeScale:.55,numRange:500,complexity:3.5};
}
function getZoneColor(zone){return['','#00e5ff','#ffd700','#ff6b35','#bf5fff','#ff1744'][zone];}

// ===== HELPERS =====
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function shuffle(a){return[...a].sort(()=>Math.random()-.5);}

// ===== URL PARAMS (level select pages read ?level=N to start a level) =====
function getQueryParam(name){const p=new URLSearchParams(window.location.search);return p.get(name);}

// ===== HOME PAGE BUILDER (called from index.html) =====
function buildHome(){
  let totalScore=0,totalLevels=0,totalStars=0;
  GAMES.forEach(g=>{Object.values(GS[g.id].levels).forEach(l=>{totalScore+=l.score||0;if(l.completed)totalLevels++;totalStars+=l.stars||0;});});
  const elTotal=document.getElementById('h-total');if(elTotal)elTotal.textContent=totalScore.toLocaleString();
  const elLevels=document.getElementById('h-levels');if(elLevels)elLevels.textContent=totalLevels;
  const elStars=document.getElementById('h-stars');if(elStars)elStars.textContent=totalStars;

  const gl=document.getElementById('games-list');if(!gl)return;
  gl.innerHTML='';
  GAMES.forEach(g=>{
    const unlocked=GS[g.id].unlocked;
    const completed=Object.values(GS[g.id].levels).filter(l=>l.completed).length;
    const stars=Object.values(GS[g.id].levels).reduce((a,l)=>a+(l.stars||0),0);
    const pct=Math.round((completed/100)*100);
    const diff=getDiff(unlocked);
    const a=document.createElement('a');
    a.className='gc';a.href=`levels.html?game=${g.id}`;
    a.style.setProperty('--gc',g.color);
    a.innerHTML=`<div class="gc-icon">${g.icon}</div><div class="gc-info"><div class="gc-name">${g.name}</div><div class="gc-name-hi">${g.nameHi}</div><div class="gc-bar"><div class="gc-bar-fill" style="width:${pct}%;background:${g.color}"></div></div></div><div class="gc-right"><div class="gc-level" style="color:${g.color}">Lv ${unlocked}</div><div class="gc-stars">${'⭐'.repeat(Math.min(3,Math.floor(stars/Math.max(1,completed))))}</div><div style="font-family:'Rajdhani',sans-serif;font-size:.6rem;color:${getZoneColor(diff.zone)}">${diff.nameHi}</div></div>`;
    gl.appendChild(a);
  });
}

// ===== LEVEL SELECT BUILDER (called from levels.html) =====
function buildLevelSelect(gid){
  const g=GAMES.find(x=>x.id===gid);if(!g)return;
  const titleEl=document.getElementById('ls-title');if(titleEl)titleEl.textContent=g.icon+' '+g.name;
  const totalStars=Object.values(GS[gid].levels).reduce((a,l)=>a+(l.stars||0),0);
  const scoreEl=document.getElementById('ls-score');if(scoreEl)scoreEl.textContent=totalStars+'⭐';

  const con=document.getElementById('levels-container');if(!con)return;
  con.innerHTML='';
  const zones=[{name:'🟢 Easy (1-20)',levels:[1,20]},{name:'🟡 Normal (21-40)',levels:[21,40]},{name:'🟠 Hard (41-60)',levels:[41,60]},{name:'🟣 Expert (61-80)',levels:[61,80]},{name:'🔴 EXTREME (81-100)',levels:[81,100]}];
  zones.forEach(z=>{
    const zh=document.createElement('div');zh.className='zone-header';zh.textContent=z.name;con.appendChild(zh);
    const grid=document.createElement('div');grid.className='levels-grid';
    for(let lv=z.levels[0];lv<=z.levels[1];lv++){
      const data=getLvlData(gid,lv);
      const unlocked=GS[gid].unlocked;
      const isUnlocked=lv<=unlocked;
      const isCurrent=lv===unlocked&&!data.completed;
      const btn=document.createElement('div');
      btn.className='lv-btn '+(data.completed?'completed':isCurrent?'current':isUnlocked?'unlocked':'locked');
      btn.innerHTML=`<div class="lv-num" style="color:${data.completed?'var(--c5)':isCurrent?'var(--c2)':'var(--text)'}">${lv}</div><div class="lv-stars">${data.stars?'⭐'.repeat(data.stars):''}</div>`;
      if(isUnlocked)btn.onclick=()=>{window.location.href=g.page+'?level='+lv;};
      grid.appendChild(btn);
    }
    con.appendChild(grid);
  });
}

// ===== GAME STATE (per-page, reset on each game load) =====
let CG={gid:'',level:1,task:0,score:0,combo:1,lives:3,tasks:[],taskResults:[],answered:false};

function initGameState(gid,level){
  CG={gid,level,task:0,score:0,combo:1,lives:3,tasks:[],taskResults:[],answered:false};
}

function buildTaskDots(){
  const d=document.getElementById('task-dots');if(!d)return;d.innerHTML='';
  for(let i=0;i<10;i++){const dot=document.createElement('div');dot.className='tdot'+(i===0?' cur':'');dot.id='td'+i;d.appendChild(dot);}
}
function updTaskDot(i,type){const d=document.getElementById('td'+i);if(d)d.className='tdot '+type;}
function updSubtitle(){const el=document.getElementById('gt-sub');if(el)el.textContent=`Level ${CG.level} · Task ${CG.task+1}/10`;}
function updLives(){const l=CG.lives;const el=document.getElementById('g-lives');if(el)el.textContent='❤️'.repeat(Math.max(0,l))+'🖤'.repeat(Math.max(0,3-l));}

// ===== TIMER =====
let tmrIv=null;
function startTmr(secs,onEnd){
  clearTmr();
  const fill=document.getElementById('tmr-fill');
  if(fill){fill.style.width='100%';fill.style.background='linear-gradient(90deg,var(--c2),var(--c1))';}
  let left=secs;
  tmrIv=setInterval(()=>{
    left--;
    if(fill){const pct=(left/secs)*100;fill.style.width=pct+'%';if(pct<35)fill.style.background='linear-gradient(90deg,var(--c6),#ff6b00)';}
    if(left<=3&&left>0)snd('tick');
    if(left<=0){clearTmr();onEnd();}
  },1000);
}
function clearTmr(){clearInterval(tmrIv);tmrIv=null;}

// ===== BUILD OPTIONS GRID =====
function buildOpts(opts,cb){
  const og=document.createElement('div');og.className='opts-2';
  opts.forEach(opt=>{const b=document.createElement('button');b.className='opt-b';b.textContent=opt;b.onclick=()=>cb(opt,b);og.appendChild(b);});
  return og;
}
function buildFbNext(nextFn){
  const wrap=document.createElement('div');
  const fb=document.createElement('div');fb.className='fb';fb.id='g-fb';wrap.appendChild(fb);
  const nb=document.createElement('button');nb.className='next-b';nb.id='g-nb';nb.textContent='NEXT TASK →';nb.onclick=nextFn;wrap.appendChild(nb);
  return wrap;
}
function ensureNextButton(nextFn,pts){
  let nb=document.getElementById('g-nb');
  const qa=document.getElementById('q-area');
  let fb=document.getElementById('g-fb');
  if(!fb){fb=document.createElement('div');fb.className='fb ok on';fb.id='g-fb';fb.innerHTML=pts?`✅ Sahi! +${pts}`:'✅ Sahi!';qa.appendChild(fb);}
  else{fb.className='fb ok on';fb.innerHTML=pts?`✅ Sahi! +${pts}`:'✅ Sahi!';}
  if(!nb){
    nb=document.createElement('button');
    nb.className='next-b on';nb.id='g-nb';
    nb.textContent='NEXT TASK →';nb.onclick=nextFn;
    qa.appendChild(nb);
  }else{nb.className='next-b on';nb.onclick=nextFn;}
}
function showNextButton(nextFn){
  let nb=document.getElementById('g-nb');
  if(!nb){
    const qa=document.getElementById('q-area');
    nb=document.createElement('button');nb.className='next-b on';nb.id='g-nb';nb.textContent='NEXT TASK →';nb.onclick=nextFn;qa.appendChild(nb);
  }else{nb.className='next-b on';nb.onclick=nextFn;}
}

// ===== ANSWER CHECK (generic, used by option-based games) =====
function checkAnswer(ok,btn,correctAns,msg,onDone){
  if(CG.answered)return;
  CG.answered=true;clearTmr();

  if(ok){
    if(btn)btn.className='opt-b C';
    CG.combo=Math.min(CG.combo+1,10);
    const baseScore=Math.ceil(100*(1+getDiff(CG.level).complexity*.3));
    const pts=baseScore*CG.combo;
    CG.score+=pts;
    const sEl=document.getElementById('g-score');if(sEl)sEl.textContent=CG.score;
    const gtEl=document.getElementById('gt-score');if(gtEl)gtEl.textContent=CG.score;
    const cEl=document.getElementById('g-combo');if(cEl)cEl.textContent='x'+CG.combo;
    updTaskDot(CG.task,'done');CG.taskResults[CG.task]=true;
    burst(window.innerWidth/2,window.innerHeight/2,'#00e676',16);
    flash('ok');snd('ok');spop('+'+pts,'#00e676');
    const fb=document.getElementById('g-fb');if(fb){fb.className='fb ok on';fb.innerHTML=msg?`✅ ${msg}!`:`✅ Sahi! +${pts} ${CG.combo>2?'(x'+CG.combo+' Combo!)':''}`;}
    if(btn){document.querySelectorAll('.opt-b').forEach(b=>b.disabled=true);}
    if(onDone)ensureNextButton(onDone,pts);
  }else{
    if(btn)btn.className='opt-b W';
    CG.combo=1;const cEl=document.getElementById('g-combo');if(cEl)cEl.textContent='x1';
    CG.lives=Math.max(0,CG.lives-1);updLives();
    updTaskDot(CG.task,'fail');CG.taskResults[CG.task]=false;
    if(correctAns!==null&&correctAns!==undefined){document.querySelectorAll('.opt-b,.color-ob').forEach(b=>{if(String(b.textContent)===String(correctAns))b.className=b.className.includes('color-ob')?b.className:'opt-b C';b.disabled=true;});}
    flash('bad');snd('bad');
    const fb=document.getElementById('g-fb');if(fb){fb.className='fb bad on';fb.innerHTML=msg?`❌ ${msg}`:`❌ Galat! Sahi: <strong>${correctAns}</strong>`;}
    if(CG.lives<=0){if(onDone)setTimeout(()=>levelFail(),1200);return;}
    if(onDone)showNextButton(onDone);
  }
}

function timeUp(correctAns,onDone){
  CG.answered=true;
  CG.combo=1;const cEl=document.getElementById('g-combo');if(cEl)cEl.textContent='x1';
  CG.lives=Math.max(0,CG.lives-1);updLives();
  updTaskDot(CG.task,'fail');CG.taskResults[CG.task]=false;
  flash('bad');snd('bad');
  const fb=document.getElementById('g-fb');if(fb){fb.className='fb bad on';fb.innerHTML=`⏰ Time Up! ${correctAns!==undefined&&correctAns!==null?'Sahi: <strong>'+correctAns+'</strong>':''}`;}
  document.querySelectorAll('.opt-b,.color-ob').forEach(b=>{if(correctAns!==undefined&&String(b.textContent)===String(correctAns))b.className=b.className.includes('color-ob')?b.className:'opt-b C';b.disabled=true;});
  if(CG.lives<=0){setTimeout(()=>levelFail(),1200);}
  else if(onDone)showNextButton(onDone);
}

// ===== LEVEL COMPLETE / FAIL =====
function levelComplete(){
  clearTmr();
  const correct=CG.taskResults.filter(Boolean).length;
  const stars=correct>=10?3:correct>=7?2:1;
  snd('lvl');burst(window.innerWidth/2,window.innerHeight/2,'#ffd700',40);

  const prev=getLvlData(CG.gid,CG.level);
  const newScore=Math.max(prev.score||0,CG.score);
  const newStars=Math.max(prev.stars||0,stars);
  saveLvlData(CG.gid,CG.level,{stars:newStars,score:newScore,completed:true});

  document.getElementById('ld-emoji').textContent=stars===3?'🏆':stars===2?'🎉':'👍';
  document.getElementById('ld-stars').textContent='⭐'.repeat(stars)+'☆'.repeat(3-stars);
  document.getElementById('ld-title').textContent=`Level ${CG.level} Complete!`;
  document.getElementById('ld-stats').innerHTML=`Score: <strong>${CG.score}</strong><br>Correct: <strong>${correct}/10</strong><br>Stars: <strong>${'⭐'.repeat(stars)}</strong>${CG.level<100?`<br>Next: Level ${CG.level+1}`:'<br>🏆 ALL LEVELS DONE!'}`;
  const nb=document.getElementById('ld-next-btn');
  if(CG.level>=100){nb.textContent='🏆 Completed!';nb.onclick=()=>{window.location.href='levels.html?game='+CG.gid;};}
  else{nb.textContent=`Level ${CG.level+1} →`;nb.onclick=()=>{window.location.href=window.location.pathname.split('/').pop()+'?level='+(CG.level+1);};}

  document.getElementById('s-lvl-done').classList.add('show');
}

function levelFail(){
  clearTmr();
  snd('fail');
  const correct=CG.taskResults.filter(Boolean).length;
  document.getElementById('lf-title').textContent=`Level ${CG.level} Failed!`;
  document.getElementById('lf-sub').textContent='3 lives khatam! Phir se koshish karo!';
  document.getElementById('lf-stats').innerHTML=`Completed: ${correct}/10 tasks<br>Score: ${CG.score}`;
  document.getElementById('s-lvl-fail').classList.add('show');
}

function retryLevel(){
  document.getElementById('s-lvl-fail').classList.remove('show');
  window.location.reload();
}

function goLevelsPage(){
  window.location.href='levels.html?game='+CG.gid;
}

function confirmQuit(){
  clearTmr();
  if(confirm('Level quit karna chahte ho?'))goLevelsPage();
}

// Init save data immediately when script loads
loadGS();
