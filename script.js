document.addEventListener('DOMContentLoaded', () => {
    // Neural network animation
    const canvas = document.getElementById('networkAnimation');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth / 2;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Node class for neural network
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 157, 0.6)';
            ctx.fill();
        }
    }

    // Create nodes
    const nodes = Array.from({ length: 50 }, () => new Node());

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Draw connections
        nodes.forEach((node1, i) => {
            nodes.slice(i + 1).forEach(node2 => {
                const distance = Math.hypot(node1.x - node2.x, node1.y - node2.y);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node1.x, node1.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.strokeStyle = `rgba(0, 255, 157, ${1 - distance / 100})`;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Improved smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset to account for fixed navbar
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Add animation to submit button
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            // Get form data
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;

            // Create confirmation message element
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'confirmation-message';

            try {
                // Send email using EmailJS
                await emailjs.send(
                    'service_9u268nn',
                    'template_ueezvs2',
                    {
                        from_name: name,
                        from_email: email,
                        message: message,
                        to_email: 'nyccodeinnovator28@gmail.com'
                    }
                );

                // Success message
                confirmationMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you, ${name}! Your message has been sent successfully.</p>
                `;
                confirmationMessage.classList.add('success');

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('Error:', error);
                confirmationMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Sorry, there was an error sending your message. Please try again.</p>
                `;
                confirmationMessage.classList.add('error');
            }

            // Add confirmation message to the form
            const existingMessage = contactForm.querySelector('.confirmation-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            contactForm.insertBefore(confirmationMessage, submitBtn);

            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = 'Send Message';
                submitBtn.disabled = false;
                
                // Fade out confirmation message
                confirmationMessage.style.opacity = '0';
                setTimeout(() => confirmationMessage.remove(), 500);
            }, 3000);
        });
    }

    // Add intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    // Observe all service cards
    document.querySelectorAll('.service-card').forEach((card) => {
        observer.observe(card);
    });
}); 