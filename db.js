const fs = require("fs");
const config = require("./config");

const getPosts = (limit = 20) => {
  try {
    const data = fs.readFileSync(config.POSTS_FILE, "utf8");
    const posts = JSON.parse(data);
    // 返回最新的 limit 条记录
    return posts.slice(-limit);
  } catch (err) {
    return [];
  }
};

const savePosts = (posts) => {
  fs.writeFileSync(config.POSTS_FILE, JSON.stringify(posts, null, 2));
};

module.exports = { getPosts, savePosts };
