// Simple Turtle Graphics for Background
class SimpleTurtle {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.particles = [];
        this.init();
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = this.container.clientWidth;
        this.height = this.canvas.height = this.container.clientHeight;
    }

    init() {
        // Create background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'rgba(248, 249, 250, 0.9)');
        gradient.addColorStop(1, 'rgba(233, 236, 239, 0.9)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: i % 3 === 0 ? '#f5b400' : i % 3 === 1 ? '#00bcd4' : '#0d1b3f',
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        // Draw geometric pattern
        this.drawGeometricPattern();
    }

    drawGeometricPattern() {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.3;

        // Draw main hexagon
        ctx.strokeStyle = 'rgba(13, 27, 63, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();

        // Draw connecting lines
        for (let i = 0; i < 6; i++) {
            const angle1 = (i * 60) * Math.PI / 180;
            const angle2 = ((i + 2) * 60) * Math.PI / 180;

            const x1 = centerX + radius * Math.cos(angle1);
            const y1 = centerY + radius * Math.sin(angle1);
            const x2 = centerX + radius * Math.cos(angle2);
            const y2 = centerY + radius * Math.sin(angle2);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 180, 0, 0.2)';
        ctx.stroke();
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.speedY *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }

    drawTurtlePaths() {
        const ctx = this.ctx;
        const time = Date.now() * 0.001;

        // Draw multiple turtle paths
        for (let i = 0; i < 3; i++) {
            const offset = i * 100;
            const amplitude = 50;

            ctx.beginPath();
            ctx.strokeStyle = i === 0 ? 'rgba(245, 180, 0, 0.1)' :
                            i === 1 ? 'rgba(0, 188, 212, 0.1)' :
                            'rgba(13, 27, 63, 0.1)';
            ctx.lineWidth = 1;

            for (let x = 0; x < this.width; x += 10) {
                const y = this.height * 0.5 +
                         Math.sin((x + offset + time * 100) * 0.01) * amplitude +
                         Math.cos((x + offset) * 0.005) * 30;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
        }
    }

    animate() {
        // Clear with fade effect
        this.ctx.fillStyle = 'rgba(248, 249, 250, 0.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Update and draw
        this.updateParticles();
        this.drawTurtlePaths();

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const turtle = new SimpleTurtle('turtleContainer');

    // Add click interaction
    document.addEventListener('click', (e) => {
        turtle.particles.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: Math.random() > 0.5 ? '#f5b400' : '#00bcd4',
            opacity: 0.3
        });

        // Limit particles
        if (turtle.particles.length > 100) {
            turtle.particles.shift();
        }
    });
});