// Generates a ~3-minute, Mind-Peace-branded explainer video per foundation,
// in the spirit of the clo-core flow: per-scene voiceover (measured for sync)
// + a HyperFrames composition + a local MP4 render.
//
//   node scripts/build-videos.mjs [slug]
//
// Voiceover: ElevenLabs when ELEVENLABS_API_KEY is set (voice/model match
// clo-core), otherwise macOS `say` (Samantha) as a local fallback.
// Requires: ffmpeg/ffprobe + the hyperframes CLI (from the clo-core checkout).
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, copyFileSync, existsSync, renameSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HF = resolve(process.env.HOME, "clockless-org/clo-core/node_modules/.bin/hyperframes");
const EL_KEY = process.env.ELEVENLABS_API_KEY || "";
const EL_VOICE = process.env.ELEVENLABS_VOICE_ID || "XrExE9yKIg1WjnnlVkGX";
const EL_MODEL = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const RATE = 150;
const GAP = 0.4;
const W = 1920, H = 1080;

const VIDEOS = [
  {
    slug: "increase-cash-flow", num: "01", title: "Increase Cash Flow", accent: "#ba7a2a", image: "cash-flow.jpg",
    subhead: "See where your money goes — and free up margin for what matters.",
    showcaseLine: "Most money stress isn't a math problem. It's a visibility problem.",
    viz: ["bars", "stack", "gauge", "coins", "donut", "curve"],
    example: { head: "Found money, automated", line: "Small leaks, redirected, become real savings.", viz: "bars",
      say: "Let's make this concrete. Imagine you track your spending for one month and discover two hundred and fifty dollars going to subscriptions and impulse buys you had completely forgotten about. Redirect even half of that automatically into savings, and you have built a real monthly margin — without earning a single extra dollar." },
    hook: "Welcome to the first money foundation from Mind Peace Financial: increasing your cash flow. Let's walk through it together.",
    lede: "Cash flow is the foundation everything else is built on. Before you can pay down debt, protect your family, or invest for the future, you need a reliable gap between what comes in and what goes out — and a plan for that gap. Here is the key insight: most financial stress is not a math problem. It is a visibility problem. When money moves in and out without a plan, it is almost impossible to feel in control, even on a good income.",
    concepts: [
      { head: "Plan around take-home pay", line: "Budget the money that actually lands in your account.", say: "First, plan around your take-home pay. That's the money that actually lands in your account after taxes and deductions, not your gross salary. Your gross number looks bigger, but your take-home pay is what your family really lives on, so that is the number your plan should be built around." },
      { head: "Separate fixed from flexible", line: "Your margin lives in the spending you can flex.", say: "Second, separate the bills that stay the same, like rent and insurance, from the spending you can flex, like dining out and shopping. This matters because your margin — the money you can redirect toward your goals — almost always lives in that flexible column. That's where small, intentional changes add up." },
      { head: "Build a positive margin", line: "Income minus expenses, on purpose.", say: "Third, aim for a positive, intentional margin every single month. Margin is simply your income minus your expenses. A healthy, deliberate margin is what funds every other foundation, from your emergency savings to your retirement. Without it, even a high income can leave you feeling stuck." },
      { head: "Pay yourself first", line: "Move savings out on payday, automatically.", say: "And fourth, pay yourself first. Move your savings out automatically on payday, before any discretionary spending. When you save first, saving becomes automatic and reliable, instead of being whatever happens to be left over at the end of the month, which is usually very little." },
      { head: "Give every dollar a job", line: "A zero-based plan beats a vague one.", say: "Fifth, give every dollar a job. Before the month begins, assign all of your expected income — to bills, to savings, to goals — until nothing is left unplanned. A plan where every single dollar is accounted for beats a vague intention every time." },
      { head: "Review and adjust", line: "A budget is a living document.", say: "And sixth, treat your plan as a living document. Spend twenty minutes at the end of each month comparing what you planned against what actually happened, and adjust. Those small, regular corrections are what keep a budget alive instead of abandoned by week two." }
    ],
    mistakes: ["Budgeting from memory", "Ignoring small recurring charges", "No buffer for irregular bills"],
    mistakesSay: "Watch out for a few common mistakes. Budgeting from memory almost always undercounts your spending, so track real numbers first. Ignoring small recurring charges, like subscriptions and fees, lets them quietly add up. And forgetting to set aside money for irregular bills, the ones that come once a quarter or once a year, can wreck an otherwise solid plan.",
    stepsSay: "So here is how you put this into practice. Track thirty days of your real spending. Separate your needs from your wants. Write a simple monthly plan that gives every dollar a job before the month begins. Automate your savings first. And review the whole thing once a month, making small corrections as you go.",
    steps: ["Track 30 days of spending", "Separate needs from wants", "Write a simple monthly plan", "Automate savings first", "Review once a month"],
    outroSay: "Remember, improving your cash flow is not about cutting everything you enjoy. It is about seeing your money clearly, and deciding on purpose where it should go. To get hands-on help building your plan, join one of our free Mind Peace Financial workshops. There is no cost, and no obligation."
  },
  {
    slug: "debt-management", num: "02", title: "Debt Management", accent: "#275c93", image: "debt-management.jpg",
    subhead: "Trade reactive minimum payments for a deliberate payoff plan.",
    showcaseLine: "Debt without a plan quietly drains everything you work to build.",
    viz: ["bars", "curve", "stack", "gauge", "shield", "coins"],
    example: { head: "Order matters", line: "Attack the highest rate first.", viz: "bars",
      say: "Here's how ordering pays off. Picture two credit cards — one charging twenty-four percent interest, the other twelve. The avalanche method says attack the twenty-four percent card first. Every extra dollar sent there beats paying down the cheaper debt, and over time that one decision alone can save you hundreds of dollars in interest." },
    hook: "This is the second money foundation from Mind Peace Financial: managing your debt with a clear, deliberate strategy.",
    lede: "Debt is not automatically bad. But debt without a plan quietly drains the margin you worked so hard to create. A clear strategy turns a vague, constant worry into a finish line you can actually see. When debt feels overwhelming, the instinct is to make minimum payments and just hope it improves. The goal of this foundation is the opposite: to help you stop reacting, and start deciding.",
    concepts: [
      { head: "Know good from high-cost", line: "Low-rate debt is different from high-interest debt.", say: "First, separate low-rate, purposeful debt from high-interest balances that compound against you. A reasonable, low-rate loan is a very different problem from a high-interest credit card. They are not the same, and they do not deserve the same urgency, so treat them differently." },
      { head: "Escape the minimum trap", line: "Minimums are designed to keep you paying interest.", say: "Second, understand the minimum-payment trap. Minimum payments mostly cover interest, and they are designed to keep a balance stretched out for years. If you only ever pay the minimum, you can stay in debt for a very long time and pay far more than you borrowed." },
      { head: "Avalanche or snowball", line: "Highest rate first, or smallest balance first.", say: "Third, choose a payoff method. The avalanche method targets your highest interest rate first, which saves you the most money. The snowball method targets your smallest balance first, which gives you quick wins and momentum. Both work. The best method is simply the one you will actually stick with." },
      { head: "Mind your utilization", line: "Lower balances generally help your credit.", say: "Fourth, watch your credit utilization. Carrying high balances relative to your credit limits can weigh on your credit score. So as you bring those balances down, you are usually helping yourself in more than one way at the same time." },
      { head: "Build a buffer first", line: "A small fund stops debt going in circles.", say: "Fifth, build a small starter emergency fund before throwing everything at your debt. Without one, the next surprise expense lands right back on a credit card and undoes your progress. A small buffer keeps your payoff plan from going in circles." },
      { head: "Automate your payments", line: "Never miss a minimum; attack one target by hand.", say: "And sixth, automate your payments. Set at least the minimum on every account to pay automatically, which protects you from late fees and credit damage, while you deliberately send every extra dollar to your one target debt." }
    ],
    mistakes: ["Paying only the minimum", "Closing cards on impulse", "Consolidating without changing habits"],
    mistakesSay: "Avoid these common mistakes. Paying only the minimum feels safe, but it maximizes both your interest and your time in debt. Closing credit cards on impulse can actually raise your utilization and shorten your credit history. And consolidating your debt into a new loan only helps if the spending that created the debt also changes.",
    stepsSay: "Here is the plan. List every debt with its balance and interest rate in one place. Stop adding new high-interest debt. Pick one payoff method, and send every extra dollar to a single target. Ask about lower rates through negotiation or refinancing. And track each balance as it disappears, because visible progress is what keeps you going.",
    steps: ["List every debt", "Stop adding high-interest debt", "Pick one payoff method", "Ask about lower rates", "Track each payoff"],
    outroSay: "A good debt plan is simple. Know exactly what you owe, stop the bleeding, and attack your balances in a deliberate order while protecting your essentials. Our free Mind Peace Financial workshops can help you build yours, step by step. There is no cost, and no obligation."
  },
  {
    slug: "strong-foundation", num: "03", title: "Strong Foundation", accent: "#2f8d68", image: "foundation.jpg",
    subhead: "The stable base every financial decision rests on.",
    showcaseLine: "A strong foundation keeps one bad month from becoming a crisis.",
    viz: ["gauge", "stack", "shield", "curve", "bars", "coins"],
    example: { head: "Same event, different outcome", line: "A buffer turns a crisis into an inconvenience.", viz: "gauge",
      say: "Let's see it in action. Imagine your car needs a nine hundred dollar repair. With no emergency fund, that becomes a new credit card balance and months of interest. With even a small fund already in place, it's a minor inconvenience you have forgotten by next week. Same event — completely different outcome." },
    hook: "The third money foundation from Mind Peace Financial is building a strong financial foundation for your family.",
    lede: "A strong foundation is what keeps one bad month from becoming a financial crisis. It is the quiet infrastructure — savings, the right accounts, named beneficiaries, and written goals — that makes everything else possible. And here is the encouraging part: this foundation does not require a large income. It requires intention. A few decisions made once, and then maintained, so progress can compound instead of restarting after every setback.",
    concepts: [
      { head: "An emergency fund", line: "Cash for the unexpected keeps surprises from becoming debt.", say: "It starts with an emergency fund. This is cash set aside specifically for the unexpected, and it keeps a surprise expense from turning into brand new debt. It is your family's first line of defense, and it is the reason a flat tire or a medical bill stays a small problem instead of a big one." },
      { head: "The right accounts", line: "Separate spending, saving, and goals.", say: "Next, set up the right accounts. When you separate your spending money, your savings, and your specific goal money into different places, it becomes far easier to see real progress and to avoid accidentally overspending. Each dollar gets a clear home." },
      { head: "Beneficiaries & documents", line: "Protect your family from confusion.", say: "Then, name your beneficiaries and put your basic documents in place. This is one of the most overlooked steps, and one of the most important. It protects your family from confusion and difficult decisions during moments that are already painful enough." },
      { head: "Written family goals", line: "Goals you can see turn money into a tool.", say: "Fourth, write down your family goals. Short term, medium term, and long term goals that you can actually see turn money from a constant source of stress into a tool with a clear and motivating purpose." },
      { head: "Grow the buffer over time", line: "From a few hundred to a few months.", say: "Fifth, keep growing your buffer. Start with a few hundred dollars, then build toward one month, and eventually several months of essential expenses. Each milestone makes your family meaningfully harder to knock off course." },
      { head: "Automate the habit", line: "Build it in the background, every payday.", say: "And sixth, automate the habit. A small automatic transfer into savings on every payday quietly builds your foundation in the background, without ever relying on willpower or a good memory." }
    ],
    mistakes: ["No emergency fund", "Outdated beneficiaries", "Mixing every goal in one account"],
    mistakesSay: "Be careful to avoid these mistakes. Having no emergency fund means every surprise becomes new debt, so build even a small buffer first. Outdated beneficiaries can send your money to the wrong person, so review them after every major life change. And mixing every goal into one account makes your progress invisible and far too easy to spend.",
    stepsSay: "To build your foundation: start a small starter emergency fund, and grow it over time toward several months of expenses. Set up separate accounts so each dollar has a job. Name and update every beneficiary. Get your basic documents in place. And write down your one, five, and ten-year goals.",
    steps: ["Build a starter emergency fund", "Set up the right accounts", "Name & update beneficiaries", "Get basic documents in place", "Write 1, 5 & 10-year goals"],
    outroSay: "Families who feel secure are rarely the ones earning the most. They are the ones who took the time to build a foundation. Our free Mind Peace Financial workshops will walk you through every piece, with no cost and no obligation."
  },
  {
    slug: "proper-protection", num: "04", title: "Proper Protection", accent: "#a03b00", image: "protection.jpg",
    subhead: "Cover the risks that could derail your family — before a crisis.",
    showcaseLine: "One uncovered event can erase years of saving in weeks.",
    viz: ["shield", "shield", "donut", "gauge", "stack", "curve"],
    example: { head: "The honest question", line: "How many months could your family cover?", viz: "shield",
      say: "Ask yourself this. Consider a family relying on a single income. If that income disappeared tomorrow, how many months could they still cover rent, food, and the bills? For most families, the honest answer is uncomfortably few — and closing exactly that gap is what income protection is designed to do." },
    hook: "The fourth money foundation from Mind Peace Financial is proper protection for the things that matter most.",
    lede: "Protection is the foundation that people tend to skip, until it is too late. It is natural to focus on growing your money and to put off protecting it. But a single uncovered event — a lost income, a serious illness, an accident — can erase years of careful saving in just a few weeks. The goal here is simple: identify the risks that could undo your progress, and make sure your family is covered before you ever need it.",
    concepts: [
      { head: "Protect income first", line: "Your ability to earn is your largest asset.", say: "First, protect your income before you chase returns. For most families, your ability to earn is your single largest asset by far. It is bigger than your home and bigger than your savings, so protecting that income comes first, before anything else." },
      { head: "Income protection", line: "Keep a tragedy from becoming a collapse.", say: "Second, understand income protection. Coverage that replaces a family's income, for the people who earn it, is what keeps a tragedy from also becoming a complete financial collapse for everyone left behind. It is one of the kindest things you can put in place." },
      { head: "Health & liability", line: "Among the most common causes of hardship.", say: "Third, know your health and liability risks. Medical costs and liability claims are among the most common causes of financial hardship anywhere, so it is worth understanding exactly how yours are covered today, and where the gaps might be." },
      { head: "Match coverage to need", line: "Start from your situation, not a sales pitch.", say: "Fourth, match your coverage to your actual need. The right amount and the right type of coverage depend on your specific situation, not on a sales pitch. Always start from your real need, and never buy a policy you cannot explain in plain language." },
      { head: "Review what you have", line: "You can't fill a gap you haven't found.", say: "Fifth, before buying anything, review the coverage you already have, through your employer and elsewhere. Many families find they have plenty in some areas and dangerous gaps in others. You simply cannot fill a gap you have not found." },
      { head: "Re-check after life changes", line: "Coverage set once is often wrong in a few years.", say: "And sixth, revisit your protection after every major life change — a marriage, a new child, a home, a new job. Coverage that is set once and then forgotten is often wrong within just a few years." }
    ],
    mistakes: ["Insuring things, not income", "Guessing the coverage amount", "Buying what you can't explain"],
    mistakesSay: "Steer clear of these mistakes. Many people carefully insure their car and their phone, but leave their largest asset, their future income, completely unprotected. Others simply guess at their coverage amount, ending up with too little or paying for too much. And never commit to a policy you cannot explain back in simple words.",
    stepsSay: "Here is how to approach it. Inventory the risks that would hurt your family the most. Estimate how much income your family would need, and for how long. Review the coverage you already have, through work and elsewhere. Fill the meaningful gaps deliberately. And re-check everything after every major life change.",
    steps: ["Inventory your risks", "Estimate income-replacement need", "Review existing coverage", "Fill the real gaps", "Re-check after life changes"],
    outroSay: "Here is something important: Mind Peace Financial does not sell products. We simply teach you how protection works, in plain language, so that you can make your own informed decisions with confidence. Join one of our free workshops to learn more. There is no cost, and no obligation."
  },
  {
    slug: "retirement-strategies", num: "05", title: "Retirement Strategies", accent: "#7a4ea0", image: "retirement.jpg",
    subhead: "Turn vague hopes into concrete numbers and next steps.",
    showcaseLine: "Time is your most powerful tool. Starting early beats starting big.",
    viz: ["curve", "coins", "bars", "gauge", "stack", "shield"],
    example: { head: "Why early beats big", line: "Decades of compounding outrun bigger late contributions.", viz: "curve",
      say: "Here is the power of starting early. Someone who invests a modest amount in their twenties can end up with more than someone who invests far more, but only starts in their forties. The difference is not the amount of money — it is the extra decades of compounding doing the heavy lifting." },
    hook: "The fifth money foundation from Mind Peace Financial is building a real retirement strategy.",
    lede: "Retirement can feel too far away to plan for, which is exactly why so many families arrive unprepared. Most people don't avoid retirement planning because they don't care. They avoid it because it feels abstract and overwhelming. But here is the good news: time is the most powerful tool you have, and starting early beats starting big, every single time. The fix is to make it concrete.",
    concepts: [
      { head: "Time & compounding", line: "Returns earn more returns, for decades.", say: "The first idea is time and compounding. Invested money earns returns, and then those returns earn returns of their own. Over many years, that compounding effect can grow to outweigh the actual size of your contributions. This is why money invested early can grow so much more than money invested later." },
      { head: "Tax-advantaged accounts", line: "Designed to reward long-term saving.", say: "Second, use tax-advantaged retirement accounts. These accounts offer specific tax benefits that are designed to reward long-term saving. Using them is often the single most efficient path you have toward a comfortable retirement, so take full advantage of what is available to you." },
      { head: "The employer match", line: "Unclaimed match is pay left behind.", say: "Third, capture your full employer match. When an employer matches your contributions, that is essentially free money added to your future. Contributing at least enough to receive the entire match is the easiest return you will ever find, and leaving it unclaimed is simply leaving your own pay behind." },
      { head: "Your retirement number", line: "A target turns worry into a plan.", say: "Fourth, estimate your retirement number. A rough estimate of how much you will need turns a vague, nagging worry into a concrete target that you can actually plan toward, and then work backward from with confidence." },
      { head: "Automate and escalate", line: "Raise it 1% a year — you'll barely feel it.", say: "Fifth, make your contributions automatic, then escalate them slowly. Increasing how much you save by just one percent each year is something you will barely notice, but over a full career, that small habit compounds into a dramatically larger nest egg." },
      { head: "Don't cash out early", line: "Roll it over when you change jobs.", say: "And sixth, protect what you've built. When you change jobs, roll your retirement savings over instead of cashing them out. An early withdrawal can trigger taxes, penalties, and the loss of years of future compounding growth." }
    ],
    mistakes: ["Waiting to start", "Leaving the match on the table", "Cashing out when changing jobs"],
    mistakesSay: "Avoid these costly mistakes. Waiting to start is the big one, because every year of delay costs you compounding that you can never get back. Not contributing enough to get your full employer match is turning down free money. And cashing out your retirement savings when you change jobs can trigger taxes, penalties, and lost growth.",
    stepsSay: "So here are your next steps. Estimate your retirement number. Contribute at least enough to capture the full employer match. Automate your contributions so they never depend on willpower. Choose the tax treatment that fits your situation. And increase your contribution by just one percent each year, which you will barely notice.",
    steps: ["Estimate your number", "Capture the full match", "Automate contributions", "Choose your tax treatment", "Increase 1% a year"],
    outroSay: "And if you are starting late, do not be discouraged. Contributing consistently and capturing your match still makes a real and meaningful difference. The best time to start is right now. Our free Mind Peace Financial workshops can show you exactly how, with no cost and no obligation."
  },
  {
    slug: "wealth-preservation", num: "06", title: "Wealth Preservation", accent: "#8a6d3b", image: "wealth.jpg",
    subhead: "Protect the progress you've built — and pass it on.",
    showcaseLine: "Building wealth and keeping wealth are two different skills.",
    viz: ["shield", "donut", "bars", "stack", "gauge", "coins"],
    example: { head: "Don't bet it all on one", line: "Spreading out means no single event can undo you.", viz: "donut",
      say: "Picture this. Years of growth, all sitting in a single company's stock. One bad quarter, and a large part of your progress can vanish overnight. Spreading that same money across many different holdings means no single event can undo what you have spent years building. That is preservation in action." },
    hook: "The sixth money foundation from Mind Peace Financial is wealth preservation: keeping what you have worked so hard to build.",
    lede: "Building wealth and keeping wealth are two very different skills. Many families focus entirely on growing their money, and never plan for protecting it. But progress can erode quietly, through over-concentration, unmanaged taxes, high fees, or simply the absence of a clear plan. Preservation is the discipline of protecting hard-won progress from those avoidable risks, so that it lasts, and so it can be passed on to the next generation.",
    concepts: [
      { head: "Protect before you grow", line: "Avoiding a large loss beats a slightly higher return.", say: "The first principle is to protect before you grow. Over time, reducing the risk of a large, permanent loss matters far more than chasing a slightly higher return. A single major setback can undo years of careful progress, so guarding against it comes first." },
      { head: "Diversification", line: "Concentration is the quiet enemy.", say: "Second, understand diversification. Spreading your assets across different investments reduces the damage that any single bad outcome can do to you. Over-concentration, having too much riding on one stock or one asset, is the quiet enemy of preservation." },
      { head: "Taxes & fees", line: "Large, controllable drags on wealth.", say: "Third, stay aware of taxes and fees. These are some of the largest, and most controllable, drags on your long-term wealth. Small percentages may not feel like much, but over decades they compound into very large amounts. Awareness alone helps you keep more of what you earn." },
      { head: "Estate & legacy", line: "Pass it on the way you intend.", say: "Fourth, plan your estate and legacy. A clear plan ensures that what you have built passes on exactly the way you intend, with far less cost, less delay, and less confusion for the family you leave it to." },
      { head: "Know your full picture", line: "You can't protect what you haven't measured.", say: "Fifth, start with a clear picture of your net worth — everything you own, minus everything you owe, written down in one place. You cannot protect, or sensibly grow, what you have never actually measured." },
      { head: "Rebalance with discipline", line: "Trim winners back to your target mix.", say: "And sixth, rebalance with discipline. Over time, your winners grow to dominate your portfolio and quietly increase your risk. Periodically trimming back to your target mix is how disciplined families lock in progress instead of giving it back." }
    ],
    mistakes: ["No clear net-worth picture", "Over-concentration", "Ignoring taxes & fees"],
    mistakesSay: "Avoid these mistakes. Without a clear picture of your net worth, it is impossible to protect what you have, so start by measuring it. Over-concentration turns one bad event into a major setback, so diversify. And ignoring taxes and fees lets small percentages quietly compound into large losses over the years.",
    stepsSay: "To preserve what you have built: document your net worth in one place. Reduce concentration risk through diversification. Plan ahead for taxes and fees. Keep your estate documents current. And educate the next generation, because financial literacy is the part of a legacy that keeps on compounding long after you are gone.",
    steps: ["Document your net worth", "Reduce concentration risk", "Plan for taxes & fees", "Update estate documents", "Educate the next generation"],
    outroSay: "And remember, wealth preservation is not only for the wealthy. It is the discipline of seeing clearly, reducing risk, and planning ahead, and it scales from your first emergency fund to a larger estate. Join a free Mind Peace Financial workshop to build your plan, with no cost and no obligation."
  }
];

function sh(cmd, args) { return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }); }

// Cache TTS by (provider+voice+model+text) so tweaking one topic only
// regenerates its changed scenes — unchanged scenes are copied from cache.
const CACHE = resolve(root, ".video-build", ".audio-cache");
async function genAudio(text, outMp3) {
  const provider = EL_KEY ? `el:${EL_VOICE}:${EL_MODEL}` : `say:${RATE}`;
  const key = createHash("sha1").update(`${provider}|${text}`).digest("hex");
  const cached = resolve(CACHE, `${key}.mp3`);
  if (existsSync(cached)) {
    copyFileSync(cached, outMp3);
    const d = parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", outMp3]).toString().trim());
    return Math.max(0.5, d);
  }
  if (EL_KEY) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": EL_KEY, "content-type": "application/json" },
      body: JSON.stringify({ text, model_id: EL_MODEL, voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true } })
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 200)}`);
    writeFileSync(outMp3, Buffer.from(await res.arrayBuffer()));
  } else {
    const aiff = outMp3.replace(/\.mp3$/, ".aiff");
    sh("say", ["-v", "Samantha", "-r", String(RATE), "-o", aiff, text]);
    sh("ffmpeg", ["-y", "-i", aiff, "-ar", "44100", "-ac", "1", "-b:a", "128k", outMp3]);
    rmSync(aiff, { force: true });
  }
  mkdirSync(CACHE, { recursive: true });
  copyFileSync(outMp3, cached);
  const dur = parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", outMp3]).toString().trim());
  return Math.max(0.5, dur);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// --- Animated visual library (safe GSAP props only: scale/scaleX/scaleY/opacity/y/rotation) ---
// Each returns { html, anim(sel,start) } where anim builds GSAP lines for that scene.
function viz(type, a) {
  const A = a;
  switch (type) {
    case "bars": return {
      html: `<svg class="vz vz-bars" viewBox="0 0 360 300"><g>
        <rect class="vb" x="20"  y="120" width="60" height="170" rx="8" style="fill:${A};opacity:.35"></rect>
        <rect class="vb" x="105" y="70"  width="60" height="220" rx="8" style="fill:${A};opacity:.55"></rect>
        <rect class="vb" x="190" y="40"  width="60" height="250" rx="8" style="fill:${A};opacity:.8"></rect>
        <rect class="vb" x="275" y="10"  width="60" height="280" rx="8" style="fill:${A}"></rect>
      </g></svg>`,
      anim: (sel, s) => [`tl.fromTo("${sel} .vb",{scaleY:0},{scaleY:1,duration:0.8,stagger:0.12,ease:"power2.out"},${s});`]
    };
    case "stack": return {
      html: `<svg class="vz vz-stack" viewBox="0 0 360 300">
        <rect class="vk" x="60" y="210" width="240" height="58" rx="10" style="fill:${A};opacity:.85"></rect>
        <rect class="vk" x="90" y="140" width="180" height="58" rx="10" style="fill:${A};opacity:.6"></rect>
        <rect class="vk" x="120" y="70" width="120" height="58" rx="10" style="fill:${A};opacity:.4"></rect>
        <rect class="vk" x="150" y="6" width="60"  height="52" rx="10" style="fill:${A};opacity:.25"></rect>
      </svg>`,
      anim: (sel, s) => [`tl.from("${sel} .vk",{scaleX:0.2,opacity:0,duration:0.6,stagger:0.14,ease:"back.out(1.5)"},${s});`]
    };
    case "gauge": return {
      html: `<div class="vz vz-gauge"><div class="g-ring" style="--a:${A}"><svg class="g-ic" viewBox="0 0 48 48"><path d="M14 25 L21 32 L35 16" style="fill:none;stroke:${A};stroke-width:5;stroke-linecap:round;stroke-linejoin:round"></path></svg></div></div>`,
      anim: (sel, s) => [`tl.from("${sel} .g-ring",{scale:0.6,opacity:0,duration:0.7,ease:"back.out(1.4)"},${s});`,
                         `tl.from("${sel} .g-ic",{scale:0,opacity:0,duration:0.5,ease:"back.out(2)",transformOrigin:"50% 50%"},${s + 0.4});`]
    };
    case "coins": return {
      html: `<svg class="vz vz-coins" viewBox="0 0 360 300"><g>
        ${[0,1,2,3,4].map((i)=>`<ellipse class="vc" cx="180" cy="${250 - i*44}" rx="92" ry="26" style="fill:${A};opacity:${0.45 + i*0.13}"></ellipse>`).join("")}
      </g></svg>`,
      anim: (sel, s) => [`tl.from("${sel} .vc",{y:60,opacity:0,duration:0.5,stagger:0.12,ease:"power2.out"},${s});`]
    };
    case "curve": return {
      html: `<svg class="vz vz-curve" viewBox="0 0 360 280">
        <path d="M10 270 L350 270" style="stroke:rgba(28,28,28,.16);stroke-width:3"></path>
        <path d="M10 10 L10 270" style="stroke:rgba(28,28,28,.16);stroke-width:3"></path>
        <g class="cv-reveal"><path class="cv-area" d="M10 268 C120 260 220 200 350 30 L350 268 Z" style="fill:${A};opacity:.16"></path>
        <path class="cv-line" d="M10 268 C120 260 220 200 350 30" style="fill:none;stroke:${A};stroke-width:7;stroke-linecap:round"></path></g>
        <circle class="cv-dot" cx="350" cy="30" r="12" style="fill:${A}"></circle>
      </svg>`,
      anim: (sel, s) => [`tl.fromTo("${sel} .cv-reveal",{scaleX:0},{scaleX:1,duration:1.1,ease:"power1.inOut"},${s});`,
                         `tl.from("${sel} .cv-dot",{scale:0,opacity:0,duration:0.4,ease:"back.out(2)"},${s + 1.0});`]
    };
    case "donut": return {
      html: `<div class="vz vz-donut"><div class="d-ring" style="--a:${A}"></div></div>`,
      anim: (sel, s) => [`tl.from("${sel} .d-ring",{scale:0.6,opacity:0,rotation:-40,duration:0.8,ease:"back.out(1.3)"},${s});`]
    };
    case "shield": return {
      html: `<svg class="vz vz-shield" viewBox="0 0 300 320"><path class="sh" d="M150 12 L276 60 V168 C276 250 220 296 150 312 C80 296 24 250 24 168 V60 Z"
        style="fill:${A};opacity:.14;stroke:${A};stroke-width:6"></path>
        <path class="sh-tick" d="M104 162 L138 198 L202 120" style="fill:none;stroke:${A};stroke-width:14;stroke-linecap:round;stroke-linejoin:round"></path></svg>`,
      anim: (sel, s) => [`tl.from("${sel} .sh",{scale:0.7,opacity:0,duration:0.6,ease:"back.out(1.3)",transformOrigin:"50% 50%"},${s});`,
                         `tl.from("${sel} .sh-tick",{scale:0,opacity:0,duration:0.5,ease:"back.out(2)",transformOrigin:"50% 50%"},${s + 0.5});`]
    };
    default: return { html: "", anim: () => [] };
  }
}

function build(v) {
  return (async () => {
  const dir = resolve(root, ".video-build", v.slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(resolve(dir, "audio"), { recursive: true });
  copyFileSync(resolve(root, "assets/logo.png"), resolve(dir, "logo.png"));
  copyFileSync(resolve(root, "assets", v.image), resolve(dir, "photo.jpg"));

  const heads = v.concepts.map((c) => c.head);
  const headList = heads.length > 1 ? `${heads.slice(0, -1).join("; ")}; and ${heads[heads.length - 1]}` : heads[0];
  const numWord = { 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven" }[heads.length] || `${heads.length}`;
  const agendaSay = `Before we dive in, here's what we'll cover — ${numWord} key ideas: ${headList}. Let's get started.`;
  const recapSay = `So, to recap the essentials: ${headList}. Keep these ${numWord} in mind, and you've mastered this foundation.`;
  const plan = [
    { id: "title", say: v.hook },
    { id: "agenda", say: agendaSay },
    { id: "showcase", say: v.lede },
    ...v.concepts.map((c, i) => ({ id: `c${i}`, say: c.say, c, vtype: v.viz[i] })),
    { id: "example", say: v.example.say },
    { id: "mistakes", say: v.mistakesSay },
    { id: "steps", say: v.stepsSay },
    { id: "recap", say: recapSay },
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

  const scenes = [];
  const tls = [];
  const wrap = (p, cls, inner) =>
    `<section class="scene clip ${cls}" data-start="${p.start.toFixed(3)}" data-duration="${(p.dur + GAP).toFixed(3)}" data-track-index="1">${inner}</section>`;

  for (const p of plan) {
    if (p.id === "title") {
      scenes.push(wrap(p, "sc-title", `<div class="s-title">
        <img class="t-logo anim" src="logo.png" alt="" />
        <p class="kicker anim">Foundation ${v.num} · Money Foundations</p>
        <h1 class="anim">${esc(v.title)}</h1>
        <p class="sub anim">${esc(v.subhead)}</p>
      </div>`));
      tls.push(`tl.from(".sc-title .anim",{opacity:0,y:36,duration:0.7,stagger:0.16},${p.start.toFixed(3)});`);
    } else if (p.id === "showcase") {
      scenes.push(wrap(p, "sc-photo", `<img class="ph-img" src="photo.jpg" alt="" />
        <div class="ph-veil"></div>
        <div class="ph-text">
          <p class="kicker light anim">Why it matters</p>
          <h2 class="light anim">${esc(v.showcaseLine)}</h2>
        </div>`));
      tls.push(`tl.fromTo(".sc-photo .ph-img",{scale:1.12},{scale:1,duration:${(p.dur + GAP).toFixed(2)},ease:"none"},${p.start.toFixed(3)});`);
      tls.push(`tl.from(".sc-photo .anim",{opacity:0,y:30,duration:0.8,stagger:0.18},${(p.start + 0.3).toFixed(3)});`);
    } else if (p.id === "agenda") {
      const items = v.concepts.map((c, i) => `<li class="anim"><span class="node">${i + 1}</span><span class="lbl">${esc(c.head)}</span></li>`).join("");
      scenes.push(wrap(p, "sc-list ag", `<div class="s-list small"><p class="kicker anim">In this lesson</p><h2 class="anim">What you'll learn</h2><ul class="track">${items}</ul></div>`));
      tls.push(`tl.from(".ag .anim",{opacity:0,x:-26,duration:0.5,stagger:0.1},${p.start.toFixed(3)});`);
    } else if (p.id === "example") {
      const vv = viz(v.example.viz, v.accent);
      scenes.push(wrap(p, "sc-c ex", `<div class="s-concept">
        <div class="cc-text">
          <p class="kicker anim">In practice · Example</p>
          <h2 class="anim">${esc(v.example.head)}</h2>
          <p class="c-line anim">${esc(v.example.line)}</p>
        </div>
        <div class="cc-viz">${vv.html}</div>
      </div>`));
      tls.push(`tl.from(".ex .anim",{opacity:0,y:28,duration:0.6,stagger:0.12},${p.start.toFixed(3)});`);
      tls.push(`tl.from(".ex .cc-viz",{opacity:0,duration:0.5},${(p.start + 0.2).toFixed(3)});`);
      tls.push(...vv.anim(".ex", +(p.start + 0.45).toFixed(3)));
    } else if (p.id === "recap") {
      const items = v.concepts.map((c) => `<li class="anim"><span class="node">✓</span><span class="lbl">${esc(c.head)}</span></li>`).join("");
      scenes.push(wrap(p, "sc-list rc", `<div class="s-list small"><p class="kicker anim">Recap</p><h2 class="anim">Remember these</h2><ul class="track">${items}</ul></div>`));
      tls.push(`tl.from(".rc .anim",{opacity:0,x:-26,duration:0.5,stagger:0.1},${p.start.toFixed(3)});`);
    } else if (p.id.startsWith("c")) {
      const i = +p.id.slice(1);
      const vv = viz(p.vtype, v.accent);
      const alt = i % 2 === 1 ? " alt" : "";
      scenes.push(wrap(p, `sc-c c-${i}`, `<div class="s-concept${alt}">
        <div class="cc-text">
          <span class="c-badge anim">${String(i + 1).padStart(2, "0")}</span>
          <p class="kicker anim">Key concept</p>
          <h2 class="anim">${esc(p.c.head)}</h2>
          <p class="c-line anim">${esc(p.c.line)}</p>
        </div>
        <div class="cc-viz anim-viz">${vv.html}</div>
      </div>`));
      tls.push(`tl.from(".c-${i} .anim",{opacity:0,y:28,duration:0.6,stagger:0.12},${p.start.toFixed(3)});`);
      tls.push(`tl.from(".c-${i} .cc-viz",{opacity:0,duration:0.5},${(p.start + 0.2).toFixed(3)});`);
      tls.push(...vv.anim(`.c-${i}`, +(p.start + 0.45).toFixed(3)));
    } else if (p.id === "mistakes") {
      const items = v.mistakes.map((m) => `<li class="anim"><span class="x">✕</span>${esc(m)}</li>`).join("");
      scenes.push(wrap(p, "sc-list mistakes", `<div class="s-list"><p class="kicker anim">Watch out for</p><h2 class="anim">Common mistakes</h2><ul class="rows">${items}</ul></div>`));
      tls.push(`tl.from(".mistakes .anim",{opacity:0,x:-28,duration:0.55,stagger:0.18},${p.start.toFixed(3)});`);
    } else if (p.id === "steps") {
      const items = v.steps.map((s, i) => `<li class="anim"><span class="node">${i + 1}</span><span class="lbl">${esc(s)}</span></li>`).join("");
      scenes.push(wrap(p, "sc-list steps", `<div class="s-list"><p class="kicker anim">Put it into practice</p><h2 class="anim">Your action steps</h2><ul class="track">${items}</ul></div>`));
      tls.push(`tl.from(".steps .anim",{opacity:0,x:-26,duration:0.5,stagger:0.14},${p.start.toFixed(3)});`);
    } else if (p.id === "outro") {
      scenes.push(wrap(p, "sc-outro", `<div class="s-outro">
        <img class="o-logo anim" src="logo.png" alt="" />
        <h2 class="anim">Financial education is a right,<br/>not a privilege.</h2>
        <p class="sub anim">Attend a free workshop — no cost, no obligation.</p>
        <p class="url anim">mindpeacefinancial.com</p>
      </div>`));
      tls.push(`tl.from(".sc-outro .anim",{opacity:0,y:30,duration:0.7,stagger:0.16},${p.start.toFixed(3)});`);
    }
  }

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1920px; height:1080px; overflow:hidden; }
  #root { position:relative; width:1920px; height:1080px; font-family:"Manrope",system-ui,sans-serif; color:#1c1c1c; }
  .bg { position:absolute; inset:0; background:
      radial-gradient(circle at 16% 12%, rgba(255,178,143,.42), transparent 36rem),
      radial-gradient(circle at 84% 6%, rgba(170,198,255,.34), transparent 40rem),
      radial-gradient(circle at 52% 92%, rgba(255,219,156,.30), transparent 38rem),
      #f7f4ed; }
  .bg::after { content:""; position:absolute; inset:0;
      background-image:linear-gradient(rgba(28,28,28,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(28,28,28,.03) 1px,transparent 1px);
      background-size:96px 96px; -webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,.6),transparent 78%); }
  .scene { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:140px 170px; }
  .kicker { color:${v.accent}; font-size:30px; font-weight:600; letter-spacing:.4px; text-decoration:underline; text-underline-offset:8px; margin-bottom:28px; }
  .kicker.light { color:#fff; opacity:.92; }
  h1 { font-size:130px; line-height:1.0; letter-spacing:-3px; font-weight:700; margin-bottom:30px; }
  h2 { font-size:82px; line-height:1.05; letter-spacing:-2px; font-weight:700; }
  .sub { font-size:40px; color:#4f4f4d; font-weight:500; max-width:1200px; }
  /* title */
  .s-title { text-align:center; max-width:1400px; }
  .t-logo { width:300px; margin:0 auto 56px; }
  .s-title .sub { margin:0 auto; }
  /* photo showcase */
  .sc-photo { padding:0; }
  .ph-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .ph-veil { position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,15,10,.32), rgba(20,15,10,.72)); }
  .ph-text { position:absolute; left:170px; right:170px; bottom:160px; }
  .ph-text h2 { font-size:96px; letter-spacing:-2.5px; max-width:1450px; }
  .light { color:#fcfbf8; }
  /* concept split */
  .s-concept { display:flex; align-items:center; gap:120px; width:100%; max-width:1620px; }
  .s-concept.alt { flex-direction:row-reverse; }
  .cc-text { flex:1.1; }
  .cc-viz { flex:0.9; display:flex; align-items:center; justify-content:center; }
  .c-badge { display:inline-grid; place-items:center; width:74px; height:74px; border-radius:9999px; background:${v.accent}; color:#fff; font-family:"Newsreader",serif; font-size:38px; font-weight:700; margin-bottom:28px; }
  .cc-text h2 { margin-bottom:26px; }
  .c-line { font-size:46px; color:#4f4f4d; font-weight:500; line-height:1.3; max-width:760px; }
  .vz { width:460px; height:auto; }
  .vz-gauge, .vz-donut { display:grid; place-items:center; }
  .g-ring { width:380px; height:380px; border-radius:50%; background:conic-gradient(var(--a) 0 72%, rgba(28,28,28,.1) 72% 100%); display:grid; place-items:center; position:relative; }
  .g-ring::after { content:""; position:absolute; inset:54px; border-radius:50%; background:#f5f1e8; }
  .g-ic { position:relative; z-index:1; width:150px; height:150px; }
  .d-ring { width:380px; height:380px; border-radius:50%; background:conic-gradient(var(--a) 0 46%, color-mix(in srgb, var(--a) 55%, #fff) 46% 72%, color-mix(in srgb, var(--a) 28%, #fff) 72% 88%, rgba(28,28,28,.12) 88% 100%); position:relative; }
  .d-ring::after { content:""; position:absolute; inset:96px; border-radius:50%; background:#f5f1e8; }
  /* lists */
  .s-list { width:100%; max-width:1400px; }
  .s-list h2 { margin-bottom:50px; }
  .rows, .track { list-style:none; display:flex; flex-direction:column; gap:26px; }
  .rows li, .track li { display:flex; align-items:center; gap:30px; font-size:50px; font-weight:600; color:#1c1c1c; }
  .x { flex:0 0 auto; width:62px; height:62px; border-radius:9999px; background:rgba(28,28,28,.28); color:#fff; display:flex; align-items:center; justify-content:center; font-size:28px; }
  .track .node { flex:0 0 auto; width:66px; height:66px; border-radius:9999px; background:${v.accent}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:700; }
  .s-list.small h2 { margin-bottom:40px; }
  .s-list.small .track { gap:20px; }
  .s-list.small .track li { font-size:42px; }
  .s-list.small .track .node { width:58px; height:58px; font-size:27px; }
  /* outro */
  .s-outro { text-align:center; max-width:1500px; }
  .o-logo { width:280px; margin:0 auto 50px; }
  .s-outro h2 { margin-bottom:34px; }
  .s-outro .sub { margin:0 auto 40px; }
  .url { font-size:38px; font-weight:700; color:${v.accent}; letter-spacing:.5px; }
  /* visuals shared */
  .vb { transform-origin:bottom; transform-box:fill-box; }
  .vk { transform-origin:center; transform-box:fill-box; }
  .cv-reveal { transform-origin:left center; transform-box:fill-box; }
  /* watermark */
  .wm { position:absolute; right:64px; bottom:56px; opacity:.55; }
  .wm img { width:188px; }
  .sc-photo ~ .wm, .wm.on-photo { opacity:.9; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
  <div class="bg clip" data-start="0" data-duration="${total}" data-track-index="0"></div>
  ${audioTags.join("\n  ")}
  ${scenes.join("\n  ")}
  <div class="wm clip" data-start="0" data-duration="${total}" data-track-index="5"><img src="logo.png" alt="" /></div>
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
  console.log(`  total ${total}s (${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, "0")}) [voice=${EL_KEY ? "elevenlabs" : "say"}] — rendering...`);

  const outDir = resolve(root, "assets", "videos");
  mkdirSync(outDir, { recursive: true });
  const out = resolve(outDir, `${v.slug}.mp4`);
  execFileSync(HF, ["render", dir, "-o", out, "--fps", "30", "--quality", "standard", "--quiet"], { stdio: "inherit" });
  // Web-optimize: smaller + faststart (progressive playback), under Cloudflare
  // Pages' 25 MiB/file limit. Low-motion graphic scenes compress well at crf 25.
  const raw = out.replace(/\.mp4$/, ".raw.mp4");
  renameSync(out, raw);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-c:v", "libx264", "-crf", "25", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out], { stdio: "inherit" });
  rmSync(raw, { force: true });
  console.log(`  wrote ${out} (${(execFileSync("stat", ["-f%z", out]).toString().trim() / 1048576).toFixed(1)} MiB)`);
  })();
}

const only = process.argv[2];
const targets = only ? VIDEOS.filter((v) => v.slug === only) : VIDEOS;
if (!targets.length) { console.error("no matching slug:", only); process.exit(1); }
for (const v of targets) {
  console.log(`\n=== ${v.title} ===`);
  await build(v);
}
console.log("\nDone.");
