import {
  GitHubRepository,
  GitHubLanguages,
  GitHubCommitActivity,
  GitHubContributor,
  GitHubReadme
} from '../types/github';

class GitHubService {
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    console.log(`📦 Demo: Loading ${owner}/${repo}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: Math.floor(Math.random() * 1000000),
      name: repo,
      full_name: `${owner}/${repo}`,
      owner: {
        login: owner,
        avatar_url: `https://github.com/${owner}.png`,
        html_url: `https://github.com/${owner}`
      },
      html_url: `https://github.com/${owner}/${repo}`,
      description: `${repo} - Demo repository showcasing the GitHub Repository Analyzer`,
      stargazers_count: Math.floor(Math.random() * 50000) + 1000,
      watchers_count: Math.floor(Math.random() * 5000) + 100,
      language: owner === 'facebook' ? 'JavaScript' : owner === 'microsoft' ? 'TypeScript' : 'JavaScript',
      forks_count: Math.floor(Math.random() * 10000) + 500,
      open_issues_count: Math.floor(Math.random() * 100) + 10,
      license: {
        name: 'MIT License',
        spdx_id: 'MIT'
      },
      created_at: '2020-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      size: Math.floor(Math.random() * 100000) + 10000,
      default_branch: 'main'
    };
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<GitHubLanguages> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      JavaScript: 800000,
      TypeScript: 200000,
      CSS: 50000,
      HTML: 25000
    };
  }

  async getCommitActivity(owner: string, repo: string): Promise<GitHubCommitActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const activity: GitHubCommitActivity[] = [];
    const now = Math.floor(Date.now() / 1000);
    const weekInSeconds = 7 * 24 * 60 * 60;
    
    for (let i = 51; i >= 0; i--) {
      const weekStart = now - (i * weekInSeconds);
      const totalCommits = Math.floor(Math.random() * 50) + 5;
      const days = [];
      for (let day = 0; day < 7; day++) {
        days.push(Math.floor(Math.random() * (totalCommits / 2)));
      }
      
      activity.push({
        total: totalCommits,
        week: weekStart,
        days: days
      });
    }
    
    return activity;
  }

  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      {
        login: owner,
        id: Math.floor(Math.random() * 1000000),
        avatar_url: `https://github.com/${owner}.png`,
        html_url: `https://github.com/${owner}`,
        contributions: Math.floor(Math.random() * 500) + 100,
        type: 'User'
      },
      {
        login: 'contributor1',
        id: Math.floor(Math.random() * 1000000),
        avatar_url: 'https://github.com/contributor1.png',
        html_url: 'https://github.com/contributor1',
        contributions: Math.floor(Math.random() * 200) + 50,
        type: 'User'
      }
    ];
  }

  async getReadme(owner: string, repo: string): Promise<GitHubReadme> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      name: 'README.md',
      path: 'README.md',
      content: `# ${repo}\n\nDemo repository for ${owner}/${repo}. This showcases the GitHub Repository Analyzer with AI-powered insights.\n\n## Features\n- Repository statistics\n- Language analysis\n- Commit activity tracking\n- AI-generated insights`,
      encoding: 'utf-8',
      size: 1024,
      download_url: `https://github.com/${owner}/${repo}/README.md`
    };
  }

  async getRepositoryAnalysis(owner: string, repo: string) {
    console.log(`🎭 Demo mode: Complete analysis for ${owner}/${repo}`);
    
    const [repository, languages, commitActivity, contributors, readme] = await Promise.all([
      this.getRepository(owner, repo),
      this.getRepositoryLanguages(owner, repo),
      this.getCommitActivity(owner, repo),
      this.getContributors(owner, repo),
      this.getReadme(owner, repo)
    ]);

    return {
      repository,
      languages,
      commitActivity,
      contributors,
      readme
    };
  }
}

export const githubService = new GitHubService();
