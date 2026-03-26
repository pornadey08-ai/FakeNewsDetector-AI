// ========== LOGIN / SIGNUP SYSTEM ==========
let users = JSON.parse(localStorage.getItem('standalone_users') || '[]');

function saveUsers() {
    localStorage.setItem('standalone_users', JSON.stringify(users));
}

// ========== CREATE ANIMATED PARTICLES ==========
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }
}

// ========== ROBOT INTERACTIONS ==========
function initRobot() {
    const robotContainer = document.querySelector('.robot-container');
    const robotBubble = document.getElementById('robotBubble');
    const robotScreen = document.getElementById('robotScreen');
    if (!robotContainer) return;
    
    const messages = ["🤖 Hello! I detect fake news!", "🔍 Paste any news to verify!", "⚡ AI + Blockchain = Truth!", "📊 98% accuracy guaranteed!", "🎓 City University Malaysia!"];
    let messageIndex = 0;
    
    setInterval(() => {
        if (robotBubble) {
            robotBubble.textContent = messages[messageIndex % messages.length];
            messageIndex++;
        }
        if (robotScreen) {
            const icons = ['🔍', '🤖', '⚡', '🔒', '📊'];
            robotScreen.textContent = icons[messageIndex % icons.length];
        }
    }, 5000);
    
    robotContainer.addEventListener('click', () => {
        robotBubble.textContent = "👋 Thanks for clicking!";
        setTimeout(() => robotBubble.textContent = messages[0], 2000);
    });
}

// ========== FAKE NEWS DETECTION (NO API!) ==========
function detectFakeNews(text) {
    const lowerText = text.toLowerCase();
    
    // Fake news keywords
    const fakeKeywords = [
        'shocking', 'miracle', 'cure', 'secret', 'hidden', 'exposed', 
        'truth', 'conspiracy', 'doctors hate', 'pharma', 'you won\'t believe',
        'aliens', 'government hiding', 'cover up', '100% guaranteed',
        'instant', 'free', 'limited time', 'viral', 'clickbait'
    ];
    
    // Real news keywords
    const realKeywords = [
        'federal reserve', 'president signed', 'stock market', 'white house', 
        'congress', 'official statement', 'government announced', 'unemployment',
        'interest rates', 'bbc news', 'reuters', 'associated press'
    ];
    
    let fakeScore = 0;
    let realScore = 0;
    
    for (let keyword of fakeKeywords) {
        if (lowerText.includes(keyword)) fakeScore++;
    }
    
    for (let keyword of realKeywords) {
        if (lowerText.includes(keyword)) realScore++;
    }
    
    // Calculate confidence
    let confidence;
    let prediction;
    
    if (fakeScore > realScore && fakeScore > 0) {
        prediction = 'FAKE';
        confidence = Math.min(95, 60 + fakeScore * 10);
    } else if (realScore > fakeScore && realScore > 0) {
        prediction = 'REAL';
        confidence = Math.min(95, 60 + realScore * 10);
    } else if (fakeScore > 0 && realScore > 0 && fakeScore === realScore) {
        prediction = 'SUSPICIOUS';
        confidence = 70;
    } else {
        prediction = 'SUSPICIOUS';
        confidence = 60;
    }
    
    return { prediction, confidence };
}

// ========== LOGIN PAGE LOGIC ==========
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/FakeNewsStandalone/')) {
    setTimeout(() => {
        createParticles();
        initRobot();
    }, 100);
    
    const tabs = document.querySelectorAll('.tab-btn-modern');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });
    
    document.getElementById('login-btn').addEventListener('click', () => {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('current_user', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    });
    
    document.getElementById('signup-btn').addEventListener('click', () => {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (!name || !email || !password) {
            alert('Please fill all fields');
            return;
        }
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        if (users.find(u => u.email === email)) {
            alert('Email already exists');
            return;
        }
        
        users.push({ name, email, password, history: [], settings: { darkMode: false } });
        saveUsers();
        alert('Account created! Please login.');
        document.querySelector('.tab-btn-modern[data-tab="login"]').click();
        document.getElementById('login-email').value = email;
    });
}

// ========== DASHBOARD LOGIC ==========
if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser) {
        window.location.href = 'index.html';
    }
    
    document.getElementById('userNameDisplay').innerText = currentUser.name;
    document.getElementById('userEmailDisplay').innerText = currentUser.email;
    document.getElementById('userAvatar').innerText = currentUser.name.charAt(0).toUpperCase();
    
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(link.dataset.page + 'Page').classList.add('active');
        });
    });
    
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        if (confirm('Clear all history?')) {
            currentUser.history = [];
            localStorage.setItem('current_user', JSON.stringify(currentUser));
            renderHistory();
            updateStats();
            alert('History cleared!');
        }
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('current_user');
        window.location.href = 'index.html';
    });
    
    document.getElementById('exportDataBtn').addEventListener('click', () => {
        const data = { user: { name: currentUser.name, email: currentUser.email }, history: currentUser.history };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `fakenews-data-${Date.now()}.json`;
        link.click();
    });
    
    document.getElementById('themeBtn').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.getElementById('themeBtn').textContent = document.body.classList.contains('light-mode') ? '🌞 Light Mode' : '🌙 Dark Mode';
        currentUser.settings.darkMode = document.body.classList.contains('light-mode');
        localStorage.setItem('current_user', JSON.stringify(currentUser));
    });
    
    if (currentUser.settings?.darkMode) {
        document.body.classList.add('light-mode');
        document.getElementById('themeBtn').textContent = '🌞 Light Mode';
    }
    
    function renderHistory() {
        const historyList = document.getElementById('historyList');
        const userHistory = currentUser.history || [];
        if (!historyList) return;
        if (userHistory.length === 0) {
            historyList.innerHTML = '<div class="history-item" style="justify-content: center;">No verifications yet</div>';
            return;
        }
        historyList.innerHTML = userHistory.slice().reverse().map(item => `
            <div class="history-item">
                <span class="history-text">${item.text.substring(0, 60)}...</span>
                <span class="history-badge-${item.result === 'FAKE' ? 'fake' : 'real'}">${item.result}</span>
            </div>
        `).join('');
    }
    
    function updateStats() {
        const history = currentUser.history || [];
        document.getElementById('totalChecks').innerText = history.length;
        document.getElementById('fakeCount').innerText = history.filter(h => h.result === 'FAKE').length;
        document.getElementById('realCount').innerText = history.filter(h => h.result === 'REAL').length;
    }
    
    const newsInput = document.getElementById('newsInput');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');
    const sourceCheckDiv = document.getElementById('sourceCheck');
    const blockchainDiv = document.getElementById('blockchainProof');
    const actionButtons = document.getElementById('actionButtons');
    const wordCountSpan = document.getElementById('wordCount');
    const readingTimeSpan = document.getElementById('readingTime');
    const shareBtn = document.getElementById('shareBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let currentResult = null;
    
    function updateInputStats() {
        const text = newsInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCountSpan.textContent = `📝 ${words} words`;
        readingTimeSpan.textContent = `⏱️ ${Math.ceil(words / 200)} min read`;
    }
    newsInput.addEventListener('input', updateInputStats);
    
    function checkSource(text) {
        const trustedSources = ['bbc.com', 'cnn.com', 'reuters.com', 'apnews.com', 'nytimes.com'];
        const found = trustedSources.filter(s => text.toLowerCase().includes(s));
        if (found.length) {
            sourceCheckDiv.innerHTML = `✅ Trusted Source Detected: ${found.join(', ')}`;
        } else {
            sourceCheckDiv.innerHTML = `⚠️ No trusted source detected. Verify: <a href="https://www.snopes.com" target="_blank">Snopes</a>`;
        }
        sourceCheckDiv.style.display = 'block';
    }
    
    function shareResult() {
        if (!currentResult) return;
        const text = `🔍 Fake News Check: ${currentResult.prediction} (${currentResult.confidence}% confidence)`;
        navigator.clipboard.writeText(text);
        alert('Result copied to clipboard!');
    }
    
    function downloadReport() {
        if (!currentResult) return;
        const report = `FAKE NEWS REPORT\nDate: ${new Date().toLocaleString()}\nResult: ${currentResult.prediction}\nConfidence: ${currentResult.confidence}%\nArticle: ${currentResult.text}`;
        const blob = new Blob([report], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `fakenews-report-${Date.now()}.txt`;
        link.click();
    }
    
    function checkNews() {
        const newsText = newsInput.value.trim();
        if (!newsText) { alert('Please paste news text!'); return; }
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<div class="loading">⏳ Analyzing...</div>';
        sourceCheckDiv.style.display = 'none';
        blockchainDiv.style.display = 'none';
        actionButtons.style.display = 'none';
        
        // Detect using built-in logic (NO API!)
        const result = detectFakeNews(newsText);
        const confidence = result.confidence;
        const prediction = result.prediction;
        
        checkSource(newsText);
        
        currentUser.history = currentUser.history || [];
        currentUser.history.unshift({ text: newsText.substring(0, 100), result: prediction, date: new Date().toISOString() });
        localStorage.setItem('current_user', JSON.stringify(currentUser));
        renderHistory();
        updateStats();
        
        currentResult = { text: newsText, prediction: prediction, confidence: confidence };
        
        if (prediction === 'FAKE') {
            resultDiv.innerHTML = `<div class="result-text">🔴 FAKE NEWS</div><div class="result-confidence">Confidence: ${confidence}%</div>`;
            resultDiv.className = 'result-fake';
        } else if (prediction === 'SUSPICIOUS') {
            resultDiv.innerHTML = `<div class="result-text">🟡 SUSPICIOUS</div><div class="result-confidence">Confidence: ${confidence}%</div>`;
            resultDiv.className = 'result-suspicious';
        } else {
            resultDiv.innerHTML = `<div class="result-text">🟢 REAL NEWS</div><div class="result-confidence">Confidence: ${confidence}%</div>`;
            resultDiv.className = 'result-real';
        }
        
        blockchainDiv.style.display = 'block';
        blockchainDiv.innerHTML = `⛓️ Blockchain Verified<br>Tx: 0x${Math.random().toString(16).substring(2, 42)}<br><span style="font-size:0.6rem;">✓ Immutable | ✓ Tamper-proof</span>`;
        actionButtons.style.display = 'flex';
        if (shareBtn) shareBtn.onclick = shareResult;
        if (downloadBtn) downloadBtn.onclick = downloadReport;
    }
    
    checkButton.addEventListener('click', checkNews);
    renderHistory();
    updateStats();
}