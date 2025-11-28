class UI {
    constructor(simulation, renderer) {
        this.simulation = simulation;
        this.renderer = renderer;

        this.selectedTool = 'spawn';
        this.spawnType = 'planet';
        this.draggingBody = null;
        this.dragOffset = { x: 0, y: 0 };

        this.setupListeners();
    }

    setupListeners() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedTool = e.target.dataset.tool;
            });
        });

        // Spawn type
        document.getElementById('spawnType').addEventListener('change', (e) => {
            this.spawnType = e.target.value;
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.simulation.clear();
            this.renderer.camera = { x: 0, y: 0, zoom: 1 };
        });

        // Pause button
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.addEventListener('click', () => {
            this.simulation.paused = !this.simulation.paused;
            pauseBtn.textContent = this.simulation.paused ? 'Resume' : 'Pause';
        });

        // Canvas interactions
        const canvas = this.renderer.canvas;

        canvas.addEventListener('mousedown', (e) => this.handleInput(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('wheel', (e) => this.handleZoom(e));
    }

    getWorldPos(e) {
        const rect = this.renderer.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Transform to world coordinates
        const cam = this.renderer.camera;
        const worldX = (x - this.renderer.canvas.width / 2) / cam.zoom + cam.x;
        const worldY = (y - this.renderer.canvas.height / 2) / cam.zoom + cam.y;

        return { x: worldX, y: worldY };
    }

    handleInput(e) {
        const pos = this.getWorldPos(e);

        if (this.selectedTool === 'spawn') {
            let mass = 10;
            if (this.spawnType === 'star') mass = 500;
            if (this.spawnType === 'blackhole') mass = 2000;
            if (this.spawnType === 'whitehole') mass = 2000;
            if (this.spawnType === 'wormhole') mass = 0; // Wormholes are static portals

            this.simulation.addBody(pos.x, pos.y, mass, this.spawnType);
        } else if (this.selectedTool === 'delete') {
            const body = this.findBodyAt(pos);
            if (body) {
                this.simulation.removeBody(body);
            }
        } else if (this.selectedTool === 'move') {
            const body = this.findBodyAt(pos);
            if (body) {
                this.draggingBody = body;
                this.dragOffset = { x: pos.x - body.pos.x, y: pos.y - body.pos.y };
            }
        }
    }

    handleMouseMove(e) {
        if (this.draggingBody) {
            const pos = this.getWorldPos(e);
            this.draggingBody.pos.x = pos.x - this.dragOffset.x;
            this.draggingBody.pos.y = pos.y - this.dragOffset.y;
            this.draggingBody.vel = { x: 0, y: 0 }; // Reset velocity while dragging
        }
    }

    handleMouseUp(e) {
        this.draggingBody = null;
    }

    handleZoom(e) {
        e.preventDefault();
        const zoomSpeed = 0.1;
        if (e.deltaY < 0) {
            this.renderer.camera.zoom *= (1 + zoomSpeed);
        } else {
            this.renderer.camera.zoom /= (1 + zoomSpeed);
        }
    }

    findBodyAt(pos) {
        // Find body clicked on (simple radius check)
        // Check in reverse order to select top-most rendered body
        for (let i = this.simulation.bodies.length - 1; i >= 0; i--) {
            const b = this.simulation.bodies[i];
            const dx = pos.x - b.pos.x;
            const dy = pos.y - b.pos.y;
            if (dx * dx + dy * dy < b.radius * b.radius) {
                return b;
            }
        }
        return null;
    }

    updateStats(dt) {
        document.getElementById('objCount').textContent = this.simulation.bodies.length;
        document.getElementById('fpsCount').textContent = Math.round(1 / dt);
    }
}
window.UI = UI;
