# AI Generated Personal Landing Page Demo </3

This project is fully powered by **Claude Opus 4.5**, an advanced AI model that conceptualized, designed, and implemented every aspect of this digital home.

Other than this sentence, I didn't write a single word of code. Even this README.md is AI generated.

---

A minimalist personal landing page featuring a "Liquid Glass" aesthetic with animated backgrounds, hidden view switching, a customizable Designer Mode, and an integrated Hexo-powered blog.

## Tech Stack

- **React 19** – UI framework
- **Vite 6** – Build tool & dev server
- **TypeScript** – Type safety
- **Tailwind CSS 4.0** – Utility-first styling
- **js-cookie** – Persistent settings
- **Lucide React** – Icon library
- **Hexo 7** – Static blog framework with NexT theme

## Project Structure

```
├── App.tsx              # Main app logic & state
├── index.tsx            # React entry point
├── index.css            # Tailwind config & animations
├── constants.tsx        # SVG icons
├── components/
│   ├── BubbleBackground.tsx   # Animated floating bubbles (4-level opacity)
│   ├── SnowEffect.tsx         # Winter snow particles
│   ├── FallingText.tsx        # Periodic text animation
│   ├── ClockPanel.tsx         # Full-screen clock view
│   ├── BetaConfigPanel.tsx    # Designer Mode color picker
│   ├── LiquidGlassToggle.tsx  # Theme switcher
│   ├── SettingsDropdown.tsx   # Clock preferences
│   └── ...
├── context/
│   └── BetaContext.tsx  # Designer Mode state (separate dark/light profiles)
└── blog/                # Hexo blog
    ├── source/_posts/   # Blog articles (Markdown)
    ├── _config.yml      # Hexo configuration
    └── _config.next.yml # NexT theme configuration
```

## Design Philosophy

- **Glassmorphism**: Translucent panels with backdrop blur create depth without visual clutter
- **Hidden Interactions**: Complex features accessible via tap patterns (3x heart = Designer Mode, 3x space = Clock view)
- **Ambient Motion**: Floating bubbles and snow effects add life without distraction
- **Progressive Entrance**: Elements scale up from 85% opacity for a dimensional feel

## Core Features

- 🎨 Light/Dark theme with cookie persistence
- ⏰ Hidden Clock view (3x spacebar/tap to toggle)
- ✨ Designer Mode with advanced HSV color picker
  - Separate color profiles for dark and light modes
  - Real-time preview while dragging
  - Hex input with auto-prefix
- ❄️ Toggleable snow effect (dark mode)
- 🫧 Animated bubble background with 4-level opacity variation and pause control
- 📱 Fully responsive design
- 📝 Integrated Hexo blog with NexT theme

## Blog Features

The integrated blog uses Hexo with the NexT theme (Gemini scheme):

- Clean, professional sidebar layout
- Archives grouped by year
- Tags and categories support
- Mobile-responsive navigation

### Blog Commands

```bash
cd blog
npx hexo new "Post Title"  # Create new post
npx hexo server            # Preview locally at http://localhost:4000/blog/
npx hexo generate          # Build static files
```

## Development

```bash
# Main site
npm install
npm run dev      # http://localhost:5173

# Blog
cd blog
npm install
npm run server   # http://localhost:4000/blog/
```

---

*Built with passion and AI.*
