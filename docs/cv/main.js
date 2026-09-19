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
    "silo.pitch": "Per-project Linux workspaces on macOS.",
    "silo.b1":
      "A CLI runs a reusable container per repo so tools and agents share one environment.",
    "silo.date": "Aug 2026",
    "cielo.pitch": "Installable AEMET weather app, published as static files.",
    "cielo.b1": "A Rust CLI builds the app and the forecast data separately.",
    "cielo.date": "Jul 2026",
    "grpc.pitch": "Calculator split across three services.",
    "grpc.b1":
      "Svelte UI → Go HTTP → Rust gRPC, with protobuf as the contract.",
    "grpc.date": "Mar 2026",
    "todone.pitch": "Desktop Kanban that stores tasks on your computer.",
    "todone.b1":
      "React/TypeScript UI, Rust (Tauri) backend, SQLite — no account.",
    "todone.date": "Jan 2026",
    "unitowork.pitch": "Job board for students and recent graduates.",
    "unitowork.b1":
      "Rust (Axum), HTMX and PostgreSQL; listings are reviewed before they go live.",
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
    "silo.pitch": "Workspaces Linux por proyecto en macOS.",
    "silo.b1":
      "Una CLI lanza un contenedor reutilizable por repo para que herramientas y agentes compartan el entorno.",
    "silo.date": "ago. 2026",
    "cielo.pitch":
      "App instalable del tiempo de AEMET, publicada como ficheros estáticos.",
    "cielo.b1":
      "Una CLI en Rust genera la app y los datos de predicción por separado.",
    "cielo.date": "jul. 2026",
    "grpc.pitch": "Calculadora repartida en tres servicios.",
    "grpc.b1":
      "UI en Svelte → HTTP en Go → gRPC en Rust, con protobuf como contrato.",
    "grpc.date": "mar. 2026",
    "todone.pitch":
      "Kanban de escritorio que guarda las tareas en el ordenador.",
    "todone.b1":
      "UI en React/TypeScript, backend en Rust (Tauri), SQLite — sin cuenta.",
    "todone.date": "ene. 2026",
    "unitowork.pitch": "Tablón de empleo para estudiantes y recién titulados.",
    "unitowork.b1":
      "Rust (Axum), HTMX y PostgreSQL; las ofertas se revisan antes de publicarse.",
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
