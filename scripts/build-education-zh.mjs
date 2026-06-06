// Build bilingual (中/EN) education (干货) pages for Stephen Sun.
// Each page: Sotheby's-style chrome + lang toggle + hero + video slot +
// bilingual article body (Chinese original from Notion + English translation).
//   node scripts/build-education-zh.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "/tmp/nc-stephen/articles";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Strip emoji / pictographs from Notion source text (off-brand for the luxury look).
const stripEmoji = (s) => String(s)
  .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{2190}-\u{21FF}\u{1F1E6}-\u{1F1FF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu, "")
  .replace(/[ \t]{2,}/g, " ").trim();

const ARTICLES = [
  {
    slug: "google-maps-vetting", num: "01",
    title: "用谷歌地图帮你买房排雷", titleEn: "Vet homes with Google Maps",
    blurb: "打开卫星图和街景，很多坑爹房源不用去看就能直接 PASS。", blurbEn: "Satellite + street view: pass on bad listings before you ever visit.",
    en: `Weekends fill up with open houses — and after a dozen tours, you realize most weren't worth the time. Here's a pro trick: vet listings on Google Maps first, and pass on the bad ones without ever driving over.

## Start with the big picture
On satellite view, screen for dealbreakers: too close to a freeway or arterial (noise and exhaust you can't escape — use Measure distance and think twice within 500 ft), backing onto a mobile-home park, sitting behind shops or restaurants (privacy, smells, pests), a nearby cemetery, or power-line towers (look for the towers and their shadows).

## Then the lot itself
Watch for a house facing straight down a road or on the outside of a curve (noise, headlights, safety), zero-setback homes pressed against neighbors, additions that stand taller than the rest of the block (check the city's permit history), and "junk-house" neighbors with cluttered yards or a green pool.

## Drop the street-view pegman
Walk the street virtually: is it tidy? Old cars or RVs along it? How are the neighbors' front yards? It's the clearest read on how the community is maintained.

Google Maps is your first filter — don't waste a precious weekend discovering the pitfalls in person.`
  },
  {
    slug: "buyer-commission", num: "02",
    title: "硅谷买家佣金，谁来付？", titleEn: "Who pays the buyer's commission?",
    blurb: "新规之下，买家佣金怎么谈、谁来出，直接关系到你的真实成本。", blurbEn: "Under NAR's new rules, who pays can swing your real cost by $40k.",
    en: `After NAR's new rules, every buyer faces the same question: who pays the buyer's agent's commission? Choose wrong and it can cost you $40k. Here's how to think about it across five angles.

## Cash vs. loan — the big one
If the seller pays, your down payment is smaller and you lean more on the loan. If you pay, the price is lower, so your monthly payment and property tax drop — but you pay roughly $40k more in cash up front.

## Reserves vs. appraisal
Paying it yourself drains $40k of cash, which can leave you short on reserves and risk the loan. Having the seller pay pushes the price up and risks a low appraisal you'd have to cover in cash. Short on cash → seller pays. Tight appraisal → you pay.

## The seller's math
Rational sellers often agree to pay, since it lowers the buyer's cash barrier and draws more bids. But in San Jose, if the price sits right at the mansion-tax line, the seller may want you to pay to avoid it.

## How to choose
Tight on the down payment: push for the seller to pay and keep your cash. Want a lower monthly and tax basis: pay it yourself and lower the total price. Run the numbers with your agent and lender.`
  },
  {
    slug: "meta-buying-guide", num: "03",
    title: "Meta 员工买房指南，Cliff 了怎么办", titleEn: "A buying guide for Meta employees",
    blurb: "RSU 收入、Cliff 预警、现金规划——科技人买房的 P0 要素。", blurbEn: "RSUs, the cliff, cash planning — the P0s for tech buyers.",
    en: `A 2026 home-buying roadmap for Meta employees — the things that matter most for metamates buying a home.

## Finances: watch the cliff
Most of your income is RSUs, so budget dynamically. 2026 is the last year of cheap refresh grants; many senior folks face the cliff, and today's high comp likely isn't sustainable. Open Schwab, map your vests for the next few years, and keep your payment in a comfortable range.

## Risk: wait for the shoe to drop
Buying anxiety comes from two things outside your control — layoffs and prices. You can't control layoffs, so stay calm and wait for the news to land. Bay Area prices track tech stocks, but they won't collapse; expect mild swings, steady-to-up next year.

## Cash: don't let "sold too early" stall you
The worst spot is finding your dream home with the down payment locked in RSUs outside the trading window. Hedge that fear with broad-market or related ETFs after selling (mind wash-sale rules).

## Keep $50–100k extra
Beyond down payment and closing costs, water softeners, EV chargers and big furniture get overlooked. Keep an extra $50–100k in cash so you're not stretched after move-in.`
  },
  {
    slug: "townhouse-offers", num: "04",
    title: "南湾 Townhouse 出价秘籍", titleEn: "South Bay townhouse offer secrets",
    blurb: "南湾 townhouse 怎么出价更稳、更省钱，卖家不会告诉你。", blurbEn: "What sellers won't tell you about pricing a South Bay townhouse.",
    en: `The Bay Area townhouse market has been flat for a while, yet some sales still close surprisingly high. In Sunnyvale's 94085/94086, the data on newer 3–4 bedroom townhouses reveals a clear pricing pattern.

## Watch price per square foot
Unlike single-family homes, townhouses are highly standardized, so $/sqft is the number to watch. Across recent Sunnyvale sales, the distribution is remarkably tight.

## The fair range and the warning line
The fair range is roughly $870–$970 per sqft. Once you cross about $1,050, you may be paying 10–20% over the market average — and at today's rates, that's how you end up overpaying.

## Don't pay more than new construction
The key red flag: new townhouses in Sunnyvale now open under $1,000/sqft. If someone pays over $1,050 for a resale, ask why you'd pay more than new.

## Use data, hold your line
Benchmark the surrounding $/sqft before offering, stay calm, and don't chase a bidding frenzy. Unless there's a rare plus — a top-school edge or perfect noise shielding — think hard before going over $1,000/sqft.`
  },
  {
    slug: "avid-inspection", num: "06",
    title: "别让糊弄的 AVID 毁了你的买房", titleEn: "A sloppy AVID is a buying nightmare",
    blurb: "AVID 和检查报告里藏着的细节，决定你会不会买到一个大坑。", blurbEn: "The AVID and inspection details decide whether you buy a money pit.",
    en: `Want to know whether your agent is truly protecting you or just rushing to close and collect? Look at the AVID in your offer.

## What an AVID is
It's the agent's visual inspection report. Beyond the seller's professional inspections, your agent must walk the property — inside, exterior walls, driveway, yard — and flag what's visible. If a visible major defect surfaces after closing and the agent never noted it, that's negligence, and the AVID is your evidence.

## Two ways agents phone it in
The "board first, ticket later" type: no AVID in the offer, then a rushed one to sign right before closing. The "broken record" type: nothing noted, or copied from the listing agent or the inspection report. Both add zero value.

## Why they cut corners
Some fear that too much detail scares you off or makes your offer too low to win. Some just don't want to spend the time. And many only look at finishes, not the structure and drainage of older homes.

## What a good AVID looks like
In the Bay Area, 70–80-year-old homes often have dozens of issues. A quality AVID is your last line of defense: walking the home with you, photographing everything, covering walls and yards, and pressing the listing agent on open questions.

Pull up your latest offer and read the AVID. Detailed? Or "nothing noted," missing, or signed at the last minute? Take note.`
  },
  {
    slug: "rent-vs-buy", num: "07",
    title: "湾区租金一年涨 5%，然后呢", titleEn: "Bay Area rent is up 5% — now what",
    blurb: "租金持续上涨的背景下，什么时候、要不要从租转买。", blurbEn: "With rent climbing, when (and whether) to switch from renting to buying.",
    en: `I just renewed the lease with the tenant in my ADU — and it left me reflecting. Here's the rent data I dug up and what a year as a landlord taught me.

## How fast Bay Area rent is rising
Per the BLS, national housing inflation runs about 3%. But Santa Clara County rent rose 5.19% year-over-year and San Mateo 5.02% — the South Bay and Peninsula are climbing at about 1.5x the national rate.

## Why renting is so hot
More Bay Area workers are cautious about buying. Layoff headlines come every few weeks, green cards get harder, and buying is a 5-year commitment that demands stable status and cash flow. Demand stays strong, supply is limited, so rent keeps climbing.

## A vivid example
The apartment I rented before buying in 2021 went from $3,800/mo to $5,000 today — the past year's jump especially steep. Rent, long-term, trends up.

## Peace of mind over a few hundred dollars
Market rent was already 10%+ above what I charge, but I only nudged my good tenant's rent up a token amount — I didn't want to scare off someone easy to deal with. With a home, peace of mind beats squeezing out a few hundred more dollars.`
  }
];

function srcMd(num) {
  const f = readdirSync(SRC).find((n) => n.startsWith(num + "_"));
  return f ? readFileSync(resolve(SRC, f), "utf8") : "";
}

// Render the Chinese article (from Notion md): 【】 lines → h3, others → p.
function renderZh(md) {
  const out = []; let lead = false, skipTitle = false, disc = "";
  for (const raw of md.split("\n")) {
    let line = raw.replace(/\t/g, " ").trim();
    if (!line) continue;
    if (!skipTitle && line.startsWith("# ")) { skipTitle = true; continue; }
    if (line.startsWith("# ") || /^\[#/.test(line) || /^编辑于/.test(line) || /^!\[/.test(line)) continue;
    line = stripEmoji(line);
    if (!line) continue; // skip lines that were only emoji/decoration
    let t = esc(line).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    if (/【.+】/.test(line) && line.length < 42) out.push(`          <h3>${t}</h3>`);
    else if (/仅个人观点|非投资建议|示例估算|不构成|仅供说明/.test(line)) disc = t;
    else if (!lead) { out.push(`          <p class="lead">${t}</p>`); lead = true; }
    else out.push(`          <p>${t}</p>`);
  }
  if (disc) out.push(`          <p class="edu-disclaimer">${disc}</p>`);
  return out.join("\n");
}

// Render the English body: ## → h3, blank-line blocks → p (first → lead).
function renderEn(text) {
  const out = []; let lead = false;
  for (const block of text.trim().split(/\n\s*\n/)) {
    const b = block.trim(); if (!b) continue;
    if (b.startsWith("## ")) out.push(`          <h3>${esc(b.slice(3).trim())}</h3>`);
    else if (!lead) { out.push(`          <p class="lead">${esc(b)}</p>`); lead = true; }
    else out.push(`          <p>${esc(b)}</p>`);
  }
  return out.join("\n");
}

function videoBlock(a) {
  const mp4 = `assets/videos/${a.slug}.mp4`;
  if (existsSync(resolve(root, mp4))) {
    const poster = existsSync(resolve(root, `assets/videos/${a.slug}.jpg`)) ? `poster="../assets/videos/${a.slug}.jpg"` : "";
    return `      <div class="video-frame">
        <video controls preload="none" playsinline ${poster} title="${esc(a.title)}">
          <source src="../${mp4}" type="video/mp4" />
        </video>
      </div>
      <figcaption><span class="zh">「${esc(a.title)}」的中文视频讲解。</span><span class="en">Chinese video walkthrough of "${esc(a.titleEn)}".</span></figcaption>`;
  }
  return `      <div class="video-frame is-placeholder"><div class="poster-veil"></div>
        <div class="poster-inner"><span class="play-icon"><svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span><strong>视频讲解</strong><span class="badge-soon">即将上线 · coming soon</span></div>
      </div>`;
}

const bi = (zh, en) => `<span class="zh">${zh}</span><span class="en">${en}</span>`;

function header() {
  return `  <div class="page-shell">
    <header class="site-header" data-reveal>
      <a class="brand" href="../index.html" aria-label="Stephen Sun">
        <span class="wordmark">Stephen Sun<small>${bi("湾区 · 硅谷买房经纪", "Bay Area · Silicon Valley Realtor")}</small></span>
      </a>
      <nav class="nav" aria-label="导航">
        <a href="../index.html#about">${bi("关于", "About")}</a>
        <a href="../index.html#services">${bi("服务", "Services")}</a>
        <a href="../index.html#education">${bi("买房干货", "Guides")}</a>
        <a href="../index.html#contact">${bi("联系", "Contact")}</a>
      </nav>
      <div class="lang-toggle" role="group" aria-label="Language">
        <button type="button" data-lang="zh" class="active">中文</button>
        <button type="button" data-lang="en">EN</button>
      </div>
      <a class="header-cta" href="../index.html#contact">${bi("免费咨询", "Get in touch")} <span>→</span></a>
    </header>`;
}

function footer() {
  return `    <footer class="site-footer">
      <div class="footer-brand">
        <span class="wordmark foot"><b>Stephen Sun</b><small>${bi("湾区 · 硅谷买房经纪 · BQ Realty", "Bay Area · Silicon Valley Realtor · BQ Realty")}</small></span>
        <p>${bi("中英双语买家经纪，专精硅谷南湾。", "Bilingual buyer's agent, focused on the South Bay.")}</p>
      </div>
      <div class="footer-links">
        <div><h4>${bi("导航", "Explore")}</h4><a href="../index.html#about">${bi("关于", "About")}</a><a href="../index.html#education">${bi("买房干货", "Guides")}</a><a href="../index.html#contact">${bi("联系", "Contact")}</a></div>
        <div><h4>${bi("联系方式", "Contact")}</h4><a href="tel:+18325890116">832-589-0116</a><a href="tel:+14088005988">(408) 800-5988</a><span>1631 N 1st St, Ste 100<br>San Jose, CA</span></div>
        <div><h4>${bi("资质", "Credentials")}</h4><span>BQ Realty</span><span>DRE# 02230297</span><span>中文 / English</span></div>
      </div>
      <div class="footer-bottom"><span>© 2026 Stephen Sun · BQ Realty</span><span>DRE# 02230297 · ${bi("平等住房机会", "Equal Housing Opportunity")}</span></div>
    </footer>
  </div>
  <script src="../script.js"></script>`;
}

function moreNav(cur) {
  const cells = ARTICLES.map((a) => `        <a href="${a.slug}.html"${a.slug === cur ? ' class="current"' : ""}><span class="fn-num">${a.num}</span><span class="fn-title">${bi(esc(a.title), esc(a.titleEn))}</span></a>`).join("\n");
  return `    <section class="foundation-nav" data-reveal>
      <h4>${bi("更多买房干货", "More guides")}</h4>
      <div class="foundation-grid">
${cells}
      </div>
    </section>`;
}

function page(a, idx) {
  const mins = Math.max(2, Math.round(srcMd(a.num).length / 320));
  const heroImg = `../assets/img/card-0${idx + 1}.jpg`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(a.title)} · ${esc(a.titleEn)} — Stephen Sun</title>
  <meta name="description" content="${esc(a.blurb)} ${esc(a.blurbEn)}" />
  <meta property="og:title" content="${esc(a.title)} — Stephen Sun" />
  <meta property="og:type" content="article" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;600;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css" />
  <link rel="stylesheet" href="../education.css" />
</head>
<body data-lang="zh">
${header()}

    <main id="top" class="edu-main">
      <section class="edu-hero" data-reveal>
        <div class="edu-hero-bg"><img src="${heroImg}" alt="" fetchpriority="high" decoding="async" /></div>
        <div class="edu-hero-inner">
          <div class="breadcrumb">
            <a href="../index.html">${bi("首页", "Home")}</a><span class="sep">/</span>
            <a href="../index.html#education">${bi("买房干货", "Guides")}</a><span class="sep">/</span>
            <span>${bi("第 " + a.num + " 篇", "No. " + a.num)}</span>
          </div>
          <p class="eyebrow on-dark">${bi("买房干货 " + a.num, "Buyer's guide " + a.num)}</p>
          <h1>${bi(esc(a.title), esc(a.titleEn))}</h1>
          <div class="edu-meta">
            <span><b>${bi("视频", "Video")}</b> ${bi("中文讲解", "in Chinese")}</span>
            <span><b>${mins}</b> ${bi("分钟阅读", "min read")}</span>
            <span><b>${bi("免费", "Free")}</b> ${bi("一对一咨询", "consult")}</span>
          </div>
        </div>
      </section>

      <figure class="edu-video" data-reveal>
${videoBlock(a)}
      </figure>

      <section class="edu-section" data-reveal>
        <div class="edu-article zh">
${renderZh(srcMd(a.num))}
        </div>
        <div class="edu-article en">
${renderEn(a.en)}
        </div>
      </section>

      <section class="edu-cta" data-reveal>
        <p class="eyebrow" style="display:inline-block">${bi("免费 · 无压力", "Free · no pressure")}</p>
        <h2>${bi("想把这套打法用在你的 deal 上？", "Want this working on your own deal?")}</h2>
        <p>${bi("把你的预算、时间线和想买的区域告诉我，免费、无义务。中英双语都行。", "Tell me your budget, timeline and target areas — free, no obligation. In English or Chinese.")}</p>
        <a class="btn btn-primary" href="../index.html#contact">${bi("预约免费咨询", "Book a free consult")} <span>→</span></a>
      </section>

${moreNav(a.slug)}
    </main>

${footer()}
</body>
</html>
`;
}

mkdirSync(resolve(root, "education"), { recursive: true });
ARTICLES.forEach((a, i) => {
  writeFileSync(resolve(root, "education", `${a.slug}.html`), page(a, i), "utf8");
  console.log("wrote education/" + a.slug + ".html");
});
console.log(`\n${ARTICLES.length} bilingual 干货 pages generated.`);
