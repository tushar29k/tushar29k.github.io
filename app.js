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

  /* ---------- live GitHub data ---------- */
  var USER = 'tushar29k';
  var FALLBACK = [
    { name: 'rag-service', description: 'Production-shaped RAG: chunking, vector search, evals (recall@3 + faithfulness), FastAPI.', language: 'Python', stargazers_count: 0 },
    { name: 'agent-service', description: 'ReAct agent with tools, human-approval gates, checkpoints, LangGraph variant, and task evals.', language: 'Python', stargazers_count: 0 },
    { name: 'llm-service', description: 'Local LLM microservice: chat, streaming, structured extraction, latency benchmarks.', language: 'Python', stargazers_count: 0 },
    { name: 'pr-review-agent', description: 'Automated PR reviewer: deterministic checks + swappable LLM backend, CLI + API, evals.', language: 'Python', stargazers_count: 0 }
  ];
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
      var a = document.createElement('a');
      a.className = 'card';
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.setProperty('--accent', accent);
      a.innerHTML =
        '<div class="card-top"><span class="rank" style="color:' + accent + '">' + ('0' + (idx + 1)).slice(-2) + '</span>' +
        '<h3>' + esc(r.name) + '</h3><span class="spacer"></span>' +
        '<span class="stars">★ ' + r.stargazers_count + '</span></div>' +
        '<p>' + esc(r.description || 'Open-source AI project.') + '</p>' +
        (topics ? '<div class="topics">' + topics + '</div>' : '') +
        '<div class="card-meta"><span class="dot" style="background:' + color + '"></span>' +
        esc(r.language || 'Code') + '</div>' +
        '<span class="go" style="color:' + accent + '">View on GitHub →</span>';
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
      var mine = repos.filter(function (r) { return !r.fork && r.name !== USER; });
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
