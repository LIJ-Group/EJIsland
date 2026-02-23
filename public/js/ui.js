export function initUI() {
    const menuToggle = document.getElementById('menuToggle');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // 只对可见的菜单项进行操作
            if (link.offsetParent !== null) {
                // 检查是否已经有手动激活的菜单项
                const manuallyActivated = link.classList.contains('manually-activated');
                if (!manuallyActivated) {
                    link.classList.remove('active');
                    if (linkHref === '#' + current) {
                        link.classList.add('active');
                    }
                }
            }
        });
    }

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
                
                // 保存当前激活的菜单项
                const currentActive = targetId;
                
                // 移除所有激活状态和手动标记
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    l.classList.remove('manually-activated');
                });
                
                // 添加激活状态和手动标记
                this.classList.add('active');
                this.classList.add('manually-activated');
                
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

    if (navLinks.length > 0) {
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();
    }
}
