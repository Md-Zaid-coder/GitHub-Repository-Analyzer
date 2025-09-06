# 🔍 GitHub Repository Analyzer

**Track: Progressive Web App (PWA)**  
**Technology: React + TypeScript**

A sophisticated Progressive Web App that provides deep, AI-driven insights into any public GitHub repository. Built with React 19, TypeScript, and powered by Google Gemini AI with comprehensive PWA features.

![GitHub Repository Analyzer](https://via.placeholder.com/800x400/667eea/ffffff?text=GitHub+Repository+Analyzer+PWA)

## ✨ Features

### 🏆 **PWA Requirements Implemented**
- ✅ **Installable PWA**: Complete manifest.json with offline support
- ✅ **Intelligent Caching**: IndexedDB + Cache API for instant data serving
- ✅ **Repository Comparison**: Side-by-side analysis of multiple repositories
- ✅ **GitHub OAuth**: Authentication for private repos and higher rate limits
- ✅ **Light/Dark Mode**: System preference-aware theme switching
- ✅ **Loading Skeletons**: Smooth loading experience with skeleton screens
- ✅ **Micro-interactions**: Polished animations and transitions

### 📊 **Core Analytics**
- **Repository Overview**: Stars, forks, issues, contributors, and license information
- **Language Composition**: Interactive donut chart with percentage breakdown
- **Commit Activity**: Line chart showing 26-week commit trends with statistics
- **Direct Repository Access**: Quick links to GitHub repo, issues, and pull requests

### 🤖 **AI-Powered Insights**
- **Repository Summary**: Intelligent project description and key features analysis
- **Language Analysis**: Technology stack evaluation and project type classification
- **Contribution Patterns**: Team collaboration health and maintenance insights

### 📱 **Progressive Web App Features**
- **Offline-First**: Works without internet using cached data
- **Install Prompt**: Add to home screen on mobile and desktop
- **Background Sync**: Fresh data fetching while serving cached content
- **Push Notifications**: Repository update notifications (future feature)

### 🎨 **Enhanced UI/UX**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Theme Switching**: Automatic dark/light mode based on system preference
- **Smooth Animations**: Fade-in, slide-in, and bounce animations
- **Loading States**: Professional skeleton screens instead of spinners

## 🚀 Live Demo

### 🌐 **[Visit the Live App](https://github-repository-analyzer.vercel.app)**

### 📱 **Installation**
- **Desktop**: Click the install icon in your browser address bar
- **Mobile**: Use "Add to Home Screen" from your browser menu

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 19** with TypeScript for type safety
- **Create React App** with PWA template
- **CSS3** with CSS Variables for theming

### **Data Visualization**
- **Chart.js 4.5** with react-chartjs-2
- **Custom chart configurations** for optimal UX

### **API Integration**
- **Axios** for HTTP requests with interceptors
- **GitHub REST API** for repository data
- **Google Gemini AI** for intelligent insights

### **PWA Technologies**
- **Service Worker** for offline functionality
- **IndexedDB** for client-side data storage
- **Cache API** for static asset caching
- **Web App Manifest** for installability

### **State Management**
- **React Context** for theme management
- **Local Storage** for user preferences
- **IndexedDB** for repository data persistence

### **Development Tools**
- **TypeScript 4.9** for type checking
- **ESLint** for code quality
- **Date-fns** for date manipulation

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 16.0 or higher
- npm or yarn package manager
- Google Gemini API key
- GitHub Personal Access Token (optional but recommended)

### **1. Clone the Repository**
```bash
git clone https://github.com/Md-Zaid-coder/GitHub-Repository-Analyzer.git
cd GitHub-Repository-Analyzer
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# GitHub Personal Access Token (Optional - increases rate limit from 60 to 5000/hour)
REACT_APP_GITHUB_TOKEN=your_github_token_here

# Google Gemini API Key (Required for AI features)
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### **4. Start Development Server**
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000)

### **5. Build for Production**
```bash
npm run build
```

## 🔑 API Keys Setup

### **GitHub Personal Access Token**
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select `public_repo` scope
4. Copy the token to your `.env` file

**Benefits:**
- Increases rate limit from 60 to 5,000 requests/hour
- Access to private repositories (if token has permissions)
- Better API reliability

### **Google Gemini API Key**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new project (if needed)
3. Generate an API key
4. Copy the key to your `.env` file

**Required for:**
- AI-powered repository insights
- Intelligent language analysis
- Contribution pattern analysis

## 🏗️ Project Architecture

```
src/
├── components/           # React Components
│   ├── AIInsights.tsx           # AI-generated insights display
│   ├── CommitActivityChart.tsx  # Weekly commit visualization
│   ├── Dashboard.tsx            # Main analysis dashboard
│   ├── ErrorDisplay.tsx        # Error handling component
│   ├── LanguageChart.tsx       # Language composition chart
│   ├── LoadingSkeletons.tsx    # Skeleton loading screens
│   ├── RepositoryComparison.tsx # Side-by-side repo comparison
│   ├── RepositorySearch.tsx    # Search interface
│   └── StatisticsCard.tsx      # Repository statistics
├── contexts/             # React Contexts
│   └── ThemeContext.tsx        # Theme management
├── services/             # API Services
│   ├── aiService.ts            # Google Gemini AI integration
│   ├── cacheService.ts         # IndexedDB caching system
│   └── githubService.ts        # GitHub API integration
├── types/                # TypeScript Definitions
│   └── github.ts               # GitHub API types
├── App.tsx               # Main application
├── App.css               # Global styles with theme support
└── index.tsx             # Application entry point

public/
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker
└── index.html            # HTML template
```

## 🔧 Technical Choices & Architecture Decisions

### **Why React 19 + TypeScript?**
- **Type Safety**: Prevents runtime errors and improves development experience
- **Modern React**: Latest features like concurrent rendering
- **Component Reusability**: Modular architecture for maintainability

### **IndexedDB for Caching**
- **Persistent Storage**: Survives browser restarts
- **Large Capacity**: Can store extensive repository data
- **Structured Data**: Perfect for complex repository analysis
- **Background Sync**: Fetch fresh data while serving cached content

### **Chart.js for Visualization**
- **Performance**: Hardware-accelerated canvas rendering
- **Customization**: Full control over chart appearance
- **Responsive**: Automatically adapts to screen sizes
- **Accessibility**: Built-in screen reader support

### **CSS Variables for Theming**
- **Dynamic Theming**: Instant theme switching without re-renders
- **Performance**: No JavaScript theme calculations
- **Maintainability**: Single source of truth for colors
- **System Integration**: Respects user's OS theme preference

## 🎯 Usage Examples

### **Analyze Popular Repositories**
- `facebook/react` - React JavaScript library
- `microsoft/typescript` - TypeScript programming language
- `vercel/next.js` - Next.js React framework
- `tailwindlabs/tailwindcss` - Utility-first CSS framework

### **Supported Input Formats**
- **Owner/Repository**: `facebook/react`
- **Full GitHub URL**: `https://github.com/facebook/react`
- **GitHub URL with path**: `https://github.com/facebook/react/tree/main`

### **Repository Comparison**
1. Analyze first repository
2. Analyze second repository  
3. Click "Compare Repositories" button
4. View side-by-side metrics, languages, and activity

## 🌟 PWA Features Deep Dive

### **Offline Functionality**
- **Cache-First Strategy**: Instant loading from IndexedDB
- **Network-First for Fresh Data**: Updates cache in background
- **Graceful Degradation**: Informative offline messages

### **Installation Experience**
- **Desktop**: Install prompt in browser address bar
- **Mobile**: "Add to Home Screen" with custom splash screen
- **Standalone Mode**: Full-screen app experience

### **Performance Optimizations**
- **Code Splitting**: Lazy loading of non-critical components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Optimized dependency tree
- **Service Worker Caching**: Strategic asset caching

## 📱 Screenshots

### Desktop Experience
![Desktop Dashboard](https://via.placeholder.com/800x600/667eea/ffffff?text=Desktop+Dashboard)

### Mobile Experience
![Mobile Interface](https://via.placeholder.com/400x800/667eea/ffffff?text=Mobile+Interface)

### Repository Comparison
![Repository Comparison](https://via.placeholder.com/800x600/667eea/ffffff?text=Repository+Comparison)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x600/1e293b/f1f5f9?text=Dark+Mode)

## 🧪 Testing

### **Run Tests**
```bash
npm test
```

### **Build Verification**
```bash
npm run build
npx serve -s build
```

### **PWA Audit**
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Run "Progressive Web App" audit
4. Should score 90+ for PWA compliance

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Netlify**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

### **Environment Variables for Production**
- `REACT_APP_GITHUB_TOKEN`: Your GitHub token
- `REACT_APP_GEMINI_API_KEY`: Your Gemini API key

## 🔒 Security & Privacy

- **API Keys**: Securely stored in environment variables
- **No Data Collection**: No user data stored on servers
- **Local Storage Only**: All caching happens client-side
- **HTTPS Required**: Secure communication with APIs

## 🐛 Troubleshooting

### **Common Issues**

**AI Features Not Working**
- Verify `REACT_APP_GEMINI_API_KEY` in `.env`
- Check API key validity in Google AI Studio
- Ensure API key has proper permissions

**Rate Limiting Errors**
- Add GitHub Personal Access Token
- Check token permissions and expiry
- Monitor rate limit headers

**Installation Issues**
- Use Node.js 16.0 or higher
- Clear `node_modules` and reinstall
- Check for conflicting global packages

**PWA Not Installing**
- Serve app over HTTPS
- Verify manifest.json is valid
- Check service worker registration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **GitHub API** for comprehensive repository data
- **Google Gemini AI** for intelligent insights
- **Chart.js** for beautiful data visualization
- **React Team** for the amazing framework
- **Create React App** for the solid foundation

---

**Made with ❤️ for developers by developers**

**🌐 [Live Demo](https://github-repository-analyzer.vercel.app) | 📱 Install as PWA | ⭐ Star on GitHub**
