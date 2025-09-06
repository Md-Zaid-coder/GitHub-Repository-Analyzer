import React from 'react';
import { APIError } from '../types/github';


interface ErrorDisplayProps {
  error: APIError;
  onRetry?: () => void;
  onBack?: () => void;
}


const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onBack }) => {
  const getErrorIcon = (status: number) => {
    if (status === 404) return '🔍';
    if (status === 403) return '🚫';
    if (status === 429) return '⏰';
    if (status === 0) return '🌐';
    return '⚠️';
  };


  const getErrorTitle = (status: number) => {
    if (status === 404) return 'Repository Not Found';
    if (status === 403) return 'Access Forbidden';
    if (status === 429) return 'Rate Limited';
    if (status === 0) return 'Network Error';
    return 'Something Went Wrong';
  };


  const getErrorDescription = (status: number) => {
    if (status === 404) {
      return 'The repository you\'re looking for doesn\'t exist or may be private. Please check the owner and repository name.';
    }
    if (status === 403) {
      return 'Access to this repository is forbidden. This might be a private repository or you\'ve exceeded API limits.';
    }
    if (status === 429) {
      return 'You\'ve hit GitHub\'s API rate limit. Please wait a moment before trying again.';
    }
    if (status === 0) {
      return 'Unable to connect to GitHub. Please check your internet connection and try again.';
    }
    return 'An unexpected error occurred while fetching repository data.';
  };


  const getSuggestions = (status: number) => {
    const suggestions = [];


    if (status === 404) {
      suggestions.push('Double-check the repository owner and name');
      suggestions.push('Make sure the repository is public');
      suggestions.push('Try searching for the repository on GitHub first');
    } else if (status === 403) {
      suggestions.push('Wait a few minutes and try again');
      suggestions.push('Consider adding a GitHub token for higher limits');
    } else if (status === 429) {
      suggestions.push('Wait for the rate limit to reset');
      suggestions.push('Consider using a GitHub personal access token');
    } else if (status === 0) {
      suggestions.push('Check your internet connection');
      suggestions.push('Verify that GitHub is accessible');
      suggestions.push('Try refreshing the page');
    } else {
      suggestions.push('Try again in a few moments');
      suggestions.push('Check if the repository exists');
    }


    return suggestions;
  };


  return (
    <div className="error-display">
      <div className="error-container">
        <div className="error-icon">
          {getErrorIcon(error.status)}
        </div>


        <h2 className="error-title">
          {getErrorTitle(error.status)}
        </h2>


        <p className="error-description">
          {getErrorDescription(error.status)}
        </p>


        <div className="error-message">
          <strong>Error Details:</strong> {error.message}
        </div>


        <div className="error-suggestions">
          <h3>Suggestions:</h3>
          <ul>
            {getSuggestions(error.status).map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>


        <div className="error-actions">
          {onRetry && (
            <button onClick={onRetry} className="retry-button">
              <span>🔄</span>
              Try Again
            </button>
          )}


          <button 
            onClick={onBack || (() => window.location.reload())} 
            className="back-button"
          >
            <span>🏠</span>
            Back to Search
          </button>
        </div>


        {error.documentation_url && (
          <div className="error-docs">
            <a 
              href={error.documentation_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="docs-link"
            >
              <span>📚</span>
              View Documentation
            </a>
          </div>
        )}
      </div>


    </div>
  );
};


export default ErrorDisplay;
