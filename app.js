document.addEventListener('DOMContentLoaded', () => {
  // ═══ REDUCED MOTION PREFERENCE ═══
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ═══ CUSTOM CURSOR ═══
  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover cursor effects
    document.querySelectorAll('a, button, .proj-card, .skill-card, .social-card, .cert-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (ring) {
          ring.style.width = '48px';
          ring.style.height = '48px';
          ring.style.borderColor = 'var(--accent)';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (ring) {
          ring.style.width = '32px';
          ring.style.height = '32px';
          ring.style.borderColor = 'var(--accent2)';
        }
      });
    });
  }

  // ═══ PARTICLES GENERATOR ═══
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer && !prefersReducedMotion) {
    const particleColors = ['#7c5cfc', '#00d4aa', '#ff6b6b'];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
      p.style.animationDuration = `${10 + Math.random() * 15}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      particlesContainer.appendChild(p);
    }
  }

  // ═══ STARFIELD CANVAS (OPTIMIZED WITH VISIBILITY PAUSE) ═══
  const canvas = document.getElementById('starfield');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let isCanvasVisible = true;
    let animFrameId = null;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initStars();
    }

    function initStars() {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.01 + 0.003
        });
      }
    }

    function animateStars() {
      if (!isCanvasVisible || document.hidden) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 240, 248, ${Math.abs(s.alpha)})`;
        ctx.fill();
      });
      animFrameId = requestAnimationFrame(animateStars);
    }

    // Visibility & Intersection Observers for performance optimization
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible && !document.hidden) {
          if (!animFrameId) animateStars();
        } else {
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
        }
      });
    }, { threshold: 0.1 });
    canvasObserver.observe(canvas);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      } else if (!document.hidden && isCanvasVisible && !animFrameId) {
        animateStars();
      }
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateStars();
  }

  // ═══ NAVBAR SCROLL & MOBILE MENU & SCROLLSPY ═══
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNavbar() {
    // Background style change on scroll
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link Scrollspy
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar);
  updateNavbar();

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.mob-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ═══ SCROLL REVEAL ═══
  const reveals = document.querySelectorAll('.reveal');
  function checkReveal() {
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 120;
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', checkReveal);
  checkReveal();

  // ═══ ANIMATED COUNTERS ═══
  const statsRow = document.getElementById('statsRow');
  let counted = false;

  function countUp(el, target, suffix = '', decimals = 0) {
    let count = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = (decimals > 0 ? count.toFixed(decimals) : Math.ceil(count)) + suffix;
    }, 30);
  }

  function checkStats() {
    if (!statsRow || counted) return;
    const rect = statsRow.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      countUp(document.getElementById('c1'), 7);
      countUp(document.getElementById('c2'), 8);
      countUp(document.getElementById('c3'), 8.39, '/10', 2);
      countUp(document.getElementById('c4'), 5);
      counted = true;
    }
  }
  window.addEventListener('scroll', checkStats);
  checkStats();

  // ═══ AI ASSISTANT CHAT WITH KARAN RAJ T'S KNOWLEDGE (SCORE MATCHED) ═══
  const aiMessages = document.getElementById('aiMessages');
  const aiInput = document.getElementById('aiInput');
  const aiSend = document.getElementById('aiSend');

  const knowledgeBase = [
    {
      keywords: ['education', 'cgpa', 'college', 'mepco', 'degree', 'study', 'marks', 'school', 'gpa', 'university', 'btech', 'grade', 'class'],
      answer: "Karan Raj T is pursuing B.Tech in Artificial Intelligence & Data Science at Mepco Schlenk Engineering College, Sivakasi (2025–2029).\n• Current CGPA: 8.39 / 10\n• HSC (Class 12): 87.67% (S.H.N. Edward Higher Secondary School, Sattur)\n• SSLC (Class 10): 85.80%"
    },
    {
      keywords: ['skill', 'stack', 'tech', 'language', 'know', 'programming', 'tools', 'python', 'java', 'linux', 'pytorch', 'c++', 'c'],
      answer: "Karan's technical skills include:\n• Languages: Python, C, C++, Core Java, SQL, Shell\n• AI/ML: PyTorch, TensorFlow, Scikit-learn, NumPy, Pandas, RAG, HuggingFace, Llama.cpp, Ollama\n• Tools & OS: Linux (Parrot OS, RHEL 10.1), Git/GitHub, VS Code, Power BI, MySQL, Oracle SQL"
    },
    {
      keywords: ['project', 'work', 'vip', 'linux', 'omnishell', 'built', 'portfolio', 'bot', 'agent', 'rag', 'stock', 'maze'],
      answer: "Karan's notable projects include:\n1. VIP Assistant: Local AI Agent with RAG, Ollama & WebSockets.\n2. Custom Linux OS: Custom Linux distribution for AI workloads.\n3. Smart Beneficiary Mapping System: AI decision automation for welfare schemes.\n4. OmniShell Cloud: Distributed web terminal (Deployed on Render).\n5. Stock Market Analyzer: ML price prediction trading terminal dashboard."
    },
    {
      keywords: ['certif', 'nptel', 'ieee', 'comptia', 'award', 'merit', 'credential', 'certificate', 'iot', 'hci'],
      answer: "Karan holds certifications in:\n• NPTEL IoT (Elite) - IIT Kharagpur\n• Design & Implementation of HCI - NPTEL IIT Guwahati\n• CompTIA IT Fundamentals: Operating Systems - Infosys Springboard\n• IEEE English for Technical Professionals\n• Certificates of Merit: IEI Executive Member & Google Student Club Office Bearer"
    },
    {
      keywords: ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'mobile', 'hire', 'call', 'mail', 'location', 'address'],
      answer: "You can contact Karan Raj T directly:\n• Email: karanraj2006rk@gmail.com\n• Phone: +91 9384102655\n• LinkedIn: linkedin.com/in/karan-raj-t-835508351\n• GitHub: github.com/vip-sk07\n• Location: Sattur / Sivakasi, Tamil Nadu, India"
    },
    {
      keywords: ['research', 'paper', 'publication', 'data structure', 'timestamp', 'indexing'],
      answer: "Karan is currently engaged in ongoing research titled: 'Design and Optimization of Hybrid Data Structures for Timestamp-Based Data Storage, Indexing, and Query Processing'."
    },
    {
      keywords: ['resume', 'cv', 'download', 'pdf', 'bio', 'profile'],
      answer: "You can download Karan's resumes directly from the portfolio:\n1. 📄 Resume 1 (AI & RAG Focus): Features VIP Assistant, Smart Beneficiary Mapping, and ML projects.\n2. 📄 Resume 2 (Systems & Data Focus): Features Custom Linux OS, OmniShell Cloud, and Customer Cart EDA."
    }
  ];

  window.askAI = function (questionText) {
    if (aiInput) {
      aiInput.value = questionText;
      handleSendMessage();
    }
  };

  function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${isUser ? 'user-msg' : 'ai-msg'}`;
    msgDiv.innerHTML = `<span>${text.replace(/\n/g, '<br/>')}</span>`;
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function getAIResponse(userText) {
    const textLower = userText.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    knowledgeBase.forEach((item) => {
      let score = 0;
      item.keywords.forEach((kw) => {
        if (textLower.includes(kw)) score += 1;
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item.answer;
      }
    });

    return maxScore > 0 ? bestMatch : `Karan Raj T is an AI & Data Science undergraduate at Mepco Schlenk Engineering College (8.39 CGPA) specializing in RAG, LLMs, Linux OS, and AI automation. Feel free to ask about his skills, projects, certificates, or contact details!`;
  }

  function handleSendMessage() {
    const text = aiInput.value.trim();
    if (!text) return;

    appendMessage(text, true);
    aiInput.value = '';

    setTimeout(() => {
      const reply = getAIResponse(text);
      appendMessage(reply, false);
    }, 400);
  }

  if (aiSend && aiInput) {
    aiSend.addEventListener('click', handleSendMessage);
    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }

  // ═══ CONTACT FORM ═══
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('formSubmit');
      submitBtn.textContent = 'Sending... ⏳';

      setTimeout(() => {
        submitBtn.textContent = 'Send Message 🚀';
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }, 800);
    });
  }
});
