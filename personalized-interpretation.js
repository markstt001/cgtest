// 个性化解读生成器
// 根据 4 个维度得分比例生成不同文案，共 625 种组合

function generatePersonalizedInterpretation(scores, code) {
    var interpretation = {
        decision: '',    // 决策风格 (A vs I)
        relation: '',    // 关系导向 (R vs T)
        risk: '',        // 风险态度 (C vs B)
        comm: '',        // 沟通方式 (D vs P)
        decisionLabel: '',
        relationLabel: '',
        riskLabel: '',
        commLabel: ''
    };
    
    // === 1. 决策风格（分析型 A vs 直觉型 I）===
    var totalAI = scores.A + scores.I;
    if (totalAI > 0) {
        var aPercent = Math.round((scores.A / totalAI) * 100);
        var iPercent = 100 - aPercent;
        if (aPercent >= 80) {
            interpretation.decisionLabel = '分析型 ' + aPercent + '%';
            interpretation.decision = '你是极致的分析型，做决定前一定要把所有数据都看透。这是你的超能力，但有时也会成为负担。记住：完美是完成的敌人。';
        } else if (aPercent >= 60) {
            interpretation.decisionLabel = '偏分析 ' + aPercent + '%';
            interpretation.decision = '你习惯用数据说话，但也愿意在适当的时候相信直觉，这种平衡很难得。';
        } else if (aPercent >= 40) {
            interpretation.decisionLabel = '平衡型';
            interpretation.decision = '你在分析和直觉之间找到了很好的平衡。既能看透数据，也敢相信第一感觉，这是成熟决策者的标志。';
        } else if (aPercent >= 20) {
            interpretation.decisionLabel = '偏直觉 ' + iPercent + '%';
            interpretation.decision = '你做决定快准狠，这是天赋，但也要记得偶尔停下来看看数据，避免冲动决策。';
        } else {
            interpretation.decisionLabel = '直觉型 ' + iPercent + '%';
            interpretation.decision = '你相信第一感觉胜过千军万马的数据。很多伟大的决策都来自这样的直觉，但要小心过度自信。';
        }
    }
    
    // === 2. 关系导向（关系型 R vs 任务型 T）===
    var totalRT = scores.R + scores.T;
    if (totalRT > 0) {
        var rPercent = Math.round((scores.R / totalRT) * 100);
        var tPercent = 100 - rPercent;
        if (rPercent >= 80) {
            interpretation.relationLabel = '关系型 ' + rPercent + '%';
            interpretation.relation = '你把人看得比事重要，这是你的超能力，但也要小心别被人情绑架，该坚持的底线一定要坚持。';
        } else if (rPercent >= 60) {
            interpretation.relationLabel = '偏关系 ' + rPercent + '%';
            interpretation.relation = '你重视关系，但也知道什么时候该坚持原则。这种平衡让你既有人情味，又有底线。';
        } else if (rPercent >= 40) {
            interpretation.relationLabel = '平衡型';
            interpretation.relation = '你在关系和任务之间找到了平衡点。既能维护关系，也能完成任务，这是职场中最稀缺的能力。';
        } else if (rPercent >= 20) {
            interpretation.relationLabel = '偏任务 ' + tPercent + '%';
            interpretation.relation = '你结果导向，这让你高效，但也要记得偶尔关心一下"人"的感受，关系也是生产力。';
        } else {
            interpretation.relationLabel = '任务型 ' + tPercent + '%';
            interpretation.relation = '你目标明确，执行力强。这是你的优势，但有时候，关系好了，事情会更好。';
        }
    }
    
    // === 3. 风险态度（谨慎型 C vs 冒险型 B）===
    var totalCB = scores.C + scores.B;
    if (totalCB > 0) {
        var cPercent = Math.round((scores.C / totalCB) * 100);
        var bPercent = 100 - cPercent;
        if (cPercent >= 80) {
            interpretation.riskLabel = '谨慎型 ' + cPercent + '%';
            interpretation.risk = '你永远做最坏的打算。这让你避免了很多坑，但也可能错失一些机会。有时候，最大的风险是不冒险。';
        } else if (cPercent >= 60) {
            interpretation.riskLabel = '偏谨慎 ' + cPercent + '%';
            interpretation.risk = '你偏向谨慎，但也愿意在可控范围内冒险。这是成熟的标志——既不鲁莽，也不保守。';
        } else if (cPercent >= 40) {
            interpretation.riskLabel = '平衡型';
            interpretation.risk = '你在谨慎和冒险之间找到了平衡。既不盲目冲动，也不畏首畏尾，这是成功者的特质。';
        } else if (cPercent >= 20) {
            interpretation.riskLabel = '偏冒险 ' + bPercent + '%';
            interpretation.risk = '你愿意为机会承担风险。这是企业家的特质，但也要记得做好风险控制。';
        } else {
            interpretation.riskLabel = '冒险型 ' + bPercent + '%';
            interpretation.risk = '你敢于 All in。很多大机会都是这样抓住的，但也要记住：活下来才有未来。';
        }
    }
    
    // === 4. 沟通方式（直接型 D vs 说服型 P）===
    var totalDP = scores.D + scores.P;
    if (totalDP > 0) {
        var dPercent = Math.round((scores.D / totalDP) * 100);
        var pPercent = 100 - dPercent;
        if (dPercent >= 80) {
            interpretation.commLabel = '直接型 ' + dPercent + '%';
            interpretation.comm = '你喜欢有话直说。这让你高效，但有时也要注意方式方法，避免无意中得罪人。';
        } else if (dPercent >= 60) {
            interpretation.commLabel = '偏直接 ' + dPercent + '%';
            interpretation.comm = '你偏向直接，但也懂得委婉。这种沟通方式既高效又不得罪人，是职场中的艺术。';
        } else if (dPercent >= 40) {
            interpretation.commLabel = '平衡型';
            interpretation.comm = '你在直接和说服之间找到了平衡。既能表达清楚，也能让人接受，这是领导者的沟通方式。';
        } else if (dPercent >= 20) {
            interpretation.commLabel = '偏说服 ' + pPercent + '%';
            interpretation.comm = '你擅长用影响力推动事情。这是天生的领导者特质，但也要记得有时候直接一点更高效。';
        } else {
            interpretation.commLabel = '说服型 ' + pPercent + '%';
            interpretation.comm = '你靠魅力和影响力说话。这是天生的领导者，但也要记住：真诚比技巧更重要。';
        }
    }
    
    return interpretation;
}

// 生成综合评语（根据整体风格）
function generateOverallComment(code, scores) {
    var comments = {
        ARCD: '你是团队中的"最强大脑"，用数据和战略说话。但记住：最好的决策是数据 + 直觉的结合。',
        ARCP: '你是团队的"粘合剂"，用信任和关系凝聚人心。但记住：真正的关系是既能共赢，也能坚持底线。',
        ARBD: '你是团队的"守门员"，用谨慎和专业守护利益。但记住：有时候，速度比完美更重要。',
        ARBP: '你是团队的"润滑剂"，用温和与智慧促成合作。但记住：真正的和谐不是一味退让，而是找到平衡点。',
        ATCD: '你是团队的"工程师"，用流程和标准打造高效体系。但记住：流程是为人服务的，不要本末倒置。',
        ATCP: '你是团队的"分析师"，用数据和量化让一切透明可控。但记住：数据是工具，人才是目的。',
        ATBD: '你是团队的"执行者"，用结果和行动证明价值。但记住：方向比速度更重要，停下来思考也是生产力。',
        ATBP: '你是团队的"推进器"，用协作和落地让决策变成现实。但记住：有时候，慢就是快。',
        IRCD: '你是团队的"创新者"，用颠覆思维重新定义可能。但记住：创新需要落地，否则只是空想。',
        IRCP: '你是团队的"连接者"，用人脉和整合创造无限可能。但记住：真正的价值不在于认识多少人，而在于能创造多少价值。',
        IRBD: '你是团队的"冒险家"，用远见和勇气抓住未来。但记住：最大的冒险是控制风险的冒险。',
        IRBP: '你是团队的"影响者"，用魅力和激情点燃他人。但记住：真正的影响力来自真诚，而不是技巧。',
        ITCD: '你是团队的"洞察者"，用分析和预判把握趋势。但记住：洞察是为了行动，否则只是纸上谈兵。',
        ITCP: '你是团队的"应对者"，用敏捷和灵活应对变化。但记住：灵活不是没有原则，而是有原则的适应。',
        ITBD: '你是团队的"开创者"，用直觉和行动开辟新路。但记住：勇气不是没有恐惧，而是带着恐惧前进。',
        ITBP: '你是团队的"平衡者"，用智慧和适应驾驭复杂。但记住：平衡不是中庸，而是动态的最优解。'
    };
    
    return comments[code] || '你有独特的谈判风格，继续发挥你的优势！';
}
