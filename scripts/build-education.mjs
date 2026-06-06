// Generates the 6 Education foundation pages into /education from shared
// chrome + per-topic content. Re-run after editing FOUNDATIONS (e.g. to drop
// in a generated video embed):  node scripts/build-education.mjs
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** @typedef {{q:string,a:string}} Faq */
/** @typedef {{n:string,h:string,p:string}} Concept */
/** @typedef {{h:string,p:string}} Step */

const FOUNDATIONS = [
  {
    slug: "increase-cash-flow",
    num: "01",
    title: "Increase Cash Flow",
    image: "cash-flow.jpg",
    subhead:
      "Understand exactly where your money goes each month — and free up margin you can put toward the goals that matter.",
    lede:
      "Cash flow is the foundation everything else is built on. Before you can pay down debt, protect your family, or invest for retirement, you need a reliable gap between what comes in and what goes out — and a plan for that gap.",
    overview: [
      "Most financial stress is not a math problem; it is a visibility problem. When money moves in and out without a plan, it is almost impossible to feel in control — even on a good income.",
      "Improving cash flow is not about cutting everything you enjoy. It is about seeing your money clearly, deciding on purpose where it should go, and building a small, repeatable monthly rhythm your family can actually follow."
    ],
    concepts: [
      { n: "01", h: "Income vs. take-home", p: "Plan around the money that actually lands in your account after taxes and deductions — not your gross salary." },
      { n: "02", h: "Fixed vs. variable spending", p: "Separate the bills that stay the same from the spending you can flex. Your margin lives in the variable column." },
      { n: "03", h: "The monthly margin", p: "Margin is income minus expenses. A positive, intentional margin is what funds every other foundation." },
      { n: "04", h: "Pay yourself first", p: "Move savings out on payday, before discretionary spending — so saving is automatic, not whatever is left over." }
    ],
    steps: [
      { h: "Track 30 days of spending", p: "Capture every dollar for one month. Awareness alone usually surfaces a few surprises worth changing." },
      { h: "Separate needs from wants", p: "Sort spending into essentials, lifestyle, and goals so trade-offs become a clear choice instead of guesswork." },
      { h: "Write a simple monthly plan", p: "Give every dollar a job before the month begins. A written plan beats a mental one every time." },
      { h: "Automate savings first", p: "Schedule an automatic transfer on payday — even a small one builds the habit and the buffer." },
      { h: "Review once a month", p: "Spend 20 minutes comparing plan to reality and adjust. Small corrections keep the plan alive." }
    ],
    mistakes: [
      { b: "Budgeting from memory.", t: " Estimating spending almost always undercounts. Track real numbers for a month first." },
      { b: "Ignoring small recurring charges.", t: " Subscriptions and fees quietly add up — review them line by line." },
      { b: "No buffer for irregular bills.", t: " Annual or quarterly costs wreck a plan when they are not set aside monthly." },
      { b: "Treating every raise as permission to spend.", t: " Direct part of new income to goals before lifestyle expands to absorb it." }
    ],
    faq: [
      { q: "How much margin should I aim for?", a: "There is no single number, but many families work toward saving 10–20% of take-home pay over time. Start with whatever is realistic and increase it gradually." },
      { q: "What if my expenses are higher than my income?", a: "Then the priority is closing that gap — first by reducing flexible spending, then by raising income. A workshop can help you build a step-by-step plan." },
      { q: "Do I need an app to do this?", a: "No. A notebook or simple spreadsheet works. The tool matters far less than reviewing it consistently." }
    ]
  },
  {
    slug: "debt-management",
    num: "02",
    title: "Debt Management",
    image: "debt-management.jpg",
    subhead:
      "Replace reactive minimum payments with a clear, deliberate strategy that gets you out of debt faster and with less stress.",
    lede:
      "Debt is not automatically bad — but debt without a plan quietly drains the margin you worked to create. A clear strategy turns a vague worry into a finish line you can actually see.",
    overview: [
      "When debt feels overwhelming, the instinct is to make minimum payments and hope it improves. The problem is that minimums are designed to keep you paying interest for years.",
      "A good debt strategy is simple: know exactly what you owe, stop the bleeding, then attack balances in a deliberate order while protecting your essentials and your peace of mind."
    ],
    concepts: [
      { n: "01", h: "Good vs. high-cost debt", p: "Low-rate, purposeful debt is different from high-interest balances that compound against you. Treat them differently." },
      { n: "02", h: "The minimum-payment trap", p: "Minimums mostly cover interest. Paying only the minimum can stretch a balance out for years." },
      { n: "03", h: "Avalanche vs. snowball", p: "Avalanche targets the highest interest rate first (cheapest); snowball targets the smallest balance first (most motivating)." },
      { n: "04", h: "Credit utilization", p: "Carrying high balances relative to your limits can weigh on your credit. Lower balances generally help." }
    ],
    steps: [
      { h: "List every debt", p: "Write down each balance, interest rate, and minimum payment in one place so the full picture is visible." },
      { h: "Stop adding high-interest debt", p: "Pause new charges on high-rate accounts while you work the plan, or the finish line keeps moving." },
      { h: "Pick a payoff method", p: "Choose avalanche for least interest or snowball for momentum — then send every extra dollar to that one target." },
      { h: "Ask about lower rates", p: "A lower interest rate through negotiation or refinancing can mean real savings. Always understand the new terms first." },
      { h: "Track each payoff", p: "Mark balances as they disappear. Visible progress is what keeps a long plan going." }
    ],
    mistakes: [
      { b: "Paying only minimums.", t: " It feels safe but maximizes interest and time in debt. Always pay extra toward one target when you can." },
      { b: "Closing cards on impulse.", t: " It can raise your utilization and shorten credit history. Decide deliberately, not emotionally." },
      { b: "Consolidating without changing habits.", t: " A new loan only helps if the spending that created the debt also changes." },
      { b: "Ignoring the interest rate.", t: " The rate, not just the balance, decides how fast a debt grows. Prioritize accordingly." }
    ],
    faq: [
      { q: "Should I save or pay off debt first?", a: "Most plans build a small starter emergency fund first, then attack high-interest debt aggressively — so a surprise expense does not push you back onto the cards." },
      { q: "Is debt consolidation a good idea?", a: "It can lower your rate and simplify payments, but only if you understand the new terms and stop adding new debt. It is a tool, not a cure." },
      { q: "Which method is better, avalanche or snowball?", a: "Avalanche saves the most money; snowball gives the most motivation. The best one is the one you will actually stick with." }
    ]
  },
  {
    slug: "strong-foundation",
    num: "03",
    title: "Strong Foundation",
    image: "foundation.jpg",
    subhead:
      "Build the stable base — emergency savings, the right accounts, and clear family goals — that every other decision rests on.",
    lede:
      "A strong foundation is what keeps one bad month from becoming a financial crisis. It is the quiet infrastructure — savings, the right accounts, named beneficiaries, written goals — that makes everything else possible.",
    overview: [
      "Families who feel secure are rarely the ones earning the most. They are the ones who built a foundation: a cushion for emergencies, accounts set up on purpose, and goals written down where the whole family can see them.",
      "This foundation does not require a large income. It requires intention — a few decisions made once and then maintained, so that progress can compound instead of restarting after every setback."
    ],
    concepts: [
      { n: "01", h: "The emergency fund", p: "Cash set aside for the unexpected keeps a surprise from turning into new debt. It is the first line of defense." },
      { n: "02", h: "The right accounts", p: "Separating spending, saving, and goal money makes it far easier to see progress and avoid accidental overspending." },
      { n: "03", h: "Beneficiaries & basic documents", p: "Naming beneficiaries and having basic documents in place protects your family from confusion during hard moments." },
      { n: "04", h: "Written family goals", p: "Goals you can see — short, medium, and long term — turn money from a source of stress into a tool with a purpose." }
    ],
    steps: [
      { h: "Build a starter emergency fund", p: "Aim first for a small cushion, then grow toward several months of essential expenses over time." },
      { h: "Set up the right accounts", p: "Open separate accounts for spending, emergencies, and specific goals so each dollar has a clear home." },
      { h: "Name and update beneficiaries", p: "Check every account and policy. Outdated beneficiaries are one of the most common and avoidable mistakes." },
      { h: "Get basic documents in place", p: "Understand which essential documents your family needs so wishes are clear and decisions are not left to chance." },
      { h: "Write 1, 5, and 10-year goals", p: "Put goals on paper with rough numbers and dates. Specific goals are far more likely to happen." }
    ],
    mistakes: [
      { b: "No emergency fund.", t: " Without a cushion, every surprise becomes new debt. Build even a small buffer first." },
      { b: "Outdated beneficiaries.", t: " Old designations can send money to the wrong person. Review them after every major life change." },
      { b: "Mixing every goal in one account.", t: " When all money sits together, progress is invisible and easy to spend. Separate it." },
      { b: "Putting off basic documents.", t: " The right paperwork protects your family. Waiting only adds stress to an already hard time." }
    ],
    faq: [
      { q: "How big should my emergency fund be?", a: "A common target is three to six months of essential expenses, but start with a small, achievable cushion and grow it. Any buffer beats none." },
      { q: "Where should I keep emergency savings?", a: "Somewhere safe and easy to reach — typically a separate savings account, not invested in the market where the value can drop right when you need it." },
      { q: "Do I really need estate documents if I'm young?", a: "Basic documents matter at any age, especially with a family. A workshop can walk you through which ones are essential without the jargon." }
    ]
  },
  {
    slug: "proper-protection",
    num: "04",
    title: "Proper Protection",
    image: "protection.jpg",
    subhead:
      "Know which risks could truly derail your family — and understand how to cover them before a crisis hits, not after.",
    lede:
      "Protection is the foundation people skip until it is too late. The goal is simple: identify the risks that could undo years of progress, and make sure your family is covered before you ever need it.",
    overview: [
      "It is natural to focus on growing money and to put off protecting it. But a single uncovered event — a lost income, a serious illness, an accident — can erase years of careful saving in weeks.",
      "Proper protection is not about fear or about buying the most expensive policy. It is about understanding your real risks clearly, so you can make informed, unpressured decisions about how to cover them."
    ],
    concepts: [
      { n: "01", h: "Protect income before returns", p: "Your ability to earn is usually your largest asset. Protecting that income comes before chasing investment growth." },
      { n: "02", h: "Income protection", p: "Coverage that replaces income — for a family's earners — is what keeps a tragedy from also becoming a financial collapse." },
      { n: "03", h: "Health & liability risks", p: "Medical costs and liability are among the most common causes of financial hardship. Understand how yours are covered." },
      { n: "04", h: "Match coverage to need", p: "The right amount and type of coverage depends on your situation — not on a sales pitch. Start from your actual need." }
    ],
    steps: [
      { h: "Inventory your risks", p: "List what would financially hurt your family most: loss of income, illness, disability, liability. Name them plainly." },
      { h: "Estimate income-replacement need", p: "Work out roughly how much your family would need if a primary income disappeared, and for how long." },
      { h: "Review what you already have", p: "Check existing coverage through work and elsewhere. You may have more — or less — than you think." },
      { h: "Fill the real gaps", p: "Cover the meaningful gaps deliberately. Understand any policy fully before committing to it." },
      { h: "Re-check after life changes", p: "Marriage, a new child, a home, a new job — each is a reason to revisit your protection." }
    ],
    mistakes: [
      { b: "Insuring things, not income.", t: " People insure cars and phones but leave their largest asset — future income — unprotected." },
      { b: "Guessing the coverage amount.", t: " Too little leaves a gap; too much wastes money. Base the number on your actual need." },
      { b: "Buying complexity you don't understand.", t: " Never commit to a policy you cannot explain in plain language. Ask until it is clear." },
      { b: "Never reviewing coverage.", t: " Needs change with life. Coverage set once and forgotten is often wrong within a few years." }
    ],
    faq: [
      { q: "Mind Peace doesn't sell products — so why teach protection?", a: "Because understanding risk is part of financial literacy. Our workshops explain how protection works in plain language so you can make your own informed decisions." },
      { q: "How do I know how much income protection I need?", a: "A simple starting point is to consider how much your family relies on each income and for how long they would need support. A workshop walks through the math with you." },
      { q: "What should I do before buying any policy?", a: "Understand exactly what it covers, what it costs, and what it excludes. If you cannot explain it back simply, ask more questions first." }
    ]
  },
  {
    slug: "retirement-strategies",
    num: "05",
    title: "Retirement Strategies",
    image: "retirement.jpg",
    subhead:
      "Turn vague retirement hopes into concrete numbers, the right accounts, and a few simple next steps you can start now.",
    lede:
      "Retirement can feel too far away to plan for — which is exactly why so many families arrive unprepared. The good news: time is the most powerful tool you have, and starting early beats starting big.",
    overview: [
      "Most people do not avoid retirement planning because they do not care. They avoid it because it feels abstract and overwhelming. The fix is to make it concrete: a rough number, the right account, and an automatic contribution.",
      "Thanks to compounding, money invested earlier can grow dramatically more than money invested later. That is why the single most valuable retirement move is usually to start — even small — as soon as possible."
    ],
    concepts: [
      { n: "01", h: "Time & compounding", p: "Invested money earns returns, and those returns earn more. Decades of compounding can outweigh the size of contributions." },
      { n: "02", h: "Tax-advantaged accounts", p: "Retirement accounts offer tax benefits designed to reward long-term saving. Using them is often the most efficient path." },
      { n: "03", h: "The employer match", p: "When an employer matches contributions, that is added money for your future. Leaving it unclaimed is leaving pay behind." },
      { n: "04", h: "Your retirement number", p: "A rough estimate of what you will need turns a vague worry into a target you can plan toward." }
    ],
    steps: [
      { h: "Estimate your number", p: "Make a rough estimate of the annual income you will want in retirement, then work backward from there." },
      { h: "Capture the full match", p: "If your employer offers a match, contribute at least enough to receive all of it. It is the easiest return available." },
      { h: "Automate contributions", p: "Set retirement saving to happen automatically each paycheck so it never depends on willpower." },
      { h: "Choose your tax treatment", p: "Understand the difference between pre-tax and after-tax retirement saving and pick what fits your situation." },
      { h: "Increase 1% a year", p: "Raise your contribution by a small amount annually — often you will not feel it, but the long-term effect is large." }
    ],
    mistakes: [
      { b: "Waiting to start.", t: " Every year of delay costs compounding you cannot get back. Starting small now beats starting big later." },
      { b: "Leaving the match on the table.", t: " Not contributing enough to get a full employer match is turning down free retirement money." },
      { b: "Cashing out when changing jobs.", t: " Withdrawing retirement savings early can trigger taxes, penalties, and lost growth. Roll it over instead." },
      { b: "No plan for healthcare and longevity.", t: " People often underestimate how long retirement lasts and what care will cost. Plan for both." }
    ],
    faq: [
      { q: "I'm starting late — is it even worth it?", a: "Yes. While time helps most, contributing consistently and capturing any employer match still makes a meaningful difference. The best time to start is now." },
      { q: "How much should I contribute?", a: "Start with at least enough to get any employer match, then work toward saving a growing share of income over time. Increasing gradually is easier than it sounds." },
      { q: "Pre-tax or after-tax accounts?", a: "It depends on your current and expected future tax situation. A workshop explains the trade-offs so you can choose with confidence." }
    ]
  },
  {
    slug: "wealth-preservation",
    num: "06",
    title: "Wealth Preservation",
    image: "wealth.jpg",
    subhead:
      "Protect the progress you've built through planning, tax awareness, diversification, and informed decisions.",
    lede:
      "Building wealth and keeping wealth are two different skills. Preservation is about protecting hard-won progress from avoidable risks — concentration, taxes, fees, and a lack of planning — so it lasts and can be passed on.",
    overview: [
      "Many families focus entirely on growing their money and never plan for keeping it. But progress can erode quietly through over-concentration, unmanaged taxes, high fees, or the absence of a clear plan.",
      "Wealth preservation is not only for the wealthy. It is the discipline of seeing what you have clearly, reducing avoidable risk, and putting structure in place so your progress endures — and benefits the next generation."
    ],
    concepts: [
      { n: "01", h: "Protect before you grow", p: "Reducing the risk of a large, permanent loss matters more over time than chasing a slightly higher return." },
      { n: "02", h: "Diversification basics", p: "Spreading assets reduces the damage any single bad outcome can do. Concentration is the quiet enemy of preservation." },
      { n: "03", h: "Tax & fee awareness", p: "Taxes and fees are some of the largest, most controllable drags on long-term wealth. Awareness keeps more of what you earn." },
      { n: "04", h: "Estate & legacy planning", p: "A clear plan for what you have ensures it passes the way you intend, with less cost and confusion for your family." }
    ],
    steps: [
      { h: "Document your net worth", p: "List what you own and what you owe in one place. You cannot protect what you have not measured." },
      { h: "Reduce concentration risk", p: "Check whether too much depends on a single asset, employer, or investment — and rebalance toward diversification." },
      { h: "Plan for taxes and fees", p: "Understand where taxes and fees are quietly reducing your returns, and make informed choices to limit them." },
      { h: "Update estate documents", p: "Keep wills, beneficiaries, and key documents current so your wishes are clear and honored." },
      { h: "Educate the next generation", p: "Pass on knowledge alongside assets. Financial literacy is the part of a legacy that keeps compounding." }
    ],
    mistakes: [
      { b: "No clear net-worth picture.", t: " Without knowing what you have, it is impossible to protect it well. Start by measuring." },
      { b: "Over-concentration.", t: " Too much in one stock, sector, or asset turns one bad event into a major setback. Diversify." },
      { b: "Ignoring taxes and fees.", t: " Small percentages compound into large amounts over decades. Manage what you can control." },
      { b: "No legacy plan.", t: " Without a plan, wealth can be lost to taxes, disputes, or confusion. Put structure in place early." }
    ],
    faq: [
      { q: "Is wealth preservation only for rich families?", a: "No. Anyone who has built savings or assets benefits from protecting them. The same principles scale from a first emergency fund to a larger estate." },
      { q: "How often should I review my plan?", a: "At least once a year, and after any major life or financial change. Preservation is maintenance, not a one-time event." },
      { q: "What's the simplest first step?", a: "Write down your net worth. Seeing the full picture clearly is what makes every other preservation decision possible." }
    ]
  }
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function header() {
  return `  <div class="page-shell">
    <header class="site-header" data-reveal>
      <a class="brand" href="../index.html" aria-label="Mind Peace Financial home">
        <img src="../assets/logo.png" alt="Mind Peace Financial" />
      </a>
      <nav class="nav" aria-label="Primary navigation">
        <a href="../index.html#mission">Mission</a>
        <a href="../index.html#workshops">Workshops</a>
        <a href="../index.html#modules">Education</a>
        <a href="../index.html#movement">Movement</a>
        <a href="../index.html#contact">Contact</a>
      </nav>
      <a class="header-cta" href="../index.html#workshop-form">Attend Free Workshop <span>→</span></a>
    </header>`;
}

function footer() {
  return `    <footer id="contact" class="site-footer">
      <div class="footer-brand">
        <img src="../assets/logo.png" alt="Mind Peace Financial" />
        <p>Financial literacy, mentorship, and action for families building a stronger future.</p>
      </div>
      <div class="footer-links">
        <div><h4>Explore</h4><a href="../index.html#mission">Mission</a><a href="../index.html#modules">Education</a><a href="../index.html#workshops">Workshops</a></div>
        <div><h4>Get In Touch</h4><a href="tel:+18023281995">(802) 328-1995</a><a href="mailto:linda@mindpeacefinancial.com">linda@mindpeacefinancial.com</a><span>1 Technology Drive Suite J709<br>Irvine, CA 92618</span></div>
        <div><h4>Follow</h4><a href="https://www.facebook.com/" rel="noopener">Facebook</a><a href="https://www.linkedin.com/" rel="noopener">LinkedIn</a><a href="https://www.youtube.com/" rel="noopener">YouTube</a></div>
      </div>
      <div class="footer-bottom"><span>Copyright © 2026 Mind Peace Financial. All Rights Reserved.</span><span>Privacy Policy · Terms &amp; Conditions</span></div>
    </footer>
  </div>
  <script src="../script.js"></script>`;
}

function videoBlock(f) {
  const mp4 = `assets/videos/${f.slug}.mp4`;
  if (existsSync(resolve(root, mp4))) {
    const poster = existsSync(resolve(root, `assets/videos/${f.slug}.jpg`))
      ? `../assets/videos/${f.slug}.jpg`
      : `../assets/${f.image}`;
    return `      <div class="video-frame">
        <video controls preload="none" playsinline poster="${poster}" title="${esc(f.title)} — 3-minute explainer">
          <source src="../${mp4}" type="video/mp4" />
        </video>
      </div>
      <figcaption>A 3-minute explainer on ${esc(f.title.toLowerCase())}, by Mind Peace Financial.</figcaption>`;
  }
  return `      <div class="video-frame is-placeholder">
        <img class="poster" src="../assets/${f.image}" alt="" />
        <div class="poster-veil"></div>
        <div class="poster-inner">
          <span class="play-icon">▶</span>
          <strong>${esc(f.title)} — 3-minute explainer</strong>
          <small>A short, plain-language walkthrough of this foundation.</small>
          <span class="badge-soon">Video coming soon</span>
        </div>
      </div>
      <figcaption>A 3-minute explainer on ${esc(f.title.toLowerCase())} is on the way.</figcaption>`;
}

function foundationNav(current) {
  const cells = FOUNDATIONS.map(
    (f) =>
      `        <a href="${f.slug}.html"${f.slug === current ? ' class="current"' : ""}><span class="fn-num">${f.num}</span><span class="fn-title">${esc(f.title)}</span></a>`
  ).join("\n");
  return `    <section class="foundation-nav" data-reveal>
      <h4>Explore the seven money foundations</h4>
      <div class="foundation-grid">
${cells}
      </div>
    </section>`;
}

function page(f) {
  const concepts = f.concepts
    .map((c) => `        <article class="concept-card"><span class="num">${c.n}</span><h3>${esc(c.h)}</h3><p>${esc(c.p)}</p></article>`)
    .join("\n");
  const steps = f.steps
    .map((s) => `        <li><strong>${esc(s.h)}</strong><p>${esc(s.p)}</p></li>`)
    .join("\n");
  const mistakes = f.mistakes
    .map((m) => `        <li><b>${esc(m.b)}</b>${esc(m.t)}</li>`)
    .join("\n");
  const faq = f.faq
    .map((x) => `        <details><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`)
    .join("\n");
  const overview = f.overview.map((p) => `<p>${esc(p)}</p>`).join("\n          ");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(f.title)} — Mind Peace Financial</title>
  <meta name="description" content="${esc(f.subhead)}" />
  <meta property="og:title" content="${esc(f.title)} — Mind Peace Financial" />
  <meta property="og:description" content="${esc(f.subhead)}" />
  <meta property="og:type" content="article" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css" />
  <link rel="stylesheet" href="../education.css" />
</head>
<body>
${header()}

    <main id="top" class="edu-main">
      <section class="edu-hero" data-reveal>
        <div class="breadcrumb">
          <a href="../index.html">Home</a><span class="sep">/</span>
          <a href="../index.html#modules">Education</a><span class="sep">/</span>
          <span>${esc(f.title)}</span>
        </div>
        <p class="eyebrow">Foundation ${f.num}</p>
        <h1>${esc(f.title)}</h1>
        <p class="hero-subhead">${esc(f.subhead)}</p>
        <div class="edu-meta">
          <span><b>~4 min</b> video explainer</span>
          <span><b>${f.concepts.length}</b> key concepts</span>
          <span><b>${f.steps.length}</b> action steps</span>
          <span><b>$0</b> free workshop</span>
        </div>
      </section>

      <figure class="edu-video" data-reveal>
${videoBlock(f)}
      </figure>

      <section class="edu-section tight" data-reveal>
        <p class="edu-lede">${esc(f.lede)}</p>
      </section>

      <section class="edu-section" data-reveal>
        <div class="edu-split">
          <div class="section-header" style="margin-bottom:0">
            <p class="eyebrow">Overview</p>
            <h2>What this foundation covers</h2>
          </div>
          <div class="text-card">
          ${overview}
          </div>
        </div>
      </section>

      <section class="edu-section" data-reveal>
        <div class="section-header"><p class="eyebrow">The essentials</p><h2>Key concepts</h2></div>
        <div class="concept-grid">
${concepts}
        </div>
      </section>

      <section class="edu-section" data-reveal>
        <div class="edu-split">
          <div class="section-header" style="margin-bottom:0">
            <p class="eyebrow">Put it into practice</p>
            <h2>Your action steps</h2>
          </div>
          <ol class="steps">
${steps}
          </ol>
        </div>
      </section>

      <section class="edu-section" data-reveal>
        <div class="section-header"><p class="eyebrow">Watch out for</p><h2>Common mistakes to avoid</h2></div>
        <ul class="mistake-list">
${mistakes}
        </ul>
      </section>

      <section class="edu-section" data-reveal>
        <div class="section-header"><p class="eyebrow">Questions</p><h2>Frequently asked</h2></div>
        <div class="faq">
${faq}
        </div>
      </section>

      <section class="edu-cta" data-reveal>
        <p class="eyebrow" style="display:inline-block">Free · No obligation</p>
        <h2>Want help applying this to your family?</h2>
        <p>Our complimentary workshops walk through ${esc(f.title.toLowerCase())} and the rest of the foundations in plain language — no cost, no sales pressure.</p>
        <a class="btn btn-primary" href="../index.html#workshop-form">Attend a Free Workshop <span>→</span></a>
      </section>

${foundationNav(f.slug)}
    </main>

${footer()}
</body>
</html>
`;
}

mkdirSync(resolve(root, "education"), { recursive: true });
for (const f of FOUNDATIONS) {
  const out = resolve(root, "education", `${f.slug}.html`);
  writeFileSync(out, page(f), "utf8");
  console.log("wrote", `education/${f.slug}.html`);
}
console.log(`\n${FOUNDATIONS.length} education pages generated.`);
