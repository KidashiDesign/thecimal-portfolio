/* ==========================================================================
   CONTENT — die einzige Datei, die du zum Befüllen der Seite anfassen musst.
   ==========================================================================

   Hier stehen ALLE Texte und ALLE Bildpfade. Die Komponenten in
   src/components/ enthalten bewusst keinen einzigen fest verdrahteten Text.

   ---------------------------------------------------------------------------
   BILDER AUSTAUSCHEN
   ---------------------------------------------------------------------------
   Aktuell sind alle Bilder Platzhalter von picsum.photos. Das Schema ist:

       https://picsum.photos/seed/NAME/BREITE/HÖHE

   Der "seed" (z. B. `mission-1`, `project-a-hero`) sagt dir, an welcher
   Stelle der Seite das Bild sitzt. Zum Austauschen:

   1. Eigenes Bild nach  public/images/  legen, z. B. public/images/mission-1.jpg
   2. Hier die URL ersetzen durch:  "/images/mission-1.jpg"
      (führender Slash = Ordner "public", das ist wichtig)

   Behalte möglichst das Seitenverhältnis der Platzhalter bei (die Zahlen
   hinter dem Seed sind Breite/Höhe), sonst springt das Layout.

   ---------------------------------------------------------------------------
   TEXTE AUSTAUSCHEN
   ---------------------------------------------------------------------------
   Einfach die Werte in Anführungszeichen überschreiben. Struktur nicht
   verändern (also Kommas, geschweifte Klammern und Feldnamen so lassen).
   Listen (alles in eckigen Klammern [ ... ]) darfst du verlängern/kürzen —
   siehe die Hinweise direkt an den jeweiligen Stellen.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. NAVIGATION + VOLLBILD-MENÜ
   -------------------------------------------------------------------------- */
export const nav = {
  logo: "/placeholder/logo.svg", // SVG in public/placeholder/ ersetzen
  logoAlt: "Platzhalter Logo",

  // Links, die direkt in der Kopfzeile stehen (Desktop).
  // `href` verweist auf die id einer Sektion — siehe src/App.jsx
  inlineLinks: [
    { label: "Arbeiten", href: "#projekte" },
    { label: "Studio", href: "#mission" },
    { label: "Kontakt", href: "#kontakt" },
  ],

  menuLabel: "Menü",
  closeLabel: "Schließen",

  // Sitemap im Vollbild-Overlay
  overlay: {
    eyebrow: "Navigation",
    links: [
      { label: "Startseite", href: "#hero" },
      { label: "Über uns", href: "#statement" },
      { label: "Studio", href: "#mission" },
      { label: "Meilensteine", href: "#meilensteine" },
      { label: "Arbeiten", href: "#projekte" },
      { label: "Stimmen", href: "#stimmen" },
      { label: "Kontakt", href: "#kontakt" },
    ],
    contactEyebrow: "Sag Hallo",
    email: "hallo@platzhalter.com",
    phone: "+49 000 000000",
    address: ["Platzhalterstraße 12", "10115 Berlin"],
    socialEyebrow: "Folgen",
    socials: [
      { label: "Instagram", href: "https://example.com" },
      { label: "LinkedIn", href: "https://example.com" },
      { label: "Behance", href: "https://example.com" },
      { label: "Vimeo", href: "https://example.com" },
    ],
  },
};

/* --------------------------------------------------------------------------
   2. HERO
   -------------------------------------------------------------------------- */
export const hero = {
  // Eigenes Loop-Video nach public/placeholder/ legen und Pfad anpassen.
  // Solange kein Video existiert, wird automatisch `posterImage` gezeigt.
  backgroundVideo: "/placeholder/hero-loop.mp4",
  posterImage: "https://picsum.photos/seed/hero-video/1920/1080",
  posterAlt: "Platzhalter Hero-Hintergrund",

  // Die zwei riesigen Zeilen. Jeder Buchstabe wird einzeln animiert.
  headlineTop: "ZA",
  headlineBottom: "NO",

  // Kleine Infoblöcke rund um die Headline
  founderName: "Platzhalter Name",
  founderRole: "Creative Director",
  contactEmail: "hallo@platzhalter.com",
  contactPhone: "+49 000 000000",
  year: "2026",

  tagline: "Independent Creative Studio",
  scrollIndicator: "Scrollen",
};

/* --------------------------------------------------------------------------
   3. STATEMENT (Text hellt sich Wort für Wort beim Scrollen auf)
   -------------------------------------------------------------------------- */
export const statement = {
  eyebrow: "Was wir tun",
  // Ein zusammenhängender Absatz. Wird automatisch in einzelne Wörter
  // zerlegt — je länger der Text, desto länger die Scroll-Strecke.
  // Empfehlung: 30–60 Wörter.
  text:
    "Wir bauen Marken, die man nicht überscrollt. Zwischen Strategie und Ästhetik " +
    "entstehen Ideen, die sich anfühlen wie ein Reflex — schnell, präzise, " +
    "unverwechselbar. Kein Template, kein Rauschen, keine Kompromisse. Nur Arbeit, " +
    "die bleibt.",
  footnote: "Platzhalter — Studio seit 2018",
};

/* --------------------------------------------------------------------------
   4. MISSION / VISION (Tabs + Bild-Cluster mit Parallax)
   -------------------------------------------------------------------------- */
export const missionVision = {
  eyebrow: "Studio",

  // Die zwei Tabs. Reihenfolge = Reihenfolge der Buttons.
  tabs: [
    {
      id: "vision",
      label: "Vision",
      headline: "Ideen, die länger halten als der Trend.",
      body:
        "Platzhaltertext für die Vision. Beschreibe hier in zwei bis drei Sätzen, " +
        "wohin das Studio will und woran man euch in fünf Jahren erkennt. " +
        "Ruhig konkret werden — abstrakte Floskeln liest niemand zu Ende.",
      points: [
        "Platzhalter Punkt eins",
        "Platzhalter Punkt zwei",
        "Platzhalter Punkt drei",
      ],
    },
    {
      id: "mission",
      label: "Mission",
      headline: "Handwerk statt Zufall, jeden Tag.",
      body:
        "Platzhaltertext für die Mission. Was macht ihr konkret, für wen, und " +
        "warum ausgerechnet ihr? Zwei bis drei Sätze reichen — der Rest steht " +
        "in den Projekten weiter unten.",
      points: [
        "Platzhalter Punkt eins",
        "Platzhalter Punkt zwei",
        "Platzhalter Punkt drei",
      ],
    },
  ],
};

// Bild-Cluster neben den Tabs. Genau 3 Bilder — sie überlappen sich und
// scrollen unterschiedlich schnell (`speed`).
// speed: 0 = bewegt sich gar nicht, 1 = starker Parallax-Versatz.
export const missionImages = [
  {
    src: "https://picsum.photos/seed/mission-1/600/800",
    alt: "Platzhalter Studio-Aufnahme",
    speed: 0.35,
  },
  {
    src: "https://picsum.photos/seed/mission-2/500/620",
    alt: "Platzhalter Detailaufnahme",
    speed: 0.9,
  },
  {
    src: "https://picsum.photos/seed/mission-3/440/560",
    alt: "Platzhalter Team-Aufnahme",
    speed: 0.6,
  },
];

/* --------------------------------------------------------------------------
   5. MEILENSTEINE (horizontal, gepinnt)
   -------------------------------------------------------------------------- */
export const milestones = {
  eyebrow: "Meilensteine",
  headline: "Zahlen, die wir mögen",

  // 3–4 Panels funktionieren am besten. Mehr = längere Scroll-Strecke.
  // `value`  : Zielzahl des Countdowns (nur Ziffern, wird hochgerollt)
  // `suffix` : hängt hinter der Zahl, z. B. "+", "%", "K"
  panels: [
    {
      value: 120,
      suffix: "+",
      year: "2019",
      label: "Projekte ausgeliefert",
      text:
        "Platzhaltertext für den ersten Meilenstein. Ein bis zwei Sätze, die " +
        "erklären, was die Zahl bedeutet.",
      image: "https://picsum.photos/seed/milestone-1/900/1200",
      alt: "Platzhalter Meilenstein eins",
    },
    {
      value: 38,
      suffix: "",
      year: "2021",
      label: "Awards & Nominierungen",
      text:
        "Platzhaltertext für den zweiten Meilenstein. Ein bis zwei Sätze, die " +
        "erklären, was die Zahl bedeutet.",
      image: "https://picsum.photos/seed/milestone-2/900/1200",
      alt: "Platzhalter Meilenstein zwei",
    },
    {
      value: 24,
      suffix: "",
      year: "2023",
      label: "Menschen im Studio",
      text:
        "Platzhaltertext für den dritten Meilenstein. Ein bis zwei Sätze, die " +
        "erklären, was die Zahl bedeutet.",
      image: "https://picsum.photos/seed/milestone-3/900/1200",
      alt: "Platzhalter Meilenstein drei",
    },
    {
      value: 96,
      suffix: "%",
      year: "2026",
      label: "Kunden bleiben",
      text:
        "Platzhaltertext für den vierten Meilenstein. Ein bis zwei Sätze, die " +
        "erklären, was die Zahl bedeutet.",
      image: "https://picsum.photos/seed/milestone-4/900/1200",
      alt: "Platzhalter Meilenstein vier",
    },
  ],
};

/* --------------------------------------------------------------------------
   6. PROJEKTE (Tabs mit Crossfade + Thumbnail-Strip)
   -------------------------------------------------------------------------- */
export const projects = {
  eyebrow: "Ausgewählte Arbeiten",
  headline: "Projekte",
  linkLabel: "Projekt ansehen",

  // Beliebig viele Einträge — die Tab-Leiste wächst mit.
  items: [
    {
      id: "projekt-a",
      tabLabel: "Projekt A",
      client: "Platzhalter Client A",
      year: "2025",
      type: "Brand Identity",
      description:
        "Platzhalterbeschreibung für Projekt A. Zwei Sätze zur Aufgabe und " +
        "zum Ergebnis reichen völlig.",
      href: "https://example.com",
      image: "https://picsum.photos/seed/project-a-hero/1600/1000",
      alt: "Platzhalter Projekt A",
      thumb: "https://picsum.photos/seed/project-a-thumb/320/220",
    },
    {
      id: "projekt-b",
      tabLabel: "Projekt B",
      client: "Platzhalter Client B",
      year: "2024",
      type: "Digital Campaign",
      description:
        "Platzhalterbeschreibung für Projekt B. Zwei Sätze zur Aufgabe und " +
        "zum Ergebnis reichen völlig.",
      href: "https://example.com",
      image: "https://picsum.photos/seed/project-b-hero/1600/1000",
      alt: "Platzhalter Projekt B",
      thumb: "https://picsum.photos/seed/project-b-thumb/320/220",
    },
    {
      id: "projekt-c",
      tabLabel: "Projekt C",
      client: "Platzhalter Client C",
      year: "2023",
      type: "Art Direction",
      description:
        "Platzhalterbeschreibung für Projekt C. Zwei Sätze zur Aufgabe und " +
        "zum Ergebnis reichen völlig.",
      href: "https://example.com",
      image: "https://picsum.photos/seed/project-c-hero/1600/1000",
      alt: "Platzhalter Projekt C",
      thumb: "https://picsum.photos/seed/project-c-thumb/320/220",
    },
  ],
};

/* --------------------------------------------------------------------------
   7. MARQUEE (Endlos-Laufschrift)
   -------------------------------------------------------------------------- */
export const marquee = {
  // Diese Wörter laufen endlos durch. Zwischen je zwei Wörtern erscheint
  // automatisch das `separator`-Zeichen.
  words: ["We Create Virality", "We Create Impact", "We Create Culture"],
  separator: "✦",
  // Sekunden für einen kompletten Durchlauf. Größer = langsamer.
  durationSeconds: 24,
};

/* --------------------------------------------------------------------------
   8. TESTIMONIALS
   -------------------------------------------------------------------------- */
export const testimonials = {
  eyebrow: "Stimmen",
  moreLabel: "Weitere anzeigen",
  moreHref: "https://example.com",

  items: [
    {
      quote:
        "Platzhalterzitat eins. Ein bis drei Sätze, in denen die Kundin sagt, " +
        "was die Zusammenarbeit gebracht hat.",
      name: "Platzhalter Person A",
      role: "Head of Brand, Platzhalter GmbH",
      avatar: "https://picsum.photos/seed/testimonial-a/240/240",
      alt: "Platzhalter Portrait A",
    },
    {
      quote:
        "Platzhalterzitat zwei. Ein bis drei Sätze, in denen der Kunde sagt, " +
        "was die Zusammenarbeit gebracht hat.",
      name: "Platzhalter Person B",
      role: "Founder, Platzhalter Studio",
      avatar: "https://picsum.photos/seed/testimonial-b/240/240",
      alt: "Platzhalter Portrait B",
    },
    {
      quote:
        "Platzhalterzitat drei. Ein bis drei Sätze, in denen die Kundin sagt, " +
        "was die Zusammenarbeit gebracht hat.",
      name: "Platzhalter Person C",
      role: "Marketing Lead, Platzhalter AG",
      avatar: "https://picsum.photos/seed/testimonial-c/240/240",
      alt: "Platzhalter Portrait C",
    },
  ],
};

/* --------------------------------------------------------------------------
   9. CTA — "Sag Hallo"
   -------------------------------------------------------------------------- */
export const cta = {
  eyebrow: "Neues Projekt?",
  headlineTop: "Sag",
  headlineBottom: "Hallo",
  text:
    "Platzhaltertext. Ein Satz, der zum Schreiben einlädt — und sagt, wie " +
    "schnell ihr antwortet.",
  buttonLabel: "Projekt anfragen",
  buttonHref: "mailto:hallo@platzhalter.com",

  // Bild-Grid unter der Headline (Hover = leichter Zoom).
  // 4–6 Bilder sehen am ausgewogensten aus.
  images: [
    { src: "https://picsum.photos/seed/cta-1/600/700", alt: "Platzhalter eins" },
    { src: "https://picsum.photos/seed/cta-2/600/700", alt: "Platzhalter zwei" },
    { src: "https://picsum.photos/seed/cta-3/600/700", alt: "Platzhalter drei" },
    { src: "https://picsum.photos/seed/cta-4/600/700", alt: "Platzhalter vier" },
  ],
};

/* --------------------------------------------------------------------------
   10. FOOTER
   -------------------------------------------------------------------------- */
export const footer = {
  logo: "/placeholder/logo.svg",
  logoAlt: "Platzhalter Logo",
  blurb: "Independent Creative Studio — Platzhalter.",

  // Jede Spalte ist ein Objekt mit Titel und Links.
  columns: [
    {
      title: "Studio",
      links: [
        { label: "Über uns", href: "#statement" },
        { label: "Meilensteine", href: "#meilensteine" },
        { label: "Stimmen", href: "#stimmen" },
      ],
    },
    {
      title: "Arbeiten",
      links: [
        { label: "Projekt A", href: "#projekte" },
        { label: "Projekt B", href: "#projekte" },
        { label: "Projekt C", href: "#projekte" },
      ],
    },
    {
      title: "Kontakt",
      links: [
        { label: "hallo@platzhalter.com", href: "mailto:hallo@platzhalter.com" },
        { label: "+49 000 000000", href: "tel:+49000000000" },
      ],
    },
  ],

  socials: [
    { label: "Instagram", href: "https://example.com" },
    { label: "LinkedIn", href: "https://example.com" },
    { label: "Behance", href: "https://example.com" },
  ],

  copyright: "© 2026 Platzhalter Studio. Alle Rechte vorbehalten.",
  legalLinks: [
    { label: "Impressum", href: "#" },
    { label: "Datenschutz", href: "#" },
  ],
};
