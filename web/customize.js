(() => {
  const original = JSON.parse(JSON.stringify(window.RESTAURANT_CONFIG));
  let state = JSON.parse(JSON.stringify(original));
  const fields = [...document.querySelectorAll('[data-path]')];
  const socialFields = [...document.querySelectorAll('[data-social]')];
  const get = path => path.split('.').reduce((value, key) => value?.[key], state);
  const set = (path, value) => { const keys=path.split('.'); const last=keys.pop(); const target=keys.reduce((value,key)=>value[key],state); target[last]=value; };
  function fill(){fields.forEach(field=>{const value=get(field.dataset.path);if(field.type==='checkbox')field.checked=!!value;else field.value=value??'';});socialFields.forEach(field=>field.value=state.socialLinks?.[Number(field.dataset.social)]?.url||'');document.querySelectorAll('[data-social-label]').forEach(field=>field.value=state.socialLinks?.[Number(field.dataset.socialLabel)]?.label||'');render();}
  function render(){
    const r=state.restaurant,t=state.theme,branding=state.branding||{};
    previewName.textContent=r.name;previewTagline.textContent=r.tagline;previewRating.textContent=r.rating;
    previewAddress.textContent=`${r.address}, ${r.city}`;previewPhone.textContent=r.phoneDisplay;
    const hero=branding.heroImageDataUrl||branding.heroImageUrl||'';
    previewHero.style.background=hero
      ? `linear-gradient(90deg,rgba(8,27,19,.72),rgba(8,27,19,.28)),url("${hero}") center/cover no-repeat`
      : `radial-gradient(circle at 80% 15%,${t.accent}66,transparent 27%),linear-gradient(135deg,${t.brand2},${t.brand} 65%,#081b13)`;
    document.documentElement.style.setProperty('--brand',t.brand);
    document.documentElement.style.setProperty('--accent',t.accent);
    document.documentElement.style.setProperty('--cream',t.cream);

    const logo=branding.logoDataUrl||branding.logoUrl||'';
    logoPreviewFallback.textContent=r.shortName||'';
    if(logo){logoPreviewImage.src=logo;logoPreviewImage.hidden=false;logoPreviewFallback.hidden=true}
    else{logoPreviewImage.removeAttribute('src');logoPreviewImage.hidden=true;logoPreviewFallback.hidden=false}

    if(hero){heroImagePreviewImg.src=hero;heroImagePreviewImg.hidden=false;heroImagePlaceholder.hidden=true}
    else{heroImagePreviewImg.removeAttribute('src');heroImagePreviewImg.hidden=true;heroImagePlaceholder.hidden=false}

    const favicon=branding.faviconDataUrl||branding.faviconUrl||'';
    if(favicon){faviconPreviewImg.src=favicon;faviconPreviewImg.hidden=false;faviconPlaceholder.hidden=true}
    else{faviconPreviewImg.removeAttribute('src');faviconPreviewImg.hidden=true;faviconPlaceholder.hidden=false}

    const gallery=branding.galleryImages||[];
    galleryPreview.innerHTML=gallery.map((src,index)=>`<div class="gallery-editor-item"><img src="${src}" alt="Photo ${index+1}"><button type="button" data-remove-gallery="${index}" aria-label="Supprimer la photo">×</button></div>`).join('');
    galleryPreview.querySelectorAll('[data-remove-gallery]').forEach(button=>button.onclick=()=>{gallery.splice(Number(button.dataset.removeGallery),1);render();});
  }
  function readFileAsDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=reject;reader.readAsDataURL(file);});}
  fields.forEach(field=>field.addEventListener('input',()=>{let value=field.type==='checkbox'?field.checked:field.type==='number'?Number(field.value):field.value;set(field.dataset.path,value);render();}));
  socialFields.forEach(field=>field.addEventListener('input',()=>{state.socialLinks[Number(field.dataset.social)].url=field.value;}));
  logoFile.addEventListener('change',()=>{
    const file=logoFile.files?.[0];if(!file)return;
    if(file.size>2*1024*1024){flash('Logo trop volumineux : 2 Mo maximum.');logoFile.value='';return;}
    const reader=new FileReader();
    reader.onload=()=>{state.branding=state.branding||{};state.branding.logoDataUrl=String(reader.result||'');state.branding.logoUrl='';render();flash('Logo ajouté ✅');};
    reader.readAsDataURL(file);
  });
  removeLogo.onclick=()=>{state.branding=state.branding||{};state.branding.logoDataUrl='';state.branding.logoUrl='';logoFile.value='';render();flash('Logo supprimé.');};
  heroImageFile.addEventListener('change',async()=>{
    const file=heroImageFile.files?.[0];if(!file)return;
    if(file.size>1.5*1024*1024){flash('Image principale trop volumineuse : 1,5 Mo maximum.');heroImageFile.value='';return;}
    state.branding=state.branding||{};state.branding.heroImageDataUrl=await readFileAsDataUrl(file);state.branding.heroImageUrl='';render();flash('Image principale ajoutée ✅');
  });
  removeHeroImage.onclick=()=>{state.branding=state.branding||{};state.branding.heroImageDataUrl='';state.branding.heroImageUrl='';heroImageFile.value='';render();flash('Image principale supprimée.');};
  faviconFile.addEventListener('change',async()=>{
    const file=faviconFile.files?.[0];if(!file)return;
    if(file.size>512*1024){flash('Favicon trop volumineux : 512 Ko maximum.');faviconFile.value='';return;}
    state.branding=state.branding||{};state.branding.faviconDataUrl=await readFileAsDataUrl(file);state.branding.faviconUrl='';render();flash('Favicon ajouté ✅');
  });
  removeFavicon.onclick=()=>{state.branding=state.branding||{};state.branding.faviconDataUrl='';state.branding.faviconUrl='';faviconFile.value='';render();flash('Favicon supprimé.');};
  galleryFiles.addEventListener('change',async()=>{
    const files=[...(galleryFiles.files||[])];if(!files.length)return;
    state.branding=state.branding||{};state.branding.galleryImages=state.branding.galleryImages||[];
    const free=Math.max(0,6-state.branding.galleryImages.length);
    const chosen=files.slice(0,free);
    for(const file of chosen){
      if(file.size>900*1024){flash('Une photo de galerie dépasse 900 Ko et a été ignorée.');continue;}
      state.branding.galleryImages.push(await readFileAsDataUrl(file));
    }
    galleryFiles.value='';render();flash('Galerie mise à jour ✅');
  });
  clearGallery.onclick=()=>{state.branding=state.branding||{};state.branding.galleryImages=[];galleryFiles.value='';render();flash('Galerie supprimée.');};
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
