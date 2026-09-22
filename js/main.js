document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const languageToggle = document.querySelector('.lang-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const dialog = document.querySelector('#project-dialog');
  const copyStatus = document.querySelector('#copy-status');
  let activeStudy = null;
  let dialogTrigger = null;
  const saved = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const persist = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Optional browser storage. */ } };
  const text = (vi, en) => root.lang === 'en' ? en : vi;

  const caseStudies = {
    scores: {
      number: '01',
      vi: {
        title: 'Từ API mã hóa đến hệ thống tra cứu có người dùng thật',
        intro: 'THPT Score Explorer 2026 xử lý toàn bộ vòng đời dữ liệu: crawl, kiểm tra, chuẩn hóa, lưu trữ, tra cứu và theo dõi vận hành.',
        highlights: [
          ['01 / Data pipeline', 'Crawler Python gửi request song song, giải mã AES-GCM và chuẩn hóa dữ liệu về một schema thống nhất.'],
          ['02 / Data processing', 'Dữ liệu được giải mã, chuẩn hóa và nhập theo batch; file lop10.json có 13.290 hồ sơ local được dùng để tính rank theo tỉnh/trường.'],
          ['03 / Search performance', 'API kiểm tra SBD 8 chữ số và cache kết quả để giảm tải cho các truy vấn lặp lại.'],
          ['04 / Result', 'Website được triển khai trên Vercel; API hỗ trợ tra cứu, ghi log tìm kiếm và xếp hạng với get_rankings. Dữ liệu được nhập Supabase theo batch 500 bản ghi.']
        ]
      },
      en: {
        title: 'From an encrypted API to a product with real users',
        intro: 'THPT Score Explorer 2026 covers the full data lifecycle: crawling, validation, normalization, storage, lookup and operations.',
        highlights: [
          ['01 / Data pipeline', 'A Python crawler sends parallel requests, decrypts AES-GCM payloads and normalizes data into one schema.'],
          ['02 / Data processing', 'Data is decrypted, normalized and imported in batches; lop10.json contains 13,290 local records used for province/school ranking.'],
          ['03 / Search performance', 'The API validates 8-digit candidate numbers and caches results to reduce repeated query load.'],
          ['04 / Result', 'The website is deployed on Vercel, with lookup, search logging and get_rankings-based rankings. Data is imported into Supabase in batches of 500.']
        ]
      }
    },
    smartshop: {
      number: '02',
      vi: {
        title: 'Từ luồng đăng nhập đến backend xác thực có trạng thái rõ ràng',
        intro: 'SmartShopAI tập trung xây dựng backend xác thực cho ứng dụng thương mại điện tử bằng Spring Boot, Spring Security, JPA và PostgreSQL.',
        highlights: [
          ['01 / Auth API', 'REST API đăng ký và đăng nhập tại /api/auth được tách qua AuthController, AuthService và UserRepository.'],
          ['02 / User model', 'Entity User quản lý username duy nhất, password, role và full name, kết nối PostgreSQL bằng Spring Data JPA.'],
          ['03 / Token flow', 'JWT HS256 được tạo và kiểm tra qua JwtUtil; session được cấu hình stateless và CORS được bật cho luồng ứng dụng.'],
          ['04 / Protection', 'Các endpoint ngoài luồng auth yêu cầu xác thực, giữ ranh giới rõ giữa public auth flow và protected API.']
        ]
      },
      en: {
        title: 'From login flows to a backend with explicit authentication states',
        intro: 'SmartShopAI focuses on authentication backend work for an e-commerce application using Spring Boot, Spring Security, JPA and PostgreSQL.',
        highlights: [
          ['01 / Auth API', 'Registration and login REST APIs live under /api/auth through AuthController, AuthService and UserRepository.'],
          ['02 / User model', 'The User entity contains a unique username, password, role and full name, persisted to PostgreSQL with Spring Data JPA.'],
          ['03 / Token flow', 'JWT HS256 is created and validated through JwtUtil; the application uses stateless sessions and CORS.'],
          ['04 / Protection', 'Endpoints outside the auth flow require authentication, keeping the public auth flow separate from protected APIs.']
        ]
      }
    },
    'math-exam': {
      number: '03',
      vi: {
        title: 'Từ tài liệu rời rạc đến pipeline question bank',
        intro: 'MathExam Platform kết nối extraction, OCR review, question bank và exam session trong một hệ thống có trạng thái rõ ràng.',
        highlights: [
          ['01 / Extraction', 'PDF có text dùng native extraction trước; tài liệu scan đi qua OCR fallback.'],
          ['02 / Fidelity', 'LaTeX, bảng, hình, reading order và cảnh báo uncertainty được giữ lại; lỗi chưa chắc chắn chuyển sang needs_manual_review.'],
          ['03 / Exam workflow', 'Question bank và quy trình tạo đề hỗ trợ CRUD, lọc/phân trang, publish/archive, topic, bulk tag, tạo đề theo ma trận và snapshot câu hỏi; schema đi qua 21 Flyway migration.'],
          ['04 / Exam session', 'Phiên thi có autosave, submit/hết hạn, ba chiến lược chấm điểm, lịch sử kết quả và analytics theo học sinh.'],
          ['05 / OCR operations', 'Luồng tài liệu chính đi qua Spring Boot → MinIO/S3 → RabbitMQ → worker → PostgreSQL → kiểm duyệt → question bank. FastAPI/SQLite là dịch vụ OCR trực tiếp riêng; kết quả chưa chắc chắn cần needs_manual_review.']
        ]
      },
      en: {
        title: 'From scattered documents to a question-bank pipeline',
        intro: 'MathExam Platform connects extraction, OCR review, question banks and exam sessions in one system with explicit states.',
        highlights: [
          ['01 / Extraction', 'Text-based PDFs use native extraction first; scanned documents use the OCR fallback.'],
          ['02 / Fidelity', 'LaTeX, tables, figures, reading order and uncertainty warnings are preserved; unclear cases fall back to needs_manual_review.'],
          ['03 / Exam workflow', 'Question-bank and exam creation support CRUD, filtering/pagination, publish/archive, topics, bulk tags, matrix-based generation and question snapshots across 21 Flyway migrations.'],
          ['04 / Exam session', 'Exam sessions support autosave, submit/expiry, three grading strategies, result history and student analytics.'],
          ['05 / OCR operations', 'The main document flow is Spring Boot → MinIO/S3 → RabbitMQ → worker → PostgreSQL → review → question bank. FastAPI/SQLite is a separate direct OCR service; uncertain output requires needs_manual_review.']
        ]
      }
    }
  };

  function renderStudy(id) {
    const study = caseStudies[id];
    if (!study) return;
    const copy = study[root.lang];
    document.querySelector('#dialog-number').textContent = study.number;
    document.querySelector('#dialog-title').textContent = copy.title;
    document.querySelector('#dialog-copy').textContent = copy.intro;
    document.querySelector('#dialog-highlights').replaceChildren(...copy.highlights.map(([heading, body]) => {
      const item = document.createElement('div');
      item.className = 'dialog-highlight';
      const title = document.createElement('strong');
      title.textContent = heading;
      const content = document.createElement('span');
      content.textContent = body;
      item.append(title, content);
      return item;
    }));
  }

  function updateControlLabels() {
    const dark = root.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', dark ? text('Chuyển giao diện sáng', 'Switch to light theme') : text('Chuyển giao diện tối', 'Switch to dark theme'));
    themeToggle.setAttribute('aria-pressed', String(dark));
    languageToggle.setAttribute('aria-label', text('Switch to English', 'Chuyển sang tiếng Việt'));
    menuToggle.setAttribute('aria-label', nav.classList.contains('is-open') ? text('Đóng menu', 'Close menu') : text('Mở menu', 'Open menu'));
    nav.setAttribute('aria-label', text('Điều hướng chính', 'Main navigation'));
    document.querySelector('.dialog-close').setAttribute('aria-label', text('Đóng chi tiết dự án', 'Close case study'));
  }

  function applyLanguage(language) {
    root.lang = language === 'en' ? 'en' : 'vi';
    document.querySelectorAll('[data-vi][data-en]').forEach(element => {
      element.textContent = element.dataset[root.lang];
    });
    const description = text(
      'Hưng Nguyễn — Software Developer. Các dự án web, backend và xử lý dữ liệu với Next.js, Spring Boot và Python.',
      'Hưng Nguyễn — Software Developer. Web, backend and data projects built with Next.js, Spring Boot and Python.'
    );
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:locale"]').content = root.lang === 'en' ? 'en_US' : 'vi_VN';
    updateControlLabels();
    copyStatus.textContent = '';
    if (dialog.open && activeStudy) renderStudy(activeStudy);
    persist('portfolio-language', root.lang);
  }

  function applyTheme(theme) {
    root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = root.dataset.theme === 'dark' ? '#101923' : '#f7f9fc';
    updateControlLabels();
    persist('portfolio-theme', root.dataset.theme);
  }

  function closeMenu(returnFocus = false) {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    updateControlLabels();
    if (returnFocus) menuToggle.focus();
  }

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    updateControlLabels();
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('is-open') && !event.target.closest('.nav-shell')) closeMenu();
  });
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  mobileQuery.addEventListener('change', () => closeMenu());
  themeToggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  languageToggle.addEventListener('click', () => applyLanguage(root.lang === 'vi' ? 'en' : 'vi'));
  applyLanguage(saved('portfolio-language') || 'vi');
  applyTheme(saved('portfolio-theme') || 'light');

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => reveal.observe(element));

    const links = [...nav.querySelectorAll('a')];
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => spy.observe(section));
  }

  document.querySelectorAll('.project-more').forEach(button => button.addEventListener('click', () => {
    if (!caseStudies[button.dataset.project]) return;
    activeStudy = button.dataset.project;
    dialogTrigger = button;
    renderStudy(activeStudy);
    dialog.showModal();
    dialog.scrollTop = 0;
  }));
  document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    activeStudy = null;
    dialogTrigger?.focus({ preventScroll: true });
  });

  document.querySelector('.copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('hungvanvip@gmail.com');
      copyStatus.textContent = text('Đã sao chép email.', 'Email copied.');
    } catch {
      copyStatus.textContent = text('Bạn có thể sao chép: hungvanvip@gmail.com', 'You can copy: hungvanvip@gmail.com');
    }
  });
});
