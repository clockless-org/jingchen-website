// Chinese video tutorials for Stephen Sun — one per 干货 article.
// Local clo-core-style pipeline: per-scene ElevenLabs (Coco Li + eleven_v3,
// measured for sync) → HyperFrames composition → local MP4 render → web-optimize.
//   ELEVENLABS_API_KEY=... node scripts/build-videos-zh.mjs [slug]
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, copyFileSync, renameSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HF = resolve(process.env.HOME, "clockless-org/clo-core/node_modules/.bin/hyperframes");
const EL_KEY = process.env.ELEVENLABS_API_KEY || "";
const EL_VOICE = process.env.ELEVENLABS_VOICE_ID || "Ca5bKgudqKJzq8YRFoAz"; // Coco Li, native Mandarin
const EL_MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_v3";
const ACCENT = "#1b4965", ACCENT2 = "#2d6ea3";
const GAP = 0.4, W = 1920, H = 1080;

// NOTE: every `say` string must stay byte-identical — the per-scene audio is
// cached by filename (p0.mp3…) and reused, so changing `say` would desync.
// `b` = on-screen fact/stat cards (the data being narrated), shown synced to it.
const VIDEOS = [
  {
    slug: "google-maps-vetting", title: "谷歌地图帮你买房排雷",
    hook: "周末别再傻跑 Open House 了。很多坑爹房源，用谷歌地图就能先排雷、直接 PASS，把宝贵的看房时间留给真正值得的房子。",
    points: [
      { head: "先看大环境硬伤", say: "第一步，打开卫星图看大环境。靠近高速主路的噪音尾气、紧邻 Mobile Home Park、背靠商铺餐馆、附近有墓地、或者高压塔——这些硬伤，卫星图上一眼就能排掉。",
        b: [{ t: "高速 / 主路：噪音 + 尾气" }, { t: "墓地 · 高压塔 · 商铺餐馆背靠" }, { t: "紧邻 Mobile Home Park" }] },
      { head: "再看地块本身", say: "第二步，看地块本身。房子正对马路的路冲反弓、和邻居脸贴脸的零间距、跟邻居不一样高的疑似加建、还有后院堆满杂物的垃圾屋邻居，都要小心。",
        b: [{ t: "路冲反弓 · 正对马路" }, { t: "零间距 · 和邻居脸贴脸" }, { t: "疑似加建 · 垃圾屋邻居" }] },
      { head: "拖出街景小黄人", say: "第三步，拖出街景里的小黄人，看看社区街道整不整洁、路边有没有停满破车房车、邻居前院打理得怎么样——这是社区维护和邻里素质最直观的体现。",
        b: [{ t: "街道是否整洁" }, { t: "路边破车 / 房车" }, { t: "邻居前院打理 = 邻里素质" }] },
      { head: "动手量距离", say: "最后一步，动手量距离。在谷歌地图上右键用 Measure distance，拉一条直线，离高速五百英尺以内的，真的要三思。",
        b: [{ s: "500 ft", t: "离高速这个距离内，要三思" }, { t: "右键 Measure distance 拉直线" }] }
    ],
    outroSay: "谷歌地图是买房的第一道筛选神器。别等开车跑过去才发现踩了坑，宝贵的周末别浪费。买房排雷的更多干货，找 Stephen。"
  },
  {
    slug: "buyer-commission", title: "硅谷买家佣金，谁来付？",
    hook: "NAR 新规之后，每个买家都要面对一个问题：买家经纪的佣金，到底谁来付？选错，可能让你多花四万。这笔账，要算清楚。",
    points: [
      { head: "现金 vs 贷款", say: "最重要的一条：现金还是贷款。卖家付，你首付更少、能多用贷款杠杆；买家付，房价做低，月供和地税更低，但你要当场多掏大约四万现金。",
        b: [{ s: "≈ $40k", t: "买家付：当场要多掏的现金" }, { t: "卖家付 → 首付更少 · 多用杠杆" }, { t: "买家付 → 房价做低 · 月供地税更低" }] },
      { head: "储备金 vs 估价", say: "再看风险。买家付，现金一下少四万，可能导致过户后储备金不足、贷款被拒；卖家付会把房价推高，可能估价不足、要拿现金补差价。现金少就卖家付，估价难就买家付。",
        b: [{ t: "现金少 → 让卖家付" }, { t: "估价难 → 自己付" }, { t: "买家付当心储备金不足、被拒贷" }] },
      { head: "卖家的算盘", say: "站在卖家角度，理性的卖家通常愿意付佣金，因为这降低了买家的现金门槛、吸引更多人竞价。但在圣何塞，如果价格刚好卡在豪宅税的边缘，卖家反而希望你来付。",
        b: [{ t: "理性卖家通常愿意付（吸引竞价）" }, { t: "圣何塞卡豪宅税线 → 卖家想你付" }] },
      { head: "怎么选", say: "一句话：首付紧张，争取卖家付、保住现金；想做低月供和税基，就选买家付、降低总价。具体怎么谈，让你的经纪和贷款经纪一起帮你算。",
        b: [{ t: "首付紧张 → 争取卖家付，保现金" }, { t: "想降月供 / 税基 → 买家付，降总价" }, { t: "经纪 + 贷款经纪一起帮你算" }] }
    ],
    outroSay: "佣金这笔钱，花得明明白白，才不会多花冤枉钱。买房路上更多算账干货，找 Stephen。"
  },
  {
    slug: "meta-buying-guide", title: "Meta 员工买房指南",
    hook: "接近年关，给 Meta 的小伙伴们一份 2026 的买房 roadmap，聊聊 metamates 买房最该想清楚的几件事。",
    points: [
      { head: "财务：Cliff 预警", say: "第一，财务。Meta 员工收入绝大部分来自 RSU，预算必须动态管理。2026 是收获低价 refresh 红利的最后一年，很多资深员工会面临 Cliff，现在的高收入大概率不可持续。打开 Schwab 算清未来几年的 vest，确保月供在舒适区。",
        b: [{ s: "2026", t: "低价 refresh 红利的最后一年" }, { t: "收入主要靠 RSU → 动态预算" }, { t: "Schwab 算清未来几年 vest" }] },
      { head: "风险：等靴子落地", say: "第二，风险。买房焦虑主要来自两个失控因素：裁员和房价。裁员在你控制之外，建议放平心态、等靴子落地再行动；湾区房价和科技股紧密联动，但不会垮，明年大概率小幅震荡、稳中有升。",
        b: [{ t: "裁员失控 → 放平心态，等靴子落地" }, { t: "房价随科技股震荡，但不会垮" }, { t: "明年大概率稳中有升" }] },
      { head: "现金：别让卖飞耽误买房", say: "第三，现金规划。最尴尬的是看中梦中情房，首付却卡在 RSU 里、还不在 trading window。怕卖飞，可以卖出后买入大盘或相关 ETF 对冲，记得考虑 wash sale。",
        b: [{ t: "首付别全卡在 RSU / trading window" }, { t: "卖出后买大盘 / 相关 ETF 对冲" }, { t: "记得考虑 wash sale" }] },
      { head: "预留 5 到 10 万", say: "别忘了，除了首付和过户费，软水器、充电桩、大件家具这些硬支出常被忽视。建议额外预留五到十万现金，别在搬进新家后捉襟见肘。",
        b: [{ s: "$50–100k", t: "首付 / 过户费之外，额外预留" }, { t: "软水器 · 充电桩 · 大件家具" }] }
    ],
    outroSay: "湾区房价不会垮，不用恐慌，只需掌握节奏、选一个财务安全的时间点入场。科技人买房的更多思路，找 Stephen。"
  },
  {
    slug: "townhouse-offers", title: "南湾 Townhouse 出价秘籍",
    hook: "湾区 Townhouse 市场被压了很久，但实际成交里依然有不少出乎意料的高价。Sunnyvale 这两个热门邮编的数据里，藏着非常明显的出价规律。",
    points: [
      { head: "盯住每平尺单价", say: "Townhouse 不像独立屋千房千面，标准化程度极高，所以最该盯的是每平尺单价。我分析了近年 Sunnyvale 十五年内的三房四房 Townhouse，单价分布非常集中。",
        b: [{ t: "标准化程度高 → 看 $/sqft" }, { t: "样本：Sunnyvale 15 年内 3–4 房" }, { t: "单价分布非常集中" }] },
      { head: "公允区间与警戒线", say: "公允价格区间大约在每平尺八百七到九百七。一旦单价超过一千零五十，相比市场均价，你可能就溢价了百分之十到二十，在现在的利率行情下很容易站岗。",
        b: [{ s: "$870–970", t: "每平尺公允区间" }, { s: "> $1,050", t: "溢价 10–20% 警戒线，容易站岗" }] },
      { head: "别买得比新房还贵", say: "最该警惕的是：现在 Sunnyvale 新房 Townhouse 的开盘单价都不超过一千了。如果花超过一千零五的单价去抢一个二手房，真要问问自己，为什么要付比新房还高的溢价。",
        b: [{ s: "< $1,000", t: "新房 Townhouse 开盘单价" }, { t: "二手付超 $1,050？先问问为什么" }] },
      { head: "看数据，守底线", say: "出价前严格对标周边的每平尺单价，保持冷静，不要被一时的竞价热度带着加价。除非有顶级学区或无敌路噪屏蔽这种极特殊加分项，否则单价过千就要慎重。",
        b: [{ t: "出价前对标周边 $/sqft" }, { t: "别被竞价热度带着加价" }, { t: "单价过千：需极特殊加分项" }] }
    ],
    outroSay: "买房，我最喜欢的就是用数据说话。让你在 Sunnyvale 买得明白、买得值。更多出价干货，找 Stephen。"
  },
  {
    slug: "avid-inspection", title: "别让糊弄的 AVID 毁了你的买房",
    hook: "想知道你的买房经纪是真心帮你避雷，还是只想赶紧结单拿钱？去翻翻你 offer 里的 AVID，就全明白了。",
    points: [
      { head: "AVID 是什么", say: "AVID 是经纪对房子的目视检查报告。除了卖家做的专业检查，经纪也必须用自己的眼睛，把屋里屋外、外墙车道院子，能看到的地方再替你扫一遍雷。如果交付后发现肉眼可见的重大缺陷而经纪只字未提，这就是失职，是你追责的铁证。",
        b: [{ t: "经纪的目视检查报告" }, { t: "屋里屋外 · 外墙 · 车道 · 院子" }, { t: "漏报肉眼可见缺陷 = 失职铁证" }] },
      { head: "糊弄差事的两种经纪", say: "对号入座一下。一种是先上车后补票：offer 里根本没有 AVID，快过户了才匆匆补一份让你签。另一种是无情的复读机：通篇没写什么问题，甚至直接抄卖方经纪的报告。这两种，都是纯纯的糊弄。",
        b: [{ t: "「先上车后补票」：临过户才补签" }, { t: "「无情复读机」：直接抄卖方报告" }] },
      { head: "为什么偷懒", say: "有的经纪怕写得太细把你吓跑、或者让你出价太低丢了单子；有的纯粹嫌现场查验费时间；还有不少经纪看房只看装修，根本不懂老房子的结构和排水。",
        b: [{ t: "怕写太细吓跑你 / 压低出价" }, { t: "嫌现场查验费时间" }, { t: "只看装修，不懂结构与排水" }] },
      { head: "高质量 AVID 长什么样", say: "在湾区动辄七八十年的房龄，一套房常能查出几十个问题。高质量的 AVID 就是你最后一道防线：现场边看边讲、拍照记录，外墙前后院全覆盖，有问题追着卖方经纪死磕到底。",
        b: [{ s: "70–80 年", t: "湾区常见房龄，常查出几十个问题" }, { t: "现场边看边讲 · 拍照记录" }, { t: "追着卖方经纪死磕到底" }] }
    ],
    outroSay: "现在就拿出你最近的 offer，找到 AVID 看看到底写了啥。把风险说在前头，你买得明白，我也做得心安。买房避雷，找 Stephen。"
  },
  {
    slug: "rent-vs-buy", title: "湾区租金一年涨 5%，然后呢",
    hook: "最近和我 ADU 的租客谈完续约，感慨万千。分享一下我查到的租金数据，和当房东这一年的思考。",
    points: [
      { head: "南湾租金涨得有多猛", say: "先看数据。根据劳工统计局的数字，全美住房通胀大约百分之三。而南湾的 Santa Clara County 租金同比涨了百分之五点一九，半岛的 San Mateo 涨了百分之五。南湾和半岛的租金涨幅，是全美住房通胀的一点五倍。",
        b: [{ s: "5.19%", t: "Santa Clara County 租金同比" }, { s: "5.02%", t: "San Mateo 租金同比" }, { s: "1.5×", t: "全美住房通胀（约 3%）的倍数" }] },
      { head: "为什么租房这么火", say: "越来越多湾区打工人对买房变得谨慎。裁员的新闻隔三差五、绿卡越来越难，而买房是五年起步的承诺，对身份稳定和现金流要求都很高。需求不松、供给有限，租金自然往上推。",
        b: [{ t: "裁员频繁 · 绿卡更难" }, { t: "买房 = 5 年起步的承诺" }, { t: "需求不松 + 供给有限 → 租金上行" }] },
      { head: "一个直观的例子", say: "举个例子，我二一年买房前住的那套公寓，当时月租三千八，现在已经涨到五千。过去一年的涨幅尤其惊人。租金这条线，长期是向上的。",
        b: [{ s: "$3,800 → $5,000", t: "我买房前那套公寓的月租" }, { t: "过去一年涨幅尤其惊人" }] },
      { head: "省心，比省钱重要", say: "回到我自己的续约。其实市场租金已经比现价高百分之十以上，但我只象征性涨了一点点，因为我不想吓跑这位省心的好租客。在房子这件事上，省心远比多赚几百块重要。",
        b: [{ s: "10%+", t: "市场租金已高于我的现价" }, { t: "只象征性涨一点，留住好租客" }, { t: "房子上：省心 > 多赚几百" }] }
    ],
    outroSay: "湾区租房和当房东都不容易。租金在涨，什么时候从租转买、怎么买得安心，欢迎找我聊聊。买房干货，找 Stephen。"
  }
];

function sh(cmd, args) { return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }); }

async function genAudio(text, outMp3) {
  // Reuse cached audio when present — lets us re-render frames (no API key,
  // same Coco Li voice) without re-synthesizing.
  if (existsSync(outMp3)) {
    return Math.max(0.5, parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", outMp3]).toString().trim()));
  }
  if (EL_KEY) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}?output_format=mp3_44100_128`, {
      method: "POST", headers: { "xi-api-key": EL_KEY, "content-type": "application/json" },
      body: JSON.stringify({ text, model_id: EL_MODEL, voice_settings: { stability: 0.4, similarity_boost: 0.8 } })
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 160)}`);
    writeFileSync(outMp3, Buffer.from(await res.arrayBuffer()));
  } else {
    const aiff = outMp3.replace(/\.mp3$/, ".aiff");
    sh("say", ["-v", "Tingting", "-o", aiff, text]); // Chinese fallback voice
    sh("ffmpeg", ["-y", "-i", aiff, "-ar", "44100", "-ac", "1", "-b:a", "128k", outMp3]);
    rmSync(aiff, { force: true });
  }
  return Math.max(0.5, parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", outMp3]).toString().trim()));
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function build(v) {
  const dir = resolve(root, ".video-build", v.slug);
  mkdirSync(resolve(dir, "audio"), { recursive: true }); // keep cached audio

  const plan = [
    { id: "title", say: v.hook },
    ...v.points.map((p, i) => ({ id: `p${i}`, say: p.say, p, n: i + 1 })),
    { id: "outro", say: v.outroSay }
  ];

  let t = 0;
  const audioTags = [];
  for (const p of plan) {
    const mp3 = resolve(dir, "audio", `${p.id}.mp3`);
    const d = await genAudio(p.say, mp3);
    p.start = t; p.dur = d;
    audioTags.push(`<audio src="audio/${p.id}.mp3" data-start="${t.toFixed(3)}" data-duration="${d.toFixed(3)}" data-track-index="9" data-volume="1"></audio>`);
    t += d + GAP;
    console.log(`  ${p.id}: ${d.toFixed(1)}s`);
  }
  const total = +(t - GAP + 0.5).toFixed(3);

  const scenes = [], tls = [];
  const wrap = (p, cls, inner) => `<section class="scene clip ${cls}" data-start="${p.start.toFixed(3)}" data-duration="${(p.dur + GAP).toFixed(3)}" data-track-index="1">${inner}</section>`;
  for (const p of plan) {
    if (p.id === "title") {
      const agenda = v.points.map((pp, i) => `<span class="ag-item anim"><b>${String(i + 1).padStart(2, "0")}</b> ${esc(pp.head)}</span>`).join("");
      scenes.push(wrap(p, "sc-title", `<div class="s-title">
        <p class="kicker anim">Stephen Sun · 买房干货</p>
        <h1 class="anim">${esc(v.title)}</h1>
        <p class="sub anim">${esc(v.hook)}</p>
        <div class="agenda">${agenda}</div>
      </div>`));
      tls.push(`tl.from(".sc-title .anim",{opacity:0,y:34,duration:0.65,stagger:0.1},${p.start.toFixed(3)});`);
    } else if (p.id.startsWith("p")) {
      const i = +p.id.slice(1);
      const facts = p.p.b.map((f) => f.s
        ? `<div class="fact stat"><div class="fstat">${esc(f.s)}</div><div class="flabel">${esc(f.t)}</div></div>`
        : `<div class="fact"><span class="fdot"></span><div class="ftext">${esc(f.t)}</div></div>`).join("");
      scenes.push(wrap(p, `sc-pt pt-${i}`, `<div class="s-point">
        <div class="pt-left">
          <div class="pt-num anim">${String(p.n).padStart(2, "0")}</div>
          <p class="kicker anim">要点 ${p.n} / ${v.points.length}</p>
          <h2 class="anim">${esc(p.p.head)}</h2>
          <div class="bar"><i></i></div>
        </div>
        <div class="pt-facts">${facts}</div>
      </div>`));
      tls.push(`tl.from(".pt-${i} .pt-left .anim",{opacity:0,y:28,duration:0.6,stagger:0.11},${p.start.toFixed(3)});`);
      tls.push(`tl.from(".pt-${i} .pt-facts .fact",{opacity:0,y:24,duration:0.55,stagger:0.42,ease:"power2.out"},${(p.start + 0.5).toFixed(3)});`);
      tls.push(`tl.fromTo(".pt-${i} .bar i",{scaleX:0},{scaleX:1,duration:0.9,ease:"power2.out"},${(p.start + 0.4).toFixed(3)});`);
    } else {
      scenes.push(wrap(p, "sc-outro", `<div class="s-outro">
        <h2 class="anim">买房不踩坑，<br/>找 Stephen Sun</h2>
        <p class="sub anim">湾区 · 硅谷买家经纪 · 中英双语 · BQ Realty</p>
        <p class="phone anim">832-589-0116</p>
      </div>`));
      tls.push(`tl.from(".sc-outro .anim",{opacity:0,y:30,duration:0.7,stagger:0.16},${p.start.toFixed(3)});`);
    }
  }

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=Noto+Serif+SC:wght@600;700;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1920px; height:1080px; overflow:hidden; }
  #root { position:relative; width:1920px; height:1080px; font-family:"Noto Sans SC","PingFang SC",sans-serif; color:#15201b; }
  .bg { position:absolute; inset:0; background:
      radial-gradient(circle at 14% 12%, rgba(45,110,163,.16), transparent 38rem),
      radial-gradient(circle at 86% 90%, rgba(17,33,46,.10), transparent 40rem),
      #f7f8f5; }
  .bg::after { content:""; position:absolute; inset:0;
      background-image:linear-gradient(rgba(21,32,27,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(21,32,27,.03) 1px,transparent 1px);
      background-size:96px 96px; -webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent 78%); }
  .scene { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:150px 180px; }
  .kicker { color:${ACCENT}; font-size:32px; font-weight:700; letter-spacing:1px; margin-bottom:30px; }
  h1 { font-size:118px; line-height:1.12; letter-spacing:-2px; font-weight:900; margin-bottom:34px; }
  h2 { font-size:90px; line-height:1.12; letter-spacing:-1px; font-weight:900; }
  .sub { font-size:40px; color:#51606b; font-weight:500; line-height:1.5; max-width:1300px; }
  .s-title { text-align:center; max-width:1500px; }
  .s-title h1 { font-family:"Noto Serif SC",serif; }
  .s-title .sub { margin:0 auto; }
  .agenda { display:flex; flex-wrap:wrap; gap:18px; justify-content:center; margin-top:56px; }
  .ag-item { font-size:27px; font-weight:600; color:#51606b; background:#fff; border:1px solid rgba(21,32,27,.1);
      border-radius:9999px; padding:14px 26px; box-shadow:0 10px 28px -20px rgba(21,32,27,.4); }
  .ag-item b { color:${ACCENT}; font-family:"Noto Serif SC",serif; font-weight:900; margin-right:10px; }
  .s-point { display:flex; align-items:center; gap:84px; width:100%; max-width:1560px; }
  .pt-left { flex:0 0 560px; }
  .pt-num { font-family:"Noto Serif SC",serif; font-size:188px; font-weight:900; line-height:.78; color:${ACCENT}; margin-bottom:18px; }
  .pt-left .kicker { margin-bottom:18px; }
  .pt-left h2 { font-size:74px; line-height:1.14; margin-bottom:30px; }
  .pt-facts { flex:1; display:flex; flex-direction:column; gap:22px; }
  .fact { display:flex; align-items:center; gap:24px; padding:30px 34px; background:#fff;
      border:1px solid rgba(21,32,27,.08); border-left:5px solid ${ACCENT}; border-radius:18px;
      box-shadow:0 18px 44px -26px rgba(21,32,27,.45); }
  .fact .fdot { flex:0 0 auto; width:15px; height:15px; border-radius:50%; background:${ACCENT}; box-shadow:0 0 0 6px rgba(27,73,101,.12); }
  .fact .ftext { font-size:33px; font-weight:600; color:#33424d; line-height:1.36; }
  .fact.stat { flex-direction:column; align-items:flex-start; gap:8px; padding:26px 34px; }
  .fact.stat .fstat { font-family:"Noto Serif SC",serif; font-size:62px; font-weight:900; line-height:1; color:${ACCENT}; letter-spacing:-1px; }
  .fact.stat .flabel { font-size:29px; font-weight:600; color:#51606b; line-height:1.3; }
  .bar { width:280px; height:12px; border-radius:9999px; background:rgba(21,32,27,.1); overflow:hidden; }
  .bar i { display:block; width:100%; height:100%; border-radius:9999px; background:${ACCENT}; transform-origin:left center; }
  .s-outro { text-align:center; max-width:1500px; }
  .s-outro h2 { font-family:"Noto Serif SC",serif; margin-bottom:40px; }
  .s-outro .sub { margin:0 auto 36px; }
  .phone { font-size:52px; font-weight:900; color:${ACCENT}; letter-spacing:1px; }
  .wm { position:absolute; right:70px; bottom:60px; font-size:30px; font-weight:700; color:${ACCENT}; opacity:.6; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
  <div class="bg clip" data-start="0" data-duration="${total}" data-track-index="0"></div>
  ${audioTags.join("\n  ")}
  ${scenes.join("\n  ")}
  <div class="wm clip" data-start="0" data-duration="${total}" data-track-index="5">Stephen Sun · 湾区房产</div>
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  ${tls.join("\n  ")}
  window.__timelines["main"] = tl;
</script>
</body>
</html>
`;
  writeFileSync(resolve(dir, "index.html"), html, "utf8");
  console.log(`  total ${total}s (${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, "0")}) [voice=${EL_KEY ? EL_MODEL : "say"}] — rendering...`);

  const outDir = resolve(root, "assets", "videos");
  mkdirSync(outDir, { recursive: true });
  const out = resolve(outDir, `${v.slug}.mp4`);
  execFileSync(HF, ["render", dir, "-o", out, "--fps", "30", "--quality", "standard", "--quiet"], { stdio: "inherit" });
  const raw = out.replace(/\.mp4$/, ".raw.mp4");
  renameSync(out, raw);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-c:v", "libx264", "-crf", "25", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out], { stdio: "inherit" });
  rmSync(raw, { force: true });
  // poster from the title card (~2.5s in)
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "2.5", "-i", out, "-frames:v", "1", "-q:v", "3", resolve(outDir, `${v.slug}.jpg`)], { stdio: "inherit" });
  console.log(`  wrote ${out}`);
}

const only = process.argv[2];
const targets = only ? VIDEOS.filter((v) => v.slug === only) : VIDEOS;
for (const v of targets) { console.log(`\n=== ${v.title} ===`); await build(v); }
console.log("\nDone.");
