/**
 * ICHIHIRO Website - Main JavaScript
 * @description メインのJavaScriptファイル - インタラクションとアニメーション制御
 */

// ========================================
// DOM要素の取得
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // モバイルメニューのトグル
    // ========================================
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // メニュートグルボタンのクリックイベント
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // ナビゲーションリンクをクリックしたらメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // ========================================
    // スムーススクロール
    // ========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // ヘッダーの高さ分のオフセット
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // スクロールアニメーション（Intersection Observer）
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 一度表示したら監視を解除（パフォーマンス向上）
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // fade-inクラスを持つ要素を監視
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // ========================================
    // ヘッダーのスクロール効果
    // ========================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    let scrollTimer = null;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // スクロール時の影の調整
        if (scrollTop > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }

        // ヘッダーの表示/非表示（オプション）
        // if (scrollTop > lastScrollTop && scrollTop > 300) {
        //     // 下にスクロール - ヘッダーを隠す
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     // 上にスクロール - ヘッダーを表示
        //     header.style.transform = 'translateY(0)';
        // }
        
        lastScrollTop = scrollTop;
    }

    // スクロールイベントの最適化（throttle）
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function() {
            handleScroll();
        }, 10);
    });

    // ========================================
    // 画像の遅延読み込み（Lazy Loading）
    // ========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }

    // ========================================
    // ページローダー（オプション）
    // ========================================
    window.addEventListener('load', function() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 500);
        }
    });

    // ========================================
    // フォームバリデーション（将来の実装用）
    // ========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            
            // バリデーション
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // フォーム送信処理
                console.log('Form submitted successfully');
                // 実際の送信処理をここに実装
            } else {
                console.log('Please fill in all required fields');
            }
        });
    }

    // ========================================
    // ユーティリティ関数
    // ========================================
    
    // デバウンス関数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // スロットル関数
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ========================================
    // ウィンドウリサイズ時の処理
    // ========================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // リサイズ完了後の処理
            if (window.innerWidth > 768) {
                // デスクトップビュー
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }, 250);
    });

    // ========================================
    // 外部クリックでメニューを閉じる
    // ========================================
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // ========================================
    // アクセシビリティ: Escキーでメニューを閉じる
    // ========================================
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // ========================================
    // パフォーマンス監視（開発用）
    // ========================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('ICHIHIRO Website loaded successfully');
        console.log('Performance:', performance.now().toFixed(2) + 'ms');
    }

});