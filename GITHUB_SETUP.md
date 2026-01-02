# GitHub Repository Setup

## Option 1: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `success-ledger` (or your preferred name)
   - **Description**: "AI-powered personal achievement platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**
5. Copy the repository URL (e.g., `https://github.com/yourusername/success-ledger.git`)

## Option 2: Use Existing Repository

If you already have a GitHub repository, just provide the URL.

## After Creating/Getting the Repository URL

Run these commands (replace with your actual repository URL):

```bash
# Add the remote repository
git remote add origin https://github.com/yourusername/success-ledger.git

# Verify the remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## Branch Setup

The repository is currently on the `main` branch. If you want to create a development branch:

```bash
# Create and switch to a new branch
git checkout -b develop

# Or create a feature branch
git checkout -b feature/authentication
```

