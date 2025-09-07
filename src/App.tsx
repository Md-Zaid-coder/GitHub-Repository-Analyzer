import React, { useState, useEffect } from 'react';
import { githubService } from './services/githubService';
import { aiService, AIInsights } from './services/aiService';
import { RepositoryAnalysis, APIError } from './types/github';
import RepositorySearch from './components/RepositorySearch';
import Dashboard from './components/Dashboard';
import ErrorDisplay from './components/ErrorDisplay';
import './App.css';

type AppState = 'search' | 'loading' | 'success' | 'error';

function App() {
  const [appState, setAppState] = useState<AppState>('search');
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleSearch = async (owner: string, repo: string) => {
    setAppState('loading');
    setError(null);
    setAnalysis(null);
    setAiInsights(null);
    
    console.log(`🚀 Demo mode: Starting analysis for ${owner}/${repo}`);

    // Fetch repository analysis (demo data)
    const repositoryAnalysis = await githubService.getRepositoryAnalysis(owner, repo);
    
    setAnalysis(repositoryAnalysis as RepositoryAnalysis);
    setAppState('success');

    // Generate AI insights
    setAiLoading(true);
    try {
      const insights = await aiService.generateAllInsights(
        repositoryAnalysis.repository,
        repositoryAnalysis.languages,
        repositoryAnalysis.contributors,
        repositoryAnalysis.readme
      );
      setAiInsights(insights);
    } catch (aiError) {
      console.log('AI insights generated in demo mode');
    } finally {
      setAiLoading(false);
    }
  };

  const handleRetry = () => {
    if (analysis?.repository) {
      const [owner, repo] = analysis.repository.full_name.split('/');
      handleSearch(owner, repo);
    } else {
      setAppState('search');
    }
  };

  const handleBack = () => {
    setAppState('search');
    setAnalysis(null);
    setAiInsights(null);
    setError(null);
  };

  // Render based on current state
  switch (appState) {
    case 'search':
      return (
        <div className="app">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-toggle-icon">
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </button>
          <div className="app-background">
            <RepositorySearch onSearch={handleSearch} />
          </div>
        </div>
      );

    case 'loading':
      return (
        <div className="app">
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <h2 className="loading-title">Analyzing Repository</h2>
              <p className="loading-subtitle">
                Fetching repository data and generating insights...
              </p>
              <div className="loading-steps">
                <div className="loading-step completed">
                  <span className="step-icon">✓</span>
                  <span className="step-text">Connecting to GitHub API</span>
                </div>
                <div className="loading-step active">
                  <span className="step-icon">⟳</span>
                  <span className="step-text">Fetching repository data</span>
                </div>
                <div className="loading-step">
                  <span className="step-icon">○</span>
                  <span className="step-text">Generating AI insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'success':
      return analysis ? (
        <div className="app">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-toggle-icon">
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </button>
          <Dashboard 
            analysis={analysis} 
            aiInsights={aiInsights || undefined}
            aiLoading={aiLoading}
            onBack={handleBack}
          />
        </div>
      ) : null;

    case 'error':
      return error ? (
        <ErrorDisplay 
          error={error} 
          onRetry={handleRetry} 
          onBack={handleBack}
        />
      ) : null;

    default:
      return null;
  }
}

export default App;
