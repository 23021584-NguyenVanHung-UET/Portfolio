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
    'math-exam': {
      number: '01',
      vi: {
        title: 'Từ một file đề thi đến cả một hệ thống học tập',
        intro: 'MathExam Platform là project nổi bật nhất của mình vì nó nối nhiều bài toán thật vào cùng một sản phẩm: dữ liệu, OCR, phân quyền, ngân hàng câu hỏi và trải nghiệm làm bài. Mục tiêu không phải chỉ “đọc được đề”, mà là biến đề thi thành dữ liệu có thể review, tái sử dụng, publish và đo lường.',
        highlights: [
          ['01 / Teacher workflow', 'Upload tài liệu vào object storage private, xử lý bất đồng bộ qua RabbitMQ và worker, sau đó đưa câu hỏi OCR vào PostgreSQL để giáo viên review, approve hoặc reject.'],
          ['02 / Content integrity', 'PDF có text được ưu tiên native extraction; đề scan dùng nhánh OCR dự phòng. Công thức LaTeX, bảng, hình, reading order và cảnh báo được giữ lại; quality gate chỉ retry trong giới hạn rồi chuyển needs_manual_review.'],
          ['03 / Exam lifecycle', 'Question Bank hỗ trợ draft/publish/archive, topics và bulk tagging. Chỉ câu hỏi đã publish mới được đưa vào đề publish; nội dung và đáp án được snapshot bất biến để lịch sử làm bài luôn nhất quán.'],
          ['04 / Student analytics', 'Học sinh start đề, autosave từng câu, submit và nhận điểm do backend quyết định; sau đó xem review, lịch sử, analytics theo chuyên đề, leaderboard và achievements.']
        ]
      },
      en: {
        title: 'From one exam file to a learning system',
        intro: 'MathExam Platform is my standout project because it connects several real problems in one product: data, OCR, permissions, question banks and the exam-taking experience. The goal is not only to “read an exam”, but to turn it into content that can be reviewed, reused, published and measured.',
        highlights: [
          ['01 / Teacher workflow', 'Files go to private object storage, move through RabbitMQ and a document worker, then land in PostgreSQL for teachers to review, approve or reject.'],
          ['02 / Content integrity', 'Text-based PDFs use native extraction first; scans use the OCR fallback. LaTeX formulas, tables, figures, reading order and warnings are preserved; the quality gate retries within a bound, then falls back to needs_manual_review.'],
          ['03 / Exam lifecycle', 'The Question Bank supports draft/publish/archive, topics and bulk tagging. Only published questions can enter a published exam; immutable snapshots keep past attempts consistent.'],
          ['04 / Student analytics', 'Students start an exam, autosave each answer, submit and receive server-decided scores, then review results, history, topic analytics, leaderboards and achievements.']
        ]
      }
    },
    scores: {
      number: '02',
      vi: {
        title: 'Từ API mã hóa đến một hệ thống tra cứu điểm hoàn chỉnh',
        intro: 'THPT Score Explorer 2026 giải quyết trọn vòng đời dữ liệu điểm thi vào lớp 10 Quảng Ninh: từ crawl API mã hóa, chuẩn hóa và lưu trữ cho đến tra cứu, ranking, monitoring và quản trị lượt truy cập.',
        highlights: [
          ['01 / Data pipeline', 'Python crawler gửi request song song bằng ThreadPoolExecutor, giải mã AES-GCM và chuẩn hóa tên môn, hội đồng thi cùng các trường điểm về một schema thống nhất.'],
          ['02 / Precomputed dataset', '13.290 thí sinh từ 23 hội đồng/trường thi được sort, group và tính thứ hạng trong trường/toàn tỉnh; dataset phục vụ frontend được tách khỏi raw data và loại bỏ trường nhạy cảm.'],
          ['03 / Search & ranking', 'API /api/lookup validate SBD 8 chữ số, trả về điểm từng môn và cache kết quả 24 giờ. PostgreSQL RPC get_rankings xử lý ranking, top percentile và các tổ hợp A00, A01, B00, C00, D01.'],
          ['04 / Operations', 'Trang /crawl-status theo dõi tiến trình thu thập theo thời gian; admin dashboard hiển thị lượt tra cứu, SBD/IP duy nhất, lịch sử phân trang và tự refresh định kỳ.']
        ]
      },
      en: {
        title: 'From an encrypted API to a complete score-exploration system',
        intro: 'THPT Score Explorer 2026 covers the full data lifecycle for Quảng Ninh grade-10 entrance scores: from encrypted API crawling, normalization and storage to lookup, rankings, monitoring and access analytics.',
        highlights: [
          ['01 / Data pipeline', 'A Python crawler uses ThreadPoolExecutor for parallel requests, decrypts AES-GCM payloads and normalizes subject names, exam councils and score fields into one schema.'],
          ['02 / Precomputed dataset', '13,290 students across 23 schools or exam councils are sorted, grouped and ranked by school and province; the frontend dataset is separated from raw data and stripped of sensitive fields.'],
          ['03 / Search & ranking', 'The /api/lookup route validates 8-digit candidate numbers, returns subject scores and caches results for 24 hours. PostgreSQL RPC get_rankings handles rankings, top percentiles and A00, A01, B00, C00 and D01 combinations.'],
          ['04 / Operations', 'The /crawl-status page tracks collection progress over time; an admin dashboard shows lookup volume, unique candidate numbers and IPs, paginated history and periodic refreshes.']
        ]
      }
    },
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
    ['.hero h1', 'Mình xây những thứ <em>hữu ích</em> cho người thật.', 'I build things <em>that matter</em> for real people.', true],
    ['.hero-lead', 'Mình là Hưng — developer định hướng backend/full-stack, thích biến dữ liệu phức tạp thành sản phẩm dễ dùng, đáng tin và có thể vận hành ngoài đời thật.', 'I’m Hưng — a backend/full-stack minded developer who turns complex data into products that are useful, reliable and ready for the real world.'],
    ['.hero-actions .button-primary', 'Xem dự án <span>↓</span>', 'See my work <span>↓</span>', true],
    ['.hero-actions .button-text', 'Liên hệ với mình <span>↗</span>', 'Let’s talk <span>↗</span>', true],
    ['.hero-meta > span:first-child', 'Đang tìm cơ hội thực tập', 'Open to software developer internships'],
    ['.hero-meta > span:last-child', 'Đông Triều, Quảng Ninh', 'Dong Trieu, Quang Ninh'],
    ['.note-top strong', 'Nghĩ theo hệ thống', 'Think in systems'],
    ['.note-top small', 'data · product · people', 'data · product · people'],
    ['.note-bottom strong', 'Đã xây & đưa vào chạy', 'Built & shipped'],
    ['.note-bottom small', 'không chỉ là bài tập', 'not just a class project'],
    ['.about-content h2', 'Không bắt đầu từ<br><em>công nghệ.</em> Bắt đầu từ vấn đề.', 'I don’t start with<br><em>technology.</em> I start with the problem.', true],
    ['.about-text p:first-child', 'Mình đang tự học và phát triển theo hướng Software Developer, tìm kiếm cơ hội thực tập để được làm việc trong một team kỹ thuật thực tế. Điều mình tự tin nhất là đã tự xây dựng và vận hành một sản phẩm web có người dùng thật — không chỉ dừng ở bài tập hay đồ án.', 'I’m learning and growing toward a Software Developer role, looking for an internship where I can contribute to a real engineering team. What I’m most confident about is building and operating a web product with real users — beyond a class assignment or school project.'],
    ['.about-text p:last-child', 'Mình học Next.js/React qua việc làm sản phẩm, đồng thời tìm hiểu kiến trúc hệ thống, bảo mật ứng dụng và AI/ML như RAG, fine-tuning. Ngoài code, mình là gia sư Toán — một công việc rèn cho mình khả năng giải thích vấn đề khó bằng ngôn ngữ rõ ràng, điều rất hữu ích khi làm việc nhóm và viết tài liệu kỹ thuật.', 'I learn Next.js and React by building products, while exploring systems architecture, application security and applied AI/ML such as RAG and fine-tuning. Outside code, I tutor Mathematics — a practice that has taught me to explain difficult ideas clearly, a useful skill for teamwork and technical documentation.'],
    ['.inline-link', 'Xem hành trình của mình <span>↗</span>', 'See my journey <span>↗</span>', true],
    ['.section-intro h2', 'Một stack đủ rộng<br>để <em>đào sâu.</em>', 'A stack broad enough<br>to <em>go deep.</em>', true],
    ['.section-intro > p', 'Không chạy theo danh sách dài. Mình chọn công cụ dựa trên vấn đề cần giải quyết và học đủ sâu để hiểu chúng hoạt động cùng nhau thế nào.', 'I don’t chase long lists. I choose tools based on the problem at hand, then learn them deeply enough to understand how they work together.'],
    ['.stack-row:nth-child(1) h3', 'Frontend', 'Frontend'], ['.stack-row:nth-child(1) p', 'Giao diện có cấu trúc, responsive và dễ tiếp cận.', 'Structured, responsive and accessible interfaces.'],
    ['.stack-row:nth-child(2) h3', 'Backend & API', 'Backend & API'], ['.stack-row:nth-child(2) p', 'Logic nghiệp vụ rõ ràng, API an toàn, dễ mở rộng.', 'Clear business logic, secure APIs and room to scale.'],
    ['.stack-row:nth-child(3) h3', 'Data & infra', 'Data & infra'], ['.stack-row:nth-child(3) p', 'Đặt nền móng tin cậy cho dữ liệu và vận hành.', 'Reliable foundations for data and operations.'],
    ['.stack-row:nth-child(4) h3', 'Exploring', 'Exploring'], ['.stack-row:nth-child(4) p', 'Học bằng cách xây, kiểm thử và tự debug.', 'Learning by building, testing and debugging.'],
    ['.experience-group-professional .experience-group-title', 'Chuyên môn', 'Professional experience'],
    ['.experience-group-skills .experience-group-title', 'Kỹ năng', 'Skills'],
    ['.experience-item-university .role-kicker', 'Đại học Công nghệ — Đại học Quốc gia Hà Nội', 'University of Engineering and Technology — Vietnam National University, Hanoi'],
    ['.experience-item-university h3', 'Sinh viên Công nghệ thông tin', 'Computer Science student'],
    ['.experience-item-university .timeline-body > p:not(.role-kicker)', 'Học tập và phát triển nền tảng về lập trình, cơ sở dữ liệu, kiến trúc hệ thống và quy trình phát triển phần mềm. Mình chủ động củng cố kiến thức bằng cách xây dựng các sản phẩm thực tế và đọc tài liệu kỹ thuật.', 'Building a foundation in programming, databases, systems architecture and software development practices through coursework, real products and technical documentation.'],
    ['.experience-item-v2secure .role-kicker', 'CÔNG TY CỔ PHẦN AN TOÀN THÔNG TIN VIỆT NAM V2 · V2SECURE', 'V2 Vietnam Information Security Joint Stock Company · V2SECURE'],
    ['.experience-item-v2secure h3', 'Thực tập sinh Software Developer', 'Software Developer Intern'],
    ['.experience-item-v2secure .timeline-body > p:not(.role-kicker)', 'Tham gia trực tiếp vào quá trình phát triển các giải pháp an toàn thông tin như SIEM và EDR. Công việc tập trung vào xây dựng, hoàn thiện giao diện hiển thị dữ liệu giám sát; tối ưu truy vấn Elasticsearch để tìm kiếm và tổng hợp log hiệu quả; đồng thời làm việc trong môi trường Linux, xử lý lỗi và kiểm tra các luồng hoạt động của hệ thống.', 'Contributed directly to security solutions such as SIEM and EDR. Worked on interfaces for monitoring data, optimized Elasticsearch queries for efficient log search and aggregation, and worked in Linux environments while debugging and testing system flows.'],
    ['.experience-item-tutoring .timeline-date', 'Domain', 'Domain knowledge'],
    ['.experience-item-tutoring .role-kicker', 'Education domain knowledge', 'Education domain knowledge'],
    ['.experience-item-tutoring h3', 'Tư duy giáo dục & giao tiếp', 'Education domain & communication'],
    ['.experience-item-tutoring .timeline-body > p:not(.role-kicker)', 'Có nền tảng hiểu biết về giáo dục thông qua việc trực tiếp giảng dạy, biên soạn tài liệu và điều chỉnh cách truyền đạt theo từng đối tượng. Kinh nghiệm này giúp mình phân tích nhu cầu người dùng, giao tiếp rõ ràng, đồng cảm với người dùng và biến vấn đề phức tạp thành quy trình dễ hiểu — những năng lực có thể áp dụng trực tiếp khi phát triển sản phẩm IT.', 'Built education domain knowledge through teaching, preparing learning materials and adapting explanations to different audiences. This helps me analyze user needs, communicate clearly, empathize with users and turn complex problems into understandable workflows — skills I can apply directly to IT product development.'],
    ['.projects-heading h2', 'Những thứ mình đã<br><em>đưa ra ngoài đời.</em>', 'Things I’ve<br><em>shipped into the world.</em>', true],
    ['.projects-heading > p', 'Những dự án xuất phát từ nhu cầu rất cụ thể — từ một lần tra cứu điểm thi đến cả vòng đời của một đề Toán — và buộc mình phải nghĩ như một người xây sản phẩm.', 'Projects born from very specific needs — from one exam-result lookup to the full lifecycle of a mathematics exam — and built with a product mindset.'],
    ['.project-math-exam .project-status', '● Dự án nổi bật', '● Featured build'],
    ['.project-math-exam h3', 'MathExam Platform', 'MathExam Platform'],
    ['.project-math-exam .project-summary', 'Một nền tảng luyện thi Toán THPT biến đề thi rời rạc thành một quy trình có thể kiểm soát: giáo viên đưa tài liệu vào, hệ thống hỗ trợ đọc và review, rồi học sinh làm bài trên dữ liệu đã được publish.', 'A high-school mathematics exam platform that turns scattered exam files into a controlled workflow: teachers bring content in, the system supports extraction and review, and students take exams from published data.'],
    ['.project-math-exam .project-role-block span', 'Vai trò', 'Role'],
    ['.project-math-exam .project-role-block strong', 'Full-stack · System design · OCR workflow · Auth/RBAC', 'Full-stack · System design · OCR workflow · Auth/RBAC'],
    ['.project-math-exam .project-points li:nth-child(1)', 'Xây luồng giáo viên upload → lưu object private → xử lý bất đồng bộ → review câu hỏi OCR → đưa câu đã duyệt vào ngân hàng câu hỏi và tạo đề nháp.', 'Built the teacher flow from upload and private object storage to asynchronous processing, OCR review, question-bank import and draft exam creation.'],
    ['.project-math-exam .project-points li:nth-child(2)', 'Thiết kế vòng đời đề rõ ràng: chỉ câu hỏi đã publish mới vào đề publish; nội dung và đáp án được snapshot bất biến để lịch sử làm bài không bị thay đổi.', 'Designed a clear exam lifecycle: only published questions enter published exams, while immutable content and answer snapshots keep past attempts consistent.'],
    ['.project-math-exam .project-points li:nth-child(3)', 'Cung cấp luồng học sinh start, autosave, submit và chấm điểm phía server, cùng kết quả, lịch sử, analytics, leaderboard và achievements.', 'Students can start, autosave, submit and receive server-side scores, then explore results, history, analytics, leaderboards and achievements.'],
    ['.project-math-exam .project-points li:nth-child(4)', 'Giữ fidelity cho đề Toán: native PDF extraction khi có thể, scan fallback, LaTeX, bảng, hình và reading order; quality gate retry có giới hạn rồi chuyển needs_manual_review.', 'Preserved exam fidelity through native PDF extraction where possible, scan fallback, LaTeX, tables, figures and reading order; a bounded quality gate falls back to needs_manual_review.'],
    ['.project-math-exam .project-actions .button-primary', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.project-math-exam .project-more', 'Đọc case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-blue h3', 'THPT Score Explorer 2026', 'THPT Score Explorer 2026'],
    ['.project-blue .project-summary', 'Hệ thống thu thập, xử lý, phân tích và tra cứu điểm thi vào lớp 10 Quảng Ninh 2026 bằng Next.js, TypeScript, Supabase PostgreSQL và Python.', 'A Next.js, TypeScript, Supabase PostgreSQL and Python system for collecting, processing, analyzing and exploring Quảng Ninh 2026 grade-10 entrance scores.'],
    ['.project-blue .project-role-block span', 'Vai trò', 'Role'], ['.project-blue .project-role-block strong', 'Full-stack · Data engineering · API · Deployment', 'Full-stack · Data engineering · API · Deployment'],
    ['.project-blue .project-points li:nth-child(1)', 'Xây crawler Python xử lý request/response mã hóa AES-GCM, quét dải số báo danh bằng ThreadPoolExecutor và chuẩn hóa dữ liệu về một cấu trúc thống nhất.', 'Built a Python crawler that handles AES-GCM encrypted requests and responses, scans candidate-number ranges with ThreadPoolExecutor and normalizes data into one schema.'],
    ['.project-blue .project-points li:nth-child(2)', 'Tiền xử lý 13.290 thí sinh từ 23 hội đồng/trường thi, tính tổ hợp điểm, thứ hạng trong trường/toàn tỉnh và phân bố điểm bằng PostgreSQL.', 'Preprocessed 13,290 students across 23 schools or exam councils, calculating score combinations, school/province rankings and score distributions with PostgreSQL.'],
    ['.project-blue .project-points li:nth-child(3)', 'Cung cấp tra cứu SBD 8 chữ số qua /api/lookup, cache kết quả 24 giờ và xử lý các trạng thái chưa có dữ liệu một cách rõ ràng.', 'Provided 8-digit candidate-number lookup through /api/lookup, cached results for 24 hours and handled missing-data states clearly.'],
    ['.project-blue .project-points li:nth-child(4)', 'Có trang theo dõi crawl và admin dashboard; tách dữ liệu raw khỏi dataset public, loại bỏ trường nhạy cảm trước khi phục vụ frontend.', 'Added crawl monitoring and an admin dashboard; separated raw data from the public dataset and removed sensitive fields before serving the frontend.'],
    ['.project-blue .project-actions .button-primary', 'Hỏi về demo <span>↗</span>', 'Ask for a demo <span>↗</span>', true], ['.project-blue .project-more', 'Xem case study <span>↗</span>', 'Read case study <span>↗</span>', true],
    ['.project-smartshop h3', 'SmartShop AI - E-Commerce', 'SmartShop AI - E-Commerce'],
    ['.project-smartshop p', 'Phát triển giao diện UI/UX hiện đại, tối ưu hiệu suất và xây dựng luồng xác thực JWT an toàn cho trải nghiệm mua sắm.', 'Built a modern, high-performance UI/UX and a secure JWT authentication flow for the shopping experience.'],
    ['.project-smartshop .project-actions .button-outline', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.project-food h3', 'FoodDelivery Platform', 'FoodDelivery Platform'],
    ['.project-food p', 'Xây dựng backend xử lý nghiệp vụ đặt đồ ăn, phân quyền Admin/User và đăng nhập an toàn qua Google OAuth2.', 'Built the backend for food-ordering workflows, Admin/User permissions and secure Google OAuth2 login.'],
    ['.project-food .project-actions .button-outline', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.project-library h3', 'Hệ thống Quản lý Thư viện', 'Library Management System'],
    ['.project-library p', 'Thiết kế backend quản lý luồng mượn/trả sách, tài khoản, trạng thái tài liệu và các logic nghiệp vụ cốt lõi.', 'Designed a backend for lending and returns, accounts, document status and core business logic.'],
    ['.project-library .project-actions .button-outline', 'Xem repository <span>↗</span>', 'View repository <span>↗</span>', true],
    ['.education-item:nth-child(1) h3', 'Đại học Công nghệ — ĐHQGHN', 'University of Engineering and Technology — VNU'], ['.education-item:nth-child(1) p', 'Sinh viên ngành Công nghệ thông tin', 'Computer Science student'], ['.education-item:nth-child(1) .education-note', 'Học qua việc xây sản phẩm, đọc tài liệu kỹ thuật và tự đặt câu hỏi.', 'Learning through products, technical docs and self-directed questions.'],
    ['.education-item:nth-child(2) h3', 'Independent learning', 'Independent learning'], ['.education-item:nth-child(2) p', 'TryHackMe · Next.js / React · AI/ML ứng dụng', 'TryHackMe · Next.js / React · Applied AI/ML'], ['.education-item:nth-child(2) .education-note', 'Pentest cơ bản, kiến trúc hệ thống, RAG và fine-tuning.', 'Application pentesting, systems architecture, RAG and fine-tuning.'],
    ['.contact-grid h2', 'Cùng xây một thứ<br><em>đáng để dùng.</em>', 'Let’s build something<br><em>worth using.</em>', true],
    ['.contact-grid p', 'Mình đang tìm cơ hội thực tập Software Developer và luôn sẵn sàng trò chuyện về sản phẩm, backend, dữ liệu hoặc một ý tưởng thú vị.', 'I’m looking for a Software Developer internship and always happy to talk about products, backend, data or an interesting idea.'],
    ['.contact-grid .button-primary', 'Gửi email cho Hưng <span>↗</span>', 'Email Hưng <span>↗</span>', true],
    ['.contact-links a:last-child strong', 'Yêu cầu bản CV', 'Request CV'],
    ['.footer-note', 'Designed & built with curiosity <span>✦</span>', 'Designed & built with curiosity <span>✦</span>', true], ['.footer-inner > a', 'Back to top ↑', 'Back to top ↑']
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
    document.querySelector('.score-visual .visual-label').textContent = language === 'vi' ? 'LIVE PRODUCT / 2026' : 'LIVE PRODUCT / 2026';
    document.querySelector('.paper-visual .visual-label').textContent = language === 'vi' ? 'OCR PIPELINE / PYTHON' : 'OCR PIPELINE / PYTHON';
    document.querySelector('.browser-brand').innerHTML = 'score<span>explorer</span><b>2026</b>';
    document.querySelector('.search-bar').innerHTML = language === 'vi' ? '<span>⌕</span> Nhập số báo danh <strong>Tra cứu</strong>' : '<span>⌕</span> Enter candidate number <strong>Search</strong>';
    const scoreMetric = document.querySelector('.visual-metric span');
    if (scoreMetric) scoreMetric.innerHTML = language === 'vi' ? 'hồ sơ<br>đã xử lý' : 'records<br>processed';
    document.querySelector('.result-row span').textContent = language === 'vi' ? 'Nguyễn V. A.' : 'Nguyen V. A.';
    document.querySelector('.result-row.faded span').textContent = language === 'vi' ? 'Toán / Văn / Ngoại ngữ' : 'Math / Literature / English';
    document.querySelector('.result-row.faded b').textContent = language === 'vi' ? 'Đã cập nhật' : 'Updated';
    const featuredStatus = document.querySelector('.project-math-exam .project-status');
    const liveStatus = document.querySelector('.project-blue .project-status');
    if (featuredStatus) featuredStatus.textContent = language === 'vi' ? '● Dự án nổi bật' : '● Featured build';
    if (liveStatus) liveStatus.textContent = language === 'vi' ? '● Đang hoạt động' : '● Live product';
    document.querySelectorAll('.project-number').forEach((number, index) => { number.textContent = String(index + 1).padStart(2, '0'); });
    const flowLabels = document.querySelectorAll('.exam-flow span');
    const flowNotes = document.querySelectorAll('.exam-flow small');
    if (flowLabels.length === 3) ['PDF / DOCX', 'OCR + review', 'question bank'].forEach((value, index) => { flowLabels[index].textContent = language === 'vi' ? ['PDF / DOCX', 'OCR + review', 'ngân hàng câu hỏi'][index] : value; });
    if (flowNotes.length === 3) ['upload', 'quality gate', 'publish'].forEach((value, index) => { flowNotes[index].textContent = language === 'vi' ? ['tải lên', 'kiểm tra chất lượng', 'publish'][index] : value; });
    root.lang = language;
    languageToggle.dataset.language = language;
    languageToggle.setAttribute('aria-label', language === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese');
    document.title = language === 'vi' ? 'Hưng — Software Developer' : 'Hưng — Software Developer';
    document.querySelector('meta[name="description"]').content = language === 'vi' ? 'Portfolio của Hưng — Software Developer định hướng backend/full-stack, xây dựng sản phẩm web và pipeline dữ liệu thực tế.' : 'Hưng’s portfolio — a backend/full-stack minded Software Developer building real-world web products and data pipelines.';
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
});
