import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubRepository, GitHubLanguages, GitHubContributor, GitHubReadme } from '../types/github';

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('REACT_APP_GEMINI_API_KEY is not set or is placeholder. AI features will be disabled.');
} else {
  console.log('Gemini AI API key configured - AI features enabled');
}

const genAI = (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here' && GEMINI_API_KEY.startsWith('AIza') && GEMINI_API_KEY.length > 30) 
  ? new GoogleGenerativeAI(GEMINI_API_KEY) 
  : null;

export interface AIInsights {
  repositorySummary: string;
  languageAnalysis: string;
  contributionPatterns: string;
}

class AIService {
  private model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

  /**
   * Generate repository summary based on README and description
   */
  async generateRepositorySummary(
    repository: GitHubRepository,
    readme: GitHubReadme | null
  ): Promise<string> {
    if (!this.model) {
      // Demo mode - provide sample insights
      const demoInsights: { [key: string]: string } = {
        'facebook/react': 'React is a JavaScript library for building user interfaces, particularly web applications. It provides a component-based architecture that makes it easy to create reusable UI elements and manage application state efficiently. This library has become one of the most popular frontend frameworks due to its virtual DOM implementation and extensive ecosystem.',
        'microsoft/vscode': 'Visual Studio Code is a lightweight but powerful source code editor that runs on desktop and is available for Windows, macOS, and Linux. It comes with built-in support for JavaScript, TypeScript, and Node.js and has a rich ecosystem of extensions for other languages and runtimes.',
        'vercel/next.js': 'Next.js is a React framework that enables functionality such as server-side rendering and generating static websites. It provides a zero-config approach to React development with automatic code splitting, optimized bundling, and built-in performance optimizations.',
        'default': `${repository.name} is a ${repository.language || 'software'} project ${repository.description ? 'that ' + repository.description.toLowerCase() : ''}. This repository demonstrates modern development practices and has attracted ${repository.stargazers_count} stars from the developer community.`
      };
      
      return demoInsights[repository.full_name] || demoInsights['default'];
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
      const primaryLang = repository.language || 'Unknown';
      const langCount = Object.keys(languages).length;
      
      if (primaryLang.toLowerCase().includes('javascript') || primaryLang.toLowerCase().includes('typescript')) {
        return `This is a modern ${primaryLang} project typical of web development. The codebase shows a ${langCount > 3 ? 'diverse' : 'focused'} technology stack with ${langCount} different languages, indicating a well-structured ${primaryLang.includes('Type') ? 'type-safe' : ''} web application or library.`;
      } else if (primaryLang.toLowerCase().includes('python')) {
        return `This is a Python-based project with ${langCount} programming languages. The technology stack suggests it could be a data science, web development, or general-purpose software project, following modern Python development practices.`;
      } else {
        return `This is a ${primaryLang} project with a ${langCount > 2 ? 'multi-language' : 'focused'} codebase. The language composition suggests a ${primaryLang.toLowerCase().includes('java') || primaryLang.toLowerCase().includes('c++') || primaryLang.toLowerCase().includes('c#') ? 'enterprise-grade' : 'modern'} application built with industry best practices.`;
      }
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
      const contributorCount = contributors.length;
      const topContributor = contributors[0];
      const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
      const topContributorPercentage = topContributor ? ((topContributor.contributions / totalContributions) * 100).toFixed(0) : 0;
      
      if (contributorCount > 100) {
        return `This repository is maintained by a large, active community with ${contributorCount} contributors. The top contributor (${topContributor?.login}) accounts for ${topContributorPercentage}% of commits, indicating healthy distributed collaboration typical of major open-source projects.`;
      } else if (contributorCount > 20) {
        return `This project shows healthy collaboration with ${contributorCount} contributors. The contribution pattern suggests an active community project with regular participation from multiple developers, indicating good project health and sustainability.`;
      } else if (contributorCount > 5) {
        return `This repository is maintained by a small but dedicated team of ${contributorCount} contributors. The contribution pattern suggests either a focused team project or an emerging open-source project with core maintainers.`;
      } else {
        return `This appears to be maintained by a small group of ${contributorCount} developers, with the primary contributor (${topContributor?.login}) responsible for ${topContributorPercentage}% of the work. This suggests either a personal project or early-stage development with limited contributors.`;
      }
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
