// 团队仪表盘 v2.0 - 完整团队管理功能
// 包含：团队概况、风格分布、成员列表、成员对比、团队报告

// ==================== 团队仪表盘核心函数 ====================

// 进入团队仪表盘
function goToTeamDashboard() {
    var savedTeam = localStorage.getItem('currentTeam');
    if (!savedTeam) {
        alert('暂无团队，请先创建或加入团队');
        return;
    }
    
    var team = JSON.parse(savedTeam);
    renderTeamDashboard(team);
    
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('testPage').classList.add('hidden');
    document.getElementById('resultPage').classList.add('hidden');
    document.getElementById('myPage').classList.add('hidden');
    document.getElementById('bottomNav').classList.add('hidden');
    
    var dashboardContainer = document.getElementById('teamDashboardContainer');
    if (!dashboardContainer) {
        dashboardContainer = document.createElement('div');
        dashboardContainer.id = 'teamDashboardContainer';
        dashboardContainer.className = 'container hidden';
        dashboardContainer.style.cssText = 'background: #1a3a4a; min-height: 100vh;';
        document.body.appendChild(dashboardContainer);
    }
    dashboardContainer.classList.remove('hidden');
}

// 关闭仪表盘
function closeTeamDashboard() {
    var container = document.getElementById('teamDashboardContainer');
    if (container) {
        container.classList.add('hidden');
    }
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('bottomNav').classList.remove('hidden');
}

// 渲染团队仪表盘
function renderTeamDashboard(team) {
    var container = document.getElementById('teamDashboardContainer');
    if (!container) return;
    
    var members = team.members || [];
    var memberCount = members.length;
    var completedCount = members.filter(m => m.completed || (m.code && m.code.length === 4)).length;
    var pendingCount = memberCount - completedCount;
    
    var distribution = calculateStyleDistribution(members);
    var dimensions = calculateDimensionDistribution(members);
    var teamType = analyzeTeamType(dimensions, memberCount);
    
    container.innerHTML = buildDashboardHTML(team, members, memberCount, completedCount, pendingCount, distribution, dimensions, teamType);
}

function buildDashboardHTML(team, members, memberCount, completedCount, pendingCount, distribution, dimensions, teamType) {
    return `
        <div style="background: linear-gradient(135deg, #0f2027, #203a43); padding: 20px; border-bottom: 2px solid #d4af37; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <button onclick="closeTeamDashboard()" style="background: transparent; border: none; color: #fff; font-size: 24px; cursor: pointer; padding: 0;">←</button>
                <div>
                    <div style="font-size: 18px; font-weight: 700; color: #fff;">${escapeHtml(team.name)}</div>
                    <div style="font-size: 12px; color: #86868b;">邀请码：${team.inviteCode || 'N/A'}</div>
                </div>
            </div>
            <button onclick="copyInviteCode('${team.inviteCode || ''}')" style="background: rgba(212,175,55,0.2); border: 1px solid #d4af37; color: #d4af37; padding: 8px 16px; border-radius: 980px; font-size: 12px; cursor: pointer;">📋 复制</button>
        </div>
        
        <div style="display: flex; background: rgba(32,58,67,0.95); border-bottom: 1px solid #3a6a7a; overflow-x: auto;">
            <button class="team-tab-btn active" data-tab="overview" onclick="switchTeamTab('overview')" style="flex: 1; padding: 14px 12px; background: transparent; border: none; border-bottom: 3px solid #d4af37; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;">📊 概览</button>
            <button class="team-tab-btn" data-tab="analysis" onclick="switchTeamTab('analysis')" style="flex: 1; padding: 14px 12px; background: transparent; border: none; border-bottom: 3px solid transparent; color: #86868b; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;">🔍 分析</button>
            <button class="team-tab-btn" data-tab="compare" onclick="switchTeamTab('compare')" style="flex: 1; padding: 14px 12px; background: transparent; border: none; border-bottom: 3px solid transparent; color: #86868b; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;">⚖️ 对比</button>
            <button class="team-tab-btn" data-tab="report" onclick="switchTeamTab('report')" style="flex: 1; padding: 14px 12px; background: transparent; border: none; border-bottom: 3px solid transparent; color: #86868b; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;">📑 报告</button>
        </div>
        
        <div id="teamTab-overview" class="team-tab-content" style="padding-bottom: 40px;">${renderOverviewTab(team, members, memberCount, completedCount, pendingCount, distribution, teamType)}</div>
        <div id="teamTab-analysis" class="team-tab-content" style="display: none; padding-bottom: 40px;">${renderAnalysisTab(dimensions, members)}</div>
        <div id="teamTab-compare" class="team-tab-content" style="display: none; padding-bottom: 40px;">${renderCompareTab(members)}</div>
        <div id="teamTab-report" class="team-tab-content" style="display: none; padding-bottom: 40px;">${renderReportTab(members)}</div>
    `;
}

// ==================== 分析计算函数 ====================

function calculateStyleDistribution(members) {
    var distribution = {};
    members.forEach(function(m) {
        if (!m.code || m.code.length !== 4) return;
        if (!distribution[m.code]) {
            distribution[m.code] = { count: 0, members: [] };
        }
        distribution[m.code].count++;
        distribution[m.code].members.push(m.name);
    });
    return distribution;
}

function calculateDimensionDistribution(members) {
    var dimensions = { A: 0, I: 0, R: 0, T: 0, C: 0, B: 0, D: 0, P: 0 };
    members.forEach(function(m) {
        var code = m.code;
        if (!code || code.length !== 4) return;
        if (code[0] === 'A') dimensions.A++; else dimensions.I++;
        if (code[1] === 'R') dimensions.R++; else dimensions.T++;
        if (code[2] === 'C') dimensions.C++; else dimensions.B++;
        if (code[3] === 'D') dimensions.D++; else dimensions.P++;
    });
    return dimensions;
}

function analyzeTeamType(dimensions, totalMembers) {
    if (totalMembers === 0) return { name: '未定型', desc: '暂无足够数据' };
    
    var dimTotal = dimensions.A + dimensions.I + dimensions.R + dimensions.T + dimensions.C + dimensions.B + dimensions.D + dimensions.P;
    if (dimTotal === 0) return { name: '未定型', desc: '暂无足够数据' };
    
    var ratios = {
        A: dimensions.A / dimTotal, I: dimensions.I / dimTotal,
        R: dimensions.R / dimTotal, T: dimensions.T / dimTotal,
        C: dimensions.C / dimTotal, B: dimensions.B / dimTotal,
        D: dimensions.D / dimTotal, P: dimensions.P / dimTotal
    };
    
    var maxRatio = Math.max.apply(null, Object.values(ratios));
    var minRatio = Math.min.apply(null, Object.values(ratios));
    
    if (maxRatio - minRatio < 0.15) return { name: '⚖️ 均衡型团队', desc: '各维度分布均匀，能力全面，适应性强', type: 'balanced' };
    if (ratios.A > 0.6) return { name: '🧠 分析型团队', desc: '擅长数据分析和逻辑推理，决策谨慎', type: 'thinking' };
    if (ratios.I > 0.6) return { name: '💡 直觉型团队', desc: '擅长创新洞察和机会识别，思维活跃', type: 'thinking' };
    if (ratios.R > 0.6) return { name: '🤝 关系型团队', desc: '擅长关系维护和协调沟通，重视和谐', type: 'orientation' };
    if (ratios.T > 0.6) return { name: '🎯 任务型团队', desc: '擅长目标达成和高效执行，结果导向', type: 'orientation' };
    if (ratios.C > 0.6) return { name: '⚔️ 竞争型团队', desc: '擅长争取利益和谈判博弈，不甘示弱', type: 'approach' };
    if (ratios.B > 0.6) return { name: '🤲 合作型团队', desc: '擅长建立长期合作关系，寻求共赢', type: 'approach' };
    if (ratios.D > 0.6) return { name: '🛡️ 防御型团队', desc: '擅长风险控制和谨慎决策，保守稳健', type: 'strategy' };
    if (ratios.P > 0.6) return { name: '🚀 开拓型团队', desc: '擅长创新尝试和快速行动，敢于冒险', type: 'strategy' };
    return { name: '🔀 互补型团队', desc: '成员风格多样，优势互补，协作潜力大', type: 'complementary' };
}

// ==================== Tab 渲染函数 ====================

function renderOverviewTab(team, members, memberCount, completedCount, pendingCount, distribution, teamType) {
    var testedMembers = members.filter(m => m.code && m.code.length === 4);
    
    return `
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">📈 团队概况</div>
                </div>
                <div style="padding: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
                        <div style="background: rgba(44,83,100,0.3); padding: 16px; border-radius: 12px;">
                            <div style="font-size: 28px; font-weight: 800; color: #d4af37;">${memberCount}</div>
                            <div style="font-size: 11px; color: #86868b; margin-top: 4px;">总人数</div>
                        </div>
                        <div style="background: rgba(16,185,129,0.2); padding: 16px; border-radius: 12px;">
                            <div style="font-size: 28px; font-weight: 800; color: #10b981;">${completedCount}</div>
                            <div style="font-size: 11px; color: #86868b; margin-top: 4px;">已完成</div>
                        </div>
                        <div style="background: rgba(245,158,11,0.2); padding: 16px; border-radius: 12px;">
                            <div style="font-size: 28px; font-weight: 800; color: #f59e0b;">${pendingCount}</div>
                            <div style="font-size: 11px; color: #86868b; margin-top: 4px;">待完成</div>
                        </div>
                    </div>
                    <div style="margin-top: 16px; padding: 16px; background: rgba(44,83,100,0.2); border-radius: 12px;">
                        <div style="font-size: 12px; color: #86868b; margin-bottom: 6px;">团队类型</div>
                        <div style="font-size: 16px; font-weight: 700; color: #fff;">${teamType.name}</div>
                        <div style="font-size: 12px; color: #cccccc; margin-top: 4px;">${teamType.desc}</div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">🎯 风格分布</div>
                </div>
                <div style="padding: 20px;">${testedMembers.length > 0 ? renderStyleDistributionChart(distribution, testedMembers.length) : '<div style="text-align: center; color: #86868b; padding: 20px;">暂无已测试成员</div>'}</div>
            </div>
        </div>
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">👥 成员列表</div>
                </div>
                <div style="padding: 0;">${members.length > 0 ? members.map((m, idx) => renderMemberItem(m, idx, members.length)).join('') : '<div style="padding: 20px; text-align: center; color: #86868b;">暂无成员</div>'}</div>
            </div>
        </div>
        <div style="margin: 16px; padding: 0 4px;">
            <button onclick="addTeamMember()" style="width: 100%; background: rgba(44,83,100,0.6); color: #fff; border: 2px solid #3a6a7a; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 12px;">➕ 添加成员</button>
            <button onclick="inviteTeamMembers()" style="width: 100%; background: linear-gradient(135deg, #2c5364, #d4af37); color: #0f2027; border: none; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;">📤 邀请成员</button>
        </div>
    `;
}

function renderMemberItem(m, idx, total) {
    var isCompleted = m.completed || (m.code && m.code.length === 4);
    return `
        <div style="display: flex; align-items: center; padding: 16px; ${idx < total - 1 ? 'border-bottom: 1px solid rgba(58,106,122,0.3)' : ''}">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #2c5364, #d4af37); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #0f2027; flex-shrink: 0;">
                ${m.name ? m.name.charAt(0) : '?'}
            </div>
            <div style="flex: 1; margin-left: 12px; min-width: 0;">
                <div style="font-size: 14px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(m.name || '未命名')}</div>
                <div style="font-size: 11px; color: #86868b;">${m.code || '未测试'} ${m.code ? '· ' + getStyleName(m.code) : ''}</div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                ${isCompleted ? '<span style="font-size: 11px; color: #10b981; background: rgba(16,185,129,0.2); padding: 4px 10px; border-radius: 980px;">✅ 已完成</span>' : '<span style="font-size: 11px; color: #f59e0b; background: rgba(245,158,11,0.2); padding: 4px 10px; border-radius: 980px;">⏳ 待测试</span>'}
            </div>
        </div>
    `;
}

function renderStyleDistributionChart(distribution, total) {
    var entries = Object.entries(distribution);
    if (entries.length === 0) return '<div style="text-align: center; color: #86868b; padding: 20px;">暂无数据</div>';
    
    var colors = ['#d4af37', '#2c5364', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];
    
    return `
        <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(${entries.map((e, i) => colors[i % colors.length] + ' ' + (e[1].count / total * 100) + '%').join(', ')}); position: relative; flex-shrink: 0;">
                <div style="position: absolute; inset: 15px; background: #1a3a4a; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                        <div style="font-size: 20px; font-weight: 800; color: #fff;">${total}</div>
                        <div style="font-size: 10px; color: #86868b;">人</div>
                    </div>
                </div>
            </div>
            <div style="flex: 1; min-width: 0;">
                ${entries.map((e, i) => `
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <div style="width: 10px; height: 10px; border-radius: 2px; background: ${colors[i % colors.length]}; flex-shrink: 0;"></div>
                        <span style="font-size: 12px; color: #fff; font-weight: 600;">${e[0]}</span>
                        <span style="font-size: 11px; color: #86868b;">${e[1].count}人 (${(e[1].count / total * 100).toFixed(0)}%)</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateTeamAdvantages(dimensions) {
    var advantages = [];
    if (dimensions.A >= dimensions.I && dimensions.A > 0) advantages.push({ title: "数据分析能力强", desc: "团队中 " + dimensions.A + " 人是分析型，决策时有数据支撑，不易冲动" });
    else if (dimensions.I > 0) advantages.push({ title: "创新洞察能力强", desc: "团队中 " + dimensions.I + " 人是直觉型，善于发现机会和创新" });
    if (dimensions.R >= dimensions.T && dimensions.R > 0) advantages.push({ title: "关系维护能力好", desc: "团队中 " + dimensions.R + " 人是关系导向，善于维护供应商关系和内部协调" });
    else if (dimensions.T > 0) advantages.push({ title: "任务执行能力强", desc: "团队中 " + dimensions.T + " 人是任务导向，目标明确，执行力强" });
    if (dimensions.C >= dimensions.B && dimensions.C > 0) advantages.push({ title: "竞争意识强", desc: "团队中 " + dimensions.C + " 人是竞争型，在谈判中善于争取最大利益" });
    else if (dimensions.B > 0) advantages.push({ title: "合作共赢意识好", desc: "团队中 " + dimensions.B + " 人是合作型，善于建立长期合作关系" });
    if (dimensions.D >= dimensions.P && dimensions.D > 0) advantages.push({ title: "风险控制能力强", desc: "团队中 " + dimensions.D + " 人是防御型，谨慎保守，善于识别和规避风险" });
    else if (dimensions.P > 0) advantages.push({ title: "开拓创新能力好", desc: "团队中 " + dimensions.P + " 人是开拓型，敢于尝试新方法和新机会" });
    return advantages.length > 0 ? advantages : [{ title: "团队配置均衡", desc: "各维度能力分布均匀，无明显短板" }];
}

function generateTeamRisks(dimensions) {
    var risks = [];
    var total = dimensions.A + dimensions.I + dimensions.R + dimensions.T + dimensions.C + dimensions.B + dimensions.D + dimensions.P;
    if (total === 0) return risks;
    if (dimensions.A === 0 && dimensions.I === 0) risks.push({ title: "缺少数据分析者", desc: "团队中分析型成员较少", risk: "容易凭感觉或经验决策，可能忽略关键数据" });
    else if (dimensions.A < 2 && dimensions.I < 2) risks.push({ title: "数据分析能力弱", desc: "团队中分析型成员不足", risk: "决策时可能缺乏充分的数据支撑" });
    if (dimensions.R === 0 && dimensions.T === 0) risks.push({ title: "缺少关系维护者", desc: "团队中关系导向成员较少", risk: "容易把关系搞僵，影响长期合作" });
    else if (dimensions.R < 2 && dimensions.T < 2) risks.push({ title: "关系维护能力弱", desc: "团队中关系型成员不足", risk: "可能忽略供应商关系和内部协调" });
    if (dimensions.C === 0 && dimensions.B === 0) risks.push({ title: "缺少竞争意识", desc: "团队中竞争型成员较少", risk: "在谈判中可能过于妥协，容易吃亏" });
    else if (dimensions.C < 2 && dimensions.B < 2) risks.push({ title: "竞争意识不足", desc: "团队中竞争型成员不足", risk: "可能无法争取最大利益" });
    if (dimensions.D === 0 && dimensions.P === 0) risks.push({ title: "缺少风险控制者", desc: "团队中防御型成员较少", risk: "可能过于冒进，容易踩坑" });
    else if (dimensions.D < 2 && dimensions.P < 2) risks.push({ title: "风险控制能力弱", desc: "团队中防御型成员不足", risk: "可能忽略潜在风险" });
    return risks.length > 0 ? risks : [{ title: "风险较低", desc: "团队配置合理，无明显风险点", risk: "继续保持学习和提升" }];
}

function renderAnalysisTab(dimensions, members) {
    var testedMembers = members.filter(m => m.code && m.code.length === 4);
    var totalMembers = testedMembers.length;
    if (totalMembers === 0) return '<div style="padding: 40px; text-align: center; color: #86868b;">暂无足够数据进行分析</div>';
    
    var dimensionAnalysis = [
        { name: '信息获取', items: [
            { key: 'A', label: '分析型', count: dimensions.A, desc: '数据驱动，逻辑推理' },
            { key: 'I', label: '直觉型', count: dimensions.I, desc: '洞察敏锐，创新思维' }
        ]},
        { name: '决策导向', items: [
            { key: 'R', label: '关系型', count: dimensions.R, desc: '重视和谐，善于协调' },
            { key: 'T', label: '任务型', count: dimensions.T, desc: '目标明确，高效执行' }
        ]},
        { name: '处事方式', items: [
            { key: 'C', label: '竞争型', count: dimensions.C, desc: '争取利益，不甘示弱' },
            { key: 'B', label: '合作型', count: dimensions.B, desc: '寻求共赢，乐于协作' }
        ]},
        { name: '行动策略', items: [
            { key: 'D', label: '防御型', count: dimensions.D, desc: '谨慎保守，规避风险' },
            { key: 'P', label: '开拓型', count: dimensions.P, desc: '敢于尝试，快速行动' }
        ]}
    ];
    
    return `
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">📐 四维度分析</div>
                </div>
                <div style="padding: 20px;">
                    ${dimensionAnalysis.map(function(dim) {
                        return '<div style="margin-bottom: 20px;">' +
                            '<div style="font-size: 13px; font-weight: 600; color: #d4af37; margin-bottom: 10px;">' + dim.name + '</div>' +
                            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">' +
                            dim.items.map(function(item) {
                                var pct = totalMembers > 0 ? (item.count / totalMembers * 100) : 0;
                                var isMajority = item.count >= (totalMembers / 2);
                                return '<div style="background: ' + (isMajority ? 'rgba(212,175,55,0.15)' : 'rgba(44,83,100,0.3)') + '; padding: 12px; border-radius: 8px; border: ' + (isMajority ? '1px solid #d4af37' : 'none') + ';">' +
                                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">' +
                                    '<span style="font-size: 12px; font-weight: 600; color: #fff;">' + item.label + '</span>' +
                                    '<span style="font-size: 16px; font-weight: 800; color: ' + (isMajority ? '#d4af37' : '#fff') + ';">' + item.count + '</span>' +
                                    '</div>' +
                                    '<div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">' +
                                    '<div style="width: ' + pct + '%; height: 100%; background: ' + (isMajority ? '#d4af37' : '#2c5364') + '; transition: width 0.3s;"></div>' +
                                    '</div>' +
                                    '<div style="font-size: 10px; color: #86868b; margin-top: 6px;">' + item.desc + '</div>' +
                                    '</div>';
                            }).join('') +
                            '</div></div>';
                    }).join('')}
                </div>
            </div>
        </div>
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">✅ 团队优势</div>
                </div>
                <div style="padding: 20px;">
                    ${generateTeamAdvantages(dimensions).map(function(a) {
                        return '<div style="background: rgba(16,185,129,0.1); border-left: 3px solid #10b981; padding: 12px 14px; margin-bottom: 10px; border-radius: 0 8px 8px 0;">' +
                            '<div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px;">' + a.title + '</div>' +
                            '<div style="font-size: 12px; color: #cccccc;">' + a.desc + '</div>' +
                            '</div>';
                    }).join('')}
                </div>
            </div>
        </div>
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">⚠️ 潜在风险</div>
                </div>
                <div style="padding: 20px;">
                    ${generateTeamRisks(dimensions).map(function(r) {
                        return '<div style="background: rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; padding: 12px 14px; margin-bottom: 10px; border-radius: 0 8px 8px 0;">' +
                            '<div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px;">' + r.title + '</div>' +
                            '<div style="font-size: 12px; color: #cccccc;">' + r.desc + '</div>' +
                            '<div style="font-size: 11px; color: #f59e0b; margin-top: 4px; font-weight: 600;">⚠️ ' + r.risk + '</div>' +
                            '</div>';
                    }).join('')}
                </div>
            </div>
        </div>
        </div>
    `;
}

function renderCompareTab(members) {
    var testedMembers = members.filter(m => m.code && m.code.length === 4);
    if (testedMembers.length < 2) {
        return '<div style="padding: 40px; text-align: center;"><div style="font-size: 48px; margin-bottom: 16px;">⚠️</div><div style="font-size: 16px; color: #fff; margin-bottom: 8px;">需要至少 2 位已测试成员</div><div style="font-size: 13px; color: #86868b;">当前有 ' + testedMembers.length + ' 位已测试成员</div></div>';
    }
    return `
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">⚖️ 成员对比</div>
                </div>
                <div style="padding: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                        <div>
                            <label style="font-size: 11px; color: #86868b; display: block; margin-bottom: 6px;">成员 A</label>
                            <select id="compareMember1" onchange="runMemberComparison()" style="width: 100%; padding: 12px; background: rgba(44,83,100,0.6); border: 1px solid #3a6a7a; border-radius: 8px; color: #fff; font-size: 13px;">
                                ${testedMembers.map((m, i) => '<option value="' + i + '">' + escapeHtml(m.name) + ' (' + m.code + ')</option>').join('')}
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: #86868b; display: block; margin-bottom: 6px;">成员 B</label>
                            <select id="compareMember2" onchange="runMemberComparison()" style="width: 100%; padding: 12px; background: rgba(44,83,100,0.6); border: 1px solid #3a6a7a; border-radius: 8px; color: #fff; font-size: 13px;">
                                ${testedMembers.map((m, i) => '<option value="' + i + '"' + (i === 1 ? ' selected' : '') + '>' + escapeHtml(m.name) + ' (' + m.code + ')</option>').join('')}
                            </select>
                        </div>
                    </div>
                    <div id="comparisonResult" style="background: rgba(44,83,100,0.2); padding: 16px; border-radius: 12px;">
                        <div style="text-align: center; color: #86868b; padding: 20px;">选择两位成员进行对比</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderReportTab(members) {
    var testedMembers = members.filter(m => m.code && m.code.length === 4);
    if (testedMembers.length < 3) {
        return '<div style="padding: 40px; text-align: center;"><div style="font-size: 48px; margin-bottom: 16px;">📑</div><div style="font-size: 16px; color: #fff; margin-bottom: 8px;">需要至少 3 位已测试成员</div><div style="font-size: 13px; color: #86868b; margin-bottom: 20px;">当前有 ' + testedMembers.length + ' 位已测试成员</div><button onclick="addTeamMember()" style="background: linear-gradient(135deg, #2c5364, #d4af37); color: #0f2027; border: none; padding: 12px 32px; border-radius: 980px; font-size: 14px; font-weight: 600; cursor: pointer;">➕ 添加成员</button></div>';
    }
    var report = generateTeamReport(testedMembers);
    return `
        <div style="margin: 16px;">
            <div class="card" style="background: rgba(32,58,67,0.7); border-radius: 16px; overflow: hidden; border: 1px solid rgba(58,106,122,0.3);">
                <div style="background: linear-gradient(135deg, rgba(44,83,100,0.9), rgba(32,58,67,0.9)); padding: 16px 20px; border-bottom: 1px solid #3a6a7a;">
                    <div style="font-size: 15px; font-weight: 700; color: #ffffff;">📑 团队配置报告</div>
                </div>
                <div style="padding: 20px;">
                    <div style="background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #d4af37;">
                        <div style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 12px;">💎 付费解锁完整报告</div>
                        <div style="color: rgba(255,255,255,0.9); font-size: 12px; line-height: 1.8; margin-bottom: 12px;">
                            ✅ 详细团队风格分布分析<br>✅ 优势与盲点深度解读<br>✅ 最佳拍档配对建议<br>✅ 招聘/培训优先级<br>✅ 项目配置方案<br>✅ 姜老师课程推荐<br>✅ PDF 报告下载
                        </div>
                        <div style="font-size: 24px; font-weight: 800; color: #d4af37; margin-bottom: 12px;">¥99 <span style="font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.7);">/ 团队</span></div>
                        <button onclick="unlockTeamReport()" style="width: 100%; background: #d4af37; color: #0f2027; border: none; padding: 14px; border-radius: 980px; font-size: 14px; font-weight: 600; cursor: pointer;">立即解锁</button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div style="font-size: 13px; font-weight: 600; color: #86868b; margin-bottom: 10px;">免费预览</div>
                        <div style="background: rgba(44,83,100,0.2); padding: 14px; border-radius: 12px;">
                            <div style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px;">团队规模：${report.teamSize} 人</div>
                            <div style="margin-bottom: 12px;">
                                <div style="font-size: 12px; color: #10b981; margin-bottom: 6px;">✅ 核心优势</div>
                                ${report.advantages.slice(0, 2).map(a => '<div style="font-size: 12px; color: #fff; margin-bottom: 4px; padding-left: 14px; position: relative;"><span style="position: absolute; left: 0;">•</span>' + a.title + '</div>').join('')}
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #f59e0b; margin-bottom: 6px;">⚠️ 需关注</div>
                                ${report.blindspots.slice(0, 2).map(b => '<div style="font-size: 12px; color: #fff; margin-bottom: 4px; padding-left: 14px; position: relative;"><span style="position: absolute; left: 0;">•</span>' + b.title + '</div>').join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== Tab 切换函数 ====================

function switchTeamTab(tabName) {
    document.querySelectorAll('.team-tab-btn').forEach(function(btn) {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
            btn.style.borderBottomColor = '#d4af37';
            btn.style.color = '#fff';
        } else {
            btn.classList.remove('active');
            btn.style.borderBottomColor = 'transparent';
            btn.style.color = '#86868b';
        }
    });
    document.querySelectorAll('.team-tab-content').forEach(function(content) {
        content.style.display = 'none';
    });
    var targetTab = document.getElementById('teamTab-' + tabName);
    if (targetTab) targetTab.style.display = 'block';
}

// ==================== 成员对比函数 ====================

function runMemberComparison() {
    var select1 = document.getElementById('compareMember1');
    var select2 = document.getElementById('compareMember2');
    if (!select1 || !select2) return;
    
    var idx1 = parseInt(select1.value);
    var idx2 = parseInt(select2.value);
    
    var savedTeam = localStorage.getItem('currentTeam');
    if (!savedTeam) return;
    
    var team = JSON.parse(savedTeam);
    var members = team.members.filter(m => m.code && m.code.length === 4);
    
    if (idx1 >= members.length || idx2 >= members.length) return;
    
    var m1 = members[idx1];
    var m2 = members[idx2];
    
    if (m1.code === m2.code) {
        document.getElementById('comparisonResult').innerHTML = '<div style="text-align: center; color: #f59e0b; padding: 20px;">⚠️ 请选择两位不同的成员</div>';
        return;
    }
    
    var comparison = generateMemberComparison(m1, m2);
    
    document.getElementById('comparisonResult').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div style="background: rgba(44,83,100,0.3); padding: 16px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">${getStyleAnimal(m1.code)}</div>
                <div style="font-size: 18px; font-weight: 700; color: #fff;">${escapeHtml(m1.name)}</div>
                <div style="font-size: 20px; font-weight: 800; color: #d4af37; margin: 8px 0;">${m1.code}</div>
                <div style="font-size: 12px; color: #86868b;">${getStyleName(m1.code)}</div>
            </div>
            <div style="background: rgba(44,83,100,0.3); padding: 16px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">${getStyleAnimal(m2.code)}</div>
                <div style="font-size: 18px; font-weight: 700; color: #fff;">${escapeHtml(m2.name)}</div>
                <div style="font-size: 20px; font-weight: 800; color: #d4af37; margin: 8px 0;">${m2.code}</div>
                <div style="font-size: 12px; color: #86868b;">${getStyleName(m2.code)}</div>
            </div>
        </div>
        <div style="background: rgba(44,83,100,0.2); padding: 14px; border-radius: 12px; margin-bottom: 12px;">
            <div style="font-size: 13px; font-weight: 600; color: #d4af37; margin-bottom: 8px;">🔄 互补性分析</div>
            <div style="font-size: 12px; color: #fff; line-height: 1.6;">${comparison.complementarity}</div>
        </div>
        <div style="background: rgba(16,185,129,0.1); padding: 14px; border-radius: 12px; margin-bottom: 12px;">
            <div style="font-size: 13px; font-weight: 600; color: #10b981; margin-bottom: 8px;">✅ 协作优势</div>
            <div style="font-size: 12px; color: #fff; line-height: 1.6;">${comparison.strengths}</div>
        </div>
        <div style="background: rgba(245,158,11,0.1); padding: 14px; border-radius: 12px;">
            <div style="font-size: 13px; font-weight: 600; color: #f59e0b; margin-bottom: 8px;">⚠️ 注意事项</div>
            <div style="font-size: 12px; color: #fff; line-height: 1.6;">${comparison.caution}</div>
        </div>
    `;
}

function generateMemberComparison(m1, m2) {
    var code1 = m1.code, code2 = m2.code;
    var complementCount = 0;
    if (code1[0] !== code2[0]) complementCount++;
    if (code1[1] !== code2[1]) complementCount++;
    if (code1[2] !== code2[2]) complementCount++;
    if (code1[3] !== code2[3]) complementCount++;
    
    var complementarity = '';
    if (complementCount >= 3) complementarity = '高度互补！你们在 ' + complementCount + ' 个维度上不同，可以形成很强的优势互补。建议在项目中分工合作，发挥各自特长。';
    else if (complementCount === 2) complementarity = '中度互补！你们在 ' + complementCount + ' 个维度上不同，有一定的互补性。注意沟通方式，可以相互学习。';
    else if (complementCount === 1) complementarity = '轻度互补！你们在 ' + complementCount + ' 个维度上不同，风格较为相似。合作默契度高，但需注意盲点重叠。';
    else complementarity = '风格相似！你们在所有维度上都一致，思维方式和行为模式非常接近。合作默契，但要注意避免相同盲点。';
    
    var strengths = '基于你们的风格特点，建议：' + 
        (code1[0] === 'A' || code2[0] === 'A' ? '分析型成员负责数据收集和方案论证；' : '') +
        (code1[0] === 'I' || code2[0] === 'I' ? '直觉型成员负责创新思考和机会识别；' : '') +
        (code1[1] === 'R' || code2[1] === 'R' ? '关系型成员负责沟通协调和关系维护；' : '') +
        (code1[1] === 'T' || code2[1] === 'T' ? '任务型成员负责目标拆解和执行推进；' : '') +
        (code1[2] === 'C' || code2[2] === 'C' ? '竞争型成员负责谈判博弈和利益争取；' : '') +
        (code1[2] === 'B' || code2[2] === 'B' ? '合作型成员负责建立信任和长期关系；' : '') +
        (code1[3] === 'D' || code2[3] === 'D' ? '防御型成员负责风险识别和方案把关；' : '') +
        (code1[3] === 'P' || code2[3] === 'P' ? '开拓型成员负责创新尝试和快速行动；' : '');
    
    var caution = '合作时请注意：' +
        (code1[0] !== code2[0] ? '信息获取方式不同，要多交流各自的分析过程和直觉依据；' : '') +
        (code1[1] !== code2[1] ? '决策导向不同，要平衡关系维护和任务达成；' : '') +
        (code1[2] !== code2[2] ? '处事方式不同，要理解对方的竞争或合作意图；' : '') +
        (code1[3] !== code2[3] ? '行动策略不同，要协调风险控制和快速行动的节奏；' : '') +
        (code1[0] === code2[0] && code1[1] === code2[1] && code1[2] === code2[2] && code1[3] === code2[3] ? '风格高度相似，要注意避免相同盲点，可邀请其他风格成员加入讨论。' : '');
    
    if (!caution || caution === '合作时请注意：') caution = '保持良好沟通，相互尊重，发挥各自优势。';
    
    return { complementarity: complementarity, strengths: strengths, caution: caution };
}

// ==================== 辅助函数 ====================

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getStyleAnimal(code) {
    if (!code || code.length !== 4) return '❓';
    if (code[0] === 'A') return '🦉';
    if (code[0] === 'I') return '🦊';
    return '🦅';
}

function getStyleName(code) {
    var names = {
        'ARCD': '数据军师', 'ARCP': '关系达人', 'ARBD': '守门员', 'ARBP': '流程管家',
        'ATCD': '市场猎手', 'ATCP': '拍板侠', 'ATBD': '逻辑控', 'ATBP': '效率狂人',
        'IRCD': '直觉玩家', 'IRCP': '机会捕手', 'IRBD': '人脉王', 'IRBP': '和事佬',
        'ITCD': '变色龙', 'ITCP': '社交牛人', 'ITBD': '守门员', 'ITBP': '行动派'
    };
    return names[code] || '未知风格';
}

function copyInviteCode(code) {
    if (!code) { alert('暂无邀请码'); return; }
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function() { alert('邀请码已复制：' + code); }).catch(function() { fallbackCopy(code); });
    } else { fallbackCopy(code); }
}

function fallbackCopy(code) {
    var textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        alert('邀请码已复制：' + code);
    } catch (e) {
        alert('复制失败，请手动复制：' + code);
    }
    document.body.removeChild(textArea);
}

function addTeamMember() {
    var code = prompt('请输入成员的风格代码（如 ARCD）：');
    if (!code || code.length !== 4) { alert('请输入 4 位风格代码'); return; }
    var name = prompt('请输入成员姓名：');
    if (!name) name = '成员' + (Math.floor(Math.random() * 100) + 1);
    
    var savedTeam = localStorage.getItem('currentTeam');
    var team = savedTeam ? JSON.parse(savedTeam) : { name: '我的团队', members: [] };
    team.members.push({ name: name, code: code.toUpperCase(), completed: true, styleName: getStyleName(code.toUpperCase()) });
    localStorage.setItem('currentTeam', JSON.stringify(team));
    alert('添加成功！');
    
    var dashboardContainer = document.getElementById('teamDashboardContainer');
    if (dashboardContainer && !dashboardContainer.classList.contains('hidden')) {
        renderTeamDashboard(team);
    }
}

function inviteTeamMembers() {
    var savedTeam = localStorage.getItem('currentTeam');
    if (!savedTeam) { alert('暂无团队'); return; }
    var team = JSON.parse(savedTeam);
    var inviteCode = team.inviteCode || 'N/A';
    var shareText = '邀请你加入"' + escapeHtml(team.name) + '"团队，一起测试采购谈判风格！\n\n邀请码：' + inviteCode + '\n\n快来发现你的谈判基因吧！';
    
    if (navigator.share) {
        navigator.share({ title: '加入谈判风格测试团队', text: shareText }).catch(function() {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(function() { alert('邀请信息已复制，可以分享给团队成员了！'); }).catch(function() { alert(shareText); });
    } else { alert(shareText); }
}

function unlockTeamReport() {
    var confirmPay = confirm('确认支付 ¥99 解锁团队配置报告？\n\n包含：\n• 详细团队风格分布分析\n• 优势与盲点深度解读\n• 最佳拍档配对建议\n• 招聘/培训优先级\n• 项目配置方案\n• 姜老师课程推荐\n• PDF 报告下载\n\n（演示模式，实际需接入支付 API）');
    if (!confirmPay) return;
    alert('🎉 支付成功！\n\n完整报告已生成，您可以：\n1. 查看完整团队分析\n2. 下载 PDF 报告\n3. 分享给团队成员\n\n报告已保存到"我的"页面。');
    localStorage.setItem('teamReportPurchased', 'true');
    closeTeamDashboard();
    goToMyPage();
}

// 快速体验 - 生成示例团队
function quickDemoTeam() {
    var demoTeam = {
        name: '示例团队 - 采购精英队',
        leader: '粒子',
        inviteCode: 'DEMO' + Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString(),
        members: [
            { name: '张三', code: 'ARCD', completed: true, styleName: '数据军师' },
            { name: '李四', code: 'ITCP', completed: true, styleName: '社交牛人' },
            { name: '王五', code: 'ARBP', completed: true, styleName: '流程管家' },
            { name: '赵六', code: 'ATCD', completed: true, styleName: '市场猎手' },
            { name: '钱七', code: 'IRCD', completed: true, styleName: '直觉玩家' }
        ]
    };
    localStorage.setItem('currentTeam', JSON.stringify(demoTeam));
    alert('✅ 已生成 5 人示例团队！\n\n团队成员：\n• 张三 - ARCD 数据军师 🦉\n• 李四 - ITCP 社交牛人 🐺\n• 王五 - ARBP 流程管家 🦉\n• 赵六 - ATCD 市场猎手 🦅\n• 钱七 - IRCD 直觉玩家 🦊\n\n点击"📊 团队仪表盘"查看完整分析！');
    goToTeamDashboard();
}

// 清除团队数据
function clearTeamData() {
    if (confirm('确定要清除团队数据吗？\n\n这将删除：\n• 团队信息\n• 成员列表\n• 团队报告购买状态')) {
        localStorage.removeItem('currentTeam');
        localStorage.removeItem('teamReportPurchased');
        alert('✅ 团队数据已清除！');
        location.reload();
    }
}

// 暴露到全局作用域
if (typeof window !== 'undefined') {
    window.goToTeamDashboard = goToTeamDashboard;
    window.closeTeamDashboard = closeTeamDashboard;
    window.switchTeamTab = switchTeamTab;
    window.runMemberComparison = runMemberComparison;
    window.addTeamMember = addTeamMember;
    window.inviteTeamMembers = inviteTeamMembers;
    window.unlockTeamReport = unlockTeamReport;
    window.copyInviteCode = copyInviteCode;
    window.quickDemoTeam = quickDemoTeam;
    window.clearTeamData = clearTeamData;
}
