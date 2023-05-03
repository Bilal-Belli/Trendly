const express = require('express');
const app = express();

const axios = require('axios');
const baseUrl = 'https://api.github.com';
const getTrendingRepos = async () => {
  try {
    const response = await axios.get(`${baseUrl}/search/repositories`, {
      headers: {
        Authorization: `token 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`,
      },
      params: {
        q: 'created:>2023-05-02',
        sort: 'stars',
        order: 'desc',
      },
    });
    const trendingRepos = response.data.items;
    const topRepos = trendingRepos.filter(repo => repo.stargazers_count >= 100);
    const repoList = topRepos.map(repo => {
      return {
        name: repo.name,
        description: repo.description,
      };
    });
    console.log(repoList);
  } catch (error) {
    console.error(error);
  }
};
getTrendingRepos();

const github = require('github-profile');
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
