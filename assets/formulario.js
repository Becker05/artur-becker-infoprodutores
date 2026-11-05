(() => {
  // Cole a URL /exec da implantação do Apps Script.
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzJpOoabN_9b_rcA1imWBtjGK_YCvhpytoGLMEZVOVmL-7PKVsPV_WfKeEtjB_dvKc06A/exec';
  const THANK_YOU_URL = './obrigado.html';
  const form = document.getElementById('diagnostico-form');
  const status = document.getElementById('form-status');
  const button = form.querySelector('button');
  let started = false;
  let pending = null;
  let timer;
  let completed = false;
  const track = event => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event, form_id:'diagnostico_infoprodutores'});
  };
  form.addEventListener('change', () => {
    const boxes = [...form.querySelectorAll('[name="situacoes"]')];
    boxes[0].setCustomValidity(boxes.some(b=>b.checked)?'':'Selecione pelo menos uma situação.');
    if (!started) {started=true;track('diagnostico_form_start');}
  });
  const normalizeName = value => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z\s]/g,'').replace(/\s+/g,' ').trim();
  const normalizePhone = value => {
    const digits = value.replace(/\D/g,'');
    if(value.trim().startsWith('+') && /^[1-9]\d{7,14}$/.test(digits)) return digits;
    // Números locais brasileiros precisam incluir DDD.
    if(/^[1-9]\d{9,10}$/.test(digits)) return '55'+digits;
    if(/^55[1-9]\d{9,10}$/.test(digits)) return digits;
    return '';
  };
  const completeLead = lead => {
    let navigated = false;
    const navigate = () => {
      if(navigated) return;
      navigated = true;
      // Limpa os dados de correspondência antes de sair da página.
      window.dataLayer.push({meta_user_data:null,lead_data:null});
      window.location.assign(new URL(THANK_YOU_URL, window.location.href).href);
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'generate_lead',form_id:'diagnostico_infoprodutores',event_id:lead.request_id});
    navigate();
  };
  const finish = (message, success) => {
    clearTimeout(timer);
    status.textContent = message;
    button.disabled = false;
    if (success) {
      completed = true;
      button.disabled = true;
      const lead = pending;
      form.reset();
      started = false;
      pending = null;
      completeLead(lead);
    }
  };
  // A confirmação contém apenas um identificador aleatório e o estado da gravação.
  window.diagnosticoAck = result => {
    if (completed || !pending || result.id !== pending.request_id) return;
    if (result.saved) finish('Solicitação recebida! Vou analisar suas informações e entrar em contato com os perfis selecionados.', true);
  };
  async function checkSaved(deadline) {
    if (!pending || !button.disabled) return;
    if (Date.now()>deadline) {
      finish('Não foi possível confirmar o recebimento. Aguarde um momento e tente novamente; manteremos o mesmo identificador para evitar duplicidade.', false);
      return;
    }
    const script = document.createElement('script');
    script.src = ENDPOINT+'?form_id=diagnostico_infoprodutores&action=status&id='+encodeURIComponent(pending.request_id)+'&_='+Date.now();
    script.onload = script.onerror = () => script.remove();
    document.head.appendChild(script);
    timer = setTimeout(()=>checkSaved(deadline),2500);
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if(completed || button.disabled) return;
    const boxes = [...form.querySelectorAll('[name="situacoes"]')];
    boxes[0].setCustomValidity(boxes.some(b=>b.checked)?'':'Selecione pelo menos uma situação.');
    if(!form.reportValidity()) return;
    if (!ENDPOINT) {status.textContent='O formulário ainda está em configuração. O envio será liberado após conectar a planilha.';return;}
    const fd = new FormData(form);
    if(fd.get('website_check')) return;
    // Em caso de resposta incerta, uma nova tentativa reutiliza o mesmo envio.
    if (!pending) {
      const query = new URLSearchParams(location.search);
      pending = {
        request_id:crypto.randomUUID(),form_id:'diagnostico_infoprodutores',modelo:fd.get('modelo'),
        nome:fd.get('nome').trim(),email:fd.get('email').trim(),telefone:fd.get('telefone').trim(),
        investimento:fd.get('investimento'),situacoes:JSON.stringify(fd.getAll('situacoes')),
        website_check:'',page:location.origin+location.pathname,
        ...Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>[k,(query.get(k)||'').slice(0,500)]))
      };
    }
    button.disabled=true;
    status.textContent='Enviando sua solicitação…';
    try {
      // no-cors não confirma a gravação. Apenas a consulta de status libera o sucesso.
      await fetch(ENDPOINT,{method:'POST',mode:'no-cors',body:new URLSearchParams(pending),credentials:'omit'});
    } catch (_) { /* A consulta verifica se o servidor recebeu apesar da falha de rede. */ }
    checkSaved(Date.now()+45000);
  });
})();
