const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ============ GITHUB ============
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
    console.error('Error fetching repos GITHUB.COM :', error);
    return [];
  }
};

// ============ DEV.IO ============
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
        userName: item.user?.name,
        typeOf: item.type_of
      };
    });
    return extractedData;
  } catch (error) {
    console.error('Error fetching articles DEV.IO :', error);
    return [];
  }
}

// ============ HACKER NEWS ============
async function transformArrayHackerNews(originalArray) {
  const transformedArray = [];
  originalArray.forEach((item, index) => {
    transformedArray.push({
      id: index + 1,
      tag: 'HackerNews',
      title: item.title || 'Untitled',
      description: `Score: ${item.score} | Comments: ${item.descendants} | By: ${item.by}`,
      path: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      userName: item.by || 'Unknown'
    });
  });
  return transformedArray;
}

async function getTrendingHackerNews() {
  try {
    // Get top stories IDs
    const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds = topStoriesResponse.data.slice(0, 10);
    
    // Fetch details for each story
    const storyPromises = topStoryIds.map(id => 
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    );
    const storyResponses = await Promise.all(storyPromises);
    const stories = storyResponses.map(response => response.data);
    
    // Filter for computer science related topics
    const csKeywords = ['computer', 'science', 'algorithm', 'programming', 'code', 'developer', 'software', 'AI', 'machine learning', 'data', 'tech', 'github', 'react', 'python', 'javascript', 'rust', 'go', 'java'];
    const csStories = stories.filter(story => 
      story.title && csKeywords.some(keyword => 
        story.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    return csStories.slice(0, 5);
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}

// ============ REDDIT ============
async function transformArrayReddit(originalArray) {
  const transformedArray = [];
  originalArray.forEach((item, index) => {
    transformedArray.push({
      id: index + 1,
      tag: 'Reddit',
      title: item.title,
      description: `👍 ${item.ups} | 💬 ${item.num_comments} | r/${item.subreddit}`,
      path: `https://reddit.com${item.permalink}`,
      userName: item.author
    });
  });
  return transformedArray;
}

async function getTrendingReddit() {
  try {
    // Get top posts from computer science related subreddits
    const subreddits = ['MachineLearning', 'Programming', 'Python', 'javascript', 'golang', 'rust', 'learnprogramming', 'compsci', 'algorithms'];
    const allPosts = [];
    
    for (const subreddit of subreddits) {
      try {
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json`, {
          params: {
            limit: 3,
            t: 'week'
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TrendsBot/1.0)'
          }
        });
        const posts = response.data.data.children.map(child => child.data);
        allPosts.push(...posts);
      } catch (error) {
        console.error(`Error fetching r/${subreddit}:`, error.message);
      }
    }
    
    // Sort by upvotes and get top 5
    const sortedPosts = allPosts.sort((a, b) => b.ups - a.ups);
    return sortedPosts.slice(0, 5);
  } catch (error) {
    console.error('Error fetching Reddit:', error);
    return [];
  }
}

// ============ STACK OVERFLOW ============
async function transformArrayStackOverflow(originalArray) {
  const transformedArray = [];
  originalArray.forEach((item, index) => {
    transformedArray.push({
      id: index + 1,
      tag: 'StackOverflow',
      title: item.title,
      description: `👁️ ${item.view_count} | 👍 ${item.score} | 💬 ${item.answer_count} answers`,
      path: item.link,
      userName: item.owner?.display_name || 'Unknown'
    });
  });
  return transformedArray;
}

async function getTrendingStackOverflow() {
  try {
    // Get recent questions with high scores in popular CS tags
    const tags = ['javascript', 'python', 'java', 'c++', 'react', 'angular', 'vue.js', 'node.js', 'spring-boot', 'django'];
    const allQuestions = [];
    
    for (const tag of tags) {
      try {
        const response = await axios.get('https://api.stackexchange.com/2.3/questions', {
          params: {
            order: 'desc',
            sort: 'hot',
            site: 'stackoverflow',
            tagged: tag,
            pagesize: 3,
            filter: '!9_bDDxJY5' // Custom filter for basic fields
          }
        });
        const questions = response.data.items;
        allQuestions.push(...questions);
      } catch (error) {
        console.error(`Error fetching Stack Overflow tag ${tag}:`, error.message);
      }
    }
    
    // Sort by score and get top 5
    const sortedQuestions = allQuestions.sort((a, b) => b.score - a.score);
    return sortedQuestions.slice(0, 5);
  } catch (error) {
    console.error('Error fetching Stack Overflow:', error);
    return [];
  }
}

// ============ HASHNODE (Optional - Developer Blog Platform) ============
async function transformArrayHashnode(originalArray) {
  const transformedArray = [];
  originalArray.forEach((item, index) => {
    transformedArray.push({
      id: index + 1,
      tag: 'Hashnode',
      title: item.title,
      description: item.brief || 'Read more on Hashnode',
      path: item.url,
      userName: item.author?.username || 'Unknown'
    });
  });
  return transformedArray;
}

async function getTrendingHashnode() {
  try {
    const query = `
      query {
        storiesFeed(type: NEW, first: 10) {
          edges {
            node {
              id
              title
              brief
              url
              author {
                username
                name
              }
            }
          }
        }
      }
    `;
    
    const response = await axios.post('https://gql.hashnode.com/', {
      query: query
    });
    
    const stories = response.data.data.storiesFeed.edges.map(edge => edge.node);
    return stories.slice(0, 5);
  } catch (error) {
    console.error('Error fetching Hashnode:', error);
    return [];
  }
}

// ============ MAIN ENDPOINT ============
app.get('/getTrends', async (req, res) => {
  try {
    // Fetch from all sources in parallel
    const [
      githubArticles,
      devCommunityArticles,
      hackerNewsArticles,
      redditArticles,
      stackOverflowArticles
      // hashnodeArticles // Uncomment if you want to add Hashnode
    ] = await Promise.all([
      getTrendingRepos(),
      getTrendingArticlesDEVIO(),
      getTrendingHackerNews(),
      getTrendingReddit(),
      getTrendingStackOverflow()
      // getTrendingHashnode()
    ]);

    // Transform all results
    const [
      transformedGithub,
      transformedDEVIO,
      transformedHackerNews,
      transformedReddit,
      transformedStackOverflow
      // transformedHashnode
    ] = await Promise.all([
      transformArrayGithub(githubArticles),
      transformArrayDEVIO(devCommunityArticles),
      transformArrayHackerNews(hackerNewsArticles),
      transformArrayReddit(redditArticles),
      transformArrayStackOverflow(stackOverflowArticles)
      // transformArrayHashnode(hashnodeArticles)
    ]);

    // Merge all trends
    const mergedMessages = [
      ...transformedGithub,
      ...transformedDEVIO,
      ...transformedHackerNews,
      ...transformedReddit,
      ...transformedStackOverflow
      // ...transformedHashnode
    ].map((item, index) => ({ ...item, id: index + 1 }));

    res.json(mergedMessages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
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
