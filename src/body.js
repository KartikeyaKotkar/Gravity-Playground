class Body {
    constructor(x, y, mass, type = 'planet') {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.mass = mass;
        this.radius = Math.sqrt(mass) * 2; // Simple radius based on mass
        this.type = type; // 'planet', 'star', 'blackhole', 'whitehole', 'wormhole', 'antimatter'
        this.color = this.getColorByType(type);
        this.trail = [];
        this.maxTrailLength = 50;
    }

    getColorByType(type) {
        switch (type) {
            case 'star': return '#ffcc00';
            case 'blackhole': return '#000000';
            case 'whitehole': return '#ffffff';
            case 'wormhole': return '#00ffcc';
            case 'antimatter': return '#ff00ff';
            default: return '#4f8aff'; // planet
        }
    }

    update(dt) {
        this.vel.x += this.acc.x * dt;
        this.vel.y += this.acc.y * dt;
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;

        // Reset acceleration
        this.acc.x = 0;
        this.acc.y = 0;

        // Trail logic
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        this.trail.push({ x: this.pos.x, y: this.pos.y });
    }

    applyForce(fx, fy) {
        this.acc.x += fx / this.mass;
        this.acc.y += fy / this.mass;
    }
}
window.Body = Body;
