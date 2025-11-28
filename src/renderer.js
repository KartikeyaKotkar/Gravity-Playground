class Renderer {
    constructor(canvas, simulation) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.simulation = simulation;
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.initStars();
    }

    initStars() {
        this.stars = [];
        const layers = 3;
        for (let i = 0; i < layers; i++) {
            const layerStars = [];
            const count = 150; // Stars per layer
            for (let j = 0; j < count; j++) {
                layerStars.push({
                    x: Math.random(), // Normalized 0-1
                    y: Math.random(), // Normalized 0-1
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2
                });
            }
            this.stars.push({ stars: layerStars, speed: (i + 1) * 0.05 });
        }
    }

    resize() {
        // Handled in main, but could reset buffers here
    }

    render() {
        // Clear screen with Nebula Gradient
        const gradient = this.ctx.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, this.canvas.width);
        gradient.addColorStop(0, '#1a1a2e'); // Deep blue-purple center
        gradient.addColorStop(0.6, '#0a0a10'); // Darker mid
        gradient.addColorStop(1, '#000000'); // Black edges
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Starfield
        this.drawBackground();

        // Debug Text (Bottom Left)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Bodies: ${this.simulation.bodies.length}`, 20, this.canvas.height - 40);
        this.ctx.fillText(`Cam: ${this.camera.x.toFixed(0)}, ${this.camera.y.toFixed(0)} (x${this.camera.zoom.toFixed(2)})`, 20, this.canvas.height - 25);

        this.ctx.save();

        // Apply camera transform
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Render bodies
        for (const body of this.simulation.bodies) {
            this.drawBody(body);
        }

        this.ctx.restore();
    }

    drawBackground() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        for (const layer of this.stars) {
            this.ctx.fillStyle = 'white';
            for (const star of layer.stars) {
                // Twinkle effect
                const twinkle = Math.sin(Date.now() * 0.003 + star.x * 100) * 0.3;
                this.ctx.globalAlpha = Math.max(0.1, Math.min(1, star.opacity + twinkle));

                // Parallax offset
                const offsetX = this.camera.x * layer.speed;
                const offsetY = this.camera.y * layer.speed;

                // Map 0-1 to screen space with wrapping
                let x = (star.x * w - offsetX) % w;
                let y = (star.y * h - offsetY) % h;

                if (x < 0) x += w;
                if (y < 0) y += h;

                this.ctx.beginPath();
                this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.globalAlpha = 1.0;
    }

    drawBody(body) {
        // Draw trail
        if (body.trail.length > 1) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = body.color;
            this.ctx.globalAlpha = 0.3;
            this.ctx.lineWidth = 2;
            for (const point of body.trail) {
                this.ctx.lineTo(point.x, point.y);
            }
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
        }

        this.ctx.save();
        this.ctx.translate(body.pos.x, body.pos.y);

        // Special effects based on type
        if (body.type === 'blackhole') {
            // Accretion disk glow
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, body.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Event horizon ring
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        } else if (body.type === 'whitehole') {
            // Bright repulsion glow
            this.ctx.shadowBlur = 50;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, body.radius, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (body.type === 'wormhole') {
            // Portal swirl effect
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#00ffcc';
            this.ctx.strokeStyle = '#00ffcc';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, body.radius, 0, Math.PI * 2);
            this.ctx.stroke();

            // Inner swirl
            this.ctx.beginPath();
            this.ctx.arc(0, 0, body.radius * 0.6, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        } else if (body.type === 'star') {
            // Star glow
            this.ctx.shadowBlur = 40;
            this.ctx.shadowColor = body.color;
            this.ctx.fillStyle = body.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, body.radius, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Standard planet
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = body.color;
            this.ctx.fillStyle = body.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, body.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }
}
window.Renderer = Renderer;
