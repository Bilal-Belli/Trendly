const express = require('express');
const app = express();

// Trends code part work on github
// 
// const axios = require('axios');
// const baseUrl = 'https://api.github.com';
// const getTrendingRepos = async () => {
//   try {
//     const response = await axios.get(`${baseUrl}/search/repositories`, {
//       headers: {
//         Authorization: `token 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`,
//       },
//       params: {
//         q: 'created:>2023-05-02',
//         sort: 'stars',
//         order: 'desc',
//       },
//     });
//     const trendingRepos = response.data.items;
//     const topRepos = trendingRepos.filter(repo => repo.stargazers_count >= 100);
//     const repoList = topRepos.map(repo => {
//       return {
//         name: repo.name,
//         description: repo.description,
//       };
//     });
//     console.log(repoList);
//   } catch (error) {
//     console.error(error);
//   }
// };
// getTrendingRepos();

// Trends code part work on twitter
//
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: 'F81bJXPLzBZKwgLa8KBEOlmp9',
  consumer_secret: 'JmqTKmFzT1kunf3KJ2r3sCF4KCrxRikE4qHCdwEh8UJ6EAV4yI',
  access_token_key: '1653420653490348035-1O0XVnuOXbNqmJ2RiSCnnnOzXuOp8n',
  access_token_secret: 'qIUtDagVTqvftSXUt4xHufDvwIpz05KEs58BSY1LuUxOH'
});
const WOEID = 23424977; // WOEID for United States
client.get('trends/place', { id: WOEID }, function(error, trends, response) {
  if (error) {
    console.log(error);
  } else {
    const trendingTopics = trends[0].trends.map(trend => trend.name);
    console.log('Trending topics:', trendingTopics);
  }
});

const github = require('github-profile');
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
