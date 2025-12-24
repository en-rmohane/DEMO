// Initialize Turtle.js instances
const turtleBg = new Turtle('turtle-bg');
const turtleHeader = new Turtle('turtle-header');
const turtleLogo = new Turtle('turtle-logo');
const turtleHero = new Turtle('turtle-hero');
const turtleCard1 = new Turtle('turtle-card-1');
const turtleCard2 = new Turtle('turtle-card-2');
const turtleStat1 = new Turtle('turtle-stat-1');
const turtleStat2 = new Turtle('turtle-stat-2');
const turtleStat3 = new Turtle('turtle-stat-3');
const turtleStat4 = new Turtle('turtle-stat-4');
const turtleFooter = new Turtle('turtle-footer');

// Background Pattern
function drawBackgroundPattern() {
    turtleBg.setColor('#1a237e', 0.05);
    turtleBg.setLineWidth(1);

    // Create geometric pattern
    for(let i = 0; i < 50; i++) {
        const x = Math.random() * turtleBg.width;
        const y = Math.random() * turtleBg.height;
        const size = Math.random() * 30 + 10;

        turtleBg.penUp();
        turtleBg.goto(x, y);
        turtleBg.penDown();

        // Draw different shapes
        const shapeType = Math.floor(Math.random() * 3);
        switch(shapeType) {
            case 0: // Hexagon
                turtleBg.setColor('#534bae', 0.1);
                drawHexagon(turtleBg, x, y, size);
                break;
            case 1: // Triangle
                turtleBg.setColor('#ff4081', 0.1);
                drawTriangle(turtleBg, x, y, size);
                break;
            case 2: // Circle pattern
                turtleBg.setColor('#00bcd4', 0.1);
                drawConcentricCircles(turtleBg, x, y, size);
                break;
        }
    }
}

// Header Pattern
function drawHeaderPattern() {
    turtleHeader.setColor('white', 0.3);
    turtleHeader.setLineWidth(2);

    // Wave pattern
    for(let i = 0; i < turtleHeader.width; i += 40) {
        turtleHeader.penUp();
        turtleHeader.goto(i, 0);
        turtleHeader.penDown();
        turtleHeader.goto(i, turtleHeader.height);
    }

    // Intersecting lines
    for(let i = 0; i < turtleHeader.height; i += 40) {
        turtleHeader.penUp();
        turtleHeader.goto(0, i);
        turtleHeader.penDown();
        turtleHeader.goto(turtleHeader.width, i);
    }
}

// Logo Design
function drawLogoTurtle() {
    const centerX = turtleLogo.width / 2;
    const centerY = turtleLogo.height / 2;
    const radius = 20;

    // Outer circle
    turtleLogo.setColor('#ff4081', 1);
    turtleLogo.setLineWidth(3);
    turtleLogo.penUp();
    turtleLogo.goto(centerX + radius, centerY);
    turtleLogo.penDown();
    turtleLogo.circle(radius);

    // Inner geometric pattern
    turtleLogo.setColor('#00bcd4', 1);
    drawHexagon(turtleLogo, centerX, centerY, radius * 0.7);

    // Accent dots
    turtleLogo.setColor('white', 1);
    for(let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * radius * 0.5;
        const y = centerY + Math.sin(angle) * radius * 0.5;

        turtleLogo.penUp();
        turtleLogo.goto(x, y);
        turtleLogo.penDown();
        turtleLogo.circle(2);
    }
}

// Hero Section Turtle Animation
function drawHeroTurtle() {
    turtleHero.setColor('#1a237e', 0.3);
    turtleHero.setLineWidth(2);

    // Animated spiral
    let radius = 5;
    for(let i = 0; i < 150; i++) {
        const angle = 0.1 * i;
        const x = turtleHero.width/2 + radius * Math.cos(angle);
        const y = turtleHero.height/2 + radius * Math.sin(angle);

        if(i === 0) {
            turtleHero.penUp();
            turtleHero.goto(x, y);
            turtleHero.penDown();
        } else {
            turtleHero.goto(x, y);
        }

        radius += 0.5;
        // Change color gradually
        const hue = (i * 2) % 360;
        turtleHero.setColor(`hsl(${hue}, 70%, 60%)`, 0.6);
    }
}

// Card Patterns
function drawCardPattern1() {
    turtleCard1.setColor('#1a237e', 0.1);
    turtleCard1.setLineWidth(1);

    // Diagonal lines pattern
    for(let i = -turtleCard1.width; i < turtleCard1.width * 2; i += 30) {
        turtleCard1.penUp();
        turtleCard1.goto(i, 0);
        turtleCard1.penDown();
        turtleCard1.goto(i + turtleCard1.height, turtleCard1.height);
    }
}

function drawCardPattern2() {
    turtleCard2.setColor('#ff4081', 0.1);
    turtleCard2.setLineWidth(1);

    // Dot grid pattern
    for(let x = 20; x < turtleCard2.width; x += 40) {
        for(let y = 20; y < turtleCard2.height; y += 40) {
            turtleCard2.penUp();
            turtleCard2.goto(x, y);
            turtleCard2.penDown();
            turtleCard2.circle(2);
        }
    }
}

// Animated Stats
function drawAnimatedStat1() {
    // Pie chart for years
    drawPieChart(turtleStat1, 85, '#1a237e');
}

function drawAnimatedStat2() {
    // Bar graph for alumni count
    drawBarGraph(turtleStat2, 75, '#534bae');
}

function drawAnimatedStat3() {
    // Growing circle for percentage
    drawGrowingCircle(turtleStat3, 95, '#ff4081');
}

function drawAnimatedStat4() {
    // Line graph for faculty count
    drawLineGraph(turtleStat4, 80, '#00bcd4');
}

// Footer Pattern
function drawFooterPattern() {
    turtleFooter.setColor('white', 0.1);
    turtleFooter.setLineWidth(1);

    // Wave pattern at bottom
    for(let i = 0; i < turtleFooter.width; i += 10) {
        const y = turtleFooter.height - Math.sin(i * 0.05) * 20;
        if(i === 0) {
            turtleFooter.penUp();
            turtleFooter.goto(i, y);
            turtleFooter.penDown();
        } else {
            turtleFooter.goto(i, y);
        }
    }

    // Floating shapes
    for(let i = 0; i < 10; i++) {
        const x = Math.random() * turtleFooter.width;
        const y = Math.random() * turtleFooter.height;
        const size = Math.random() * 15 + 5;

        turtleFooter.penUp();
        turtleFooter.goto(x, y);
        turtleFooter.penDown();

        if(i % 3 === 0) {
            turtleFooter.circle(size);
        } else if(i % 3 === 1) {
            drawTriangle(turtleFooter, x, y, size);
        } else {
            drawHexagon(turtleFooter, x, y, size);
        }
    }
}

// Helper drawing functions
function drawHexagon(turtle, x, y, size) {
    turtle.penUp();
    turtle.goto(x + size, y);
    turtle.penDown();

    for(let i = 1; i <= 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        turtle.goto(x + size * Math.cos(angle), y + size * Math.sin(angle));
    }
}

function drawTriangle(turtle, x, y, size) {
    turtle.penUp();
    turtle.goto(x, y - size);
    turtle.penDown();

    turtle.goto(x + size, y + size);
    turtle.goto(x - size, y + size);
    turtle.goto(x, y - size);
}

function drawConcentricCircles(turtle, x, y, maxSize) {
    for(let r = 5; r <= maxSize; r += 5) {
        turtle.penUp();
        turtle.goto(x + r, y);
        turtle.penDown();
        turtle.circle(r);
    }
}

function drawPieChart(turtle, percentage, color) {
    const centerX = turtle.width / 2;
    const centerY = turtle.height / 2;
    const radius = 40;

    // Background circle
    turtle.setColor('#eee', 1);
    turtle.penUp();
    turtle.goto(centerX + radius, centerY);
    turtle.penDown();
    turtle.circle(radius);

    // Percentage arc
    const endAngle = (percentage / 100) * 360;
    turtle.setColor(color, 1);
    turtle.setLineWidth(8);

    turtle.penUp();
    turtle.goto(centerX, centerY);
    turtle.penDown();

    for(let angle = 0; angle <= endAngle; angle += 5) {
        const rad = angle * Math.PI / 180;
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);
        turtle.goto(x, y);
    }
}

function drawBarGraph(turtle, heightPercent, color) {
    const barWidth = 30;
    const maxHeight = turtle.height * 0.6;
    const barHeight = (heightPercent / 100) * maxHeight;
    const x = turtle.width / 2 - barWidth / 2;
    const y = turtle.height - barHeight;

    turtle.setColor(color, 1);
    turtle.setLineWidth(1);

    // Draw bar
    turtle.penUp();
    turtle.goto(x, turtle.height);
    turtle.penDown();
    turtle.goto(x, y);
    turtle.goto(x + barWidth, y);
    turtle.goto(x + barWidth, turtle.height);
    turtle.goto(x, turtle.height);

    // Fill the bar
    turtle.fill();
}

function drawGrowingCircle(turtle, percentage, color) {
    const centerX = turtle.width / 2;
    const centerY = turtle.height / 2;
    const maxRadius = 40;
    const radius = (percentage / 100) * maxRadius;

    // Animated drawing
    turtle.setColor(color, 0.3);
    turtle.setLineWidth(3);

    let currentRadius = 0;
    const animationSteps = 50;

    function animateCircle(step) {
        if(step <= animationSteps) {
            currentRadius = (step / animationSteps) * radius;

            turtle.clear();
            turtle.penUp();
            turtle.goto(centerX + currentRadius, centerY);
            turtle.penDown();
            turtle.circle(currentRadius);

            setTimeout(() => animateCircle(step + 1), 20);
        }
    }

    animateCircle(0);
}

function drawLineGraph(turtle, value, color) {
    const points = [
        {x: 20, y: turtle.height - 20},
        {x: turtle.width / 3, y: turtle.height - (value * 0.3)},
        {x: turtle.width * 2/3, y: turtle.height - (value * 0.6)},
        {x: turtle.width - 20, y: turtle.height - value}
    ];

    turtle.setColor(color, 1);
    turtle.setLineWidth(3);

    // Draw line
    turtle.penUp();
    points.forEach((point, i) => {
        if(i === 0) {
            turtle.goto(point.x, point.y);
            turtle.penDown();
        } else {
            turtle.goto(point.x, point.y);
        }
    });

    // Draw points
    turtle.setColor(color, 1);
    points.forEach(point => {
        turtle.penUp();
        turtle.goto(point.x, point.y);
        turtle.penDown();
        turtle.circle(3);
        turtle.fill();
    });
}

// Mobile Navigation Toggle
function setupMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Animate stats counter
function animateStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-item h3');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const text = stat.textContent;
                const isPercentage = text.includes('%');
                const isPlus = text.includes('+');

                let target = parseInt(text);
                if (isNaN(target)) {
                    target = parseInt(text.replace(/[^0-9]/g, ''));
                }

                let current = 0;
                const increment = target / 50;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
                    }
                }, 30);

                observer.unobserve(stat);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

// Initialize all drawings and functionality
window.addEventListener('load', () => {
    drawBackgroundPattern();
    drawHeaderPattern();
    drawLogoTurtle();
    drawHeroTurtle();
    drawCardPattern1();
    drawCardPattern2();
    drawAnimatedStat1();
    drawAnimatedStat2();
    drawAnimatedStat3();
    drawAnimatedStat4();
    drawFooterPattern();

    setupMobileNavigation();
    animateStatsCounter();

    // Add interactive animations
    document.querySelectorAll('.turtle-interactive').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const canvas = this.querySelector('canvas');
            if (!canvas) return;

            const canvasId = canvas.id;
            let turtle;

            // Get the correct turtle instance
            switch(canvasId) {
                case 'turtle-card-1': turtle = turtleCard1; break;
                case 'turtle-card-2': turtle = turtleCard2; break;
                default: return;
            }

            // Add pulsing animation
            turtle.setColor('#ff4081', 0.3);
            turtle.setLineWidth(2);

            const centerX = turtle.width / 2;
            const centerY = turtle.height / 2;

            for(let i = 0; i < 3; i++) {
                const radius = 10 + i * 20;
                turtle.penUp();
                turtle.goto(centerX + radius, centerY);
                turtle.penDown();
                turtle.circle(radius);
            }
        });

        card.addEventListener('mouseleave', function() {
            const canvas = this.querySelector('canvas');
            if (!canvas) return;

            const canvasId = canvas.id;
            let turtle;

            // Get the correct turtle instance
            switch(canvasId) {
                case 'turtle-card-1':
                    turtle = turtleCard1;
                    turtle.clear();
                    drawCardPattern1();
                    break;
                case 'turtle-card-2':
                    turtle = turtleCard2;
                    turtle.clear();
                    drawCardPattern2();
                    break;
                default: return;
            }
        });
    });

    // Animate hero turtle continuously
    setInterval(() => {
        turtleHero.clear();
        drawHeroTurtle();
    }, 5000);

    // Animate stats periodically
    setInterval(() => {
        turtleStat3.clear();
        drawAnimatedStat3();
    }, 3000);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Redraw all canvases
    drawBackgroundPattern();
    drawHeaderPattern();
    drawLogoTurtle();
    drawHeroTurtle();
    drawCardPattern1();
    drawCardPattern2();
    drawAnimatedStat1();
    drawAnimatedStat2();
    drawAnimatedStat3();
    drawAnimatedStat4();
    drawFooterPattern();
});