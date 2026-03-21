// 结果页显示优化脚本 v2.0
// 用于修复最佳搭档和合作说明书的显示问题

// 优化最佳搭档显示 - 栏目和明细区分
function renderBestMatchOptimized(code) {
    var bestMatchData = getBestMatchDeep(code);
    var el = document.getElementById('bestMatch');
    if (!el) {
        console.error('找不到 bestMatch 元素');
        return;
    }
    
    if (!bestMatchData) {
        el.innerHTML = '<div style="color:#86868b;text-align:center;padding:40px;">未找到最佳搭档数据</div>';
        return;
    }
    
    var html = '';
    
    // 标题卡片 - 绿色渐变
    html += '<div style="background:linear-gradient(135deg, #34c759, #30b35a);padding:20px;border-radius:12px;margin-bottom:24px;box-shadow:0 4px 20px rgba(52,199,89,0.3);">';
    html += '<div style="font-size:20px;font-weight:800;color:#fff;margin-bottom:6px;">🤝 ' + bestMatchData.match + ' ' + bestMatchData.matchName + '</div>';
    html += '<div style="display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.2);border-radius:980px;font-size:12px;color:#fff;font-weight:600;">角色：' + bestMatchData.role + '</div>';
    html += '</div>';
    
    // 栏目分隔线
    html += '<div style="margin:24px 0 16px;display:flex;align-items:center;gap:12px;">';
    html += '<div style="flex:1;height:1px;background:linear-gradient(90deg, transparent, #333, transparent);"></div>';
    html += '<div style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">合作指南</div>';
    html += '<div style="flex:1;height:1px;background:linear-gradient(90deg, transparent, #333, transparent);"></div>';
    html += '</div>';
    
    // 为什么是你们
    html += '<div style="background:#1c1c1e;padding:16px;border-radius:12px;margin-bottom:14px;border:1px solid #333;">';
    html += '<div style="font-size:13px;font-weight:700;color:#0071e3;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">💡 为什么是你们</div>';
    html += '<div style="font-size:14px;color:#e0e0e0;line-height:2;white-space:pre-line;padding-left:12px;border-left:2px solid #0071e3;">' + bestMatchData.why + '</div>';
    html += '</div>';
    
    // 合作场景
    html += '<div style="background:#1c1c1e;padding:16px;border-radius:12px;margin-bottom:14px;border:1px solid #333;">';
    html += '<div style="font-size:13px;font-weight:700;color:#5ac8fa;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">✅ 合作场景</div>';
    html += '<div style="font-size:14px;color:#e0e0e0;line-height:2;white-space:pre-line;padding-left:12px;border-left:2px solid #5ac8fa;">' + bestMatchData.scenarios + '</div>';
    html += '</div>';
    
    // 小心踩坑
    html += '<div style="background:#1c1c1e;padding:16px;border-radius:12px;margin-bottom:14px;border:1px solid #333;">';
    html += '<div style="font-size:13px;font-weight:700;color:#f5a623;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">⚠️ 小心踩坑</div>';
    html += '<div style="font-size:14px;color:#e0e0e0;line-height:2;white-space:pre-line;padding-left:12px;border-left:2px solid #f5a623;">' + bestMatchData.pitfalls + '</div>';
    html += '</div>';
    
    // 沟通秘籍
    html += '<div style="background:#1c1c1e;padding:16px;border-radius:12px;margin-bottom:20px;border:1px solid #333;">';
    html += '<div style="font-size:13px;font-weight:700;color:#34c759;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">💬 沟通秘籍</div>';
    html += '<div style="font-size:14px;color:#e0e0e0;line-height:2;white-space:pre-line;padding-left:12px;border-left:2px solid #34c759;">' + bestMatchData.tips + '</div>';
    html += '</div>';
    
    // 合作金句 - 特殊样式
    html += '<div style="text-align:center;padding:24px;background:linear-gradient(135deg, rgba(52,199,89,0.1), rgba(48,179,90,0.05));border-radius:12px;border:1px dashed rgba(52,199,89,0.4);">';
    html += '<div style="font-size:11px;color:#666;margin-bottom:10px;letter-spacing:2px;text-transform:uppercase;">💎 合作金句</div>';
    html += '<div style="font-size:16px;font-weight:700;color:#34c759;line-height:1.6;font-style:italic;">"' + bestMatchData.goldenQuote + '"</div>';
    html += '</div>';
    
    el.innerHTML = html;
    console.log('最佳搭档渲染完成');
}

// 合作说明书查询
function queryCooperationGuide(partnerCode) {
    console.log('=== 开始查询合作说明书 ===');
    console.log('partnerCode:', partnerCode);
    
    // 使用 window.currentResult 确保能访问到
    var myResult = window.currentResult || window.currentUserResult || null;
    
    // 尝试从 localStorage 获取
    if (!myResult) {
        try {
            var saved = localStorage.getItem('myTestResult');
            if (saved) {
                myResult = JSON.parse(saved);
                console.log('从 localStorage 恢复:', myResult);
            }
        } catch(e) {
            console.error('解析 localStorage 失败:', e);
        }
    }
    
    console.log('myResult:', myResult);
    console.log('getCooperationGuide:', typeof getCooperationGuide);
    console.log('styleDefinitions:', typeof styleDefinitions);
    
    try {
        // 检查依赖
        if (typeof getCooperationGuide !== 'function') {
            console.error('getCooperationGuide 未定义');
            alert('查询功能未加载，请刷新页面重试');
            return;
        }
        
        if (typeof styleDefinitions === 'undefined') {
            console.error('styleDefinitions 未定义');
            alert('数据未加载，请刷新页面重试');
            return;
        }
        
        var myCode = myResult ? myResult.code : null;
        if (!myCode) {
            alert('请先完成测试或查看测试结果');
            return;
        }
        
        console.log('查询参数：myCode=' + myCode + ', partnerCode=' + partnerCode);
        
        // 获取合作指南
        var guide = getCooperationGuide(myCode, partnerCode);
        console.log('guide:', guide);
        
        if (!guide || !guide.type) {
            console.error('guide 为空或无效');
            alert('未找到合作指南，请检查风格代码');
            return;
        }
        
        var resultDiv = document.getElementById('cooperationResult');
        if (!resultDiv) {
            console.error('cooperationResult 元素未找到');
            alert('页面元素未找到，请刷新页面');
            return;
        }
        
        // 获取风格信息
        var myStyle = styleDefinitions[myCode] || { name: '未知' };
        var partnerStyle = styleDefinitions[partnerCode] || { name: '未知' };
        console.log('myStyle:', myStyle);
        console.log('partnerStyle:', partnerStyle);
        
        // 构建 HTML
        var html = '<div class="card" style="background:linear-gradient(135deg, #2c2c2e, #1c1c1e);border:2px solid #0071e3;margin-top:20px;border-radius:16px;overflow:hidden;">';
        html += '<div class="card-body" style="padding:20px;">';
        
        // 标题
        html += '<div style="background:linear-gradient(135deg, #0071e3, #005bb5);padding:16px;margin:-20px -20px 20px -20px;">';
        html += '<div style="font-size:17px;font-weight:800;color:#fff;margin-bottom:6px;">📋 ' + myCode + ' × ' + partnerCode + ' 合作说明书</div>';
        html += '<div style="display:inline-block;padding:4px 10px;background:rgba(255,255,255,0.2);border-radius:980px;font-size:11px;color:#fff;font-weight:600;">' + guide.type + ' · ' + guide.role + '</div>';
        html += '</div>';
        
        // 角色分工
        html += '<div style="margin-bottom:20px;">';
        html += '<div style="font-size:12px;font-weight:700;color:#666;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">角色分工</div>';
        html += '<div style="background:#1c1c1e;padding:14px;border-radius:10px;border:1px solid #333;">';
        html += '<div style="margin-bottom:10px;"><span style="color:#0071e3;font-weight:600;">你</span> <span style="color:#86868b;font-size:12px;">（' + myCode + ' ' + myStyle.name + '）</span><div style="color:#e0e0e0;font-size:14px;line-height:1.7;margin-top:6px;">' + guide.yourRole + '</div></div>';
        html += '<div><span style="color:#34c759;font-weight:600;">他</span> <span style="color:#86868b;font-size:12px;">（' + partnerCode + ' ' + partnerStyle.name + '）</span><div style="color:#e0e0e0;font-size:14px;line-height:1.7;margin-top:6px;">' + guide.theirRole + '</div></div>';
        html += '</div></div>';
        
        // 合作优势
        html += '<div style="margin-bottom:20px;">';
        html += '<div style="font-size:12px;font-weight:700;color:#666;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">合作优势</div>';
        html += '<div style="background:#1c1c1e;padding:14px;border-radius:10px;border:1px solid #333;">';
        for (var i = 0; i < guide.advantages.length; i++) {
            html += '<div style="font-size:14px;color:#e0e0e0;line-height:1.7;margin-bottom:8px;display:flex;gap:8px;align-items:flex-start;"><span style="color:#34c759;flex-shrink:0;">✅</span><span>' + guide.advantages[i] + '</span></div>';
        }
        html += '</div></div>';
        
        // 冲突预警
        html += '<div style="margin-bottom:20px;">';
        html += '<div style="font-size:12px;font-weight:700;color:#666;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">冲突预警</div>';
        html += '<div style="background:rgba(245,166,35,0.08);padding:14px;border-radius:10px;border:1px solid rgba(245,166,35,0.3);">';
        html += '<div style="font-size:14px;color:#e0e0e0;line-height:1.7;"><span style="color:#f5a623;margin-right:6px;">⚠️</span>' + guide.conflicts + '</div>';
        html += '</div></div>';
        
        // 合作秘籍
        html += '<div style="margin-bottom:20px;">';
        html += '<div style="font-size:12px;font-weight:700;color:#666;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">合作秘籍</div>';
        html += '<div style="background:rgba(0,113,227,0.08);padding:14px;border-radius:10px;border:1px solid rgba(0,113,227,0.3);">';
        html += '<div style="font-size:14px;color:#e0e0e0;line-height:1.7;"><span style="color:#0071e3;margin-right:6px;">💡</span><span style="color:#5ac8fa;font-weight:600;">' + guide.solution + '</span></div>';
        html += '</div></div>';
        
        // 金句
        html += '<div style="text-align:center;padding:20px;background:linear-gradient(135deg, rgba(0,113,227,0.1), rgba(91,200,250,0.05));border-radius:12px;border:1px dashed rgba(0,113,227,0.4);">';
        html += '<div style="font-size:11px;color:#666;margin-bottom:8px;letter-spacing:2px;text-transform:uppercase;">金句</div>';
        html += '<div style="font-size:16px;font-weight:700;color:#0071e3;line-height:1.5;font-style:italic;">"' + guide.quote + '"</div></div>';
        
        // 分享按钮
        html += '<button class="btn-action btn-secondary" onclick="shareCooperationGuide(\'' + myCode + '\', \'' + partnerCode + '\')" style="margin-top:20px;width:100%;border-radius:10px;">📤 分享给 TA</button>';
        
        html += '</div></div>';
        
        resultDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
        
        // 滚动到结果
        setTimeout(function() {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        console.log('=== 合作说明书渲染完成 ===');
    } catch(e) {
        console.error('查询失败:', e);
        console.error('错误堆栈:', e.stack);
        alert('查询失败：' + e.message + '\n\n请打开浏览器控制台（F12）查看详细信息');
    }
}

// 选择风格代码并查询（简化版 - 直接查询）
function selectPartnerCode(code) {
    console.log('=== 选择风格代码 ===');
    console.log('code:', code);
    
    // 使用 window.currentResult 确保能访问到
    var myResult = window.currentResult || window.currentUserResult || null;
    
    // 尝试从 localStorage 获取
    if (!myResult) {
        try {
            var saved = localStorage.getItem('myTestResult');
            if (saved) {
                myResult = JSON.parse(saved);
                console.log('从 localStorage 恢复:', myResult);
            }
        } catch(e) {
            console.error('解析 localStorage 失败:', e);
        }
    }
    
    console.log('myResult:', myResult);
    
    // 检查是否已完成测试
    if (!myResult || !myResult.code) {
        alert('请先完成测试，查看您的风格类型后再查询合作指南');
        // 滚动到页面顶部，提示用户
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    console.log('myCode:', myResult.code);
    console.log('partnerCode:', code);
    
    // 直接查询
    queryCooperationGuide(code);
}

// 分享合作说明书
function shareCooperationGuide(code1, code2) {
    var guide = getCooperationGuide(code1, code2);
    var text = "我是" + code1 + " " + (styleDefinitions[code1] ? styleDefinitions[code1].name : "") + "，你是" + code2 + " " + (styleDefinitions[code2] ? styleDefinitions[code2].name : "") + "。\n\n我们的合作说明书：" + (guide ? guide.quote : "") + "\n\n快来测测你的谈判风格：https://yugao2.github.io/negotiation-test/";
    
    if (navigator.share) {
        navigator.share({
            title: '合作说明书',
            text: text,
            url: 'https://yugao2.github.io/negotiation-test/'
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(text).then(function() {
            alert('已复制到剪贴板，可以粘贴分享给朋友了！');
        }, function() {
            alert('复制失败，请手动复制：\n\n' + text);
        });
    }
}

// 分享测试链接
function shareTestLink() {
    var myResult = window.currentResult || window.currentUserResult || null;
    if (!myResult) {
        try {
            myResult = JSON.parse(localStorage.getItem('myTestResult'));
        } catch(e) {}
    }
    var text = "我刚测了采购谈判风格，结果是" + (myResult ? myResult.code + " " + (myResult.style ? myResult.style.name : "") : "") + "！\n\n你也来测测：https://yugao2.github.io/negotiation-test/";
    
    if (navigator.share) {
        navigator.share({
            title: '采购谈判风格测试',
            text: text,
            url: 'https://yugao2.github.io/negotiation-test/'
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(text).then(function() {
            alert('已复制到剪贴板，可以粘贴分享了！');
        }, function() {
            alert('复制失败，请手动复制：\n\n' + text);
        });
    }
}

// 暴露到全局
window.renderBestMatchOptimized = renderBestMatchOptimized;
window.queryCooperationGuide = queryCooperationGuide;
window.selectPartnerCode = selectPartnerCode;
window.shareCooperationGuide = shareCooperationGuide;
window.shareTestLink = shareTestLink;
