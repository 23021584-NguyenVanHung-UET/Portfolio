document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const languageToggle = document.querySelector('.lang-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  const savedLanguage = localStorage.getItem('portfolio-language') || 'vi';
  if (savedTheme) root.dataset.theme = savedTheme;

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('portfolio-theme', nextTheme);
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(section => spy.observe(section));

  const dialog = document.querySelector('#project-dialog');
  const dialogTitle = document.querySelector('#dialog-title');
  const dialogCopy = document.querySelector('#dialog-copy');
  const dialogNumber = document.querySelector('#dialog-number');
  const dialogHighlights = document.querySelector('#dialog-highlights') || (() => {
    if (!dialog || !dialogCopy) return null;
    const highlights = document.createElement('div');
    highlights.id = 'dialog-highlights';
    highlights.className = 'dialog-highlights';
    dialogCopy.after(highlights);
    return highlights;
  })();
  const caseStudies = {
    scores: {
      number: '01',
      vi: {
        title: 'Từ API mã hóa đến hệ thống tra cứu có người dùng thật',
        intro: 'THPT Score Explorer 2026 xử lý toàn bộ vòng đời dữ liệu: crawl, kiểm tra, chuẩn hóa, lưu trữ, tra cứu và theo dõi vận hành.',
        highlights: [
          ['01 / Data pipeline', 'Crawler Python gửi request song song, giải mã AES-GCM và chuẩn hóa dữ liệu về một schema thống nhất.'],
          ['02 / Data accuracy', 'Dữ liệu được validate và đối chiếu trước khi ghi vào dataset public. 13.290 hồ sơ từ 23 hội đồng/trường thi được xử lý.'],
          ['03 / Search performance', 'API kiểm tra SBD 8 chữ số và cache kết quả 24 giờ để giảm tải cho các truy vấn lặp lại.'],
          ['04 / Result', 'Website đã được deploy trên Vercel và có traffic người dùng thật: [SỐ LIỆU: lượt truy cập / lượt tra cứu].']
        ]
      },
      en: {
        title: 'From an encrypted API to a product with real users',
        intro: 'THPT Score Explorer 2026 covers the full data lifecycle: crawling, validation, normalization, storage, lookup and operations.',
        highlights: [
          ['01 / Data pipeline', 'A Python crawler sends parallel requests, decrypts AES-GCM payloads and normalizes data into one schema.'],
          ['02 / Data accuracy', 'Records are validated and cross-checked before entering the public dataset. 13,290 records across 23 schools or exam councils were processed.'],
          ['03 / Search performance', 'The API validates 8-digit candidate numbers and caches results for 24 hours to reduce repeated query load.'],
          ['04 / Result', 'The website is deployed on Vercel and has real user traffic: [DATA: visits / lookups].']
        ]
      }
    },
    ocr: {
      number: '02',
      vi: {
        title: 'Giữ cấu trúc khi chuyển PDF thành Word chỉnh sửa được',
        intro: 'Pipeline OCR xử lý layout nhiều cột, công thức, bảng và hình minh họa trước khi xuất sang định dạng tài liệu chuẩn.',
        highlights: [
          ['01 / Layout recovery', 'Rule-based pre-filter kết hợp AI review loop để giảm lỗi ghép giữa text, hình và vị trí trong tài liệu nhiều cột.'],
          ['02 / Confidence cascade', 'Chỉ gọi model AI mạnh khi confidence không đủ cao, giúp kiểm soát chi phí xử lý.'],
          ['03 / Editable output', 'Công thức được chuyển sang MathML/OMML để file Word tiếp tục chỉnh sửa được.'],
          ['04 / Result', 'Kết quả đo lường sẽ được bổ sung: [SỐ LIỆU: độ chính xác / thời gian mỗi tài liệu].']
        ]
      },
      en: {
        title: 'Preserving structure while converting PDFs to editable Word',
        intro: 'An OCR pipeline handles multi-column layouts, formulas, tables and figures before exporting to a standard editable document format.',
        highlights: [
          ['01 / Layout recovery', 'A rule-based pre-filter and AI review loop reduce merge errors between text, figures and positions in multi-column documents.'],
          ['02 / Confidence cascade', 'A stronger AI model is called only when confidence is too low, keeping processing cost under control.'],
          ['03 / Editable output', 'Formulas are converted to MathML/OMML so the Word output remains editable.'],
          ['04 / Result', 'Measured results will be added later: [DATA: accuracy / processing time per document].']
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
          ['03 / Integrity', 'Question bank và exam snapshot tách biệt để nội dung đã dùng trong lịch sử không bị thay đổi.'],
          ['04 / Operations', 'Xử lý bất đồng bộ qua RabbitMQ, lưu object private trên MinIO và kiểm soát trạng thái bằng backend.']
        ]
      },
      en: {
        title: 'From scattered documents to a question-bank pipeline',
        intro: 'MathExam Platform connects extraction, OCR review, question banks and exam sessions in one system with explicit states.',
        highlights: [
          ['01 / Extraction', 'Text-based PDFs use native extraction first; scanned documents use the OCR fallback.'],
          ['02 / Fidelity', 'LaTeX, tables, figures, reading order and uncertainty warnings are preserved; unclear cases fall back to needs_manual_review.'],
          ['03 / Integrity', 'Question-bank content and exam snapshots remain separate so historical content cannot change unexpectedly.'],
          ['04 / Operations', 'RabbitMQ handles asynchronous processing, MinIO stores private objects and the backend controls state transitions.']
        ]
      }
    }
  };

  const languagePairs = [
    ['.main-nav a:nth-child(1)', 'Giới thiệu', 'About'],
    ['.main-nav a:nth-child(2)', 'Kỹ năng', 'Stack'],
    ['.main-nav a:nth-child(3)', 'Kinh nghiệm', 'Experience'],
    ['.main-nav a:nth-child(4)', 'Dự án', 'Projects'],
    ['.main-nav a:nth-child(5)', 'Học vấn', 'Education'],
    ['.main-nav a:nth-child(6)', 'Liên hệ', 'Contact'],
    ['.eyebrow', 'Software developer / 2026', 'Software developer / 2026'],
    ['.hero-foot .mono:first-child', 'CUỘN ĐỂ KHÁM PHÁ', 'SCROLL TO EXPLORE'],
    ['.hero h1', 'Hưng Nguyễn<br><em>Software Developer.</em>', 'Hưng Nguyễn<br><em>Software Developer.</em>', true],
    ['.hero-lead', 'Tôi xây dựng và vận hành sản phẩm web từ ý tưởng đến khi có người dùng thật — không chỉ code theo yêu cầu có sẵn.', 'I build and operate web products from idea to real users — not only code against a pre-written brief.'],
    ['.hero-actions .button-primary', 'Xem dự án <span>↓</span>', 'See my work <span>↓</span>', true],
    ['.hero-actions .button-text', 'Tải CV <span>↗</span>', 'Download CV <span>↗</span>', true],
    ['.hero-meta > span:first-child', 'Đang tìm thực tập Software Developer', 'Open to Software Developer internships'],
    ['.hero-meta > span:last-child', 'Web · Backend · Data', 'Web · Backend · Data'],
    ['.note-top strong', 'Tư duy theo hệ thống', 'Think in systems'],
    ['.note-top small', 'data · product · operations', 'data · product · operations'],
    ['.note-bottom strong', 'Đã xây & vận hành', 'Built & operated'],
    ['.note-bottom small', 'chịu trách nhiệm sau khi ship', 'owned the product after launch'],
    ['.about-content h2', 'Xây sản phẩm.<br><em>Vận hành đến cùng.</em>', 'Build products.<br><em>Operate them end to end.</em>', true],
    ['.about-text p:nth-child(1)', 'Mình đang tìm cơ hội thực tập Software Developer theo hướng web, backend và full-stack.', 'I’m looking for a Software Developer internship focused on web, backend and full-stack work.'],
    ['.about-text p:nth-child(2)', 'Mình đã tự triển khai và vận hành website tra cứu điểm thi THPT có traffic người dùng thật, thay vì chỉ dừng ở một bài tập.', 'I deployed and operated a high-school score lookup website with real user traffic, beyond a classroom exercise.'],
    ['.about-text p:nth-child(3)', 'Mình học Next.js và React bằng cách xây sản phẩm, đọc tài liệu kỹ thuật và tự kiểm thử các luồng bảo mật ứng dụng cơ bản.', 'I learn Next.js and React by building products, reading technical documentation and testing basic application-security flows.'],
    ['.about-text p:nth-child(4)', 'Mục tiêu tiếp theo là làm việc trong một team có quy trình chuẩn và tham gia các hệ thống lớn hơn.', 'Next, I want to work in a team with a clear engineering process and contribute to larger systems.'],
    ['.inline-link', 'Xem kinh nghiệm phát triển <span>↗</span>', 'See product-development experience <span>↗</span>', true],
    ['.section-intro h2', 'Công cụ mình dùng<br>để <em>ship sản phẩm.</em>', 'Tools I use<br>to <em>ship products.</em>', true],
    ['.section-intro > p', 'Nhóm công nghệ được sắp theo mức độ liên quan đến các project đã triển khai. Không dùng thanh phần trăm khi chưa có dữ liệu đo lường.', 'Technologies are ordered by their relevance to shipped projects. No percentage bars without measured evidence.'],
    ['.stack-row:nth-child(1) h3', 'Frontend', 'Frontend'], ['.stack-row:nth-child(1) p', 'Xây giao diện web có cấu trúc và responsive.', 'Structured and responsive web interfaces.'],
    ['.stack-row:nth-child(2) h3', 'Backend & API', 'Backend & API'], ['.stack-row:nth-child(2) p', 'Thiết kế luồng nghiệp vụ và API rõ ràng.', 'Clear business flows and REST APIs.'],
    ['.stack-row:nth-child(3) h3', 'Dữ liệu & Hạ tầng', 'Data & Infrastructure'], ['.stack-row:nth-child(3) p', 'Lưu trữ, tìm kiếm và vận hành dữ liệu sản phẩm.', 'Storage, search and product-data operations.'],
    ['.stack-row:nth-child(4) h3', 'Công cụ khác', 'Other tools'], ['.stack-row:nth-child(4) p', 'Tự động hóa, thu thập dữ liệu và triển khai.', 'Automation, data collection and deployment.'],
    ['.experience-group-title', 'Kinh nghiệm phát triển sản phẩm', 'Product development experience'],
    ['.experience-item-product .timeline-date', '[KHOẢNG THỜI GIAN]', '[TIME PERIOD]'],
    ['.experience-item-product .role-kicker', 'Independent product development', 'Independent product development'],
    ['.experience-item-product h3', 'Tự phát triển & vận hành sản phẩm web độc lập', 'Independent web product development & operations'],
    ['.experience-item-product .timeline-body > p:nth-of-type(1)', 'Đảm nhiệm toàn bộ vòng đời: thu thập yêu cầu và dữ liệu, thiết kế hệ thống, viết code, deploy và theo dõi vận hành sau khi ra mắt.', 'Owned the full lifecycle: requirements and data collection, system design, coding, deployment and post-launch operations.'],
    ['.experience-item-product .timeline-body > p:nth-of-type(2)', 'Xử lý traffic tăng đột biến theo mùa vụ và kiểm tra độ chính xác của dữ liệu lấy từ nguồn ngoài bằng các bước validate, đối chiếu và chuẩn hóa.', 'Handled seasonal traffic spikes and checked external-source data through validation, cross-checking and normalization.'],
    ['.experience-item-product .timeline-body > p:nth-of-type(3)', 'Ra quyết định kỹ thuật độc lập và tiếp tục chịu trách nhiệm với sản phẩm sau khi ship.', 'Made independent technical decisions and remained responsible for the product after launch.'],
    ['.projects-heading h2', 'Những thứ mình đã<br><em>đưa ra ngoài đời.</em>', 'Things I’ve<br><em>shipped into the world.</em>', true],
    ['.projects-heading > p', 'Ba project cho thấy cách mình đi từ bài toán dữ liệu và tài liệu đến sản phẩm có thể dùng, đo lường và vận hành.', 'Three projects showing how I turn data and document problems into products that can be used, measured and operated.'],
    ['.project-score .project-status', '● Đang hoạt động', '● Live product'],
    ['.project-score .project-summary', 'Một hệ thống web thu thập, chuẩn hóa, phân tích và tra cứu điểm thi vào lớp 10 Quảng Ninh 2026.', 'A web system for collecting, normalizing, analyzing and exploring Quảng Ninh 2026 grade-10 entrance scores.'],
    ['.project-ocr .project-status', '● Bản build kỹ thuật', '● Technical build'],
    ['.project-ocr .project-summary', 'Một pipeline chuyển tài liệu ảnh/PDF có công thức, bảng và hình minh họa thành văn bản Word có thể chỉnh sửa, giữ reading order và cấu trúc nội dung.', 'A pipeline that converts image/PDF documents with formulas, tables and figures into editable Word documents while preserving reading order and structure.'],
    ['.project-ocr .project-more', 'Đọc case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-math-exam .project-status', '● Project', '● Project'],
    ['.project-math-exam h3', 'MathExam Platform', 'MathExam Platform'],
    ['.project-math-exam .project-old-description', 'Xây dựng pipeline xử lý tài liệu có cấu trúc, question bank và exam session. Hệ thống ưu tiên native PDF extraction, có scan fallback, lưu LaTeX, bảng, hình và cảnh báo uncertainty.', 'Built a structured-document pipeline, question bank and exam session. The system prioritizes native PDF extraction, uses an OCR fallback and preserves LaTeX, tables, figures and uncertainty warnings.'],
    ['.project-math-exam .project-actions .button-primary', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.project-math-exam .project-more', 'Đọc case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-score h3', 'THPT Score Explorer 2026', 'THPT Score Explorer 2026'],
    ['.project-score .project-role-block span', 'Bài toán → giải pháp', 'Problem → solution'], ['.project-score .project-role-block strong', 'Traffic tăng đột biến khi công bố điểm → Next.js + Supabase + Scrapy + Vercel', 'Traffic spikes at score release → Next.js + Supabase + Scrapy + Vercel'],
    ['.project-score .project-points li:nth-child(1)', 'Crawler lấy dữ liệu từ nguồn công bố chính thức, validate và chuẩn hóa trước khi ghi vào dataset.', 'The crawler validates and normalizes data from the official publication source before writing to the dataset.'],
    ['.project-score .project-points li:nth-child(2)', '13.290 hồ sơ từ 23 hội đồng/trường thi được xử lý, tính thứ hạng và phân bố điểm bằng PostgreSQL.', '13,290 records across 23 schools or exam councils were processed, ranked and analyzed with PostgreSQL.'],
    ['.project-score .project-points li:nth-child(3)', 'API lookup kiểm tra SBD 8 chữ số, cache kết quả 24 giờ và tách dữ liệu raw khỏi dataset public.', 'The lookup API validates 8-digit candidate numbers, caches results for 24 hours and separates raw data from the public dataset.'],
    ['.project-score .project-points li:nth-child(4)', 'Kết quả: có người dùng thật; [SỐ LIỆU: lượt truy cập / lượt tra cứu / thời gian cao điểm].', 'Result: real users; [DATA: visits / lookups / peak-time load].'],
    ['.project-score .project-actions .button-primary', 'Mở demo trực tiếp <span>↗</span>', 'Open live demo <span>↗</span>', true], ['.project-score .project-more', 'Xem case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-ocr h3', 'Structured Document → Editable Word', 'Structured Document → Editable Word'],
    ['.project-ocr .project-role-block span', 'Bài toán → giải pháp', 'Problem → solution'], ['.project-ocr .project-role-block strong', 'Layout phức tạp và công thức khó ghép → Python microservice + vision-language + PaddleOCR PP-Structure', 'Complex layouts and formula joins → Python microservice + vision-language + PaddleOCR PP-Structure'],
    ['.project-ocr .project-points li:nth-child(1)', 'Rule-based pre-filter phát hiện vùng và thứ tự đọc trước khi đưa các trường hợp khó vào AI review loop.', 'A rule-based pre-filter detects regions and reading order before difficult cases enter the AI review loop.'],
    ['.project-ocr .project-points li:nth-child(2)', 'Cascade theo confidence giảm số lần gọi model mạnh; chỉ nâng cấp xử lý khi tín hiệu không đủ chắc chắn.', 'A confidence cascade reduces calls to the stronger model and escalates only when signals are uncertain.'],
    ['.project-ocr .project-points li:nth-child(3)', 'Chuyển công thức sang MathML/OMML để file Word tiếp tục chỉnh sửa được.', 'Formulas are converted to MathML/OMML so the Word output remains editable.'],
    ['.project-ocr .project-points li:nth-child(4)', 'Kết quả: [SỐ LIỆU: độ chính xác / thời gian xử lý trung bình mỗi tài liệu].', 'Result: [DATA: accuracy / average processing time per document].'],
    ['.project-math-exam .project-actions .button-outline', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.education-item:nth-child(1) h3', 'Đại học Công nghệ — ĐHQGHN', 'University of Engineering and Technology — VNU'], ['.education-item:nth-child(1) p', 'Sinh viên ngành Công nghệ thông tin', 'Computer Science student'], ['.education-item:nth-child(1) .education-note', 'Nền tảng về hệ thống, cơ sở dữ liệu và quy trình phát triển phần mềm.', 'Foundations in systems, databases and software-development practices.'],
    ['.education-item:nth-child(2) h3', 'Independent learning', 'Independent learning'], ['.education-item:nth-child(2) p', 'TryHackMe · Next.js / React · AI/ML ứng dụng', 'TryHackMe · Next.js / React · Applied AI/ML'], ['.education-item:nth-child(2) .education-note', 'Bảo mật ứng dụng cơ bản, kiến trúc hệ thống và xây sản phẩm thực tế.', 'Basic application security, systems architecture and real product work.'],
    ['.contact-grid h2', 'Cùng xây một thứ<br><em>đáng để dùng.</em>', 'Let’s build something<br><em>worth using.</em>', true],
    ['.contact-grid p', 'Mình đang tìm cơ hội thực tập Software Developer theo hướng web, backend và full-stack.', 'I’m looking for a Software Developer internship focused on web, backend and full-stack work.'],
    ['.contact-grid .button-primary', 'Gửi email cho Hưng <span>↗</span>', 'Email Hưng <span>↗</span>', true],
    ['.contact-links a:last-child strong', 'Tải CV PDF', 'Download CV PDF'],
    ['.footer-note', 'Built · shipped · maintained <span>✦</span>', 'Built · shipped · maintained <span>✦</span>', true], ['.footer-inner > a', 'Về đầu trang ↑', 'Back to top ↑']
  ];

  const sectionLabels = {
    vi: ['Giới thiệu', 'Bộ công cụ', 'Kinh nghiệm', 'Dự án tiêu biểu', 'Học vấn', 'Liên hệ'],
    en: ['About me', 'My toolkit', 'Experience', 'Selected projects', 'Education', 'Get in touch']
  };
  function applyLanguage(language) {
    languagePairs.forEach(([selector, vi, en, isHtml]) => {
      const element = document.querySelector(selector);
      if (!element) return;
      if (isHtml) element.innerHTML = language === 'vi' ? vi : en;
      else element.textContent = language === 'vi' ? vi : en;
    });
    document.querySelectorAll('.section-label').forEach((label, index) => {
      const labelText = label.querySelector('span:last-child');
      if (labelText) labelText.textContent = sectionLabels[language][index];
    });
    document.querySelector('.project-score .visual-label')?.replaceChildren(document.createTextNode('LIVE PRODUCT / PROOF'));
    document.querySelector('.project-ocr .visual-label')?.replaceChildren(document.createTextNode('OCR PIPELINE / PYTHON'));
    const scoreMetric = document.querySelector('.visual-metric span');
    if (scoreMetric) scoreMetric.innerHTML = language === 'vi' ? 'hồ sơ<br>đã xử lý' : 'records<br>processed';
    const scoreStatus = document.querySelector('.project-score .project-status');
    const ocrStatus = document.querySelector('.project-ocr .project-status');
    const mathStatus = document.querySelector('.project-math-exam .project-status');
    if (scoreStatus) scoreStatus.textContent = language === 'vi' ? '● Đang hoạt động' : '● Live product';
    if (ocrStatus) ocrStatus.textContent = language === 'vi' ? '● Bản build kỹ thuật' : '● Technical build';
    if (mathStatus) mathStatus.textContent = '● Project';
    document.querySelectorAll('.project-number').forEach((number, index) => { number.textContent = String(index + 1).padStart(2, '0'); });
    const flowLabels = document.querySelectorAll('.exam-flow span');
    const flowNotes = document.querySelectorAll('.exam-flow small');
    if (flowLabels.length === 3) ['PDF / DOCX', 'OCR + review', 'question bank'].forEach((value, index) => { flowLabels[index].textContent = language === 'vi' ? ['PDF / DOCX', 'OCR + review', 'ngân hàng câu hỏi'][index] : value; });
    if (flowNotes.length === 3) ['upload', 'quality gate', 'publish'].forEach((value, index) => { flowNotes[index].textContent = language === 'vi' ? ['tải lên', 'kiểm tra chất lượng', 'publish'][index] : value; });
    root.lang = language;
    languageToggle.dataset.language = language;
    languageToggle.setAttribute('aria-label', language === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese');
    document.title = language === 'vi' ? 'Hưng — Software Developer' : 'Hưng — Software Developer';
    document.querySelector('meta[name="description"]').content = language === 'vi' ? 'Portfolio của Hưng — Software Developer tập trung vào sản phẩm web, backend, dữ liệu và các hệ thống có người dùng thật.' : 'Hưng’s portfolio — a Software Developer focused on web products, backend, data and systems with real users.';
    document.querySelector('meta[property="og:description"]').content = language === 'vi' ? 'Từ dữ liệu lộn xộn đến sản phẩm hữu ích cho người dùng thật.' : 'Turning messy data into useful products for real people.';
    localStorage.setItem('portfolio-language', language);
  }
  languageToggle?.addEventListener('click', () => applyLanguage(root.lang === 'vi' ? 'en' : 'vi'));
  applyLanguage(savedLanguage);

  document.querySelectorAll('.project-more').forEach(button => button.addEventListener('click', () => {
    const study = caseStudies[button.dataset.project];
    if (!study || !dialog) return;
    const copy = study[root.lang] || study.vi;
    dialogNumber.textContent = study.number;
    dialogTitle.textContent = copy.title;
    dialogCopy.textContent = copy.intro || copy.copy;
    dialogHighlights?.replaceChildren(...(copy.highlights || []).map(([heading, body]) => {
      const item = document.createElement('div');
      item.className = 'dialog-highlight';
      const title = document.createElement('strong');
      title.textContent = heading;
      const text = document.createElement('span');
      text.textContent = body;
      item.append(title, text);
      return item;
    }));
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }));
  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  document.querySelector('#contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hungvanvip@gmail.com?subject=${subject}&body=${body}`;
    const status = document.querySelector('#contact-status');
    if (status) status.textContent = root.lang === 'vi' ? 'Đang mở ứng dụng email của bạn.' : 'Opening your email application.';
  });
});
