(() => {
  const cfg = window.RESTAURANT_CONFIG;
  if (!cfg) throw new Error('RESTAURANT_CONFIG est manquant.');
  const r = cfg.restaurant;
  const setText = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  setText('[data-name]', r.name); setText('[data-short-name]', r.shortName); setText('[data-tagline]', r.tagline);
  setText('[data-description]', r.description); setText('[data-phone]', r.phoneDisplay); setText('[data-address]', r.address);
  setText('[data-city]', r.city); setText('[data-email]', r.email); setText('[data-rating]', r.rating);
  document.querySelectorAll('[data-phone-link]').forEach(el => { el.href = `tel:${r.phoneHref}`; });
  document.querySelectorAll('[data-email-link]').forEach(el => { el.href = `mailto:${r.email}`; });
  document.querySelectorAll('[data-maps-link]').forEach(el => { el.href = r.mapsUrl; });
  document.title = `${r.name} — Restaurant`;
  Object.entries(cfg.theme || {}).forEach(([key, value]) => document.documentElement.style.setProperty(`--${key}`, value));

  const menu = cfg.menu || [];
  let selected = 'Tout';
  const cats = ['Tout', ...new Set(menu.map(item => item.category))];
  const money = new Intl.NumberFormat(r.locale, {style:'currency', currency:r.currency});
  function drawFilters(){filters.innerHTML=cats.map(c=>`<button class="filter ${c===selected?'active':''}" data-cat="${c}">${c}</button>`).join('');filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=b.dataset.cat;drawFilters();drawMenu();});}
  function drawMenu(){const rows=selected==='Tout'?menu:menu.filter(x=>x.category===selected);menuGrid.innerHTML=rows.map(x=>`<article class="dish"><div><h3>${x.name}</h3><p>${x.description}</p>${x.vegetarian?'<span class="tag">🌿 Végétarien</span>':''}</div><div class="dish-price">${money.format(x.price)}</div></article>`).join('');}
  const toMinutes = value => { const [h,m] = value.split(':').map(Number); return h*60+m; };
  const schedule = (cfg.openingHours || []).map(entry => ({day:entry.day,slots:entry.slots.map(slot=>slot.map(toMinutes))}));
  const fmt = m => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  hours.innerHTML=schedule.map(x=>`<div class="hour"><strong>${x.day}</strong><span>${x.slots.length?x.slots.map(s=>`${fmt(s[0])}–${fmt(s[1])}`).join(' • '):'Fermé'}</span></div>`).join('');
  function updateStatus(){const d=new Date(),entry=schedule[(d.getDay()+6)%7],now=d.getHours()*60+d.getMinutes(),active=entry.slots.find(s=>now>=s[0]&&now<s[1]),next=entry.slots.find(s=>now<s[0]);statusTitle.textContent=active?'Ouvert maintenant':'Fermé';statusDetail.textContent=active?`Service jusqu’à ${fmt(active[1])}`:next?`Ouvre à ${fmt(next[0])}`:entry.slots.length?'Fermé pour aujourd’hui':"Fermé aujourd’hui";statusDot.style.background=active?'var(--ok)':'#b64b42';}
  async function submitReservation(event){event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type="submit"]'),payload=Object.fromEntries(new FormData(form));button.disabled=true;success.style.display='block';try{if(cfg.supabase?.enabled){if(!cfg.supabase.url||!cfg.supabase.publishableKey)throw new Error('Configuration Supabase incomplète');const response=await fetch(`${cfg.supabase.url}/rest/v1/reservations`,{method:'POST',headers:{apikey:cfg.supabase.publishableKey,Authorization:`Bearer ${cfg.supabase.publishableKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({customer_name:payload.name,phone:payload.phone,reservation_date:payload.date,reservation_time:payload.time,guest_count:Number(payload.guests),message:payload.message||null,status:'pending'})});if(!response.ok)throw new Error('La réservation n’a pas pu être envoyée.');success.textContent='✅ Votre demande de réservation a bien été envoyée.';}else{const list=JSON.parse(localStorage.getItem('restaurant_demo_reservations')||'[]');list.unshift({...payload,createdAt:new Date().toISOString()});localStorage.setItem('restaurant_demo_reservations',JSON.stringify(list));success.textContent='✅ Démonstration : la demande a été enregistrée uniquement sur cet appareil.';}form.reset();}catch(e){success.style.background='#fff0ee';success.style.color='#a33e38';success.textContent=`❌ ${e.message}`}finally{button.disabled=false;}}
  const special=cfg.dailySpecial||{};specialEyebrow.textContent=special.eyebrow||'';specialName.textContent=special.name||'';specialDescription.textContent=special.description||'';specialPrice.textContent=money.format(Number(special.price||0));
  reviewsGrid.innerHTML=(cfg.reviews||[]).map(x=>`<article class="review"><div class="stars">★★★★★</div><h3>${x.title}</h3><p>${x.text}</p><strong>${x.label}</strong></article>`).join('');
  socialLinks.innerHTML=(cfg.socialLinks||[]).filter(x=>x.url&&x.url.trim()).map(x=>`<a class="social-link" href="${x.url}" target="_blank" rel="noopener noreferrer"><span class="social-icon">${x.icon||'↗'}</span>${x.label}</a>`).join('');
  if(!socialLinks.children.length)socialLinks.hidden=true;
  if(cfg.features?.showReviews===false)document.getElementById('avis').hidden=true;
  if(cfg.features?.showAdminLink===false)document.querySelector('.admin-link').hidden=true;
  reservationForm.addEventListener('submit',submitReservation);
  document.querySelector('input[type="date"]').min=new Date().toISOString().slice(0,10);
  year.textContent=new Date().getFullYear(); demoBadge.hidden=!!cfg.supabase?.enabled||cfg.features?.showDemoBadge===false;
  drawFilters();drawMenu();updateStatus();
})();
