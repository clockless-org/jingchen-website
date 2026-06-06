// Scroll reveal
document.documentElement.classList.add('js-ready');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// Video-band play card → jump to the guides
document.querySelector('.play-card')?.addEventListener('click', () => {
  document.querySelector('#education, #top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Bilingual language toggle (中文 / EN), persisted
(function () {
  const KEY = 'ssun-lang';
  const buttons = document.querySelectorAll('.lang-toggle button');
  function apply(lang) {
    document.body.setAttribute('data-lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    buttons.forEach((b) => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }
  const saved = (() => { try { return localStorage.getItem(KEY); } catch (e) { return null; } })();
  apply(saved === 'en' || saved === 'zh' ? saved : (document.body.getAttribute('data-lang') || 'zh'));
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.getAttribute('data-lang'))));
})();

// City pin interaction on the Bay Area map.
// Each pin carries data-city; clicking/keyboard-activating swaps the city-card copy.
(function () {
  const CITIES = {
    'palo-alto': {
      name: 'Palo Alto',
      regionZh: '半岛', regionEn: 'Peninsula',
      bodyZh: '斯坦福门口的"老钱"社区——好学区、近 280 / 101 通勤、平直住宅区与百年宅邸并存。价格高位，但流动性也最稳。',
      bodyEn: 'The "old money" doorstep to Stanford — top schools, fast 280/101 commute, flat residential streets and century-old estates side by side. Top of market, liquidity stays strong.',
      range: '$3M – $10M+', schools: 'PAUSD · 10/10'
    },
    'mountain-view': {
      name: 'Mountain View',
      regionZh: '南湾', regionEn: 'South Bay',
      bodyZh: 'Google 总部所在地——Castro Street 步行街、轻轨、车站三合一。Townhouse 与新式公寓比例高，租 / 投资也热门。',
      bodyEn: 'Google HQ town — Castro Street downtown, light rail, train station all in one. Heavy townhouse and condo mix; popular for lease and investment as well.',
      range: '$1.8M – $4.5M', schools: 'MVLA · 8-10/10'
    },
    'cupertino': {
      name: 'Cupertino',
      regionZh: '南湾', regionEn: 'South Bay',
      bodyZh: '学区房之城——Apple 总部 + 顶级学区双 buff，华人家庭长期重仓。挂牌量小、竞争激烈，出价策略极其关键。',
      bodyEn: 'School district capital — Apple HQ plus top-tier schools means Chinese families load up here. Listings are thin, competition is fierce; offer strategy is everything.',
      range: '$2.8M – $5.5M', schools: 'Cupertino USD · 10/10'
    },
    'san-jose': {
      name: 'San Jose ★',
      regionZh: '南湾 · 主城', regionEn: 'South Bay · Core',
      bodyZh: '湾区最大城市，社区差异极大：Almaden / Evergreen / West San Jose 几乎是不同城市。投资与自住都有机会，关键是分清子市场——我每周都在这里跑。',
      bodyEn: "The Bay Area's biggest city — neighborhoods range so widely (Almaden, Evergreen, West San Jose, etc.) they read as separate markets. Strong investment and primary-residence plays; sub-market clarity is everything — I walk it weekly.",
      range: '$1.1M – $3M+', schools: 'San Jose USD · 5-9/10'
    },
    'fremont': {
      name: 'Fremont',
      regionZh: '东湾', regionEn: 'East Bay',
      bodyZh: '东湾科技家庭聚集地——Mission San Jose 学区是华人家庭的圣杯，通勤靠 BART 和 880。新房供应比半岛多。',
      bodyEn: "East Bay tech-family hub — Mission San Jose schools are the holy grail. BART + 880 for commute. Newer construction is more available than on the Peninsula.",
      range: '$1.6M – $4M', schools: 'Fremont USD · 7-10/10'
    },
    'pleasanton': {
      name: 'Pleasanton ★',
      regionZh: '东湾 · 主城', regionEn: 'East Bay · Core',
      bodyZh: '东湾"宽松版南湾"——大块地、好学区、社区规划整齐；远 SF 但有 BART，适合远程工作家庭。三 valley 之一，我的主战场。',
      bodyEn: 'East Bay\'s "roomier South Bay" — bigger lots, top schools, planned-out community feel. Far from SF but BART-connected; great for remote-work families. One of my Tri-Valley core markets.',
      range: '$1.5M – $3.5M', schools: 'Pleasanton USD · 9-10/10'
    },
    'san-ramon': {
      name: 'San Ramon ★',
      regionZh: '东湾 · 主城', regionEn: 'East Bay · Core',
      bodyZh: '东湾 Tri-Valley 北角——Bishop Ranch 办公园区、顶级学区、新规划社区。Chevron / Bishop Ranch 通勤族 + 跨州投资家庭都集中在这。我深耕的主城之一。',
      bodyEn: "Tri-Valley's northern anchor — Bishop Ranch office park, top schools, planned community feel. Chevron / Bishop Ranch commuters and cross-state investor families concentrate here. One of my Tri-Valley core markets.",
      range: '$1.6M – $3.5M', schools: 'San Ramon Valley USD · 9-10/10'
    },
    'walnut-creek': {
      name: 'Walnut Creek',
      regionZh: '东湾', regionEn: 'East Bay',
      bodyZh: '东湾中心商圈——独栋为主，市中心活跃，BART 直达 SF。生活节奏比南湾松，性价比明显。',
      bodyEn: "East Bay's downtown core — mostly single-family, lively downtown, BART direct to SF. Slower pace than the South Bay; clearly better value per dollar.",
      range: '$1.2M – $3M', schools: 'Acalanes UHSD · 9-10/10'
    },
    'oakland': {
      name: 'Oakland',
      regionZh: '东湾', regionEn: 'East Bay',
      bodyZh: '社区分化最大的城市之一——Rockridge / Piedmont Ave / 山区独栋是不同的市场。地段 + 街区是几乎所有决定的核心。',
      bodyEn: "One of the most micro-segmented cities in the Bay — Rockridge, Piedmont Ave, the hills, the flats all read as different markets. Block and street picks dominate every decision.",
      range: '$700K – $3M+', schools: 'Oakland USD · varies'
    }
  };

  const card = document.getElementById('city-card');
  const nameEl = document.getElementById('city-name');
  const regionEl = document.getElementById('city-region');
  const bodyEl = document.getElementById('city-body');
  const metaEl = document.getElementById('city-meta');
  if (!card || !nameEl) return;

  function applyCity(id) {
    const city = CITIES[id];
    if (!city) return;
    card.dataset.active = id;
    nameEl.textContent = city.name;
    regionEl.innerHTML = `<span class="zh">${city.regionZh}</span><span class="en">${city.regionEn}</span>`;
    bodyEl.innerHTML = `<span class="zh">${city.bodyZh}</span><span class="en">${city.bodyEn}</span>`;
    if (metaEl) {
      metaEl.innerHTML = `
        <span><span class="zh">价格区间</span><span class="en">Range</span><b>${city.range}</b></span>
        <span><span class="zh">学区</span><span class="en">Schools</span><b>${city.schools}</b></span>
      `;
    }
    document.querySelectorAll('.city-pin').forEach((p) => {
      p.classList.toggle('is-active', p.dataset.city === id);
    });
  }

  document.querySelectorAll('.city-pin').forEach((pin) => {
    pin.addEventListener('click', () => applyCity(pin.dataset.city));
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        applyCity(pin.dataset.city);
      }
    });
  });
})();

// Consult form: post to Formspree-style endpoint; gracefully degrade to mailto
// when no endpoint is configured or the network fails.
(function () {
  const form = document.getElementById('consultForm');
  if (!form) return;
  const submitBtn = form.querySelector('.form-submit');
  const defaultLabel = form.querySelector('.form-submit-default');
  const sendingLabel = form.querySelector('.form-submit-sending');
  const successMsg = form.querySelector('.form-success');
  const errorMsg = form.querySelector('.form-error');

  function setSending(sending) {
    submitBtn.disabled = sending;
    defaultLabel.hidden = sending;
    sendingLabel.hidden = !sending;
  }

  function show(el, on) { if (el) el.hidden = !on; }

  function buildMailto(data) {
    const subject = encodeURIComponent(`Consult request — ${data.direction || 'general'} — ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || ''}\nDirection: ${data.direction}\nRegion: ${data.region || ''}\n\n${data.notes || ''}`
    );
    return `mailto:stephensvhomes@gmail.com?subject=${subject}&body=${body}`;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    show(successMsg, false);
    show(errorMsg, false);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const endpoint = form.getAttribute('action') || '';
    const endpointReady = endpoint && !endpoint.includes('your-form-id');

    if (!endpointReady) {
      // No Formspree endpoint configured yet — fall back to mailto.
      window.location.href = buildMailto(data);
      return;
    }

    setSending(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (!response.ok) throw new Error('Form submit failed: ' + response.status);
      form.reset();
      show(successMsg, true);
    } catch (error) {
      console.warn('[consult-form] falling back to mailto:', error);
      show(errorMsg, true);
    } finally {
      setSending(false);
    }
  });
})();
