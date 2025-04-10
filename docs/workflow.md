---
order: 1
icon: fas fa-rocket
title: Setup Your Documentation Workflow
description: >-
  A step-by-step guide to generate a beautiful documentation site from Markdown
  in less than 5 minutes!
---

Setting up a beautiful documentation site should be easy — and now it is. With
**showcase-chirpy-easy-docs**, all you need is Markdown, a few config files, and
a GitHub workflow.

This tutorial walks you through everything: from configuring your repo to
writing your first tabbed doc page.

---

## 🚀 1. Copy the workflow file

Create a new file in your repository at:

```
.github/workflows/deploy-docs.yml
```

And paste this:

```yaml
name: Deploy Docs to GitHub Pages

on:
  push:
    branches:
      - main # or your default branch

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy-docs:
    runs-on: ubuntu-latest
    name: Build and Deploy Documentation

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'

      - name: Generate Docs with Chirpy
        uses: jsurrea/showcase-chirpy-easy-docs@v1.0.0
        with:
          docs-dir: docs # Change if your docs are in another directory

      - name: Upload site artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: theme/_site

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

---

## 🛠 2. Create your `docs/` directory

In the root of your repo, create a `docs/` folder. This is where your content
goes.

At minimum, include:

- `_config.yml` — required Jekyll config
- `index.md` — the main landing page
- one or more `.md` files for additional tabs

---

## 🧩 3. Copy the `_config.yml`

📄
[View this config on GitHub](https://github.com/jsurrea/showcase-chirpy-easy-docs/blob/main/docs/_config.yml)

We have prepared a sample `_config.yml` for you with everything you need to get
started. Copy this into your `docs/` folder and change everything marked as
`TODO` to make the site your own.

---

## 🧠 4. How it works

The action clones your repository, grabs everything in your `docs/` folder, and
merges it with the
[Showcase Chirpy theme](https://jsurrea.github.io/showcase-chirpy-theme/) to
build your site.

The theme requires a header format for each Markdown file to know how to display
it. Don't worry, it's simple!

### 🏠 `index.md`

This becomes the main homepage of your documentation.

```markdown
---
layout: page
toc: true
---

# Welcome!

This is your main landing page.
```

### 🗂 Tabs (`*.md` files)

Each additional Markdown file becomes a **tab in the sidebar**. They need this
header format at the top:

```markdown
---
order: 1 # The order of the tab in the sidebar
icon: fas fa-rocket # The icon to display
title: My Section # The title of the tab
description: >-
  A short description of this section. # The description of the tab
---

# My Section

This is the content of my section.
```

📎
[See working example here](https://github.com/jsurrea/showcase-chirpy-easy-docs/tree/main/docs)

---

## 🌐 5. Enable GitHub Pages

Go to your repo → ⚙️ Settings → **Pages**

- **Source**: `GitHub Actions`
- Click **Save**

---

## 📁 6. Using a custom docs directory

By default, the action looks in `docs/`.  
Customize with:

```yaml
with:
  docs-dir: my-docs-folder
```

---

## 💬 Need help?

- [Showcase Chirpy Theme Docs](https://jsurrea.github.io/showcase-chirpy-theme/)
- [GitHub Repo](https://github.com/jsurrea/showcase-chirpy-easy-docs)
