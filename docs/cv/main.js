const STORAGE_KEY = "cv-lang";
const LANGS = new Set(["en", "es"]);

const strings = {
  en: {
    title: "Sergio Castaño Sánchez — CV",
    desc: "CV — Sergio Castaño Sánchez, Software Engineering student in Málaga.",
    "og.desc": "Software Engineering student in Málaga",
    skip: "Skip to content",
    langNav: "Language",
    pdf: "Download PDF",
    role: "Software Engineering student",
    location: "Málaga, Spain",
    "sec.about": "// about",
    about:
      "Software Engineering student at the University of Málaga. I am interested in system design and architecture: understanding how the different parts of a project work and how they connect.",
    "sec.skills": "// skills",
    "skills.languages": "Programming languages",
    "skills.frameworks": "Frameworks & libraries",
    "skills.tools": "Tools/infra",
    "skills.ai": "AI tooling",
    "skills.spoken": "Spoken",
    "skills.spanish": "Spanish — native",
    "skills.english": "English — C2 (Cambridge)",
    "sec.studies": "// studies",
    "studies.degree": "Bachelor's Degree in Software Engineering",
    "studies.school": "University of Málaga",
    "studies.year": "Currently 3rd year",
    "studies.electives": "Electives",
    "sec.collab": "// collaborations",
    "landscape.pitch":
      "Contributions to CNCF Landscape 2, the generator behind landscape.cncf.io.",
    "landscape.b1":
      "CSV export, TAG metadata, and validation of landscape data.",
    "landscape.b2":
      "GitHub Action and reusable workflows to build and deploy landscape sites.",
    "landscape.date": "2023",
    "landscape.more": "and more",
    "landscape.pr168": "Generate CSV file listing all landscape items",
    "landscape.pr7": "Add reusable build-and-deploy workflow",
    "landscape.pr1": "Add landscape2 validate action",
    "sec.projects": "// projects",
    "silo.pitch":
      "Each repo gets a stable Linux workspace on macOS so agents and tools share one environment, instead of a disposable container every session. The project stays mounted with explicit persistent state, so the workspace can outlive a single run without leaking tools across projects.",
    "silo.date": "Aug 2026",
    "cielo.pitch":
      "An installable weather app that turns AEMET forecasts into static files. App and forecast data are built separately so each can update on its own schedule, and served from an S3-compatible bucket.",
    "cielo.date": "Jul 2026",
    "grpc.pitch":
      "A calculator built to practice crossing service and language boundaries, not to compute faster. The UI, HTTP gateway, and compute service stay separate, with a typed contract in the middle so each piece can change on its own.",
    "grpc.date": "Mar 2026",
    "todone.pitch":
      "A local-first desktop Kanban so tasks stay on the machine and never need an account. The UI talks to a native backend with an on-disk database, which keeps the app fast and private without a server.",
    "todone.date": "Jan 2026",
    "unitowork.pitch":
      "A job board for students and recent graduates, aimed at entry-level listings that do not assume prior experience. The site is server-rendered as one deployable binary, and new postings go through admin review before they are public.",
    "unitowork.date": "Jun 2025",
    "link.docs": "Docs",
    "link.live": "Live",
  },
  es: {
    title: "Sergio Castaño Sánchez — CV",
    desc: "CV — Sergio Castaño Sánchez, estudiante de Ingeniería del Software en Málaga.",
    "og.desc": "Estudiante de Ingeniería del Software en Málaga",
    skip: "Saltar al contenido",
    langNav: "Idioma",
    pdf: "Descargar PDF",
    role: "Estudiante de Ingeniería del Software",
    location: "Málaga, España",
    "sec.about": "// sobre mí",
    about:
      "Estudiante de Ingeniería del Software en la Universidad de Málaga. Me interesa el diseño y la arquitectura de sistemas: entender cómo funcionan y se conectan las distintas partes de un proyecto.",
    "sec.skills": "// habilidades",
    "skills.languages": "Lenguajes de programación",
    "skills.frameworks": "Frameworks y librerías",
    "skills.tools": "Herramientas/infra",
    "skills.ai": "Herramientas de IA",
    "skills.spoken": "Idiomas",
    "skills.spanish": "Español — nativo",
    "skills.english": "Inglés — C2 (Cambridge)",
    "sec.studies": "// estudios",
    "studies.degree": "Grado en Ingeniería del Software",
    "studies.school": "Universidad de Málaga",
    "studies.year": "Cursando 3.º",
    "studies.electives": "Optativas",
    "sec.collab": "// colaboraciones",
    "landscape.pitch":
      "Colaboraciones en CNCF Landscape 2, el generador de landscape.cncf.io.",
    "landscape.b1":
      "Exportación CSV, metadatos de TAG y validación de datos del landscape.",
    "landscape.b2":
      "GitHub Action y workflows reutilizables para construir y desplegar los sitios.",
    "landscape.date": "2023",
    "landscape.more": "y más",
    "landscape.pr168": "Generar un CSV con todos los elementos del landscape",
    "landscape.pr7": "Añadir un workflow reutilizable de build y deploy",
    "landscape.pr1": "Añadir la action de validación de landscape2",
    "sec.projects": "// proyectos",
    "silo.pitch":
      "Cada repo tiene un workspace Linux estable en macOS para que agentes y herramientas compartan un entorno, en lugar de un contenedor desechable en cada sesión. El proyecto permanece montado y el estado persistente es explícito, de modo que el workspace sobrevive a una ejecución sin mezclar herramientas entre proyectos.",
    "silo.date": "ago. 2026",
    "cielo.pitch":
      "Una app instalable del tiempo que convierte las predicciones de AEMET en ficheros estáticos. La app y los datos de predicción se generan por separado para poder actualizarlos a distinto ritmo, y servirlos desde un bucket compatible con S3.",
    "cielo.date": "jul. 2026",
    "grpc.pitch":
      "Una calculadora hecha para practicar el cruce de límites entre servicios y lenguajes, no para calcular más rápido. La UI, la pasarela HTTP y el servicio de cálculo van por separado, con un contrato tipado en medio para que cada pieza pueda cambiar por su cuenta.",
    "grpc.date": "mar. 2026",
    "todone.pitch":
      "Un Kanban de escritorio local-first para que las tareas se queden en el ordenador y no haga falta una cuenta. La UI habla con un backend nativo y una base de datos en disco, lo que mantiene la app rápida y privada sin servidor.",
    "todone.date": "ene. 2026",
    "unitowork.pitch":
      "Un tablón de empleo para estudiantes y recién titulados, centrado en ofertas de entrada que no asumen experiencia previa. El sitio se renderiza en el servidor como un único binario desplegable, y las nuevas ofertas pasan por revisión de administración antes de publicarse.",
    "unitowork.date": "jun. 2025",
    "link.docs": "Docs",
    "link.live": "Sitio",
  },
};

function queryLang() {
  return new URLSearchParams(location.search).get("lang");
}

function storedLang() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

function deviceLang() {
  const raw =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    "en";
  return String(raw).toLowerCase().startsWith("es") ? "es" : "en";
}

function pickLang(...candidates) {
  for (const value of candidates) {
    if (LANGS.has(value)) return value;
  }
  return "en";
}

function pageUrl(lang) {
  return `https://serg-cs.github.io/serg-cs/cv/?lang=${lang}`;
}

function syncUrl(lang) {
  try {
    const url = new URL(location.href);
    if (url.searchParams.get("lang") === lang) return;
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  } catch (_) {
    /* file:// or opaque origin */
  }
}

function apply(lang) {
  const dict = strings[lang];
  document.documentElement.lang = lang;
  document.documentElement.classList.remove("i18n-pending");
  if (!document.documentElement.className) {
    document.documentElement.removeAttribute("class");
  }
  document.title = dict.title;

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = dict.desc;

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", dict.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", dict["og.desc"]);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", pageUrl(lang));

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) {
    ogLocale.setAttribute("content", lang === "es" ? "es_ES" : "en_US");
  }

  const ogLocaleAlt = document.querySelector('meta[property="og:locale:alternate"]');
  if (ogLocaleAlt) {
    ogLocaleAlt.setAttribute("content", lang === "es" ? "en_US" : "es_ES");
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", pageUrl(lang));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key && dict[key] != null) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key && dict[key] != null) el.setAttribute("title", dict[key]);
  });

  document.querySelector(".lang")?.setAttribute("aria-label", dict.langNav);

  document.querySelectorAll("[data-set-lang]").forEach((el) => {
    if (el.dataset.setLang === lang) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });

  const pdf = document.querySelector(".pdf-btn");
  if (pdf) {
    pdf.href = `cv-${lang}.pdf`;
    pdf.download = `Sergio-Castano-Sanchez-CV-${lang}.pdf`;
  }

  syncUrl(lang);
  document.body.classList.add("ready");
}

function setLang(lang) {
  apply(lang);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_) {
    /* ignore */
  }
}

document.querySelectorAll("[data-set-lang]").forEach((el) => {
  el.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setLang(el.dataset.setLang);
  });
});

apply(pickLang(queryLang(), storedLang(), deviceLang()));
