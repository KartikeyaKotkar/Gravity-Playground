class Simulation {
    constructor() {
        this.bodies = [];
        this.G = 500; // Gravitational constant
        this.paused = false;
    }

    addBody(x, y, mass, type) {
        console.log(`Adding body: ${type} at ${x},${y}`);
        try {
            this.bodies.push(new Body(x, y, mass, type));
        } catch (e) {
            console.error("Error adding body:", e);
        }
    }

    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index > -1) {
            this.bodies.splice(index, 1);
        }
    }

    clear() {
        this.bodies = [];
    }

    update(dt) {
        if (this.paused) return;

        // Calculate forces
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.applyGravity(this.bodies[i], this.bodies[j]);
            }
        }

        // Update positions
        for (const body of this.bodies) {
            body.update(dt);
        }
    }

    applyGravity(a, b) {
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < a.radius + b.radius) {
            // Wormhole logic
            if (a.type === 'wormhole' && b.type === 'wormhole') return; // Don't interact with each other
            if (a.type === 'wormhole') {
                this.teleport(b, a);
                return;
            }
            if (b.type === 'wormhole') {
                this.teleport(a, b);
                return;
            }

            this.resolveCollision(a, b);
            return;
        }

        let force = (this.G * a.mass * b.mass) / distSq;

        // Repulsion for White Holes
        if (a.type === 'whitehole' || b.type === 'whitehole') {
            force = -force * 2; // Strong repulsion
        }

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (a.type !== 'wormhole' && a.type !== 'whitehole') a.applyForce(fx, fy);
        if (b.type !== 'wormhole' && b.type !== 'whitehole') b.applyForce(-fx, -fy);
    }

    resolveCollision(a, b) {
        // Merge bodies
        const newMass = a.mass + b.mass;
        const newX = (a.pos.x * a.mass + b.pos.x * b.mass) / newMass;
        const newY = (a.pos.y * a.mass + b.pos.y * b.mass) / newMass;
        const newVx = (a.vel.x * a.mass + b.vel.x * b.mass) / newMass;
        const newVy = (a.vel.y * a.mass + b.vel.y * b.mass) / newMass;

        // Keep the type of the heavier object, or special rules
        let newType = a.mass > b.mass ? a.type : b.type;

        // Black hole eats everything and stays black hole
        if (a.type === 'blackhole' || b.type === 'blackhole') newType = 'blackhole';

        // Remove old bodies
        this.removeBody(a);
        this.removeBody(b);

        // Add new body
        const newBody = new Body(newX, newY, newMass, newType);
        newBody.vel.x = newVx;
        newBody.vel.y = newVy;
        this.bodies.push(newBody);
    }

    teleport(body, wormhole) {
        // Find the other wormhole (simple pair logic: just find another wormhole)
        const other = this.bodies.find(b => b.type === 'wormhole' && b !== wormhole);
        if (other) {
            // Teleport to other side with some offset to avoid instant re-collision
            const angle = Math.random() * Math.PI * 2;
            const offset = other.radius + body.radius + 5;
            body.pos.x = other.pos.x + Math.cos(angle) * offset;
            body.pos.y = other.pos.y + Math.sin(angle) * offset;

            // Add some velocity boost
            body.vel.x += Math.cos(angle) * 100;
            body.vel.y += Math.sin(angle) * 100;
        }
    }
}
window.Simulation = Simulation;
