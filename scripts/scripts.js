const nav = document.getElementById('main-nav');
        const navToggle = document.querySelector('.nav-toggle');
        const bars = document.querySelectorAll('.bar');

        /* Helper: ¿estamos en móvil? */
        const isMobile = () => window.innerWidth <= 768;

        /* ========== 1. Toggle del menú hamburguesa (solo en móvil) =========== */
        function toggleHamburger(e) {
          e.preventDefault();
          e.stopPropagation();
          
          if (isMobile()) {
            // Toggle las clases
            nav.classList.toggle('open');
            bars.forEach(bar => bar.classList.toggle('x'));
            
            // Accesibilidad
            const isOpen = nav.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
          }
        }

        navToggle.addEventListener('click', toggleHamburger);

        /* ========== 2. Abrir/cerrar cada sub‑menú por CLICK (desktop + móvil) */
        nav.querySelectorAll('.nav-item').forEach(item => {
          item.addEventListener('click', e => {
            e.stopPropagation();

            // Toggle propio
            const nowOpen = item.classList.toggle('open');

            // Cierra el resto de sub‑menús (comportamiento acordeón)
            if (nowOpen) {
              nav.querySelectorAll('.nav-item.open').forEach(el => {
                if (el !== item) el.classList.remove('open');
              });
            }
          });
        });

        /* ========== 3. Cierra todo al hacer clic fuera de la barra =========== */
        document.addEventListener('click', e => {
          if (!nav.contains(e.target)) {
            // Cerrar menú principal (móvil)
            nav.classList.remove('open');
            bars.forEach(bar => bar.classList.remove('x'));
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
            
            // Cerrar sub‑menús
            nav.querySelectorAll('.nav-item.open')
               .forEach(el => el.classList.remove('open'));
          }
        });

        /* ========== 4. Recoloca sub‑menús al cambiar tamaño ================== */
        window.addEventListener('resize', () => {
          if (!isMobile()) {
            nav.classList.remove('open');
            bars.forEach(bar => bar.classList.remove('x'));
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
          }
        });


        /*============================================
        ====== JS DEL CARROSEL =======================
        ============================================== */
class ScrollComponent {
            constructor() {
                this.currentSlide = 0;
                this.currentMobileBg = 0;
                this.totalSlides = 4;
                this.mobileInterval = null;
                
                this.init();
            }

            init() {
                this.setupDesktopScroll();
                this.setupMobileBackground();
                this.handleResize();
                
                // Escuchar cambios de tamaño de ventana
                window.addEventListener('resize', () => this.handleResize());
            }

            setupDesktopScroll() {
                const buttons = document.querySelectorAll('.botonScroll');
                const scrollWrapper = document.getElementById('scrollWrapper');

                buttons.forEach((button, index) => {
                    button.addEventListener('click', () => {
                        this.goToSlide(index);
                    });
                });
            }

            goToSlide(slideIndex) {
                if (slideIndex < 0 || slideIndex >= this.totalSlides) return;

                const scrollWrapper = document.getElementById('scrollWrapper');
                const buttons = document.querySelectorAll('.botonScroll');
                
                // Actualizar posición del scroll
                const translateX = -slideIndex * 25; // 25% por cada slide
                scrollWrapper.style.transform = `translateX(${translateX}%)`;
                
                // Actualizar botones activos
                buttons.forEach((btn, index) => {
                    btn.classList.toggle('active', index === slideIndex);
                });
                
                this.currentSlide = slideIndex;
            }

            setupMobileBackground() {
                if (window.innerWidth <= 767) {
                    this.startMobileSlideshow();
                }
            }

            startMobileSlideshow() {
                if (this.mobileInterval) {
                    clearInterval(this.mobileInterval);
                }

                this.mobileInterval = setInterval(() => {
                    this.changeMobileBackground();
                }, 5000);
            }

            stopMobileSlideshow() {
                if (this.mobileInterval) {
                    clearInterval(this.mobileInterval);
                    this.mobileInterval = null;
                }
            }

            changeMobileBackground() {
                const currentBg = document.getElementById(`mobileBg${this.currentMobileBg + 1}`);
                const nextIndex = (this.currentMobileBg + 1) % this.totalSlides;
                const nextBg = document.getElementById(`mobileBg${nextIndex + 1}`);

                // Fade out current, fade in next
                currentBg.style.opacity = '0';
                nextBg.style.opacity = '1';

                this.currentMobileBg = nextIndex;
            }

            handleResize() {
                if (window.innerWidth <= 767) {
                    // Modo móvil
                    this.startMobileSlideshow();
                } else {
                    // Modo desktop
                    this.stopMobileSlideshow();
                    // Resetear opacidades de fondos móviles
                    for (let i = 1; i <= this.totalSlides; i++) {
                        const bg = document.getElementById(`mobileBg${i}`);
                        bg.style.opacity = i === 1 ? '1' : '0';
                    }
                    this.currentMobileBg = 0;
                }
            }
        }

        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            new ScrollComponent();
        });
