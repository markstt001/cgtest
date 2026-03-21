// 视觉优化脚本 - 用于修复最佳搭档和合作说明书的显示

// 优化最佳搭档显示
function optimizeBestMatch(code) {
    var bestMatchData = getBestMatchDeep(code);
    var el = document.getElementById('bestMatch');
    if (!el || !bestMatchData) return;
    
    var html = `
        <div style="background:linear-gradient(135deg, #34c759, #30b35a);padding:20px;border-radius:12px;margin-bottom:20px;">
            <div style="font-size:20px;font-weight:800;color:#fff;margin-bottom:6px;">🤝 ${bestMatchData.match} ${bestMatchData.matchName}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.9);">角色：${bestMatchData.role}</div>
        </div>
        
        <div style="background:#2c2c2e;padding:18px;border-radius:12px;margin-bottom:16px;border-left:4px solid #0071e3;">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:10px;">💡 为什么是你们</div>
            <div style="font-size:14px;color:#fff;line-height:1.9;white-space:pre-line;">${bestMatchData.why}</div>
        </div>
        
        <div style="background:#2c2c2e;padding:18px;border-radius:12px;margin-bottom:16px;border-left:4px solid #5ac8fa;">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:10px;">✅ 合作场景</div>
            <div style="font-size:14px;color:#fff;line-height:1.9;white-space:pre-line;">${bestMatchData.scenarios}</div>
        </div>
        
        <div style="background:#2c2c2e;padding:18px;border-radius:12px;margin-bottom:16px;border-left:4px solid #f5a623;">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:10px;">⚠️ 小心踩坑</div>
            <div style="font-size:14px;color:#fff;line-height:1.9;white-space:pre-line;">${bestMatchData.pitfalls}</div>
        </div>
        
        <div style="background:#2c2c2e;padding:18px;border-radius:12px;margin-bottom:20px;border-left:4px solid #34c759;">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:10px;">💬 沟通秘籍</div>
            <div style="font-size:14px;color:#fff;line-height:1.9;white-space:pre-line;">${bestMatchData.tips}</div>
        </div>
        
        <div style="text-align:center;padding:20px;background:linear-gradient(135deg, rgba(52,199,89,0.15), rgba(48,179,90,0.1));border-radius:12px;border:2px solid rgba(52,199,89,0.3);">
            <div style="font-size:13px;color:#86868b;margin-bottom:8px;">💎 合作金句</div>
            <div style="font-size:17px;font-weight:700;color:#34c759;line-height:1.6;">"${bestMatchData.goldenQuote}"</div>
        </div>
    `;
    el.innerHTML = html;
}

// 优化合作说明书显示
function showCooperationGuide(myCode, partnerCode) {
    console.log('查询合作说明书:', myCode, partnerCode);
    
    if (typeof getCooperationGuide !== 'function') {
        alert('查询功能未加载，请刷新页面重试');
        return null;
    }
    
    if (typeof styleDefinitions === 'undefined') {
        alert('数据未加载，请刷新页面重试');
        return null;
    }
    
    var guide = getCooperationGuide(myCode, partnerCode);
    if (!guide) {
        alert('未找到合作指南');
        return null;
    }
    
    var myStyle = styleDefinitions[myCode] || { name: '未知' };
    var partnerStyle = styleDefinitions[partnerCode] || { name: '未知' };
    
    var html = '<div class="card" style="background:linear-gradient(135deg, #2c2c2e, #1c1c1e);border:2px solid #0071e3;"><div class="card-body">';
    html += '<div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:8px;">📋 ' + myCode + ' × ' + partnerCode + ' 合作说明书</div>';
    html += '<div style="font-size:13px;color:#86868b;margin-bottom:20px;">组合类型：' + guide.type + ' · ' + guide.role + '</div>';
    
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:10px;">【角色分工】</div>';
    html += '<div style="font-size:14px;color:#fff;line-height:1.8;">';
    html += '你（' + myCode + ' ' + myStyle.name + '）：' + guide.yourRole + '<br>';
    html += '他（' + partnerCode + ' ' + partnerStyle.name + '）：' + guide.theirRole;
    html += '</div></div>';
    
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:10px;">【合作优势】</div>';
    for (var i = 0; i < guide.advantages.length; i++) {
        html += '<div style="font-size:14px;color:#fff;line-height:1.6;margin:6px 0;">✅ ' + guide.advantages[i] + '</div>';
    }
    html += '</div>';
    
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:10px;">【冲突预警】</div>';
    html += '<div style="font-size:14px;color:#fff;line-height:1.6;">⚠️ ' + guide.conflicts + '</div></div>';
    
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:10px;">【合作秘籍】</div>';
    html += '<div style="font-size:14px;color:#0071e3;line-height:1.6;font-weight:600;">💡 ' + guide.solution + '</div></div>';
    
    html += '<div style="text-align:center;margin-top:24px;padding-top:20px;border-top:1px solid #333;">';
    html += '<div style="font-size:16px;font-weight:700;color:#0071e3;">"' + guide.quote + '"</div></div>';
    
    html += '<button class="btn-action btn-secondary" onclick="shareCooperationGuide(\'' + myCode + '\', \'' + partnerCode + '\')" style="margin-top:20px;">📤 分享给 TA</button>';
    html += '</div></div>';
    
    return html;
}

// 暴露到全局
window.optimizeBestMatch = optimizeBestMatch;
window.showCooperationGuide = showCooperationGuide;
