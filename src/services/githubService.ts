import axios, { AxiosError } from 'axios';
import {
  GitHubRepository,
  GitHubLanguages,
  GitHubCommitActivity,
  GitHubContributor,
  GitHubReadme,
  APIError
} from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

// Create axios instance with default config
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Repo-Analyzer'
  }
});

// Add GitHub token if available (optional for public repos but increases rate limits)
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
if (GITHUB_TOKEN) {
  githubApi.defaults.headers.common['Authorization'] = `token ${GITHUB_TOKEN}`;
}

class GitHubService {
  /**
   * Fetch repository information
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await githubApi.get<GitHubRepository>(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Fetch repository languages
   */
  async getRepositoryLanguages(owner: string, repo: string): Promise<GitHubLanguages> {
    try {
      const response = await githubApi.get<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Fetch commit activity (last 52 weeks)
   */
  async getCommitActivity(owner: string, repo: string): Promise<GitHubCommitActivity[]> {
    try {
      const response = await githubApi.get<GitHubCommitActivity[]>(`/repos/${owner}/${repo}/stats/commit_activity`);
      
      // GitHub may return 202 if stats are being computed
      if (response.status === 202) {
        // Wait a bit and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getCommitActivity(owner, repo);
      }
      
      return response.data || [];
    } catch (error) {
      // If stats are not available, return empty array
      if ((error as AxiosError).response?.status === 404) {
        return [];
      }
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Fetch repository contributors
   */
  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    try {
      const response = await githubApi.get<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Fetch repository README
   */
  async getReadme(owner: string, repo: string): Promise<GitHubReadme | null> {
    try {
      const response = await githubApi.get<GitHubReadme>(`/repos/${owner}/${repo}/readme`);
      
      // Decode base64 content
      if (response.data.encoding === 'base64') {
        response.data.content = atob(response.data.content);
      }
      
      return response.data;
    } catch (error) {
      if ((error as AxiosError).response?.status === 404) {
        return null; // No README found
      }
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get complete repository analysis
   */
  async getRepositoryAnalysis(owner: string, repo: string) {
    try {
      const [repository, languages, commitActivity, contributors, readme] = await Promise.allSettled([
        this.getRepository(owner, repo),
        this.getRepositoryLanguages(owner, repo),
        this.getCommitActivity(owner, repo),
        this.getContributors(owner, repo),
        this.getReadme(owner, repo)
      ]);

      // Extract successful results
      const data = {
        repository: repository.status === 'fulfilled' ? repository.value : null,
        languages: languages.status === 'fulfilled' ? languages.value : {},
        commitActivity: commitActivity.status === 'fulfilled' ? commitActivity.value : [],
        contributors: contributors.status === 'fulfilled' ? contributors.value : [],
        readme: readme.status === 'fulfilled' ? readme.value : null
      };

      // Throw error if repository data failed (this is essential)
      if (!data.repository) {
        throw new Error('Failed to fetch repository data');
      }

      return data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Search repositories (bonus feature)
   */
  async searchRepositories(query: string, limit: number = 10) {
    try {
      const response = await githubApi.get(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`);
      return response.data.items;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): APIError {
    if (error.response) {
      const { status, data } = error.response;
      return {
        message: (data as any)?.message || 'GitHub API error',
        status,
        documentation_url: (data as any)?.documentation_url
      };
    } else if (error.request) {
      return {
        message: 'Network error: Unable to reach GitHub API',
        status: 0
      };
    } else {
      return {
        message: error.message || 'Unknown error occurred',
        status: 0
      };
    }
  }

  /**
   * Check API rate limit status
   */
  async getRateLimit() {
    try {
      const response = await githubApi.get('/rate_limit');
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

export const githubService = new GitHubService();
