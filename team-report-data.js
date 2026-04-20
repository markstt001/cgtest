/**
 * team-report-data.js — 团队报告原始数据（纯数据，无逻辑）
 * 修改此文件即可为不同团队生成报告，HTML + JS 无需改动。
 */

var teamReportData = {
  // ── 报告元信息 ──
  meta: {
    title: '团队配置报告',
    subtitle: '采购谈判基因 · 深度分析版',
    badge: '专业版报告',
    generatedAt: '2026-03-28'
  },

  // ── 团队成员（核心数据源，改这里即可换团队）──
  members: [
    { name: '张三', code: 'ARCD', role: '核心骨干' },
    { name: '李四', code: 'ITCP', role: '创新先锋' },
    { name: '王五', code: 'ARBP', role: '运营中坚' },
    { name: '赵六', code: 'ATCD', role: '谈判主力' },
    { name: '钱七', code: 'IRCD', role: '洞察补充' }
  ],

  // ── 团队综合评分 ──
  score: {
    value: 87,
    level: '优秀',
    percentile: 78,        // 超越 X% 的采购团队
    emoji: '🏆'
  },

  // ── 团队类型判定 ──
  teamType: {
    emoji: '🔀',
    label: '互补型团队',
    desc: '成员风格多样，优势互补，协作潜力大。建议加强跨风格沟通，最大化协同效应。'
  },

  // ── 90 天行动计划 ──
  actionPlan: [
    { phase: '第 1-30 天',  text: '完成团队沟通工作坊，建立跨风格理解；为李四授权创新试点项目' },
    { phase: '第 31-60 天', text: '优化决策流程，建立分级授权机制；启动市场情报收集系统' },
    { phase: '第 61-90 天', text: '复盘决策速度和准确性；调整人员配置，最大化互补效应' }
  ],

  // ── 项目配置建议 ──
  projectConfig: [
    { project: '数据分析类项目',     config: '张三牵头，赵六配合' },
    { project: '供应商谈判',         config: '李四主导关系建立，张三负责数据支撑，赵六负责条款博弈' },
    { project: '创新试点项目',       config: '钱七牵头，王五把控流程风险' },
    { project: '成本削减项目',       config: '赵六牵头，张三提供数据分析，李四负责供应商沟通' },
    { project: '战略供应商管理',     config: '王五主导，李四配合维护高层关系' }
  ],

  // ── 推荐课程 ──
  courses: [
    { name: '《采购降本和双赢谈判+AI 应用》', teacher: '优链学堂 · 线下课', match: '数据分析与谈判技巧融合，AI 赋能降本增效', cta: '立即报名，提升谈判力 ›', url: 'https://www.ailianruyi.com/#/product/detail?id=5' },
    { name: '《决胜供应链》',             teacher: '优链学堂 · 线下课', match: '提升谈判博弈能力，争取最大利益', cta: '立即报名，掌握谈判主动权 ›', url: 'https://www.ailianruyi.com/#/product/detail?id=4' },
    { name: '《供应商管理》',             teacher: '优链学堂 · 线下课', match: '关系维护与竞争平衡，战略供应商管理', cta: '立即报名，构建供应商体系 ›', url: 'https://www.ailianruyi.com/#/product/detail?id=8' },
    { name: '《品类管理》',               teacher: '优链学堂 · 线下课', match: '系统化品类策略，数据分析驱动决策', cta: '立即报名，掌握品类策略 ›', url: 'https://www.ailianruyi.com/#/product/detail?id=12' }
  ]
};
