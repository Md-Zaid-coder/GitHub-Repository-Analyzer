# 🔍 GitHub Repository Analyzer

A sophisticated Progressive Web App (PWA) that provides deep, AI-driven insights into any public GitHub repository. Built with React, TypeScript, and powered by Google Gemini AI.

## ✨ Features

### 📊 **Comprehensive Analytics**
- **Repository Overview**: Core statistics including stars, forks, issues, and license information
- **Language Composition**: Interactive donut chart showing programming language distribution
- **Commit Activity**: Line chart displaying commit trends over the last 6 months
- **Direct Repository Links**: Quick access to GitHub repository, issues, and pull requests

### 🤖 **AI-Powered Insights**
- **Repository Summary**: AI-generated description of the project's purpose and key features
- **Language Analysis**: Intelligent analysis of the technology stack and project type
- **Contribution Patterns**: Insights into project collaboration health and maintenance patterns

### 📱 **Progressive Web App**
- **Installable**: Can be installed on desktop and mobile devices
- **Offline Support**: Core functionality works without internet connection
- **Fast Loading**: Optimized caching strategies for instant access
- **Responsive Design**: Perfect experience on any device size

## 🚀 Quick Start

### Prerequisites
- Node.js (16.0 or higher)
- npm or yarn
- Google Gemini API key (for AI features)
- GitHub Personal Access Token (optional, but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/github-repo-analyzer.git
   cd github-repo-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   REACT_APP_GITHUB_TOKEN=your_github_token_here
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 API Keys Setup

### GitHub Personal Access Token (Optional)
- Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
- Generate a new token with `public_repo` scope
- Increases rate limit from 60 to 5,000 requests per hour

### Google Gemini API Key (Required for AI features)
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Required for all AI-powered insights

## 🏗️ Build and Deploy

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Chart.js** for data visualizations
- **Axios** for HTTP requests
- **Date-fns** for date handling

### APIs & Services
- **GitHub REST API** for repository data
- **Google Gemini AI** for intelligent insights

### PWA Features
- **Service Worker** for offline support
- **Web App Manifest** for installability
- **Cache API** for performance optimization

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the app in your browser
2. Look for the install icon in the address bar
3. Click "Install" to add to your desktop

### Mobile (iOS/Android)
1. Open the app in Safari/Chrome
2. Tap the share button
3. Select "Add to Home Screen"

## 🧪 Usage Examples

### Analyze Popular Repositories
- `facebook/react` - React JavaScript library
- `microsoft/typescript` - TypeScript language
- `vercel/next.js` - Next.js React framework
- `tailwindlabs/tailwindcss` - Tailwind CSS framework

### Input Formats Supported
- `owner/repository` (e.g., `facebook/react`)
- Full GitHub URLs (e.g., `https://github.com/facebook/react`)

## 🎯 Project Structure

```
src/
├── components/          # React components
│   ├── RepositorySearch.tsx    # Search input component
│   ├── StatisticsCard.tsx      # Repository stats display
│   ├── LanguageChart.tsx       # Language composition chart
│   ├── CommitActivityChart.tsx # Commit activity visualization
│   ├── AIInsights.tsx          # AI-generated insights
│   ├── Dashboard.tsx           # Main dashboard layout
│   └── ErrorDisplay.tsx       # Error handling component
├── services/           # API services
│   ├── githubService.ts        # GitHub API integration
│   └── aiService.ts            # Gemini AI integration
├── types/              # TypeScript type definitions
│   └── github.ts               # GitHub API types
├── App.tsx             # Main application component
├── App.css             # Global styles
└── index.tsx           # Application entry point

public/
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── index.html         # HTML template
```

## 🔧 Configuration

### Service Worker Caching
The app uses different caching strategies:
- **App Shell**: Cache First strategy
- **API Requests**: Network First with Cache Fallback
- **Images**: Cache First strategy
- **Fonts**: Stale While Revalidate

### PWA Manifest
- **Short Name**: GH Analyzer
- **Display**: Standalone
- **Theme Color**: #2563eb
- **Background Color**: #667eea

## 📝 Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder. The build is minified and optimized for the best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: This is a one-way operation. Once you `eject`, you can't go back!**

## 🐛 Troubleshooting

### Common Issues

**AI features not working**
- Ensure `REACT_APP_GEMINI_API_KEY` is set in your `.env` file
- Check that your Gemini API key is valid

**Rate limiting errors**
- Add a GitHub Personal Access Token to increase rate limits
- Wait for the rate limit to reset (usually 1 hour)

**Installation issues**
- Make sure you're using Node.js 16.0 or higher
- Try deleting `node_modules` and running `npm install` again

## 📞 Support

If you have any questions or need help, please create an issue in the GitHub repository.

---

Made with ❤️ for the developer community
