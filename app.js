const DIMENSIONS = {
  EI: { left: "E", right: "I", leftName: "外向", rightName: "内向", label: "精力来源", prompt: "你更习惯从哪里获得与恢复精力" },
  SN: { left: "S", right: "N", leftName: "实感", rightName: "直觉", label: "信息获取", prompt: "你更自然地留意哪一类信息" },
  TF: { left: "T", right: "F", leftName: "思考", rightName: "情感", label: "决策方式", prompt: "你更常依靠什么标准作出判断" },
  JP: { left: "J", right: "P", leftName: "判断", rightName: "感知", label: "生活节奏", prompt: "你更偏好怎样安排外部生活" },
};

const questions = [
  { d: "EI", p: "E", t: "参加一场活动后，我通常会因为与人交流而更有精神。" },
  { d: "SN", p: "S", t: "学习新事物时，我希望先看到具体示例，再理解背后的概念。" },
  { d: "TF", p: "T", t: "意见冲突时，我会优先检查哪一方的论据更合理。" },
  { d: "JP", p: "J", t: "提前确定安排，会让我感到踏实而不是受限。" },
  { d: "EI", p: "I", t: "长时间社交后，我需要独处才能真正恢复状态。" },
  { d: "SN", p: "N", t: "我经常从零散信息中联想到尚未出现的可能性。" },
  { d: "TF", p: "F", t: "即使一个决定很合理，我也会认真考虑它会让相关的人有什么感受。" },
  { d: "JP", p: "P", t: "我喜欢保留选择，直到掌握更多信息再做最后决定。" },
  { d: "EI", p: "E", t: "我常在说话的过程中逐渐想清楚自己真正的观点。" },
  { d: "SN", p: "S", t: "比起推测隐含含义，我更相信可以直接观察和验证的事实。" },
  { d: "TF", p: "T", t: "做重要决定时，一致的原则比照顾个别情况更可靠。" },
  { d: "JP", p: "J", t: "我倾向先完成该做的事，再安心享受自由时间。" },
  { d: "EI", p: "I", t: "面对复杂问题时，我更愿意先在心里整理好，再与别人讨论。" },
  { d: "SN", p: "N", t: "一个想法是否有发展潜力，常比它眼下是否实用更吸引我。" },
  { d: "TF", p: "F", t: "规则若忽略了具体处境，我认为为人作出调整是合理的。" },
  { d: "JP", p: "P", t: "临时改变计划通常让我觉得有新鲜感，而不是被打乱。" },
  { d: "EI", p: "E", t: "到了陌生环境，我一般会主动寻找可以交谈的人。" },
  { d: "SN", p: "S", t: "我对谈话中的具体细节，往往比大致印象记得更清楚。" },
  { d: "TF", p: "T", t: "指出问题时，我更在意表达准确，而不是让话听起来舒服。" },
  { d: "JP", p: "J", t: "旅行或项目开始前，我喜欢把关键节点安排清楚。" },
  { d: "EI", p: "I", t: "比起认识很多人，我更看重与少数人建立深而稳定的联系。" },
  { d: "SN", p: "N", t: "我很自然地会追问：这件事还可能意味着什么？" },
  { d: "TF", p: "F", t: "在团队决策中，维持彼此信任与投入是我非常重视的标准。" },
  { d: "JP", p: "P", t: "面对开放任务时，我喜欢边做边调整，而不是一开始就定死步骤。" },
  { d: "EI", p: "E", t: "热闹、有互动的环境通常能激发我的行动力。" },
  { d: "SN", p: "S", t: "我擅长注意到流程中现实、细小但会影响结果的问题。" },
  { d: "TF", p: "T", t: "当事实与个人期待不一致时，我更愿意直接面对事实。" },
  { d: "JP", p: "J", t: "待办事项被逐一划掉，会给我明显的满足感。" },
  { d: "EI", p: "I", t: "我通常不会立刻回应，而会给自己一点时间形成完整想法。" },
  { d: "SN", p: "N", t: "我容易对理论、象征或事物之间的模式产生兴趣。" },
  { d: "TF", p: "F", t: "当朋友遇到困难时，我会先让对方感到被理解，再一起分析办法。" },
  { d: "JP", p: "P", t: "若没有必要，我不喜欢过早承诺一个固定方案。" },
  { d: "EI", p: "E", t: "如果一整天几乎没有与人互动，我会觉得缺少活力。" },
  { d: "SN", p: "S", t: "我更欣赏清楚、可操作的说明，而不是富有想象但模糊的表达。" },
  { d: "TF", p: "T", t: "评估方案时，我能暂时放下个人好恶，分析它的利弊。" },
  { d: "JP", p: "J", t: "截止日期临近前，我通常已经完成了大部分工作。" },
  { d: "EI", p: "I", t: "不被打扰地专注一段时间，是我最舒服的工作方式。" },
  { d: "SN", p: "N", t: "重复使用已有方法会让我想尝试一种全新的可能。" },
  { d: "TF", p: "F", t: "我很容易察觉某个决定是否违背了自己重视的价值。" },
  { d: "JP", p: "P", t: "在可控范围内，我享受即兴处理突然出现的机会。" },
  { d: "EI", p: "E", t: "我愿意主动召集大家，把一件事推动起来。" },
  { d: "SN", p: "S", t: "做判断时，过去的实际经验是我重要的参考。" },
  { d: "TF", p: "T", t: "为了得到更好的结果，我愿意质疑一个大家都喜欢的方案。" },
  { d: "JP", p: "J", t: "明确的目标、边界和交付标准能帮助我发挥得更好。" },
  { d: "EI", p: "I", t: "在人多的讨论里，我更喜欢先倾听，等有把握时再发言。" },
  { d: "SN", p: "N", t: "我经常关注长远趋势，即使它暂时还没有直接影响。" },
  { d: "TF", p: "F", t: "我认为好的决定不仅要有效，也要让人愿意接受和参与。" },
  { d: "JP", p: "P", t: "我的最佳思路常在探索过程中出现，而不是计划阶段。" },
  { d: "EI", p: "E", t: "需要快速行动时，我通常愿意先联系他人、整合资源。" },
  { d: "SN", p: "S", t: "我倾向把注意力放在当下真实发生的事情上。" },
  { d: "TF", p: "T", t: "遇到争议时，我会用同一套标准检验包括自己在内的每一方。" },
  { d: "JP", p: "J", t: "我会主动建立清单或日程，避免事情失去控制。" },
  { d: "EI", p: "I", t: "重要感受我通常只与少数信任的人分享。" },
  { d: "SN", p: "N", t: "比起准确复述内容，我更容易记住其中的核心观点与联想。" },
  { d: "TF", p: "F", t: "如果一种做法让人受到不必要的伤害，我会重新考虑它是否真的正确。" },
  { d: "JP", p: "P", t: "同时探索几个方向，对我来说比严格按顺序推进更自然。" },
];

const typeProfiles = {
  INTJ: ["战略建筑师", "你倾向独立构建长远图景，再用系统化的方法把复杂目标变成可执行路径。你重视能力、逻辑与自主空间。"],
  INTP: ["逻辑探索者", "你乐于拆解概念、寻找原理与例外。比起快速定论，你更享受不断修正模型，直到解释足够精确。"],
  ENTJ: ["果断统筹者", "你容易看到目标、资源与效率之间的关系，并愿意组织他人推动改变。清晰挑战往往能激发你的最佳状态。"],
  ENTP: ["可能性辩手", "你擅长发现新角度、连接看似无关的想法，并通过讨论检验它们。变化和智力挑战会让你充满活力。"],
  INFJ: ["洞察引导者", "你常从细微信号中理解人的动机与长期走向，并希望把洞察转化为有意义、对人有益的行动。"],
  INFP: ["价值理想家", "你拥有细腻而稳定的内在价值体系，重视真实、想象与个人意义。你通常以温和但坚定的方式守护重要之事。"],
  ENFJ: ["共鸣组织者", "你善于感知群体需要、凝聚共识并鼓励人成长。你往往把关系质量与共同愿景同时放在心上。"],
  ENFP: ["灵感联结者", "你对人和可能性保持开放，擅长点燃热情、发现潜能。自由探索与真诚连接是你重要的驱动力。"],
  ISTJ: ["稳健执行者", "你依靠事实、经验与清晰标准建立可靠秩序。承诺、准确和持续完成，是你获得信任的核心方式。"],
  ISFJ: ["细致守护者", "你敏锐留意现实需要，愿意用稳定而具体的行动支持他人。你珍视责任、熟悉感与关系中的体贴。"],
  ESTJ: ["务实管理者", "你善于明确标准、分配责任并让事情高效落地。面对混乱时，你通常会自然地建立结构和秩序。"],
  ESFJ: ["热忱协作者", "你关注人们实际的感受与需要，擅长营造归属感并维护日常协作。及时回应与彼此认可对你很重要。"],
  ISTP: ["冷静解题者", "你倾向先观察系统如何运作，再用简洁有效的方式解决眼前问题。你重视自主、实用与临场适应。"],
  ISFP: ["温柔体验者", "你对当下体验与个人价值有细腻感受，偏好以自然、低调的方式表达关心与审美，不喜欢被僵硬定义。"],
  ESTP: ["敏捷行动派", "你对现场变化反应迅速，善于利用现有资源解决实际问题。直接体验、即时反馈和真实挑战最能调动你。"],
  ESFP: ["活力体验家", "你热衷真实的人际互动与当下体验，能够敏锐回应氛围，为身边的人带来温度、趣味与实际帮助。"],
};

const poleTraits = {
  E: { strengths: ["主动连接资源，愿意把想法带入讨论", "在互动中快速形成观点并推动行动"], growth: ["给自己留出安静整理的时间", "为较慢热的伙伴预留表达空间"], work: "适合有协作、现场反馈与外部节奏的环境。" },
  I: { strengths: ["能够长时间独立专注并深入思考", "表达前会充分整理，观点通常较完整"], growth: ["在想法尚未完美时也尝试尽早分享", "主动维护必要的人际连接"], work: "适合拥有自主空间、可深度工作且干扰较少的环境。" },
  S: { strengths: ["关注事实、细节与现实可行性", "善于复用经验并把事情稳定落地"], growth: ["在细节之外定期退后观察整体方向", "给尚未验证的新想法一点探索空间"], work: "在目标具体、标准清楚、能看到实际成果的任务中更从容。" },
  N: { strengths: ["善于发现模式、趋势与潜在机会", "能从不同领域连接出新观点"], growth: ["把宏观想法翻译成下一步具体行动", "检查自己是否略过了关键事实与细节"], work: "在允许创新、概念思考和长期探索的任务中更投入。" },
  T: { strengths: ["能以一致标准分析问题和权衡利弊", "面对分歧时较容易保持客观"], growth: ["在给出结论前先确认他人的感受", "把关系影响也纳入决策成本"], work: "偏好职责清晰、重视能力并允许理性辩论的文化。" },
  F: { strengths: ["能体察决定对人和关系的影响", "善于建立信任并识别真正重要的价值"], growth: ["在照顾他人时明确自己的边界", "用可检验的标准补充直觉判断"], work: "偏好目标有意义、关系真诚且贡献能被看见的文化。" },
  J: { strengths: ["善于规划、排序并稳定推进任务", "通过明确承诺降低不确定性"], growth: ["为变化留下缓冲，不把调整等同于失控", "避免为了尽快定论而错过新信息"], work: "在里程碑明确、节奏可控、责任边界清晰时效率更高。" },
  P: { strengths: ["能灵活响应变化并抓住临时机会", "在探索中持续吸收信息、调整方案"], growth: ["把开放探索转化为明确的阶段性交付", "为重要截止日期设置提前量"], work: "在自主度高、变化丰富、允许迭代的环境中表现自然。" },
};

const relationNotes = {
  E: "你往往通过频繁互动表达在乎，也希望回应是可见而及时的。",
  I: "你更可能通过深度陪伴和选择性分享表达信任，需要关系中保有独处空间。",
  S: "你常用记住细节、兑现承诺和实际帮助来经营关系。",
  N: "你喜欢分享想法、愿景与隐含意义，希望关系能带来精神上的启发。",
  T: "你常以解决问题、提供诚实反馈来表达支持；记得有时倾听本身就是帮助。",
  F: "你会自然关注情绪与价值是否被尊重；也要允许健康分歧存在。",
  J: "明确约定和稳定回应让你更安心，临时变化最好提前沟通。",
  P: "你珍惜轻松与自发性，但把重要期待说清楚能减少误解。",
};

const scaleText = ["非常不同意", "不同意", "有些不同意", "不确定 / 中立", "有些同意", "同意", "非常同意"];
const app = document.querySelector("#app");
const methodDialog = document.querySelector("#methodDialog");
const toast = document.querySelector("#toast");
const storageKey = "prism-mbti-progress-v1";
let state = loadState();
let toastTimer;
let advanceTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.answers) && saved.answers.length === questions.length) return saved;
  } catch (_) {}
  return { screen: "home", current: 0, answers: Array(questions.length).fill(null), startedAt: null, completedAt: null };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function icon(name) {
  const paths = {
    clock: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    shield: '<path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    back: '<path d="M19 12H5m5 5-5-5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    spark: '<path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9L12 3Z" stroke="currentColor" stroke-width="1.6"/><path d="m18 15 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z" stroke="currentColor" stroke-width="1.4"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7m5 5H3m7 0v2h4v-2" stroke="currentColor" stroke-width="1.7"/>',
    heart: '<path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    up: '<path d="M12 20V6m-5 5 5-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths[name]}</svg>`;
}

function renderHome() {
  state.screen = "home";
  saveState();
  const answered = state.answers.filter(v => v !== null).length;
  const canContinue = answered > 0 && answered < questions.length;
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">UNDERSTAND YOUR PATTERN</span>
        <h1>看见你的<br>性格棱面</h1>
        <p class="hero-lead">56 道情境化题目，从精力、信息、决策与生活方式四个维度，描绘你更自然的心理偏好。</p>
        <div class="hero-actions">
          <button class="primary-button" id="startButton" type="button">${answered === questions.length ? "重新测试" : "开始测试"} &nbsp;→</button>
          <button class="secondary-button continue-button ${canContinue ? "is-visible" : ""}" id="continueButton" type="button">继续上次进度（${answered}/56）</button>
        </div>
        <div class="hero-meta">
          <span>${icon("clock")}约 10–12 分钟</span>
          <span>${icon("shield")}进度仅保存在本机</span>
        </div>
      </div>
      <div class="prism-visual" aria-label="四维人格偏好的抽象卡片插图">
        <div class="visual-orbit" aria-hidden="true"></div><div class="visual-dot" aria-hidden="true"></div>
        <div class="prism-card card-e"><strong>E</strong><span>ENERGY · 精力</span></div>
        <div class="prism-card card-n"><strong>N</strong><span>INFORMATION · 信息</span></div>
        <div class="prism-card card-t"><strong>T</strong><span>DECISION · 决策</span></div>
      </div>
    </section>
    <section class="feature-grid" aria-label="测试特点">
      <h2 class="sr-only">测试特点</h2>
      <article class="feature-card"><span class="feature-index">01 / BALANCED</span><h3>双向平衡题目</h3><p>每个维度两端各 7 题，避免把某一类偏好写成默认的“好答案”。</p></article>
      <article class="feature-card"><span class="feature-index">02 / CONTINUOUS</span><h3>不只给四个字母</h3><p>同时呈现倾向百分比与清晰度，保留性格处在连续谱上的真实样貌。</p></article>
      <article class="feature-card"><span class="feature-index">03 / PRACTICAL</span><h3>有边界的深度解读</h3><p>覆盖优势、成长提醒、工作偏好与关系沟通，并明确测评的适用边界。</p></article>
    </section>`;

  document.querySelector("#startButton").addEventListener("click", () => {
    state = { screen: "test", current: 0, answers: Array(questions.length).fill(null), startedAt: Date.now(), completedAt: null };
    saveState();
    renderTest();
  });
  document.querySelector("#continueButton")?.addEventListener("click", () => {
    state.screen = "test";
    const firstEmpty = state.answers.findIndex(v => v === null);
    state.current = firstEmpty >= 0 ? firstEmpty : 0;
    renderTest();
  });
}

function renderTest() {
  clearTimeout(advanceTimer);
  advanceTimer = null;
  state.screen = "test";
  saveState();
  const index = state.current;
  const q = questions[index];
  const answered = state.answers.filter(v => v !== null).length;
  const section = Math.floor(index / 14) + 1;
  app.innerHTML = `
    <section class="test-layout">
      <div class="test-top">
        <div>
          <div class="progress-copy"><span>整体进度</span><span>${answered} / ${questions.length}</span></div>
          <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="56" aria-valuenow="${answered}" aria-label="测试完成进度"><div class="progress-bar" style="width:${answered / questions.length * 100}%"></div></div>
        </div>
        <span class="section-chip">第 ${section} 组 · 共 4 组</span>
      </div>
      <article class="question-card">
        <span class="question-number">Q${String(index + 1).padStart(2, "0")}</span>
        <h1>${q.t}</h1>
        <div class="scale-labels" aria-hidden="true"><span>非常不同意</span><span>不确定</span><span>非常同意</span></div>
        <div class="answer-scale" role="radiogroup" aria-label="请选择同意程度">
          ${scaleText.map((text, i) => `
            <div class="scale-option">
              <input type="radio" id="answer-${i + 1}" name="answer" value="${i + 1}" ${state.answers[index] === i + 1 ? "checked" : ""}>
              <label for="answer-${i + 1}"><span>${i + 1}</span><small>${text}</small></label>
            </div>`).join("")}
        </div>
      </article>
      <div class="test-nav">
        <button class="nav-button" id="backButton" type="button" ${index === 0 ? "disabled" : ""}>${icon("back")}上一题</button>
        <span class="test-hint">可按数字键 1–7 快速选择</span>
        <button class="nav-button" id="nextButton" type="button" ${state.answers[index] === null ? "disabled" : ""}>${index === questions.length - 1 ? "查看结果" : "下一题"}${icon("arrow")}</button>
      </div>
    </section>`;

  document.querySelectorAll('input[name="answer"]').forEach(input => input.addEventListener("change", event => {
    state.answers[index] = Number(event.target.value);
    saveState();
    if (index < questions.length - 1) {
      document.querySelector("#nextButton").disabled = true;
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => { state.current += 1; renderTest(); }, 260);
    } else {
      document.querySelector("#nextButton").disabled = false;
    }
  }));
  document.querySelector("#backButton").addEventListener("click", () => { if (index > 0) { state.current -= 1; renderTest(); } });
  document.querySelector("#nextButton").addEventListener("click", nextQuestion);
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextQuestion() {
  if (state.answers[state.current] === null) return;
  if (state.current < questions.length - 1) {
    state.current += 1;
    renderTest();
  } else if (state.answers.every(v => v !== null)) {
    state.completedAt = Date.now();
    state.screen = "results";
    saveState();
    renderResults();
  }
}

function calculateResults() {
  const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
  questions.forEach((q, i) => {
    const dim = DIMENSIONS[q.d];
    const centered = state.answers[i] - 4;
    scores[q.d] += q.p === dim.left ? centered : -centered;
    counts[q.d] += 1;
  });
  let type = "";
  const dimensions = Object.entries(DIMENSIONS).map(([key, dim]) => {
    const max = counts[key] * 3;
    const leftPercent = Math.round(50 + (scores[key] / max) * 50);
    const rightPercent = 100 - leftPercent;
    const letter = scores[key] > 0 ? dim.left : scores[key] < 0 ? dim.right : "X";
    type += letter;
    const clarity = Math.round(Math.abs(scores[key]) / max * 100);
    const clarityLabel = clarity < 12 ? "非常均衡" : clarity < 28 ? "轻微倾向" : clarity < 50 ? "中等倾向" : "清晰倾向";
    return { key, ...dim, score: scores[key], leftPercent, rightPercent, letter, clarity, clarityLabel };
  });
  return { type, dimensions };
}

function getQuality() {
  const answers = state.answers;
  const neutral = answers.filter(v => v === 4).length;
  const frequencies = answers.reduce((acc, v) => (acc[v] = (acc[v] || 0) + 1, acc), {});
  const dominant = Math.max(...Object.values(frequencies));
  const seconds = state.startedAt && state.completedAt ? (state.completedAt - state.startedAt) / 1000 : 600;
  let score = 100;
  const notes = [];
  if (neutral > 18) { score -= 20; notes.push("中立选项较多，部分维度可能不够清晰"); }
  if (dominant > 34) { score -= 20; notes.push("答案集中在同一选项，可能没有充分区分不同情境"); }
  if (seconds < 210) { score -= 25; notes.push("完成速度很快，建议结合直觉之外再想一想真实经历"); }
  if (!notes.length) notes.push("作答分布与完成时长处于合理范围，结果具有较好的自我探索参考价值");
  return { score: Math.max(40, score), notes };
}

function getProfile(type, dimensions) {
  if (!type.includes("X") && typeProfiles[type]) return { title: typeProfiles[type][0], summary: typeProfiles[type][1], letters: type.split("") };
  const letters = dimensions.map(d => d.score >= 0 ? d.left : d.right);
  return { title: "均衡探索者", summary: "你的至少一个维度非常接近中点，说明你在这一方面会根据情境灵活切换。与其急着归入单一类型，更值得观察自己在轻松、压力和不同角色下会自然选择哪种方式。", letters };
}

function renderResults() {
  if (!state.answers.every(v => v !== null)) return renderHome();
  state.screen = "results";
  saveState();
  const result = calculateResults();
  const profile = getProfile(result.type, result.dimensions);
  const quality = getQuality();
  const strengths = profile.letters.flatMap(l => poleTraits[l].strengths).slice(0, 6);
  const growth = profile.letters.flatMap(l => poleTraits[l].growth).slice(0, 6);
  const work = profile.letters.map(l => poleTraits[l].work);
  const relations = profile.letters.map(l => relationNotes[l]);

  app.innerHTML = `
    <section class="results">
      <article class="result-hero" data-type="${result.type}">
        <span class="result-kicker">YOUR PERSONALITY PATTERN</span>
        <div class="type-lockup">
          <div class="type-code">${result.type}</div>
          <div class="type-title"><h1>${profile.title}</h1><p>${result.type.includes("X") ? "X 代表该维度没有明显偏向" : "四维偏好组合"}</p></div>
        </div>
        <p class="type-summary">${profile.summary}</p>
        <div class="result-actions">
          <button class="primary-button" id="copyButton" type="button">复制结果摘要</button>
          <button class="secondary-button" id="printButton" type="button">保存 / 打印报告</button>
          <button class="secondary-button" id="restartButton" type="button">重新测试</button>
        </div>
      </article>

      <div class="section-heading"><div><span class="eyebrow">YOUR SPECTRUM</span><h2>四维倾向光谱</h2></div><p>百分比表示你在本次作答中更靠近哪一端，不代表能力高低。越接近 50%，说明越可能随情境灵活切换。</p></div>
      <section class="dimension-list" aria-label="四维倾向分数">
        ${result.dimensions.map(d => `
          <div class="dimension-row">
            <div class="dimension-head"><span class="dimension-name">${d.label} · ${d.prompt}</span><span class="clarity-badge">${d.clarityLabel}</span></div>
            <div class="dimension-values"><span><strong>${d.left} ${d.leftName}</strong> ${d.leftPercent}%</span><span>${d.rightPercent}% <strong>${d.right} ${d.rightName}</strong></span></div>
            <div class="bi-bar" aria-label="${d.leftName} ${d.leftPercent}%，${d.rightName} ${d.rightPercent}%"><div class="bi-left" style="width:${d.leftPercent}%"></div><div class="bi-right" style="width:${d.rightPercent}%"></div></div>
          </div>`).join("")}
      </section>

      <div class="section-heading"><div><span class="eyebrow">DEEPER VIEW</span><h2>把偏好放回生活</h2></div><p>以下内容由你在四个维度上的主要倾向组合而来。把符合你的部分留下，把不符合的部分当作进一步观察的问题。</p></div>
      <section class="insight-grid">
        <article class="insight-card"><div class="insight-card-icon">${icon("spark")}</div><h3>你可能带来的优势</h3><ul>${strengths.map(x => `<li>${x}</li>`).join("")}</ul></article>
        <article class="insight-card"><div class="insight-card-icon">${icon("up")}</div><h3>值得留意的成长点</h3><ul>${growth.map(x => `<li>${x}</li>`).join("")}</ul></article>
        <article class="insight-card"><div class="insight-card-icon">${icon("briefcase")}</div><h3>工作与学习偏好</h3><ul>${work.map(x => `<li>${x}</li>`).join("")}</ul></article>
        <article class="insight-card"><div class="insight-card-icon">${icon("heart")}</div><h3>关系与沟通</h3><ul>${relations.map(x => `<li>${x}</li>`).join("")}</ul></article>
      </section>

      <div class="quality-card">
        <div class="quality-score">${quality.score}</div>
        <div><h3>作答质量参考</h3><p>${quality.notes.join("；")}。这不是统计学上的置信度，也不等于人格“准确率”。若结果与你长期表现明显不符，建议休息后按自然状态重测。</p></div>
      </div>
      <p class="disclaimer">本结果用于自我反思与沟通，不适用于心理疾病诊断、招聘淘汰或替代专业评估。MBTI® 是 The Myers-Briggs Company 的注册商标；本站与其无隶属或授权关系。</p>
    </section>`;

  document.querySelector("#copyButton").addEventListener("click", async () => {
    const lines = result.dimensions.map(d => `${d.label}：${d.leftName} ${d.leftPercent}% / ${d.rightName} ${d.rightPercent}%`).join("\n");
    const text = `我的人格倾向结果：${result.type} · ${profile.title}\n${profile.summary}\n\n${lines}\n\n来自「棱镜人格倾向测试」`;
    try { await navigator.clipboard.writeText(text); showToast("结果摘要已复制"); }
    catch (_) { showToast("复制失败，请允许剪贴板权限"); }
  });
  document.querySelector("#printButton").addEventListener("click", () => window.print());
  document.querySelector("#restartButton").addEventListener("click", () => {
    state = { screen: "test", current: 0, answers: Array(questions.length).fill(null), startedAt: Date.now(), completedAt: null };
    saveState();
    renderTest();
  });
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.querySelector("#methodButton").addEventListener("click", () => methodDialog.showModal());
document.querySelector("#closeMethodButton").addEventListener("click", () => methodDialog.close());
methodDialog.addEventListener("click", event => { if (event.target === methodDialog) methodDialog.close(); });
document.querySelector("#themeButton").addEventListener("click", event => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  event.currentTarget.setAttribute("aria-pressed", String(!isDark));
  localStorage.setItem("prism-theme", isDark ? "light" : "dark");
});

document.addEventListener("keydown", event => {
  if (state.screen !== "test" || methodDialog.open) return;
  if (/^[1-7]$/.test(event.key)) {
    const input = document.querySelector(`#answer-${event.key}`);
    if (input) { input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); }
  } else if (event.key === "ArrowLeft" && state.current > 0) {
    state.current -= 1; renderTest();
  } else if (event.key === "ArrowRight" && state.answers[state.current] !== null && !advanceTimer) {
    nextQuestion();
  }
});

const savedTheme = localStorage.getItem("prism-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
else if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.dataset.theme = "dark";
document.querySelector("#themeButton").setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));

if (state.screen === "results" && state.answers.every(v => v !== null)) renderResults();
else renderHome();
