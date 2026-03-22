// 16 种谈判风格定义 v3
// 基于 4 维度：A/I（分析/直觉）、R/T（关系/任务）、C/B（竞争/合作）、D/P（防御/开拓）

var styles = {
    // AR 开头（分析型 + 关系导向）
    ARCD: {
        animal: '🦉',
        name: '战略架构师',
        role: '用数据构建战略，用关系维护生态',
        mbti: 'ISTJ · 检查者型',
        percent: '约占人群的 12%'
    },
    ARCP: {
        animal: '🦉',
        name: '关系建筑师',
        role: '用数据支撑关系，用合作建立信任',
        mbti: 'ISFJ · 保护者型',
        percent: '约占人群的 10%'
    },
    ARBD: {
        animal: '🦉',
        name: '创新探索者',
        role: '用分析评估风险，用直觉探索机会',
        mbti: 'INFJ · 咨询师型',
        percent: '约占人群的 8%'
    },
    ARBP: {
        animal: '🦉',
        name: '团队推动者',
        role: '用分析优化流程，用合作推动执行',
        mbti: 'ENFJ · 教导者型',
        percent: '约占人群的 11%'
    },
    
    // AT 开头（分析型 + 任务导向）
    ATCD: {
        animal: '🦅',
        name: '市场洞察者',
        role: '用数据洞察市场，用竞争赢得优势',
        mbti: 'INTJ · 战略家型',
        percent: '约占人群的 9%'
    },
    ATCP: {
        animal: '🦅',
        name: '快速决策者',
        role: '用分析支持决策，用执行达成目标',
        mbti: 'ENTJ · 指挥官型',
        percent: '约占人群的 7%'
    },
    ATBD: {
        animal: '🦅',
        name: '战略架构师',
        role: '用逻辑构建体系，用创新优化流程',
        mbti: 'INTP · 逻辑学家型',
        percent: '约占人群的 6%'
    },
    ATBP: {
        animal: '🦅',
        name: '效率优化师',
        role: '用分析提升效率，用合作优化结果',
        mbti: 'ESTJ · 监督者型',
        percent: '约占人群的 10%'
    },
    
    // IR 开头（直觉型 + 关系导向）
    IRCD: {
        animal: '🦊',
        name: '数据驱动者',
        role: '用直觉发现机会，用数据验证判断',
        mbti: 'ENFP · 倡导者型',
        percent: '约占人群的 8%'
    },
    IRCP: {
        animal: '🦊',
        name: '机会捕捉者',
        role: '用直觉捕捉机会，用关系实现价值',
        mbti: 'INFP · 治愈者型',
        percent: '约占人群的 7%'
    },
    IRBD: {
        animal: '🦊',
        name: '果断执行者',
        role: '用直觉判断方向，用关系推动执行',
        mbti: 'ESFJ · 供应者型',
        percent: '约占人群的 9%'
    },
    IRBP: {
        animal: '🦊',
        name: '温和协调者',
        role: '用直觉感知变化，用协调平衡各方',
        mbti: 'ISFP · 艺术家型',
        percent: '约占人群的 8%'
    },
    
    // IT 开头（直觉型 + 任务导向）
    ITCD: {
        animal: '🐺',
        name: '灵活适应者',
        role: '用直觉适应变化，用任务达成目标',
        mbti: 'ENTP · 发明家型',
        percent: '约占人群的 6%'
    },
    ITCP: {
        animal: '🐺',
        name: '社交联结者',
        role: '用直觉感知需求，用执行联结资源',
        mbti: 'ESFP · 表演者型',
        percent: '约占人群的 7%'
    },
    ITBD: {
        animal: '🐺',
        name: '谨慎守护者',
        role: '用直觉评估风险，用任务守护底线',
        mbti: 'ISTP · 手艺人型',
        percent: '约占人群的 5%'
    },
    ITBP: {
        animal: '🐺',
        name: '愿景推动者',
        role: '用直觉感知趋势，用执行推动愿景',
        mbti: 'ESTP · 企业家型',
        percent: '约占人群的 6%'
    }
};
