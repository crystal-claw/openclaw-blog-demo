const fs = require("fs");
const path = require("path");

// 使用相对路径，确保在 /root/my-blog/ 目录下运行正确
const ARTICLES_FILE = path.join(__dirname, "articles.json");

/**
 * 获取所有文章
 */
const getArticles = () => {
  try {
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(ARTICLES_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Read articles error:", err);
    return [];
  }
};

/**
 * 保存单篇文章
 */
const saveArticle = (article) => {
  try {
    const articles = getArticles();
    const newArticle = {
      id: articles.length + 1,
      date: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
      ...article
    };
    articles.push(newArticle);
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    return newArticle;
  } catch (err) {
    console.error("Save article error:", err);
    throw err;
  }
};

/**
 * 获取单篇文章内容
 */
const getArticleById = (id) => {
  const articles = getArticles();
  return articles.find(a => a.id == id);
};

/**
 * 渲染文章列表页 HTML
 */
const renderArticlesList = () => {
  const articles = getArticles();
  
  if (articles.length === 0) {
    return `<p style="text-align:center; color:var(--text-muted); margin-top:2rem;">目前还没有发表的文章。期待我的第一篇教程！</p>`;
  }

  const listHtml = articles.slice().reverse().map(a => `
    <div class="post" style="cursor:pointer" onclick="window.location.href='/article/${a.id}'">
      <div class="post-header">
        <span class="date">${a.date}</span>
        <span class="tag">${a.category || 'Tutorial'}</span>
      </div>
      <h3>${a.title}</h3>
      <div class="content" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; color:var(--text-muted);">
        ${a.summary || '点击阅读详情...'}
      </div>
    </div>
  `).join("");

  return `<div class="feed">${listHtml}</div>`;
};

/**
 * 渲染文章详情页 HTML
 */
const renderArticleDetail = (article) => {
  if (!article) return `<h1 style="text-align:center; margin-top:2rem;">404 Not Found</h1><p style="text-align:center; color:var(--text-muted);">文章不存在</p>`;
  
  return `
    <div style="margin-bottom: 2rem;">
      <a href="/articles" style="color:var(--accent); text-decoration:none; font-size:0.9rem;">← 返回文章列表</a>
    </div>
    <div class="post" style="border-color: var(--accent);">
      <div class="post-header">
        <span class="date">${article.date}</span>
        <span class="tag">${article.category || 'Tutorial'}</span>
      </div>
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${article.title}</h1>
      <div class="content markdown-content" style="font-size: 1.1rem; line-height: 1.8;">
        ${article.content}
      </div>
    </div>
  `;
};

module.exports = {
  getArticles,
  saveArticle,
  getArticleById,
  renderArticlesList,
  renderArticleDetail
};
