// PERSONNALISATION RAPIDE
// Modifiez uniquement les valeurs entre guillemets et les listes ci-dessous.
window.RESTAURANT_CONFIG = {
  restaurant: {
    name: "Maison Saveur",
    shortName: "MS",
    tagline: "Cuisine de saison, produits frais et accueil chaleureux.",
    description: "Une table conviviale où chaque plat est préparé avec soin à partir de produits frais et de saison.",
    phoneDisplay: "01 23 45 67 89",
    phoneHref: "+33123456789",
    email: "bonjour@maison-saveur.fr",
    address: "12 rue du Marché",
    city: "44000 Nantes, France",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=12+rue+du+Marche+44000+Nantes",
    rating: "4,8 / 5 • 126 avis",
    currency: "EUR",
    locale: "fr-FR"
  },
  theme: { brand: "#153b2c", brand2: "#245c43", accent: "#d6a64a", cream: "#f7f2e8" },
  branding: {
    logoDataUrl: "",
    logoUrl: "",
    heroImageDataUrl: "",
    heroImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85",
    faviconDataUrl: "",
    faviconUrl: "",
    galleryImages: [
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=82",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=82",
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=82",
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=82",
          "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=82",
          "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=82"
    ]
  },
  app: {
    name: "Restaurant Template Pro",
    id: "com.restaurant.templatepro"
  },
  dailySpecial: {
    eyebrow: "Suggestion du chef",
    name: "Le plat du moment",
    description: "Une recette de saison préparée chaque jour avec des produits sélectionnés auprès de nos partenaires.",
    price: 18.50
  },
  menu: [
    { category: "Formules", name: "Menu du marché", description: "Entrée + plat ou plat + dessert, selon les produits du jour.", price: 24, vegetarian: false },
    { category: "Entrées", name: "Œuf parfait, crème de champignons", description: "Champignons de saison, noisettes torréfiées et herbes fraîches.", price: 10, vegetarian: true },
    { category: "Entrées", name: "Tartare de poisson aux agrumes", description: "Poisson frais, agrumes, huile d’olive et jeunes pousses.", price: 12, vegetarian: false },
    { category: "Plats", name: "Volaille fermière rôtie", description: "Jus réduit, légumes de saison et pommes grenailles.", price: 23, vegetarian: false },
    { category: "Plats", name: "Poisson du jour", description: "Cuisson nacrée, beurre citronné et légumes du marché.", price: 25, vegetarian: false },
    { category: "Végétarien", name: "Risotto crémeux de saison", description: "Riz arborio, légumes rôtis, parmesan et herbes.", price: 20, vegetarian: true },
    { category: "Desserts", name: "Fondant au chocolat", description: "Cœur coulant, crème légère et éclats de noisette.", price: 9, vegetarian: true }
  ],
  openingHours: [
    { day: "Lundi", slots: [["12:00", "14:00"], ["19:00", "22:00"]] },
    { day: "Mardi", slots: [["12:00", "14:00"], ["19:00", "22:00"]] },
    { day: "Mercredi", slots: [] },
    { day: "Jeudi", slots: [["12:00", "14:00"], ["19:00", "22:00"]] },
    { day: "Vendredi", slots: [["12:00", "14:00"], ["19:00", "22:30"]] },
    { day: "Samedi", slots: [["12:00", "14:30"], ["19:00", "23:00"]] },
    { day: "Dimanche", slots: [["12:00", "15:00"]] }
  ],
  reviews: [
    { title: "Une belle découverte", text: "Des produits frais, une cuisine soignée et un accueil vraiment chaleureux.", label: "Qualité & accueil" },
    { title: "Excellent moment", text: "Une carte équilibrée, de belles assiettes et un service attentionné.", label: "Cuisine & service" },
    { title: "À recommander", text: "Une adresse conviviale avec un très bon rapport qualité-prix.", label: "Ambiance & prix" }
  ],
  socialLinks: [
    { label: "Facebook", icon: "f", url: "" },
    { label: "Instagram", icon: "◎", url: "" },
    { label: "TikTok", icon: "♪", url: "" },
    { label: "Autre lien", icon: "↗", url: "" }
  ],
  features: { showReviews: true, showAdminLink: true, showDemoBadge: true },
  supabase: {
    enabled: true,
    url: "https://vranjjsfxiygohaqyfxw.supabase.co",
    publishableKey: "sb_publishable_jR078H28G0QsN0LrjNPTtQ_c488Pqxu"
  }
};
