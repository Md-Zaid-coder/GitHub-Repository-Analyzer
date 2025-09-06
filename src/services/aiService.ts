import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubRepository, GitHubLanguages, GitHubContributor, GitHubReadme } from '../types/github';

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('REACT_APP_GEMINI_API_KEY is not set. AI features will be disabled.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface AIInsights {
  repositorySummary: string;
  languageAnalysis: string;
  contributionPatterns: string;
}

class AIService {
  private model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

  /**
   * Generate repository summary based on README and description
   */
  async generateRepositorySummary(
    repository: GitHubRepository,
    readme: GitHubReadme | null
  ): Promise<string> {
    if (!this.model) {
      return 'AI analysis unavailable. Please configure Gemini API key.';
    }

    try {
      const readmeContent = readme?.content?.substring(0, 2000) || 'No README available';
      const description = repository.description || 'No description available';

      const prompt = `
        Analyze this GitHub repository and provide a concise, insightful summary in 2-3 sentences.
        Focus on the project's purpose, main features, and value proposition.

        Repository: ${repository.name}
        Description: ${description}
        README content (first 2000 chars): ${readmeContent}

        Provide a professional summary that would help a developer quickly understand what this project does and why it might be useful.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating repository summary:', error);
      return 'Unable to generate AI summary at this time.';
    }
  }

  /**
   * Generate language composition analysis
   */
  async generateLanguageAnalysis(
    repository: GitHubRepository,
    languages: GitHubLanguages
  ): Promise<string> {
    if (!this.model) {
      return 'AI analysis unavailable. Please configure Gemini API key.';
    }

    try {
      const languageEntries = Object.entries(languages);
      const totalBytes = languageEntries.reduce((sum, [, bytes]) => sum + bytes, 0);
      
      const languageBreakdown = languageEntries
        .map(([lang, bytes]) => `${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`)
        .join(', ');

      const primaryLanguage = repository.language || 'Unknown';

      const prompt = `
        Analyze this GitHub repository's programming language composition and provide insights about the technology stack.
        
        Repository: ${repository.name}
        Primary Language: ${primaryLanguage}
        Language Breakdown: ${languageBreakdown}

        Provide a brief analysis (2-3 sentences) about:
        1. What type of application/project this appears to be based on the languages
        2. Any notable technology stack patterns (e.g., "typical MERN stack", "modern Python data science project", etc.)
        3. Whether the language mix suggests a specific domain or use case

        Be informative but concise.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating language analysis:', error);
      return 'Unable to generate language analysis at this time.';
    }
  }

  /**
   * Generate contribution patterns analysis
   */
  async generateContributionAnalysis(
    repository: GitHubRepository,
    contributors: GitHubContributor[]
  ): Promise<string> {
    if (!this.model) {
      return 'AI analysis unavailable. Please configure Gemini API key.';
    }

    try {
      const topContributors = contributors.slice(0, 5);
      const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
      
      const contributorSummary = topContributors
        .map(c => `${c.login}: ${c.contributions} commits`)
        .join(', ');

      const contributorCount = contributors.length;
      const topContributorPercentage = totalContributions > 0 
        ? ((topContributors[0]?.contributions || 0) / totalContributions * 100).toFixed(1)
        : '0';

      const prompt = `
        Analyze the contribution patterns for this GitHub repository and provide insights about the project's collaboration health.

        Repository: ${repository.name}
        Total Contributors: ${contributorCount}
        Top Contributors: ${contributorSummary}
        Top Contributor's Share: ${topContributorPercentage}% of total commits

        Provide a brief analysis (2-3 sentences) about:
        1. Whether this appears to be maintained by individuals, a small team, or a large community
        2. The health and sustainability of the project based on contribution patterns
        3. Any notable patterns (e.g., single maintainer, active community, corporate-backed, etc.)

        Be insightful but concise.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating contribution analysis:', error);
      return 'Unable to generate contribution analysis at this time.';
    }
  }

  /**
   * Generate all AI insights for a repository
   */
  async generateAllInsights(
    repository: GitHubRepository,
    languages: GitHubLanguages,
    contributors: GitHubContributor[],
    readme: GitHubReadme | null
  ): Promise<AIInsights> {
    const [repositorySummary, languageAnalysis, contributionPatterns] = await Promise.allSettled([
      this.generateRepositorySummary(repository, readme),
      this.generateLanguageAnalysis(repository, languages),
      this.generateContributionAnalysis(repository, contributors)
    ]);

    return {
      repositorySummary: repositorySummary.status === 'fulfilled' 
        ? repositorySummary.value 
        : 'Unable to generate repository summary.',
      languageAnalysis: languageAnalysis.status === 'fulfilled'
        ? languageAnalysis.value
        : 'Unable to generate language analysis.',
      contributionPatterns: contributionPatterns.status === 'fulfilled'
        ? contributionPatterns.value
        : 'Unable to generate contribution analysis.'
    };
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return !!this.model;
  }
}

export const aiService = new AIService();
