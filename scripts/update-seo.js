const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const siteUrl = "https://zomeren.studio";
const defaultImage = `${siteUrl}/assets/images/marco/marco_van_zomeren_studio.webp`;

const zodiacNamesEn = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces"
};

const zodiacNamesNl = {
  aries: "Ram",
  taurus: "Stier",
  gemini: "Tweelingen",
  cancer: "Kreeft",
  leo: "Leeuw",
  virgo: "Maagd",
  libra: "Weegschaal",
  scorpio: "Schorpioen",
  sagittarius: "Boogschutter",
  capricorn: "Steenbok",
  aquarius: "Waterman",
  pisces: "Vissen"
};

const baseMeta = {
  "index.html": {
    title: "zomeren.studio | Making brands resonate with their highest potential",
    description: "Branding, motion, UI/UX, AI and holistic design by Marco van Zomeren. Making brands resonate with their highest potential.",
    schemaType: "WebPage"
  },
  "about.html": {
    title: "About | zomeren.studio",
    description: "About Marco van Zomeren and zomeren.studio, a Dutch boutique studio at the intersection of design, music and astrology."
  },
  "work.html": {
    title: "Work | zomeren.studio",
    description: "Selected branding, webdesign and digital case studies created by Marco van Zomeren with KR Communicatie and WADM.",
    schemaType: "CollectionPage"
  },
  "design.html": {
    title: "Design | zomeren.studio",
    description: "Explore branding, motion, UI/UX and AI expertise at zomeren.studio."
  },
  "branding.html": {
    title: "Branding | zomeren.studio",
    description: "Brand strategy and identity design that translate a client's essence into visual synergy."
  },
  "motion.html": {
    title: "Motion | zomeren.studio",
    description: "Motion design that turns brand essence into movement, rhythm and resonance."
  },
  "ui-ux.html": {
    title: "UI/UX | zomeren.studio",
    description: "User-centered digital experiences shaped by clarity, structure and holistic thinking."
  },
  "ai.html": {
    title: "AI | zomeren.studio",
    description: "AI-driven creative exploration across design, prototyping, image, video and music."
  },
  "holism.html": {
    title: "Holism | zomeren.studio",
    description: "Holistic brand strategy and astrology-informed identity work by Marco van Zomeren."
  },
  "branergy-method.html": {
    title: "Branergy Method | zomeren.studio",
    description: "Branergy is a holistic method that helps brands discover their true potential and express it fully."
  },
  "human.html": {
    title: "Human | zomeren.studio",
    description: "Four human systems, one integrated network: structure, information, circulation and regulation."
  },
  "rythm.html": {
    title: "Rhythm | zomeren.studio",
    description: "Four dimensions of rhythm, one principle: pattern, repetition, tension and release."
  },
  "music.html": {
    title: "Music | zomeren.studio",
    description: "Electronic releases by Marco van Zomeren, from pounding beats to sizzling synths and bombastic basslines.",
    schemaType: "CollectionPage"
  },
  "contact.html": {
    title: "Contact | zomeren.studio",
    description: "Start a branding, motion, UI/UX or AI project with zomeren.studio."
  },
  "doa.html": {
    title: "Design On Acid | zomeren.studio",
    description: "Design On Acid showcases leading designers, agencies, graphics and motion through a holistic lens."
  },
  "astrology.html": {
    title: "Astrology | zomeren.studio",
    description: "Explore zodiac signs, elements and symbolic meanings through a clean astrological index.",
    schemaType: "CollectionPage"
  },
  "projects/mindstone.html": {
    title: "Mindstone | zomeren.studio",
    description: "Mindstone branding case study by Marco van Zomeren for WADM.",
    schemaType: "CreativeWork",
    image: `${siteUrl}/assets/images/projects/mindstone/mindstone_design_by_wadm_1.webp`
  },
  "projects/gearfreak.html": {
    title: "Gearfreak | zomeren.studio",
    description: "Gearfreak brand identity case study by Marco van Zomeren for WADM.",
    schemaType: "CreativeWork",
    image: `${siteUrl}/assets/images/projects/gearfreak/1_gearfreak_design-by-wadm.webp`
  },
  "projects/keller.html": {
    title: "Keller | zomeren.studio",
    description: "Keller brand identity case study by Marco van Zomeren for WADM.",
    schemaType: "CreativeWork",
    image: `${siteUrl}/assets/images/projects/keller/1-keller-design-by-wadm.webp`
  },
  "projects/ultimo.html": {
    title: "Ultimo | zomeren.studio",
    description: "Ultimo webdesign case study by Marco van Zomeren for WADM.",
    schemaType: "CreativeWork",
    image: `${siteUrl}/assets/images/projects/ultimo/1-ultimo-design-by-wadm.webp`
  },
  "projects/medigo.html": {
    title: "Medigo | zomeren.studio",
    description: "Medigo website case study by Marco van Zomeren for WADM.",
    schemaType: "CreativeWork",
    image: `${siteUrl}/assets/images/projects/medigo/1_medigo_design-by-wadm.webp`
  }
};

const nlOverrides = {
  "nl/index.html": {
    title: "zomeren.studio | Merken laten resoneren met hun hoogste potentieel",
    description: "Branding, motion, UI/UX, AI en holistisch design door Marco van Zomeren. Merken laten resoneren met hun hoogste potentieel."
  },
  "nl/about.html": {
    title: "Over | zomeren.studio",
    description: "Over Marco van Zomeren en zomeren.studio, een Nederlandse boutique studio op het snijvlak van design, muziek en astrologie."
  },
  "nl/work.html": {
    title: "Werk | zomeren.studio",
    description: "Geselecteerde branding-, webdesign- en digitale cases van Marco van Zomeren met KR Communicatie en WADM."
  },
  "nl/design.html": {
    title: "Ontwerp | zomeren.studio",
    description: "Verken branding, motion, UI/UX en AI expertise van zomeren.studio."
  },
  "nl/branding.html": {
    title: "Branding | zomeren.studio",
    description: "Merkstrategie en identiteit die de essentie van een klant vertaalt naar visuele synergie."
  },
  "nl/motion.html": {
    title: "Motion | zomeren.studio",
    description: "Motion design dat merkeigenheid vertaalt naar beweging, ritme en resonantie."
  },
  "nl/ui-ux.html": {
    title: "UI/UX | zomeren.studio",
    description: "Gebruikersgerichte digitale ervaringen gevormd door helderheid, structuur en holistisch denken."
  },
  "nl/ai.html": {
    title: "AI | zomeren.studio",
    description: "AI-gedreven creatieve exploratie in design, prototyping, beeld, video en muziek."
  },
  "nl/holism.html": {
    title: "Holisme | zomeren.studio",
    description: "Holistische merkstrategie en astrologisch geinformeerd identiteitswerk door Marco van Zomeren."
  },
  "nl/branergy-methode.html": {
    title: "Branergy Methode | zomeren.studio",
    description: "Branergy is een holistische methode die merken helpt hun ware potentieel te ontdekken en volledig uit te drukken."
  },
  "nl/human.html": {
    title: "Mens | zomeren.studio",
    description: "Vier menselijke systemen, een geintegreerd netwerk: structuur, informatie, circulatie en regulatie."
  },
  "nl/rythm.html": {
    title: "Ritme | zomeren.studio",
    description: "Vier dimensies van ritme, een principe: patroon, herhaling, spanning en ontspanning."
  },
  "nl/music.html": {
    title: "Muziek | zomeren.studio",
    description: "Elektronische releases van Marco van Zomeren, van stampende beats tot sissende synths en bombastische baslijnen."
  },
  "nl/contact.html": {
    title: "Contact | zomeren.studio",
    description: "Start een branding-, motion-, UI/UX- of AI-project met zomeren.studio."
  },
  "nl/doa.html": {
    title: "Design On Acid | zomeren.studio",
    description: "Design On Acid toont toonaangevende ontwerpers, bureaus, graphics en motion vanuit een holistische blik."
  },
  "nl/astrology.html": {
    title: "Astrologie | zomeren.studio",
    description: "Verken sterrenbeelden, elementen en symbolische betekenissen via een heldere astrologische index."
  }
};

const duplicateCanonicals = {
  "branergy-methode.html": "nl/branergy-methode.html",
  "nl/branergy-method.html": "nl/branergy-methode.html"
};

function walkHtmlFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === "assets") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, out);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(fullPath);
    }
  }
  return out;
}

function prettyUrlFromRel(relPath) {
  if (relPath === "index.html") return `${siteUrl}/`;
  if (relPath === "nl/index.html") return `${siteUrl}/nl/`;
  return `${siteUrl}/${relPath.replace(/\.html$/, "/")}`;
}

function canonicalRel(relPath) {
  return duplicateCanonicals[relPath] || relPath;
}

function counterpartRel(relPath) {
  if (relPath === "branergy-method.html") return "nl/branergy-methode.html";
  if (relPath === "nl/branergy-methode.html") return "branergy-method.html";
  if (relPath.startsWith("nl/")) {
    const candidate = relPath.slice(3);
    return fs.existsSync(path.join(siteRoot, candidate)) ? candidate : null;
  }
  const candidate = path.posix.join("nl", relPath);
  return fs.existsSync(path.join(siteRoot, candidate)) ? candidate : null;
}

function getMeta(relPath) {
  const canonicalPath = canonicalRel(relPath);
  const isCanonicalNl = canonicalPath.startsWith("nl/");
  const lang = isCanonicalNl ? "nl" : "en";
  const locale = isCanonicalNl ? "nl_NL" : "en_US";
  const isNoIndex = relPath.includes("project-template.html") || relPath in duplicateCanonicals;
  const counterpart = counterpartRel(canonicalPath);

  let meta = baseMeta[canonicalPath];
  if (isCanonicalNl && nlOverrides[canonicalPath]) meta = nlOverrides[canonicalPath];
  if (!meta && isCanonicalNl) {
    const enRel = canonicalPath.slice(3);
    const base = baseMeta[enRel];
    if (base) {
      meta = {
        ...base,
        title: base.title,
        description: base.description
      };
    }
  }

  if (!meta) {
    const zodiacMatch = canonicalPath.match(/^(nl\/)?astrology\/([a-z-]+)\.html$/);
    if (zodiacMatch) {
      const slug = zodiacMatch[2];
      const name = isCanonicalNl ? zodiacNamesNl[slug] : zodiacNamesEn[slug];
      meta = isCanonicalNl
        ? {
            title: `${name} | Astrologie | zomeren.studio`,
            description: `${name} in de astrologie: kerntrekken, kwaliteiten, uitdagingen en symbolische betekenis.`,
            schemaType: "WebPage"
          }
        : {
            title: `${name} | Astrology | zomeren.studio`,
            description: `${name} in astrology: core traits, strengths, challenges and symbolic meaning.`,
            schemaType: "WebPage"
          };
    }
  }

  if (!meta) {
    meta = isCanonicalNl
      ? {
          title: "zomeren.studio",
          description: "Holistisch design, branding en digitale ervaringen door Marco van Zomeren.",
          schemaType: "WebPage"
        }
      : {
          title: "zomeren.studio",
          description: "Holistic design, branding and digital experiences by Marco van Zomeren.",
          schemaType: "WebPage"
        };
  }

  const canonicalUrl = prettyUrlFromRel(canonicalPath);
  const counterpartUrl = counterpart ? prettyUrlFromRel(counterpart) : null;
  const xDefaultUrl = counterpart ? (canonicalPath.startsWith("nl/") ? counterpartUrl : canonicalUrl) : `${siteUrl}/`;
  const ogImage = meta.image || defaultImage;

  let schema;
  if (canonicalPath === "index.html") {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "zomeren.studio",
          url: `${siteUrl}/`,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/assets/favicon/android-chrome-512x512.png`
          },
          sameAs: [
            "https://www.youtube.com/@designonacid",
            "https://www.instagram.com/zomeren.studio",
            "https://www.linkedin.com/company/design-on-acid/"
          ]
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: `${siteUrl}/`,
          name: "zomeren.studio",
          inLanguage: "en-US",
          publisher: { "@id": `${siteUrl}/#organization` }
        },
        {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: meta.title,
          description: meta.description,
          inLanguage: "en-US",
          isPartOf: { "@id": `${siteUrl}/#website` },
          about: { "@id": `${siteUrl}/#organization` }
        }
      ]
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": meta.schemaType || "WebPage",
      name: meta.title,
      description: meta.description,
      url: canonicalUrl,
      inLanguage: isCanonicalNl ? "nl-NL" : "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "zomeren.studio",
        url: `${siteUrl}/`
      }
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    canonicalUrl,
    locale,
    lang,
    ogImage,
    counterpartUrl,
    xDefaultUrl,
    isNoIndex,
    schemaJson: JSON.stringify(schema)
  };
}

function buildSeoBlock(meta) {
  const alternateLang = meta.lang === "en" ? "nl" : "en";
  const lines = [
    `    <title>${meta.title}</title>`,
    `    <meta name="description" content="${meta.description}" />`,
    `    <meta name="robots" content="${meta.isNoIndex ? "noindex,follow" : "index,follow"}" />`,
    `    <meta name="author" content="Marco van Zomeren" />`,
    `    <link rel="canonical" href="${meta.canonicalUrl}" />`
  ];

  if (meta.counterpartUrl) {
    lines.push(`    <link rel="alternate" hreflang="${meta.lang}" href="${meta.canonicalUrl}" />`);
    lines.push(`    <link rel="alternate" hreflang="${alternateLang}" href="${meta.counterpartUrl}" />`);
    lines.push(`    <link rel="alternate" hreflang="x-default" href="${meta.xDefaultUrl}" />`);
  }

  lines.push(
    `    <meta property="og:locale" content="${meta.locale}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:title" content="${meta.title}" />`,
    `    <meta property="og:description" content="${meta.description}" />`,
    `    <meta property="og:url" content="${meta.canonicalUrl}" />`,
    `    <meta property="og:site_name" content="zomeren.studio" />`,
    `    <meta property="og:image" content="${meta.ogImage}" />`,
    `    <meta property="og:image:alt" content="zomeren.studio" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${meta.title}" />`,
    `    <meta name="twitter:description" content="${meta.description}" />`,
    `    <meta name="twitter:image" content="${meta.ogImage}" />`,
    `    <script type="application/ld+json">${meta.schemaJson}</script>`
  );

  return lines.join("\n");
}

for (const fullPath of walkHtmlFiles(siteRoot)) {
  const relPath = path.relative(siteRoot, fullPath).replace(/\\/g, "/");
  const meta = getMeta(relPath);
  let html = fs.readFileSync(fullPath, "utf8");

  const seoBlock = buildSeoBlock(meta);
  html = html.replace(
    /<title>[\s\S]*?(?=\s*<link href="[^"]*dist\/output\.css" rel="stylesheet"\s*\/>)/,
    seoBlock
  );

  fs.writeFileSync(fullPath, html);
}

console.log("SEO metadata updated.");
