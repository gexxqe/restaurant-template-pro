/*
 * Mode démonstration de l'espace restaurateur.
 * Remplace le client Supabase par un stockage local au navigateur :
 * les modifications faites en démo ne touchent jamais la base de données
 * ni le site public. Elles restent visibles uniquement dans ce navigateur
 * (admin.html?demo=1 et index.html?apercu=demo).
 */
(function () {
  const KEY = 'ms_demo_store_v1';
  const cfg = window.RESTAURANT_CONFIG || {};
  const r = cfg.restaurant || {};
  const ds = cfg.dailySpecial || {};

  function seed() {
    const now = new Date();
    const iso = d => d.toISOString();
    const day = n => { const d = new Date(now); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
    const hours = (cfg.openingHours || []).map((h, i) => ({
      day_index: i, day_name: h.day, is_closed: !h.slots.length,
      lunch_start: h.slots[0]?.[0] || null, lunch_end: h.slots[0]?.[1] || null,
      dinner_start: h.slots[1]?.[0] || null, dinner_end: h.slots[1]?.[1] || null
    }));
    return {
      restaurant_settings: [{
        id: 1, name: r.name, phone: r.phoneDisplay, address: r.address, city_postcode: r.city, email: r.email,
        tagline: r.tagline, description: r.description, rating: r.rating,
        hero_title: r.name, hero_text: r.tagline,
        daily_label: ds.eyebrow || '', daily_title: ds.name || '', daily_description: ds.description || '',
        daily_price: ds.price || 0, daily_image_url: '', updated_at: iso(now)
      }],
      menu_items: (cfg.menu || []).map((m, i) => ({
        id: 'demo-' + (i + 1), category: m.category, name: m.name, description: m.description, price: m.price,
        is_vegetarian: !!m.vegetarian, is_available: true, is_daily_special: false, sort_order: i + 1,
        created_at: iso(now), updated_at: iso(now)
      })),
      opening_hours: hours,
      reservations: [
        { id: 'r1', customer_name: 'Claire D. (exemple)', phone: '06 00 00 00 01', reservation_date: day(1), reservation_time: '20:00', guest_count: 4, message: 'Une chaise haute, merci.', status: 'pending', created_at: iso(now) },
        { id: 'r2', customer_name: 'Hugo M. (exemple)', phone: '06 00 00 00 02', reservation_date: day(2), reservation_time: '12:30', guest_count: 2, message: null, status: 'confirmed', created_at: iso(new Date(now - 36e5)) },
        { id: 'r3', customer_name: 'Inès B. (exemple)', phone: '06 00 00 00 03', reservation_date: day(3), reservation_time: '19:30', guest_count: 6, message: 'Anniversaire', status: 'pending', created_at: iso(new Date(now - 72e5)) }
      ],
      admin_users: [{ user_id: 'demo-admin' }],
      files: {}
    };
  }

  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    const s = seed(); save(s); return s;
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { console.warn('Démo : stockage local indisponible', e); } }

  function query(table) {
    const st = { filters: [], orders: [], lim: null, op: 'select', payload: null, single: null, returning: false };
    const run = () => {
      const db = load();
      const rows = db[table] || (db[table] = []);
      const match = row => st.filters.every(([c, v]) => String(row[c]) === String(v));
      let data = null, error = null;
      if (st.op === 'insert') {
        const list = (Array.isArray(st.payload) ? st.payload : [st.payload]).map(p => ({ id: 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), created_at: new Date().toISOString(), ...p }));
        rows.push(...list); data = list;
      } else if (st.op === 'update') {
        data = rows.filter(match); data.forEach(row => Object.assign(row, st.payload));
      } else if (st.op === 'delete') {
        data = rows.filter(match); db[table] = rows.filter(row => !match(row));
      } else {
        data = rows.filter(match).map(x => ({ ...x }));
        for (const [c, asc] of st.orders.slice().reverse()) data.sort((a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (asc ? 1 : -1));
        if (st.lim != null) data = data.slice(0, st.lim);
      }
      if (st.op !== 'select') save(db);
      if (st.single) {
        if (!data.length) { data = null; if (st.single === 'one') error = { message: 'Aucune ligne (démo).' }; }
        else data = data[0];
      } else if (st.op !== 'select' && !st.returning) data = null;
      return Promise.resolve({ data, error });
    };
    const b = {
      select() { if (st.op !== 'select') st.returning = true; return b; },
      insert(p) { st.op = 'insert'; st.payload = p; return b; },
      update(p) { st.op = 'update'; st.payload = p; return b; },
      upsert(p) { st.op = 'insert'; st.payload = p; return b; },
      delete() { st.op = 'delete'; return b; },
      eq(c, v) { st.filters.push([c, v]); return b; },
      order(c, o) { st.orders.push([c, !(o && o.ascending === false)]); return b; },
      limit(n) { st.lim = n; return b; },
      single() { st.single = 'one'; return b; },
      maybeSingle() { st.single = 'maybe'; return b; },
      then(res, rej) { return run().then(res, rej); }
    };
    return b;
  }

  const user = { id: 'demo-admin', email: 'demo@gexxqe.com' };
  const blobToDataUrl = blob => new Promise((ok, ko) => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.onerror = ko; fr.readAsDataURL(blob); });

  window.createDemoClient = function () {
    return {
      auth: {
        getSession: async () => ({ data: { session: { user } } }),
        signInWithPassword: async () => ({ error: null }),
        signUp: async () => ({ error: { message: 'Mode démonstration : aucun compte n’est créé.' } }),
        signOut: async () => { location.href = 'index.html?apercu=demo'; return { error: null }; }
      },
      from: query,
      storage: {
        from() {
          return {
            async upload(path, blob) {
              const db = load();
              try { db.files[path] = await blobToDataUrl(blob); save(db); return { error: null }; }
              catch (e) { return { error: { message: 'Photo trop lourde pour la démo.' } }; }
            },
            getPublicUrl(path) { return { data: { publicUrl: load().files[path] || '' } }; },
            async remove(paths) { const db = load(); paths.forEach(p => delete db.files[p]); save(db); return { error: null }; }
          };
        }
      }
    };
  };

  // Lecture pour le site public en aperçu de démonstration.
  window.readDemoStore = load;
  window.resetDemoStore = function () { try { localStorage.removeItem(KEY); } catch (e) {} };
  window.isDemoMode = function () {
    const p = new URLSearchParams(location.search);
    return p.has('demo') || p.get('apercu') === 'demo';
  };
})();
