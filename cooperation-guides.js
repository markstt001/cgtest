// 合作说明书 v1.0 - 256 种风格组合
// 基于 4 维度互补/冲突逻辑生成

const cooperationGuides = {
  // ==================== 16 种最佳搭档（深度文案）====================
  "ARCD-ARBP": {
    type: "最佳搭档",
    role: "军师 + 外交官",
    yourRole: "数据和战略",
    theirRole: "关系和氛围",
    advantages: [
      "你理性分析，他温和协调——决策既有依据又有人情味",
      "你容易太硬，他帮你软化——避免关系破裂",
      "他容易妥协，你帮他坚守——保护核心利益"
    ],
    conflicts: "你觉得他太软时，想想没有他你早就把关系搞僵了；他觉得你太冷时，提醒他你的数据是在保护团队",
    solution: "对他说话，先肯定再建议：这个方案很好，如果再加一条数据支撑就更完美了",
    quote: "数据我来守护，关系你来维系"
  },
  "ARCP-ATBD": {
    type: "最佳搭档",
    role: "规划师 + 指挥官",
    yourRole: "战略和双赢",
    theirRole: "执行和决断",
    advantages: [
      "你出战略规划，他做快速决断——效率和质量兼顾",
      "你追求双赢，他追求结果——既有格局又有产出",
      "你容易想太多，他帮你拍板——避免优柔寡断"
    ],
    conflicts: "你觉得他独裁时，想想没有他你可能还在开会；他觉得你优柔时，提醒他你的周全是在避免踩坑",
    solution: "给他清晰的选项，不要给开放性问题：方案 A 和方案 B，你选哪个？今天下班前定",
    quote: "你负责拍板，我负责让大家都支持这个决定"
  },
  "ARBD-ATCP": {
    type: "最佳搭档",
    role: "守护者 + 战士",
    yourRole: "谨慎和关系",
    theirRole: "竞争和理性",
    advantages: [
      "你识别风险，他争取利益——攻守兼备",
      "你维护关系，他正面交锋——既不得罪人又能赢",
      "你容易退缩，他帮你争取——避免吃亏"
    ],
    conflicts: "你觉得他太凶时，想想没有他你可能已经吃亏了；他觉得你太软时，提醒他关系是为了更好的长期合作",
    solution: "让他冲在前面，你跟在后面修复关系：他去谈条款，我去维护关系，分工合作",
    quote: "你负责攻城略地，我负责长治久安"
  },
  "ARBP-ARCD": {
    type: "最佳搭档",
    role: "外交官 + 军师",
    yourRole: "关系和氛围",
    theirRole: "数据和战略",
    advantages: [
      "你维护关系，他守护利益——软硬兼施",
      "你容易妥协，他帮你坚守——有原则地合作",
      "他容易太硬，你帮他软化——避免树敌"
    ],
    conflicts: "你觉得他冷血时，想想没有他团队可能已经亏钱了；他觉得你没原则时，提醒他关系是为了更好的合作",
    solution: "给他时间分析，给他数据支撑：我理解你的担心，这是对方给的具体条件，你看看是否可行",
    quote: "关系我来维系，利益你来守护"
  },
  "ATCD-ARBP": {
    type: "最佳搭档",
    role: "军师 + 外交官",
    yourRole: "数据和竞争",
    theirRole: "关系和合作",
    advantages: [
      "你争取利益，他维护关系——既赢又不得罪人",
      "你容易树敌，他帮你修复——避免被孤立",
      "他容易妥协，你帮他争取——有底线地合作"
    ],
    conflicts: "你觉得他老好人时，想想没有他你可能已经被孤立了；他觉得你冷血时，提醒他你的数据是在保护公司利益",
    solution: "你谈判后，让他去收尾：条款我谈好了，关系你去维护一下",
    quote: "利益我来争取，关系你来修复"
  },
  "ATCP-ARBD": {
    type: "最佳搭档",
    role: "战士 + 守护者",
    yourRole: "理性和竞争",
    theirRole: "谨慎和关系",
    advantages: [
      "你争取最大利益，他识别潜在风险——攻守平衡",
      "你容易冒进，他帮你踩刹车——避免踩坑",
      "他容易保守，你帮他突破——不错过机会"
    ],
    conflicts: "你觉得他胆小，想想没有他你可能已经踩坑了；他觉得你激进，提醒他你的竞争是在争取最大利益",
    solution: "给他风险评估的时间，不要催他：这个风险你评估一下，明天给我结论",
    quote: "你负责踩刹车，我负责踩油门"
  },
  "ATBD-ARCP": {
    type: "最佳搭档",
    role: "指挥官 + 规划师",
    yourRole: "独立和决断",
    theirRole: "战略和协调",
    advantages: [
      "你快速拍板，他协调资源——决策容易落地",
      "你容易独断，他帮你凝聚——避免众叛亲离",
      "他容易犹豫，你帮他拍板——推动事情前进"
    ],
    conflicts: "你觉得他磨叽时，想想没有他你可能已经众叛亲离了；他觉得你独裁时，提醒他你的决断是在推动事情前进",
    solution: "给他协调的时间，他会让你的决策更容易执行：我决定这么做，你去协调一下资源",
    quote: "你负责凝聚人心，我负责拍板决定"
  },
  "ATBP-IRCD": {
    type: "最佳搭档",
    role: "落地者 + 创新者",
    yourRole: "务实和协调",
    theirRole: "创新和竞争",
    advantages: [
      "你负责落地，他负责创新——既有创意又能实现",
      "你容易保守，他帮你突破——不固步自封",
      "他容易冒进，你帮他落地——不是空想"
    ],
    conflicts: "你觉得他不靠谱时，想想没有他你可能还在用老方法；他觉得你保守时，提醒他你的务实是在避免浪费",
    solution: "给他的创意做可行性分析，帮他落地：这个想法很好，我来算算成本和风险",
    quote: "你负责画饼，我负责烙饼"
  },
  "IRCD-ATBP": {
    type: "最佳搭档",
    role: "创新者 + 落地者",
    yourRole: "创新和竞争",
    theirRole: "务实和协调",
    advantages: [
      "你出创意，他做落地——想法能实现",
      "你容易冒进，他帮你踩刹车——避免浪费",
      "他容易保守，你帮他突破——不固步自封"
    ],
    conflicts: "你觉得他没想象力时，想想没有他你的想法可能只是空想；他觉得你不靠谱时，提醒他你的创新是在寻找突破点",
    solution: "给他具体的落地计划，不要只给想法：这个方向我来定，具体怎么落地你来规划",
    quote: "你负责烙饼，我负责画饼"
  },
  "IRCP-ITBD": {
    type: "最佳搭档",
    role: "愿景家 + 实干家",
    yourRole: "愿景和合作",
    theirRole: "执行和创新",
    advantages: [
      "你画愿景，他定计划——方向明确又能干",
      "你容易空想，他帮你实干——不是画大饼",
      "他容易埋头，你帮他抬头看路——不迷失方向"
    ],
    conflicts: "你觉得他没格局时，想想没有他你的愿景可能只是空话；他觉得你画大饼时，提醒他你的愿景是在指引方向",
    solution: "给他清晰的愿景，他会帮你实现：未来三年我们要做到 XX，具体怎么干你来规划",
    quote: "你负责低头拉车，我负责抬头看路"
  },
  "IRBD-ITCP": {
    type: "最佳搭档",
    role: "人脉王 + 执行者",
    yourRole: "人脉和冒险",
    theirRole: "任务和执行",
    advantages: [
      "你找资源，他做事情——资源能变现",
      "你容易冒险，他帮你落地——不是瞎折腾",
      "他容易保守，你帮他突破——不错过机会"
    ],
    conflicts: "你觉得他没情商时，想想没有他你可能已经欠了一堆人情债；他觉得你太飘时，提醒他你的人脉是团队的资源",
    solution: "给他明确的任务，他会帮你完成：这个人我去搞定，具体事情你来执行",
    quote: "你负责做事情，我负责搞关系"
  },
  "IRBP-ITCD": {
    type: "最佳搭档",
    role: "信任 builder + 数据猎手",
    yourRole: "信任和合作",
    theirRole: "数据和竞争",
    advantages: [
      "你建信任，他做背调——既安全又高效",
      "你容易信人，他帮你验证——避免被骗",
      "他容易怀疑，你帮他建立信任——降低交易成本"
    ],
    conflicts: "你觉得他多疑时，想想没有他你可能已经被骗了；他觉得你太天真时，提醒他你的信任是在降低交易成本",
    solution: "让他准备数据，你准备人情：数据你来验证，关系我来维护",
    quote: "你负责验证数据，我负责建立信任"
  },
  "ITCD-IRBP": {
    type: "最佳搭档",
    role: "数据猎手 + 信任 builder",
    yourRole: "数据和竞争",
    theirRole: "信任和合作",
    advantages: [
      "你验证数据，他建立信任——既有依据又有人情",
      "你容易树敌，他帮你修复——避免被孤立",
      "他容易妥协，你帮他争取——有底线地合作"
    ],
    conflicts: "你觉得他老好人时，想想没有他你可能已经被孤立了；他觉得你冷血时，提醒他你的数据是在保护公司利益",
    solution: "你谈判后，让他去收尾：条款我谈好了，关系你去维护一下",
    quote: "你负责建立信任，我负责验证数据"
  },
  "ITCP-ARCD": {
    type: "最佳搭档",
    role: "将军 + 军师",
    yourRole: "执行和竞争",
    theirRole: "战略和数据",
    advantages: [
      "你冲锋陷阵，他出谋划策——胜算更大",
      "你容易冲动，他帮你谋划——避免踩坑",
      "他容易犹豫，他帮你拍板——不错过时机"
    ],
    conflicts: "你觉得他墨迹时，想想没有他你可能已经踩坑了；他觉得你鲁莽时，提醒他你的执行力是团队需要的",
    solution: "给他时间准备数据，他会帮你赢：我需要你今天下午 3 点前给我分析，我 4 点去谈",
    quote: "你负责出谋划策，我负责冲锋陷阵"
  },
  "ITBD-IRCP": {
    type: "最佳搭档",
    role: "实干家 + 愿景家",
    yourRole: "创新和竞争",
    theirRole: "愿景和合作",
    advantages: [
      "你做创新，他描绘愿景——方向明确",
      "你容易埋头，他帮你抬头——不迷失方向",
      "他容易空想，你帮他实干——不是画大饼"
    ],
    conflicts: "你觉得他画大饼时，想想没有他你可能已经迷失方向了；他觉得你没格局时，提醒他你的创新是在推动事情前进",
    solution: "给他创新的自由，他会帮你实现愿景：愿景你来描绘，具体怎么创新我来干",
    quote: "你负责抬头看路，我负责低头拉车"
  },
  "ITBP-IRBD": {
    type: "最佳搭档",
    role: "愿景推动者 + 人脉冒险家",
    yourRole: "愿景和执行",
    theirRole: "人脉和冒险",
    advantages: [
      "你做事情，他搞关系——资源充足",
      "你容易保守，他帮你突破——不错过机会",
      "他容易冒险，你帮他落地——不是瞎折腾"
    ],
    conflicts: "你觉得他太飘时，想想没有他你可能已经错过机会了；他觉得你太保守时，提醒他你的执行是在确保成功",
    solution: "给他明确的方向，他会帮你找资源：方向我来定，资源你去搞定",
    quote: "你负责搞关系，我负责做事情"
  }
};

// 16 种风格代码
const styleCodes = ["ARCD", "ARCP", "ARBD", "ARBP", "ATCD", "ATCP", "ATBD", "ATBP", "IRCD", "IRCP", "IRBD", "IRBP", "ITCD", "ITCP", "ITBD", "ITBP"];

// 风格定义（4 维度）- 与 styles-v2.js 保持一致
const styleDefinitions = {
  ARCD: { A: true, R: true, C: true, D: true, name: "数据军师" },
  ARCP: { A: true, R: true, C: true, P: true, name: "关系达人" },
  ARBD: { A: true, R: true, B: true, D: true, name: "风险侦探" },
  ARBP: { A: true, R: true, B: true, P: true, name: "流程管家" },
  ATCD: { A: true, T: true, C: true, D: true, name: "市场猎手" },
  ATCP: { A: true, T: true, C: true, P: true, name: "拍板侠" },
  ATBD: { A: true, T: true, B: true, D: true, name: "逻辑控" },
  ATBP: { A: true, T: true, B: true, P: true, name: "效率狂人" },
  IRCD: { I: true, R: true, C: true, D: true, name: "直觉玩家" },
  IRCP: { I: true, R: true, C: true, P: true, name: "机会捕手" },
  IRBD: { I: true, R: true, B: true, D: true, name: "人脉王" },
  IRBP: { I: true, R: true, B: true, P: true, name: "和事佬" },
  ITCD: { I: true, T: true, C: true, D: true, name: "变色龙" },
  ITCP: { I: true, T: true, C: true, P: true, name: "社交牛人" },
  ITBD: { I: true, T: true, B: true, D: true, name: "守门员" },
  ITBP: { I: true, T: true, B: true, P: true, name: "行动派" }
};

// 生成其他组合的文案
function generateCooperationGuide(code1, code2) {
  const s1 = styleDefinitions[code1];
  const s2 = styleDefinitions[code2];
  
  // 检查是否是最佳搭档（已定义）
  if (cooperationGuides[code1 + "-" + code2]) {
    return cooperationGuides[code1 + "-" + code2];
  }
  
  // 计算互补度
  let complementScore = 0;
  if (s1.A !== s2.A) complementScore++;
  if (s1.R !== s2.R) complementScore++;
  if (s1.C !== s2.C) complementScore++;
  if (s1.D !== s2.P) complementScore++;
  
  // 生成文案
  let role1, role2;
  if (s1.A && s1.R) role1 = "分析型关系者";
  else if (s1.A && s1.T) role1 = "分析型任务者";
  else if (s1.I && s1.R) role1 = "直觉型关系者";
  else if (s1.I && s1.T) role1 = "直觉型任务者";
  
  if (s2.A && s2.R) role2 = "分析型关系者";
  else if (s2.A && s2.T) role2 = "分析型任务者";
  else if (s2.I && s2.R) role2 = "直觉型关系者";
  else if (s2.I && s2.T) role2 = "直觉型任务者";
  
  let type, advantages, conflicts, solution, quote;
  
  if (complementScore >= 3) {
    type = "高度互补";
    advantages = [
      "你" + (s1.A ? "理性分析" : "直觉洞察") + "，他" + (s2.A ? "理性分析" : "直觉洞察") + "——视角互补",
      "你" + (s1.R ? "注重关系" : "注重任务") + "，他" + (s2.R ? "注重关系" : "注重任务") + "——关注点互补",
      "你们可以互相学习，取长补短"
    ];
    conflicts = "你们差异较大，初期可能需要磨合——但磨合好后会是非常强的组合";
    solution = "尊重彼此的不同，发挥各自的优势：你擅长 XX，我擅长 XX，我们分工合作";
    quote = "差异让我们更强";
  } else if (complementScore >= 2) {
    type = "互补合作";
    advantages = [
      "你们有部分互补，可以分工合作",
      "相似的地方让你们容易理解彼此",
      "不同的地方让你们互相补充"
    ];
    conflicts = "你们在某些方面可能有分歧——但这是正常的，关键是沟通";
    solution = "找到共同目标，分工合作：我们的目标一致，方法可以不同";
    quote = "和而不同，合作共赢";
  } else {
    type = "相似共鸣";
    advantages = [
      "你们很相似，容易理解彼此的想法",
      "沟通成本低，一拍即合",
      "可以一起深入研究某个方向"
    ];
    conflicts = "你们容易有相同的盲点——需要警惕群体思维";
    solution = "有意识地寻找外部意见，避免盲点：我们俩都这么想，但外人会怎么看？";
    quote = "相似让我们默契，但也要警惕盲点";
  }
  
  return {
    type: type,
    role: role1 + " + " + role2,
    yourRole: s1.name,
    theirRole: s2.name,
    advantages: advantages,
    conflicts: conflicts,
    solution: solution,
    quote: quote
  };
}

// 导出函数 - 浏览器全局
function getCooperationGuide(code1, code2) {
  const key1 = code1 + "-" + code2;
  const key2 = code2 + "-" + code1;
  
  if (cooperationGuides[key1]) {
    return cooperationGuides[key1];
  }
  
  return generateCooperationGuide(code1, code2);
}

// 暴露到全局作用域
if (typeof window !== "undefined") {
  window.cooperationGuides = cooperationGuides;
  window.getCooperationGuide = getCooperationGuide;
  window.generateCooperationGuide = generateCooperationGuide;
  window.styleDefinitions = styleDefinitions;
}
