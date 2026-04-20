/**
 * team-report.js v3.0 — 团队报告：全算法动态生成
 *
 * 所有结论（团队类型、角色定位、行动计划、项目配置）均从成员 4 字母代码推导，
 * 无硬编码文案。数据来源 = 个人测试结果的聚合。
 *
 * 依赖：team-report-data.js（成员列表 + 课程库）
 *       styles-v3.js / cooperation-guides.js（styleDefinitions）
 */

/* ═══════════════════════════════════════════
   0. styleDefinitions 备用
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   1. 基础计算
   ═══════════════════════════════════════════ */

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

function pct(n, total) { return Math.round(n / total * 100); }

/** 获取某维度的少数派成员名 */
function minorityNames(members, letter) {
  return members.filter(function(m){ return m.code.toUpperCase().indexOf(letter) >= 0; }).map(function(m){ return m.name; });
}

/* ═══════════════════════════════════════════
   2. 团队类型算法
   ═══════════════════════════════════════════
   依据：
   - 风格多样性：unique codes / total members
   - 维度均衡度：四个维度各自的多数派占比标准差
   - 互补指数：随机两人配对中 ≥2 维度不同的比例
*/
function computeTeamType(members, dim) {
  var total = members.length;
  var uniqueCodes = {};
  members.forEach(function(m){ uniqueCodes[m.code] = true; });
  var diversity = Object.keys(uniqueCodes).length / total;  // 0~1

  // 维度均衡度：四个维度多数派占比的标准差（越低越均衡）
  var majorPcts = [
    Math.max(dim.A, dim.I)/total,
    Math.max(dim.R, dim.T)/total,
    Math.max(dim.C, dim.B)/total,
    Math.max(dim.D, dim.P)/total
  ];
  var avg = majorPcts.reduce(function(a,b){return a+b;},0) / 4;
  var stdDev = Math.sqrt(majorPcts.reduce(function(s,v){ return s + (v-avg)*(v-avg); },0) / 4);

  // 互补指数：所有两人组合中 ≥2 维度不同的比例
  var pairCount = 0, compCount = 0;
  for(var i=0; i<members.length; i++) {
    for(var j=i+1; j<members.length; j++) {
      pairCount++;
      var diff = 0;
      for(var k=0; k<4; k++) { if(members[i].code[k] !== members[j].code[k]) diff++; }
      if(diff >= 2) compCount++;
    }
  }
  var compIndex = pairCount > 0 ? compCount / pairCount : 0;

  // 判定
  if(diversity >= 0.8 && stdDev < 0.1 && compIndex >= 0.6) {
    return {
      emoji: '🔀', label: '互补型团队',
      desc: '成员风格多样，四个维度分布均衡，互补性强。建议加强跨风格沟通，最大化协同效应。'
    };
  } else if(diversity < 0.5) {
    return {
      emoji: '🎯', label: '专精型团队',
      desc: '成员风格高度集中，在特定领域有突出优势，但可能在其他维度存在盲区。建议通过外部协作或培训补充短板。'
    };
  } else if(compIndex < 0.4) {
    return {
      emoji: '🔗', label: '同质型团队',
      desc: '成员风格相似度较高，协作默契但缺乏互补。在熟悉场景下效率高，面对复杂挑战时可能缺少多元视角。'
    };
  } else {
    return {
      emoji: '⚡', label: '混合型团队',
      desc: '成员风格有一定多样性，部分维度互补，部分维度集中。建议在互补维度上加强协作，在集中维度上注意盲点。'
    };
  }
}

/* ═══════════════════════════════════════════
   3. 角色定位算法
   ═══════════════════════════════════════════
   每个成员获得一个"团队角色"标签，依据三个维度：
   - 稀缺度 Scarcity：该风格在团队中越稀有，角色价值越高
   - 互补度 Bridge：能与多少其他成员形成 ≥2 维度互补
   - 均衡度 Balance：该成员自身四个维度是否覆盖了团队的少数派

   综合评分 → 角色标签
*/
function computeRoles(members, dim) {
  var total = members.length;
  return members.map(function(m) {
    var code = m.code.toUpperCase();

    // ① 稀缺度：同风格人数越少分越高
    var sameCount = members.filter(function(x){ return x.code === m.code; }).length;
    var scarcity = 1 / sameCount;  // 1.0（唯一） ~ 0.2（5人同风格）

    // ② 互补度：能和其他多少人互补（≥2 维度不同）
    var bridgeCount = 0;
    members.forEach(function(other) {
      if(other.name === m.name) return;
      var diff = 0;
      for(var k=0; k<4; k++) { if(code[k] !== other.code[k]) diff++; }
      if(diff >= 2) bridgeCount++;
    });
    var bridge = bridgeCount / (total - 1);

    // ③ 均衡覆盖：该成员覆盖了多少个团队的少数派维度
    var minorityDims = [];
    if(dim.A < dim.I) minorityDims.push(0); else if(dim.I < dim.A) minorityDims.push(0);
    if(dim.R < dim.T) minorityDims.push(1); else if(dim.T < dim.R) minorityDims.push(1);
    if(dim.C < dim.B) minorityDims.push(2); else if(dim.B < dim.C) minorityDims.push(2);
    if(dim.D < dim.P) minorityDims.push(3); else if(dim.P < dim.D) minorityDims.push(3);

    var coverCount = 0;
    minorityDims.forEach(function(idx) {
      // 检查该成员在这个维度上是否属于少数派
      if(code[idx] === getMinorityLetter(dim, idx)) coverCount++;
    });
    var balance = minorityDims.length > 0 ? coverCount / minorityDims.length : 0;

    // 综合评分
    var score = scarcity * 0.4 + bridge * 0.35 + balance * 0.25;

    // 角色标签
    var role;
    if(score >= 0.7) {
      role = '核心骨干';
    } else if(score >= 0.5) {
      // 根据最突出的维度细分
      if(balance >= 0.5) role = '桥梁角色';
      else if(scarcity >= 0.5) role = '稀缺人才';
      else role = '中坚力量';
    } else {
      role = '潜力新星';
    }

    return {
      name: m.name,
      code: m.code,
      role: role,
      scores: { scarcity: scarcity, bridge: bridge, balance: balance, total: score }
    };
  });
}

function getMinorityLetter(dim, idx) {
  var pairs = [['A','I'],['R','T'],['C','B'],['D','P']];
  var p = pairs[idx];
  return dim[p[0]] < dim[p[1]] ? p[0] : p[1];
}

/* ═══════════════════════════════════════════
   4. 优势 & 风险算法
   ═══════════════════════════════════════════ */
function computeAdvantagesAndRisks(members, dim) {
  var total = members.length;
  var advantages = [], risks = [];

  var dimPairs = [
    { pos:'A', neg:'I', posLabel:'分析型', negLabel:'直觉型',
      advTitle:'数据分析能力强', advDesc:'决策时有数据支撑，善于收集市场信息、进行成本分析和风险评估',
      advImpact:'在供应商评估、价格谈判、合同审核等环节表现优异，能有效降低采购风险',
      riskTitle:'直觉型成员不足', riskDesc:'可能影响创新思维和市场机会识别，过度依赖数据可能错失非量化机会',
      riskAlert:'新兴市场进入、创新品类采购、供应商早期介入等需要直觉判断的场景',
      riskFix:'为直觉型成员创造表达洞察的机会；引入外部行业专家顾问；建立市场情报收集机制' },
    { pos:'R', neg:'T', posLabel:'关系型', negLabel:'任务型',
      advTitle:'关系维护能力好', advDesc:'善于维护供应商关系和内部协调，注重长期合作，善于化解冲突',
      advImpact:'供应商满意度高，紧急情况下能获得供应商支持，内部跨部门协作顺畅',
      riskTitle:'任务型成员不足', riskDesc:'可能影响执行效率和目标达成，过度关注关系可能影响谈判底线',
      riskAlert:'成本削减项目、供应商绩效考核、合同到期重谈等需要强硬立场的场景',
      riskFix:'任务型成员主导 KPI 考核和成本削减项目；建立明确的谈判底线和授权机制；引入第三方评估' },
    { pos:'C', neg:'B', posLabel:'竞争型', negLabel:'合作型',
      advTitle:'竞争意识强', advDesc:'在谈判中善于争取最大利益，不甘示弱，敢于施压，底线意识强',
      advImpact:'谈判成果优异，采购成本可控，合同条款有利于我方',
      riskTitle:'合作型成员不足', riskDesc:'可能影响长期合作关系建设，在战略供应商管理中可能过于强势',
      riskAlert:'战略供应商关系管理、联合创新项目等需要共赢思维的场景',
      riskFix:'合作型成员主导战略供应商管理；建立共赢谈判框架；定期评估供应商满意度' },
    { pos:'D', neg:'P', posLabel:'防御型', negLabel:'开拓型',
      advTitle:'风险控制能力强', advDesc:'谨慎保守，善于识别和规避风险，决策前充分论证',
      advImpact:'采购合规性高，合同风险低，供应链稳定性强',
      riskTitle:'开拓型成员不足', riskDesc:'可能影响快速行动和敏捷响应，过度谨慎可能错失市场窗口期',
      riskAlert:'紧急采购、价格波动应对、供应商切换等需要快速决策的场景',
      riskFix:'为开拓型成员授权快速决策权限；建立分级决策机制；定期复盘决策速度' }
  ];

  dimPairs.forEach(function(dp) {
    var posCount = dim[dp.pos];
    var negCount = dim[dp.neg];
    if(posCount >= negCount) {
      advantages.push({
        icon: getAdvIcon(dp.pos),
        title: dp.advTitle,
        desc: '团队中 ' + posCount + ' 人（' + pct(posCount,total) + '）是' + dp.posLabel + '，' + dp.advDesc + '。',
        impact: '💼 业务影响：' + dp.advImpact + '。'
      });
      if(negCount > 0) {
        var names = minorityNames(members, dp.neg);
        risks.push({
          icon: getRiskIcon(dp.neg),
          title: dp.riskTitle,
          desc: '团队中' + dp.negLabel + '成员只有 ' + negCount + ' 人（' + pct(negCount,total) + '），' + dp.riskDesc,
          alert: dp.riskAlert + '可能表现欠佳。',
          fix: (names.length > 0 ? '涉及成员：' + names.join('、') + '。' : '') + dp.riskFix + '。'
        });
      }
    } else {
      advantages.push({
        icon: getAdvIcon(dp.neg),
        title: dp.negLabel + '能力强',
        desc: '团队中 ' + negCount + ' 人（' + pct(negCount,total) + '）是' + dp.negLabel + '，' + dp.negLabel + '特征突出。',
        impact: '💼 业务影响：在' + dp.negLabel + '相关场景中表现优异。'
      });
      var names = minorityNames(members, dp.pos);
      risks.push({
        icon: getRiskIcon(dp.pos),
        title: dp.posLabel + '成员不足',
        desc: '团队中' + dp.posLabel + '成员只有 ' + posCount + ' 人（' + pct(posCount,total) + '），可能存在短板。',
        alert: dp.posLabel + '相关场景可能表现欠佳。',
        fix: (names.length > 0 ? '涉及成员：' + names.join('、') + '。' : '') + '加强' + dp.posLabel + '相关培训；引入外部资源补充。'
      });
    }
  });

  return { advantages: advantages, risks: risks };
}

function getAdvIcon(letter) {
  var map = { A:'📊', R:'🤝', C:'⚔️', D:'🛡️', I:'💡', T:'🎯', B:'🤝', P:'🚀' };
  return map[letter] || '✅';
}
function getRiskIcon(letter) { return '⚠️'; }

/* ═══════════════════════════════════════════
   5. 最佳拍档算法
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
    var a = p.m1.code[0]==='A'?'数据分析':'直觉洞察';
    var b = p.m2.code[0]==='A'?'数据分析':'直觉洞察';
    values.push(p.m1.name+' 的'+a+' + '+p.m2.name+' 的'+b+' = 全面决策');
  }
  if(p.dims.indexOf('R/T')>=0) {
    var a = p.m1.code[1]==='R'?'关系维护':'任务执行';
    var b = p.m2.code[1]==='R'?'关系维护':'任务执行';
    values.push(a+' + '+b+' = 刚柔并济');
  }
  if(p.dims.indexOf('C/B')>=0) {
    var a = p.m1.code[2]==='C'?'竞争意识':'合作共赢';
    var b = p.m2.code[2]==='C'?'竞争意识':'合作共赢';
    values.push(a+' + '+b+' = 平衡利益与关系');
  }
  if(p.dims.indexOf('D/P')>=0) {
    var a = p.m1.code[3]==='D'?'防御谨慎':'开拓敏捷';
    var b = p.m2.code[3]==='D'?'防御谨慎':'开拓敏捷';
    values.push(a+' + '+b+' = 平衡风险与速度');
  }
  if(values.length===0) values.push('风格互补，协作潜力大');

  return '<strong>互补维度：</strong>'+dimText+'<br><strong>协作价值：</strong>'+values.join('；')+'<br><strong>推荐场景：</strong>战略供应商选择、重大合同谈判、成本优化项目';
}

/* ═══════════════════════════════════════════
   6. 90 天行动计划算法
   ═══════════════════════════════════════════
   依据团队短板维度（少数派维度）生成：
   - 第 1-30 天：认知对齐（理解差异、建立信任）
   - 第 31-60 天：能力补齐（针对性培训、授权试点）
   - 第 61-90 天：机制固化（流程优化、复盘调整）
*/
function computeActionPlan(members, dim) {
  var total = members.length;
  var minorityDims = [];
  if(dim.I > dim.A) minorityDims.push({ letter:'I', label:'直觉型', focus:'创新洞察' });
  if(dim.T > dim.R) minorityDims.push({ letter:'T', label:'任务型', focus:'执行效率' });
  if(dim.B > dim.C) minorityDims.push({ letter:'B', label:'合作型', focus:'合作共赢' });
  if(dim.P > dim.D) minorityDims.push({ letter:'P', label:'开拓型', focus:'敏捷响应' });
  if(dim.A > dim.I) minorityDims.push({ letter:'A', label:'分析型', focus:'数据分析' });
  if(dim.R > dim.T) minorityDims.push({ letter:'R', label:'关系型', focus:'关系维护' });
  if(dim.C > dim.B) minorityDims.push({ letter:'C', label:'竞争型', focus:'谈判竞争' });
  if(dim.D > dim.P) minorityDims.push({ letter:'D', label:'防御型', focus:'风险控制' });

  // 找出最需要提升的维度（少数派）
  var gaps = [];
  if(dim.I < dim.A) gaps.push({ letter:'I', label:'直觉型', members:minorityNames(members,'I'), focus:'创新洞察与市场敏锐度' });
  if(dim.T < dim.R) gaps.push({ letter:'T', label:'任务型', members:minorityNames(members,'T'), focus:'目标执行与效率提升' });
  if(dim.B < dim.C) gaps.push({ letter:'B', label:'合作型', members:minorityNames(members,'B'), focus:'共赢思维与关系建设' });
  if(dim.P < dim.D) gaps.push({ letter:'P', label:'开拓型', members:minorityNames(members,'P'), focus:'敏捷决策与快速响应' });
  if(dim.A < dim.I) gaps.push({ letter:'A', label:'分析型', members:minorityNames(members,'A'), focus:'数据分析与逻辑推理' });
  if(dim.R < dim.T) gaps.push({ letter:'R', label:'关系型', members:minorityNames(members,'R'), focus:'供应商关系维护' });
  if(dim.C < dim.B) gaps.push({ letter:'C', label:'竞争型', members:minorityNames(members,'C'), focus:'谈判博弈与底线把控' });
  if(dim.D < dim.P) gaps.push({ letter:'D', label:'防御型', members:minorityNames(members,'D'), focus:'风险识别与合规管控' });

  // 根据短板生成行动计划
  var phase1 = '完成团队沟通工作坊，建立跨风格理解';
  var phase2 = '优化决策流程，建立分级授权机制';
  var phase3 = '复盘决策速度和准确性，调整人员配置';

  if(gaps.length > 0) {
    var g = gaps[0];
    phase1 += '；为' + g.members.join('、') + '创造' + g.focus + '的发挥空间';
  }
  if(gaps.length > 1) {
    var g2 = gaps[1];
    phase2 += '；针对' + g2.label + '短板建立专项提升计划';
  }
  if(gaps.length > 0) {
    phase3 += '；重点评估' + gaps.map(function(g){ return g.label; }).join('、') + '维度的改善效果';
  }

  return [
    { phase: '第 1-30 天', text: phase1 },
    { phase: '第 31-60 天', text: phase2 },
    { phase: '第 61-90 天', text: phase3 }
  ];
}

/* ═══════════════════════════════════════════
   7. 项目配置算法
   ═══════════════════════════════════════════
   根据成员风格组合推荐项目分工：
   - 数据分析类：A 型成员牵头
   - 供应商谈判：R 型建立关系 + C 型条款博弈
   - 创新项目：I+P 型牵头
   - 成本削减：T+C 型牵头
   - 战略供应商管理：R+B 型主导
*/
function computeProjectConfig(members, dim) {
  var configs = [];

  // 数据分析类
  var aMembers = members.filter(function(m){ return m.code[0]==='A'; }).map(function(m){ return m.name; });
  if(aMembers.length > 0) {
    configs.push({ project:'数据分析类项目', config: aMembers[0] + '牵头' + (aMembers.length>1 ? '，' + aMembers.slice(1).join('、') + '配合' : '') });
  }

  // 供应商谈判
  var rMembers = members.filter(function(m){ return m.code[1]==='R'; }).map(function(m){ return m.name; });
  var cMembers = members.filter(function(m){ return m.code[2]==='C'; }).map(function(m){ return m.name; });
  if(rMembers.length > 0 && cMembers.length > 0) {
    configs.push({ project:'供应商谈判', config: rMembers[0] + '主导关系建立，' + cMembers[0] + '负责条款博弈' });
  }

  // 创新项目
  var ipMembers = members.filter(function(m){ return m.code[0]==='I' || m.code[3]==='P'; }).map(function(m){ return m.name; });
  if(ipMembers.length > 0) {
    configs.push({ project:'创新试点项目', config: ipMembers[0] + '牵头' + (ipMembers.length>1 ? '，' + ipMembers[1] + '配合' : '') });
  }

  // 成本削减
  var tcMembers = members.filter(function(m){ return m.code[1]==='T' || m.code[2]==='C'; }).map(function(m){ return m.name; });
  if(tcMembers.length > 0) {
    configs.push({ project:'成本削减项目', config: tcMembers[0] + '牵头' + (tcMembers.length>1 ? '，' + tcMembers[1] + '配合' : '') });
  }

  // 战略供应商管理
  var rbMembers = members.filter(function(m){ return m.code[1]==='R' || m.code[2]==='B'; }).map(function(m){ return m.name; });
  if(rbMembers.length > 0) {
    configs.push({ project:'战略供应商管理', config: rbMembers[0] + '主导' + (rbMembers.length>1 ? '，' + rbMembers[1] + '配合维护高层关系' : '') });
  }

  return configs;
}

/* ═══════════════════════════════════════════
   8. 课程匹配算法
   ═══════════════════════════════════════════
   根据团队短板维度匹配课程标签
*/
function matchCourses(courseLibrary, dim, members) {
  var total = members.length;
  var gaps = [];
  if(dim.I < dim.A) gaps.push('I');
  if(dim.T < dim.R) gaps.push('T');
  if(dim.B < dim.C) gaps.push('B');
  if(dim.P < dim.D) gaps.push('P');
  if(dim.A < dim.I) gaps.push('A');
  if(dim.R < dim.T) gaps.push('R');
  if(dim.C < dim.B) gaps.push('C');
  if(dim.D < dim.P) gaps.push('D');

  // 按短板匹配度排序课程
  var scored = (courseLibrary || []).map(function(c) {
    var matchCount = 0;
    (c.tags || []).forEach(function(t) { if(gaps.indexOf(t) >= 0) matchCount++; });
    return { course: c, score: matchCount };
  }).sort(function(a,b){ return b.score - a.score; });

  return scored.map(function(s) {
    var c = s.course;
    var matchText = s.score > 0 ? '精准匹配团队' + c.tags.filter(function(t){ return gaps.indexOf(t)>=0; }).join('、') + '维度短板' : '全面提升团队综合能力';
    return { name: c.name, teacher: '优链学堂 · 线下课', match: matchText, cta: c.cta, url: c.url };
  });
}

/* ═══════════════════════════════════════════
   9. 维度洞察算法
   ═══════════════════════════════════════════ */
function buildDimensionInsight(key, dim, total, members) {
  var templates = {
    A: {
      major: '团队偏向分析型决策，重视数据和逻辑。优势在于方案论证充分，风险识别准确；需注意避免过度分析导致决策延迟，建议为直觉型成员创造表达洞察的空间。',
      minor: '团队偏向直觉型判断，敏锐度高。优势在于快速捕捉机会和创新突破；需加强数据验证，避免决策过于主观。'
    },
    R: {
      major: '关系导向占优，团队氛围和谐，善于维护供应商关系。需平衡关系维护与任务达成，避免因人情影响谈判底线。',
      minor: '任务导向占优，目标明确执行力强。需注意关系维护，避免过于强硬影响长期合作。'
    },
    C: {
      major: '竞争意识较强，善于争取利益最大化。在供应商谈判中不易吃亏，但需注意长期合作关系的维护。',
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
   10. 渲染引擎
   ═══════════════════════════════════════════ */

function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function renderTeamReport() {
  var data = window.teamReportData;
  if(!data || !data.members) { console.error('teamReportData 未加载'); return; }

  var members = data.members;
  var total = members.length;
  var dim = countDimensions(members);

  // 全部算法计算
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
  el('score-num').textContent = data.score.value;
  el('score-level').textContent = data.score.emoji + ' ' + data.score.level + ' · 超越 ' + data.score.percentile + '% 的采购团队';

  // ── 团队概况 ──
  el('team-total').textContent = total;
  el('team-tested').textContent = total;
  el('team-pending').textContent = '0';
  el('team-tags').innerHTML =
    '<span class="tag">' + total + ' 人团队</span>' +
    '<span class="tag">100% 已测试</span>' +
    '<span class="tag">' + esc(teamType.label) + '</span>';
  el('team-type-label').innerHTML = teamType.emoji + ' ' + esc(teamType.label);
  el('team-type-desc').textContent = teamType.desc;

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
    memHtml += '<div class="member"><div class="avatar">' + esc(r.name.charAt(0)) + '</div><div class="member-info"><div class="member-name">' + esc(r.name) + ' · ' + esc(r.code) + ' ' + esc(sd.name||'') + ' ' + (sd.animal||'') + '</div><div class="member-code">' + esc(sd.dimension||'') + '</div></div><div class="member-status">✅ ' + esc(r.role) + '</div></div>';
  });
  el('members-container').innerHTML = memHtml;

  // ── 90 天行动计划 ──
  var apHtml = '';
  actionPlan.forEach(function(item, idx) {
    apHtml += '<div class="action-item"><div class="action-num">' + (idx+1) + '</div><div class="action-text"><strong>' + esc(item.phase) + '：</strong>' + esc(item.text) + '</div></div>';
  });
  el('action-plan-container').innerHTML = apHtml;

  // ── 项目配置建议 ──
  var pcHtml = '<div class="recommendation-content">';
  projectConfig.forEach(function(item, i) {
    if(i>0) pcHtml += '</div><div class="recommendation-content">';
    pcHtml += '<strong>' + esc(item.project) + '：</strong>' + esc(item.config);
  });
  pcHtml += '</div>';
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

function el(id) { return document.getElementById(id); }

/* ── 自动初始化 ── */
if(typeof document !== 'undefined') {
  if(document.readyState === 'complete') renderTeamReport();
  else window.addEventListener('DOMContentLoaded', renderTeamReport);
}
