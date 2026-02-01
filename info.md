# Hexo Blog Integration Guide

This guide explores integrating a Hexo-powered blog with the existing Liquid Glass aesthetic.

## Overview

[Hexo](https://hexo.io/) is a fast, simple, and powerful blog framework built on Node.js. It generates static files that can be deployed alongside this React landing page on GitHub Pages.

## Recommended Structure

```
aurates.github.io/
├── blog/                    # Hexo blog root
│   ├── source/
│   │   ├── _posts/          # Blog articles (Markdown)
│   │   ├── about/           # About Me page
│   │   └── archives/        # Auto-generated
│   ├── themes/
│   │   └── liquid-glass/    # Custom theme
│   ├── _config.yml          # Hexo configuration
│   └── package.json
├── dist/                    # React app build output
└── [React source files]
```

## Installation

```bash
# Install Hexo CLI globally
npm install -g hexo-cli

# Create blog in subdirectory
mkdir blog && cd blog
hexo init .
npm install

# Install useful plugins
npm install hexo-generator-archive hexo-generator-category hexo-generator-tag
```

## Configuration (_config.yml)

```yaml
# Site
title: Dylan's Blog
subtitle: Thoughts & Projects
author: Dylan
language: en

# URL - Important for GitHub Pages subdirectory
url: https://aurates.github.io
root: /blog/

# Directory
source_dir: source
public_dir: public

# Pagination
per_page: 10
pagination_dir: page

# Archive settings
archive_generator:
  per_page: 0  # Show all posts on single page
  yearly: true
  monthly: false

# Category & Tag
category_generator:
  per_page: 10
tag_generator:
  per_page: 10

# Theme
theme: liquid-glass
```

## Custom Liquid Glass Theme

Create `themes/liquid-glass/` with this structure:

```
liquid-glass/
├── _config.yml
├── layout/
│   ├── layout.ejs           # Base template
│   ├── index.ejs            # Blog home
│   ├── post.ejs             # Single article
│   ├── page.ejs             # Static pages (About)
│   ├── archive.ejs          # Archives list
│   ├── category.ejs         # Category listing
│   ├── tag.ejs              # Tag listing
│   └── partial/
│       ├── header.ejs
│       ├── footer.ejs
│       ├── sidebar.ejs
│       └── article.ejs
├── source/
│   ├── css/
│   │   └── liquid-glass.css
│   └── js/
│       └── main.js
└── languages/
    └── en.yml
```

### Base Layout (layout/layout.ejs)

```html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= page.title ? page.title + ' | ' : '' %><%= config.title %></title>
  <%- css('css/liquid-glass') %>
</head>
<body class="bg-slate-950 min-h-screen text-white overflow-x-hidden">
  <!-- Animated Background -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
  </div>

  <!-- Glass Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 glass-liquid px-6 py-4">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <a href="<%- url_for('/') %>" class="text-2xl font-bold hover:scale-105 transition-transform">
        <%= config.title %>
      </a>
      <div class="flex gap-6">
        <a href="<%- url_for('/') %>" class="nav-link">Home</a>
        <a href="<%- url_for('/archives') %>" class="nav-link">Archives</a>
        <a href="<%- url_for('/categories') %>" class="nav-link">Categories</a>
        <a href="<%- url_for('/tags') %>" class="nav-link">Tags</a>
        <a href="<%- url_for('/about') %>" class="nav-link">About</a>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="relative z-10 pt-24 pb-16 px-4">
    <div class="max-w-4xl mx-auto">
      <%- body %>
    </div>
  </main>

  <!-- Footer -->
  <footer class="relative z-10 text-center py-8 text-slate-500">
    <p>2026 ❤ Dylan</p>
  </footer>

  <%- js('js/main') %>
</body>
</html>
```

### Archive Page (layout/archive.ejs)

```html
<div class="glass-liquid-intense rounded-3xl p-8 animate-entrance">
  <h1 class="text-4xl font-bold mb-8 text-center">Archives</h1>
  
  <% let currentYear = null; %>
  <% page.posts.each(function(post) { %>
    <% const year = post.date.year(); %>
    
    <% if (year !== currentYear) { %>
      <% if (currentYear !== null) { %></div><% } %>
      <% currentYear = year; %>
      <h2 class="text-2xl font-bold mt-8 mb-4 text-purple-400"><%= year %></h2>
      <div class="space-y-3">
    <% } %>
    
    <a href="<%- url_for(post.path) %>" 
       class="flex items-center gap-4 p-4 rounded-2xl glass-liquid hover:scale-[1.02] transition-all group">
      <span class="text-sm text-slate-500 font-mono w-24 shrink-0">
        <%= post.date.format('MMM DD') %>
      </span>
      <span class="group-hover:text-purple-300 transition-colors">
        <%= post.title %>
      </span>
    </a>
  <% }); %>
  </div>
</div>
```

### Liquid Glass CSS (source/css/liquid-glass.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
}

/* Glass Effects */
.glass-liquid {
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-liquid-intense {
  backdrop-filter: blur(24px) saturate(200%) contrast(1.1);
  -webkit-backdrop-filter: blur(24px) saturate(200%) contrast(1.1);
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

/* Navigation Links */
.nav-link {
  position: relative;
  padding: 0.5rem 0;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: white;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #a855f7, #3b82f6);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Animated Bubbles */
.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.1);
  animation: bubble-rise 8s infinite ease-in-out;
}

.bubble:nth-child(1) {
  width: 200px;
  height: 200px;
  right: 10%;
  animation-delay: 0s;
}

.bubble:nth-child(2) {
  width: 150px;
  height: 150px;
  right: 30%;
  animation-delay: -2s;
}

.bubble:nth-child(3) {
  width: 250px;
  height: 250px;
  right: 60%;
  animation-delay: -4s;
}

@keyframes bubble-rise {
  0%, 100% {
    transform: translateY(100vh) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* Entrance Animation */
.animate-entrance {
  animation: entrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes entrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Article Cards */
.article-card {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.article-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Typography */
.prose {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
}

.prose h1, .prose h2, .prose h3 {
  color: white;
  font-weight: 700;
}

.prose a {
  color: #a855f7;
  text-decoration: none;
  transition: color 0.2s;
}

.prose a:hover {
  color: #c084fc;
}

.prose code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

.prose pre {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 1rem;
  overflow-x: auto;
}

/* Responsive */
@media (max-width: 768px) {
  nav .flex.gap-6 {
    display: none;
  }
}
```

## Creating Pages

### About Me Page

```bash
hexo new page about
```

Edit `source/about/index.md`:

```markdown
---
title: About Me
layout: page
---

## Hi, I'm Dylan 👋

A passionate developer who loves building beautiful, interactive web experiences.

### What I Do
- Full-stack web development
- UI/UX design with modern aesthetics
- Open source contributions

### Connect
- GitHub: [@aurates](https://github.com/aurates)
- Discord: Click the icon on the homepage
```

### Writing Posts

```bash
hexo new post "My First Article"
```

Edit `source/_posts/my-first-article.md`:

```markdown
---
title: My First Article
date: 2026-02-01 12:00:00
tags:
  - introduction
  - web-dev
categories:
  - Announcements
---

Welcome to my blog! Here I'll share my thoughts on technology, design, and more.

<!-- more -->

Full article content goes here...
```

## Build & Deploy

### Local Development

```bash
cd blog
hexo server  # Preview at http://localhost:4000
```

### Generate Static Files

```bash
hexo clean
hexo generate
```

### GitHub Pages Deployment

Add to your GitHub Actions workflow:

```yaml
- name: Build Blog
  run: |
    cd blog
    npm install
    npx hexo generate
    cp -r public ../dist/blog
```

Or manually:

```bash
# After building React app
npm run build

# Build blog and copy to dist
cd blog
hexo generate
cp -r public ../dist/blog
```

## Design Principles

1. **Consistency**: Use the same glass effect, colors, and animations across all pages
2. **Readability**: Ensure sufficient contrast for article content
3. **Performance**: Limit bubble animations on blog pages for better reading experience
4. **Mobile-First**: Test all layouts on various screen sizes
5. **Accessibility**: Include proper ARIA labels and keyboard navigation

## Tips

- Keep the dark theme as default to match the main landing page
- Use the same `entrance` animation for page transitions
- Consider adding a "Back to Home" link that returns to the React landing page
- Use `hexo-renderer-marked` for better Markdown support
- Add `hexo-generator-sitemap` for SEO

---

*This integration allows your blog to maintain the stunning Liquid Glass aesthetic while leveraging Hexo's powerful blogging capabilities.*
