// Imports removed for local file support

if (typeof Body === 'undefined') alert("Critical Error: Body class not loaded.");
if (typeof Simulation === 'undefined') alert("Critical Error: Simulation class not loaded.");
if (typeof Renderer === 'undefined') alert("Critical Error: Renderer class not loaded.");
if (typeof UI === 'undefined') alert("Critical Error: UI class not loaded.");

class App {
    constructor() {
        this.canvas = document.getElementById('simCanvas');
        this.resizeCanvas();

        try {
            this.simulation = new Simulation();
            this.renderer = new Renderer(this.canvas, this.simulation);
            this.ui = new UI(this.simulation, this.renderer);

            console.log("Modules initialized");

            this.initDemo();
            console.log("Demo initialized");

            this.lastTime = 0;
            this.running = true;

            requestAnimationFrame((t) => this.loop(t));
        } catch (e) {
            console.error("Initialization error:", e);
            alert("Error initializing app: " + e.message + "\nCheck console for details.");
        }

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    initDemo() {
        // Create a central star
        this.simulation.addBody(0, 0, 1000, 'star');

        // Create an orbiting planet
        const planetDist = 300;
        const planetVel = Math.sqrt(this.simulation.G * 1000 / planetDist);

        const planet = new Body(planetDist, 0, 20, 'planet');
        planet.vel.y = planetVel;
        this.simulation.bodies.push(planet);

        // Create another planet
        const p2Dist = 500;
        const p2Vel = Math.sqrt(this.simulation.G * 1000 / p2Dist);
        const p2 = new Body(-p2Dist, 0, 40, 'planet');
        p2.vel.y = -p2Vel;
        p2.color = '#ff4f4f'; // Red planet
        this.simulation.bodies.push(p2);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.renderer) this.renderer.resize();
    }

    loop(timestamp) {
        try {
            if (!this.lastTime) this.lastTime = timestamp;
            const dt = (timestamp - this.lastTime) / 1000;
            this.lastTime = timestamp;

            if (this.running) {
                // Clamp dt to avoid huge jumps or NaNs
                const safeDt = Math.min(dt, 0.1);
                if (safeDt > 0) {
                    this.simulation.update(safeDt);
                }
            }

            if (this.renderer) this.renderer.render();
            if (this.ui) this.ui.updateStats(dt);

            requestAnimationFrame((t) => this.loop(t));
        } catch (e) {
            console.error("Loop error:", e);
            this.running = false; // Stop simulation to prevent spam
            alert("Simulation loop error: " + e.message);
        }
    }
}

// Start the app
function startApp() {
    try {
        console.log("Starting app...");
        window.app = new App();
        console.log("App started");
    } catch (e) {
        console.error("Fatal error:", e);
        document.body.innerHTML += `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:red;color:white;padding:20px;z-index:9999;">
            <h1>Error Starting Simulation</h1>
            <p>${e.message}</p>
        </div>`;
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startApp();
} else {
    window.addEventListener('load', startApp);
}
