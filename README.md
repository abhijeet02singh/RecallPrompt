# RecallPrompt

**Understand. Remove support. Explain.**

A minimalist knowledge-practice tool to test and refine your understanding through structured practice modes.

## 🎯 Overview

RecallPrompt is a web application designed to help you practice and test your knowledge across various domains. The core philosophy is simple: you don't truly understand something until you can explain it without external support.

## ✨ Features

### Practice Modes

- **Quick Think**: Rapid-fire topic practice with timed sessions
- **Understand & Explain**: Deep dive into topics with structured explanation phases
- **Interview**: Simulated interview practice with realistic questions

### Topic Categories

- **Engineering & Technology**: Frontend, Backend, Database, AI Engineering, Agentic AI, System Design, DSA, Cloud/DevOps, Cybersecurity, Networks, Operating Systems
- **Business & Startups**: Strategy & MBA, BBA, Business & Startups
- **Science**: Physics, Life Science, Climate & Energy
- **Health & Humanities**: Health & Human Body, Arts & Humanities, Media & Society
- **Decision Making**: Decision frameworks and critical thinking
- **Interview**: Behavioral, HR, Technical, Case, Communication questions

### Custom Collections

- Create your own topic collections
- Practice with custom topics
- Quick topic mode for immediate practice
- Local storage for persistence

### Additional Features

- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Sound Effects**: Optional audio feedback
- **Practice History**: Track your previous sessions
- **Keyboard Shortcuts**: Efficient navigation with hotkeys
- **Responsive Design**: Works on desktop and mobile
- **Local Storage**: All data persists in browser

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/abhijeet02singh/RecallPrompt.git
cd RecallPrompt

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production files will be in the `dist` directory.

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **Animations**: Motion
- **Testing**: Vitest

## 📁 Project Structure

```
src/
├── components/
│   ├── custom/          # Custom collection components
│   ├── history/          # Practice history views
│   ├── layout/           # Header, modals, layout components
│   └── practice/         # Practice flow components
├── data/
│   ├── categories.ts     # Category definitions
│   └── topics/          # Topic data by category
├── config/
│   └── site.ts          # Site configuration
├── hooks/
│   └── useTimer.ts       # Timer hook
├── lib/
│   ├── audio.ts          # Sound effects
│   ├── randomTopic.ts    # Topic selection
│   ├── storage.ts        # Local storage utilities
│   └── validation.ts     # Input validation
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## 🎨 Design Philosophy

The application features a vintage, paper-texture aesthetic with:
- Warm color palette (#F8F4EA background)
- Typography-focused design
- Minimalist interface
- Smooth animations
- Responsive layout

## ⌨️ Keyboard Shortcuts

- `?` - Open shortcuts modal
- `Escape` - Close modals

## 🌐 Deployment

### Vercel

The project is configured for Vercel deployment with `vercel.json`. 

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy with default settings

### Manual Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 📝 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Add any environment variables here
```

## 🧪 Testing

```bash
npm run test
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## 📄 License

This project is created by Abhijeet Singh (Edition 2026).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please visit the GitHub repository.

---

**Understand. Remove support. Explain.**
