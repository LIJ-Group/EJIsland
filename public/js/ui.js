export function initUI() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    let isClicking = false;
    let clickTimeout = null;
    let lastScrollY = 0;
    let ticking = false;

    function updateActiveNav() {
        if (isClicking) return;
        
        const scrollPosition = window.scrollY + 200;
        let currentSection = null;
        let minDistance = Infinity;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const distance = Math.abs(scrollPosition - sectionTop);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentSection = section.getAttribute('id');
                }
            }
        }

        if (!currentSection && sections.length > 0) {
            const firstSection = sections[0];
            if (scrollPosition < firstSection.offsetTop) {
                currentSection = firstSection.getAttribute('id');
            } else {
                const lastSection = sections[sections.length - 1];
                if (scrollPosition >= lastSection.offsetTop) {
                    currentSection = lastSection.getAttribute('id');
                }
            }
        }

        for (let i = 0; i < navLinks.length; i++) {
            const link = navLinks[i];
            const linkHref = link.getAttribute('href');
            if (linkHref === '#' + currentSection) {
                if (!link.classList.contains('active')) {
                    link.classList.add('active');
                }
            } else {
                link.classList.remove('active');
            }
        }
    }

    function handleMenuClick(link, e) {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        
        if (!target) return;

        isClicking = true;
        if (clickTimeout) clearTimeout(clickTimeout);

        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('active');
        }
        link.classList.add('active');

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
                        isClicking = false;
                    }, 600);
                });
            }, 180);
        } else {
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            clickTimeout = setTimeout(() => {
                isClicking = false;
            }, 800);
        }

        const sidebar = document.querySelector('.sidebar');
        if (sidebar && window.innerWidth <= 1200) {
            sidebar.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('active');
                }
            }
            this.classList.toggle('active');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            if (menuToggle) menuToggle.classList.remove('active');
            this.classList.remove('active');
        });
    }

    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(e) {
            handleMenuClick(this, e);
        });
    }

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
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveNav();
}
