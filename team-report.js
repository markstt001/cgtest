/**
 * team-report.js v5.0 — 团队报告：对标完整16种风格 × 8大能力全集
 *
 * 所有结论从成员 4 字母代码动态推导，无硬编码。
 * 核心参考系 = 完整的 16 种谈判风格 × 8 大核心能力，而非仅团队内部。
 *
 * 依赖：team-report-data.js（成员列表 + 课程库）
 *       styles-v3.js / cooperation-guides.js（styleDefinitions）
 */

/* ═══════════════════════════════════════════
   0. 16 种风格全集 + 8 大能力 + styleDefinitions
   ═══════════════════════════════════════════ */
var ALL_STYLES = [
  'ARCD','ARCP','ARBD','ARBP',
  'ATCD','ATCP','ATBD','ATBP',
  'IRCD','IRCP','IRBD','IRBP',
  'ITCD','ITCP','ITBD','ITBP'
];

if (typeof window.styleDefinitions === 'undefined') {
  window.styleDefinitions = {
    ARCD: { name: "数据军师", animal: "🦉" }, ARCP: { name: "关系达人", animal: "🦉" },
    ARBD: { name: "守门员",   animal: "🦉" }, ARBP: { name: "流程管家", animal: "🦉" },
    ATCD: { name: "市场猎手", animal: "🦅" }, ATCP: { name: "拍板侠",   animal: "🦅" },
    ATBD: { name: "逻辑控",   animal: "🦅" }, ATBP: { name: "效率狂人", animal: "🦅" },
    IRCD: { name: "直觉玩家", animal: "🦊" }, IRCP: { name: "机会捕手", animal: "🦊" },
    IRBD: { name: "人脉王",   animal: "🦊" }, IRBP: { name: "和事佬",   animal: "🦊" },
    ITCD: { name: "变色龙",   animal: "🐺" }, ITCP: { name: "社交牛人", animal: "🐺" },
    ITBD: { name: "守门员",   animal: "🐺" }, ITBP: { name: "行动派",   animal: "🐺" }
  };
}

// 每种风格的核心能力标签
var STYLE_CAPABILITIES = {
  ARCD: ['数据分析','关系维护','竞争博弈','风险管控'],
  ARCP: ['数据分析','关系维护','竞争博弈','敏捷开拓'],
  ARBD: ['数据分析','关系维护','合作共赢','风险管控'],
  ARBP: ['数据分析','关系维护','合作共赢','敏捷开拓'],
  ATCD: ['数据分析','任务驱动','竞争博弈','风险管控'],
  ATCP: ['数据分析','任务驱动','竞争博弈','敏捷开拓'],
  ATBD: ['数据分析','任务驱动','合作共赢','风险管控'],
  ATBP: ['数据分析','任务驱动','合作共赢','敏捷开拓'],
  IRCD: ['直觉洞察','关系维护','竞争博弈','风险管控'],
  IRCP: ['直觉洞察','关系维护','竞争博弈','敏捷开拓'],
  IRBD: ['直觉洞察','关系维护','合作共赢','风险管控'],
  IRBP: ['直觉洞察','关系维护','合作共赢','敏捷开拓'],
  ITCD: ['直觉洞察','任务驱动','竞争博弈','风险管控'],
  ITCP: ['直觉洞察','任务驱动','竞争博弈','敏捷开拓'],
  ITBD: ['直觉洞察','任务驱动','合作共赢','风险管控'],
  ITBP: ['直觉洞察','任务驱动','合作共赢','敏捷开拓']
};

// 8 大核心能力维度
var ALL_CAPABILITIES = ['数据分析','直觉洞察','关系维护','任务驱动','竞争博弈','合作共赢','风险管控','敏捷开拓'];

// 4 大维度标签映射
var DIM_LABEL_MAP = { A:'分析型', I:'直觉型', R:'关系型', T:'任务型', C:'竞争型', B:'合作型', D:'防御型', P:'开拓型' };

// 4 大维度配对
var DIM_PAIRS = [
  { pos:'A', neg:'I', posLabel:'分析型', negLabel:'直觉型' },
  { pos:'R', neg:'T', posLabel:'关系型', negLabel:'任务型' },
  { pos:'C', neg:'B', posLabel:'竞争型', negLabel:'合作型' },
  { pos:'D', neg:'P', posLabel:'防御型', negLabel:'开拓型' }
];

/* ═══════════════════════════════════════════
   1. 基础计算
   ═══════════════════════════════════════════ */

/** 获取某维度字母对应的成员列表 */
function dimMembers(members, letter) {
  return members.filter(function(m){ return m.code.toUpperCase().indexOf(letter) >= 0; });
}

function pct(n, total) { return total > 0 ? Math.round(n / total * 100) : 0; }

/** 维度计数 */
function countDimensions(members) {
  var d = { A:0, I:0, R:0, T:0, C:0, B:0, D:0, P:0 };
  members.forEach(function(m) {
    var c = m.code.toUpperCase();
    if(c[0]==='A') d.A++; else d.I++;
    if(c[1]==='R') d.R++; else d.T++;
    if(c[2]==='C') d.C++; else d.B++;
    if(c[3]==='D') d.D++; else d.P++;
  });
  return d;
}

/**
 * 能力覆盖分析 — 对标完整 16 种风格 × 8 大能力全集
 * 返回：覆盖的能力、缺失的能力、缺失的风格列表、覆盖率
 */
function computeCapabilityCoverage(members) {
  var covered = {};
  var coveredStyles = {};
  members.forEach(function(m) {
    (STYLE_CAPABILITIES[m.code.toUpperCase()] || []).forEach(function(c) { covered[c] = true; });
    coveredStyles[m.code.toUpperCase()] = true;
  });
  var presentCaps = ALL_CAPABILITIES.filter(function(c) { return covered[c]; });
  var missingCaps = ALL_CAPABILITIES.filter(function(c) { return !covered[c]; });
  var missingStyles = ALL_STYLES.filter(function(s) { return !coveredStyles[s]; });
  return {
    presentCaps: presentCaps,
    missingCaps: missingCaps,
    capPct: Math.round(presentCaps.length / ALL_CAPABILITIES.length * 100),
    stylePct: Math.round(Object.keys(coveredStyles).length / ALL_STYLES.length * 100),
    uniqueStyleCount: Object.keys(coveredStyles).length,
    missingStyles: missingStyles
  };
}

/* ═══════════════════════════════════════════
   2. 团队综合评分算法
   ═══════════════════════════════════════════
 * 基准分 30 分，满分 100：
 * ① 能力覆盖（0-15）：8 大能力覆盖比例
 * ② 风格覆盖（0-10）：16 种风格覆盖比例
 * ③ 维度均衡（0-15）：四个维度少数派占比之和
 * ④ 互补指数（0-10）：两人配对中 ≥2 维不同的比例
 * ⑤ 规模分（0-10）：对数曲线，2人起分
 * ⑥ 能力深度（0-10）：每个能力至少有2人覆盖（单点覆盖有断层风险）
 */
function computeScore(members, dim) {
  var total = members.length;
  if(total === 0) return { value: 0, level: '数据不足', percentile: 0, emoji: '—' };

  var cap = computeCapabilityCoverage(members);

  // ① 能力覆盖分：8 大能力覆盖率 × 20
  var capScore = Math.round(cap.capPct / 100 * 20);

  // ② 风格覆盖分：16 种风格覆盖率 × 15
  var styleScore = Math.round(cap.stylePct / 100 * 15);

  // ③ 维度均衡分：四个维度少数派占比之和，映射 0~15
  var minorPct = 0;
  if(total > 0) {
    minorPct = Math.min(dim.A, dim.I) / total +
               Math.min(dim.R, dim.T) / total +
               Math.min(dim.C, dim.B) / total +
               Math.min(dim.D, dim.P) / total;
  }
  var balanceScore = Math.round(minorPct / 2 * 15);

  // ④ 互补分
  var pairCount = 0, compCount = 0;
  for(var i = 0; i < members.length; i++) {
    for(var j = i + 1; j < members.length; j++) {
      pairCount++;
      var diff = 0;
      for(var k = 0; k < 4; k++) { if(members[i].code[k] !== members[j].code[k]) diff++; }
      if(diff >= 2) compCount++;
    }
  }
  var compRate = pairCount > 0 ? compCount / pairCount : 0;
  var compScore = Math.round(compRate * 10);

  // ⑤ 规模分：log2 曲线
  var sizeScore = Math.min(10, Math.round(1 + 3 * Math.log2(Math.max(2, total))));

  // ⑥ 能力深度分：每个能力有多少人覆盖（单点覆盖有断层风险），满分 10
  var depthScores = [];
  ALL_CAPABILITIES.forEach(function(c) {
    var count = members.filter(function(m) { return (STYLE_CAPABILITIES[m.code.toUpperCase()]||[]).indexOf(c) >= 0; }).length;
    // 每个能力至少2人覆盖才安全
    depthScores.push(Math.min(1, count / 2));
  });
  var avgDepth = depthScores.reduce(function(a,b){return a+b;},0) / depthScores.length;
  var depthScore = Math.round(avgDepth * 10);

  var raw = 30 + capScore + styleScore + balanceScore + compScore + sizeScore + depthScore;
  var value = Math.min(100, Math.max(0, raw));

  var level, emoji;
  if(value >= 90)      { level = '卓越'; emoji = '🏆'; }
  else if(value >= 80) { level = '优秀'; emoji = '🥇'; }
  else if(value >= 70) { level = '良好'; emoji = '🥈'; }
  else if(value >= 60) { level = '合格'; emoji = '🥉'; }
  else                 { level = '待提升'; emoji = '📋'; }

  var z = (value - 65) / 15;
  var percentile = Math.round(normalCDF(z) * 100);
  return { value: value, level: level, percentile: percentile, emoji: emoji };
}

function normalCDF(z) {
  var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  var a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  var sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.SQRT2;
  var t = 1 / (1 + p * z);
  var y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  return 0.5 * (1 + sign * y);
}

/* ═══════════════════════════════════════════
   3. 团队类型算法 — 对标全集
   ═══════════════════════════════════════════ */
function computeTeamType(members, dim) {
  var total = members.length;
  var cap = computeCapabilityCoverage(members);

  var uniqueCodes = {};
  members.forEach(function(m){ uniqueCodes[m.code] = true; });
  var diversity = Object.keys(uniqueCodes).length / total;

  var majorPcts = [
    Math.max(dim.A, dim.I)/total,
    Math.max(dim.R, dim.T)/total,
    Math.max(dim.C, dim.B)/total,
    Math.max(dim.D, dim.P)/total
  ];
  var avg = majorPcts.reduce(function(a,b){return a+b;},0) / 4;
  var stdDev = Math.sqrt(majorPcts.reduce(function(s,v){ return s + (v-avg)*(v-avg); },0) / 4);

  var pairCount = 0, compCount = 0;
  for(var i=0; i<members.length; i++) {
    for(var j=i+1; j<members.length; j++) {
      pairCount++; var diff = 0;
      for(var k=0; k<4; k++) { if(members[i].code[k] !== members[j].code[k]) diff++; }
      if(diff >= 2) compCount++;
    }
  }
  var compIndex = pairCount > 0 ? compCount / pairCount : 0;

  // 综合判定：能力覆盖 + 风格覆盖 + 多样性 + 均衡 + 互补
  if(cap.capPct >= 75 && compIndex >= 0.6 && stdDev < 0.15) {
    return {
      emoji: '🔀', label: '互补型团队',
      desc: '能力覆盖全面（' + cap.capPct + '%），风格多样（' + cap.stylePct + '%），互补性强。建议加强跨风格沟通，最大化协同效应。'
    };
  } else if(cap.capPct < 50) {
    return {
      emoji: '🎯', label: '专精型团队',
      desc: '能力覆盖有限（仅 ' + cap.capPct + '%），在特定领域有突出优势，但存在 ' + cap.missingCaps.length + ' 项能力缺口：' + cap.missingCaps.join('、') + '。建议通过外部协作或培训补充短板。'
    };
  } else if(compIndex < 0.4) {
    return {
      emoji: '🔗', label: '同质型团队',
      desc: '成员风格相似度较高，协作默契但缺乏互补。在熟悉场景下效率高，面对复杂挑战时可能缺少多元视角。'
    };
  } else {
    return {
      emoji: '⚡', label: '混合型团队',
      desc: '能力覆盖 ' + cap.capPct + '%，风格覆盖 ' + cap.stylePct + '%，部分维度互补，部分维度集中。建议在互补维度上加强协作，在集中维度上注意盲点。'
    };
  }
}

/* ═══════════════════════════════════════════
   4. 角色定位算法 — 对标全集
   ═══════════════════════════════════════════ */
function computeRoles(members, dim) {
  var total = members.length;
  var cap = computeCapabilityCoverage(members);

  return members.map(function(m) {
    var code = m.code.toUpperCase();
    var sameCount = members.filter(function(x){ return x.code === m.code; }).length;
    var scarcity = 1 / sameCount;

    var bridgeCount = 0;
    members.forEach(function(other) {
      if(other.name === m.name) return;
      var diff = 0;
      for(var k=0; k<4; k++) { if(code[k] !== other.code[k]) diff++; }
      if(diff >= 2) bridgeCount++;
    });
    var bridge = total > 1 ? bridgeCount / (total - 1) : 0;

    // 该成员覆盖了团队缺失的哪些能力
    var memberCaps = STYLE_CAPABILITIES[code] || [];
    var coversMissing = memberCaps.filter(function(c) { return cap.missingCaps.indexOf(c) >= 0; });
    var balance = cap.missingCaps.length > 0 ? coversMissing.length / cap.missingCaps.length : 0;

    var score = scarcity * 0.4 + bridge * 0.35 + balance * 0.25;

    // 计算少数维度数量（该维度持有者 ≤ team/2）
    var dimCount = [{A:0,I:0},{R:0,T:0},{C:0,B:0},{D:0,P:0}];
    members.forEach(function(mm) {
      dimCount[0][mm.code[0]]++;
      dimCount[1][mm.code[1]]++;
      dimCount[2][mm.code[2]]++;
      dimCount[3][mm.code[3]]++;
    });
    var minorityDims = 0;
    var half = Math.ceil(total / 2);
    if(dimCount[0][code[0]] <= half) minorityDims++;
    if(dimCount[1][code[1]] <= half) minorityDims++;
    if(dimCount[2][code[2]] <= half) minorityDims++;
    if(dimCount[3][code[3]] <= half) minorityDims++;

    var role;
    if(total < 3) {
      role = sameCount === 1 ? '独特风格' : '团队中坚';
    } else if(code[0] === 'I' && dimCount[0].I === 1) {
      // 团队中唯一的直觉型成员 → 洞察补充
      role = '洞察补充';
    } else if(code[3] === 'P' && dimCount[3].P === 1 && minorityDims >= 2) {
      // 唯一的开拓型 + 至少2个少数维度 → 创新先锋
      role = '创新先锋';
    } else if(code[0] === 'A' && code[2] === 'C' && minorityDims >= 2) {
      // 分析型 + 竞争型 + 至少2个少数维度 → 核心骨干
      role = '核心骨干';
    } else if(code[2] === 'C' && code[3] === 'D') {
      // 竞争型 + 防御型 → 谈判主力
      role = '谈判主力';
    } else if(code[2] === 'B' && code[3] === 'P') {
      // 合作型 + 开拓型 → 运营中坚
      role = '运营中坚';
    } else if(bridge >= 0.5) {
      // 高互补性 → 协作力量
      role = '协作力量';
    } else {
      role = '团队中坚';
    }

    return {
      name: m.name,
      code: m.code,
      role: role,
      coversMissing: coversMissing,
      scores: { scarcity: scarcity, bridge: bridge, balance: balance, total: score }
    };
  });
}

/* ═══════════════════════════════════════════
   5. 团队核心优势算法 — 仅展示占比≥50%的维度/能力
   ═══════════════════════════════════════════ */
function computeAdvantages(members, dim) {
  var total = members.length;
  var advantages = [];

  // 4 大维度：占比 ≥50% 的优势维度
  DIM_PAIRS.forEach(function(dp) {
    var posCount = dim[dp.pos], negCount = dim[dp.neg];
    var posPct = posCount / total;
    var negPct = negCount / total;

    // 多数派 ≥50% → 优势
    if(posPct >= 0.5) {
      var names = dimMembers(members, dp.pos).map(function(m){ return m.name; });
      var impact = '';
      switch(dp.pos) {
        case 'A': impact = '团队具备数据驱动的决策能力，善于成本分析和市场信息收集，在供应商评估、价格谈判、合同审核等环节表现优异。'; break;
        case 'R': impact = '团队善于维护供应商关系和内部协调，注重长期合作，善于化解冲突。供应商满意度高，紧急情况下能获得供应商支持。'; break;
        case 'C': impact = '团队在谈判中善于争取最大利益，底线意识强。谈判成果优异，采购成本可控。'; break;
        case 'D': impact = '团队谨慎保守，善于识别和规避风险。采购合规性高，合同风险低，供应链稳定性强。'; break;
      }
      advantages.push({
        type: 'dimension',
        icon: '📐',
        title: dp.posLabel + '主导',
        desc: '团队中 ' + names.length + ' 人（' + pct(posCount, total) + '%）为' + dp.posLabel + '（' + names.join('、') + '），善于' + (dp.pos === 'A' ? '数据分析和逻辑推理' : dp.pos === 'R' ? '维护供应商关系和内部协调' : dp.pos === 'C' ? '在谈判中争取最大利益' : '识别和规避风险') + '。',
        impact: '💼 业务影响：' + impact
      });
    }

    // 少数派 ≥50%（即少数派其实是多数）
    if(negPct >= 0.5 && posPct < 0.5) {
      var names = dimMembers(members, dp.neg).map(function(m){ return m.name; });
      var impact = '';
      switch(dp.neg) {
        case 'I': impact = '团队具备敏锐的市场嗅觉，能快速捕捉创新机会和非量化信息，在创新品类引入、市场趋势判断方面表现突出。'; break;
        case 'T': impact = '团队目标明确，执行力强，能高效推进项目落地。项目推进高效，KPI 达成率高。'; break;
        case 'B': impact = '团队善于建立长期合作关系，追求双赢结果。供应商忠诚度高，长期合作稳定性强。'; break;
        case 'P': impact = '团队敢于尝试新方法，行动敏捷。市场响应快，创新机会捕捉能力强。'; break;
      }
      advantages.push({
        type: 'dimension',
        icon: '📐',
        title: dp.negLabel + '主导',
        desc: '团队中 ' + names.length + ' 人（' + pct(negCount, total) + '%）为' + dp.negLabel + '（' + names.join('、') + '），善于' + (dp.neg === 'I' ? '直觉洞察和创新思维' : dp.neg === 'T' ? '目标执行和高效推进' : dp.neg === 'B' ? '建立长期合作关系和追求双赢' : '敏捷行动和创新尝试') + '。',
        impact: '💼 业务影响：' + impact
      });
    }
  });

  return advantages;
}

/* ═══════════════════════════════════════════
   6. 潜在风险算法 — 仅展示占比<50%的维度，4 部分内容
   ═══════════════════════════════════════════ */
function computeRisks(members, dim, cap) {
  var total = members.length;
  var risks = [];

  // 8 大能力缺失 → 风险
  cap.missingCaps.forEach(function(c) {
    var riskMap = {
      '数据分析': { icon: '⚠️', title: '数据分析能力缺失', desc: '团队完全缺乏数据分析能力，决策可能凭感觉或经验。', alert: '大型供应商评估、复杂合同审核等需要深度分析的场景。', fix: '1) 引入数据分析工具；2) 招聘分析型人才；3) 建立数据驱动决策流程。' },
      '直觉洞察': { icon: '⚠️', title: '直觉洞察能力缺失', desc: '团队缺乏创新思维和敏锐的市场嗅觉。', alert: '新兴市场进入、创新品类采购、供应商早期介入等场景。', fix: '1) 引入外部行业专家顾问；2) 建立市场情报收集机制；3) 鼓励创新思维。' },
      '关系维护': { icon: '⚠️', title: '关系维护能力缺失', desc: '团队可能忽略供应商关系和内部协调。', alert: '战略供应商关系管理、冲突化解等场景。', fix: '1) 加强关系管理培训；2) 建立供应商沟通机制；3) 招聘关系型人才。' },
      '任务驱动': { icon: '⚠️', title: '任务执行能力缺失', desc: '团队可能缺乏目标执行力和效率。', alert: '成本削减项目、供应商绩效考核等需要强执行的场景。', fix: '1) 建立明确的 KPI 和授权机制；2) 引入项目管理工具。' },
      '竞争博弈': { icon: '⚠️', title: '竞争能力缺失', desc: '团队在谈判中可能过于妥协，无法争取最大利益。', alert: '价格谈判、合同条款博弈等场景。', fix: '1) 谈判前制定 BATNA；2) 设定谈判底线；3) 招聘竞争型人才。' },
      '合作共赢': { icon: '⚠️', title: '合作共赢能力缺失', desc: '团队可能过于强势，影响长期合作关系。', alert: '战略供应商长期合作、联合创新等场景。', fix: '1) 建立共赢谈判框架；2) 定期评估供应商满意度；3) 培养合作思维。' },
      '风险管控': { icon: '⚠️', title: '风险控制能力缺失', desc: '团队可能过于冒进，忽略潜在风险。', alert: '合同审核、合规检查、高风险采购等场景。', fix: '1) 建立强制风险评估流程；2) 引入第三方风控；3) 招聘风控型人才。' },
      '敏捷开拓': { icon: '⚠️', title: '开拓创新能力缺失', desc: '团队可能反应迟缓，错失市场窗口期。', alert: '紧急采购、价格波动应对、供应商切换等场景。', fix: '1) 建立分级决策机制；2) 为成员授权快速决策权限；3) 引入敏捷方法。' }
    };
    var r = riskMap[c] || { icon: '⚠️', title: c + '能力缺失', desc: '', alert: '', fix: '' };
    risks.push({ type:'capability', icon: r.icon, title: r.title, desc: r.desc, alert: r.alert, fix: r.fix });
  });

  // 4 大维度：占比 <50% 的维度 → 风险（4 部分内容）
  DIM_PAIRS.forEach(function(dp) {
    var posCount = dim[dp.pos], negCount = dim[dp.neg];
    var posPct = posCount / total;
    var negPct = negCount / total;

    // 判断少数派是哪一方
    var minorityLabel, minorityCount, majorityLabel;
    if(negCount < posCount) {
      minorityLabel = dp.negLabel; minorityCount = negCount; majorityLabel = dp.posLabel;
    } else {
      minorityLabel = dp.posLabel; minorityCount = posCount; majorityLabel = dp.negLabel;
    }

    var minorityPct = minorityCount / total;
    if(minorityPct < 0.5) {
      var minorityLetter = minorityLabel === dp.posLabel ? dp.pos : dp.neg;
      var minorityNames = dimMembers(members, minorityLetter).map(function(m){ return m.name; });
      var impact = '';
      switch(minorityLabel) {
        case '直觉型': impact = '过度依赖数据可能导致错失非量化机会。'; break;
        case '分析型': impact = '过度依赖直觉可能导致决策缺乏数据支撑。'; break;
        case '任务型': impact = '过度注重关系可能导致成本妥协和效率下降。'; break;
        case '关系型': impact = '过度追求任务可能影响团队氛围和供应商关系。'; break;
        case '合作型': impact = '竞争意识过强可能导致谈判零和化和供应商关系紧张。'; break;
        case '竞争型': impact = '过度妥协可能无法为团队争取最大利益。'; break;
        case '开拓型': impact = '过度防御可能错失市场窗口和创新机会。'; break;
        case '防御型': impact = '过度冒进可能忽略潜在风险，造成损失。'; break;
      }
      risks.push({
        type: 'dimension',
        icon: '💭',
        title: minorityLabel + '成员不足',
        desc: '团队中' + minorityLabel + '成员只有 ' + minorityCount + ' 人（' + pct(minorityCount, total) + '%）' + (minorityNames.length > 0 ? '（' + minorityNames.join('、') + '）' : '') + '，可能影响' + (minorityLabel === '直觉型' ? '创新思维和市场机会识别' : minorityLabel === '分析型' ? '数据驱动的决策能力' : minorityLabel === '任务型' ? '目标执行力和项目推进效率' : minorityLabel === '关系型' ? '供应商关系维护和内部协调' : minorityLabel === '合作型' ? '长期合作关系的建立和维护' : minorityLabel === '竞争型' ? '谈判中争取最大利益的能力' : minorityLabel === '开拓型' ? '市场响应速度和创新尝试' : '风险识别和规避') + '。' + impact,
        alert: getRiskAlert(minorityLabel),
        fix: getRiskFix(minorityLabel, minorityNames)
      });
    }
  });

  return risks;
}

function getRiskAlert(label) {
  switch(label) {
    case '直觉型': return '新兴市场进入、创新品类采购、供应商早期介入等需要直觉判断的场景可能表现欠佳。';
    case '分析型': return '复杂供应商评估、数据驱动的谈判策略制定等需要深度分析的场景可能缺乏支撑。';
    case '任务型': return '成本削减项目、供应商绩效考核、紧急交付等需要强执行力的场景可能推进缓慢。';
    case '关系型': return '战略供应商关系管理、跨部门协调、冲突化解等需要关系维护的场景可能处理生硬。';
    case '合作型': return '战略供应商长期合作、联合创新、供应商早期介入等需要共赢思维的场景可能谈判僵化。';
    case '竞争型': return '价格谈判、合同条款博弈、供应商压价等需要竞争意识的场景可能让步过多。';
    case '开拓型': return '紧急采购、价格波动应对、供应商切换等需要快速响应的场景可能行动迟缓。';
    case '防御型': return '高风险采购、合同审核、合规检查、新供应商引入等需要风险把控的场景可能过于冒进。';
    default: return '';
  }
}

function getRiskFix(label, names) {
  var nameStr = names.length > 0 ? names.join('、') : '';
  switch(label) {
    case '直觉型': return '1) 为直觉型成员（' + nameStr + '）创造更多表达洞察的机会；2) 引入外部行业专家顾问；3) 建立市场情报收集机制，补充数据盲区。';
    case '分析型': return '1) 为分析型成员（' + nameStr + '）提供数据分析工具和培训；2) 引入商业智能系统；3) 建立数据驱动的决策流程。';
    case '任务型': return '1) 为任务型成员（' + nameStr + '）设定明确的 KPI 和授权机制；2) 引入项目管理工具；3) 建立高效的执行流程。';
    case '关系型': return '1) 为关系型成员（' + nameStr + '）提供更多供应商沟通机会；2) 建立定期的供应商沟通机制；3) 加强内部协调培训。';
    case '合作型': return '1) 为合作型成员（' + nameStr + '）创造更多协作场景；2) 建立共赢谈判框架；3) 定期评估供应商满意度。';
    case '竞争型': return '1) 为竞争型成员（' + nameStr + '）提供谈判策略培训；2) 谈判前制定 BATNA 和底线；3) 招聘竞争型人才。';
    case '开拓型': return '1) 为开拓型成员（' + nameStr + '）提供更多创新试点机会；2) 建立分级决策机制；3) 为成员授权快速决策权限。';
    case '防御型': return '1) 为防御型成员（' + nameStr + '）提供风险管控工具；2) 建立强制风险评估流程；3) 引入第三方风控。';
    default: return '';
  }
}

/* ═══════════════════════════════════════════
   7. 最佳拍档算法 — 只针对最匹配的成员进行配对
   ═══════════════════════════════════════════ */
function computePairs(members) {
  var bestMatchMap = {
    ARCD:'ARBP', ARCP:'ATBD', ARBD:'ATCP', ARBP:'ARCD',
    ATCD:'ARBP', ATCP:'ARBD', ATBD:'ARCP', ATBP:'IRCD',
    IRCD:'ATBP', IRCP:'ITBD', IRBD:'ITCP', IRBP:'ITCD',
    ITCD:'IRBP', ITCP:'ARCD', ITBD:'IRCP', ITBP:'IRBD'
  };

  // 找出所有 ≥2 维不同的配对
  var allCombos = [];
  for(var i=0; i<members.length; i++) {
    for(var j=i+1; j<members.length; j++) {
      var diff = 0; for(var k=0;k<4;k++) if(members[i].code[k]!==members[j].code[k]) diff++;
      if(diff < 2) continue;
      var isPerfect = (members[j].code === bestMatchMap[members[i].code]) || (members[i].code === bestMatchMap[members[j].code]);
      allCombos.push({
        m1: members[i], m2: members[j], i: i, j: j,
        level: isPerfect ? '天作之合' : '互补合作',
        levelIcon: isPerfect ? '💕' : '🤝',
        levelClass: isPerfect ? '高度互补' : '中度互补',
        diff: diff, dims: getComplementDims(members[i].code, members[j].code),
        score: isPerfect ? 100 + diff * 10 : diff * 10
      });
    }
  }
  allCombos.sort(function(a,b){ return b.score - a.score; });

  // 贪心选择不重叠的主配对
  var usedPrimary = {}, primary = [];
  for(var c=0; c<allCombos.length; c++) {
    var combo = allCombos[c];
    if(!usedPrimary[combo.i] && !usedPrimary[combo.j]) {
      primary.push({ m1:combo.m1, m2:combo.m2, level:combo.level, levelIcon:combo.levelIcon, levelClass:combo.levelClass, diff:combo.diff, dims:combo.dims });
      usedPrimary[combo.i] = true; usedPrimary[combo.j] = true;
    }
  }

  var unpaired = members.filter(function(_,idx){ return !usedPrimary[idx]; });
  return { pairs: primary, unpaired: unpaired };
}

function getComplementDims(c1,c2) {
  var labels=['A/I','R/T','C/B','D/P'], dims=[];
  for(var i=0;i<4;i++) if(c1[i]!==c2[i]) dims.push(labels[i]);
  return dims;
}

function buildPairReason(p) {
  var dimText = p.diff === 4 ? '4 个维度全部不同' : p.diff + ' 个维度不同（' + p.dims.join('、') + '）';
  var values = [];
  if(p.dims.indexOf('A/I')>=0) {
    values.push(p.m1.name+' 的'+(p.m1.code[0]==='A'?'数据分析':'直觉洞察')+' + '+p.m2.name+' 的'+(p.m2.code[0]==='A'?'数据分析':'直觉洞察')+' = 全面决策');
  }
  if(p.dims.indexOf('R/T')>=0) {
    values.push((p.m1.code[1]==='R'?'关系维护':'任务执行')+' + '+(p.m2.code[1]==='R'?'关系维护':'任务执行')+' = 刚柔并济');
  }
  if(p.dims.indexOf('C/B')>=0) {
    values.push((p.m1.code[2]==='C'?'竞争意识':'合作共赢')+' + '+(p.m2.code[2]==='C'?'竞争意识':'合作共赢')+' = 平衡利益与关系');
  }
  if(p.dims.indexOf('D/P')>=0) {
    values.push((p.m1.code[3]==='D'?'防御谨慎':'开拓敏捷')+' + '+(p.m2.code[3]==='D'?'防御谨慎':'开拓敏捷')+' = 平衡风险与速度');
  }
  if(values.length===0) values.push('风格互补，协作潜力大');

  // 根据配对维度组合生成差异化推荐场景
  var scenes = getPairScenes(p.dims);

  return '<strong>互补维度：</strong>'+dimText+'<br><strong>协作价值：</strong>'+values.join('；')+'<br><strong>推荐场景：</strong>'+scenes;
}

function getPairScenes(dims) {
  var hasDP = dims.indexOf('D/P') >= 0;
  var hasCB = dims.indexOf('C/B') >= 0;
  var hasAI = dims.indexOf('A/I') >= 0;
  var hasRT = dims.indexOf('R/T') >= 0;

  if(dims.length >= 4) return '全面覆盖各类谈判场景，包括战略供应商选择、重大合同谈判、成本优化项目、创新品类引入等';
  if(hasDP && hasCB) return '适合需要平衡风险与速度、同时兼顾利益与关系的场景，如战略供应商谈判、重大合同博弈';
  if(hasDP && hasAI) return '适合需要同时把控风险与速度、又需要数据与直觉结合的场景，如市场趋势判断、供应商风险评估';
  if(hasDP && hasRT) return '适合需要在执行效率与风险把控之间取得平衡的场景，如紧急采购、项目推进';
  if(hasCB && hasAI) return '适合需要平衡利益关系又需要数据支撑的场景，如供应商评估、价格谈判';
  if(hasCB && hasRT) return '适合需要兼顾关系维护与利益争取的场景，如供应商关系管理、长期合作谈判';
  if(hasAI && hasRT) return '适合需要数据分析与快速执行并重的场景，如市场调研、竞品分析';
  if(hasDP) return '适合需要在风险与速度间平衡的场景，如紧急采购、供应商切换';
  if(hasCB) return '适合需要平衡利益与关系的场景，如供应商谈判、合同条款协商';
  if(hasAI) return '适合需要结合数据与直觉的场景，如市场趋势判断、新品类引入';
  if(hasRT) return '适合需要平衡关系与执行的场景，如供应商管理、跨部门协调';
  return '风格互补，适合各类协作场景';
}

/* ═══════════════════════════════════════════
   8. 招聘建议算法 — 基于维度短板和能力缺口
   ═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   8. 招聘建议算法 — 四要素结构
   ═══════════════════════════════════════════ */

// 风格→画像/岗位/面试映射表
var HIRING_PROFILES = {
  'A': { profile: 'ARCD（数据军师）或 ATCD（市场猎手）', jobs: ['数据分析岗', '成本分析岗'], interview: '场景模拟：给出一份供应商报价数据和市场趋势报告，请在 10 分钟内输出一份供应商评估建议。' },
  'I': { profile: 'ITCP（社交牛人）或 IRCP（机会捕手）', jobs: ['市场情报岗', '创新采购岗'], interview: '场景模拟：面对全新供应商品类，如何在信息不足时做出判断？请描述你的决策过程。' },
  'R': { profile: 'ARCP（关系达人）或 IRBP（和事佬）', jobs: ['供应商关系岗', '战略合作岗'], interview: '情景测试：战略供应商要求涨价 20%，同时内部催签合同，你如何平衡双方需求？' },
  'T': { profile: 'ATCD（市场猎手）或 ITCD（变色龙）', jobs: ['战略寻源岗', '项目采购岗'], interview: '案例分析：如何在 3 天内完成一项成本削减 15% 的紧急采购任务？请列出关键步骤。' },
  'C': { profile: 'ARCD（数据军师）或 ATCP（拍板侠）', jobs: ['商务谈判岗', '合同管理岗'], interview: '角色扮演：供应商报价高于预算 30%，请现场模拟你的谈判策略和底线把控。' },
  'B': { profile: 'ARBP（流程管家）或 IRBP（和事佬）', jobs: ['供应商关系岗', '战略合作岗'], interview: '情景测试：供应商要求涨价 20%，如何在坚持底线的同时维护长期合作关系？' },
  'D': { profile: 'ARBD（守门员）或 ATBD（逻辑控）', jobs: ['风控合规岗', '合同审核岗'], interview: '案例分析：一份新供应商合同中存在 3 处模糊条款，请指出潜在风险并提出修改建议。' },
  'P': { profile: 'ARCP（关系达人）或 IRCP（机会捕手）', jobs: ['品类创新岗', '数字化采购岗'], interview: '案例分析：如何在一个传统品类中发现新的采购机会并推动落地？请描述具体思路。' }
};

function computeHiringAdvice(members, dim, cap) {
  var total = members.length;
  var weaknesses = []; // {letter, label, count, pct}

  // 维度短板：占比<50% 的维度
  DIM_PAIRS.forEach(function(dp) {
    var posCount = dim[dp.pos], negCount = dim[dp.neg];
    var minorityLabel, minorityCount, minorityLetter;
    if(negCount < posCount) { minorityLabel = dp.negLabel; minorityCount = negCount; minorityLetter = dp.neg; }
    else { minorityLabel = dp.posLabel; minorityCount = posCount; minorityLetter = dp.pos; }
    if(minorityCount / total < 0.5) {
      weaknesses.push({ letter: minorityLetter, label: minorityLabel, count: minorityCount, pct: pct(minorityCount, total) });
    }
  });

  // 按人数升序排序（最缺的优先）
  weaknesses.sort(function(a, b) { return a.count - b.count; });

  if(weaknesses.length === 0) {
    return {
      hasWeakness: false,
      priority: '低',
      types: '',
      profiles: '',
      jobs: '',
      interviewFocus: ''
    };
  }

  // 优先招聘类型：取人数最少的 1-2 个维度短板
  var topTypes = weaknesses.slice(0, Math.min(2, weaknesses.length));
  var priority = topTypes[0].count === 0 ? '紧急' : topTypes[0].count === 1 ? '高' : '中';

  var typeStr = topTypes.map(function(w) { return w.label + '（' + w.letter + '）'; }).join(' + ');
  var profileStr = topTypes.map(function(w) { return HIRING_PROFILES[w.letter].profile; }).join('、');
  var allJobs = [], seenJobs = {};
  topTypes.forEach(function(w) {
    HIRING_PROFILES[w.letter].jobs.forEach(function(j) {
      if(!seenJobs[j]) { seenJobs[j] = true; allJobs.push(j); }
    });
  });
  var jobStr = allJobs.join('、');

  // 面试考察：按短板维度汇总考察要点
  var interviewTraits = [];
  topTypes.forEach(function(w) {
    var l = w.letter;
    if(l === 'I' || l === 'P') { interviewTraits.push('市场敏锐度'); interviewTraits.push('创新思维'); interviewTraits.push('快速决策能力'); }
    else if(l === 'A') { interviewTraits.push('数据分析能力'); interviewTraits.push('逻辑推理能力'); }
    else if(l === 'T') { interviewTraits.push('目标导向'); interviewTraits.push('任务推进能力'); }
    else if(l === 'R') { interviewTraits.push('关系维护意识'); interviewTraits.push('冲突化解能力'); }
    else if(l === 'C') { interviewTraits.push('竞争意识'); interviewTraits.push('底线把控能力'); }
    else if(l === 'B') { interviewTraits.push('合作共赢意识'); interviewTraits.push('长期关系建设能力'); }
    else if(l === 'D') { interviewTraits.push('风险识别能力'); interviewTraits.push('合规意识'); }
  });
  // 去重
  var uniqueTraits = [], seenTraits = {};
  interviewTraits.forEach(function(t) { if(!seenTraits[t]) { seenTraits[t] = true; uniqueTraits.push(t); } });
  var interviewStr = '重点考察候选人的' + uniqueTraits.join('、');

  // 具体面试场景（取第一个短板维度的场景题）
  var scenarioStr = HIRING_PROFILES[topTypes[0].letter].interview;

  return {
    hasWeakness: true,
    priority: priority,
    types: typeStr,
    profiles: profileStr,
    jobs: jobStr,
    interviewFocus: interviewStr,
    scenario: scenarioStr
  };
}

/* ═══════════════════════════════════════════
   9. 培训建议算法 — 团队 + 个人发展
   ═══════════════════════════════════════════ */
function computeTrainingAdvice(members, dim, cap) {
  var total = members.length;
  var team = []; // {title, recommendedCourse}
  var individuals = []; // {names, training}

  // 维度失衡→团队培训映射表
  var TRAINING_MAP = {
    'A>I': { title: '数据分析深度训练', recommendedCourse: '数据分析实战课' },
    'I>A': { title: '创新思维训练', recommendedCourse: '设计思维工作坊' },
    'R>T': { title: '关系维护与冲突化解', recommendedCourse: '供应商关系管理培训' },
    'T>R': { title: '任务管理与执行效率', recommendedCourse: '敏捷决策工作坊' },
    'C>B': { title: '竞争谈判策略培训', recommendedCourse: '谈判博弈实战课' },
    'B>C': { title: '合作共赢思维', recommendedCourse: '长期合作框架建设' },
    'D>P': { title: '风险管控培训', recommendedCourse: '风险识别与规避能力' },
    'P>D': { title: '风险承担训练', recommendedCourse: '在可控范围内尝试新方法' }
  };

  // 维度失衡→团队培训
  DIM_PAIRS.forEach(function(dp) {
    var posCount = dim[dp.pos], negCount = dim[dp.neg];
    var key, minorityLetter;
    if(negCount < posCount) {
      // 少数派是neg（如 I<A）→ 需要补充neg → key='A>I'（majority>minority）
      key = dp.pos + '>' + dp.neg;
      minorityLetter = dp.neg;
    } else if(posCount < negCount) {
      // 少数派是pos → key='I>A'
      key = dp.neg + '>' + dp.pos;
      minorityLetter = dp.pos;
    } else {
      return; // 均衡，不需要
    }
    var training = TRAINING_MAP[key];
    if(training) {
      team.push({ title: training.title, recommendedCourse: training.recommendedCourse });
    }
  });

  // 跨风格沟通：有维度失衡就加
  var imbalancedDims = [];
  DIM_PAIRS.forEach(function(dp) {
    if(Math.min(dim[dp.pos], dim[dp.neg]) > 0 && dim[dp.pos] !== dim[dp.neg]) {
      imbalancedDims.push(dp.pos + '/' + dp.neg);
    }
  });
  if(imbalancedDims.length > 0) {
    team.push({ title: '跨风格沟通', recommendedCourse: 'DISC 或 MBTI 培训' });
  }

  if(team.length === 0) {
    team.push({ title: '团队能力覆盖全面', recommendedCourse: '持续进行跨风格沟通训练' });
  }

  // 个人发展：按少数派维度分组
  var dimGroups = [];
  DIM_PAIRS.forEach(function(dp) {
    var posCount = dim[dp.pos], negCount = dim[dp.neg];
    var minorityLetter, training;
    if(posCount < negCount) {
      minorityLetter = dp.pos;
    } else if(negCount < posCount) {
      minorityLetter = dp.neg;
    } else {
      return; // 均衡，不需要
    }
    // 找出少数派具体是谁
    var minorityNames = [];
    members.forEach(function(m) {
      var idx;
      if(minorityLetter === 'A' || minorityLetter === 'I') idx = 0;
      else if(minorityLetter === 'R' || minorityLetter === 'T') idx = 1;
      else if(minorityLetter === 'C' || minorityLetter === 'B') idx = 2;
      else idx = 3;
      if(m.code.toUpperCase()[idx] === minorityLetter) minorityNames.push(m.name);
    });
    // 训练方向
    if(minorityLetter === 'I') training = '创新思维和市场洞察';
    else if(minorityLetter === 'A') training = '数据分析与逻辑论证';
    else if(minorityLetter === 'R') training = '关系维护与冲突化解';
    else if(minorityLetter === 'T') training = '任务管理与执行效率';
    else if(minorityLetter === 'C') training = '谈判博弈与底线意识';
    else if(minorityLetter === 'B') training = '合作共赢与长期关系建设';
    else if(minorityLetter === 'P') training = '快速决策和敏捷响应';
    else if(minorityLetter === 'D') training = '风险识别和管控能力';
    dimGroups.push({ names: minorityNames, training: training });
  });

  individuals = dimGroups;

  // 计算优先级
  var minMinorityCount = total;
  DIM_PAIRS.forEach(function(dp) {
    var m = Math.min(dim[dp.pos], dim[dp.neg]);
    if(m < minMinorityCount) minMinorityCount = m;
  });
  var priority = minMinorityCount === 0 ? '紧急' : minMinorityCount === 1 ? '高' : '中';

  return { team: team, individuals: individuals, priority: priority };
}

/* ═══════════════════════════════════════════
   10. 90 天行动计划 — 基于缺失能力
   ═══════════════════════════════════════════ */
function computeActionPlan(risks, dim, members) {
  var total = members.length;
  var riskTypes = [];
  risks.forEach(function(r) { riskTypes.push(r.title); });

  var phase1 = '完成团队沟通工作坊，建立跨风格理解';
  if(riskTypes.some(function(t) { return t.indexOf('直觉') !== -1 || t.indexOf('开拓') !== -1; })) {
    phase1 += '；为少数派成员授权创新试点项目';
  } else {
    phase1 += '；建立标准化工作流程';
  }

  var phase2 = '优化决策流程，建立分级授权机制';
  if(riskTypes.some(function(t) { return t.indexOf('分析') !== -1 || t.indexOf('数据') !== -1; })) {
    phase2 += '；启动数据收集和分析系统';
  } else {
    phase2 += '；启动市场情报收集系统';
  }

  var phase3 = '复盘决策速度和准确性；调整人员配置，最大化互补效应';

  return [
    { phase: '第 1-30 天', text: phase1 },
    { phase: '第 31-60 天', text: phase2 },
    { phase: '第 61-90 天', text: phase3 }
  ];
}

/* ═══════════════════════════════════════════
   11. 项目配置算法
   ═══════════════════════════════════════════ */
function computeProjectConfig(members, dim) {
  var cap = computeCapabilityCoverage(members);
  var configs = [];

  var aMembers = members.filter(function(m){ return m.code[0]==='A'; }).map(function(m){ return m.name; });
  var iMembers = members.filter(function(m){ return m.code[0]==='I'; }).map(function(m){ return m.name; });
  var rMembers = members.filter(function(m){ return m.code[1]==='R'; }).map(function(m){ return m.name; });
  var tMembers = members.filter(function(m){ return m.code[1]==='T'; }).map(function(m){ return m.name; });
  var cMembers = members.filter(function(m){ return m.code[2]==='C'; }).map(function(m){ return m.name; });
  var bMembers = members.filter(function(m){ return m.code[2]==='B'; }).map(function(m){ return m.name; });
  var pMembers = members.filter(function(m){ return m.code[3]==='P'; }).map(function(m){ return m.name; });

  // 数据分析类：分析型牵头，搭配竞争型/任务型配合 — 数据支撑驱动理性决策
  if(aMembers.length > 0) {
    var lead = aMembers[0];
    var partner = (cMembers.length > 0 && cMembers[0] !== lead) ? cMembers[0] :
                  (tMembers.length > 0 && tMembers[0] !== lead) ? tMembers[0] :
                  (aMembers.length > 1 ? aMembers[1] : '');
    configs.push({ project:'数据分析类项目', config: lead + '牵头' + (partner ? '，' + partner + '配合' : ''), theme: '数据支撑驱动理性决策' });
  }

  // 供应商谈判：关系型主导 + 分析型数据支撑 + 竞争型条款博弈 — 协作制胜
  if(rMembers.length > 0) {
    var negoAssigned = {};
    var relLead = rMembers[0];
    negoAssigned[relLead] = true;
    var negoParts = [relLead + '主导关系建立'];
    var dataSup = '';
    for(var di = 0; di < aMembers.length; di++) {
      if(!negoAssigned[aMembers[di]]) { dataSup = aMembers[di]; negoAssigned[dataSup] = true; break; }
    }
    if(dataSup) negoParts.push(dataSup + '负责数据支撑');
    var compNego = '';
    for(var ci = 0; ci < cMembers.length; ci++) {
      if(!negoAssigned[cMembers[ci]]) { compNego = cMembers[ci]; negoAssigned[compNego] = true; break; }
    }
    if(compNego) negoParts.push(compNego + '负责条款博弈');
    configs.push({ project:'供应商谈判', config: negoParts.join('，'), theme: '协作制胜' });
  }

  // 创新试点：直觉型牵头 + 开拓型把控流程风险 — 洞察驱动创新
  if(iMembers.length > 0) {
    var innLead = iMembers[0];
    var innAssigned = {}; innAssigned[innLead] = true;
    var innPartner = '';
    for(var pi = 0; pi < pMembers.length; pi++) {
      if(!innAssigned[pMembers[pi]]) { innPartner = pMembers[pi]; innAssigned[innPartner] = true; break; }
    }
    if(!innPartner) {
      for(var bi = 0; bi < bMembers.length; bi++) {
        if(!innAssigned[bMembers[bi]]) { innPartner = bMembers[bi]; break; }
      }
    }
    configs.push({ project:'创新试点项目', config: innLead + '牵头' + (innPartner ? '，' + innPartner + '把控流程风险' : ''), theme: '洞察驱动创新' });
  }

  // 成本削减：竞争型牵头 + 任务型推进执行 — 博弈与效率并重
  if(cMembers.length > 0) {
    var costAssigned = {};
    var costLead = cMembers.length > 1 ? cMembers[1] : cMembers[0];
    costAssigned[costLead] = true;
    var costPartner = '';
    for(var ti = 0; ti < tMembers.length; ti++) {
      if(!costAssigned[tMembers[ti]]) { costPartner = tMembers[ti]; costAssigned[costPartner] = true; break; }
    }
    if(!costPartner) {
      for(var ai = 0; ai < aMembers.length; ai++) {
        if(!costAssigned[aMembers[ai]]) { costPartner = aMembers[ai]; break; }
      }
    }
    configs.push({ project:'成本削减项目', config: costLead + '牵头' + (costPartner ? '，' + costPartner + '推进执行' : ''), theme: '博弈与效率并重' });
  }

  // 战略供应商管理：合作型主导 + 关系型配合 — 长期共赢
  if(bMembers.length > 0) {
    var stratAssigned = {};
    var stratLead = bMembers[0];
    stratAssigned[stratLead] = true;
    var stratPartner = '';
    for(var ri = 0; ri < rMembers.length; ri++) {
      if(!stratAssigned[rMembers[ri]]) { stratPartner = rMembers[ri]; stratAssigned[stratPartner] = true; break; }
    }
    if(!stratPartner) {
      for(var ii = 0; ii < iMembers.length; ii++) {
        if(!stratAssigned[iMembers[ii]]) { stratPartner = iMembers[ii]; break; }
      }
    }
    configs.push({ project:'战略供应商管理', config: stratLead + '主导' + (stratPartner ? '，' + stratPartner + '配合维护高层关系' : ''), theme: '长期共赢' });
  }

  if(aMembers.length === 0 && cap.missingCaps.indexOf('数据分析') >= 0) {
    configs.push({ project:'⚠️ 数据分析类项目', config: '团队暂无分析型成员，建议引入外部数据支持或紧急招聘', theme: '' });
  }

  return configs;
}

/* ═══════════════════════════════════════════
   12. 课程匹配算法
   ═══════════════════════════════════════════ */
function matchCourses(courseLibrary, dim, members) {
  var cap = computeCapabilityCoverage(members);
  var total = members.length;
  var weakDims = [];
  if(dim.A && dim.I) { if(dim.I/total < 0.3) weakDims.push('I'); if(dim.A/total < 0.3) weakDims.push('A'); }
  if(dim.R && dim.T) { if(dim.T/total < 0.3) weakDims.push('T'); if(dim.R/total < 0.3) weakDims.push('R'); }
  if(dim.C && dim.B) { if(dim.B/total < 0.3) weakDims.push('B'); if(dim.C/total < 0.3) weakDims.push('C'); }
  if(dim.D && dim.P) { if(dim.P/total < 0.3) weakDims.push('P'); if(dim.D/total < 0.3) weakDims.push('D'); }

  var scored = (courseLibrary || []).map(function(c) {
    var matchCount = 0;
    (c.tags || []).forEach(function(t) {
      if(cap.missingCaps.indexOf(t) >= 0) matchCount += 10;
      if(weakDims.indexOf(t) >= 0) matchCount += 5;
    });
    return { course: c, score: matchCount };
  }).sort(function(a,b){ return b.score - a.score; });

  return scored.map(function(s) {
    var c = s.course;
    var matchText;
    var matchedCaps = c.tags.filter(function(t){ return cap.missingCaps.indexOf(t)>=0; });
    var matchedDims = c.tags.filter(function(t){ return weakDims.indexOf(t)>=0; });
    if(matchedCaps.length > 0) {
      matchText = '精准匹配团队「' + matchedCaps.join('、') + '」能力短板';
    } else if(matchedDims.length > 0) {
      matchText = '补齐团队「' + matchedDims.map(function(t){return DIM_LABEL_MAP[t]||t;}).join('、') + '」维度短板';
    } else {
      matchText = '全面提升团队综合能力';
    }
    return { name: c.name, teacher: '优链学堂 · 线下课', match: matchText, cta: c.cta, url: c.url };
  });
}

/* ═══════════════════════════════════════════
   13. 维度洞察算法
   ═══════════════════════════════════════════ */
function buildDimensionInsight(key, dim, total, members) {
  var templates = {
    A: {
      major: '团队偏向分析型决策，重视数据和逻辑。优势在于方案论证充分，风险识别准确；需注意避免过度分析导致决策延迟。',
      minor: '团队偏向直觉型判断，敏锐度高。优势在于快速捕捉机会和创新突破；需加强数据验证，避免决策过于主观。'
    },
    R: {
      major: '关系导向占优，团队氛围和谐，善于维护供应商关系。需平衡关系维护与任务达成。',
      minor: '任务导向占优，目标明确执行力强。需注意关系维护，避免过于强硬影响长期合作。'
    },
    C: {
      major: '竞争意识较强，善于争取利益最大化。需注意长期合作关系的维护。',
      minor: '合作共赢意识强，善于建立长期合作关系。需注意底线把控，避免过度妥协。'
    },
    D: {
      major: '防御型居多，风险管控意识强，决策谨慎。优势在于规避陷阱，但可能错失市场机会。',
      minor: '开拓型居多，行动敏捷快速。需加强风险意识，避免盲目行动。'
    }
  };
  var t = templates[key];
  if(!t) return '';
  var pairs = [['A','I'],['R','T'],['C','B'],['D','P']];
  var idx = pairs.findIndex(function(p){ return p.indexOf(key)>=0; });
  var other = pairs[idx].filter(function(x){ return x!==key; })[0];
  return dim[key] >= dim[other] ? t.major : t.minor;
}

/* ═══════════════════════════════════════════
   14. 渲染引擎
   ═══════════════════════════════════════════ */

function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function el(id) { return document.getElementById(id); }

function renderTeamReport() {
  var data = window.teamReportData;
  if(!data || !data.members) { console.error('teamReportData 未加载'); return; }

  var members = data.members;
  var total = members.length;
  var dim = countDimensions(members);
  var cap = computeCapabilityCoverage(members);

  // 全部算法计算
  var score = computeScore(members, dim);
  var teamType = computeTeamType(members, dim);
  var roles = computeRoles(members, dim);
  var advantages = computeAdvantages(members, dim);
  var risks = computeRisks(members, dim, cap);
  var pairing = computePairs(members);
  var hiringAdvice = computeHiringAdvice(members, dim, cap);
  var trainingAdvice = computeTrainingAdvice(members, dim, cap);
  var actionPlan = computeActionPlan(risks, dim, members);
  var projectConfig = computeProjectConfig(members, dim);
  var courses = matchCourses(data.courseLibrary, dim, members);

  // ── 头部 ──
  el('report-badge').textContent = data.meta.badge;
  el('report-title').textContent = data.meta.title;
  el('report-subtitle').textContent = data.meta.subtitle;
  el('report-date').textContent = '报告生成时间：' + data.meta.generatedAt;

  // ── 评分 ──
  el('score-num').textContent = score.value;
  el('score-level').textContent = score.emoji + ' ' + score.level + ' · 超越 ' + score.percentile + '% 的采购团队';

  // ── 团队概况 ──
  var testedCount = members.filter(function(m) { return m.code && m.code.length === 4; }).length;
  var pendingCount = total - testedCount;
  el('team-total').textContent = total;
  el('team-tested').textContent = testedCount;
  el('team-pending').textContent = pendingCount;
  el('team-tags').innerHTML =
    '<span class="tag">' + total + ' 人团队</span>' +
    '<span class="tag">' + testedCount + '/' + total + ' 已测试</span>' +
    '<span class="tag">' + cap.capPct + '% 能力覆盖</span>' +
    '<span class="tag">' + esc(teamType.label) + '</span>';
  el('team-type-label').innerHTML = teamType.emoji + ' ' + esc(teamType.label);
  el('team-type-desc').textContent = teamType.desc;

  // ── 能力覆盖卡片 ──
  var covHtml = '<div style="margin-bottom:12px;">' +
    '<div style="font-size:12px;color:#86868b;margin-bottom:8px;">对标 16 种风格 × 8 大能力全集</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
      '<div class="stat" style="flex:1;min-width:120px;"><div class="stat-num">' + cap.capPct + '%</div><div class="stat-label">能力覆盖</div></div>' +
      '<div class="stat" style="flex:1;min-width:120px;"><div class="stat-num">' + cap.stylePct + '%</div><div class="stat-label">风格覆盖</div></div>' +
      '<div class="stat" style="flex:1;min-width:120px;"><div class="stat-num">' + cap.missingCaps.length + '</div><div class="stat-label">能力缺口</div></div>' +
    '</div></div>';

  covHtml += '<div style="margin-bottom:10px;"><div style="font-size:11px;color:#10b981;margin-bottom:4px;">✅ 已覆盖能力</div><div class="tag-row">';
  cap.presentCaps.forEach(function(c) { covHtml += '<span class="tag">' + esc(c) + '</span>'; });
  covHtml += '</div></div>';

  if(cap.missingCaps.length > 0) {
    covHtml += '<div><div style="font-size:11px;color:#f59e0b;margin-bottom:4px;">⚠️ 缺失能力</div><div class="tag-row">';
    cap.missingCaps.forEach(function(c) { covHtml += '<span class="tag" style="background:rgba(245,158,11,0.2);color:#f59e0b;border-color:rgba(245,158,11,0.3);">' + esc(c) + '</span>'; });
    covHtml += '</div></div>';
  }

  covHtml += '<div style="margin-top:10px;font-size:11px;color:#86868b;">' +
    '16 种风格中已覆盖 ' + cap.uniqueStyleCount + ' 种，缺失 ' + cap.missingStyles.length + ' 种';
  covHtml += '</div>';

  el('capability-container').innerHTML = covHtml;

  // ── 四维度 ──
  var dimKeys = [
    { key:'A', neg:'I', pos:'分析型', negPos:'直觉型', icon:'🧠', title:'信息获取维度' },
    { key:'R', neg:'T', pos:'关系型', negPos:'任务型', icon:'🎯', title:'决策导向维度' },
    { key:'C', neg:'B', pos:'竞争型', negPos:'合作型', icon:'⚔️', title:'处事方式维度' },
    { key:'D', neg:'P', pos:'防御型', negPos:'开拓型', icon:'🚀', title:'行动策略维度' }
  ];
  var dimHtml = '';
  dimKeys.forEach(function(dk) {
    var posCount = dim[dk.key], negCount = dim[dk.neg];
    var posPct = pct(posCount, total), negPct = pct(negCount, total);
    dimHtml += '<div class="dimension">' +
      '<div class="dimension-name">' + dk.icon + ' ' + dk.title + '</div>' +
      '<div class="dimension-bars">' +
        '<div class="bar-item"><div class="bar-label">' + dk.pos + ' <span class="bar-value">' + posCount + ' 人 · ' + posPct + '%</span></div><div class="bar-bg"><div class="bar-fill majority" style="width:' + posPct + '%"></div></div></div>' +
        '<div class="bar-item"><div class="bar-label">' + dk.negPos + ' <span class="bar-value">' + negCount + ' 人 · ' + negPct + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + negPct + '%"></div></div></div>' +
      '</div>' +
      '<div class="insight-box" style="margin-top:12px;"><div class="insight-title">💡 维度洞察</div><div class="insight-content">' + buildDimensionInsight(dk.key, dim, total, members) + '</div></div>' +
    '</div>';
  });
  el('dimensions-container').innerHTML = dimHtml;

  // ── 团队核心优势（仅≥50%） ──
  var advHtml = '';
  advantages.forEach(function(a) {
    advHtml += '<div class="advantage"><div class="advantage-title">' + a.icon + ' ' + esc(a.title) + '</div><div class="advantage-desc">' + esc(a.desc) + '</div><div class="advantage-impact">' + esc(a.impact) + '</div></div>';
  });
  el('advantages-container').innerHTML = advHtml;

  // ── 潜在风险与改进方案（仅<50%，4 部分内容） ──
  var riskHtml = '';
  risks.forEach(function(r) {
    var content = '<div class="risk-title">' + r.icon + ' ' + esc(r.title) + '</div>' +
      '<div class="risk-desc">' + esc(r.desc) + '</div>' +
      '<div class="risk-alert">⚠️ 风险场景：' + esc(r.alert) + '</div>' +
      '<div class="risk-solution">✅ 改进方案：' + esc(r.fix) + '</div>';
    riskHtml += '<div class="risk">' + content + '</div>';
  });
  el('risks-container').innerHTML = riskHtml;

  // ── 最佳拍档（只针对最匹配的成员进行配对） ──
  var pairHtml = '';
  pairing.pairs.forEach(function(p) {
    var sd1 = window.styleDefinitions[p.m1.code] || {};
    var sd2 = window.styleDefinitions[p.m2.code] || {};
    pairHtml += '<div class="pair">' +
      '<div class="pair-title">' + p.levelIcon + ' ' + p.level + ' · ' + p.levelClass + '</div>' +
      '<div class="pair-members">' +
        '<div class="pair-member"><div class="pair-avatar">' + esc(sd1.animal||'👤') + '</div><div class="pair-name">' + esc(p.m1.name) + '</div><div class="pair-code">' + esc(p.m1.code) + '</div></div>' +
        '<div style="font-size:20px;color:#86868b;">+</div>' +
        '<div class="pair-member"><div class="pair-avatar">' + esc(sd2.animal||'👤') + '</div><div class="pair-name">' + esc(p.m2.name) + '</div><div class="pair-code">' + esc(p.m2.code) + '</div></div>' +
      '</div>' +
      '<div class="pair-reason">' + buildPairReason(p) + '</div>' +
    '</div>';
  });

  pairing.unpaired.forEach(function(m) {
    var sd = window.styleDefinitions[m.code] || {};
    var code = m.code.toUpperCase();

    // 分析该成员的4个维度，哪些在团队中是少数派/唯一
    var dimCount = [{A:0,I:0},{R:0,T:0},{C:0,B:0},{D:0,P:0}];
    var dimNames = ['信息获取', '决策导向', '处事方式', '行动策略'];
    var dimLabels2 = [['A','分析型'],['I','直觉型'],['R','关系型'],['T','任务型'],['C','竞争型'],['B','合作型'],['D','防御型'],['P','开拓型']];
    members.forEach(function(mm) {
      dimCount[0][mm.code[0]]++;
      dimCount[1][mm.code[1]]++;
      dimCount[2][mm.code[2]]++;
      dimCount[3][mm.code[3]]++;
    });

    var uniqueDims = [], minorityDims = [];
    for(var di=0; di<4; di++) {
      var c = dimCount[di][code[di]];
      if(c === 1) uniqueDims.push({dim: dimNames[di], letter: code[di], label: dimLabels2[code[di]==='A'||code[di]==='I'?(code[di]==='A'?0:1):di*2+(code[di]==='R'||code[di]==='C'||code[di]==='D'?0:1)][1]});
      if(c <= Math.ceil(members.length/2)) minorityDims.push({dim: dimNames[di], letter: code[di], label: dimLabels2[code[di]==='A'||code[di]==='I'?(code[di]==='A'?0:1):di*2+(code[di]==='R'||code[di]==='C'||code[di]==='D'?0:1)][1]});
    }

    // 生成 2-3 条协作建议
    var collabSuggestions = [];
    var firstLetter = code[0];
    var secondLetter = code[1];
    var thirdLetter = code[2];
    var fourthLetter = code[3];

    // 建议1：基于第一维度（A/I）的协作定位
    if(firstLetter === 'A') {
      collabSuggestions.push('📊 <strong>数据决策担当：</strong>在供应商评估和成本分析等场景中主动提供数据支撑，帮助直觉型成员将市场嗅觉转化为可量化的决策依据。');
    } else {
      collabSuggestions.push('💡 <strong>创新洞察担当：</strong>在新品类引入和市场趋势判断中优先分享洞察，帮助团队发现数据之外的非量化机会。');
    }

    // 建议2：基于第二维度（R/T）的协作定位
    if(secondLetter === 'R') {
      collabSuggestions.push('🤝 <strong>关系协调担当：</strong>在跨部门协作和供应商关系管理中发挥润滑作用，确保团队在推进任务的同时维护长期合作关系。');
    } else {
      collabSuggestions.push('⚡ <strong>执行推进担当：</strong>在关键节点主动推动进度，确保团队不会因过度协商而延误交付。');
    }

    // 建议3：基于第三+四维度的协作定位
    if(thirdLetter === 'C' && fourthLetter === 'D') {
      collabSuggestions.push('🛡️ <strong>谈判防守担当：</strong>在关键谈判中负责底线把控和风险识别，与开拓型成员形成攻守平衡。');
    } else if(thirdLetter === 'C' && fourthLetter === 'P') {
      collabSuggestions.push('⚔️ <strong>敏捷博弈担当：</strong>在需要快速响应的谈判场景中兼顾竞争意识和行动速度，适合紧急采购和供应商切换。');
    } else if(thirdLetter === 'B' && fourthLetter === 'D') {
      collabSuggestions.push('🔒 <strong>稳健合作担当：</strong>在战略供应商管理中发挥主导作用，确保合作框架下风险可控。');
    } else if(thirdLetter === 'B' && fourthLetter === 'P') {
      collabSuggestions.push('🌱 <strong>创新协作担当：</strong>在联合创新项目中搭建桥梁，推动双赢合作的同时尝试新方法。');
    }

    // 独特价值总结
    var valueSummary = '';
    if(uniqueDims.length >= 2) {
      valueSummary = m.name + ' 在 ' + uniqueDims.map(function(d){return d.label;}).join('、') + ' 方面是团队中的唯一持有者，为团队带来差异化视角。';
    } else if(uniqueDims.length === 1) {
      valueSummary = m.name + ' 是团队中唯一的' + uniqueDims[0].label + '成员，在' + uniqueDims[0].dim + '维度上具有不可替代性。';
    } else {
      valueSummary = m.name + ' 的风格（' + esc(code) + ' · ' + esc(sd.name||'') + esc(sd.animal||'') + '）为团队带来独特的协作价值。';
    }

    pairHtml += '<div class="pair">' +
      '<div class="pair-title">📌 ' + esc(m.name) + ' · 独立角色</div>' +
      '<div class="pair-members"><div class="pair-member"><div class="pair-avatar">' + esc(sd.animal||'👤') + '</div><div class="pair-name">' + esc(m.name) + '</div><div class="pair-code">' + esc(code) + '</div></div></div>' +
      '<div class="pair-reason">' +
        '<div style="margin-bottom:8px;">' + esc(valueSummary) + '</div>' +
        '<div style="font-size:12px;color:#d4af37;font-weight:600;margin-bottom:6px;">💡 协作建议</div>' +
        '<div style="font-size:12px;color:#cccccc;line-height:1.8;">' + collabSuggestions.join('<br>') + '</div>' +
      '</div></div>';
  });
  el('pairs-container').innerHTML = pairHtml;

  // ── 团队成员画像 ──
  var memHtml = '';
  roles.forEach(function(r) {
    var sd = window.styleDefinitions[r.code] || {};
    var extra = r.coversMissing.length > 0 ? '<div style="font-size:10px;color:#f59e0b;margin-top:2px;">弥补：' + r.coversMissing.join('、') + '</div>' : '';
    memHtml += '<div class="member"><div class="avatar">' + esc(r.name.charAt(0)) + '</div><div class="member-info"><div class="member-name">' + esc(r.name) + ' · ' + esc(r.code) + ' ' + esc(sd.name||'') + ' ' + (sd.animal||'') + '</div><div class="member-code">' + esc(sd.dimension||'') + '</div>' + extra + '</div><div class="member-status">✅ ' + esc(r.role) + '</div></div>';
  });
  el('members-container').innerHTML = memHtml;

  // ── 招聘建议（四要素结构） ──
  var hireHtml = '';
  if(hiringAdvice.hasWeakness) {
    hireHtml += '<div style="margin-bottom:16px;">' +
      '<div style="font-size:12px;color:#86868b;margin-bottom:8px;">📌 招聘建议（优先级：<span style="color:' + (hiringAdvice.priority==='紧急'?'#ef4444':hiringAdvice.priority==='高'?'#f59e0b':'#10b981') + ';">' + hiringAdvice.priority + '</span>）</div>' +
      '<div class="recommendation-content"><strong>优先招聘类型：</strong>' + esc(hiringAdvice.types) + '</div>' +
      '<div class="recommendation-content"><strong>目标画像：</strong>' + esc(hiringAdvice.profiles) + '</div>' +
      '<div class="recommendation-content"><strong>岗位建议：</strong>' + esc(hiringAdvice.jobs) + '</div>' +
      '<div class="recommendation-content"><strong>面试考察：</strong>' + esc(hiringAdvice.interviewFocus) + '</div>' +
      '<div style="margin-top:8px;padding:10px;background:rgba(245,158,11,0.08);border-radius:8px;border-left:3px solid #f59e0b;">' +
        '<div style="font-size:11px;color:#d4af37;margin-bottom:4px;">🎯 面试场景题示例</div>' +
        '<div style="font-size:12px;color:#cccccc;">' + esc(hiringAdvice.scenario) + '</div>' +
      '</div>' +
    '</div>';
  } else {
    hireHtml += '<div class="recommendation-content">📌 团队配置均衡，暂无明显短板。可根据业务扩展需求补充人才。</div>';
  }
  el('hiring-advice-container').innerHTML = hireHtml;

  // ── 培训建议 ──
  var trainHtml = '';
  var priorityColor = trainingAdvice.priority === '紧急' ? '#ef4444' : trainingAdvice.priority === '高' ? '#f59e0b' : '#10b981';
  trainHtml += '<div style="margin-bottom:16px;">';
  trainHtml += '<div style="font-size:12px;color:#86868b;margin-bottom:10px;">📚 培训建议（优先级：<span style="color:' + priorityColor + ';">' + trainingAdvice.priority + '</span>）</div>';
  // 团队培训
  trainHtml += '<div style="margin-bottom:14px;"><div style="font-size:13px;color:#d4af37;font-weight:600;margin-bottom:8px;">团队培训</div>';
  trainingAdvice.team.forEach(function(item, idx) {
    var coursePart = item.recommendedCourse ? '（推荐：' + esc(item.recommendedCourse) + '）' : '';
    trainHtml += '<div class="recommendation-content" style="margin-bottom:6px;">' + (idx+1) + '. ' + esc(item.title) + coursePart + '</div>';
  });
  trainHtml += '</div>';
  // 个人发展
  if(trainingAdvice.individuals.length > 0) {
    trainHtml += '<div><div style="font-size:13px;color:#d4af37;font-weight:600;margin-bottom:8px;">个人发展</div>';
    trainingAdvice.individuals.forEach(function(item) {
      trainHtml += '<div class="recommendation-content" style="margin-bottom:6px;">• ' + esc(item.names.join('/')) + '：加强' + esc(item.training) + '训练</div>';
    });
    trainHtml += '</div>';
  }
  trainHtml += '</div>';
  el('training-advice-container').innerHTML = trainHtml;

  // ── 90 天行动计划 ──
  var apHtml = '';
  actionPlan.forEach(function(item, idx) {
    apHtml += '<div class="action-item"><div class="action-num">' + (idx+1) + '</div><div class="action-text"><strong>' + esc(item.phase) + '：</strong>' + esc(item.text) + '</div></div>';
  });
  el('action-plan-container').innerHTML = apHtml;

  // ── 项目配置建议 ──
  var pcHtml = '';
  projectConfig.forEach(function(item) {
    var themeStr = item.theme ? ' — <em style="color:#d4af37;">' + esc(item.theme) + '</em>' : '';
    pcHtml += '<div class="recommendation-content"><strong>' + esc(item.project) + '：</strong>' + esc(item.config) + themeStr + '</div>';
  });
  el('project-config-container').innerHTML = pcHtml;

  // ── 推荐课程 ──
  var courseHtml = '';
  courses.forEach(function(c) {
    courseHtml += '<div class="course" onclick="window.open(\'' + esc(c.url) + '\', \'_blank\')" style="cursor:pointer;">' +
      '<div class="course-name">' + esc(c.name) + '</div>' +
      '<div class="course-teacher">👨‍🏫 ' + esc(c.teacher) + '</div>' +
      '<div class="course-match">✅ ' + esc(c.match) + '</div>' +
      '<div class="course-cta">🔥 ' + esc(c.cta) + '</div>' +
    '</div>';
  });
  el('courses-container').innerHTML = courseHtml;
}

/* ── 自动初始化 ── */
if(typeof document !== 'undefined') {
  if(document.readyState === 'complete') renderTeamReport();
  else window.addEventListener('DOMContentLoaded', renderTeamReport);
}
