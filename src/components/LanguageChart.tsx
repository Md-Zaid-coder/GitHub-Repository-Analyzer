import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { GitHubLanguages } from '../types/github';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguageChartProps {
  languages: GitHubLanguages;
}

const LanguageChart: React.FC<LanguageChartProps> = ({ languages }) => {
  // Language color mapping for common languages
  const languageColors: { [key: string]: string } = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'Shell': '#89e051',
    'Vue': '#2c3e50',
    'React': '#61dafb',
    'Dart': '#00B4AB',
    'Scala': '#c22d40'
  };

  // Generate colors for languages not in the mapping
  const generateColor = (index: number) => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
      '#4BC0C0', '#FF6384'
    ];
    return colors[index % colors.length];
  };

  // Process language data
  const processLanguageData = () => {
    const languageEntries = Object.entries(languages);
    
    if (languageEntries.length === 0) {
      return {
        labels: ['No language data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 0
        }]
      };
    }

    // Sort by bytes (descending) and take top 10
    const sortedLanguages = languageEntries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const totalBytes = languageEntries.reduce((sum, [, bytes]) => sum + bytes, 0);
    
    const labels = sortedLanguages.map(([lang]) => lang);
    const data = sortedLanguages.map(([, bytes]) => bytes);
    const percentages = sortedLanguages.map(([, bytes]) => 
      ((bytes / totalBytes) * 100).toFixed(1)
    );
    
    const backgroundColor = sortedLanguages.map(([lang], index) => 
      languageColors[lang] || generateColor(index)
    );

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }],
      percentages
    };
  };

  const chartData = processLanguageData();

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets[0]) {
              return data.labels.map((label, index) => {
                const percentage = chartData.percentages?.[index] || '0';
                const bgColors = data.datasets[0].backgroundColor as string[];
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: bgColors?.[index] || '#e5e7eb',
                  strokeStyle: bgColors?.[index] || '#e5e7eb',
                  lineWidth: 0,
                  pointStyle: 'circle'
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const percentage = chartData.percentages?.[context.dataIndex] || '0';
            const bytes = context.parsed;
            const formatBytes = (bytes: number) => {
              if (bytes === 0) return '0 Bytes';
              const k = 1024;
              const sizes = ['Bytes', 'KB', 'MB', 'GB'];
              const i = Math.floor(Math.log(bytes) / Math.log(k));
              return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            };
            return `${label}: ${percentage}% (${formatBytes(bytes)})`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const hasData = Object.keys(languages).length > 0;

  return (
    <div className="language-chart">
      <div className="chart-header">
        <h3 className="chart-title">
          <span className="chart-icon">🎯</span>
          Language Composition
        </h3>
        {hasData && (
          <p className="chart-subtitle">
            Distribution of programming languages in the repository
          </p>
        )}
      </div>

      <div className="chart-container">
        {hasData ? (
          <div className="chart-wrapper">
            <Doughnut data={chartData} options={options} />
            <div className="chart-center">
              <div className="total-languages">
                {Object.keys(languages).length}
              </div>
              <div className="total-label">
                {Object.keys(languages).length === 1 ? 'Language' : 'Languages'}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <div className="no-data-text">
              No language data available for this repository
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageChart;
