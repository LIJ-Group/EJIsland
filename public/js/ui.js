export function initUI() {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
            this.classList.toggle('active');
        });
    }

    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 40;
                    const mainContent = document.querySelector('.main-content');
                    
                    if (mainContent) {
                        mainContent.style.transition = 'all 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
                        mainContent.style.transform = 'scale(0.94)';
                        mainContent.style.opacity = '0.85';
                        mainContent.style.filter = 'blur(1px)';
                        
                        setTimeout(() => {
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'auto'
                            });
                            
                            requestAnimationFrame(() => {
                                mainContent.style.transform = 'scale(1)';
                                mainContent.style.opacity = '1';
                                mainContent.style.filter = 'blur(0px)';
                                
                                setTimeout(() => {
                                    mainContent.style.transition = '';
                                }, 600);
                            });
                        }, 180);
                    }
                }
            }
        });
    });

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.querySelector('.main-content');
            
            if (mainContent) {
                mainContent.style.transition = 'all 0.45s cubic-bezier(0.32, 0.72, 0, 1)';
                mainContent.style.transform = 'scale(0.96)';
                mainContent.style.opacity = '0.8';
                mainContent.style.filter = 'blur(1.2px)';
                
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'auto'
                    });
                    
                    requestAnimationFrame(() => {
                        mainContent.style.transform = 'scale(1)';
                        mainContent.style.opacity = '1';
                        mainContent.style.filter = 'blur(0px)';
                        
                        setTimeout(() => {
                            mainContent.style.transition = '';
                        }, 550);
                    });
                }, 160);
            }
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    if (navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }
}
