/**
 * team-report-data.js v3.0 — 团队报告原始数据（7门课程 + styleTags）
 * 
 * 数据来源说明：
 * - members: 每个成员完成个人谈判风格测试后得到的 4 字母代码（如 ARCD）
 * - courseLibrary: 课程库，算法根据团队短板维度 + 缺失风格自动匹配（tags + styleTags）
 * - score 不再在此硬编码，由算法从成员代码自动计算
 */

var teamReportData = {
  // ── 报告元信息 ──
  meta: {
    title: '团队配置报告',
    subtitle: '采购谈判基因 · 深度分析版',
    badge: '专业版报告',
    generatedAt: '2026-03-28'
  },

  // ── 团队成员（唯一核心数据源）──
  // 每个成员来自个人测试结果的 4 字母代码
  members: [
    { name: '张三', code: 'ARCD' },
    { name: '李四', code: 'ITCP' },
    { name: '王五', code: 'ARBP' },
    { name: '赵六', code: 'ATCD' },
    { name: '钱七', code: 'IRCD' }
  ],

  // ── 课程库（算法根据团队短板维度 + 缺失风格自动匹配）──
  courseLibrary: [
    { id: 1, name: '《需求管理、集成计划与库存控制+AI应用》',               tags: ['B','P'], styleTags: ['ARBP','ARBD','ATBP','ARCP','IRBP'],          cta: '立即报名，构建供应链计划体系 ›', url: 'https://www.ailianruyi.com/#/product/detail?id=1' },
    { id: 2, name: '《采购成本降低与双赢谈判+AI应用》',                     tags: ['C','T'], styleTags: ['ARCD','ATCD','ITCD','ITCP','ATBP','IRCD'],  cta: '立即报名，提升谈判力 ›',         url: 'https://www.ailianruyi.com/#/product/detail?id=2' },
    { id: 3, name: '《供应商开发、选择、考核与关系管理+AI应用》',           tags: ['R','B'], styleTags: ['ARCP','IRBD','IRBP','ARBP','IRCP','ITCP'],   cta: '立即报名，构建供应商体系 ›',     url: 'https://www.ailianruyi.com/#/product/detail?id=3' },
    { id: 4, name: '《采购品类管理-品类策略、流程与最佳实践+AI应用》',      tags: ['A','D'], styleTags: ['ARCD','ATCD','ATBD','IRBD','ITBD'],           cta: '立即报名，掌握品类策略 ›',       url: 'https://www.ailianruyi.com/#/product/detail?id=4' },
    { id: 5, name: '《供应链全面质量管理+AI应用》',                         tags: ['A','C'], styleTags: ['ARCD','ATCD','IRCD','ITBD','ITBP'],           cta: '立即报名，提升质量意识 ›',       url: 'https://www.ailianruyi.com/#/product/detail?id=5' },
    { id: 6, name: '《决胜供应链-研发、生产、销售、供应一体化与跨部门协同+AI应用》', tags: ['T','B'], styleTags: ['ATBP','ITBP','ITBD','ATBD','ATCP','IRBP'], cta: '立即报名，打破部门壁垒 ›',       url: 'https://www.ailianruyi.com/#/product/detail?id=6' },
    { id: 7, name: '《采购人员综合能力提升+AI应用》',                       tags: ['A','R','C','T','B'], styleTags: ['ARCP','IRCP','ITCD'],              cta: '立即报名，全面升级采购能力 ›',   url: 'https://www.ailianruyi.com/#/product/detail?id=7' }
  ]
};

if (typeof window !== 'undefined') {
  window.teamReportData = teamReportData;
}
