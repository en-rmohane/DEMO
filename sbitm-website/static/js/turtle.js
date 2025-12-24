// Turtle Graphics Engine for SBITM Betul
class TurtleCanvas {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        // Configuration
        this.config = {
            particles: options.particles || 50,
            lineWidth: options.lineWidth || 1.5,
            speed: options.speed || 0.5,
            colors: options.colors || ['#f5b400', '#00bcd4', '#ff4081', '#4caf50'],
            opacity: options.opacity || 0.1,
            mode: options.mode || 'geometric' // 'geometric', 'organic', 'network'
        };

        // Initialize
        this.turtles = [];
        this.particles = [];
        this.init();
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        // Create turtles based on mode
        switch(this.config.mode) {
            case 'geometric':
                this.createGeometricTurtles();
                break;
            case 'organic':
                this.createOrganicTurtles();
                break;
            case 'network':
                this.createNetworkTurtles();
                break;
        }

        // Create background particles
        this.createParticles();
    }

    createGeometricTurtles() {
        for (let i = 0; i < this.config.particles; i++) {
            this.turtles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.config.speed * 2,
                vy: (Math.random() - 0.5) * this.config.speed * 2,
                size: Math.random() * 20 + 5,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                shape: Math.floor(Math.random() * 3), // 0: circle, 1: square, 2: triangle
                connections: []
            });
        }
    }

    createOrganicTurtles() {
        for (let i = 0; i < this.config.particles; i++) {
            this.turtles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: Math.sin(i) * this.config.speed,
                vy: Math.cos(i) * this.config.speed,
                size: Math.random() * 15 + 3,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                angle: i * 0.1,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                trail: [],
                maxTrail: 20
            });
        }
    }

    createNetworkTurtles() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.4;

        for (let i = 0; i < this.config.particles; i++) {
            const angle = (i / this.config.particles) * Math.PI * 2;
            const distance = radius + Math.random() * 50;

            this.turtles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                originX: centerX + Math.cos(angle) * distance,
                originY: centerY + Math.sin(angle) * distance,
                vx: 0,
                vy: 0,
                size: Math.random() * 8 + 2,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                angle: angle,
                connections: [],
                pulse: 0,
                pulseSpeed: Math.random() * 0.05 + 0.02
            });
        }

        // Create connections
        this.createConnections();
    }

    createConnections() {
        for (let i = 0; i < this.turtles.length; i++) {
            this.turtles[i].connections = [];
            for (let j = i + 1; j < this.turtles.length; j++) {
                const dx = this.turtles[i].x - this.turtles[j].x;
                const dy = this.turtles[i].y - this.turtles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.turtles[i].connections.push(j);
                }
            }
        }
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2,
                color: `rgba(245, 180, 0, ${Math.random() * 0.2})`,
                life: Math.random() * 100
            });
        }
    }

    update() {
        // Clear with fade effect
        this.ctx.fillStyle = `rgba(13, 27, 63, 0.03)`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Update and draw based on mode
        switch(this.config.mode) {
            case 'geometric':
                this.updateGeometric();
                break;
            case 'organic':
                this.updateOrganic();
                break;
            case 'network':
                this.updateNetwork();
                break;
        }

        // Update particles
        this.updateParticles();
    }

    updateGeometric() {
        this.turtles.forEach((turtle, i) => {
            // Update position
            turtle.x += turtle.vx;
            turtle.y += turtle.vy;
            turtle.angle += turtle.rotationSpeed;

            // Bounce off walls
            if (turtle.x < 0 || turtle.x > this.width) turtle.vx *= -1;
            if (turtle.y < 0 || turtle.y > this.height) turtle.vy *= -1;

            // Keep within bounds
            turtle.x = Math.max(0, Math.min(this.width, turtle.x));
            turtle.y = Math.max(0, Math.min(this.height, turtle.y));

            // Draw turtle
            this.ctx.save();
            this.ctx.translate(turtle.x, turtle.y);
            this.ctx.rotate(turtle.angle);
            this.ctx.fillStyle = turtle.color;
            this.ctx.globalAlpha = this.config.opacity;

            switch(turtle.shape) {
                case 0: // Circle
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, turtle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                case 1: // Square
                    this.ctx.fillRect(-turtle.size, -turtle.size, turtle.size * 2, turtle.size * 2);
                    break;
                case 2: // Triangle
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -turtle.size);
                    this.ctx.lineTo(turtle.size, turtle.size);
                    this.ctx.lineTo(-turtle.size, turtle.size);
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
            }

            this.ctx.restore();

            // Draw connections
            this.ctx.strokeStyle = turtle.color;
            this.ctx.globalAlpha = this.config.opacity * 0.3;
            this.ctx.lineWidth = 1;

            this.turtles.forEach((other, j) => {
                if (i !== j) {
                    const dx = turtle.x - other.x;
                    const dy = turtle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(turtle.x, turtle.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.stroke();
                    }
                }
            });
        });
    }

    updateOrganic() {
        this.turtles.forEach(turtle => {
            // Update position with Perlin-like noise
            turtle.angle += turtle.rotationSpeed;
            turtle.vx = Math.sin(turtle.angle) * this.config.speed;
            turtle.vy = Math.cos(turtle.angle * 0.5) * this.config.speed;

            turtle.x += turtle.vx;
            turtle.y += turtle.vy;

            // Wrap around
            if (turtle.x < -50) turtle.x = this.width + 50;
            if (turtle.x > this.width + 50) turtle.x = -50;
            if (turtle.y < -50) turtle.y = this.height + 50;
            if (turtle.y > this.height + 50) turtle.y = -50;

            // Add to trail
            turtle.trail.push({x: turtle.x, y: turtle.y});
            if (turtle.trail.length > turtle.maxTrail) {
                turtle.trail.shift();
            }

            // Draw trail
            this.ctx.strokeStyle = turtle.color;
            this.ctx.lineWidth = this.config.lineWidth;
            this.ctx.globalAlpha = this.config.opacity;

            this.ctx.beginPath();
            turtle.trail.forEach((point, i) => {
                const alpha = i / turtle.trail.length;
                this.ctx.globalAlpha = this.config.opacity * alpha;

                if (i === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();

            // Draw head
            this.ctx.fillStyle = turtle.color;
            this.ctx.globalAlpha = this.config.opacity * 2;
            this.ctx.beginPath();
            this.ctx.arc(turtle.x, turtle.y, turtle.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    updateNetwork() {
        this.turtles.forEach(turtle => {
            // Pulsing effect
            turtle.pulse += turtle.pulseSpeed;
            if (turtle.pulse > Math.PI * 2) turtle.pulse = 0;

            // Float around origin
            turtle.x = turtle.originX + Math.sin(turtle.pulse) * 20;
            turtle.y = turtle.originY + Math.cos(turtle.pulse * 0.5) * 10;

            // Draw connections
            this.ctx.strokeStyle = turtle.color;
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = (Math.sin(turtle.pulse) + 1) * 0.1 * this.config.opacity;

            turtle.connections.forEach(connectionIndex => {
                const other = this.turtles[connectionIndex];
                this.ctx.beginPath();
                this.ctx.moveTo(turtle.x, turtle.y);
                this.ctx.lineTo(other.x, other.y);
                this.ctx.stroke();
            });

            // Draw node
            this.ctx.fillStyle = turtle.color;
            this.ctx.globalAlpha = (Math.sin(turtle.pulse) + 1) * 0.3 * this.config.opacity;
            this.ctx.beginPath();
            this.ctx.arc(turtle.x, turtle.y, turtle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            // Wrap around
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;

            // Respawn if dead
            if (particle.life <= 0) {
                particle.x = Math.random() * this.width;
                particle.y = Math.random() * this.height;
                particle.life = 100;
            }

            // Draw
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 100;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.init();
    }

    changeMode(mode) {
        this.config.mode = mode;
        this.turtles = [];
        this.particles = [];
        this.init();
    }

    changeColorScheme(scheme) {
        switch(scheme) {
            case 'primary':
                this.config.colors = ['#f5b400', '#00bcd4', '#ff4081'];
                break;
            case 'mono':
                this.config.colors = ['#ffffff', '#f0f0f0', '#e0e0e0'];
                break;
            case 'rainbow':
                this.config.colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
                break;
        }
        this.init();
    }
}

// Initialize Turtle Canvases
document.addEventListener('DOMContentLoaded', () => {
    // Main background turtle
    const mainTurtle = new TurtleCanvas('turtleCanvas', {
        particles: 80,
        lineWidth: 1.5,
        speed: 0.3,
        opacity: 0.08,
        mode: 'geometric'
    });

    // Hero section turtle
    const heroTurtle = new TurtleCanvas('heroTurtle', {
        particles: 30,
        lineWidth: 2,
        speed: 0.2,
        opacity: 0.15,
        mode: 'organic'
    });

    // Interactive turtle controls
    const modeButtons = document.querySelectorAll('.turtle-mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            mainTurtle.changeMode(mode);
        });
    });

    // Color scheme switcher
    const colorButtons = document.querySelectorAll('.turtle-color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const scheme = btn.dataset.scheme;
            mainTurtle.changeColorScheme(scheme);
        });
    });

    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        if (mainTurtle.turtles) {
            mainTurtle.turtles.forEach(turtle => {
                const dx = e.clientX - turtle.x;
                const dy = e.clientY - turtle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    turtle.vx -= Math.cos(angle) * 0.1;
                    turtle.vy -= Math.sin(angle) * 0.1;
                }
            });
        }
    });

    // Click effect
    document.addEventListener('click', (e) => {
        if (mainTurtle.turtles) {
            mainTurtle.turtles.forEach(turtle => {
                const dx = e.clientX - turtle.x;
                const dy = e.clientY - turtle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = 2;
                    turtle.vx = (Math.random() - 0.5) * force;
                    turtle.vy = (Math.random() - 0.5) * force;
                }
            });
        }
    });
});