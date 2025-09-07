// Quick test to verify GitHub API is working
async function testGitHub() {
  try {
    console.log('🧪 Testing GitHub API connectivity...');
    
    const response = await fetch('https://api.github.com/repos/facebook/react', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Repo-Analyzer'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! GitHub API is working');
      console.log(`Repository: ${data.full_name}`);
      console.log(`Stars: ${data.stargazers_count}`);
      console.log(`Language: ${data.language}`);
      console.log('🎉 Your GitHub Repository Analyzer should work perfectly!');
    } else {
      console.log('❌ GitHub API test failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testGitHub();
