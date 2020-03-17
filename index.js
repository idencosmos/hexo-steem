var steem = require('steem');

function updateSteemArticles(username) {
  steem.api.getDiscussionsByBlog({limit:1000, tag:username}, function(err, result) {
    for (var i = 0; i < result.length; i++) {
      const { title, body, category, author, permlink, created, json_metadata } = result[i];
      if (result[i].author == username || hexo.config.steem_resteems) {
        const tags = JSON.parse(json_metadata).tags || [];
        const date = new Date(`${created}Z`);
        const content = body.replace(/\|/g, '|').replace(/%/g, '％').replace(/{/g, '｛').replace(/}/g, '｝');
        // let t = title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“');//.replace(/\[|\]|:|-|#|\(|\)|\'/g, '').replace('?', '').replace('?', '');
        // console.log(t, tags);
        hexo.post.create({
          slug: `${author}/${category}/${permlink}`,
          title: title.replace(/"(.*)"/g, '“$1”').replace(/"/g, '“'),
          content,
          date,
          tags,
          author,
        }, true)
      }
    }
  });
}

if (hexo.config.steem_users) {
  for (var i = 0; i < hexo.config.steem_users.length; i++) {
    updateSteemArticles(hexo.config.steem_users[i])
  }
} else {
  console.log('No steem usernames found, please add to the _config.yml')
}
