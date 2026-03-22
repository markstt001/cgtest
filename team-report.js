// 团队配置报告 v1.0 - B 端付费产品
// 99 元/团队，解锁完整报告

const teamReportConfig = {
  price: 99,
  currency: 'CNY',
  features: [
    "详细团队风格分布分析",
    "优势与盲点深度解读",
    "最佳拍档配对建议",
    "招聘/培训优先级",
    "项目配置方案",
    "姜老师课程推荐",
    "PDF 报告下载"
  ]
};

// 风格定义（使用 cooperation-guides.js 中的 styleDefinitions，避免重复声明）
// 如果 window.styleDefinitions 不存在，则定义备用版本
if (typeof window.styleDefinitions === 'undefined') {
  window.styleDefinitions = {
    ARCD: { name: "战略架构师", animal: "🦉", dimension: "分析 + 关系 + 竞争 + 防御" },
    ARCP: { name: "关系建筑师", animal: "🦉", dimension: "分析 + 关系 + 竞争 + 开拓" },
    ARBD: { name: "谨慎守护者", animal: "🦉", dimension: "分析 + 关系 + 合作 + 防御" },
    ARBP: { name: "和谐维系者", animal: "🦉", dimension: "分析 + 关系 + 合作 + 开拓" },
    ATCD: { name: "精算防御者", animal: "🦅", dimension: "分析 + 任务 + 竞争 + 防御" },
    ATCP: { name: "理性协商者", animal: "🦅", dimension: "分析 + 任务 + 竞争 + 开拓" },
    ATBD: { name: "逻辑架构师", animal: "🦅", dimension: "分析 + 任务 + 合作 + 防御" },
    ATBP: { name: "务实协调者", animal: "🦅", dimension: "分析 + 任务 + 合作 + 开拓" },
    IRCD: { name: "创新开拓者", animal: "🦊", dimension: "直觉 + 关系 + 竞争 + 防御" },
    IRCP: { name: "关系联结者", animal: "🦊", dimension: "直觉 + 关系 + 竞争 + 开拓" },
    IRBD: { name: "人脉冒险家", animal: "🦊", dimension: "直觉 + 关系 + 合作 + 防御" },
    IRBP: { name: "信任 builder", animal: "🦊", dimension: "直觉 + 关系 + 合作 + 开拓" },
    ITCD: { name: "数据猎手", animal: "🐺", dimension: "直觉 + 任务 + 竞争 + 防御" },
    ITCP: { name: "果断执行者", animal: "🐺", dimension: "直觉 + 任务 + 竞争 + 开拓" },
    ITBD: { name: "谨慎守护者", animal: "🐺", dimension: "直觉 + 任务 + 合作 + 防御" },
    ITBP: { name: "愿景推动者", animal: "🐺", dimension: "直觉 + 任务 + 合作 + 开拓" }
  };
}

// 生成团队报告
function generateTeamReport(members) {
  // members: [{name: "张三", code: "ARCD"}, {name: "李四", code: "ARBP"}, ...]
  
  if (!members || members.length === 0) {
    return null;
  }
  
  // 统计分布
  var distribution = {};
  members.forEach(function(m) {
    if (!distribution[m.code]) {
      distribution[m.code] = { count: 0, members: [] };
    }
    distribution[m.code].count++;
    distribution[m.code].members.push(m.name);
  });
  
  // 计算维度分布
  var dimensions = { A: 0, I: 0, R: 0, T: 0, C: 0, B: 0, D: 0, P: 0 };
  members.forEach(function(m) {
    var code = m.code;
    if (code[0] === 'A') dimensions.A++;
    else dimensions.I++;
    
    if (code[1] === 'R') dimensions.R++;
    else dimensions.T++;
    
    if (code[2] === 'C') dimensions.C++;
    else dimensions.B++;
    
    if (code[3] === 'D') dimensions.D++;
    else dimensions.P++;
  });
  
  // 分析优势
  var advantages = [];
  if (dimensions.A > dimensions.I) {
    advantages.push({
      title: "数据分析能力强",
      desc: `团队中 ${dimensions.A} 人是分析型（A），决策时有数据支撑，不易冲动`,
      contributors: "分析型成员贡献"
    });
  } else {
    advantages.push({
      title: "创新洞察能力强",
      desc: `团队中 ${dimensions.I} 人是直觉型（I），善于发现机会和创新`,
      contributors: "直觉型成员贡献"
    });
  }
  
  if (dimensions.R > dimensions.T) {
    advantages.push({
      title: "关系维护能力好",
      desc: `团队中 ${dimensions.R} 人是关系导向（R），善于维护供应商关系和内部协调`,
      contributors: "关系型成员贡献"
    });
  } else {
    advantages.push({
      title: "任务执行能力强",
      desc: `团队中 ${dimensions.T} 人是任务导向（T），目标明确，执行力强`,
      contributors: "任务型成员贡献"
    });
  }
  
  if (dimensions.C > dimensions.B) {
    advantages.push({
      title: "竞争意识强",
      desc: `团队中 ${dimensions.C} 人是竞争型（C），在谈判中善于争取最大利益`,
      contributors: "竞争型成员贡献"
    });
  } else {
    advantages.push({
      title: "合作共赢意识好",
      desc: `团队中 ${dimensions.B} 人是合作型（B），善于建立长期合作关系`,
      contributors: "合作型成员贡献"
    });
  }
  
  if (dimensions.D > dimensions.P) {
    advantages.push({
      title: "风险控制能力强",
      desc: `团队中 ${dimensions.D} 人是防御型（D），谨慎保守，善于识别和规避风险`,
      contributors: "防御型成员贡献"
    });
  } else {
    advantages.push({
      title: "开拓创新能力好",
      desc: `团队中 ${dimensions.P} 人是开拓型（P），敢于尝试新方法和新机会`,
      contributors: "开拓型成员贡献"
    });
  }
  
  // 分析盲点
  var blindspots = [];
  if (dimensions.A < 2 && dimensions.I < 2) {
    blindspots.push({
      title: "缺少数据分析者",
      desc: "团队中分析型（A）成员较少，可能在做决策时缺乏充分的数据支撑",
      risk: "容易凭感觉或经验决策，可能忽略关键数据"
    });
  }
  
  if (dimensions.R < 2 && dimensions.T < 2) {
    blindspots.push({
      title: "缺少关系维护者",
      desc: "团队中关系导向（R）成员较少，可能忽略供应商关系和内部协调",
      risk: "容易把关系搞僵，影响长期合作"
    });
  }
  
  if (dimensions.C < 2 && dimensions.B < 2) {
    blindspots.push({
      title: "缺少竞争意识",
      desc: "团队中竞争型（C）成员较少，可能在谈判中过于妥协",
      risk: "容易吃亏，无法争取最大利益"
    });
  }
  
  if (dimensions.D < 2 && dimensions.P < 2) {
    blindspots.push({
      title: "缺少风险控制者",
      desc: "团队中防御型（D）成员较少，可能过于冒进",
      risk: "容易踩坑，忽略潜在风险"
    });
  }
  
  // 最佳拍档配对
  var bestMatches = {
    ARCD: "ARBP", ARCP: "ATBD", ARBD: "ATCP", ARBP: "ARCD",
    ATCD: "ARBP", ATCP: "ARBD", ATBD: "ARCP", ATBP: "IRCD",
    IRCD: "ATBP", IRCP: "ITBD", IRBD: "ITCP", IRBP: "ITCD",
    ITCD: "IRBP", ITCP: "ARCD", ITBD: "IRCP", ITBP: "IRBD"
  };
  
  var pairs = [];
  var used = {};
  
  for (var i = 0; i < members.length; i++) {
    if (used[i]) continue;
    
    var m1 = members[i];
    var matchCode = bestMatches[m1.code];
    
    for (var j = i + 1; j < members.length; j++) {
      if (used[j]) continue;
      
      var m2 = members[j];
      if (m2.code === matchCode || bestMatches[m2.code] === m1.code) {
        pairs.push({
          member1: m1,
          member2: m2,
          type: "天作之合",
          desc: `${m1.code} 和 ${m2.code} 是最佳搭档，互补性强`
        });
        used[i] = true;
        used[j] = true;
        break;
      }
    }
    
    // 如果没有最佳搭档，找次优配对
    if (!used[i]) {
      for (var j = i + 1; j < members.length; j++) {
        if (used[j]) continue;
        
        var m2 = members[j];
        // 检查是否有 2 个以上维度互补
        var complement = 0;
        if (m1.code[0] !== m2.code[0]) complement++;
        if (m1.code[1] !== m2.code[1]) complement++;
        if (m1.code[2] !== m2.code[2]) complement++;
        if (m1.code[3] !== m2.code[3]) complement++;
        
        if (complement >= 2) {
          pairs.push({
            member1: m1,
            member2: m2,
            type: "互补合作",
            desc: `${m1.code} 和 ${m2.code} 有${complement}个维度互补，可以分工合作`
          });
          used[i] = true;
          used[j] = true;
          break;
        }
      }
    }
  }
  
  // 未配对的成员
  var unpaired = [];
  for (var i = 0; i < members.length; i++) {
    if (!used[i]) {
      unpaired.push(members[i]);
    }
  }
  
  // 招聘建议
  var hiringSuggestions = [];
  if (dimensions.A < dimensions.I) {
    hiringSuggestions.push("建议招聘分析型（A）人才，增强数据分析能力");
  }
  if (dimensions.R < dimensions.T) {
    hiringSuggestions.push("建议招聘关系导向（R）人才，增强关系维护能力");
  }
  if (dimensions.C < dimensions.B) {
    hiringSuggestions.push("建议招聘竞争型（C）人才，增强谈判竞争力");
  }
  if (dimensions.D < dimensions.P) {
    hiringSuggestions.push("建议招聘防御型（D）人才，增强风险控制能力");
  }
  
  if (hiringSuggestions.length === 0) {
    hiringSuggestions.push("团队配置均衡，暂无明显短板");
  }
  
  // 培训建议
  var trainingSuggestions = [];
  if (dimensions.A > dimensions.I && dimensions.I === 0) {
    trainingSuggestions.push("建议分析型成员学习创新思维和直觉判断");
  }
  if (dimensions.R > dimensions.T && dimensions.T === 0) {
    trainingSuggestions.push("建议关系型成员学习任务管理和执行效率");
  }
  if (dimensions.C > dimensions.B && dimensions.B === 0) {
    trainingSuggestions.push("建议竞争型成员学习合作共赢思维");
  }
  if (dimensions.D > dimensions.P && dimensions.P === 0) {
    trainingSuggestions.push("建议防御型成员学习风险承担和创新尝试");
  }
  
  if (trainingSuggestions.length === 0) {
    trainingSuggestions.push("团队能力全面，建议持续学习和提升");
  }
  
  // 课程推荐
  var courseRecommendations = [];
  if (blindspots.some(b => b.title.includes("关系"))) {
    courseRecommendations.push({
      name: "《供应商关系管理》",
      teacher: "姜宏锋",
      reason: "增强团队关系维护能力"
    });
  }
  if (blindspots.some(b => b.title.includes("竞争"))) {
    courseRecommendations.push({
      name: "《谈判策略与执行》",
      teacher: "姜宏锋",
      reason: "增强团队竞争意识和谈判技巧"
    });
  }
  if (blindspots.some(b => b.title.includes("风险"))) {
    courseRecommendations.push({
      name: "《采购风险管理与控制》",
      teacher: "姜宏锋",
      reason: "增强团队风险识别和控制能力"
    });
  }
  
  if (courseRecommendations.length === 0) {
    courseRecommendations.push({
      name: "《供应链领导力》",
      teacher: "姜宏锋",
      reason: "全面提升团队综合能力"
    });
  }
  
  return {
    teamSize: members.length,
    distribution: distribution,
    dimensions: dimensions,
    advantages: advantages,
    blindspots: blindspots,
    pairs: pairs,
    unpaired: unpaired,
    hiringSuggestions: hiringSuggestions,
    trainingSuggestions: trainingSuggestions,
    courseRecommendations: courseRecommendations,
    generatedAt: new Date().toISOString()
  };
}

// 暴露到全局作用域
if (typeof window !== 'undefined') {
  window.generateTeamReport = generateTeamReport;
  window.teamReportConfig = teamReportConfig;
  window.styleDefinitions = styleDefinitions;
}
