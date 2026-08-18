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

  // ═══ CLIENT-SIDE RAG (TF-IDF + COSINE SIMILARITY VECTOR SPACE RETRIEVER) ═══
  const aiMessages = document.getElementById('aiMessages');
  const aiInput = document.getElementById('aiInput');
  const aiSend = document.getElementById('aiSend');

  const documentChunks = [
    {
      id: 'biography',
      title: 'About Karan Raj T',
      content: `🤖 **About Karan Raj T:**\nKaran Raj T is a pre-final year **Artificial Intelligence & Data Science** undergraduate at Mepco Schlenk Engineering College, Sivakasi (CGPA: 8.39).\n\n• **Interests:** Cloud Computing, Linux System Administration, Large Language Models (LLMs), Hugging Face, Llama.cpp, and Retrieval-Augmented Generation (RAG).\n• **Ongoing Research:** Design and Optimization of Hybrid Data Structures for Timestamp-Based Data Storage.\n• **Location:** Sattur / Sivakasi, Tamil Nadu, India.`
    },
    {
      id: 'education',
      title: 'Education & Academics',
      content: `🤖 **Education Profile:**\nKaran is pursuing a **B.Tech in Artificial Intelligence & Data Science** at Mepco Schlenk Engineering College, Sivakasi (2025–2029).\n• **Current CGPA:** 8.39 / 10\n• **Class XII (HSC):** 87.67% (S.H.N. Edward HSS, Sattur)\n• **Class X (SSLC):** 85.80% (S.H.N. Edward HSS, Sattur)`
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      content: `🤖 **Technical Skillset:**\n• **Programming:** Python, C, C++, Core Java, SQL, Bash/Shell\n• **AI/ML:** PyTorch, TensorFlow, Scikit-learn, NumPy, Pandas, RAG, HuggingFace, Llama.cpp, Ollama\n• **OS & Databases:** Linux (Parrot OS, RHEL 10.1), Git/GitHub, VS Code, Power BI, MySQL, Oracle SQL`
    },
    {
      id: 'projects',
      title: 'Projects',
      content: `🤖 **Featured Projects:**\n1. **VIP Assistant:** Local RAG agent integrating Ollama, Gemini, Claude, and NVIDIA NIM.\n2. **Custom Linux OS:** Tailored distro optimized for developer workflows.\n3. **Smart Beneficiary Mapping System (Ed 2):** Autonomous scheme recommender with agentic workflows.\n4. **OmniShell Cloud:** Remote Linux management terminal via secure WebSockets.\n5. **Stock Market Dashboard:** Streamlit ML prediction dashboard.\n6. **Maze Runner 3D:** Interactive Three.js navigation via classical search (A*).`
    },
    {
      id: 'certifications',
      title: 'Certifications & Credentials',
      content: `🤖 **Certifications & Merit:**\n• **IoT (Elite):** NPTEL IIT Kharagpur\n• **HCI Design:** NPTEL IIT Guwahati\n• **IT Fundamentals (OS):** Infosys Springboard\n• **Technical English:** IEEE\n• **Leadership Roles:** Google Student Club Office Bearer, IE(I) Executive Member`
    },
    {
      id: 'contact',
      title: 'Contact Details',
      content: `🤖 **Contact Details for Karan Raj T:**\n• **Email:** karanraj2006rk@gmail.com\n• **Phone:** +91 9384102655\n• **LinkedIn:** [linkedin.com/in/karan-raj-t-835508351](https://www.linkedin.com/in/karan-raj-t-835508351)\n• **GitHub:** [github.com/vip-sk07](https://github.com/vip-sk07)\n• **Location:** Sattur / Sivakasi, Tamil Nadu, India\n\nFeel free to reach out directly for internship, research, or development inquiries!`
    },
    {
      id: 'research',
      title: 'Ongoing Research',
      content: `🤖 **Ongoing Research:**\nKaran is researching **"Design and Optimization of Hybrid Data Structures for Timestamp-Based Data Storage, Indexing, and Query Processing"**.`
    },
    {
      id: 'resumes',
      title: 'Resume & CV Downloads',
      content: `🤖 **Download Resumes:**\n• [📄 Resume (AI & RAG Focus)](Resume_1.pdf)\n• [📄 Resume (Systems & Data Focus)](Resume_2.pdf)`
    }
  ];

  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'him', 'his', 'her', 'it', 'its', 'they', 'them',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for',
    'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
    'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn',
    'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn', 'tell', 'show', 'give', 'ask', 'get'
  ]);

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.has(word));
  }

  // Pre-calculate document frequencies and IDF values
  const docFrequencies = {};
  documentChunks.forEach(doc => {
    const uniqueWords = new Set(tokenize(doc.content));
    uniqueWords.forEach(word => {
      docFrequencies[word] = (docFrequencies[word] || 0) + 1;
    });
  });

  const numDocs = documentChunks.length;
  const idf = {};
  for (const word in docFrequencies) {
    idf[word] = Math.log(1 + (numDocs / docFrequencies[word]));
  }

  // Compute normalized TF-IDF document vectors
  documentChunks.forEach(doc => {
    const tokens = tokenize(doc.content);
    const tf = {};
    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });

    const vector = {};
    for (const token in tf) {
      vector[token] = (tf[token] / tokens.length) * (idf[token] || 0);
    }
    doc.vector = vector;

    let sumSq = 0;
    for (const token in vector) {
      sumSq += vector[token] * vector[token];
    }
    doc.magnitude = Math.sqrt(sumSq);
  });

  // TF-IDF Cosine Similarity Search
  function retrieveChunks(queryText, topK = 1) {
    const queryTokens = tokenize(queryText);
    if (queryTokens.length === 0) return [];

    const queryTf = {};
    queryTokens.forEach(token => {
      queryTf[token] = (queryTf[token] || 0) + 1;
    });

    const queryVector = {};
    let querySumSq = 0;
    for (const token in queryTf) {
      if (idf[token]) {
        queryVector[token] = (queryTf[token] / queryTokens.length) * idf[token];
        querySumSq += queryVector[token] * queryVector[token];
      }
    }
    const queryMagnitude = Math.sqrt(querySumSq);
    if (queryMagnitude === 0) return [];

    const scores = [];
    documentChunks.forEach(doc => {
      let dotProduct = 0;
      for (const token in queryVector) {
        if (doc.vector[token]) {
          dotProduct += queryVector[token] * doc.vector[token];
        }
      }
      const similarity = doc.magnitude > 0 ? (dotProduct / (queryMagnitude * doc.magnitude)) : 0;
      scores.push({ doc, score: similarity });
    });

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK);
  }

  window.askAI = function (questionText) {
    if (aiInput) {
      aiInput.value = questionText;
      handleSendMessage();
    }
  };

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--accent2); text-decoration: underline; font-weight: 500;">$1</a>')
      .replace(/\n/g, '<br/>');
  }

  function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${isUser ? 'user-msg' : 'ai-msg'}`;
    msgDiv.innerHTML = `<span>${isUser ? text.replace(/\n/g, '<br/>') : formatMarkdown(text)}</span>`;
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function getAIResponse(userText) {
    const results = retrieveChunks(userText, 1);
    
    // Check if the best match similarity is above threshold
    if (results.length > 0 && results[0].score > 0.02) {
      return results[0].doc.content;
    }

    // Fallback for general questions about Karan when similarity is 0 or very low
    const textLower = userText.toLowerCase();
    const generalKeywords = ['karan', 'raj', 'yourself', 'who are you', 'tell me about', 'profile', 'biography', 'about you', 'who is', 'hello', 'hi', 'hey'];
    const isGeneralQuery = generalKeywords.some(kw => textLower.includes(kw));

    if (isGeneralQuery) {
      const bioChunk = documentChunks.find(doc => doc.id === 'biography');
      return bioChunk.content;
    }

    return `🤖 I couldn't find a direct match in Karan's records. Try asking about his education, CGPA, projects, certifications, custom Linux OS, or contact details!`;
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
      
      // If the access key is still the placeholder, advise the user to change it
      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
      if (accessKeyInput && accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
        formSuccess.textContent = "⚠️ Please configure your Web3Forms access key in index.html.";
        formSuccess.style.display = 'block';
        formSuccess.style.color = '#ffbe0b';
        return;
      }

      submitBtn.textContent = 'Sending... ⏳';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          formSuccess.textContent = "✅ Message sent successfully! I will get back to you shortly.";
          formSuccess.style.display = 'block';
          formSuccess.style.color = '#4ade80';
          contactForm.reset();
        } else {
          console.error(json);
          formSuccess.textContent = json.message || "❌ Something went wrong. Please try again.";
          formSuccess.style.display = 'block';
          formSuccess.style.color = '#f87171';
        }
      })
      .catch((error) => {
        console.error(error);
        formSuccess.textContent = "❌ Network error. Please check your connection and try again.";
        formSuccess.style.display = 'block';
        formSuccess.style.color = '#f87171';
      })
      .finally(() => {
        submitBtn.textContent = 'Send Message 🚀';
        submitBtn.disabled = false;
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 6000);
      });
    });
  }
});
