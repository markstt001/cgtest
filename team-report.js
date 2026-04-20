/**
 * team-report.js v2.0 — 团队报告：计算 + 渲染引擎
 *
 * 依赖：
 *   team-report-data.js  （纯数据）
 *   styles.js / cooperation-guides.js （styleDefinitions，可选）
 *
 * 用法：
 *   <script src="team-report-data.js"></script>
 *   <script src="team-report.js"></script>
 *   <script>renderTeamReport();</script>
 */

/* ──────────────────────────────────────────
   1. styleDefinitions 备用
   ────────────────────────────────────────── */

if (typeof window.styleDefinitions === 'undefined') {
  window.styleDefinitions = {
    ARCD: { name: "数据军师", animal: "🦉", dimension: "分析 + 关系 + 竞争 + 防御" },
    ARCP: { name: "关系达人", animal: "🦉", dimension: "分析 + 关系 + 竞争 + 开拓" },
    ARBD: { name: "守门员",   animal: "🦉", dimension: "分析 + 关系 + 合作 + 防御" },
    ARBP: { name: "流程管家", animal: "🦉", dimension: "分析 + 关系 + 合作 + 开拓" },
    ATCD: { name: "市场猎手", animal: "🦅", dimension: "分析 + 任务 + 竞争 + 防御" },
    ATCP: { name: "拍板侠",   animal: "🦅", dimension: "分析 + 任务 + 竞争 + 开拓" },
    ATBD: { name: "逻辑控",   animal: "🦅", dimension: "分析 + 任务 + 合作 + 防御" },
    ATBP: { name: "效率狂人", animal: "🦅", dimension: "分析 + 任务 + 合作 + 开拓" },
    IRCD: { name: "直觉玩家", animal: "🦊", dimension: "直觉 + 关系 + 竞争 + 防御" },
    IRCP: { name: "机会捕手", animal: "🦊", dimension: "直觉 + 关系 + 竞争 + 开拓" },
    IRBD: { name: "人脉王",   animal: "🦊", dimension: "直觉 + 关系 + 合作 + 防御" },
    IRBP: { name: "和事佬",   animal: "🦊", dimension: "直觉 + 关系 + 合作 + 开拓" },
    ITCD: { name: "变色龙",   animal: "🐺", dimension: "直觉 + 任务 + 竞争 + 防御" },
    ITCP: { name: "社交牛人", animal: "🐺", dimension: "直觉 + 任务 + 竞争 + 开拓" },
    ITBD: { name: "守门员",   animal: "🐺", dimension: "直觉 + 任务 + 合作 + 防御" },
    ITBP: { name: "行动派",   animal: "🐺", dimension: "直觉 + 任务 + 合作 + 开拓" }
  };
}

/* ──────────────────────────────────────────
   2. 计算引擎（基于 members 数组动态计算）
   ────────────────────────────────────────── */

/**
 * 根据 members 数组计算全部分析数据
 * @param {Array} members  [{name, code, role}, ...]
 * @returns {object} 计算结果
 */
function computeTeamAnalysis(members) {
  if (!members || members.length === 0) return null;

  var total = members.length;

  // ── 维度计数 ──
  var dim = { A: 0, I: 0, R: 0, T: 0, C: 0, B: 0, D: 0, P: 0 };
  members.forEach(function (m) {
    var c = m.code.toUpperCase();
    if (c[0] === 'A') dim.A++; else dim.I++;
    if (c[1] === 'R') dim.R++; else dim.T++;
    if (c[2] === 'C') dim.C++; else dim.B++;
    if (c[3] === 'D') dim.D++; else dim.P++;
  });

  // ── 维度标签 ──
  var dimLabels = {
    A: { pos: '分析型', neg: '直觉型', icon: '🧠', title: '信息获取维度' },
    R: { pos: '关系型', neg: '任务型', icon: '🎯', title: '决策导向维度' },
    C: { pos: '竞争型', neg: '合作型', icon: '⚔️', title: '处事方式维度' },
    D: { pos: '防御型', neg: '开拓型', icon: '🚀', title: '行动策略维度' }
  };

  // ── 优势 & 风险 ──
  var advantages = [];
  var risks = [];

  // 信息获取
  if (dim.A > dim.I) {
    advantages.push({
      icon: '📊', title: '数据分析能力强',
      desc: '团队中 ' + pct(dim.A, total) + ' 成员是分析型，决策时有数据支撑，不易冲动。善于收集市场信息、进行成本分析和风险评估。',
      impact: '💼 业务影响：在供应商评估、价格谈判、合同审核等环节表现优异，能有效降低采购风险。'
    });
    risks.push(buildRisk(
      '💭', '直觉型成员不足',
      '团队中直觉型成员只有 ' + dim.I + ' 人（' + pct(dim.I, total) + '），可能影响创新思维和市场机会识别。过度依赖数据可能导致错失非量化机会。',
      '新兴市场进入、创新品类采购、供应商早期介入等需要直觉判断的场景可能表现欠佳。',
      getMinorityNames(members, ['I']) + '：1) 为直觉型成员创造更多表达洞察的机会；2) 引入外部行业专家顾问；3) 建立市场情报收集机制，补充数据盲区。'
    ));
  } else {
    advantages.push({
      icon: '💡', title: '创新洞察能力强',
      desc: '团队中 ' + pct(dim.I, total) + ' 成员是直觉型，善于发现市场机会和创新突破点。',
      impact: '💼 业务影响：在创新品类引入、市场趋势判断方面表现突出。'
    });
    risks.push(buildRisk(
      '📊', '分析型成员不足',
      '团队中分析型成员只有 ' + dim.A + ' 人（' + pct(dim.A, total) + '），决策可能缺乏充分数据支撑。',
      '大型供应商评估、复杂合同审核等需要深度分析的场景可能表现欠佳。',
      getMinorityNames(members, ['A']) + '：1) 建立数据分析模板和工具；2) 引入数据分析培训；3) 关键决策前强制数据验证。'
    ));
  }

  // 决策导向
  if (dim.R > dim.T) {
    advantages.push({
      icon: '🤝', title: '关系维护能力好',
      desc: '团队中 ' + pct(dim.R, total) + ' 成员是关系导向，善于维护供应商关系和内部协调。注重长期合作，善于化解冲突。',
      impact: '💼 业务影响：供应商满意度高，紧急情况下能获得供应商支持，内部跨部门协作顺畅。'
    });
    risks.push(buildRisk(
      '📋', '任务型成员不足',
      '团队中任务型成员只有 ' + dim.T + ' 人（' + pct(dim.T, total) + '），可能影响执行效率和目标达成。过度关注关系可能影响谈判底线。',
      '成本削减项目、供应商绩效考核、合同到期重谈等需要强硬立场的场景可能妥协过多。',
      getMinorityNames(members, ['T']) + '：1) 任务型成员主导 KPI 考核和成本削减项目；2) 建立明确的谈判底线和授权机制；3) 引入第三方评估，避免人情干扰。'
    ));
  } else {
    advantages.push({
      icon: '🎯', title: '任务执行能力强',
      desc: '团队中 ' + pct(dim.T, total) + ' 成员是任务导向，目标明确，执行力强。',
      impact: '💼 业务影响：项目推进高效，KPI 达成率高。'
    });
    risks.push(buildRisk(
      '🤝', '关系型成员不足',
      '团队中关系型成员只有 ' + dim.R + ' 人（' + pct(dim.R, total) + '），可能影响供应商关系维护。',
      '战略供应商关系管理、冲突化解等场景可能处理生硬。',
      getMinorityNames(members, ['R']) + '：1) 加强关系管理培训；2) 建立供应商沟通机制；3) 关系型成员主导关键供应商对接。'
    ));
  }

  // 处事方式
  if (dim.C > dim.B) {
    advantages.push({
      icon: '⚔️', title: '竞争意识强',
      desc: '团队中 ' + pct(dim.C, total) + ' 成员是竞争型，在谈判中善于争取最大利益。不甘示弱，敢于施压，底线意识强。',
      impact: '💼 业务影响：谈判成果优异，采购成本可控，合同条款有利于我方，不易被供应商牵着鼻子走。'
    });
    risks.push(buildRisk(
      '🤝', '合作型成员不足',
      '团队中合作型成员只有 ' + dim.B + ' 人（' + pct(dim.B, total) + '），可能影响长期合作关系建设。',
      '战略供应商长期合作、联合创新等场景可能过于强势。',
      getMinorityNames(members, ['B']) + '：1) 合作型成员主导战略供应商管理；2) 建立共赢谈判框架；3) 定期评估供应商满意度。'
    ));
  } else {
    advantages.push({
      icon: '🤝', title: '合作共赢意识好',
      desc: '团队中 ' + pct(dim.B, total) + ' 成员是合作型，善于建立长期合作关系。',
      impact: '💼 业务影响：供应商忠诚度高，长期合作稳定性强。'
    });
    risks.push(buildRisk(
      '⚔️', '竞争型成员不足',
      '团队中竞争型成员只有 ' + dim.C + ' 人（' + pct(dim.C, total) + '），谈判中可能过于妥协。',
      '价格谈判、合同条款博弈等场景可能让步过多。',
      getMinorityNames(members, ['C']) + '：1) 竞争型成员主导关键谈判；2) 设定谈判底线；3) 谈判前制定 BATNA。'
    ));
  }

  // 行动策略
  if (dim.D > dim.P) {
    advantages.push({
      icon: '🛡️', title: '风险控制能力强',
      desc: '团队中 ' + pct(dim.D, total) + ' 成员是防御型，谨慎保守，善于识别和规避风险。决策前充分论证，不盲目行动。',
      impact: '💼 业务影响：采购合规性高，合同风险低，供应链稳定性强，极少出现重大失误。'
    });
    risks.push(buildRisk(
      '🚀', '开拓型成员不足',
      '团队中开拓型成员只有 ' + dim.P + ' 人（' + pct(dim.P, total) + '），可能影响快速行动和敏捷响应。过度谨慎可能错失市场窗口期。',
      '紧急采购、价格波动应对、供应商切换等需要快速决策的场景可能反应迟缓。',
      getMinorityNames(members, ['P']) + '：1) 为开拓型成员授权快速决策权限；2) 建立分级决策机制，小额采购简化流程；3) 定期复盘决策速度，持续优化。'
    ));
  } else {
    advantages.push({
      icon: '🚀', title: '开拓创新能力好',
      desc: '团队中 ' + pct(dim.P, total) + ' 成员是开拓型，敢于尝试新方法和新机会。',
      impact: '💼 业务影响：市场响应快，创新机会捕捉能力强。'
    });
    risks.push(buildRisk(
      '🛡️', '防御型成员不足',
      '团队中防御型成员只有 ' + dim.D + ' 人（' + pct(dim.D, total) + '），风险控制可能不足。',
      '合同审核、合规检查等场景可能存在风险盲区。',
      getMinorityNames(members, ['D']) + '：1) 建立强制风险评估流程；2) 防御型成员负责合同审核；3) 引入第三方风控。'
    ));
  }

  // ── 最佳拍档配对 ──
  var bestMatchMap = {
    ARCD: 'ARBP', ARCP: 'ATBD', ARBD: 'ATCP', ARBP: 'ARCD',
    ATCD: 'ARBP', ATCP: 'ARBD', ATBD: 'ARCP', ATBP: 'IRCD',
    IRCD: 'ATBP', IRCP: 'ITBD', IRBD: 'ITCP', IRBP: 'ITCD',
    ITCD: 'IRBP', ITCP: 'ARCD', ITBD: 'IRCP', ITBP: 'IRBD'
  };

  var pairs = [];
  var used = {};

  for (var i = 0; i < members.length; i++) {
    if (used[i]) continue;
    var m1 = members[i];
    var matchCode = bestMatchMap[m1.code];

    // 找最佳匹配
    for (var j = i + 1; j < members.length; j++) {
      if (used[j]) continue;
      var m2 = members[j];
      if (m2.code === matchCode || bestMatchMap[m2.code] === m1.code) {
        var comp4 = getComplementDetail(m1.code, m2.code);
        pairs.push({
          member1: m1, member2: m2,
          level: '天作之合', levelIcon: '💕', levelClass: '高度互补',
          complementCount: comp4.count,
          complementDims: comp4.dims,
          reason: buildPairReason(m1, m2, comp4)
        });
        used[i] = true; used[j] = true;
        break;
      }
    }

    // 找次优匹配（≥2 维度互补）
    if (!used[i]) {
      for (var j = i + 1; j < members.length; j++) {
        if (used[j]) continue;
        var m2 = members[j];
        var comp4 = getComplementDetail(m1.code, m2.code);
        if (comp4.count >= 2) {
          pairs.push({
            member1: m1, member2: m2,
            level: '互补合作', levelIcon: '🤝', levelClass: '中度互补',
            complementCount: comp4.count,
            complementDims: comp4.dims,
            reason: buildPairReason(m1, m2, comp4)
          });
          used[i] = true; used[j] = true;
          break;
        }
      }
    }
  }

  return {
    total: total,
    dimensions: dim,
    dimLabels: dimLabels,
    advantages: advantages,
    risks: risks,
    pairs: pairs,
    unpaired: members.filter(function (_, idx) { return !used[idx]; })
  };
}

/* ── 辅助函数 ── */

function pct(n, total) { return n + ' 人 · ' + Math.round(n / total * 100) + '%'; }

function getMinorityNames(members, minorityLetters) {
  var names = [];
  members.forEach(function (m) {
    var c = m.code.toUpperCase();
    for (var i = 0; i < minorityLetters.length; i++) {
      if (c.indexOf(minorityLetters[i]) >= 0) { names.push(m.name); break; }
    }
  });
  return names.length > 0 ? '涉及成员：' + names.join('、') + '。' : '';
}

function buildRisk(icon, title, desc, alert, solution) {
  return { icon: icon, title: title, desc: desc, alert: alert, solution: solution };
}

function getComplementDetail(c1, c2) {
  var labels = ['A/I', 'R/T', 'C/B', 'D/P'];
  var dims = [];
  var count = 0;
  for (var i = 0; i < 4; i++) {
    if (c1[i] !== c2[i]) { count++; dims.push(labels[i]); }
  }
  return { count: count, dims: dims };
}

function buildPairReason(m1, m2, comp) {
  var sd1 = window.styleDefinitions[m1.code] || {};
  var sd2 = window.styleDefinitions[m2.code] || {};
  var dimText = comp.count === 4 ? '4 个维度全部不同' : comp.count + ' 个维度不同（' + comp.dims.join('、') + '）';

  // 根据互补维度生成协作价值描述
  var values = [];
  if (comp.dims.indexOf('A/I') >= 0) values.push(m1.name + ' 的' + (m1.code[0] === 'A' ? '数据分析' : '直觉洞察') + ' + ' + m2.name + ' 的' + (m2.code[0] === 'A' ? '数据分析' : '直觉洞察') + ' = 全面决策');
  if (comp.dims.indexOf('R/T') >= 0) values.push(m1.name + ' 的' + (m1.code[1] === 'R' ? '关系维护' : '任务执行') + ' + ' + m2.name + ' 的' + (m2.code[1] === 'R' ? '关系维护' : '任务执行') + ' = 刚柔并济');
  if (comp.dims.indexOf('C/B') >= 0) values.push(m1.name + ' 的' + (m1.code[2] === 'C' ? '竞争意识' : '合作共赢') + ' + ' + m2.name + ' 的' + (m2.code[2] === 'C' ? '竞争意识' : '合作共赢') + ' = 平衡短期利益与长期关系');
  if (comp.dims.indexOf('D/P') >= 0) values.push(m1.name + ' 的' + (m1.code[3] === 'D' ? '防御谨慎' : '开拓敏捷') + ' + ' + m2.name + ' 的' + (m2.code[3] === 'D' ? '防御谨慎' : '开拓敏捷') + ' = 平衡风险与速度');
  if (values.length === 0) values.push('风格互补，协作潜力大');

  return '<strong>互补维度：</strong>' + dimText + '<br><strong>协作价值：</strong>' + values.join('；') + '<br><strong>推荐场景：</strong>战略供应商选择、重大合同谈判、成本优化项目';
}

/* ──────────────────────────────────────────
   3. 渲染引擎（DOM 注入）
   ────────────────────────────────────────── */

function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

/**
 * 渲染团队报告
 * 约定 HTML 中存在以下 id 的容器元素：
 *   report-badge, report-title, report-subtitle, report-date
 *   score-box, score-level
 *   team-overview, team-tags, team-type-box
 *   dimensions-container
 *   advantages-container
 *   risks-container
 *   pairs-container
 *   members-container
 *   action-plan-container
 *   project-config-container
 *   courses-container
 */
function renderTeamReport() {
  var data = window.teamReportData;
  if (!data || !data.members) { console.error('teamReportData 未加载'); return; }

  var analysis = computeTeamAnalysis(data.members);
  if (!analysis) { console.error('团队数据为空'); return; }

  var total = analysis.total;
  var dim = analysis.dimensions;

  // ── 头部 ──
  el('report-badge').textContent = data.meta.badge;
  el('report-title').textContent = data.meta.title;
  el('report-subtitle').textContent = data.meta.subtitle;
  el('report-date').textContent = '报告生成时间：' + data.meta.generatedAt;

  // ── 评分 ──
  el('score-num').textContent = data.score.value;
  el('score-level').textContent = data.score.emoji + ' ' + data.score.level + ' · ' + data.score.description;

  // ── 团队概况 ──
  el('team-total').textContent = total;
  el('team-tested').textContent = total;
  el('team-pending').textContent = '0';
  el('team-tags').innerHTML =
    '<span class="tag">' + total + ' 人团队</span>' +
    '<span class="tag">100% 已测试</span>' +
    '<span class="tag">' + esc(data.teamType.label) + '</span>';
  el('team-type-label').innerHTML = data.teamType.emoji + ' ' + esc(data.teamType.label);
  el('team-type-desc').textContent = data.teamType.desc;

  // ── 四维度 ──
  var dimKeys = [
    { key: 'A', neg: 'I' },
    { key: 'R', neg: 'T' },
    { key: 'C', neg: 'B' },
    { key: 'D', neg: 'P' }
  ];
  var dimHtml = '';
  dimKeys.forEach(function (dk) {
    var lab = analysis.dimLabels[dk.key];
    var posCount = dim[dk.key];
    var negCount = dim[dk.neg];
    var posPct = Math.round(posCount / total * 100);
    var negPct = Math.round(negCount / total * 100);

    dimHtml += '<div class="dimension">' +
      '<div class="dimension-name">' + lab.icon + ' ' + lab.title + '</div>' +
      '<div class="dimension-bars">' +
        '<div class="bar-item">' +
          '<div class="bar-label">' + lab.pos + ' (' + dk.key + ') <span class="bar-value">' + posCount + ' 人 · ' + posPct + '%</span></div>' +
          '<div class="bar-bg"><div class="bar-fill majority" style="width:' + posPct + '%"></div></div>' +
        '</div>' +
        '<div class="bar-item">' +
          '<div class="bar-label">' + lab.neg + ' (' + dk.neg + ') <span class="bar-value">' + negCount + ' 人 · ' + negPct + '%</span></div>' +
          '<div class="bar-bg"><div class="bar-fill" style="width:' + negPct + '%"></div></div>' +
        '</div>' +
      '</div>';

    // 维度洞察
    var insight = buildDimensionInsight(dk.key, lab, posCount, negCount, total, data.members);
    dimHtml += '<div class="insight-box" style="margin-top:12px;">' +
      '<div class="insight-title">💡 维度洞察</div>' +
      '<div class="insight-content">' + insight + '</div>' +
    '</div></div>';
  });
  el('dimensions-container').innerHTML = dimHtml;

  // ── 优势 ──
  var advHtml = '';
  analysis.advantages.forEach(function (a) {
    advHtml += '<div class="advantage">' +
      '<div class="advantage-title">' + a.icon + ' ' + esc(a.title) + '</div>' +
      '<div class="advantage-desc">' + esc(a.desc) + '</div>' +
      '<div class="advantage-impact">' + esc(a.impact) + '</div>' +
    '</div>';
  });
  el('advantages-container').innerHTML = advHtml;

  // ── 风险 ──
  var riskHtml = '';
  analysis.risks.forEach(function (r) {
    riskHtml += '<div class="risk">' +
      '<div class="risk-title">' + r.icon + ' ' + esc(r.title) + '</div>' +
      '<div class="risk-desc">' + esc(r.desc) + '</div>' +
      '<div class="risk-alert">⚠️ 风险场景：' + esc(r.alert) + '</div>' +
      '<div class="risk-solution">✅ 改进方案：' + esc(r.solution) + '</div>' +
    '</div>';
  });
  el('risks-container').innerHTML = riskHtml;

  // ── 最佳拍档 ──
  var pairHtml = '';
  analysis.pairs.forEach(function (p) {
    var sd1 = window.styleDefinitions[p.member1.code] || {};
    var sd2 = window.styleDefinitions[p.member2.code] || {};
    pairHtml += '<div class="pair">' +
      '<div class="pair-title">' + p.levelIcon + ' ' + p.level + ' · ' + p.levelClass + '</div>' +
      '<div class="pair-members">' +
        '<div class="pair-member"><div class="pair-avatar">' + esc(sd1.animal || '👤') + '</div><div class="pair-name">' + esc(p.member1.name) + '</div><div class="pair-code">' + esc(p.member1.code) + '</div></div>' +
        '<div style="font-size:20px;color:#86868b;">+</div>' +
        '<div class="pair-member"><div class="pair-avatar">' + esc(sd2.animal || '👤') + '</div><div class="pair-name">' + esc(p.member2.name) + '</div><div class="pair-code">' + esc(p.member2.code) + '</div></div>' +
      '</div>' +
      '<div class="pair-reason">' + p.reason + '</div>' +
    '</div>';
  });
  if (analysis.unpaired.length > 0) {
    analysis.unpaired.forEach(function (m) {
      var sd = window.styleDefinitions[m.code] || {};
      pairHtml += '<div class="pair">' +
        '<div class="pair-title">📌 ' + esc(m.name) + ' · 独立角色</div>' +
        '<div class="pair-members">' +
          '<div class="pair-member"><div class="pair-avatar">' + esc(sd.animal || '👤') + '</div><div class="pair-name">' + esc(m.name) + '</div><div class="pair-code">' + esc(m.code) + '</div></div>' +
        '</div>' +
        '<div class="pair-reason">' + esc(m.name) + ' 的风格（' + esc(m.code) + '）在团队中具有独特价值，可作为跨组协调人或特殊项目顾问。</div>' +
      '</div>';
    });
  }
  el('pairs-container').innerHTML = pairHtml;

  // ── 团队成员画像 ──
  var memHtml = '';
  data.members.forEach(function (m) {
    var sd = window.styleDefinitions[m.code] || {};
    var initial = m.name.charAt(0);
    memHtml += '<div class="member">' +
      '<div class="avatar">' + esc(initial) + '</div>' +
      '<div class="member-info">' +
        '<div class="member-name">' + esc(m.name) + ' · ' + esc(m.code) + ' ' + esc(sd.name || '') + ' ' + (sd.animal || '') + '</div>' +
        '<div class="member-code">' + esc(sd.dimension || '') + '</div>' +
      '</div>' +
      '<div class="member-status">✅ ' + esc(m.role) + '</div>' +
    '</div>';
  });
  el('members-container').innerHTML = memHtml;

  // ── 90 天行动计划 ──
  var apHtml = '';
  (data.actionPlan || []).forEach(function (item, idx) {
    apHtml += '<div class="action-item">' +
      '<div class="action-num">' + (idx + 1) + '</div>' +
      '<div class="action-text"><strong>' + esc(item.phase) + '：</strong>' + esc(item.text) + '</div>' +
    '</div>';
  });
  el('action-plan-container').innerHTML = apHtml;

  // ── 项目配置建议 ──
  var pcHtml = '';
  (data.projectConfig || []).forEach(function (item) {
    pcHtml += '<div class="recommendation-content">' +
      '<strong>' + esc(item.project) + '：</strong>' + esc(item.config) +
    '</div>';
  });
  el('project-config-container').innerHTML = pcHtml;

  // ── 推荐课程 ──
  var courseHtml = '';
  (data.courses || []).forEach(function (c) {
    courseHtml += '<div class="course" onclick="window.open(\'' + esc(c.url) + '\', \'_blank\')" style="cursor:pointer;">' +
      '<div class="course-name">' + esc(c.name) + '</div>' +
      '<div class="course-teacher">👨‍🏫 ' + esc(c.teacher) + '</div>' +
      '<div class="course-match">✅ 匹配需求：' + esc(c.match) + '</div>' +
      '<div class="course-cta" style="font-size:13px;color:#d4af37;font-weight:600;margin-top:10px;">🔥 ' + esc(c.cta) + '</div>' +
    '</div>';
  });
  el('courses-container').innerHTML = courseHtml;
}

function el(id) { return document.getElementById(id); }

/**
 * 根据维度数据自动生成洞察文案
 */
function buildDimensionInsight(majorKey, lab, majorCount, minorCount, total, members) {
  var templates = {
    A: {
      major: '团队偏向' + lab.pos + '决策，重视数据和逻辑。优势在于方案论证充分，风险识别准确；需注意避免过度分析导致决策延迟，建议为' + lab.neg + '型成员创造表达洞察的空间。',
      minor: '团队偏向' + lab.minorLabel + '判断，直觉敏锐。优势在于快速捕捉机会和创新突破；需加强数据验证，避免决策过于主观，建议引入数据分析工具和流程。'
    },
    R: {
      major: lab.pos + '占优，团队氛围和谐，善于维护供应商关系。需平衡关系维护与任务达成，避免因人情影响谈判底线。建议' + lab.neg + '型成员在关键节点推动进度。',
      minor: lab.neg + '占优，目标明确执行力强。需注意关系维护，避免过于强硬影响长期合作。建议' + lab.pos + '型成员主导供应商关系管理。'
    },
    C: {
      major: '竞争意识较强，善于争取利益最大化。在供应商谈判中不易吃亏，但需注意长期合作关系的维护。建议' + lab.neg + '型成员在战略供应商管理中发挥主导作用。',
      minor: lab.pos + '占优，善于建立共赢合作。需注意底线把控，避免过度妥协。建议' + lab.neg + '型成员在关键谈判中施压。'
    },
    D: {
      major: lab.pos + '居多，风险管控意识强，决策谨慎。优势在于规避陷阱，但可能错失市场机会。建议为' + lab.neg + '型成员授权创新试点项目，平衡稳健与敏捷。',
      minor: lab.neg + '居多，行动敏捷快速。需加强风险意识，避免盲目行动。建议' + lab.pos + '型成员负责风险评估和合规检查。'
    }
  };

  var t = templates[majorKey];
  if (!t) return '';
  return majorCount > minorCount ? t.major : t.minor;
}

/* ── 自动初始化 ── */
if (typeof document !== 'undefined') {
  if (document.readyState === 'complete') {
    renderTeamReport();
  } else {
    window.addEventListener('DOMContentLoaded', renderTeamReport);
  }
}
