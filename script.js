/* ==========================================================
   script.js — comportamento do site
   Índice (nesta ordem): utilitários · trilha de aprendizagem ·
   dados dos cursos · busca e filtros · relógio ao vivo ·
   menu mobile · tema claro/noturno
   Obs.: a linha que aplica o tema antes de a página carregar
   fica no <head> do index.html, de propósito.
   ========================================================== */

/* ===== Utilitários ===== */
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const fd=dias=>new Date(Date.now()+dias*864e5).toLocaleDateString('pt-BR');

/* ===== Trilha: [título, resumo, prioridade da base (%), o que aprender, por que nesta ordem] ===== */
const S=[
['Lógica de Programação e Algoritmos','O ponto zero: variáveis, condicionais e laços.',100,'Variáveis, tipos de dados, operadores, if/else, laços (for/while), funções e fluxogramas. Pratique com problemas pequenos, no papel e em pseudocódigo.','Toda linguagem repete essas ideias. Quem domina a lógica aprende qualquer linguagem depois com muito menos esforço.'],
['Git, GitHub e Versionamento','Ferramentas essenciais desde o primeiro dia.',92,'Repositório, commit, branch, merge, pull request e README. Publique cada exercício no seu GitHub.','Seu GitHub vira vitrine desde cedo, e o hábito de versionar evita perder código e prepara você para o trabalho em equipe.'],
['Desenvolvimento Web Front-End','HTML5, CSS3 e JavaScript.',84,'HTML semântico, CSS responsivo (flexbox e grid) e JavaScript (DOM, eventos e fetch).','É o resultado mais visual e rápido: você enxerga o que programou e aplica a lógica da etapa 1 em projetos reais.'],
['Linguagens Back-End e POO','Java ou C# e orientação a objetos.',76,'Classes, objetos, herança, polimorfismo, encapsulamento, coleções e tratamento de erros em Java ou C#.','Com lógica e versionamento na mão, a POO deixa de ser abstrata. Ela organiza sistemas maiores e aparece na maioria das vagas de ADS.'],
['Banco de Dados Relacional','Modelagem e SQL / SQL Server.',68,'Modelo entidade-relacionamento, tabelas, chaves, normalização, SELECT, JOIN, INSERT/UPDATE/DELETE e consultas agregadas.','Quase todo sistema guarda dados. Modelar faz mais sentido depois que você já programa e sabe o que precisa guardar.'],
['Engenharia de Software e Portfólio','Projetos práticos, APIs e preparação para vagas.',60,'Requisitos, UML básico, metodologias ágeis, testes, APIs REST, deploy e três projetos completos no GitHub, além de LinkedIn e currículo.','Esta etapa junta tudo. É aqui que você prova, com projetos reais, que está pronto para o mercado.']
];
$('#steps').innerHTML=S.map((s,i)=>`<article class="card step"><span class="num">PASSO 0${i+1}</span><h3>${s[0]}</h3><p>${s[1]}</p><div class="bar"><i data-w="${s[2]}"></i></div><span class="lv">Prioridade da base: ${s[2]}%</span><button class="btn tg" aria-expanded="false">O que aprender e por quê <i>⌄</i></button><div class="more"><b>O que aprender aqui</b>${s[3]}<b>Por que estudar nesta ordem</b>${s[4]}</div></article>`).join('');
$('#steps').onclick=e=>{const b=e.target.closest('.tg');if(!b)return;b.setAttribute('aria-expanded',b.closest('.step').classList.toggle('open'))};
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.style.width=x.target.dataset.w+'%';io.unobserve(x.target)}}));
$$('.bar i').forEach(i=>io.observe(i));

/* ===== Cursos: d(título, plataforma, categoria, carga, gratuito, nível, glifo do banner, link, disponivel, statusTurma, dias até nova turma) ===== */
const d=(t,p,c,h,g,n,e,u,disponivel,statusTurma,proxima=0)=>({t,p,c,h,g,n,e,u,disponivel,statusTurma,proxima});
const C=[
d('Algoritmo: Lógica de Programação','Curso em Vídeo','Lógica · Algoritmos','~20h',1,'Iniciante','{ }','https://www.cursoemvideo.com/',1,'Fluxo contínuo'),
d('HTML5 e CSS3','Curso em Vídeo','Front-End · HTML · CSS','~40h',1,'Iniciante','HTML','https://www.cursoemvideo.com/',1,'Fluxo contínuo'),
d('Git e GitHub','Curso em Vídeo','Versionamento · Git','~5h',1,'Iniciante','Git','https://www.cursoemvideo.com/',1,'Fluxo contínuo'),
d('Cursos de Tecnologia e Programação','Fundação Bradesco (Escola Virtual)','Programação · TI','8 a 40h',1,'Iniciante','EV','https://www.ev.org.br/',1,'Inscrições abertas'),
d('Bootcamps e Trilhas de Programação','DIO','Java · C# · SQL · Git','20 a 60h',1,'Iniciante','DIO','https://www.dio.me/',1,'120 vagas'),
d('Formação em Lógica de Programação','Alura','Lógica · JavaScript','~40h',0,'Iniciante','{ }','https://www.alura.com.br/',1,'Matrícula aberta'),
d('Oracle Next Education (ONE)','Alura + Oracle','Back-End · Java · Front-End','~6 meses',1,'Iniciante','ONE','https://www.oracle.com/br/education/oracle-next-education/',0,'Turma encerrada',21),
d('CS50: Introdução à Ciência da Computação','Harvard (edX)','Lógica · C · Python · SQL','~100h',1,'Intermediário','CS50','https://cs50.harvard.edu/x/',1,'Fluxo contínuo'),
d('Web Design Responsivo','freeCodeCamp','Front-End · HTML · CSS','~300h',1,'Iniciante','CSS','https://www.freecodecamp.org/portuguese/',1,'Fluxo contínuo'),
d('Java e Orientação a Objetos','Udemy','Back-End · Java · POO','~40h',0,'Intermediário','Java','https://www.udemy.com/topic/java/',1,'Matrícula aberta'),
d('SQL e Modelagem de Dados','Udemy','Banco de Dados · SQL','~25h',0,'Intermediário','SQL','https://www.udemy.com/topic/sql/',1,'Matrícula aberta'),
d('Python para Todos (Python for Everybody)','Coursera','Python · Lógica','~60h',0,'Iniciante','Py','https://www.coursera.org/specializations/python',1,'Início imediato'),
d('Trilhas de Programação Full Stack','Rocketseat','Front-End · Node · React','~100h',0,'Intermediário','RS','https://www.rocketseat.com.br/',0,'Turma encerrada',18),
d('Cursos Gratuitos de Tecnologia','Santander Open Academy','Tecnologia · Carreira','30 a 60h',1,'Iniciante','SOA','https://www.santanderopenacademy.com/pt_br/index.html',0,'Turma encerrada',9),
d('Redes e Cibersegurança','Cisco Networking Academy','Redes · Segurança','15 a 70h',1,'Intermediário','NET','https://www.netacad.com/',1,'Inscrições abertas')
];
$('#nc').textContent='+'+C.length;

/* Banner ilustrativo em SVG (gradiente roxo/índigo gerado por índice) */
const bn=(i,e)=>{const a=235+i*13%60;return `<svg viewBox="0 0 320 110" aria-hidden="true"><defs><linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a},70%,36%)"/><stop offset="1" stop-color="hsl(${a+35},70%,15%)"/></linearGradient></defs><rect width="320" height="110" fill="url(#g${i})"/><circle cx="270" cy="22" r="64" fill="#fff" opacity=".07"/><text x="22" y="68" font-size="38" font-weight="800" fill="#fff" font-family="monospace">${e}</text></svg>`};

/* ===== Busca e filtros em tempo real ===== */
let f='todos';
function render(){
  const q=norm($('#q').value),todos=$('#all').checked;
  const r=C.filter(c=>(todos||c.disponivel)&&norm([c.t,c.p,c.c].join(' ')).includes(q)&&(f=='todos'||(f=='g'&&c.g)||(f=='p'&&!c.g)||(f=='i'&&c.n=='Iniciante')||(f=='m'&&c.n=='Intermediário')));
  $('#cnt').textContent=`${r.length} curso(s) encontrado(s) · verificado às ${new Date().toLocaleTimeString('pt-BR')}`;
  $('#list').innerHTML=r.length?r.map(c=>`<article class="card">${bn(C.indexOf(c),c.e)}<div class="cb"><span class="tag">${c.c}</span><h3>${c.t}</h3><div class="meta"><span>🏫 ${c.p}</span><span>⏱ ${c.h}</span></div><div class="meta"><span class="b ${c.g?'g':'pg'}">${c.g?'GRATUITO':'PAGO (Investimento)'}</span><span class="b nv">${c.n}</span></div>${c.disponivel?`<span class="ok"><i></i>Disponível Agora · ${c.statusTurma}</span>`:`<span class="no">● ${c.statusTurma} · nova turma prevista para ${fd(c.proxima)}</span>`}<a class="btn p" href="${c.u}" target="_blank" rel="noopener noreferrer">Acessar curso ↗</a></div></article>`).join(''):`<p class="mut vz">Nenhum curso encontrado. Tente outro termo ou marque “Mostrar também turmas fechadas”.</p>`;
}
$('#q').oninput=render;$('#all').onchange=render;
$('#fl').onclick=e=>{const b=e.target.closest('.f');if(!b)return;f=b.dataset.f;$$('#fl .f').forEach(x=>x.setAttribute('aria-pressed',x==b));render()};

/* Relógio ao vivo + verificação simulada de turmas */
const tick=()=>$('#now').textContent=new Date().toLocaleString('pt-BR');
tick();setInterval(tick,1000);
$('#chk').onclick=()=>{const b=$('#chk');b.textContent='Verificando…';setTimeout(()=>{b.textContent='↻ Verificar agora';render()},700)};
render();

/* Menu mobile: fecha ao tocar fora, no Esc, ao escolher um link e ao girar a tela */
const nv=$('#nv'),mb=$('#mb');
const menu=o=>{nv.classList.toggle('on',o);mb.setAttribute('aria-expanded',o);mb.textContent=o?'✕':'☰'};
mb.onclick=()=>menu(!nv.classList.contains('on'));
nv.onclick=()=>menu(false);
document.addEventListener('click',e=>{if(!e.target.closest('.nav'))menu(false)});
addEventListener('keydown',e=>{if(e.key=='Escape')menu(false)});
addEventListener('resize',()=>{if(innerWidth>640)menu(false)});
$('#q').onkeydown=e=>{if(e.key=='Enter')e.target.blur()};

/* Tema: padrão noturno; a escolha fica salva no aparelho */
const th=$('#th'),mt=document.createElement('meta');mt.name='theme-color';document.head.appendChild(mt);
function setTheme(t){document.documentElement.dataset.theme=t;th.textContent=t=='dark'?'☀️':'🌙';th.setAttribute('aria-label',t=='dark'?'Ativar modo claro':'Ativar modo noturno');mt.content=t=='dark'?'#0B0B14':'#F6F6FB'}
setTheme(document.documentElement.dataset.theme=='light'?'light':'dark');
th.onclick=()=>{const t=document.documentElement.dataset.theme=='dark'?'light':'dark';setTheme(t);try{localStorage.setItem('adspath-tema',t)}catch(e){}};
