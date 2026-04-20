/**
 * team-report.js v4.0 — 团队报告：对标完整16种风格 × 8大能力全集
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

/* ═══════════════════════════════════════════
   1. 基础计算
   ═══════════════════════════════════════════ */

/** 获取某维度少数派成员名 */
function minorityNames(members, letter) {
  return members.filter(function(m){ return m.code.toUpperCase().indexOf(letter) >= 0; }).map(function(m){ return m.name; });
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

    var role;
    if(total < 3) {
      role = sameCount === 1 ? '独特风格' : '团队中坚';
    } else if(sameCount === 1 && bridge >= 0.8 && total >= 4) {
      role = '核心骨干';
    } else if(sameCount === 1 && scarcity >= 0.5) {
      role = balance >= 0.3 ? '桥梁角色' : '稀缺人才';
    } else if(bridge >= 0.7) {
      role = '中坚力量';
    } else if(scarcity >= 0.5) {
      role = '潜力新星';
    } else {
      role = '成长中的力量';
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
   5. 优势 & 风险算法 — 对标完整8大能力
   ═══════════════════════════════════════════ */
function computeAdvantagesAndRisks(members, dim) {
  var total = members.length;
  var cap = computeCapabilityCoverage(members);
  var advantages = [], risks = [];

  // ── 基于 8 大能力覆盖情况 ──
  // 已覆盖的能力 → 优势
  cap.presentCaps.forEach(function(c) {
    var holders = members.filter(function(m) {
      return (STYLE_CAPABILITIES[m.code.toUpperCase()] || []).indexOf(c) >= 0;
    }).map(function(m) { return m.name; });

    var advMap = {
      '数据分析': { icon: '📊', title: '数据分析能力强', desc: '团队具备数据驱动的决策能力，善于成本分析和市场信息收集。', impact: '在供应商评估、价格谈判、合同审核等环节表现优异。', holders: holders },
      '直觉洞察': { icon: '💡', title: '直觉洞察力强', desc: '团队具备敏锐的市场嗅觉，能快速捕捉创新机会和非量化信息。', impact: '在创新品类引入、市场趋势判断方面表现突出。', holders: holders },
      '关系维护': { icon: '🤝', title: '关系维护能力好', desc: '团队善于维护供应商关系和内部协调，注重长期合作。', impact: '供应商满意度高，紧急情况下能获得供应商支持。', holders: holders },
      '任务驱动': { icon: '🎯', title: '任务执行力强', desc: '团队目标明确，执行力强，能高效推进项目落地。', impact: '项目推进高效，KPI 达成率高。', holders: holders },
      '竞争博弈': { icon: '⚔️', title: '竞争意识强', desc: '团队在谈判中善于争取最大利益，底线意识强。', impact: '谈判成果优异，采购成本可控。', holders: holders },
      '合作共赢': { icon: '🤝', title: '合作共赢意识好', desc: '团队善于建立长期合作关系，追求双赢结果。', impact: '供应商忠诚度高，长期合作稳定性强。', holders: holders },
      '风险管控': { icon: '🛡️', title: '风险控制能力强', desc: '团队谨慎保守，善于识别和规避风险。', impact: '采购合规性高，合同风险低，供应链稳定性强。', holders: holders },
      '敏捷开拓': { icon: '🚀', title: '开拓创新能力好', desc: '团队敢于尝试新方法，行动敏捷。', impact: '市场响应快，创新机会捕捉能力强。', holders: holders }
    };
    var a = advMap[c] || { icon: '✅', title: c, desc: '', impact: '', holders: holders };
    advantages.push({
      icon: a.icon,
      title: a.title,
      desc: a.desc + '（' + holders.join('、') + '）',
      impact: a.impact
    });
  });

  // 缺失的能力 → 风险
  cap.missingCaps.forEach(function(c) {
    var riskMap = {
      '数据分析': { icon: '⚠️', title: '数据分析能力缺失', desc: '团队完全缺乏数据分析能力，决策可能凭感觉或经验。', alert: '大型供应商评估、复杂合同审核等需要深度分析的场景。', fix: '引入数据分析工具；招聘分析型人才；建立数据驱动决策流程。' },
      '直觉洞察': { icon: '⚠️', title: '直觉洞察能力缺失', desc: '团队缺乏创新思维和敏锐的市场嗅觉。', alert: '新兴市场进入、创新品类采购、供应商早期介入等场景。', fix: '引入外部行业专家顾问；建立市场情报收集机制；鼓励创新思维。' },
      '关系维护': { icon: '⚠️', title: '关系维护能力缺失', desc: '团队可能忽略供应商关系和内部协调。', alert: '战略供应商关系管理、冲突化解等场景。', fix: '加强关系管理培训；建立供应商沟通机制；招聘关系型人才。' },
      '任务驱动': { icon: '⚠️', title: '任务执行能力缺失', desc: '团队可能缺乏目标执行力和效率。', alert: '成本削减项目、供应商绩效考核等需要强执行的场景。', fix: '建立明确的 KPI 和授权机制；引入项目管理工具。' },
      '竞争博弈': { icon: '⚠️', title: '竞争能力缺失', desc: '团队在谈判中可能过于妥协，无法争取最大利益。', alert: '价格谈判、合同条款博弈等场景。', fix: '谈判前制定 BATNA；设定谈判底线；招聘竞争型人才。' },
      '合作共赢': { icon: '⚠️', title: '合作共赢能力缺失', desc: '团队可能过于强势，影响长期合作关系。', alert: '战略供应商长期合作、联合创新等场景。', fix: '建立共赢谈判框架；定期评估供应商满意度；培养合作思维。' },
      '风险管控': { icon: '⚠️', title: '风险控制能力缺失', desc: '团队可能过于冒进，忽略潜在风险。', alert: '合同审核、合规检查、高风险采购等场景。', fix: '建立强制风险评估流程；引入第三方风控；招聘风控型人才。' },
      '敏捷开拓': { icon: '⚠️', title: '开拓创新能力缺失', desc: '团队可能反应迟缓，错失市场窗口期。', alert: '紧急采购、价格波动应对、供应商切换等场景。', fix: '建立分级决策机制；为成员授权快速决策权限；引入敏捷方法。' }
    };
    var r = riskMap[c] || { icon: '⚠️', title: c + '能力缺失', desc: '', alert: '', fix: '' };
    risks.push({ icon: r.icon, title: r.title, desc: r.desc, alert: r.alert, fix: r.fix });
  });

  // ── 基于维度比例的辅助分析 ──
  var dimPairs = [
    { pos:'A', neg:'I', posLabel:'分析型', negLabel:'直觉型' },
    { pos:'R', neg:'T', posLabel:'关系型', negLabel:'任务型' },
    { pos:'C', neg:'B', posLabel:'竞争型', negLabel:'合作型' },
    { pos:'D', neg:'P', posLabel:'防御型', negLabel:'开拓型' }
  ];
  dimPairs.forEach(function(dp) {
    var posCount = dim[dp.pos], negCount = dim[dp.neg];
    var negPctVal = total > 0 ? negCount / total : 0;
    // 少数派占比 < 30% 时标注维度失衡 → 风险
    if(negPctVal < 0.3) {
      var minorityNames_list = negPctVal > 0 ? minorityNames(members, dp.neg) : ['无'];
      var severity = negPctVal === 0 ? '完全没有' + dp.negLabel + '成员' : dp.negLabel + '仅 ' + minorityNames_list.join('、') + '（' + Math.round(negPctVal*100) + '%）';
      risks.push({
        icon: '📐',
        title: dp.posLabel + '主导（' + posCount + '/' + total + '）',
        desc: '团队' + severity + '。' + (dp.pos === 'C' ? '竞争意识过强可能导致谈判零和化' : dp.pos === 'A' ? '过度分析可能延缓决策' : dp.pos === 'R' ? '过度注重关系可能牺牲利益' : '过度防御可能错失机会') + '。',
        alert: dp.pos === 'C' ? '强势谈判可能损害供应商长期合作意愿' : dp.pos === 'A' ? '复杂决策可能因过度分析而延迟' : dp.pos === 'R' ? '关系优先可能导致成本妥协' : '过度谨慎可能错失市场窗口',
        fix: '引入' + dp.negLabel + '思维培训；在关键决策中设置' + dp.negLabel + '角色；招聘补充' + dp.negLabel + '维度人才。'
      });
    } else if(negPctVal > 0.3) {
      // 维度较均衡，作为优势展示
      advantages.push({
        icon: '📐',
        title: dp.posLabel + '/' + dp.negLabel + '较均衡',
        desc: '团队在' + dp.posLabel + '和' + dp.negLabel + '之间保持了良好平衡。',
        impact: '决策更全面，兼顾' + dp.posLabel.toLowerCase() + '和' + dp.negLabel.toLowerCase() + '视角。'
      });
    }
  });

  return { advantages: advantages, risks: risks };
}

/* ═══════════════════════════════════════════
   6. 最佳拍档算法
   ═══════════════════════════════════════════ */
function computePairs(members) {
  var bestMatchMap = {
    ARCD:'ARBP', ARCP:'ATBD', ARBD:'ATCP', ARBP:'ARCD',
    ATCD:'ARBP', ATCP:'ARBD', ATBD:'ARCP', ATBP:'IRCD',
    IRCD:'ATBP', IRCP:'ITBD', IRBD:'ITCP', IRBP:'ITCD',
    ITCD:'IRBP', ITCP:'ARCD', ITBD:'IRCP', ITBP:'IRBD'
  };
  var pairs = [], used = {};
  for(var i=0; i<members.length; i++) {
    if(used[i]) continue;
    var m1 = members[i];
    var matchCode = bestMatchMap[m1.code];
    for(var j=i+1; j<members.length; j++) {
      if(used[j]) continue;
      var m2 = members[j];
      var diff = 0; for(var k=0;k<4;k++) if(m1.code[k]!==m2.code[k]) diff++;
      if(m2.code === matchCode || bestMatchMap[m2.code] === m1.code) {
        pairs.push({ m1:m1, m2:m2, level:'天作之合', levelIcon:'💕', levelClass:'高度互补', diff:diff, dims:getComplementDims(m1.code,m2.code) });
        used[i]=true; used[j]=true; break;
      }
    }
    if(!used[i]) {
      for(var j=i+1; j<members.length; j++) {
        if(used[j]) continue;
        var m2 = members[j];
        var diff = 0; for(var k=0;k<4;k++) if(m1.code[k]!==m2.code[k]) diff++;
        if(diff >= 2) {
          pairs.push({ m1:m1, m2:m2, level:'互补合作', levelIcon:'🤝', levelClass:'中度互补', diff:diff, dims:getComplementDims(m1.code,m2.code) });
          used[i]=true; used[j]=true; break;
        }
      }
    }
  }
  return { pairs:pairs, unpaired: members.filter(function(_,idx){ return !used[idx]; }) };
}

function getComplementDims(c1,c2) {
  var labels=['A/I','R/T','C/B','D/P'], dims=[];
  for(var i=0;i<4;i++) if(c1[i]!==c2[i]) dims.push(labels[i]);
  return dims;
}

function buildPairReason(p) {
  var sd1 = window.styleDefinitions[p.m1.code] || {};
  var sd2 = window.styleDefinitions[p.m2.code] || {};
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
  return '<strong>互补维度：</strong>'+dimText+'<br><strong>协作价值：</strong>'+values.join('；')+'<br><strong>推荐场景：</strong>战略供应商选择、重大合同谈判、成本优化项目';
}

/* ═══════════════════════════════════════════
   7. 90 天行动计划 — 基于缺失能力
   ═══════════════════════════════════════════ */
function computeActionPlan(members, dim) {
  var cap = computeCapabilityCoverage(members);

  var phase1 = '完成团队沟通工作坊，建立跨风格理解';
  var phase2 = '优化决策流程，建立分级授权机制';
  var phase3 = '复盘决策速度和准确性，调整人员配置';

  if(cap.missingCaps.length > 0) {
    // Phase 1: 针对最关键的缺失能力引入认知
    phase1 += '；重点识别团队在「' + cap.missingCaps.slice(0, 2).join('、') + '」方面的能力缺口';
  }
  if(cap.missingCaps.length > 0) {
    phase2 += '；针对' + cap.missingCaps.join('、') + '能力短板建立专项提升计划';
  }
  phase3 += '；评估' + cap.capPct + '% 能力覆盖率的提升效果';

  return [
    { phase: '第 1-30 天', text: phase1 },
    { phase: '第 31-60 天', text: phase2 },
    { phase: '第 61-90 天', text: phase3 }
  ];
}

/* ═══════════════════════════════════════════
   8. 项目配置算法
   ═══════════════════════════════════════════ */
function computeProjectConfig(members, dim) {
  var cap = computeCapabilityCoverage(members);
  var configs = [];

  var aMembers = members.filter(function(m){ return m.code[0]==='A'; }).map(function(m){ return m.name; });
  if(aMembers.length > 0) configs.push({ project:'数据分析类项目', config: aMembers[0] + '牵头' + (aMembers.length>1 ? '，' + aMembers.slice(1).join('、') + '配合' : '') });

  var rMembers = members.filter(function(m){ return m.code[1]==='R'; }).map(function(m){ return m.name; });
  var cMembers = members.filter(function(m){ return m.code[2]==='C'; }).map(function(m){ return m.name; });
  if(rMembers.length > 0 && cMembers.length > 0) configs.push({ project:'供应商谈判', config: rMembers[0] + '主导关系建立，' + cMembers[0] + '负责条款博弈' });

  var ipMembers = members.filter(function(m){ return m.code[0]==='I' || m.code[3]==='P'; }).map(function(m){ return m.name; });
  if(ipMembers.length > 0) configs.push({ project:'创新试点项目', config: ipMembers[0] + '牵头' + (ipMembers.length>1 ? '，' + ipMembers[1] + '配合' : '') });

  var tcMembers = members.filter(function(m){ return m.code[1]==='T' || m.code[2]==='C'; }).map(function(m){ return m.name; });
  if(tcMembers.length > 0) configs.push({ project:'成本削减项目', config: tcMembers[0] + '牵头' + (tcMembers.length>1 ? '，' + tcMembers[1] + '配合' : '') });

  var rbMembers = members.filter(function(m){ return m.code[1]==='R' || m.code[2]==='B'; }).map(function(m){ return m.name; });
  if(rbMembers.length > 0) configs.push({ project:'战略供应商管理', config: rbMembers[0] + '主导' + (rbMembers.length>1 ? '，' + rbMembers[1] + '配合维护高层关系' : '') });

  // 如果某类项目没有合适人员，标注风险
  if(aMembers.length === 0 && cap.missingCaps.indexOf('数据分析') >= 0) {
    configs.push({ project:'⚠️ 数据分析类项目', config: '团队暂无分析型成员，建议引入外部数据支持或紧急招聘' });
  }

  return configs;
}

/* ═══════════════════════════════════════════
   9. 课程匹配算法
   ═══════════════════════════════════════════ */
function matchCourses(courseLibrary, dim, members) {
  var cap = computeCapabilityCoverage(members);
  var total = members.length;
  // 短板维度：少数派占比 < 30% 的维度
  var weakDims = [];
  if(dim.A && dim.I) { if(dim.I/total < 0.3) weakDims.push('I'); if(dim.A/total < 0.3) weakDims.push('A'); }
  if(dim.R && dim.T) { if(dim.T/total < 0.3) weakDims.push('T'); if(dim.R/total < 0.3) weakDims.push('R'); }
  if(dim.C && dim.B) { if(dim.B/total < 0.3) weakDims.push('B'); if(dim.C/total < 0.3) weakDims.push('C'); }
  if(dim.D && dim.P) { if(dim.P/total < 0.3) weakDims.push('P'); if(dim.D/total < 0.3) weakDims.push('D'); }

  var dimLabelMap = { A:'分析型', I:'直觉型', R:'关系型', T:'任务型', C:'竞争型', B:'合作型', D:'防御型', P:'开拓型' };

  var scored = (courseLibrary || []).map(function(c) {
    var matchCount = 0;
    (c.tags || []).forEach(function(t) {
      // 优先匹配能力短板
      if(cap.missingCaps.indexOf(t) >= 0) matchCount += 10;
      // 其次匹配维度短板
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
      matchText = '补齐团队「' + matchedDims.map(function(t){return dimLabelMap[t]||t;}).join('、') + '」维度短板';
    } else {
      matchText = '全面提升团队综合能力';
    }
    return { name: c.name, teacher: '优链学堂 · 线下课', match: matchText, cta: c.cta, url: c.url };
  });
}

/* ═══════════════════════════════════════════
   10. 维度洞察算法
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
   11. 渲染引擎
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
  var ar = computeAdvantagesAndRisks(members, dim);
  var pairing = computePairs(members);
  var actionPlan = computeActionPlan(members, dim);
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

  // 已有能力标签
  covHtml += '<div style="margin-bottom:10px;"><div style="font-size:11px;color:#10b981;margin-bottom:4px;">✅ 已覆盖能力</div><div class="tag-row">';
  cap.presentCaps.forEach(function(c) { covHtml += '<span class="tag">' + esc(c) + '</span>'; });
  covHtml += '</div></div>';

  // 缺失能力标签
  if(cap.missingCaps.length > 0) {
    covHtml += '<div><div style="font-size:11px;color:#f59e0b;margin-bottom:4px;">⚠️ 缺失能力</div><div class="tag-row">';
    cap.missingCaps.forEach(function(c) { covHtml += '<span class="tag" style="background:rgba(245,158,11,0.2);color:#f59e0b;border-color:rgba(245,158,11,0.3);">' + esc(c) + '</span>'; });
    covHtml += '</div></div>';
  }

  // 缺失风格数量
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

  // ── 优势 ──
  var advHtml = '';
  ar.advantages.forEach(function(a) {
    advHtml += '<div class="advantage"><div class="advantage-title">' + a.icon + ' ' + esc(a.title) + '</div><div class="advantage-desc">' + esc(a.desc) + '</div><div class="advantage-impact">' + esc(a.impact) + '</div></div>';
  });
  el('advantages-container').innerHTML = advHtml;

  // ── 风险 ──
  var riskHtml = '';
  ar.risks.forEach(function(r) {
    riskHtml += '<div class="risk"><div class="risk-title">' + r.icon + ' ' + esc(r.title) + '</div><div class="risk-desc">' + esc(r.desc) + '</div><div class="risk-alert">⚠️ 风险场景：' + esc(r.alert) + '</div><div class="risk-solution">✅ 改进方案：' + esc(r.fix) + '</div></div>';
  });
  el('risks-container').innerHTML = riskHtml;

  // ── 最佳拍档 ──
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
    pairHtml += '<div class="pair"><div class="pair-title">📌 ' + esc(m.name) + ' · 独立角色</div><div class="pair-members"><div class="pair-member"><div class="pair-avatar">' + esc(sd.animal||'👤') + '</div><div class="pair-name">' + esc(m.name) + '</div><div class="pair-code">' + esc(m.code) + '</div></div></div><div class="pair-reason">' + esc(m.name) + ' 的风格（' + esc(m.code) + '）在团队中具有独特价值，可作为跨组协调人或特殊项目顾问。</div></div>';
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

  // ── 90 天行动计划 ──
  var apHtml = '';
  actionPlan.forEach(function(item, idx) {
    apHtml += '<div class="action-item"><div class="action-num">' + (idx+1) + '</div><div class="action-text"><strong>' + esc(item.phase) + '：</strong>' + esc(item.text) + '</div></div>';
  });
  el('action-plan-container').innerHTML = apHtml;

  // ── 项目配置建议 ──
  var pcHtml = '';
  projectConfig.forEach(function(item) {
    var prefix = item.project.indexOf('⚠️') >= 0 ? '' : '';
    pcHtml += '<div class="recommendation-content"><strong>' + esc(item.project) + '：</strong>' + esc(item.config) + '</div>';
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
