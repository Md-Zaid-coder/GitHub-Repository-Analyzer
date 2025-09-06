import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { format, fromUnixTime, startOfWeek } from 'date-fns';
import { GitHubCommitActivity } from '../types/github';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


interface CommitActivityChartProps {
  commitActivity: GitHubCommitActivity[];
}


const CommitActivityChart: React.FC<CommitActivityChartProps> = ({ commitActivity }) => {
  // Process commit activity data
  const processCommitData = () => {
    if (!commitActivity || commitActivity.length === 0) {
      return {
        labels: ['No data'],
        datasets: [{
          label: 'Commits per week',
          data: [0],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    }


    // Sort by week (ascending)
    const sortedActivity = [...commitActivity].sort((a, b) => a.week - b.week);


    // Take the last 26 weeks (6 months) for better visualization
    const recentActivity = sortedActivity.slice(-26);


    const labels = recentActivity.map(activity => {
      const date = fromUnixTime(activity.week);
      const weekStart = startOfWeek(date);
      return format(weekStart, 'MMM d');
    });


    const data = recentActivity.map(activity => activity.total);


    return {
      labels,
      datasets: [{
        label: 'Commits per week',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  };


  const chartData = processCommitData();


  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2563eb',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (context) => {
            if (commitActivity.length === 0) return '';
            const index = context[0].dataIndex;
            const activity = commitActivity.slice(-26)[index];
            if (!activity) return context[0].label;


            const date = fromUnixTime(activity.week);
            const weekStart = startOfWeek(date);
            return `Week of ${format(weekStart, 'MMMM d, yyyy')}`;
          },
          label: (context) => {
            return `${context.parsed.y} commits`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : '';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };


  // Calculate statistics
  const calculateStats = () => {
    if (!commitActivity || commitActivity.length === 0) {
      return {
        totalCommits: 0,
        averagePerWeek: 0,
        mostActiveWeek: 0,
        activeWeeksCount: 0
      };
    }


    const totalCommits = commitActivity.reduce((sum, activity) => sum + activity.total, 0);
    const averagePerWeek = Math.round(totalCommits / commitActivity.length);
    const mostActiveWeek = Math.max(...commitActivity.map(activity => activity.total));
    const activeWeeksCount = commitActivity.filter(activity => activity.total > 0).length;


    return {
      totalCommits,
      averagePerWeek,
      mostActiveWeek,
      activeWeeksCount
    };
  };


  const stats = calculateStats();
  const hasData = commitActivity && commitActivity.length > 0 && stats.totalCommits > 0;


  return (
    <div className="commit-activity-chart">
      <div className="commit-chart-header">
        <h3 className="commit-chart-title">
          <span className="chart-icon">📈</span>
          Commit Activity
        </h3>
        {hasData && (
          <p className="chart-subtitle">
            Weekly commit activity over the last 6 months
          </p>
        )}
      </div>


      {hasData && (
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">{stats.totalCommits.toLocaleString()}</div>
            <div className="stat-label">Total Commits (52 weeks)</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.averagePerWeek}</div>
            <div className="stat-label">Average per Week</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.mostActiveWeek}</div>
            <div className="stat-label">Most Active Week</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.activeWeeksCount}</div>
            <div className="stat-label">Active Weeks</div>
          </div>
        </div>
      )}


      <div className="commit-chart-container">
        {hasData ? (
          <div className="chart-wrapper">
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <div className="no-data-text">
              No commit activity data available for this repository
            </div>
            <div className="no-data-subtext">
              This might be a new repository or statistics are still being computed
            </div>
          </div>
        )}
      </div>


    </div>
  );
};


export default CommitActivityChart;
