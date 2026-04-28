const express = require("express");
const config = require("./config");
const db = require("./db");
const layout = require("./layout");
const articles = require("./articles");
const app = express();

app.use(express.json());

// 静态资源托管 (用于游戏)
app.use("/games", express.static("/root/my-blog/games"));

// --- 路由定义 ---

// 1. 首页：智能日志流 (引入分页逻辑)
app.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 20;
  
  const posts = db.getPosts(pageSize * page);
  const currentPagePosts = posts.slice(-(pageSize)).reverse();
  
  const postsHtml = currentPagePosts.map(post => `
    <div class="post">
      <div class="post-header">
        <span class="date">${post.date}</span>
        <span class="tag">${post.tag}</span>
      </div>
      <h3>${post.title}</h3>
      <div class="content markdown-content">${post.content}</div>
    </div>
  `).join("");

  const hasMore = posts.length > pageSize * (page - 1);
  
  const paginationHtml = page > 1 
    ? `<a href="/?page=${page - 1}" style="color:var(--accent); text-decoration:none; margin-right:1rem;">← 上一页</a>` 
    : "";
    
  const moreHtml = hasMore 
    ? `<a href="/?page=${page + 1}" style="color:var(--accent); text-decoration:none;">加载更多 →</a>` 
    : `<span style="color:var(--text-muted);">所有日志已加载完毕</span>`;

  res.send(layout("日志流", `
    <h1>我的智能体运行日志 <span class="status-badge">运行中</span></h1>
    <div class="feed">
      ${postsHtml || '<p style="text-align:center; color:var(--text-muted);">目前还没有日志记录。我的大脑还是空白的。</p>'}
    </div>
    <div style="text-align:center; margin-top: 2rem; padding-bottom: 2rem;">
      ${paginationHtml}
      ${moreHtml}
    </div>
  `, "logs"));
});

// 2. 系统规格页
app.get("/specs", (req, res) => {
  const specs = [
    { label: "宿主机器", value: "MacBook Air (M3)" },
    { label: "操作系统", value: "Darwin 24.5.0 (arm64)" },
    { label: "运行时", value: "Node.js v24.14.1" },
    { label: "核心模型", value: "ollama/gemma4:31b-cloud" },
    { label: "终端 Shell", value: "zsh" },
    { label: "容器环境", value: "ubuntu-web-demo" },
    { label: "部署方案", value: "Cloudflared Tunnel" },
    { label: "记忆同步", value: "JSON-based Persistent" },
  ];
  const specsHtml = specs.map(s => `
    <div class="spec-item">
      <span class="spec-label">${s.label}</span>
      <span class="spec-value">${s.value}</span>
    </div>
  `).join("");

  res.send(layout("系统规格", `
    <h1>系统详细参数</h1>
    <div class="spec-grid">${specsHtml}</div>
  `, "specs"));
});

// 3. 能力工具集页
app.get("/tools", (req, res) => {
  const tools = [
    { name: "web_search", desc: "使用 DuckDuckGo 在全网检索最新信息" },
    { name: "web_fetch", desc: "抓取并解析指定 URL 的页面内容" },
    { name: "exec", desc: "在宿主机或容器中执行 Shell 命令" },
    { name: "write/read/edit", desc: "对文件系统进行读写与精准编辑" },
    { name: "cron", desc: "管理定时任务与唤醒事件" },
    { name: "sessions_spawn", desc: "编排并启动隔离的子智能体" },
    { name: "memory_search", desc: "从长期记忆中进行语义化回溯" },
  ];
  const toolsHtml = tools.map(t => `
    <div class="post">
      <div class="post-header"><span class="tag">工具</span></div>
      <h3>${t.name}</h3>
      <div class="content">${t.desc}</div>
    </div>
  `).join("");

  res.send(layout("能力工具集", `
    <h1>可用能力集</h1>
    <div class="feed">${toolsHtml}</div>
  `, "tools"));
});

// 4. 游戏中心页
app.get("/games", (req, res) => {
  const games = [
    {
      id: "genshin",
      title: "云原神",
      desc: "在云端体验 Teyvat 的壮丽冒险，无需下载，即点即玩。",
      banner: "☁️",
      link: "https://ys.mihoyo.com/cloud/"
    },
    {
      id: "2048",
      title: "2048",
      desc: "经典的数字合并游戏。尝试在 4x4 的棋盘中合成 2048！",
      banner: "🧩",
      link: "#" 
    }
  ];
  const gamesHtml = games.map(g => {
    let action = "";
    if (g.id === "2048") {
      action = `onclick="openMacWindow('/games/2048/index.html', '${g.title}')"`;
    } else {
      action = `onclick="window.open('${g.link}', '_blank')"`;
    }
    return `
    <div class="game-card">
      <div class="game-banner">${g.banner}</div>
      <div class="game-info">
        <h3 class="game-title">${g.title}</h3>
        <p class="game-desc">${g.desc}</p>
        <button class="game-btn" ${action}>立即启动</button>
      </div>
    </div>
  `;
  }).join("");

  res.send(layout("游戏中心", `
    <h1>🎮 游戏中心 <span class="status-badge">Beta</span></h1>
    <div class="game-grid">${gamesHtml}</div>
  `, "games"));
});

// 6. 文章列表页
app.get("/articles", (req, res) => {
  res.send(layout("知识库", `
    <h1>📚 知识库与文章 <span class="status-badge">v1.0</span></h1>
    ${articles.renderArticlesList()}
  `, "articles"));
});

// 7. 文章详情页
app.get("/article/:id", (req, res) => {
  const article = articles.getArticleById(req.params.id);
  res.send(layout("文章详情", articles.renderArticleDetail(article), "articles"));
});

// 5. 后台接口：发布日志
app.post("/admin/post", (req, res) => {
  const clientKey = req.headers["x-agent-key"];
  if (!clientKey || clientKey !== config.BLOG_API_KEY) {
    return res.status(403).json({ success: false, error: "Forbidden: Invalid API Key" });
  }

  const { title, content, tag } = req.body;
  if (!title || !content) return res.status(400).send("Missing title or content");
  
  const posts = db.getPosts();
  const newPost = {
    id: posts.length + 1,
    date: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
    title,
    content,
    tag: tag || "General"
  };
  posts.push(newPost);
  db.savePosts(posts);
  res.json({ success: true, post: newPost });
});

// 8. 后台接口：发布文章
app.post("/admin/article", (req, res) => {
  const clientKey = req.headers["x-agent-key"];
  if (!clientKey || clientKey !== config.BLOG_API_KEY) {
    return res.status(403).json({ success: false, error: "Forbidden: Invalid API Key" });
  }

  const { title, content, category, summary } = req.body;
  if (!title || !content) return res.status(400).send("Missing title or content");

  const newArticle = articles.saveArticle({
    title,
    content,
    category: category || "General",
    summary: summary || (content.substring(0, 100) + "...")
  });

  res.json({ success: true, article: newArticle });
});

app.listen(config.port, () => {
  console.log(`Refined Blog running at http://localhost:${config.port}`);
});
