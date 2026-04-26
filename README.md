# WebGenAI

AI-powered website generator using Claude Sonnet 4. Describe any product, pick a design style, and generate a production-ready HTML website with animations in seconds.

## Features

- **12 Design Styles**: Dark Luxury, Glassmorphism, Minimalist, Brutalist, Bento Grid, Retro Future, Claymorphism, Editorial, Cyberpunk, Swiss Design, Aurora, Art Deco
- **Production-Ready Output**: Complete HTML with embedded CSS and JavaScript
- **Animations Included**: Scroll reveals, counters, parallax, hover effects
- **Real Content**: No Lorem Ipsum, industry-specific copy
- **Responsive Design**: Works at all breakpoints
- **Preview & Export**: Preview live, view code, copy or download HTML

## Setup

### Prerequisites
- Node.js 18+
- Anthropic API key

### Installation

```bash
git clone <repo-url>
cd webgenai-app
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Deploy to Render

1. Push to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect GitHub repository
4. Set environment variable: `ANTHROPIC_API_KEY`
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Deploy

## How It Works

1. User enters a product description
2. Selects a design style
3. Clicks "Generate Website"
4. The frontend calls `/api/generate` endpoint
5. Backend calls Claude Sonnet 4 API with comprehensive system prompt
6. Claude generates complete HTML website
7. Website rendered in preview or exported

## System Prompt Features

The system prompt includes:
- 12 distinct design style specifications
- Required website sections (hero, features, stats, testimonials, etc.)
- Animation requirements (scroll reveals, counters, parallax)
- Typography guidelines with Google Fonts pairings
- CSS craft standards and responsive design rules
- High quality bar: "Should feel like it cost $50,000 to build"

## Architecture

- **Frontend**: Next.js + React, client-side component
- **Backend**: Next.js API route with Anthropic SDK
- **API**: Claude Sonnet 4 via Anthropic official SDK
- **Deployment**: Render, Vercel, or any Node.js platform

## License

MIT
