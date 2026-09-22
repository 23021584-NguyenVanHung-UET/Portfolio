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
          ['02 / Data processing', 'Dữ liệu được giải mã, chuẩn hóa và nhập theo batch; file lop10.json có 13.290 hồ sơ local được dùng để tính rank theo tỉnh/trường.'],
          ['03 / Search performance', 'API kiểm tra SBD 8 chữ số và cache kết quả để giảm tải cho các truy vấn lặp lại.'],
          ['04 / Result', 'Website đã được deploy trên Vercel và có traffic người dùng thật: [SỐ LIỆU: lượt truy cập / lượt tra cứu].']
        ]
      },
      en: {
        title: 'From an encrypted API to a product with real users',
        intro: 'THPT Score Explorer 2026 covers the full data lifecycle: crawling, validation, normalization, storage, lookup and operations.',
        highlights: [
          ['01 / Data pipeline', 'A Python crawler sends parallel requests, decrypts AES-GCM payloads and normalizes data into one schema.'],
          ['02 / Data processing', 'Data is decrypted, normalized and imported in batches; lop10.json contains 13,290 local records used for province/school ranking.'],
          ['03 / Search performance', 'The API validates 8-digit candidate numbers and caches results to reduce repeated query load.'],
          ['04 / Result', 'The website is deployed on Vercel and has real user traffic: [DATA: visits / lookups].']
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
          ['05 / OCR operations', 'Pipeline FastAPI và worker RabbitMQ–MinIO xử lý PDF/DOCX/ảnh, giữ LaTeX, bảng, hình và chuyển kết quả chưa chắc chắn sang needs_manual_review.']
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
          ['05 / OCR operations', 'FastAPI and a RabbitMQ–MinIO worker process PDF/DOCX/images, preserve LaTeX, tables and figures, and route uncertain output to needs_manual_review.']
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
    ['.section-intro > p', 'Stack được nhóm theo đúng các công nghệ mình đã dùng trong V2SECURE và ba dự án nổi bật.', 'The stack is grouped around the technologies used at V2SECURE and in the three featured projects.'],
    ['.stack-row:nth-child(1) h3', 'Ngôn ngữ', 'Languages'], ['.stack-row:nth-child(1) p', 'Viết backend, frontend và xử lý dữ liệu.', 'Backend, frontend and data work.'],
    ['.stack-row:nth-child(2) h3', 'Backend & framework', 'Backend & frameworks'], ['.stack-row:nth-child(2) p', 'Xây API, bảo mật và luồng nghiệp vụ.', 'APIs, security and business flows.'],
    ['.stack-row:nth-child(3) h3', 'Frontend & nội dung', 'Frontend & content'], ['.stack-row:nth-child(3) p', 'Xây giao diện web và hiển thị công thức.', 'Web interfaces and formula rendering.'],
    ['.stack-row:nth-child(4) h3', 'Dữ liệu & hạ tầng', 'Data & infrastructure'], ['.stack-row:nth-child(4) p', 'Lưu trữ, tìm kiếm và xử lý dữ liệu sản phẩm.', 'Product-data storage, search and processing.'],
    ['.stack-row:nth-child(5) h3', 'Công cụ & DevOps', 'Tools & DevOps'], ['.stack-row:nth-child(5) p', 'Build, test, chạy local và quản lý mã nguồn.', 'Build, test, local development and source control.'],
    ['.stack-row:nth-child(6) h3', 'Tài liệu & xử lý ảnh', 'Documents & image processing'], ['.stack-row:nth-child(6) p', 'Đọc tài liệu, OCR và tạo đầu ra có cấu trúc.', 'Document reading, OCR and structured output.'],
    ['.experience-group-title', 'Kinh nghiệm làm việc', 'Work experience'],
    ['.experience-item-v2secure .timeline-date', '04–10/2026', '04–10/2026'],
    ['.experience-item-v2secure .role-kicker', 'Fullstack Developer Intern', 'Fullstack Developer Intern'],
    ['.experience-item-v2secure h3', 'Công ty Cổ phần An toàn thông tin Việt Nam V2 — V2SECURE', 'Vietnam V2 Information Security Joint Stock Company — V2SECURE'],
    ['.experience-item-v2secure .timeline-body > p:nth-of-type(1)', 'Chỉnh sửa giao diện và hỗ trợ phát triển các thành phần fullstack trên PHP/Zend Framework theo yêu cầu của nhóm.', 'Updated interfaces and supported fullstack components on PHP/Zend Framework based on team requirements.'],
    ['.experience-item-v2secure .timeline-body > p:nth-of-type(2)', 'Tối ưu truy vấn Elasticsearch và sử dụng các câu lệnh Linux phục vụ quá trình phát triển, kiểm tra và vận hành.', 'Optimized Elasticsearch queries and used Linux commands for development, testing and operations.'],
    ['.experience-item-v2secure .timeline-body > p:nth-of-type(3)', 'Tìm hiểu các giải pháp an ninh mạng gồm WAF, SIEM và EDR để hiểu rõ hơn bài toán sản phẩm và bối cảnh kỹ thuật của công ty.', 'Studied WAF, SIEM and EDR solutions to better understand the product problem and its technical context.'],
    ['.projects-heading h2', 'Những thứ mình đã<br><em>đưa ra ngoài đời.</em>', 'Things I’ve<br><em>shipped into the world.</em>', true],
    ['.projects-heading > p', 'Ba project cho thấy cách mình đi từ bài toán dữ liệu, xác thực và tài liệu đến sản phẩm có thể dùng, đo lường và vận hành.', 'Three projects showing how I turn data, authentication and document problems into products that can be used, measured and operated.'],
    ['.project-score .project-status', '● Đang hoạt động', '● Live product'],
    ['.project-score .project-summary', 'Một hệ thống web thu thập, chuẩn hóa, phân tích và tra cứu điểm thi vào lớp 10 Quảng Ninh 2026.', 'A web system for collecting, normalizing, analyzing and exploring Quảng Ninh 2026 grade-10 entrance scores.'],
    ['.project-smartshop .project-status', '● Backend build', '● Backend build'],
    ['.project-smartshop .project-summary', 'Backend xác thực cho ứng dụng thương mại điện tử, tập trung vào REST API, phân quyền cơ bản và kết nối PostgreSQL.', 'Authentication backend for an e-commerce application, focused on REST APIs, basic roles and PostgreSQL persistence.'],
    ['.project-smartshop .project-more', 'Đọc case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-math-exam .project-status', '● Project', '● Project'],
    ['.project-math-exam h3', 'MathExam Platform', 'MathExam Platform'],
    ['.project-math-exam .project-old-description', 'Nền tảng thi Toán và xử lý đề OCR, kết nối xác thực, question bank, tạo đề, phiên thi và pipeline tài liệu trong một hệ thống Java/Spring Boot và Next.js.', 'A math-exam and OCR platform connecting authentication, question banks, exam generation, exam sessions and document processing with Java/Spring Boot and Next.js.'],
    ['.project-math-exam .project-actions .button-primary', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.project-math-exam .project-more', 'Đọc case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-score h3', 'THPT Score Explorer 2026', 'THPT Score Explorer 2026'],
    ['.project-score .project-role-block span', 'Bài toán → giải pháp', 'Problem → solution'], ['.project-score .project-role-block strong', 'Dữ liệu điểm cần được xử lý và tra cứu nhanh → Next.js + TypeScript + Supabase + PostgreSQL + Python + Vercel', 'Score data needs reliable processing and fast lookup → Next.js + TypeScript + Supabase + PostgreSQL + Python + Vercel'],
    ['.project-score .project-points li:nth-child(1)', 'Xây dựng /api/lookup kiểm tra SBD 8 chữ số, truy vấn view scores_with_tohop, ghi log tìm kiếm và cache kết quả.', 'Built /api/lookup to validate 8-digit candidate numbers, query scores_with_tohop, log searches and cache results.'],
    ['.project-score .project-points li:nth-child(2)', 'Thiết kế get_rankings và /api/rank cho tổng điểm cùng 5 tổ hợp A00, A01, B00, C00, D01 ở cấp tỉnh/toàn quốc.', 'Designed get_rankings and /api/rank for total scores and five combinations - A00, A01, B00, C00, D01 - at provincial and national levels.'],
    ['.project-score .project-points li:nth-child(3)', 'Thu thập và chuẩn hóa dữ liệu bằng AES-GCM, ThreadPoolExecutor tối đa 20–30 workers, xuất JSON/CSV và nhập Supabase theo batch 500 bản ghi.', 'Collected and normalized data with AES-GCM and ThreadPoolExecutor using up to 20–30 workers, then exported JSON/CSV and imported to Supabase in batches of 500.'],
    ['.project-score .project-points li:nth-child(4)', 'Tiền xử lý lop10.json với 13.290 hồ sơ local, tính rank theo tỉnh/trường, hiển thị thống kê theo hội đồng thi và triển khai trên Vercel.', 'Preprocessed lop10.json with 13,290 local records, calculated province/school ranks, displayed exam-council statistics and deployed on Vercel.'],
    ['.project-score .project-actions .button-primary', 'Mở demo trực tiếp <span>↗</span>', 'Open live demo <span>↗</span>', true], ['.project-score .project-more', 'Xem case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-smartshop h3', 'SmartShopAI', 'SmartShopAI'],
    ['.project-smartshop .project-role-block span', 'Bài toán → giải pháp', 'Problem → solution'], ['.project-smartshop .project-role-block strong', 'Luồng đăng ký/đăng nhập cần trạng thái rõ ràng → Spring Boot + Spring Security + JPA', 'Registration/login needs explicit auth states → Spring Boot + Spring Security + JPA'],
    ['.project-smartshop .project-points li:nth-child(1)', 'Triển khai REST API đăng ký và đăng nhập tại /api/auth thông qua AuthController, AuthService và UserRepository.', 'Implemented registration and login REST APIs at /api/auth through AuthController, AuthService and UserRepository.'],
    ['.project-smartshop .project-points li:nth-child(2)', 'Thiết kế entity User với username duy nhất, password, role và full name; lưu trữ qua Spring Data JPA.', 'Designed a User entity with a unique username, password, role and full name, persisted through Spring Data JPA.'],
    ['.project-smartshop .project-points li:nth-child(3)', 'Tích hợp JWT HS256 bằng JwtUtil, cấu hình session stateless và CORS.', 'Integrated JWT HS256 through JwtUtil and configured stateless sessions and CORS.'],
    ['.project-smartshop .project-points li:nth-child(4)', 'Yêu cầu xác thực cho các endpoint ngoài luồng auth.', 'Required authentication for endpoints outside the auth flow.'],
    ['.project-math-exam .project-actions .button-outline', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.education-item:nth-child(1) h3', 'Đại học Công nghệ — ĐHQGHN', 'University of Engineering and Technology — VNU'], ['.education-item:nth-child(1) p', 'Sinh viên ngành Khoa học máy tính · GPA: 2.9', 'Computer Science student · GPA: 2.9'], ['.education-item:nth-child(1) .education-note', 'Nền tảng về hệ thống, cơ sở dữ liệu và quy trình phát triển phần mềm.', 'Foundations in systems, databases and software-development practices.'],
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
    document.querySelector('.project-score .visual-label')?.replaceChildren(document.createTextNode('LIVE PRODUCT / DATA'));
    document.querySelector('.project-smartshop .visual-label')?.replaceChildren(document.createTextNode('AUTH API / SPRING BOOT'));
    const scoreMetric = document.querySelector('.visual-metric span');
    if (scoreMetric) scoreMetric.innerHTML = language === 'vi' ? 'hồ sơ<br>đã xử lý' : 'records<br>processed';
    const scoreStatus = document.querySelector('.project-score .project-status');
    const smartshopStatus = document.querySelector('.project-smartshop .project-status');
    const mathStatus = document.querySelector('.project-math-exam .project-status');
    if (scoreStatus) scoreStatus.textContent = language === 'vi' ? '● Đang hoạt động' : '● Live product';
    if (smartshopStatus) smartshopStatus.textContent = '● Backend build';
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
