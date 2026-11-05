(() => {
  const config = window.SITE_CONFIG || {};
  const links = document.querySelectorAll('[data-contact]');
  if (/^\d{10,15}$/.test(config.whatsapp || '')) links.forEach(link => { link.href = 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(config.message || ''); });
  window.dataLayer = window.dataLayer || [];
  links.forEach((link, index) => link.addEventListener('click', () => { window.dataLayer.push({ event: 'contact_click', contact_channel: 'whatsapp', cta_text: link.textContent.trim(), cta_index: index + 1, page_audience: 'infoprodutores' }); }));
  if (/^GTM-[A-Z0-9]+$/i.test(config.gtmId || '')) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script'); script.async = true; script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(config.gtmId); document.head.appendChild(script);
  }
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.section,.conversion,.signals,.hero-diagnostic,.mobile-first-cta').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
})();

(() => { const bar=document.getElementById('floating-cta');const buttons=[...document.querySelectorAll('[data-contact]')].filter(el=>!bar.contains(el));document.body.classList.add('with-floating-cta');let queued=false;function update(){queued=false;const visible=buttons.some(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height||r.top>=innerHeight||r.bottom<=0)return false;for(let n=el;n&&n.nodeType===1;n=n.parentElement){const s=getComputedStyle(n);if(s.visibility!=='visible'||s.display==='none'||Number(s.opacity)===0)return false;}return true;});bar.hidden=visible&&!bar.contains(document.activeElement);}function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);document.addEventListener('transitionend',schedule);bar.addEventListener('focusout',schedule);update();})();
