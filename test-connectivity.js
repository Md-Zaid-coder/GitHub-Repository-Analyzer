const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testConnectivity() {
  console.log('🧪 Testing GitHub Repository Analyzer Connectivity\n');

  // Test 1: Basic network connectivity
  console.log('1️⃣ Testing basic network connectivity...');
  try {
    const response = await axios.get('https://httpbin.org/ip', {
      timeout: 10000,
      headers: { 'User-Agent': 'GitHub-Repo-Analyzer-Test' }
    });
    console.log('✅ Basic network connectivity: OK');
  } catch (error) {
    console.log('❌ Basic network connectivity: FAILED');
    console.log('   Error:', error.message);
    return;
  }

  // Test 2: GitHub API connectivity
  console.log('\n2️⃣ Testing GitHub API connectivity...');
  try {
    const response = await axios.get('https://api.github.com/zen', {
      timeout: 10000,
      headers: { 
        'User-Agent': 'GitHub-Repo-Analyzer-Test',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    console.log('✅ GitHub API connectivity: OK');
    console.log('   Response:', response.data);
  } catch (error) {
    console.log('❌ GitHub API connectivity: FAILED');
    console.log('   Error:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Headers:', error.response.headers);
    }
  }

  // Test 3: GitHub token validation
  console.log('\n3️⃣ Testing GitHub token...');
  const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
  if (!githubToken || githubToken === 'your_github_token_here') {
    console.log('⚠️  GitHub token: Not configured (will use rate-limited requests)');
  } else {
    try {
      const response = await axios.get('https://api.github.com/user', {
        timeout: 10000,
        headers: { 
          'Authorization': `token ${githubToken}`,
          'User-Agent': 'GitHub-Repo-Analyzer-Test'
        }
      });
      console.log('✅ GitHub token: Valid');
      console.log('   User:', response.data.login);
    } catch (error) {
      console.log('❌ GitHub token: Invalid or expired');
      console.log('   Error:', error.response?.data?.message || error.message);
    }
  }

  // Test 4: Test sample repository access
  console.log('\n4️⃣ Testing repository access...');
  try {
    const headers = {
      'User-Agent': 'GitHub-Repo-Analyzer-Test',
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (githubToken && githubToken !== 'your_github_token_here') {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const response = await axios.get('https://api.github.com/repos/facebook/react', {
      timeout: 15000,
      headers
    });
    
    console.log('✅ Repository access: OK');
    console.log('   Repository:', response.data.full_name);
    console.log('   Stars:', response.data.stargazers_count);
    console.log('   Language:', response.data.language);
  } catch (error) {
    console.log('❌ Repository access: FAILED');
    console.log('   Error:', error.response?.data?.message || error.message);
    if (error.response?.status === 403) {
      console.log('   💡 This might be a rate limit issue. Consider adding a GitHub token.');
    }
  }

  // Test 5: Gemini AI connectivity
  console.log('\n5️⃣ Testing Gemini AI...');
  const geminiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
    console.log('⚠️  Gemini API key: Not configured (AI features will be disabled)');
  } else {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent('Say "Hello, GitHub Analyzer!" if you can read this.');
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini AI: Connected');
      console.log('   Response:', text.trim());
    } catch (error) {
      console.log('❌ Gemini AI: Connection failed');
      console.log('   Error:', error.message);
    }
  }

  // Test 6: Rate limit check
  console.log('\n6️⃣ Checking GitHub rate limits...');
  try {
    const headers = {
      'User-Agent': 'GitHub-Repo-Analyzer-Test'
    };
    
    if (githubToken && githubToken !== 'your_github_token_here') {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const response = await axios.get('https://api.github.com/rate_limit', {
      timeout: 10000,
      headers
    });
    
    const core = response.data.rate;
    console.log('✅ Rate limits:');
    console.log(`   Limit: ${core.limit} requests/hour`);
    console.log(`   Used: ${core.used} requests`);
    console.log(`   Remaining: ${core.remaining} requests`);
    console.log(`   Resets at: ${new Date(core.reset * 1000).toLocaleString()}`);
  } catch (error) {
    console.log('❌ Rate limit check: FAILED');
    console.log('   Error:', error.message);
  }

  console.log('\n🏁 Connectivity test completed!');
}

testConnectivity().catch(console.error);
