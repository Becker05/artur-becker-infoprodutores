(() => {
  const config = window.SITE_CONFIG || {};
  const links = document.querySelectorAll('[data-contact]');
  window.dataLayer = window.dataLayer || [];
  links.forEach((link, index) => link.addEventListener('click', () => { window.dataLayer.push({ event: 'contact_click', contact_channel: 'formulario', cta_text: link.textContent.trim(), cta_index: index + 1, page_audience: 'infoprodutores' }); }));
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.section,.conversion,.signals,.hero-diagnostic,.mobile-first-cta').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
})();

(() => { const bar=document.getElementById('floating-cta');const buttons=[...document.querySelectorAll('[data-contact]')].filter(el=>!bar.contains(el));document.body.classList.add('with-floating-cta');let queued=false;function update(){queued=false;const formSection=document.getElementById('solicitar-diagnostico');const rForm=formSection.getBoundingClientRect();const formVisible=rForm.top<innerHeight&&rForm.bottom>0;const visible=formVisible||buttons.some(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height||r.top>=innerHeight||r.bottom<=0)return false;for(let n=el;n&&n.nodeType===1;n=n.parentElement){const s=getComputedStyle(n);if(s.visibility!=='visible'||s.display==='none'||Number(s.opacity)===0)return false;}return true;});bar.hidden=visible&&!bar.contains(document.activeElement);}function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);document.addEventListener('transitionend',schedule);bar.addEventListener('focusout',schedule);update();})();
