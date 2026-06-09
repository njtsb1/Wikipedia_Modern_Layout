(() => {
  const DEFAULT_LANG = 'en';
  const LANG_KEY = 'ankipedia_lang';
  const THEME_KEY = 'ankipedia_theme';

  const translations = {
    'en': {
      featured: 'Featured articles',
      welcomeTitle: 'Welcome to Ankipedia',
      welcomeMeta: 'An educational demo.',
      back: 'Back to list',
      footer: 'Ankipedia — inspired by Game of Thrones theme.',
      searchPlaceholder: 'Search articles...'
    },
    'pt-BR': {
      featured: 'Artigos em destaque',
      welcomeTitle: 'Bem-vindo à Ankipedia',
      welcomeMeta: 'Demonstração educativa.',
      back: 'Voltar à lista',
      footer: 'Ankipedia — inspirada em Game of Thrones.',
      searchPlaceholder: 'Pesquisar artigos...'
    },
    'es': {
      featured: 'Artículos destacados',
      welcomeTitle: 'Bienvenido a Ankipedia',
      welcomeMeta: 'Demostración educativa.',
      back: 'Volver a la lista',
      footer: 'Ankipedia — inspirada en Game of Thrones.',
      searchPlaceholder: 'Buscar artículos...'
    }
  };

  // Sample articles with translations
  const articles = [
    {
      id: 'got-history',
      title: { 'en': 'History of the Seven Kingdoms', 'pt-BR': 'História dos Sete Reinos', 'es': 'Historia de los Siete Reinos' },
      meta: { 'en': 'A short overview', 'pt-BR': 'Uma visão geral', 'es': 'Una visión general' },
      content: {
        'en': `<p>The Seven Kingdoms is a fictional realm with a long and complex history. This demo article is a short sample to practice layout and semantics.</p>`,
        'pt-BR': `<p>Os Sete Reinos são um reino fictício com uma história longa e complexa. Este artigo de demonstração é um exemplo curto para praticar layout e semântica.</p>`,
        'es': `<p>Los Siete Reinos son un reino ficticio con una historia larga y compleja. Este artículo de demostración es un ejemplo corto para practicar diseño y semántica.</p>`
      }
    },
    {
      id: 'dragon-lore',
      title: { 'en': 'Dragon Lore', 'pt-BR': 'Lendas dos Dragões', 'es': 'Leyendas de Dragones' },
      meta: { 'en': 'Myths and facts', 'pt-BR': 'Mitos e fatos', 'es': 'Mitos y hechos' },
      content: {
        'en': `<p>Dragons are central to many legends. In this demo we use them as a theme element to style the site.</p>`,
        'pt-BR': `<p>Dragões são centrais em muitas lendas. Nesta demo usamos eles como elemento temático para estilizar o site.</p>`,
        'es': `<p>Los dragones son centrales en muchas leyendas. En esta demo los usamos como elemento temático para estilizar el sitio.</p>`
      }
    },
    {
      id: 'map-making',
      title: { 'en': 'Maps and Navigation', 'pt-BR': 'Mapas e Navegação', 'es': 'Mapas y Navegación' },
      meta: { 'en': 'How maps shaped kingdoms', 'pt-BR': 'Como mapas moldaram reinos', 'es': 'Cómo los mapas moldearon reinos' },
      content: {
        'en': `<p>Maps are essential for navigation and strategy. This article shows how to structure content semantically.</p>`,
        'pt-BR': `<p>Mapas são essenciais para navegação e estratégia. Este artigo mostra como estruturar conteúdo semanticamente.</p>`,
        'es': `<p>Los mapas son esenciales para la navegación y la estrategia. Este artículo muestra cómo estructurar contenido semánticamente.</p>`
      }
    }
  ];

  // Elements
  const body = document.body;
  const langSelect = document.getElementById('lang-select');
  const listTitle = document.getElementById('list-title');
  const articleListEl = document.getElementById('article-list');
  const articleTitle = document.getElementById('article-title');
  const articleMeta = document.getElementById('article-meta');
  const articleContent = document.getElementById('article-content');
  const backBtn = document.getElementById('back-to-list');
  const footerText = document.getElementById('footer-text');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const themeToggle = document.getElementById('theme-toggle');

  // Initialize language
  const savedLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  setLanguage(savedLang);
  langSelect.value = savedLang;

  // Initialize theme (dark default)
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light') body.classList.add('light');
  else body.classList.remove('light');

  // Render article list
  function renderList(filter = '') {
    articleListEl.innerHTML = '';
    const lang = getLang();
    const normalized = filter.trim().toLowerCase();
    const filtered = articles.filter(a => {
      const t = a.title[lang] || a.title['en'];
      return t.toLowerCase().includes(normalized) || (a.meta[lang] || '').toLowerCase().includes(normalized);
    });
    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.innerHTML = `<div class="meta">${lang === 'pt-BR' ? 'Nenhum artigo encontrado' : lang === 'es' ? 'Ningún artículo encontrado' : 'No articles found'}</div>`;
      articleListEl.appendChild(li);
      return;
    }
    filtered.forEach(a => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = `<strong>${escapeHtml(a.title[lang] || a.title['en'])}</strong><span class="meta">${escapeHtml(a.meta[lang] || a.meta['en'])}</span>`;
      btn.addEventListener('click', () => openArticle(a.id));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openArticle(a.id); }
      });
      li.appendChild(btn);
      articleListEl.appendChild(li);
    });
  }

  // Open article by id
  function openArticle(id) {
    const a = articles.find(x => x.id === id);
    if (!a) return;
    const lang = getLang();
    articleTitle.textContent = a.title[lang] || a.title['en'];
    articleMeta.textContent = a.meta[lang] || a.meta['en'];
    articleContent.innerHTML = a.content[lang] || a.content['en'];
    articleContent.querySelectorAll('a')?.forEach(link => link.setAttribute('rel','noopener'));
    document.getElementById('article-view').focus();
    // For small screens, scroll into view
    if (window.innerWidth < 900) document.getElementById('article-view').scrollIntoView({behavior:'smooth'});
  }

  // Back to list
  backBtn.addEventListener('click', () => {
    articleTitle.textContent = translations[getLang()].welcomeTitle;
    articleMeta.textContent = translations[getLang()].welcomeMeta;
    articleContent.innerHTML = `<p>${translations[getLang()].welcomeMeta}</p>`;
    searchInput.focus();
  });

  // Language change
  langSelect.addEventListener('change', (e) => {
    const v = e.target.value;
    setLanguage(v);
    localStorage.setItem(LANG_KEY, v);
  });

  function setLanguage(code) {
    const lang = code || DEFAULT_LANG;
    langSelect.value = lang;
    listTitle.textContent = translations[lang].featured;
    articleTitle.textContent = translations[lang].welcomeTitle;
    articleMeta.textContent = translations[lang].welcomeMeta;
    footerText.textContent = translations[lang].footer;
    searchInput.placeholder = translations[lang].searchPlaceholder;
    renderList(searchInput.value || '');
  }

  function getLang() {
    return langSelect.value || DEFAULT_LANG;
  }

  // Search
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    renderList(searchInput.value);
  });
  searchInput.addEventListener('input', () => renderList(searchInput.value));

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  });

  // Utility: escape HTML for safety
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  // Keyboard: Home logo returns to top
  document.getElementById('home').addEventListener('click', (e) => {
    e.preventDefault();
    articleTitle.textContent = translations[getLang()].welcomeTitle;
    articleMeta.textContent = translations[getLang()].welcomeMeta;
    articleContent.innerHTML = `<p>${translations[getLang()].welcomeMeta}</p>`;
    window.scrollTo({top:0,behavior:'smooth'});
  });

  // Initial render
  renderList();

  // Respect user prefers-color-scheme only if no saved theme
  (function respectPrefers() {
    if (!localStorage.getItem(THEME_KEY)) {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      if (prefersLight) body.classList.add('light');
    }
  })();

})();
