export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubCommitActivity {
  total: number;
  week: number;
  days: number[];
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface GitHubReadme {
  name: string;
  path: string;
  content: string;
  encoding: string;
  size: number;
  download_url: string;
}

export interface RepositoryAnalysis {
  repository: GitHubRepository;
  languages: GitHubLanguages;
  commitActivity: GitHubCommitActivity[];
  contributors: GitHubContributor[];
  readme: GitHubReadme | null;
  aiInsights?: {
    repositorySummary: string;
    languageAnalysis: string;
    contributionPatterns: string;
  };
}

export interface APIError {
  message: string;
  status: number;
  documentation_url?: string;
}
