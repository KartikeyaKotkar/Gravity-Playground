# Gravity Playground

A browser-based 2D gravity simulation built with vanilla JavaScript and HTML5 Canvas. Create solar systems, experiment with orbital mechanics, and explore exotic phenomena like black holes, white holes, and wormholes.

## Features

- **Newtonian Physics**: Real-time gravitational interactions between celestial bodies
- **Collision Mechanics**: Bodies merge on impact with momentum conservation
- **Interactive Controls**: Spawn, move, and delete objects with intuitive tools
- **Exotic Anomalies**: 
  - Black Holes with accretion disk effects
  - White Holes with repulsion fields
  - Wormholes that teleport objects between paired portals
- **Visual Effects**: Parallax starfield background, object trails, and glow effects
- **Camera Controls**: Pan and zoom to explore your universe

## Getting Started

No build process or dependencies required. Simply open `index.html` in any modern web browser.

```bash
# Clone the repository
git clone https://github.com/yourusername/gravity-playground.git

# Open in browser
cd gravity-playground
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

## Controls

| Action | Control |
|--------|---------|
| Spawn objects | Left click (Spawn mode) |
| Move objects | Left click + drag (Move mode) |
| Delete objects | Left click (Delete mode) |
| Pan camera | Right click + drag |
| Zoom | Mouse wheel |

## Architecture

```
src/
├── body.js       # Celestial body class with physics properties
├── simulation.js # Physics engine and collision handling
├── renderer.js   # Canvas rendering and visual effects
├── ui.js         # User interface and input handling
└── main.js       # Application initialization and game loop
```

## Technical Details

- Pure vanilla JavaScript (ES6+)
- HTML5 Canvas API for rendering
- No external dependencies
- Runs entirely client-side

## Object Types

- **Planet**: Standard celestial body with moderate mass
- **Star**: High-mass object with strong gravitational pull
- **Black Hole**: Extreme gravity well that absorbs everything
- **White Hole**: Repels nearby objects with anti-gravity
- **Wormhole**: Portal that teleports objects to paired wormhole
- **Anti-Matter**: Experimental object type

## License

MIT License - feel free to use this project for learning or experimentation.

## Deployment / GitHub Pages ✅

This repository is ready to be hosted on GitHub Pages. A GitHub Actions workflow has been added (in `.github/workflows/pages.yml`) which will automatically publish the repository root to GitHub Pages every time you push to `main`.

Quick notes:

- If you want to publish the repository as a project site (URL like `https://<username>.github.io/Gravity-Playground`), you don't need any builds — the workflow will deploy the repo root automatically.
- If you'd rather host from the repository settings directly, you can go to Settings → Pages and choose the `main` branch / root.

Local preview:

You can preview the site locally with a simple HTTP server (do NOT just open the file with the `file://` protocol in some browsers):

Windows (PowerShell):
```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or with Node if you have http-server installed:
```powershell
npx http-server . -p 8000
# then open http://localhost:8000
```

Once pushed to `main`, check the Actions tab to confirm the `Deploy to GitHub Pages` workflow ran successfully. The published URL will appear in the Pages settings when the job finishes.
