(() => {
  const original = JSON.parse(JSON.stringify(window.RESTAURANT_CONFIG));
  let state = JSON.parse(JSON.stringify(original));
  const fields = [...document.querySelectorAll('[data-path]')];
  const socialFields = [...document.querySelectorAll('[data-social]')];
  const get = path => path.split('.').reduce((value, key) => value?.[key], state);
  const set = (path, value) => { const keys=path.split('.'); const last=keys.pop(); const target=keys.reduce((value,key)=>value[key],state); target[last]=value; };
  function fill(){fields.forEach(field=>{const value=get(field.dataset.path);if(field.type==='checkbox')field.checked=!!value;else field.value=value??'';});socialFields.forEach(field=>field.value=state.socialLinks?.[Number(field.dataset.social)]?.url||'');document.querySelectorAll('[data-social-label]').forEach(field=>field.value=state.socialLinks?.[Number(field.dataset.socialLabel)]?.label||'');render();}
  function render(){const r=state.restaurant,t=state.theme;previewName.textContent=r.name;previewTagline.textContent=r.tagline;previewRating.textContent=r.rating;previewAddress.textContent=`${r.address}, ${r.city}`;previewPhone.textContent=r.phoneDisplay;previewHero.style.background=`radial-gradient(circle at 80% 15%,${t.accent}66,transparent 27%),linear-gradient(135deg,${t.brand2},${t.brand} 65%,#081b13)`;document.documentElement.style.setProperty('--brand',t.brand);document.documentElement.style.setProperty('--accent',t.accent);document.documentElement.style.setProperty('--cream',t.cream);}
  fields.forEach(field=>field.addEventListener('input',()=>{let value=field.type==='checkbox'?field.checked:field.type==='number'?Number(field.value):field.value;set(field.dataset.path,value);render();}));
  socialFields.forEach(field=>field.addEventListener('input',()=>{state.socialLinks[Number(field.dataset.social)].url=field.value;}));
  document.querySelectorAll('[data-social-label]').forEach(field=>field.addEventListener('input',()=>{state.socialLinks[Number(field.dataset.socialLabel)].label=field.value;}));
  function code(){return `// Configuration générée avec Restaurant Template Pro\nwindow.RESTAURANT_CONFIG = ${JSON.stringify(state,null,2)};\n`;}
  function capacitorCode(){
    const app=state.app||{};
    return JSON.stringify({
      appId: app.id || 'com.restaurant.templatepro',
      appName: app.name || state.restaurant.name || 'Restaurant',
      webDir: 'web',
      android: { allowMixedContent: false },
      ios: { contentInset: 'automatic' }
    },null,2)+'\n';
  }
  function slugPart(value){return String(value||'restaurant').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.+|\.+$/g,'')||'restaurant';}
  function flash(text){message.textContent=text;message.style.display='block';setTimeout(()=>message.style.display='none',2600);}
  download.onclick=()=>{const blob=new Blob([code()],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='config.js';link.click();URL.revokeObjectURL(url);flash('Fichier config.js téléchargé ✅');};
  downloadApp.onclick=()=>{const blob=new Blob([capacitorCode()],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='capacitor.config.json';link.click();URL.revokeObjectURL(url);flash('Configuration application téléchargée ✅');};
  syncApp.onclick=()=>{state.app=state.app||{};state.app.name=state.restaurant.name||'Restaurant';state.app.id='fr.restaurant.'+slugPart(state.restaurant.name).replace(/\./g,'');fill();flash('Nom et identifiant application préparés ✅');};
  modeDemo.onclick=()=>{state.features.showDemoBadge=true;state.features.showAdminLink=true;fill();flash('Mode démonstration activé ✅');};
  modeClient.onclick=()=>{state.features.showDemoBadge=false;state.features.showAdminLink=false;fill();flash('Configuration prête pour le client ✅');};
  copy.onclick=async()=>{await navigator.clipboard.writeText(code());flash('Code copié ✅');};
  reset.onclick=()=>{state=JSON.parse(JSON.stringify(original));fill();flash('Configuration réinitialisée.');};
  fill();
})();
