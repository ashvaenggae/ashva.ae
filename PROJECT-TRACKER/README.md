# ASHVA Project Tracker

Static browser-based project tracker for ASHVA Engineering Consultancy.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `ashva-project-tracker`.
2. Upload these files to the repository root:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `.nojekyll`
3. In GitHub, open `Settings` > `Pages`.
4. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Save. GitHub will publish the app at:
   `https://<github-username>.github.io/ashva-project-tracker/`

## Important

This version stores data in the browser's local storage. Different devices will not automatically share the same live data unless a shared backend is added.
