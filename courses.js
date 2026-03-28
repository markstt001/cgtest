// 课程匹配系统 v1.0
// 根据谈判风格智能匹配课程

const courseDatabase = [
  {
    id: 1,
    name: "《采购降本和双赢谈判+AI 应用》",
    teacher: "优链学堂 · 线下课",
    price: "¥5,800",
    priceUnit: "/ 人次",
    url: "https://www.ailianruyi.com/#/product/detail?id=5",
    // 适合的风格类型
    matchStyles: ["ARCD", "ARBP", "ATCD", "ATBD"], // 分析型优先
    // 匹配原因
    matchReason: "数据分析与谈判技巧融合，AI 赋能降本增效",
    // 适合的场景
    scenarios: ["供应商谈判", "成本分析", "合同管理", "数字化建设"]
  },
  {
    id: 2,
    name: "《供应商管理与实战》",
    teacher: "优链学堂 · 线下课",
    price: "咨询价",
    priceUnit: "/ 人次",
    url: "https://www.ailianruyi.com/#/product/detail?id=5",
    matchStyles: ["ARCP", "ARBP", "IRCP", "IRBP"], // 关系型优先
    matchReason: "关系维护与竞争平衡，战略供应商管理",
    scenarios: ["供应商选择", "绩效管理", "关系维护", "战略合作"]
  },
  {
    id: 3,
    name: "《决胜供应链·谈判力》",
    teacher: "优链学堂 · 线下课",
    price: "咨询价",
    priceUnit: "/ 人次",
    url: "https://www.ailianruyi.com/#/product/detail?id=5",
    matchStyles: ["ATCD", "ATCP", "ITCD", "ITCP"], // 竞争型优先
    matchReason: "提升谈判博弈能力，争取最大利益",
    scenarios: ["价格谈判", "合同谈判", "冲突处理", "利益争取"]
  },
  {
    id: 4,
    name: "《供应链 AI 实战》",
    teacher: "优链学堂 · 线下课",
    price: "咨询价",
    priceUnit: "/ 人次",
    url: "https://www.ailianruyi.com/#/product/detail?id=5",
    matchStyles: ["ARCD", "ATCD", "IRCD", "ITCD"], // 分析型 + 防御型
    matchReason: "AI 工具应用，数据分析，智能决策",
    scenarios: ["数据分析", "需求预测", "智能决策", "流程优化"]
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
  var container = document.getElementById('courseRecommendation');
  if (!container) {
    // 如果没有容器，在 mbtiInsight 后面创建
    var mbtiBox = document.getElementById('mbtiInsight');
    if (mbtiBox) {
      var courseDiv = document.createElement('div');
      courseDiv.id = 'courseRecommendation';
      courseDiv.style.cssText = 'margin-top:20px;';
      mbtiBox.parentNode.insertBefore(courseDiv, mbtiBox.nextSibling);
      container = courseDiv;
    }
  }
  
  if (!container) return;
  
  var matched = getMatchedCourses(styleCode);
  if (matched.length === 0) return;
  
  var html = '<div style="background:linear-gradient(135deg,rgba(15,32,39,0.9),rgba(32,58,67,0.9));padding:20px;border-radius:12px;margin-top:20px;border:1px solid #d4af37;">';
  html += '<div style="font-size:15px;font-weight:700;color:#d4af37;margin-bottom:16px;">🎓 推荐课程</div>';
  
  for (var i = 0; i < Math.min(2, matched.length); i++) {
    var course = matched[i].course;
    html += '<div onclick="window.open(\'' + course.url + '\', \'_blank\')" style="background:rgba(44,83,100,0.3);padding:14px;border-radius:8px;margin-bottom:12px;cursor:pointer;border:1px solid rgba(212,175,55,0.3);">';
    html += '<div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:6px;">' + course.name + '</div>';
    html += '<div style="font-size:12px;color:#86868b;margin-bottom:6px;">👨‍🏫 ' + course.teacher + '</div>';
    html += '<div style="font-size:12px;color:#cccccc;margin-bottom:6px;">✅ ' + course.matchReason + '</div>';
    html += '<div style="font-size:16px;font-weight:800;color:#d4af37;">' + course.price + ' <span style="font-size:12px;color:#86868b;">' + course.priceUnit + '</span></div>';
    html += '<div style="font-size:11px;color:#d4af37;margin-top:8px;">🔗 点击查看详情</div>';
    html += '</div>';
  }
  
  html += '</div>';
  container.innerHTML = html;
}

// 暴露到全局
window.courseDatabase = courseDatabase;
window.getMatchedCourses = getMatchedCourses;
window.getTeamCourses = getTeamCourses;
window.generateCourseHTML = generateCourseHTML;
window.renderCourses = renderCourses;

console.log('✅ 课程匹配系统已加载');
