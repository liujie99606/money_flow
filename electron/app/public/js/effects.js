// 视觉效果管理工具
const EffectsManager = {
    // 初始化粒子效果
    initParticles() {
        // 创建粒子容器
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;
        
        // 清空现有粒子
        particlesContainer.innerHTML = '';
        
        // 创建新粒子
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机大小
            const size = Math.random() * 5 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // 随机位置
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // 随机透明度
            const opacity = Math.random() * 0.5 + 0.1;
            particle.style.opacity = opacity;
            
            // 随机动画延迟
            const delay = Math.random() * 10;
            particle.style.animationDelay = `${delay}s`;
            
            // 添加到容器
            particlesContainer.appendChild(particle);
        }
    },
    
    // 应用开始动画
    applyStartAnimations() {
        gsap.to('.earning-value', {
            scale: 1.1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
            onComplete: () => {
                gsap.to('.earning-value', {
                    scale: 1,
                    duration: 0.3
                });
            }
        });
    },
    
    // 应用结束动画
    applyStopAnimations() {
        gsap.to('.glass-panel', {
            y: 10,
            opacity: 0.8,
            duration: 0.3,
            onComplete: () => {
                gsap.to('.glass-panel', {
                    y: 0,
                    opacity: 1,
                    duration: 0.5
                });
            }
        });
    },
    
    // 撒金币动画
    dropCoins(count = 20) {
        const coinsContainer = document.getElementById('coins-container');
        if (!coinsContainer) return;
        
        // 清除旧的金币
        const oldCoins = document.querySelectorAll('.coin');
        if (oldCoins.length > 50) {
            oldCoins.forEach((coin, index) => {
                if (index < oldCoins.length - 50) {
                    coin.remove();
                }
            });
        }
        
        // 创建新金币
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const coin = document.createElement('div');
                coin.className = 'coin';
                
                // 随机位置
                const posX = Math.random() * 80 + 10;
                coin.style.left = `${posX}%`;
                coin.style.top = '-50px';
                
                // 随机旋转
                const rotation = Math.random() * 360;
                coin.style.transform = `rotate(${rotation}deg)`;
                
                // 添加到容器
                coinsContainer.appendChild(coin);
                
                // 动画
                gsap.to(coin, {
                    y: window.innerHeight + 100,
                    rotation: rotation + Math.random() * 360,
                    duration: 1 + Math.random() * 2,
                    ease: 'power1.in',
                    onComplete: () => {
                        // 动画完成后移除金币
                        setTimeout(() => {
                            coin.remove();
                        }, 1000);
                    }
                });
            }, i * 50);
        }
    },
    
    // 庆祝动画
    celebrateWithConfetti(size = 'small') {
        let particleCount = 50;
        let spread = 50;
        
        if (size === 'medium') {
            particleCount = 100;
            spread = 70;
        } else if (size === 'large') {
            particleCount = 200;
            spread = 100;
        }
        
        confetti({
            particleCount,
            spread,
            origin: { y: 0.6 }
        });
    },
    
    // 平滑数字更新动画
    animateNumberUpdate(countUpRef, newValue) {
        gsap.to(countUpRef, {
            duration: 0.5,
            value: newValue,
            ease: 'power1.out',
            onUpdate: () => {
                const formattedValue = countUpRef.value.toFixed(2);
                const displayElement = document.querySelector('.earning-value');
                if (displayElement) {
                    displayElement.textContent = '¥' + formattedValue;
                }
            }
        });
    }
}; 