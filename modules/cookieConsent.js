/* ------------------------------------------------
   COOKIE CONSENT MODULE
   Simple, lightweight, GDPR-friendly banner.
   ------------------------------------------------ */

const CookieConsent = {
    init() {
        if (!localStorage.getItem('sat_cookie_consent')) {
            this.showBanner();
        }
    },

    showBanner() {
        // Create styles
        const style = document.createElement('style');
        style.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: rgba(20, 20, 20, 0.95);
                backdrop-filter: blur(10px);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                color: var(--text-secondary);
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
            }
            #cookie-banner.visible {
                transform: translateY(0);
            }
            #cookie-banner p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
                color: var(--text-secondary);
            }
            #cookie-banner a {
                color: var(--accent-warm);
                text-decoration: underline;
                cursor: pointer;
            }
            .cookie-buttons {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            .btn-cookie {
                padding: 0.8rem 1.5rem;
                border-radius: 50px;
                font-size: 0.9rem;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }
            .btn-accept {
                background: var(--accent-warm);
                color: #000;
                font-weight: 600;
            }
            .btn-decline {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.2);
                color: var(--text-muted);
            }
            .btn-decline:hover {
                border-color: var(--text-primary);
                color: var(--text-primary);
            }
            @media (min-width: 600px) {
                #cookie-banner {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 2rem;
                }
            }
        `;
        document.head.appendChild(style);

        // Create HTML
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <p>
                We use cookies to personalize ads and analyze our traffic. 
                By clicking "Accept", you consent to our use of cookies. 
                <a href="privacy.html">Learn more</a>.
            </p>
            <div class="cookie-buttons">
                <button class="btn-cookie btn-decline" id="btn-cookie-decline">Decline</button>
                <button class="btn-cookie btn-accept" id="btn-cookie-accept">Accept</button>
            </div>
        `;
        document.body.appendChild(banner);

        // Force reflow for animation
        setTimeout(() => banner.classList.add('visible'), 100);

        // Event Listeners
        document.getElementById('btn-cookie-accept').addEventListener('click', () => {
            localStorage.setItem('sat_cookie_consent', 'accepted');
            this.hideBanner(banner);
        });

        document.getElementById('btn-cookie-decline').addEventListener('click', () => {
            localStorage.setItem('sat_cookie_consent', 'declined');
            this.hideBanner(banner);
        });
    },

    hideBanner(banner) {
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 500);
    }
};

window.CookieConsent = CookieConsent;
