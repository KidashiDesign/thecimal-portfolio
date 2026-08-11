/* ==========================================================================
   CONTENT — die einzige Datei, die du zum Befüllen der Seite anfassen musst.
   ==========================================================================

   Hier stehen ALLE Texte und ALLE Bildpfade. Die Komponenten in
   src/components/ enthalten bewusst keinen einzigen fest verdrahteten Text.

   Sprache: Die Seiteninhalte sind Englisch (internationale Portfolio-Sprache
   des Künstlers). Die Kommentare hier bleiben Deutsch.

   ---------------------------------------------------------------------------
   BILDER AUSTAUSCHEN
   ---------------------------------------------------------------------------
   Aktuell sind alle Bilder Platzhalter von picsum.photos. Das Schema ist:

       https://picsum.photos/seed/NAME/BREITE/HÖHE

   Der "seed" (z. B. `mission-1`, `quanta-continua`) sagt dir, an welcher
   Stelle der Seite das Bild sitzt. Zum Austauschen:

   1. Eigenes Bild nach  public/images/  legen, z. B. public/images/quanta.jpg
   2. Hier die URL ersetzen durch:  "/images/quanta.jpg"
      (führender Slash = Ordner "public", das ist wichtig)

   Behalte möglichst das Seitenverhältnis der Platzhalter bei (die Zahlen
   hinter dem Seed sind Breite/Höhe), sonst springt das Layout.

   ---------------------------------------------------------------------------
   LINKS NACHTRAGEN
   ---------------------------------------------------------------------------
   Bei Projekten mit Video-/Release-Dokumentation ist `linkLabel` gesetzt
   (z. B. "Watch on Vimeo"), `href` aber leer — die echten URLs lagen nicht
   vor. Sobald du eine URL einträgst, erscheint der Link automatisch.
   Solange `href` leer ist, wird der Link gar nicht gerendert.

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
  logoAlt: "Thecimal",

  // Links, die direkt in der Kopfzeile stehen (Desktop).
  // `href` verweist auf die id einer Sektion — siehe src/App.jsx
  inlineLinks: [
    { label: "Works", href: "#projekte" },
    { label: "Practice", href: "#mission" },
    { label: "Contact", href: "#kontakt" },
  ],

  menuLabel: "Menu",
  closeLabel: "Close",

  // Sitemap im Vollbild-Overlay
  overlay: {
    eyebrow: "Navigation",
    links: [
      { label: "Start", href: "#hero" },
      { label: "About", href: "#statement" },
      { label: "Practice", href: "#mission" },
      { label: "Selected Facts", href: "#meilensteine" },
      { label: "Works", href: "#projekte" },
      { label: "In His Own Words", href: "#stimmen" },
      { label: "Contact", href: "#kontakt" },
    ],
    contactEyebrow: "Say Hello",
    email: "thecimal@gmail.com",
    phone: "+995 511 725 403",
    address: ["Sound Art & Audio-Visual Performance", "Tehran"],
    socialEyebrow: "Elsewhere",
    // Profil-URLs (Bandcamp, Vimeo, YouTube) lagen nicht vor — einfach
    // ergänzen: { label: "Bandcamp", href: "https://..." }
    socials: [{ label: "Full CV", href: "https://thecimal.com/cv" }],
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
  posterAlt: "Hintergrund — Platzhalter für Performance-Dokumentation",

  // Die zwei riesigen Zeilen. Jeder Buchstabe wird einzeln animiert.
  headlineTop: "THE",
  headlineBottom: "CIMAL",

  // Kleine Infoblöcke rund um die Headline
  artistLabel: "Artist",
  founderName: "Behnoud Mohammadi",
  founderRole: "Sound Artist & Performer",

  contactLabel: "Contact",
  contactEmail: "thecimal@gmail.com",
  contactPhone: "+995 511 725 403",

  yearLabel: "Based in",
  year: "Tehran",

  tagline: "Audio-Visual Performances & Sound Art",
  scrollIndicator: "Scroll",
};

/* --------------------------------------------------------------------------
   3. STATEMENT (Text hellt sich Wort für Wort beim Scrollen auf)
   -------------------------------------------------------------------------- */
export const statement = {
  eyebrow: "About",
  // Ein zusammenhängender Absatz. Wird automatisch in einzelne Wörter
  // zerlegt — je länger der Text, desto länger die Scroll-Strecke.
  // Empfehlung: 30–60 Wörter.
  text:
    "Behnoud Mohammadi is a Tehran-based sound artist and performer specializing " +
    "in immersive audio-visual experiences that bridge sound, visuals, and " +
    "technology. Using tools like TouchDesigner, he creates ambient performances " +
    "that blend dynamic projections with intricate soundscapes — continuing to " +
    "explore new possibilities in sound, space, and perception.",
  footnote: "Sound Art & Audio-Visual Performance",
};

/* --------------------------------------------------------------------------
   4. PRACTICE / RESEARCH (Tabs + Bild-Cluster mit Parallax)
   -------------------------------------------------------------------------- */
export const missionVision = {
  eyebrow: "Practice",

  // Die zwei Tabs. Reihenfolge = Reihenfolge der Buttons.
  tabs: [
    {
      id: "vision",
      label: "Practice",
      headline: "Sound as a fluid, living continuum.",
      body:
        "Immersive audio-visual work between sound, visuals, and technology. " +
        "Ambient performances built with TouchDesigner and modular systems have " +
        "been presented at events such as the Tehran Annual Digital Art Exhibition " +
        "(TADAEX) and the Tehran Contemporary Music Festival, combining dynamic " +
        "projections with intricate soundscapes.",
      points: [
        "Spatial & quad-speaker sound installations",
        "Realtime generative audio-visual performance",
        "Sound design for video art and installation",
      ],
    },
    {
      id: "mission",
      label: "Research & Community",
      headline: "Pushing experimental audio further.",
      body:
        "In 2025, Behnoud contributed to a doctoral thesis at UC Santa Barbara, " +
        "exploring deep learning in sound generation using RAVE. As technical " +
        "manager for TEM Fest he supports the growth of Iran's electronic music " +
        "community, and collaborates globally across Norway, Sweden, and the US. " +
        "His music, including Kandu and The Great Gate, has gained international " +
        "recognition in outlets such as Avant Music News and This is Darkness.",
      points: [
        "Deep learning in sound generation (RAVE, Python)",
        "Technical manager & advisor, TEM Fest",
        "Mixing and mastering for local artists",
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
    alt: "Platzhalter — Performance-Aufnahme",
    speed: 0.35,
  },
  {
    src: "https://picsum.photos/seed/mission-2/500/620",
    alt: "Platzhalter — Detail einer Klanginstallation",
    speed: 0.9,
  },
  {
    src: "https://picsum.photos/seed/mission-3/440/560",
    alt: "Platzhalter — Studio-Setup",
    speed: 0.6,
  },
];

/* --------------------------------------------------------------------------
   5. SELECTED FACTS (horizontal, gepinnt)
   -------------------------------------------------------------------------- */
export const milestones = {
  eyebrow: "Selected Facts",
  headline: "Numbers behind the work",

  // 3–4 Panels funktionieren am besten. Mehr = längere Scroll-Strecke.
  // `value`  : Zielzahl des Countdowns (nur Ziffern, wird hochgerollt)
  // `suffix` : hängt hinter der Zahl, z. B. "+", "%", "K"
  panels: [
    {
      value: 30,
      suffix: "+",
      year: "Discography",
      label: "International releases",
      text:
        "Singles, collaborative works and mixtapes in the dark ambient genre, " +
        "released under the names IDFT, Force Ignore, P01ntl355 and havytna.",
      image: "https://picsum.photos/seed/milestone-releases/900/1200",
      alt: "Platzhalter — Release-Artwork",
    },
    {
      value: 300,
      suffix: "+",
      year: "2017",
      label: "Audience at TEM Fest",
      text:
        "Technical manager and festival advisor for one of the first large-scale " +
        "festivals dedicated to electronic music in Iran.",
      image: "https://picsum.photos/seed/milestone-temfest/900/1200",
      alt: "Platzhalter — Festival-Aufnahme",
    },
    {
      value: 4,
      suffix: "",
      year: "Since 2014",
      label: "Sound & light installations",
      text:
        "From the Fibonacci pipe array of V (5) at TADAEX to quad-speaker spatial " +
        "works at Ariana Art Gallery and International Drone Day.",
      image: "https://picsum.photos/seed/milestone-installations/900/1200",
      alt: "Platzhalter — Installationsansicht",
    },
    {
      value: 5,
      suffix: "",
      year: "Ongoing",
      label: "Countries collaborated in",
      text:
        "Work and collaborations across Iran, Georgia, Norway, Sweden and the US — " +
        "from gallery installations to festival stages and record labels.",
      image: "https://picsum.photos/seed/milestone-collab/900/1200",
      alt: "Platzhalter — Kollaborations-Aufnahme",
    },
  ],
};

/* --------------------------------------------------------------------------
   6. WORKS (Tabs mit Crossfade + Thumbnail-Strip)
   --------------------------------------------------------------------------
   Schema pro Eintrag:
     id          — technische ID (eindeutig, keine Leerzeichen)
     tabLabel    — kurzer Titel für Tab & Thumbnail
     title       — vollständiger Werktitel
     client      — Ort / Kontext (Galerie, Festival, Label)
     year        — Jahr(e); leer lassen, wenn unbekannt
     type        — Kategorie (Installation / Live Performance / Release / …)
     role        — Rolle; leer lassen, wenn nicht angegeben
     medium      — Medium; leer lassen, wenn nicht angegeben
     tools       — Liste der eingesetzten Werkzeuge
     description — Beschreibungstext
     linkLabel   — Beschriftung des Links (z. B. "Watch on Vimeo")
     href        — URL; solange leer, wird kein Link angezeigt
   -------------------------------------------------------------------------- */
export const projects = {
  eyebrow: "Selected Works",
  headline: "Works",
  linkLabel: "View project", // Fallback, falls ein Eintrag kein `linkLabel` hat

  // Beschriftungen der Meta-Zeilen unter dem Bild
  metaLabels: {
    client: "Venue / Context",
    year: "Year",
    type: "Category",
    role: "Role",
    medium: "Medium",
    tools: "Tools",
  },

  // Beliebig viele Einträge — die Tab-Leiste wächst mit.
  items: [
    {
      id: "silver-screen",
      tabLabel: "Silver Screen",
      title: "Real-Time Generative Audio Series — Silver Screen",
      client: "Mtkvarze Club, Mutant Radio",
      year: "2026",
      type: "Live Performance",
      role: "",
      medium: "Live sound performance",
      tools: ["Ableton Live", "MaxMSP"],
      description:
        "A live sound performance under the name Thecimal, presented in multiple " +
        "venues, featuring recent compositions alongside earlier material. The set " +
        "introduced my current sonic language through evolving rhythms, textures " +
        "and atmospheres. Using layered synthesis, spatial movement and gradual " +
        "transformations, the performance focused on continuity, tension and " +
        "emergence, unfolding as a self-contained, non-interactive experience in " +
        "real time.",
      linkLabel: "Watch on YouTube",
      href: "",
      image: "https://picsum.photos/seed/silver-screen-hero/1600/1000",
      alt: "Platzhalter — Silver Screen Performance",
      thumb: "https://picsum.photos/seed/silver-screen-thumb/320/220",
    },
    {
      id: "revolution-art-space",
      tabLabel: "Revolution Art Space",
      title: "Realtime Generative Music — Revolution Art Space",
      client: "Revolution Art Space — with Christian (Visuals)",
      year: "",
      type: "Live Performance",
      role: "",
      medium: "Realtime generative audio with live visuals",
      tools: ["Cardinal", "TouchDesigner"],
      description:
        "Using randomness as a compositional strategy while carefully identifying " +
        "moments of emergent momentum to shape unstable yet coherent rhythmic " +
        "structures. At the same time, employing physical modeling synthesis to " +
        "enable flexible sound design and melodic behavior, allowing random " +
        "generators to remain expressive while still musically controllable.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/revolution-hero/1600/1000",
      alt: "Platzhalter — Revolution Art Space Performance",
      thumb: "https://picsum.photos/seed/revolution-thumb/320/220",
    },
    {
      id: "silk-museum",
      tabLabel: "Silk Museum",
      title: "Realtime Generative Music — Georgian State Silk Museum",
      client: "Georgian State Silk Museum — with progeno and Skywalker",
      year: "",
      type: "Live Performance",
      role: "",
      medium: "Collaborative audio and laser projection",
      tools: [],
      description:
        "Collaborative audio and laser projection with progeno and Skywalker at " +
        "the Georgian State Silk Museum.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/silk-museum-hero/1600/1000",
      alt: "Platzhalter — Silk Museum Performance",
      thumb: "https://picsum.photos/seed/silk-museum-thumb/320/220",
    },
    {
      id: "deep-learning-rave",
      tabLabel: "Deep Learning / RAVE",
      title: "Deep Learning in Sound Generation",
      client: "UC Santa Barbara — doctoral thesis",
      year: "2025",
      type: "Research",
      role: "Research Study Assistant",
      medium: "AI-driven soundscapes for interactive installations",
      tools: ["RAVE", "Python"],
      description:
        "Contributed to a doctoral thesis at UC Santa Barbara, exploring deep " +
        "learning in sound generation using RAVE. I assisted in developing " +
        "AI-driven soundscapes for interactive installations, merging technology " +
        "with experimental audio. This project underscores my interest in " +
        "innovative sound design, blending technical research with artistic " +
        "application. Document available upon request.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/rave-hero/1600/1000",
      alt: "Platzhalter — Forschungsprojekt RAVE",
      thumb: "https://picsum.photos/seed/rave-thumb/320/220",
    },
    {
      id: "drone-day-installation",
      tabLabel: "Drone Day Installation",
      title: "Realtime Generative Time-based Sound and Light Installation",
      client: "International Drone Day",
      year: "",
      type: "Installation",
      role: "",
      medium: "Spatial audio installation, moving lights, LED lights",
      tools: ["VCV Rack", "TouchDesigner"],
      description:
        "“I can't just sit at my laptop and play. This room is a shifting wave " +
        "of my own reflections, appearing and disappearing like the ghosts of " +
        "forgotten artists who no longer exist.” This sound installation was " +
        "presented during International Drone Day, alongside a series of live " +
        "performances. Rather than presenting a performance myself, I chose to " +
        "create a quad speaker sound and light installation that could continuously " +
        "engage the audience throughout the event.",
      linkLabel: "Watch on Vimeo",
      href: "",
      image: "https://picsum.photos/seed/drone-day-hero/1600/1000",
      alt: "Platzhalter — Sound- und Lichtinstallation",
      thumb: "https://picsum.photos/seed/drone-day-thumb/320/220",
    },
    {
      id: "quanta-continua",
      tabLabel: "Quanta Continua",
      title: "Quanta Continua Sound Installation",
      client: "Ariana Art Gallery",
      year: "",
      type: "Installation",
      role: "",
      medium: "Spatial audio installation, interactive visual installation",
      tools: ["TouchDesigner", "Kinect", "VCV Rack"],
      description:
        "Sound installation at Ariana Art Gallery. Explored continuous sound flow " +
        "as an early reflection on quantum concepts of time and space. Through " +
        "spatial audio techniques, evolving soundscapes invited audiences to " +
        "experience sound as a fluid, living continuum.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/quanta-continua-hero/1600/1000",
      alt: "Platzhalter — Quanta Continua, Ausstellungsansicht",
      thumb: "https://picsum.photos/seed/quanta-continua-thumb/320/220",
    },
    {
      id: "kandu",
      tabLabel: "Kandu",
      title: "Taphephobia & IDFT — Kandu",
      client: "Reverse Alignment Records (Sweden)",
      year: "2021",
      type: "Release",
      role: "",
      medium: "Ambient album",
      tools: ["Ableton Live", "Max/MSP"],
      description:
        "Collaborated with Norwegian artist Ketil Søraker on Kandu, an ambient " +
        "album released by Reverse Alignment Records. Blending dark ambient " +
        "soundscapes with experimental textures, the project gained international " +
        "recognition, featured in Avant Music News, This is Darkness and " +
        "Unexplained Sounds Group radio transmissions.",
      linkLabel: "Listen on Bandcamp",
      href: "",
      image: "https://picsum.photos/seed/kandu-hero/1600/1000",
      alt: "Platzhalter — Kandu Album-Artwork",
      thumb: "https://picsum.photos/seed/kandu-thumb/320/220",
    },
    {
      id: "fireflies-session",
      tabLabel: "Fireflies Session",
      title: "Audio Performance — Fireflies Session",
      client: "with Einar Stray (Norway) and Sandro Mishelashvili (Georgia)",
      year: "",
      type: "Live Performance",
      role: "",
      medium: "Realtime generative music and acoustic instruments",
      tools: ["Bitwig Studio", "Cardinal"],
      description:
        "Realtime generative music and acoustic instruments — a collaborative " +
        "performance with Einar Stray (Norway) and Sandro Mishelashvili (Georgia).",
      linkLabel: "Watch on YouTube",
      href: "",
      image: "https://picsum.photos/seed/fireflies-hero/1600/1000",
      alt: "Platzhalter — Fireflies Session",
      thumb: "https://picsum.photos/seed/fireflies-thumb/320/220",
    },
    {
      id: "do-not-hesitate",
      tabLabel: "Do Not Hesitate",
      title: "Do Not Hesitate — Time-Based Audio Piece and Video Art",
      client: "Bon-Gah Art Gallery, Tehran · Limited Access 8",
      year: "2019",
      type: "Installation",
      role: "",
      medium: "Sound installation with speakers; later video art",
      tools: ["MaxMSP"],
      description:
        "Sound installation at Bon-Gah Art Gallery, Tehran. Two speakers faced the " +
        "walls of an empty pool, inviting audiences to step inside and confront " +
        "amplified soundscapes. The piece reflects on internalized fear and the " +
        "pervasive violence against women. Later adapted into a video art work " +
        "presented at Limited Access 8 (2019).",
      linkLabel: "Watch on Vimeo",
      href: "",
      image: "https://picsum.photos/seed/do-not-hesitate-hero/1600/1000",
      alt: "Platzhalter — Do Not Hesitate, Installationsansicht",
      thumb: "https://picsum.photos/seed/do-not-hesitate-thumb/320/220",
    },
    {
      id: "the-great-gate",
      tabLabel: "The Great Gate",
      title: "Audio-Visual Performance of The Great Gate",
      client: "TADAEX · Noctivagant Records (US) · Winter-Light (NL)",
      year: "2015 / 2018 / 2019",
      type: "Audio-Visual Performance",
      role: "",
      medium: "Solo audio-visual set",
      tools: ["TouchDesigner", "Ableton Live"],
      description:
        "Performed a solo audio-visual set as IDFT at TADAEX, featuring material " +
        "from The Great Gate, later released by Noctivagant Records (US) and " +
        "redistributed by Winter-Light (NL). Using TouchDesigner, I combined " +
        "ambient sound with reactive visuals to create an immersive, trance-like " +
        "atmosphere. Documented in the TADAEX 2018 program booklet.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/great-gate-hero/1600/1000",
      alt: "Platzhalter — The Great Gate Performance",
      thumb: "https://picsum.photos/seed/great-gate-thumb/320/220",
    },
    {
      id: "tem-fest",
      tabLabel: "TEM Fest",
      title: "Tehran Electronic Music Festival",
      client: "TEM Fest, Tehran",
      year: "2017",
      type: "Festival & Community",
      role: "Technical Manager, Festival Advisor",
      medium: "",
      tools: [],
      description:
        "Served as Technical Manager and Festival Advisor for TEM Fest, a landmark " +
        "2017 event that was among the first large-scale festivals dedicated to " +
        "electronic music in Iran, with an audience capacity of over 300. I managed " +
        "all technical operations and advised on programming, coordinating live " +
        "performances, workshops and artist collaborations. The festival played a " +
        "key role in supporting both local talent and advancing Iran's emerging " +
        "electronic music community.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/tem-fest-hero/1600/1000",
      alt: "Platzhalter — TEM Fest",
      thumb: "https://picsum.photos/seed/tem-fest-thumb/320/220",
    },
    {
      id: "denial",
      tabLabel: "Denial",
      title: "Denial — Collaborative Performance",
      client: "Da House, Tehran · Fajr Festival",
      year: "2017",
      type: "Audio-Visual Performance",
      role: "Sound Designer, Video Editor",
      medium: "Collaborative audiovisual performance",
      tools: ["Ableton Live", "After Effects"],
      description:
        "Explored the denial of humanity under harsh conditions, inspired by the " +
        "delicate transformation of a butterfly's birth. I created the sound design " +
        "and video editing to shape an expressive audiovisual environment.",
      linkLabel: "Watch on Vimeo",
      href: "",
      image: "https://picsum.photos/seed/denial-hero/1600/1000",
      alt: "Platzhalter — Denial Performance",
      thumb: "https://picsum.photos/seed/denial-thumb/320/220",
    },
    {
      id: "paraffin-showcase",
      tabLabel: "Paraffin Showcase",
      title: "Paraffin Showcase — Collaborative Audio-Visual Performance",
      client: "E1 Art Gallery",
      year: "2017",
      type: "Audio-Visual Performance",
      role: "Visual Artist",
      medium: "Ambient vinyl DJ set with realtime generative visuals",
      tools: ["TouchDesigner"],
      description:
        "Combined an ambient vinyl DJ set with real-time generative visuals driven " +
        "by the direct audio signal. Explored the interaction between analog sound " +
        "and digital visual response.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/paraffin-hero/1600/1000",
      alt: "Platzhalter — Paraffin Showcase",
      thumb: "https://picsum.photos/seed/paraffin-thumb/320/220",
    },
    {
      id: "reminiscence",
      tabLabel: "Reminiscence",
      title: "Reminiscence",
      client: "Shabnam Saadi, MFA thesis — Bauhaus-Universität Weimar",
      year: "2017",
      type: "Sound Design",
      role: "Sound Designer",
      medium: "Video art",
      tools: ["Analog Synthesizer", "Recorder"],
      description:
        "Created the sound design for The Reminiscence, the MFA final thesis by " +
        "Shabnam Saadi at Bauhaus-Universität Weimar. The video installation " +
        "explores the presence of women within the urban landscape and how the " +
        "city's structures cast both literal and metaphorical shadows upon them. " +
        "The soundscape was composed using analog synthesizers and field " +
        "recordings of urban ambiences, blending electronic textures with the " +
        "sonic realities of daily life in Iran.",
      linkLabel: "Watch on Vimeo",
      href: "",
      image: "https://picsum.photos/seed/reminiscence-hero/1600/1000",
      alt: "Platzhalter — Reminiscence, Videostill",
      thumb: "https://picsum.photos/seed/reminiscence-thumb/320/220",
    },
    {
      id: "winter-mood",
      tabLabel: "Winter Mood",
      title: "Winter Mood Audio Visual",
      client: "Sayeh Gallery, Tehran — with Erf Yousefi",
      year: "2016",
      type: "Audio-Visual Performance",
      role: "Visual Artist",
      medium: "Interactive visual set for live audio-visual performance",
      tools: ["TouchDesigner"],
      description:
        "Created an interactive visual set for a live audio-visual performance at " +
        "Sayeh Gallery, Tehran. The event was part of a series of independent " +
        "experimental performances. In collaboration with musician Erf Yousefi, I " +
        "designed real-time visuals that responded directly to the live audio " +
        "signal, using custom processing techniques to translate sound into " +
        "dynamic visual forms.",
      linkLabel: "Watch on Vimeo",
      href: "",
      image: "https://picsum.photos/seed/winter-mood-hero/1600/1000",
      alt: "Platzhalter — Winter Mood Performance",
      thumb: "https://picsum.photos/seed/winter-mood-thumb/320/220",
    },
    {
      id: "v-5",
      tabLabel: "V (5)",
      title: "V (5) Sound Installation",
      client: "TADAEX",
      year: "2014",
      type: "Installation",
      role: "Sound Artist, Installation Designer, Programmer",
      medium: "Interactive spatial audio installation",
      tools: ["Arduino", "MaxMSP", "Ableton Live", "Rhinoceros"],
      description:
        "Exhibited at TADAEX. Explored my early understanding of time within sonic " +
        "matter through audience interaction. Using pipes arranged by the Fibonacci " +
        "sequence and Arduino-controlled parameters, visitors could manipulate " +
        "tempo, delay and spatial movement, shaping an evolving generative " +
        "soundscape.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/v5-hero/1600/1000",
      alt: "Platzhalter — V (5) Installationsansicht",
      thumb: "https://picsum.photos/seed/v5-thumb/320/220",
    },
    {
      id: "discography",
      tabLabel: "Discography",
      title: "Discography & Collaborations",
      client: "Various international labels",
      year: "Ongoing",
      type: "Releases",
      role: "Producer, Mixing & Mastering",
      medium: "Singles, collaborative works, mixtapes",
      tools: [],
      description:
        "Produced over 30 international releases across various labels, including " +
        "singles, collaborative works and mixtapes in the dark ambient genre under " +
        "the names IDFT, Force Ignore, P01ntl355 and havytna. Also provided mixing " +
        "and mastering services for local artists, fostering cross-cultural " +
        "collaboration in experimental sound.",
      linkLabel: "",
      href: "",
      image: "https://picsum.photos/seed/discography-hero/1600/1000",
      alt: "Platzhalter — Discography",
      thumb: "https://picsum.photos/seed/discography-thumb/320/220",
    },
  ],
};

/* --------------------------------------------------------------------------
   7. MARQUEE (Endlos-Laufschrift)
   -------------------------------------------------------------------------- */
export const marquee = {
  // Diese Wörter laufen endlos durch. Zwischen je zwei Wörtern erscheint
  // automatisch das `separator`-Zeichen.
  words: ["Sound", "Space", "Perception"],
  separator: "✦",
  // Sekunden für einen kompletten Durchlauf. Größer = langsamer.
  durationSeconds: 24,
};

/* --------------------------------------------------------------------------
   8. IN HIS OWN WORDS
   --------------------------------------------------------------------------
   Statt Kundenstimmen stehen hier Zitate aus Behnouds eigenen Werkbeschreibungen.
   -------------------------------------------------------------------------- */
export const testimonials = {
  eyebrow: "In his own words",
  moreLabel: "Full CV",
  moreHref: "https://thecimal.com/cv",

  items: [
    {
      quote:
        "I can't just sit at my laptop and play. This room is a shifting wave of " +
        "my own reflections, appearing and disappearing like the ghosts of " +
        "forgotten artists who no longer exist.",
      name: "Behnoud Mohammadi",
      role: "Sound and Light Installation, International Drone Day",
      avatar: "https://picsum.photos/seed/quote-drone-day/240/240",
      alt: "Platzhalter — Porträt",
    },
    {
      quote:
        "Randomness as a compositional strategy — carefully identifying moments of " +
        "emergent momentum to shape unstable yet coherent rhythmic structures.",
      name: "Behnoud Mohammadi",
      role: "Realtime Generative Music, Revolution Art Space",
      avatar: "https://picsum.photos/seed/quote-revolution/240/240",
      alt: "Platzhalter — Porträt",
    },
    {
      quote:
        "Evolving soundscapes invited audiences to experience sound as a fluid, " +
        "living continuum.",
      name: "Behnoud Mohammadi",
      role: "Quanta Continua, Ariana Art Gallery",
      avatar: "https://picsum.photos/seed/quote-quanta/240/240",
      alt: "Platzhalter — Porträt",
    },
  ],
};

/* --------------------------------------------------------------------------
   9. CTA — "Say Hello"
   -------------------------------------------------------------------------- */
export const cta = {
  eyebrow: "Bookings & Collaboration",
  headlineTop: "Say",
  headlineBottom: "Hello",
  text:
    "For performances, installations, sound design or collaboration — write any " +
    "time. The full CV is available at thecimal.com/cv.",
  buttonLabel: "Get in touch",
  buttonHref: "mailto:thecimal@gmail.com",

  // Bild-Grid unter der Headline (Hover = leichter Zoom).
  // 4–6 Bilder sehen am ausgewogensten aus.
  images: [
    { src: "https://picsum.photos/seed/cta-1/600/700", alt: "Platzhalter — Performance" },
    { src: "https://picsum.photos/seed/cta-2/600/700", alt: "Platzhalter — Installation" },
    { src: "https://picsum.photos/seed/cta-3/600/700", alt: "Platzhalter — Studio" },
    { src: "https://picsum.photos/seed/cta-4/600/700", alt: "Platzhalter — Live-Set" },
  ],
};

/* --------------------------------------------------------------------------
   10. FOOTER
   -------------------------------------------------------------------------- */
export const footer = {
  logo: "/placeholder/logo.svg",
  logoAlt: "Thecimal",
  blurb: "Behnoud Mohammadi — Audio-Visual Performances & Sound Art.",

  // Jede Spalte ist ein Objekt mit Titel und Links.
  columns: [
    {
      title: "Practice",
      links: [
        { label: "About", href: "#statement" },
        { label: "Research & Community", href: "#mission" },
        { label: "Selected Facts", href: "#meilensteine" },
      ],
    },
    {
      title: "Works",
      links: [
        { label: "Installations", href: "#projekte" },
        { label: "Live Performances", href: "#projekte" },
        { label: "Releases", href: "#projekte" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "thecimal@gmail.com", href: "mailto:thecimal@gmail.com" },
        { label: "+995 511 725 403", href: "tel:+995511725403" },
        { label: "thecimal.com/cv", href: "https://thecimal.com/cv" },
      ],
    },
  ],

  // Keine Profil-URLs vorhanden — sobald du welche hast, hier eintragen.
  socials: [],

  copyright: "© 2026 Behnoud Mohammadi. All rights reserved.",
  legalLinks: [
    { label: "Imprint", href: "#" },
    { label: "Privacy", href: "#" },
  ],
};
