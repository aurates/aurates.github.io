# Hexo Blog - User Guide

This guide explains how to use and manage the Hexo blog with the Liquid Glass theme.

## Quick Start

### Running the Blog Locally

```bash
# Navigate to the blog directory
cd blog

# Start the development server
npx hexo server

# The blog will be available at http://localhost:4000
```

### Building for Production

```bash
# Generate static files
npx hexo generate

# Files will be output to blog/public/
```

---

## Creating New Posts

### Method 1: Using Hexo CLI

```bash
# Create a new post
npx hexo new "My Post Title"

# This creates: source/_posts/my-post-title.md
```

### Method 2: Manually Create File

Create a new `.md` file in `blog/source/_posts/` with this format:

```markdown
---
title: My Post Title
date: 2025-01-15 10:00:00
tags:
  - tag1
  - tag2
categories:
  - Category Name
---

Write your content here using Markdown!

<!-- more -->

Content after this marker becomes the "Read More" section.
```

### Post Front Matter Options

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Post title | `"Hello World"` |
| `date` | Publish date | `2025-01-15 10:00:00` |
| `tags` | Tag list | `[react, tutorial]` |
| `categories` | Category list | `[Programming]` |
| `excerpt` | Custom excerpt | `"Brief description"` |

---

## Creating Static Pages

For pages like "About Me":

```bash
# Create a new page
npx hexo new page "about"

# This creates: source/about/index.md
```

Edit the generated `index.md`:

```markdown
---
title: About Me
layout: page
---

Your page content here...
```

---

## Managing Content

### Categories & Tags

Add them in your post's front matter:

```yaml
---
title: My Post
tags:
  - javascript
  - tutorial
  - react
categories:
  - Programming
  - Web Development
---
```

### Adding Images

1. Place images in `blog/source/images/`
2. Reference in your posts:

```markdown
![Alt text](/images/my-image.png)
```

### Code Blocks

Use triple backticks with language:

````markdown
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```
````

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npx hexo new "Title"` | Create new post |
| `npx hexo new page "name"` | Create new page |
| `npx hexo server` | Start local server |
| `npx hexo generate` | Build static files |
| `npx hexo clean` | Clear cache & generated files |
| `npx hexo deploy` | Deploy to configured host |

---

## Deployment

### Option 1: Manual Deploy

```bash
# Generate files
npx hexo generate

# Copy public/ contents to your hosting
```

### Option 2: GitHub Actions

The blog can be automatically built and deployed when you push changes. Add this workflow to `.github/workflows/hexo.yml`:

```yaml
name: Deploy Hexo Blog

on:
  push:
    branches: [main]
    paths:
      - 'blog/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install & Build
        run: |
          cd blog
          npm install
          npx hexo generate
          
      - name: Deploy
        # Configure your deployment here
```

---

## Customization

### Theme Colors

Edit `blog/themes/liquid-glass/source/css/style.css` to change colors:

```css
:root {
  --purple-400: #a78bfa;  /* Primary accent */
  --purple-500: #8b5cf6;  /* Hover accent */
}
```

### Navigation Menu

Edit `blog/themes/liquid-glass/_config.yml`:

```yaml
menu:
  Home: /
  Archives: /archives
  Categories: /categories
  Tags: /tags
  About: /about
```

---

## Troubleshooting

### Posts Not Showing

1. Check the `date` is not in the future
2. Run `npx hexo clean` then `npx hexo generate`
3. Ensure file is in `source/_posts/`

### Server Not Starting

```bash
# Clear cache and try again
npx hexo clean
npx hexo server
```

### Build Errors

Check for:
- Invalid YAML in front matter (use proper indentation)
- Unclosed code blocks
- Missing required fields

---

## File Structure

```
blog/
├── _config.yml          # Main Hexo config
├── source/
│   ├── _posts/          # Your blog posts
│   │   ├── welcome.md
│   │   └── tutorial.md
│   ├── about/           # About page
│   │   └── index.md
│   └── images/          # Static images
├── themes/
│   └── liquid-glass/    # Custom theme
└── public/              # Generated files (gitignored)
```

---

## Tips

1. **Use excerpts** - Add `<!-- more -->` to control what shows on the index page
2. **Organize with categories** - Use nested categories for better organization
3. **Tag wisely** - Don't over-tag; use meaningful tags
4. **Preview first** - Always run `hexo server` before deploying
5. **Clear cache** - Run `npx hexo clean` if things look wrong

---

Happy blogging! ✨
