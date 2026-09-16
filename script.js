'use strict';

const API_BASE = (document.querySelector('meta[name="api-base"]')?.content || '').replace(/\/$/, '');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const plans = {
    home: [
        { value: 'basic', name: 'Everyday home', tag: 'THE EVERYDAY ESSENTIALS', description: 'For browsing, email, video calls and everyday use.', features: ['Discuss your internet options', 'Router setup guidance', 'A quote for your location'] },
        { value: 'pro', name: 'Connected household', tag: 'ROOM FOR MORE CONNECTIONS', description: 'For households using several devices for work, study and streaming.', features: ['Plan around your household', 'Discuss streaming and work needs', 'Explore Wi-Fi coverage options'] },
        { value: 'enterprise', name: 'Whole-home Wi-Fi', tag: 'THINK BEYOND ONE ROOM', description: 'For improving Wi-Fi coverage across rooms or floors.', features: ['Explore linked Wi-Fi units (mesh)', 'Review your space and layout', 'Equipment quoted for your needs'] }
    ],
    business: [
        { value: 'basic', name: 'Small business', tag: 'YOUR NEXT CHAPTER', description: 'For small offices, shops and independent businesses.', features: ['Discuss business internet access', 'Plan your office Wi-Fi', 'A quote for your premises'] },
        { value: 'pro', name: 'Growing team', tag: 'MAKE ROOM FOR YOUR TEAM', description: 'For teams that need to connect more people and devices.', features: ['Review your team’s requirements', 'Discuss guest network options', 'Explore equipment and installation'] },
        { value: 'enterprise', name: 'Business tailored', tag: 'LET’S TALK ABOUT THE DETAILS', description: 'For workspaces with specific network and connectivity requirements.', features: ['Discuss your site requirements', 'Explore network design options', 'Request a tailored scope and quote'] }
    ]
};
let audience = 'home';
let quoteAudience = 'home';
const planGrid = document.getElementById('plan-grid');
const quoteDialog = document.getElementById('quote-dialog');
const quoteForm = document.getElementById('contract-form');

function renderPlans(nextAudience) {
    audience = nextAudience;
    document.querySelectorAll('[data-audience]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.audience === audience)));
    planGrid.replaceChildren();
    plans[audience].forEach((plan, index) => {
        const article = document.createElement('article');
        article.className = `plan-card${index === 1 ? ' featured' : ''}`;
        // This template contains only the static catalogue defined above.
        article.innerHTML = `<span class="plan-tag">${plan.tag}</span><h3>${plan.name}</h3><p>${plan.description}</p><div class="plan-price">Request pricing<small>Get costs for your location and needs</small></div><ul>${plan.features.map(feature => `<li>${feature}</li>`).join('')}</ul><button class="button" type="button">Request a quote <span aria-hidden="true">↗</span></button>`;
        article.querySelector('button').addEventListener('click', () => openQuote(plan.value));
        planGrid.append(article);
    });
}
function openQuote(value) {
    quoteAudience = audience;
    quoteForm.elements.plan.replaceChildren(...plans[quoteAudience].map(plan => new Option(plan.name, plan.value)));
    quoteForm.elements.plan.value = value;
    document.getElementById('quote-description').textContent = `For ${quoteAudience === 'home' ? 'your home' : 'your business'}: availability, pricing and installation are confirmed in your quote.`;
    document.getElementById('contract-message').textContent = needsHostedApi ? 'Online enquiries are not available on this preview yet.' : '';
    quoteDialog.showModal();
}
document.querySelectorAll('[data-audience]').forEach(button => button.addEventListener('click', () => renderPlans(button.dataset.audience)));
document.querySelectorAll('[data-audience-link]').forEach(link => link.addEventListener('click', () => renderPlans(link.dataset.audienceLink)));
document.querySelector('.close-dialog').addEventListener('click', () => quoteDialog.close());
quoteDialog.addEventListener('click', event => {
    if (event.target !== quoteDialog) return;
    const rect = quoteDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) quoteDialog.close();
});
renderPlans('home');

// Keep navigation usable without a hover interaction on smaller screens.
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');
function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('is-open', !isOpen);
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
    }
});

const contactForm = document.getElementById('contact-form');
function prepareEnquiry(message) {
    const context = document.getElementById('enquiry-context');
    context.hidden = false;
    context.textContent = 'Your request is ready below. Add your name and email, then select Send enquiry.';
    const field = contactForm.elements.message;
    if (!field.value.includes(message)) field.value = message + (field.value ? '\n\n' + field.value : '');
    document.getElementById('contact').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    contactForm.elements.name.focus({ preventScroll: true });
}
document.getElementById('coverage-form').addEventListener('submit', event => {
    event.preventDefault();
    const areaInput = event.currentTarget.elements.area;
    const area = areaInput.value.trim();
    if (!area) {
        areaInput.setCustomValidity('Please enter your suburb or town.');
        areaInput.reportValidity();
        return;
    }
    prepareEnquiry(`Please review internet and Wi-Fi availability in ${area}.`);
    document.getElementById('enquiry-context').textContent = `Step 2 of 2: coverage enquiry for ${area}. Add your name and email, then send your enquiry.`;
});
document.getElementById('coverage-area').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelectorAll('[data-enquiry]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    prepareEnquiry(link.dataset.enquiry);
}));

// App interactions are local demonstration state only, never router controls.
const devices = [{ name: 'Living room TV', detail: 'Living room · Wi-Fi', paused: false }, { name: 'Work laptop', detail: 'Study · Wi-Fi', paused: false }, { name: 'Mobile phone', detail: 'Bedroom · Wi-Fi', paused: false }];
const appScreen = document.getElementById('app-screen');
function renderApp(screen) {
    document.querySelectorAll('[data-screen]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.screen === screen)));
    if (screen === 'overview') {
        appScreen.innerHTML = '<div class="connection-preview"><span><i class="tiny-dot"></i> Sample connection</span><strong>Home, connected.</strong><p>A preview of your connection overview.</p></div><div class="demo-stat-row"><div><strong>3</strong>Example devices</div><div><strong>Wi-Fi</strong>Your home network</div></div>';
    } else if (screen === 'devices') {
        appScreen.replaceChildren();
        devices.forEach(device => {
            const row = document.createElement('div');
            row.className = 'device-row';
            row.innerHTML = `<div>${device.name}<small>${device.paused ? 'Paused in preview' : device.detail}</small></div>`;
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.textContent = device.paused ? 'Resume' : 'Pause';
            toggle.setAttribute('aria-label', `${device.paused ? 'Resume' : 'Pause'} ${device.name} in preview`);
            toggle.addEventListener('click', () => {
                device.paused = !device.paused;
                toggle.textContent = device.paused ? 'Resume' : 'Pause';
                toggle.setAttribute('aria-label', `${device.paused ? 'Resume' : 'Pause'} ${device.name} in preview`);
                row.querySelector('small').textContent = device.paused ? 'Paused in preview' : device.detail;
            });
            row.append(toggle);
            appScreen.append(row);
        });
        const note = document.createElement('p');
        note.className = 'device-note';
        note.textContent = 'Try pausing a sample device. This does not affect a real network.';
        appScreen.append(note);
    } else {
        appScreen.innerHTML = '<div class="demo-help"><h4>A little help, right here.</h4><p>The app concept brings connection advice and a way to ask for help into one place.</p><a href="#support">Read Wi-Fi questions →</a><a href="#contact" id="demo-contact">Ask about the app →</a></div>';
        document.getElementById('demo-contact').addEventListener('click', event => {
            event.preventDefault();
            prepareEnquiry('I would like to know more about the My Imbali app concept.');
        });
    }
}
document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => renderApp(button.dataset.screen)));
renderApp('overview');

async function submitEnquiry(event, endpoint, statusId) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    const status = document.getElementById(statusId);
    const payload = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(payload)) payload[key] = payload[key].trim();
    if (Object.entries(payload).some(([key, value]) => !value && !(endpoint === 'contracts' && key === 'message'))) {
        status.dataset.state = 'error';
        status.textContent = 'Please complete the required fields before sending.';
        return;
    }
    if (endpoint === 'contracts') {
        const plan = plans[quoteAudience].find(item => item.value === payload.plan);
        payload.message = `Connection enquiry: ${quoteAudience} / ${plan.name}.\n${payload.message}`;
    }
    if (payload.message.length > 5000) {
        status.dataset.state = 'error';
        status.textContent = 'Please shorten your message slightly and try again.';
        return;
    }
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = 'Sending your enquiry…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetch(`${API_BASE}/api/${endpoint}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(response.status === 503 ? 'Enquiries are temporarily unavailable. Your details are still here; please try again later.' : result.error || 'Your enquiry could not be sent. Please try again.');
        status.dataset.state = 'success';
        status.textContent = 'Thank you. Your enquiry has been received by Imbali Telecoms.';
        form.reset();
        if (form === contactForm) document.getElementById('enquiry-context').hidden = true;
    } catch (error) {
        status.dataset.state = 'error';
        status.textContent = error.name === 'AbortError' ? 'The request timed out. We could not confirm delivery; please check before resubmitting.' : error instanceof TypeError ? 'Unable to reach the server. Your details are still here; please try again.' : error.message;
    } finally {
        clearTimeout(timeout);
        button.disabled = false;
        form.removeAttribute('aria-busy');
    }
}
contactForm.addEventListener('submit', event => submitEnquiry(event, 'contact', 'form-message'));
quoteForm.addEventListener('submit', event => submitEnquiry(event, 'contracts', 'contract-message'));

// GitHub Pages hosts the preview; the enquiry API must run on its own server.
const needsHostedApi = location.hostname.endsWith('.github.io') && !API_BASE;
if (needsHostedApi) {
    for (const [form, statusId] of [[contactForm, 'form-message'], [quoteForm, 'contract-message']]) {
        form.querySelector('button[type="submit"]').disabled = true;
        const status = document.getElementById(statusId);
        status.textContent = 'Online enquiries are not available on this preview yet.';
        status.dataset.state = 'unavailable';
    }
}


// Keep mobile shortcuts out of the way while the destination or a form is visible.
const mobileActions = document.querySelector('.mobile-actions');
if ('IntersectionObserver' in window) {
    const visibleSections = new Set();
    const shortcutObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) visibleSections.add(entry.target.id);
            else visibleSections.delete(entry.target.id);
        });
        mobileActions.hidden = visibleSections.size > 0;
    }, { threshold: 0 });
    ['coverage', 'contact'].forEach(id => shortcutObserver.observe(document.getElementById(id)));
}
