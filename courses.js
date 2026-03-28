// 课程匹配系统 v1.0
// 根据谈判风格智能匹配课程

const courseDatabase = [
  {
    id: 1,
    name: "《采购降本和双赢谈判+AI 应用》",
    teacher: "优链学堂 · 线下课",
    url: "https://www.ailianruyi.com/#/product/detail?id=5",
    matchStyles: ["ARCD", "ARBP", "ATCD", "ATBD"],
    matchReason: "数据分析与谈判技巧融合，AI 赋能降本增效",
    cta: "🔥 立即报名，提升谈判力"
  },
  {
    id: 2,
    name: "《决胜供应链》",
    teacher: "优链学堂 · 线下课",
    url: "https://www.ailianruyi.com/#/product/detail?id=4",
    matchStyles: ["ATCD", "ATCP", "ITCD", "ITCP"],
    matchReason: "提升谈判博弈能力，争取最大利益",
    cta: "🔥 立即报名，掌握谈判主动权"
  },
  {
    id: 3,
    name: "《供应商管理》",
    teacher: "优链学堂 · 线下课",
    url: "https://www.ailianruyi.com/#/product/detail?id=8",
    matchStyles: ["ARCP", "ARBP", "IRCP", "IRBP"],
    matchReason: "关系维护与竞争平衡，战略供应商管理",
    cta: "🔥 立即报名，构建供应商体系"
  },
  {
    id: 4,
    name: "《品类管理》",
    teacher: "优链学堂 · 线下课",
    url: "https://www.ailianruyi.com/#/product/detail?id=12",
    matchStyles: ["ARCD", "ATCD", "ARBD", "ATBD"],
    matchReason: "系统化品类策略，数据分析驱动决策",
    cta: "🔥 立即报名，掌握品类策略"
  }
];

// 根据风格代码获取匹配的课程
function getMatchedCourses(styleCode) {
  var matched = [];
  for (var i = 0; i < courseDatabase.length; i++) {
    var course = courseDatabase[i];
    if (course.matchStyles.includes(styleCode)) {
      matched.push({
        course: course,
        matchScore: 100 // 完全匹配
      });
    }
  }
  
  // 如果没有完全匹配，找相关的
  if (matched.length === 0) {
    var firstChar = styleCode[0]; // A/I
    var secondChar = styleCode[1]; // R/T
    var thirdChar = styleCode[2]; // C/B
    var fourthChar = styleCode[3]; // D/P
    
    for (var i = 0; i < courseDatabase.length; i++) {
      var course = courseDatabase[i];
      // 检查是否有部分匹配
      for (var j = 0; j < course.matchStyles.length; j++) {
        var matchStyle = course.matchStyles[j];
        var score = 0;
        if (matchStyle[0] === firstChar) score += 25;
        if (matchStyle[1] === secondChar) score += 25;
        if (matchStyle[2] === thirdChar) score += 25;
        if (matchStyle[3] === fourthChar) score += 25;
        
        if (score >= 50) {
          matched.push({
            course: course,
            matchScore: score
          });
        }
      }
    }
  }
  
  // 按匹配度排序
  matched.sort(function(a, b) { return b.matchScore - a.matchScore; });
  
  return matched;
}

// 根据团队类型推荐课程
function getTeamCourses(teamType, dimensions) {
  var recommended = [];
  
  // 根据团队类型推荐
  if (teamType === 'thinking' || dimensions.A > dimensions.I) {
    // 分析型团队
    recommended.push(courseDatabase[0]); // 采购降本和双赢谈判+AI 应用
    recommended.push(courseDatabase[3]); // 供应链 AI 实战
  } else if (teamType === 'orientation' || dimensions.R > dimensions.T) {
    // 关系型团队
    recommended.push(courseDatabase[1]); // 供应商管理与实战
  } else if (teamType === 'approach' || dimensions.C > dimensions.B) {
    // 竞争型团队
    recommended.push(courseDatabase[2]); // 决胜供应链·谈判力
  } else if (teamType === 'strategy' || dimensions.D > dimensions.P) {
    // 防御型团队
    recommended.push(courseDatabase[0]); // 采购降本和双赢谈判+AI 应用
  }
  
  // 如果没有推荐，默认推荐第一个
  if (recommended.length === 0) {
    recommended.push(courseDatabase[0]);
  }
  
  return recommended;
}

// 生成课程 HTML
function generateCourseHTML(courses, isTeamReport) {
  if (!courses || courses.length === 0) return '';
  
  var html = '<div class="card">';
  html += '<div class="card-title pro">🎓 推荐课程 · 针对性提升</div>';
  
  for (var i = 0; i < courses.length; i++) {
    var course = courses[i].course || courses[i];
    var matchScore = courses[i].matchScore;
    
    html += '<div class="course" onclick="window.open(\'' + course.url + '\', \'_blank\')" style="cursor:pointer;">';
    html += '<div class="course-name">' + course.name + '</div>';
    html += '<div class="course-teacher">👨‍🏫 ' + course.teacher + '</div>';
    
    if (matchScore) {
      html += '<div class="course-match">✅ 匹配度：' + matchScore + '% - ' + course.matchReason + '</div>';
    } else {
      html += '<div class="course-match">✅ ' + course.matchReason + '</div>';
    }
    
    html += '<div class="course-price">' + course.price + ' <span class="course-original">' + course.priceUnit + '</span></div>';
    html += '<div style="font-size:11px;color:#d4af37;margin-top:8px;">🔗 点击查看详情</div>';
    html += '</div>';
  }
  
  html += '</div>';
  return html;
}

// 在结果页渲染课程
function renderCourses(styleCode) {
  // 延迟执行，确保其他渲染已完成
  setTimeout(function() {
    console.log('renderCourses 开始执行，styleCode:', styleCode);
    
    var container = document.getElementById('courseRecommendation');
    console.log('container:', container);
    if (!container) {
      console.log('未找到 courseRecommendation 容器');
      return;
    }
    
    var matched = getMatchedCourses(styleCode);
    console.log('匹配的课程数量:', matched.length);
    if (matched.length === 0) return;
    
    var topCourses = matched.slice(0, 2);
    
    var html = '<div style="background:linear-gradient(135deg,rgba(15,32,39,0.9),rgba(32,58,67,0.9));padding:20px;border-radius:12px;border:1px solid #d4af37;">';
    html += '<div style="font-size:15px;font-weight:700;color:#d4af37;margin-bottom:16px;">🎓 推荐课程 · 针对性提升</div>';
    
    for (var i = 0; i < topCourses.length; i++) {
      var course = topCourses[i].course;
      html += '<div onclick="window.open(\'' + course.url + '\', \'_blank\')" style="background:rgba(44,83,100,0.3);padding:16px;border-radius:10px;margin-bottom:14px;cursor:pointer;border:1px solid rgba(212,175,55,0.3);transition:all 0.3s;" onmouseover="this.style.background=\'rgba(44,83,100,0.5)\'" onmouseout="this.style.background=\'rgba(44,83,100,0.3)\'">';
      html += '<div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:6px;">' + course.name + '</div>';
      html += '<div style="font-size:12px;color:#86868b;margin-bottom:8px;">👨‍🏫 ' + course.teacher + '</div>';
      html += '<div style="font-size:12px;color:#cccccc;margin-bottom:10px;line-height:1.6;">✅ ' + course.matchReason + '</div>';
      html += '<div style="font-size:13px;color:#d4af37;font-weight:600;">' + course.cta + ' ›</div>';
      html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    console.log('课程推荐已渲染到页面');
    console.log('container.innerHTML:', container.innerHTML.substring(0, 100));
    
    // 确保容器可见
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    // 显示卡片
    var courseCard = document.getElementById('courseCard');
    if (courseCard) {
      courseCard.style.display = 'block';
      console.log('课程卡片已显示');
    }
    
    // 检查父容器
    var parent = container.parentElement;
    if (parent) {
      parent.style.display = 'block';
      console.log('父容器:', parent.className, 'display:', parent.style.display);
    }
  }, 500);
}

// 暴露到全局
window.courseDatabase = courseDatabase;
window.getMatchedCourses = getMatchedCourses;
window.getTeamCourses = getTeamCourses;
window.generateCourseHTML = generateCourseHTML;
window.renderCourses = renderCourses;

console.log('✅ 课程匹配系统已加载');
