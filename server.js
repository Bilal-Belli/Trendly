const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

// Trends from github
async function transformArrayGithub(originalArray) {
  const transformedArray = [];
  originalArray.forEach((item, index) => {
    transformedArray.push({
      id: index + 1,
      tag: 'github',
      title: item.name,
      description: item.description,
      path: item.lienRepo,
      userName: item.user
    });
  });
  return transformedArray;
}

const getTrendingRepos = async () => {
  try {
    const response = await axios.get(`https://api.github.com/search/repositories`, {
      headers: {
        Authorization: `token your_github_token_here`,
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
        lienRepo: repo.html_url,
        user: repo.owner["login"],
      };
    });
    return repoList;
  } catch (error) {
    console.error('Error fetching repos GITHUB.COM :',error);
  }
};

// Trends from dev.io
function transformArrayDEVIO(originalArray) {
  const transformedArray = [];
  originalArray.forEach((item, index) => {
    transformedArray.push({
      id: index + 1,
      tag: "DEVIO",
      title: item.typeOf,
      description: item.title,
      path: "https://dev.to/" + item.path,
      userName: "Unknown"
    });
  });
  return transformedArray;
}

async function getTrendingArticlesDEVIO() {
  const apiKey = 'your_api_token_here_devto';
  const articlesEndpoint_1 = 'https://dev.to/api/podcast_episodes';
  const articlesEndpoint_2 = 'https://dev.to/api/videos';
  try {
    const response_1 = await axios.get(articlesEndpoint_1, {
      headers: {
        'api-key': apiKey,
      },
    });
    const response_2 = await axios.get(articlesEndpoint_2, {
      headers: {
        'api-key': apiKey,
      },
    });
    const articles_1 = response_1.data.slice(0, 3);
    const articles_2 = response_2.data.slice(0, 3);
    const combinedArticlesDevIO = articles_1.concat(articles_2);
    const extractedData = combinedArticlesDevIO.map(item => {
      return {
        title: item.title,
        path: item.path,
        userName: item.user?.name, // Use optional chaining to handle cases where user object might be absent
        typeOf: item.type_of
      };
    });
    return extractedData;
  } catch (error) {
    console.error('Error fetching articles DEV.IO :', error);
  }
}

app.get('/getTrends',async (req, res) => {
  try {
    const githubArticles = await getTrendingRepos();
    const transformedArrayGithubResult = await transformArrayGithub(githubArticles);

    const devCommunityArticles = await getTrendingArticlesDEVIO();
    const transformedArrayDEVIOResult = await transformArrayDEVIO(devCommunityArticles);

    const mergedMessages = [
      ...transformedArrayGithubResult,
      ...transformedArrayDEVIOResult
    ].map((item, index) => ({ ...item, id: index + 1 }));

    res.json(mergedMessages);
  } catch (error) {
    console.error('Error:', error);
  }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});


// Trends code part work on twitter
// 
// const Twitter = require('twitter');
// const client = new Twitter({
//     consumer_key: '...',
//     consumer_secret: '...',
//     access_token_key: '...',
//     access_token_secret: '...'
// });
// const WOEID = 23424977; // WOEID for United States
// client.get('/tweets/search/stream/rules', { id: WOEID }, function(error, trends, response) {
//     if (error) {
//         console.log(error);
//     } else {
//         // const trendingTopics = trends[0].trends.map(trend => trend.name);
//         const trendingTopics = trends;
//         console.log('Trending topics:', trendingTopics);
//     }
// });
