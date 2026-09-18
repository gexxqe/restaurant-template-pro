(() => {
  const cfg = window.RESTAURANT_CONFIG;
  if (!cfg) throw new Error('RESTAURANT_CONFIG est manquant.');
  let restaurant = {...cfg.restaurant};
  let menu = [...(cfg.menu || [])];
  let schedule = [];
  let selected = 'Tout';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const setText = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  const toMinutes = value => { const [h,m] = String(value).slice(0,5).split(':').map(Number); return h*60+m; };
  const fmt = minutes => `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
  const money = value => new Intl.NumberFormat(restaurant.locale, {style:'currency',currency:restaurant.currency}).format(Number(value));

  function applyRestaurant(){
    setText('[data-name]',restaurant.name);setText('[data-short-name]',restaurant.shortName);setText('[data-tagline]',restaurant.tagline);
    setText('[data-description]',restaurant.description);setText('[data-phone]',restaurant.phoneDisplay);setText('[data-address]',restaurant.address);
    setText('[data-city]',restaurant.city);setText('[data-email]',restaurant.email);setText('[data-rating]',restaurant.rating);
    document.querySelectorAll('[data-phone-link]').forEach(el=>{el.href=`tel:${restaurant.phoneHref}`;});
    document.querySelectorAll('[data-email-link]').forEach(el=>{el.href=`mailto:${restaurant.email}`;});
    document.querySelectorAll('[data-maps-link]').forEach(el=>{el.href=restaurant.mapsUrl;});
    const logoUrl=cfg.branding?.logoDataUrl||cfg.branding?.logoUrl||'';
    const logo=document.getElementById('brandLogo'),logoImage=document.getElementById('brandLogoImage'),logoFallback=document.getElementById('brandLogoFallback');
    if(logo&&logoImage&&logoFallback){
      if(logoUrl){logoImage.src=logoUrl;logoImage.alt='Logo '+restaurant.name;logoImage.hidden=false;logoFallback.hidden=true;logo.classList.add('has-image');}
      else{logoImage.removeAttribute('src');logoImage.hidden=true;logoFallback.hidden=false;logo.classList.remove('has-image');}
    }
    document.title=`${restaurant.name} — Restaurant`;
  }
  function applyBranding(){
    const branding=cfg.branding||{};
    const heroImage=branding.heroImageDataUrl||branding.heroImageUrl||'';
    const heroCard=document.querySelector('.hero-card');
    if(heroCard){
      if(heroImage){
        heroCard.classList.add('has-photo');
        heroCard.style.backgroundImage=`linear-gradient(90deg,rgba(8,27,19,.78),rgba(8,27,19,.35)),url("${heroImage}")`;
        heroCard.style.backgroundSize='cover';
        heroCard.style.backgroundPosition='center';
        heroCard.style.backgroundRepeat='no-repeat';
      }else{
        heroCard.classList.remove('has-photo');
        heroCard.style.backgroundImage='';
        heroCard.style.backgroundSize='';
        heroCard.style.backgroundPosition='';
        heroCard.style.backgroundRepeat='';
      }
    }

    const favicon=branding.faviconDataUrl||branding.faviconUrl||branding.logoDataUrl||branding.logoUrl||'';
    const faviconLink=document.getElementById('dynamicFavicon');
    if(faviconLink&&favicon)faviconLink.href=favicon;

    const gallery=(branding.galleryImages||[]).filter(Boolean);
    const gallerySection=document.getElementById('galerie');
    const galleryGrid=document.getElementById('galleryGrid');
    if(gallerySection&&galleryGrid){
      if(gallery.length){
        galleryGrid.innerHTML=gallery.map((src,index)=>`<figure class="gallery-item"><img src="${esc(src)}" alt="Photo du restaurant ${index+1}" loading="lazy"></figure>`).join('');
        gallerySection.hidden=false;
      }else{
        galleryGrid.replaceChildren();
        gallerySection.hidden=true;
      }
    }
  }

  function drawFilters(){const cats=['Tout',...new Set(menu.map(item=>item.category))];if(!cats.includes(selected))selected='Tout';filters.innerHTML=cats.map(c=>`<button class="filter ${c===selected?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');filters.querySelectorAll('button').forEach(button=>button.onclick=()=>{selected=button.dataset.cat;drawFilters();drawMenu();});}
  function drawMenu(){const rows=selected==='Tout'?menu:menu.filter(item=>item.category===selected);menuGrid.innerHTML=rows.map(item=>`<article class="dish"><div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p>${item.vegetarian?'<span class="tag">🌿 Végétarien</span>':''}</div><div class="dish-price">${money(item.price)}</div></article>`).join('');}
  function drawHours(){hours.innerHTML=schedule.map(entry=>`<div class="hour"><strong>${esc(entry.day)}</strong><span>${entry.slots.length?entry.slots.map(slot=>`${fmt(slot[0])}–${fmt(slot[1])}`).join(' • '):'Fermé'}</span></div>`).join('');}
  function updateStatus(){const entry=schedule[(new Date().getDay()+6)%7];if(!entry){statusTitle.textContent='Horaires indisponibles';statusDetail.textContent='Appelez le restaurant';return}const now=new Date().getHours()*60+new Date().getMinutes(),active=entry.slots.find(s=>now>=s[0]&&now<s[1]),next=entry.slots.find(s=>now<s[0]);statusTitle.textContent=active?'Ouvert maintenant':'Fermé';statusDetail.textContent=active?`Service jusqu’à ${fmt(active[1])}`:next?`Ouvre à ${fmt(next[0])}`:entry.slots.length?'Fermé pour aujourd’hui':"Fermé aujourd’hui";statusDot.style.background=active?'var(--ok)':'#b64b42';}
  async function rest(path,options={}){const response=await fetch(`${cfg.supabase.url}/rest/v1/${path}`,{...options,headers:{apikey:cfg.supabase.publishableKey,'Content-Type':'application/json',...(options.headers||{})}});if(!response.ok)throw new Error(await response.text());if(response.status===204)return null;return response.json();}
  async function loadPublicData(){
    schedule=(cfg.openingHours||[]).map(entry=>({day:entry.day,slots:entry.slots.map(slot=>slot.map(toMinutes))}));
    if(!cfg.supabase?.enabled)return;
    try{
      const [settings,items,opening]=await Promise.all([
        rest('restaurant_settings?select=*&id=eq.1'),
        rest('menu_items?select=*&is_available=eq.true&order=sort_order.asc,created_at.asc'),
        rest('opening_hours?select=*&order=day_index.asc')
      ]);
      if(settings[0]){const s=settings[0];restaurant={...restaurant,name:s.name,phoneDisplay:s.phone,phoneHref:String(s.phone||'').replace(/[^+\d]/g,''),address:s.address,city:s.city_postcode,email:s.email,tagline:s.tagline,description:s.description,rating:s.rating};heroTitle.textContent=s.hero_title||s.name;heroText.textContent=s.hero_text||s.tagline;specialEyebrow.textContent=s.daily_label||'';specialName.textContent=s.daily_title||'';specialDescription.textContent=s.daily_description||'';specialPrice.textContent=money(s.daily_price||0);if(s.daily_image_url){specialArt.classList.add('has-photo');specialArt.replaceChildren();specialArt.style.backgroundImage=`url("${s.daily_image_url}")`;specialArt.style.backgroundSize='cover';specialArt.style.backgroundPosition='center';specialArt.style.backgroundRepeat='no-repeat';specialArt.style.opacity='1'}else{specialArt.classList.remove('has-photo');specialArt.style.backgroundImage='';specialArt.style.backgroundSize='';specialArt.style.backgroundPosition='';specialArt.style.backgroundRepeat='';specialArt.style.opacity='1'}}
      if(items.length){menu=items.map(item=>({category:item.category,name:item.name,description:item.description,price:Number(item.price),vegetarian:item.is_vegetarian}));}
      if(opening.length){schedule=opening.map(entry=>({day:entry.day_name,slots:entry.is_closed?[]:[[entry.lunch_start,entry.lunch_end],[entry.dinner_start,entry.dinner_end]].filter(pair=>pair[0]&&pair[1]).map(pair=>pair.map(toMinutes))}));}
    }catch(error){console.warn('Supabase public data unavailable; using config fallback.',error);}
  }
  async function submitReservation(event){event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type="submit"]'),payload=Object.fromEntries(new FormData(form));button.disabled=true;success.style.display='block';success.style.background='rgba(47,138,87,.1)';success.style.color='#206b42';try{if(cfg.supabase?.enabled){await rest('reservations',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({customer_name:payload.name,phone:payload.phone,reservation_date:payload.date,reservation_time:payload.time,guest_count:Number(payload.guests),message:payload.message||null,status:'pending'})});success.textContent='✅ Votre demande de réservation a bien été envoyée.';}else{const list=JSON.parse(localStorage.getItem('restaurant_demo_reservations')||'[]');list.unshift({...payload,createdAt:new Date().toISOString()});localStorage.setItem('restaurant_demo_reservations',JSON.stringify(list));success.textContent='✅ Démonstration : demande enregistrée uniquement sur cet appareil.';}form.reset();}catch(error){success.style.background='#fff0ee';success.style.color='#a33e38';success.textContent='❌ La réservation n’a pas pu être envoyée. Merci de réessayer.';}finally{button.disabled=false;}}
  function initGalleryLightbox(){
    const box=document.getElementById('galleryLightbox'),img=document.getElementById('lightboxImage'),close=document.getElementById('lightboxClose'),prev=document.getElementById('lightboxPrev'),next=document.getElementById('lightboxNext');
    if(!box||!img)return;
    let current=0;
    const images=()=>[...document.querySelectorAll('#galleryGrid img')];
    const show=index=>{const list=images();if(!list.length)return;current=(index+list.length)%list.length;img.src=list[current].src;img.alt=list[current].alt||'Photo agrandie';box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';};
    const hide=()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';};
    galleryGrid.addEventListener('click',event=>{const target=event.target.closest('img');if(!target)return;const list=images();show(list.indexOf(target));});
    close.onclick=hide;prev.onclick=()=>show(current-1);next.onclick=()=>show(current+1);
    box.addEventListener('click',event=>{if(event.target===box)hide();});
    document.addEventListener('keydown',event=>{if(!box.classList.contains('open'))return;if(event.key==='Escape')hide();if(event.key==='ArrowLeft')show(current-1);if(event.key==='ArrowRight')show(current+1);});
  }

  function initRevealAnimations(){
    const targets=[...document.querySelectorAll('.section .shell, .quick, .status')].filter(el=>!el.closest('[hidden]'));
    targets.forEach(el=>el.classList.add('reveal'));
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    targets.forEach(el=>observer.observe(el));
  }

  async function init(){
    Object.entries(cfg.theme||{}).forEach(([key,value])=>document.documentElement.style.setProperty(`--${key}`,value));
    heroTitle.textContent=restaurant.name||'';heroText.textContent=restaurant.tagline||'';const special=cfg.dailySpecial||{};specialEyebrow.textContent=special.eyebrow||'';specialName.textContent=special.name||'';specialDescription.textContent=special.description||'';specialPrice.textContent=money(special.price||0);
    reviewsGrid.innerHTML=(cfg.reviews||[]).map(item=>`<article class="review"><div class="stars">★★★★★</div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p><strong>${esc(item.label)}</strong></article>`).join('');
    socialLinks.innerHTML=(cfg.socialLinks||[]).filter(item=>item.url&&item.url.trim()).map(item=>`<a class="social-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><span class="social-icon">${esc(item.icon||'↗')}</span>${esc(item.label)}</a>`).join('');
    if(!socialLinks.children.length)socialLinks.hidden=true;if(cfg.features?.showReviews===false)document.getElementById('avis').hidden=true;
    if(cfg.features?.showAdminLink===false){document.querySelectorAll('.admin-link').forEach(el=>el.hidden=true);const adminDemo=document.getElementById('adminDemo');if(adminDemo)adminDemo.hidden=true;}
    if(cfg.features?.showDemoBadge===false){const adminDemo=document.getElementById('adminDemo');if(adminDemo)adminDemo.hidden=true;}
    await loadPublicData();applyRestaurant();applyBranding();drawFilters();drawMenu();drawHours();updateStatus();
    initGalleryLightbox();
    initRevealAnimations();
    reservationForm.addEventListener('submit',submitReservation);document.querySelector('input[type="date"]').min=new Date().toISOString().slice(0,10);year.textContent=new Date().getFullYear();demoBadge.hidden=!!cfg.supabase?.enabled||cfg.features?.showDemoBadge===false;
  }
  init();
})();
