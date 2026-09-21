/* Tushar's portfolio — tiny vanilla JS:
   typing effect, starfield, scroll reveal, live GitHub data. */

(function () {
  'use strict';

  /* ---------- typing effect ---------- */
  var roles = [
    'AI Engineer',
    'LLM agents in production',
    'RAG & eval-first systems',
    'Shipping something new every day'
  ];
  var typedEl = document.getElementById('typed');
  var ri = 0, ci = 0, deleting = false;

  function tick() {
    var word = roles[ri];
    typedEl.textContent = word.slice(0, ci);
    var speed = deleting ? 35 : 70;
    if (!deleting && ci === word.length) { speed = 1600; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; speed = 350; }
    else { ci += deleting ? -1 : 1; }
    setTimeout(tick, speed);
  }
  tick();

  /* ---------- starfield ---------- */
  var canvas = document.getElementById('stars');
  var ctx = canvas.getContext('2d');
  var stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  for (var i = 0; i < 130; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      p: Math.random() * Math.PI * 2,
      s: 0.5 + Math.random() * 1.5
    });
  }

  /* ---------- moon, clouds, sea shimmer, sailing ship ---------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* on touch phones skip the 60fps canvas loop entirely — one static frame,
     so scrolling stays smooth and the battery lasts */
  var staticCanvas = window.matchMedia('(hover: none)').matches || window.innerWidth < 640;
  var clouds = [];
  for (var ci = 0; ci < 5; ci++) {
    clouds.push({
      x: Math.random(), y: 0.06 + Math.random() * 0.32,
      s: 70 + Math.random() * 110, v: 0.000008 + Math.random() * 0.000012,
      a: 0.04 + Math.random() * 0.05
    });
  }
  var waves = [];
  for (var wi = 0; wi < 16; wi++) {
    waves.push({ x: Math.random(), dy: Math.random() * 44 - 12, len: 24 + Math.random() * 60, v: 0.00002 + Math.random() * 0.00003 });
  }

  function drawMoon(t) {
    var mx = canvas.width * 0.84, my = canvas.height * 0.16, mr = 42;
    var pulse = reduced ? 0 : Math.sin(t / 2400) * 6;
    var g = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 3.2 + pulse);
    g.addColorStop(0, 'rgba(245, 240, 220, 0.20)');
    g.addColorStop(1, 'rgba(245, 240, 220, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(mx - mr * 3.4, my - mr * 3.4, mr * 6.8, mr * 6.8);
    ctx.fillStyle = '#efe9d2';
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(190, 185, 160, 0.5)';
    ctx.beginPath(); ctx.arc(mx - 12, my - 8, 8, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 10, my + 12, 5, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 14, my - 14, 4, 0, 7); ctx.fill();
  }

  function drawShip(t) {
    var W = canvas.width, H = canvas.height;
    var tt = reduced ? 60000 : t;
    var fx = ((tt * 0.0000115) % 1.5) - 0.25;   /* slow sail across, then wrap */
    var edge = Math.min(1, Math.min(fx + 0.25, 1.25 - fx) / 0.15); /* fade at edges */
    if (edge <= 0) return;
    var sx = fx * W;
    var sy = H * 0.84 + (reduced ? 0 : Math.sin(tt / 900) * 6); /* gentle bob */
    var k = Math.max(0.9, Math.min(1.6, W / 1100)); /* scale with viewport */
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(k, k);
    ctx.globalAlpha = 0.85 * Math.max(0, edge);
    /* moonlit water glow under the hull */
    var wg = ctx.createRadialGradient(0, 26, 4, 0, 26, 130);
    wg.addColorStop(0, 'rgba(150, 200, 235, 0.16)');
    wg.addColorStop(1, 'rgba(150, 200, 235, 0)');
    ctx.fillStyle = wg;
    ctx.fillRect(-140, -10, 280, 90);
    /* sails */
    ctx.fillStyle = '#14263d';
    ctx.beginPath(); /* main sail */
    ctx.moveTo(-6, -78); ctx.quadraticCurveTo(34, -60, 30, -18); ctx.lineTo(-6, -18); ctx.closePath(); ctx.fill();
    ctx.beginPath(); /* fore sail */
    ctx.moveTo(-58, -64); ctx.quadraticCurveTo(-28, -50, -31, -16); ctx.lineTo(-58, -16); ctx.closePath(); ctx.fill();
    /* masts + hull silhouette */
    ctx.strokeStyle = '#050a12'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-6, -84); ctx.lineTo(-6, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-58, -70); ctx.lineTo(-58, 6); ctx.stroke();
    ctx.fillStyle = '#050a12';
    ctx.beginPath();
    ctx.moveTo(-78, 4); ctx.quadraticCurveTo(-60, 26, -30, 28);
    ctx.lineTo(40, 28); ctx.quadraticCurveTo(66, 24, 74, 2);
    ctx.lineTo(60, 4); ctx.lineTo(-64, 4); ctx.closePath(); ctx.fill();
    ctx.fillRect(-84, -2, 8, 10); /* stern cabin */
    /* tiny lantern glowing in the cabin */
    ctx.fillStyle = '#ffd97a';
    ctx.beginPath(); ctx.arc(-80, 3, 2.6, 0, 7); ctx.fill();
    var lg = ctx.createRadialGradient(-80, 3, 1, -80, 3, 14);
    lg.addColorStop(0, 'rgba(255, 217, 122, 0.55)');
    lg.addColorStop(1, 'rgba(255, 217, 122, 0)');
    ctx.fillStyle = lg;
    ctx.fillRect(-94, -11, 28, 28);
    /* flag */
    ctx.strokeStyle = '#050a12'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-6, -84); ctx.lineTo(-6, -94); ctx.stroke();
    ctx.fillStyle = '#0e1a2c';
    var wave = reduced ? 0 : Math.sin(tt / 350) * 2;
    ctx.beginPath(); ctx.moveTo(-6, -94); ctx.quadraticCurveTo(8, -93 + wave, 16, -90 + wave);
    ctx.lineTo(-6, -86); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  (function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < stars.length; j++) {
      var st = stars[j];
      var tw = 0.35 + 0.65 * Math.abs(Math.sin(t / 1000 * st.s + st.p));
      ctx.globalAlpha = tw * 0.7;
      ctx.fillStyle = '#bfe9ff';
      ctx.beginPath();
      ctx.arc(st.x * canvas.width, st.y * canvas.height, st.r, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    drawMoon(t);
    /* drifting clouds */
    var ctt = reduced ? 0 : t;
    for (var q = 0; q < clouds.length; q++) {
      var cl = clouds[q];
      var cx = (((cl.x + ctt * cl.v) % 1.3) - 0.15) * canvas.width;
      var cy = cl.y * canvas.height;
      ctx.globalAlpha = cl.a;
      ctx.fillStyle = '#8fa8c8';
      ctx.beginPath();
      ctx.ellipse(cx, cy, cl.s, cl.s * 0.32, 0, 0, 7);
      ctx.ellipse(cx - cl.s * 0.5, cy + 6, cl.s * 0.55, cl.s * 0.22, 0, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    /* faint wave dashes on the water */
    var wtt = reduced ? 0 : t;
    ctx.strokeStyle = 'rgba(150, 200, 235, 0.10)';
    ctx.lineWidth = 2;
    for (var z = 0; z < waves.length; z++) {
      var wv = waves[z];
      var wx = (((wv.x + wtt * wv.v) % 1.2) - 0.1) * canvas.width;
      var wy = canvas.height * 0.84 + 34 + wv.dy;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + wv.len, wy); ctx.stroke();
    }
    drawShip(t);
    ctx.globalAlpha = 1;
    if (staticCanvas) return; /* one static frame is enough on phones */
    requestAnimationFrame(draw);
  })(0);

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  /* stagger project cards */
  var pio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var cards = Array.prototype.slice.call(e.target.querySelectorAll('.card:not(.skeleton)'));
        cards.forEach(function (c, i) { c.style.transitionDelay = (i * 90) + 'ms'; });
        e.target.querySelectorAll('.card:not(.skeleton)').forEach(function (c) { io.observe(c); });
        pio.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  pio.observe(document.getElementById('project-grid'));

  /* section header underline animation */
  var hio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('inview'); hio.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.section h2').forEach(function (h) { hio.observe(h); });

  /* nav hide on scroll down / show on scroll up */
  var nav = document.querySelector('.nav');
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (y > 140 && y > lastY) nav.classList.add('hidden');
    else nav.classList.remove('hidden');
    lastY = y;
  }, { passive: true });

  /* ---------- scroll progress hairline ---------- */
  var prog = document.getElementById('progress');
  var pTicking = false;
  window.addEventListener('scroll', function () {
    if (pTicking) return;
    pTicking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      pTicking = false;
    });
  }, { passive: true });

  /* ---------- timeline draws itself on scroll ---------- */
  var tio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('drawn'); tio.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.timeline').forEach(function (t) { tio.observe(t); });

  /* ---------- subtle 3D tilt on project cards (fine pointers, motion-safe) ---------- */
  var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.matchMedia('(pointer:fine)').matches && motionOK) {
    var grid = document.getElementById('project-grid');
    grid.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.card');
      if (!card || !card.classList.contains('visible')) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateX(' + (-py * 5).toFixed(2) +
        'deg) rotateY(' + (px * 5).toFixed(2) + 'deg) translateY(-4px)';
    });
    grid.addEventListener('pointerout', function (e) {
      var card = e.target.closest('.card');
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }

  /* ---------- live GitHub data ---------- */
  var USER = 'tushar29k';
  var FALLBACK = [
    { name: 'rag-service', description: 'Production-shaped RAG: chunking, vector search, evals (recall@3 + faithfulness), FastAPI.', language: 'Python', stargazers_count: 0 },
    { name: 'agent-service', description: 'ReAct agent with tools, human-approval gates, checkpoints, LangGraph variant, and task evals.', language: 'Python', stargazers_count: 0 },
    { name: 'llm-service', description: 'Local LLM microservice: chat, streaming, structured extraction, latency benchmarks.', language: 'Python', stargazers_count: 0 },
    { name: 'pr-review-agent', description: 'Automated PR reviewer: deterministic checks + swappable LLM backend, CLI + API, evals.', language: 'Python', stargazers_count: 0 }
  ];
  /* richer "what it is" blurbs for the four flagships; deployment URLs land here once live */
  var BLURB = {
    'rag-service': 'A document-grounded Q&A API: chunking, embeddings and a vector store behind a retrieval pipeline with recall@3 and faithfulness evals. Try it in the browser — index docs and ask questions with citations, scores and latency.',
    'agent-service': 'A ReAct-style agent with tools, human-approval gates on destructive actions, checkpoints and a LangGraph variant. Chat with it in the browser and watch it stream thoughts and tool calls, approving risky steps yourself.',
    'llm-service': 'An LLM microservice wrapper: streaming chat plus structured JSON extraction with pluggable backends (a mock fallback so it works anywhere). Includes latency benchmarks.',
    'pr-review-agent': 'An automated pull-request reviewer: deterministic static checks (secrets, debug leftovers, TODOs) plus a swappable LLM backend, CLI and API. Paste a diff, get a rendered Markdown review with severity chips.'
  };
  /* public demo URLs — deployed on Render, verified live 2026-09-21 */
  var DEMO = {
    'rag-service': 'https://tushar29k-rag-service.onrender.com',
    'agent-service': 'https://tushar29k-agent-service.onrender.com',
    'llm-service': 'https://tushar29k-llm-service.onrender.com',
    'pr-review-agent': 'https://tushar29k-pr-review-agent.onrender.com'
  };
  var LANG_COLORS = { Python: '#3572A5', 'Jupyter Notebook': '#DA5B0B', Dockerfile: '#384D54', Shell: '#89E051' };
  var ACCENTS = ['#22D3EE', '#2DD4BF', '#A78BFA', '#F472B6'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderProjects(repos) {
    var grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    repos.forEach(function (r, idx) {
      var color = LANG_COLORS[r.language] || '#8b98a9';
      var accent = ACCENTS[idx % ACCENTS.length];
      var topics = (r.topics || []).slice(0, 4).map(function (t) {
        return '<span>' + esc(t) + '</span>';
      }).join('');
      var a = document.createElement('div');
      a.className = 'card';
      a.style.setProperty('--accent', accent);
      var desc = BLURB[r.name] || r.description || 'Open-source AI project.';
      var demoUrl = DEMO[r.name];
      var demoBtn = demoUrl
        ? '<a class="mini-btn live" href="' + esc(demoUrl) + '" target="_blank" rel="noopener">Live demo ↗</a>'
        : '<span class="mini-btn soon">Live demo · soon</span>';
      a.innerHTML =
        '<div class="card-top"><span class="rank" style="color:' + accent + '">' + ('0' + (idx + 1)).slice(-2) + '</span>' +
        '<h3><a class="card-title-link" href="' + esc(r.html_url) + '" target="_blank" rel="noopener">' + esc(r.name) + '</a></h3><span class="spacer"></span>' +
        '<span class="stars">★ ' + r.stargazers_count + '</span></div>' +
        '<p>' + esc(desc) + '</p>' +
        (topics ? '<div class="topics">' + topics + '</div>' : '') +
        '<div class="card-meta"><span class="dot" style="background:' + color + '"></span>' +
        esc(r.language || 'Code') + '</div>' +
        '<div class="card-links"><a class="mini-btn" href="' + esc(r.html_url) + '" target="_blank" rel="noopener">Repo ↗</a>' +
        demoBtn + '</div>';
      grid.appendChild(a);
      io.observe(a);
    });
  }

  /* count-up animation for pure-number stats */
  function setStat(id, val) {
    var el = document.getElementById(id);
    if (!/^\d+$/.test(val)) { el.textContent = val; return; }
    var target = parseInt(val, 10);
    var start = null;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 1200, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(frame);
    }
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { requestAnimationFrame(frame); vio.disconnect(); }
      });
    }, { threshold: 0.4 });
    vio.observe(el);
  }

  function getJSON(url) {
    return fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); });
  }

  // projects (exclude the profile repo itself)
  getJSON('https://api.github.com/users/' + USER + '/repos?per_page=100&type=owner')
    .then(function (repos) {
      // hide the portfolio site repo itself: it is not a project, just the frame
      var mine = repos.filter(function (r) { return !r.fork && r.name !== USER && r.name !== USER + '.github.io'; });
      // keep the four flagships first, in a fixed order
      var order = ['rag-service', 'agent-service', 'llm-service', 'pr-review-agent'];
      mine.sort(function (a, b) { return order.indexOf(a.name) - order.indexOf(b.name); });
      renderProjects(mine.length ? mine : FALLBACK);
      setStat('st-repos', String(mine.length || FALLBACK.length));
    })
    .catch(function () { renderProjects(FALLBACK); setStat('st-repos', String(FALLBACK.length)); });

  // commits + PRs (search API; falls back quietly)
  getJSON('https://api.github.com/search/commits?q=author:' + USER + '&per_page=1')
    .then(function (d) { setStat('st-commits', String(d.total_count)); })
    .catch(function () { setStat('st-commits', '120+'); });
  getJSON('https://api.github.com/search/issues?q=author:' + USER + '+type:pr&per_page=1')
    .then(function (d) { setStat('st-prs', String(d.total_count)); })
    .catch(function () { setStat('st-prs', '1'); });

  /* ---------- cursor glow (fine pointers only) ---------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    var glow = document.createElement('div');
    glow.id = 'glow';
    document.body.appendChild(glow);
    var gx = -600, gy = -600, tx = gx, ty = gy;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function follow() {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      glow.style.transform = 'translate(' + (gx - 260) + 'px,' + (gy - 260) + 'px)';
      requestAnimationFrame(follow);
    })();
  }
})();
