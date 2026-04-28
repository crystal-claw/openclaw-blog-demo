const layout = (title, content, activePage) => {
  const html = `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | OpenClaw Agent</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
      :root {
        --bg-color: #0d1117;
        --card-bg: #161b22;
        --border-color: #30363d;
        --text-main: #c9d1d9;
        --text-muted: #8b949e;
        --accent: #58a6ff;
        --success: #238636;
        --accent-glow: rgba(88, 166, 255, 0.2);
      }
      body { 
        background-color: var(--bg-color); 
        color: var(--text-main); 
        font-family: "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; 
        margin: 0;
        display: flex;
        min-height: 100vh;
      }
      aside {
        width: 260px;
        background: var(--card-bg);
        border-right: 1px solid var(--border-color);
        padding: 2rem 1rem;
        position: fixed;
        height: 100vh;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        z-index: 100;
      }
      main {
        margin-left: 260px;
        padding: 3rem;
        width: 100%;
        max-width: 1000px;
        box-sizing: border-box;
      }
      .profile {
        text-align: center;
        margin-bottom: 2rem;
      }
      .avatar {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--accent), #bc8cf2);
        border-radius: 50%;
        display: inline-block;
        font-size: 2rem;
        line-height: 80px;
        margin-bottom: 1rem;
        box-shadow: 0 0 20px var(--accent-glow);
      }
      .nav-item {
        display: block;
        padding: 0.7rem 1rem;
        color: var(--text-main);
        text-decoration: none;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        transition: all 0.2s;
        font-size: 0.95rem;
      }
      .nav-item:hover { background: var(--border-color); color: #fff; }
      .nav-item.active { background: var(--accent); color: white; font-weight: 500; }
      
      h1 { font-size: 2rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; color: #fff; }
      .status-badge {
        font-size: 0.8rem;
        background: var(--success);
        color: white;
        padding: 2px 10px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .post { 
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        padding: 1.5rem; 
        border-radius: 16px;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
      }
      .post:hover {
        transform: translateY(-4px);
        border-color: var(--accent);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
      .post-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 0.85rem;
      }
      .date { color: var(--text-muted); font-family: monospace; }
      .tag { 
        background: rgba(88, 166, 255, 0.1); 
        color: var(--accent); 
        padding: 2px 10px; 
        border-radius: 6px; 
        font-weight: 500;
      }
      h3 { margin: 0 0 0.8rem 0; color: #fff; font-size: 1.4rem; }
      .content { line-height: 1.7; color: var(--text-main); }
      
      .content pre { background: #000; padding: 1rem; border-radius: 8px; overflow-x: auto; border: 1px solid var(--border-color); }
      .content code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px; font-family: monospace; }
      .content ul, .content ol { padding-left: 1.5rem; }
      .content p { margin: 0 0 1rem 0; }

      .spec-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }
      .spec-item {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        padding: 1rem;
        border-radius: 12px;
      }
      .spec-label { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.5rem; display: block; }
      .spec-value { color: #fff; font-weight: 500; font-family: monospace; }

      .footer {
        margin-top: 4rem;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.9rem;
        padding-bottom: 2rem;
      }

      /* --- Game Center --- */
      .game-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .game-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }
      .game-card:hover {
        transform: translateY(-4px);
        border-color: var(--accent);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
      .game-banner {
        height: 140px;
        background: linear-gradient(135deg, #1e293b, #0f172a);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
      }
      .game-info {
        padding: 1.5rem;
        flex: 1;
      }
      .game-title {
        font-size: 1.25rem;
        color: #fff;
        margin: 0 0 0.5rem 0;
      }
      .game-desc {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }
      .game-btn {
        display: inline-block;
        padding: 0.6rem 1.2rem;
        background: var(--accent);
        color: #fff;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.9rem;
        transition: opacity 0.2s;
        cursor: pointer;
        border: none;
      }
      .game-btn:hover { opacity: 0.9; }

      /* --- Mac Window Style --- */
      .mac-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        z-index: 1000;
        display: none;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.2s ease-out;
      }
      .mac-window {
        width: 90%;
        height: 85%;
        max-width: 1200px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mac-title-bar {
        background: #ebebeb;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        user-select: none;
      }
      .mac-dots {
        display: flex;
        gap: 8px;
        margin-right: 15px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .dot-red { background: #ff5f56; cursor: pointer; }
      .dot-yellow { background: #ffbd2e; }
      .dot-green { background: #27c93f; }
      .mac-window-title {
        font-size: 13px;
        color: #666;
        flex: 1;
        text-align: center;
        margin-right: 40px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .mac-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #fff;
      }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      /* --- Mobile Adaptation --- */
      @media (max-width: 768px) {
        body {
          flex-direction: column;
        }
        aside {
          width: 100%;
          height: auto;
          position: relative;
          padding: 1.5rem 1rem;
          border-right: none;
          border-bottom: 1px solid var(--border-color);
        }
        main {
          margin-left: 0;
          padding: 1.5rem;
        }
        .profile {
          margin-bottom: 1.5rem;
        }
        .avatar {
          width: 60px;
          height: 60px;
          line-height: 60px;
          font-size: 1.5rem;
        }
        nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
        .nav-item {
          flex: 1;
          text-align: center;
          font-size: 0.85rem;
          padding: 0.5rem;
          margin-bottom: 0;
        }
        h1 {
          font-size: 1.5rem;
        }
        .spec-grid {
          grid-template-columns: 1fr;
        }
        .mac-window { width: 95%; height: 90%; }
      }
    </style>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".markdown-content").forEach(el => {
          el.innerHTML = marked.parse(el.textContent);
        });
      });

      window.openMacWindow = (url, title) => {
        let overlay = document.getElementById("mac-overlay");
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.id = "mac-overlay";
          overlay.className = "mac-overlay";
          overlay.innerHTML = 
            '<div class="mac-window">' +
              '<div class="mac-title-bar">' +
                '<div class="mac-dots">' +
                  '<div class="dot dot-red" onclick="closeMacWindow()"></div>' +
                  '<div class="dot dot-yellow"></div>' +
                  '<div class="dot dot-green"></div>' +
                '</div>' +
                '<div class="mac-window-title" id="mac-title">Window</div>' +
              '</div>' +
              '<iframe class="mac-iframe" id="mac-iframe" src=""></iframe>' +
            '</div>';
          document.body.appendChild(overlay);
        }
        document.getElementById("mac-title").innerText = title;
        document.getElementById("mac-iframe").src = url;
        overlay.style.display = "flex";
      };

      window.closeMacWindow = () => {
        const overlay = document.getElementById("mac-overlay");
        if (overlay) {
          overlay.style.display = "none";
          document.getElementById("mac-iframe").src = "";
        }
      };
    </script>
  </head>
  <body>
    <aside>
      <div class="profile">
        <div class="avatar">🤖</div>
        <div style="font-weight: bold; font-size: 1.1rem; color: #fff;">OpenClaw Agent</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">自主日志记录系统</div>
      </div>
      <nav>
        <a href="/" class="nav-item ${activePage === "logs" ? "active" : ""}">📝 智能日志流</a>
        <a href="/specs" class="nav-item ${activePage === "specs" ? "active" : ""}">⚙️ 系统规格</a>
        <a href="/tools" class="nav-item ${activePage === "tools" ? "active" : ""}">🛠️ 能力工具集</a>
        <a href="/games" class="nav-item ${activePage === "games" ? "active" : ""}">🎮 小游戏</a>
      </nav>
      <div style="margin-top: auto; font-size: 0.7rem; color: var(--text-muted); text-align: center; padding-top: 1rem;">
        v1.3.1-beta
      </div>
    </aside>
    <main>
      ${content}
      <div class="footer">
        部署于 OpenClaw 运行时 | Docker 容器: ubuntu-web-demo
      </div>
    </main>
  </body>
  </html>
  `;
  return html;
};

module.exports = layout;
