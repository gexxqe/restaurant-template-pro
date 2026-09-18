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

  const menu = [
    ['Formules','Menu du marché','Entrée + plat ou plat + dessert, selon les produits du jour.',24,false],
    ['Entrées','Œuf parfait, crème de champignons','Champignons de saison, noisettes torréfiées et herbes fraîches.',10,true],
    ['Entrées','Tartare de poisson aux agrumes','Poisson frais, agrumes, huile d’olive et jeunes pousses.',12,false],
    ['Plats','Volaille fermière rôtie','Jus réduit, légumes de saison et pommes grenailles.',23,false],
    ['Plats','Poisson du jour','Cuisson nacrée, beurre citronné et légumes du marché.',25,false],
    ['Végétarien','Risotto crémeux de saison','Riz arborio, légumes rôtis, parmesan et herbes.',20,true],
    ['Desserts','Fondant au chocolat','Cœur coulant, crème légère et éclats de noisette.',9,true],
    ['Desserts','Tarte fine aux fruits','Fruits de saison, crème d’amande et sorbet maison.',9,true],
    ['Boissons','Verre de vin sélection du moment','Demandez conseil à notre équipe.',6,true]
  ];
  let selected = 'Tout';
  const cats = ['Tout', ...new Set(menu.map(item => item[0]))];
  const money = new Intl.NumberFormat(r.locale, {style:'currency', currency:r.currency});
  function drawFilters(){filters.innerHTML=cats.map(c=>`<button class="filter ${c===selected?'active':''}" data-cat="${c}">${c}</button>`).join('');filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=b.dataset.cat;drawFilters();drawMenu();});}
  function drawMenu(){const rows=selected==='Tout'?menu:menu.filter(x=>x[0]===selected);menuGrid.innerHTML=rows.map(x=>`<article class="dish"><div><h3>${x[1]}</h3><p>${x[2]}</p>${x[4]?'<span class="tag">🌿 Végétarien</span>':''}</div><div class="dish-price">${money.format(x[3])}</div></article>`).join('');}
  const schedule = [
    {day:'Lundi',slots:[[720,840],[1140,1320]]},{day:'Mardi',slots:[[720,840],[1140,1320]]},
    {day:'Mercredi',slots:[]},{day:'Jeudi',slots:[[720,840],[1140,1320]]},
    {day:'Vendredi',slots:[[720,840],[1140,1350]]},{day:'Samedi',slots:[[720,870],[1140,1380]]},
    {day:'Dimanche',slots:[[720,900]]}
  ];
  const fmt = m => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  hours.innerHTML=schedule.map(x=>`<div class="hour"><strong>${x.day}</strong><span>${x.slots.length?x.slots.map(s=>`${fmt(s[0])}–${fmt(s[1])}`).join(' • '):'Fermé'}</span></div>`).join('');
  function updateStatus(){const d=new Date(),entry=schedule[(d.getDay()+6)%7],now=d.getHours()*60+d.getMinutes(),active=entry.slots.find(s=>now>=s[0]&&now<s[1]),next=entry.slots.find(s=>now<s[0]);statusTitle.textContent=active?'Ouvert maintenant':'Fermé';statusDetail.textContent=active?`Service jusqu’à ${fmt(active[1])}`:next?`Ouvre à ${fmt(next[0])}`:entry.slots.length?'Fermé pour aujourd’hui':"Fermé aujourd’hui";statusDot.style.background=active?'var(--ok)':'#b64b42';}
  async function submitReservation(event){event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type="submit"]'),payload=Object.fromEntries(new FormData(form));button.disabled=true;success.style.display='block';try{if(cfg.supabase?.enabled){if(!cfg.supabase.url||!cfg.supabase.publishableKey)throw new Error('Configuration Supabase incomplète');const response=await fetch(`${cfg.supabase.url}/rest/v1/reservations`,{method:'POST',headers:{apikey:cfg.supabase.publishableKey,Authorization:`Bearer ${cfg.supabase.publishableKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({customer_name:payload.name,phone:payload.phone,reservation_date:payload.date,reservation_time:payload.time,guest_count:Number(payload.guests),message:payload.message||null,status:'pending'})});if(!response.ok)throw new Error('La réservation n’a pas pu être envoyée.');success.textContent='✅ Votre demande de réservation a bien été envoyée.';}else{const list=JSON.parse(localStorage.getItem('restaurant_demo_reservations')||'[]');list.unshift({...payload,createdAt:new Date().toISOString()});localStorage.setItem('restaurant_demo_reservations',JSON.stringify(list));success.textContent='✅ Démonstration : la demande a été enregistrée uniquement sur cet appareil.';}form.reset();}catch(e){success.style.background='#fff0ee';success.style.color='#a33e38';success.textContent=`❌ ${e.message}`}finally{button.disabled=false;}}
  reservationForm.addEventListener('submit',submitReservation);
  document.querySelector('input[type="date"]').min=new Date().toISOString().slice(0,10);
  year.textContent=new Date().getFullYear(); demoBadge.hidden=!!cfg.supabase?.enabled;
  drawFilters();drawMenu();updateStatus();
})();
