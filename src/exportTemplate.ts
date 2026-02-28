export const getHtmlTemplate = (workoutDataJson: string, timerDuration: number, userName: string) => `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Моя Программа PRO</title>
    <style>
        :root {
            --primary: #ff4081;
            --primary-dark: #c60055;
            --bg: #121212;
            --card-bg: #1e1e1e;
            --text: #ffffff;
            --text-sec: #aaaaaa;
            --accent-press: #00e5ff;
            --success: #00e676;
            --warning: #ff9800;
            --danger: #ff5252;
        }

        * {
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            min-height: -webkit-fill-available;
            overscroll-behavior-y: contain;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            padding-bottom: 110px;
            -webkit-tap-highlight-color: transparent;
            padding-bottom: calc(110px + env(safe-area-inset-bottom));
        }

        /* --- Header & Stats --- */
        header {
            background: var(--card-bg);
            padding: 20px;
            padding-top: calc(20px + env(safe-area-inset-top));
            position: sticky;
            top: env(safe-area-inset-top);
            z-index: 100;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            border-bottom: 1px solid #333;
        }

        .stats-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .points-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .points-badge {
            background: linear-gradient(135deg, #ff9800, #ff5722);
            padding: 10px 20px;
            border-radius: 15px;
            font-weight: 900;
            font-size: 1.4rem;
            box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4);
            min-width: 80px;
            text-align: center;
        }

        .user-name {
            font-size: 1.2rem;
            font-weight: 800;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-left: auto;
        }

        .btn-round {
            background: #333;
            border: 2px solid var(--primary);
            color: var(--primary);
            padding: 8px 15px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 0.9rem;
            cursor: pointer;
            transition: 0.2s;
            text-transform: uppercase;
        }

        .btn-round:active {
            background: var(--primary);
            color: white;
            transform: scale(0.95);
        }

        /* --- Progress Bar --- */
        .progress-container {
            background: #333;
            height: 16px;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }

        .progress-bar {
            height: 100%;
            width: 0%;
            background: var(--primary);
            transition: width 0.5s ease;
            box-shadow: 0 0 15px var(--primary);
        }

        .progress-text {
            font-size: 1rem;
            color: var(--text-sec);
            margin-top: 8px;
            text-align: right;
            font-weight: bold;
        }

        /* --- Tabs (Days) --- */
        .tabs {
            display: flex;
            justify-content: flex-start;
            padding: 20px 10px;
            gap: 15px;
            background: var(--bg);
            position: sticky;
            top: calc(130px + env(safe-area-inset-top));
            z-index: 90;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            overflow-x: auto;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
            cursor: grab;
        }
        
        .tabs.grabbing {
            cursor: grabbing;
            user-select: none;
        }
        
        .tabs::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }

        .tab-btn {
            background: #252525;
            border: none;
            color: var(--text-sec);
            padding: 12px 25px;
            border-radius: 15px;
            cursor: pointer;
            font-weight: 800;
            font-size: 1rem;
            transition: 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            white-space: nowrap;
        }

        .tab-btn.active {
            background: var(--primary);
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(255, 64, 129, 0.5);
        }

        /* --- Workout List --- */
        .workout-container {
            padding: 20px;
            max-width: 700px;
            margin: 0 auto;
        }

        .section-title {
            color: var(--text-sec);
            text-transform: uppercase;
            font-size: 1rem;
            letter-spacing: 1.5px;
            margin: 30px 0 15px 0;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            font-weight: bold;
        }
        
        .section-title.press {
            color: var(--accent-press);
            border-color: var(--accent-press);
        }

        .exercise-card {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 8px solid var(--primary);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .exercise-card.press-card {
            border-left-color: var(--accent-press);
        }

        .exercise-header {
            margin-bottom: 15px;
        }

        .exercise-name {
            font-size: 1.4rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 5px;
        }
        
        .exercise-desc {
            font-size: 1.1rem;
            color: var(--text-sec);
            font-style: italic;
        }

        .sets-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .set-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #333;
        }

        .set-item:last-child {
            border-bottom: none;
        }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-grow: 1;
        }

        /* Custom Checkbox - BIG */
        input[type="checkbox"] {
            appearance: none;
            width: 35px;
            height: 35px;
            border: 3px solid #555;
            border-radius: 10px;
            cursor: pointer;
            position: relative;
            background: #222;
            transition: 0.2s;
            flex-shrink: 0;
        }

        input[type="checkbox"]:checked {
            background-color: var(--primary);
            border-color: var(--primary);
            transform: scale(1.05);
        }
        
        .press-card input[type="checkbox"]:checked {
            background-color: var(--accent-press);
            border-color: var(--accent-press);
        }

        input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            color: #fff;
            font-weight: 900;
            left: 8px;
            top: 2px;
            font-size: 24px;
        }

        .set-label {
            color: var(--text);
            font-size: 1.2rem;
            font-weight: 500;
        }

        input[type="checkbox"]:checked + .set-label {
            text-decoration: line-through;
            color: #555;
        }

        .btn-add {
            background: #2a2a2a;
            color: var(--text-sec);
            border: 2px dashed #555;
            width: 100%;
            padding: 15px;
            margin-top: 15px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            transition: 0.2s;
        }
        
        .btn-add:active {
            background: #333;
            color: #fff;
        }

        /* ==========================================
           КОМПАКТНАЯ ПАНЕЛЬ ТАЙМЕРА (БЕЗ ТЕКСТА)
           ========================================== */
        .timer-fixed-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%);
            border-top: 3px solid var(--primary);
            padding: 12px 10px;
            padding-bottom: calc(12px + env(safe-area-inset-bottom));
            padding-left: calc(10px + env(safe-area-inset-left));
            padding-right: calc(10px + env(safe-area-inset-right));
            z-index: 1000;
            box-shadow: 0 -5px 30px rgba(0,0,0,0.8);
            display: none;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            will-change: transform;
        }

        .timer-fixed-bar.active {
            display: block;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                transform: translateY(100%);
            }
            to {
                transform: translateY(0);
            }
        }

        .timer-bar-content {
            max-width: 700px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .timer-bar-display {
            font-size: 2.8rem;
            font-weight: 900;
            font-variant-numeric: tabular-nums;
            color: #fff;
            min-width: 110px;
            text-align: center;
            text-shadow: 0 0 15px rgba(255,255,255,0.2);
        }

        .timer-bar-display.warning {
            color: var(--danger);
            text-shadow: 0 0 15px rgba(255, 82, 82, 0.6);
            animation: blink 0.5s ease infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .timer-bar-controls {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }

        .timer-bar-btn {
            width: 55px;
            height: 55px;
            border: none;
            border-radius: 12px;
            font-size: 1.8rem;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        .timer-bar-btn.pause {
            background: var(--warning);
            color: #000;
        }

        .timer-bar-btn.reset {
            background: var(--primary);
            color: #000;
        }

        .timer-bar-btn.close {
            background: #444;
            color: #fff;
            font-size: 1.5rem;
        }

        .timer-bar-btn:active {
            transform: scale(0.92);
            opacity: 0.9;
        }

        /* Плавающая кнопка для открытия таймера */
        .fab-timer {
            position: fixed;
            bottom: calc(130px + env(safe-area-inset-bottom));
            right: calc(20px + env(safe-area-inset-right));
            width: 60px;
            height: 60px;
            background: #333;
            border-radius: 50%;
            display: none;
            justify-content: center;
            align-items: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            cursor: pointer;
            z-index: 999;
            font-size: 28px;
            border: 3px solid #555;
            transition: all 0.3s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        
        .fab-timer.visible {
            display: flex;
        }
        
        .fab-timer.running {
            background: var(--danger);
            border-color: var(--danger);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(255, 82, 82, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
        }
        
        .fab-timer:active {
            transform: scale(0.9);
        }

        @media (max-width: 400px) {
            .timer-bar-display {
                font-size: 2.3rem;
                min-width: 95px;
            }
            
            .timer-bar-btn {
                width: 50px;
                height: 50px;
                font-size: 1.5rem;
            }
            
            .timer-bar-controls {
                gap: 6px;
            }
        }

        /* --- Welcome Modal --- */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid #333;
        }

        .modal-overlay.active .modal-content {
            transform: scale(1);
        }

        .modal-title {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 15px;
            color: var(--primary);
        }

        .modal-text {
            font-size: 1.1rem;
            color: var(--text-sec);
            line-height: 1.5;
            margin-bottom: 25px;
        }

        .modal-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 15px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: 0.2s;
            box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4);
        }

        .modal-btn:active {
            transform: scale(0.95);
        }

    </style>
</head>
<body>

<header>
    <div class="stats-row">
        <div class="points-container">
            <div class="points-badge"><span id="points">0</span></div>
            <button class="btn-round" onclick="addRound()">🔄 Круг</button>
        </div>
        ${userName ? `<div class="user-name">${userName}</div>` : ''}
    </div>
    <div class="progress-container">
        <div class="progress-bar" id="progressBar"></div>
    </div>
    <div class="progress-text" id="progressText">0% выполнено</div>
</header>

<div class="tabs" id="tabsContainer">
    <!-- Tabs will be rendered here -->
</div>

<div id="workoutArea" class="workout-container">
    <!-- Exercises will be rendered here -->
</div>

<div class="fab-timer" id="fabTimer" onclick="showTimerBar()">⏱️</div>

<div class="timer-fixed-bar" id="timerFixedBar">
    <div class="timer-bar-content">
        <div class="timer-bar-display" id="timerDisplay">01:30</div>
        <div class="timer-bar-controls">
            <button class="timer-bar-btn pause" id="btnPause" onclick="togglePause()" title="Пауза/Старт">⏸️</button>
            <button class="timer-bar-btn reset" onclick="resetTimer()" title="Сбросить">↺</button>
            <button class="timer-bar-btn close" onclick="hideTimerBar()" title="Закрыть">✕</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="welcomeModal">
    <div class="modal-content">
        <div class="modal-title">Привет! 👋</div>
        <div class="modal-text">Выполните первый подход и отметьте его галочкой в чекбоксе, чтобы запустить таймер отдыха до следующего подхода. Успешной тренировки!</div>
        <button class="modal-btn" onclick="closeWelcomeModal()">Вперед!</button>
    </div>
</div>

<script>
    const workoutData = ${workoutDataJson};
    
    let currentDayIndex = 0;
    let totalPoints = parseInt(localStorage.getItem('gymPoints')) || 0;
    document.getElementById('points').innerText = totalPoints;

    renderTabs();
    renderWorkout(currentDayIndex);

    // Drag and Wheel Scroll for Tabs
    const tabsContainer = document.getElementById('tabsContainer');
    let isDown = false;
    let startX;
    let scrollLeft;

    tabsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        tabsContainer.classList.add('grabbing');
        startX = e.pageX - tabsContainer.offsetLeft;
        scrollLeft = tabsContainer.scrollLeft;
    });
    tabsContainer.addEventListener('mouseleave', () => {
        isDown = false;
        tabsContainer.classList.remove('grabbing');
    });
    tabsContainer.addEventListener('mouseup', () => {
        isDown = false;
        tabsContainer.classList.remove('grabbing');
    });
    tabsContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - tabsContainer.offsetLeft;
        const walk = (x - startX) * 2;
        tabsContainer.scrollLeft = scrollLeft - walk;
    });
    tabsContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            tabsContainer.scrollLeft += e.deltaY;
        }
    });

    // Show welcome modal on load
    window.addEventListener('load', () => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
        if (!hasSeenWelcome) {
            document.getElementById('welcomeModal').classList.add('active');
        }
    });

    function closeWelcomeModal() {
        document.getElementById('welcomeModal').classList.remove('active');
        localStorage.setItem('hasSeenWelcomeModal', 'true');
    }

    function renderTabs() {
        const tabsContainer = document.getElementById('tabsContainer');
        tabsContainer.innerHTML = '';
        workoutData.forEach((day, index) => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn' + (index === currentDayIndex ? ' active' : '');
            btn.innerText = day.name || ('День ' + (index + 1));
            btn.onclick = () => switchDay(index);
            tabsContainer.appendChild(btn);
        });
    }

    function switchDay(index) {
        currentDayIndex = index;
        renderTabs();
        renderWorkout(index);
    }

    function renderWorkout(dayIndex) {
        const container = document.getElementById('workoutArea');
        container.innerHTML = '';
        const dayData = workoutData[dayIndex];

        let pressSectionStarted = false;

        dayData.exercises.forEach((ex, exIndex) => {
            if (ex.isPress && !pressSectionStarted) {
                const pressTitle = document.createElement('div');
                pressTitle.className = 'section-title press';
                pressTitle.innerText = '🔥 Блок Пресса / Кора';
                container.appendChild(pressTitle);
                pressSectionStarted = true;
            }

            const card = document.createElement('div');
            card.className = ex.isPress ? 'exercise-card press-card' : 'exercise-card';
            
            let setsHtml = '';
            for(let i=0; i<ex.sets; i++) {
                setsHtml += \`
                    <li class="set-item">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" onchange="handleCheck(this, \${exIndex}, \${i})">
                            <span class="set-label">Подход \${i+1}</span>
                        </div>
                    </li>
                \`;
            }

            card.innerHTML = \`
                <div class="exercise-header">
                    <div>
                        <div class="exercise-name">\${ex.name}</div>
                        <div class="exercise-desc">\${ex.desc}</div>
                    </div>
                </div>
                <ul class="sets-list" id="sets-\${dayIndex}-\${exIndex}">
                    \${setsHtml}
                </ul>
                <button class="btn-add" onclick="addExtraSet(\${dayIndex}, \${exIndex})">+ Ещё подход</button>
            \`;
            container.appendChild(card);
        });
        updateProgress();
    }

    function handleCheck(checkbox, exIndex, setIndex) {
        const pointsToAdd = 10;
        if (checkbox.checked) {
            totalPoints += pointsToAdd;
            animatePoints(pointsToAdd);
            showTimerBar();
            resetTimer();
            startTimer();
        } else {
            totalPoints -= pointsToAdd;
        }
        localStorage.setItem('gymPoints', totalPoints);
        document.getElementById('points').innerText = totalPoints;
        updateProgress();
    }

    function addExtraSet(dayIndex, exIndex) {
        const list = document.getElementById(\`sets-\${dayIndex}-\${exIndex}\`);
        const count = list.children.length + 1;
        const li = document.createElement('li');
        li.className = 'set-item';
        li.innerHTML = \`
            <div class="checkbox-wrapper">
                <input type="checkbox" onchange="handleCheck(this, \${exIndex}, \${count-1})">
                <span class="set-label">Доп. подход \${count}</span>
            </div>
        \`;
        list.appendChild(li);
        updateProgress();
    }

    function updateProgress() {
        const allChecks = document.querySelectorAll('input[type="checkbox"]');
        const checkedChecks = document.querySelectorAll('input[type="checkbox"]:checked');
        
        const total = allChecks.length;
        const completed = checkedChecks.length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('progressBar').style.width = percent + '%';
        document.getElementById('progressText').innerText = \`\${percent}% выполнено (\${completed}/\${total})\`;

        if(percent === 100 && total > 0) {
            celebrate();
        }
    }

    function animatePoints(amount) {
        const badge = document.querySelector('.points-badge');
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }

    function celebrate() {
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
        setTimeout(() => alert("🎉 Тренировка завершена! Ты супер!"), 500);
    }

    function addRound() {
        if(!confirm("Начать новый круг? Прогресс сбросится, но очки останутся.")) return;
        
        const allChecks = document.querySelectorAll('input[type="checkbox"]');
        allChecks.forEach(chk => chk.checked = false);
        
        const badge = document.querySelector('.points-badge');
        badge.style.background = 'linear-gradient(135deg, #00e676, #00c853)';
        setTimeout(() => {
             badge.style.background = 'linear-gradient(135deg, #ff9800, #ff5722)';
        }, 500);
        
        updateProgress();
    }
    
    function showTimerBar() {
        const bar = document.getElementById('timerFixedBar');
        const fab = document.getElementById('fabTimer');
        bar.classList.add('active');
        fab.classList.remove('visible');
    }

    function hideTimerBar() {
        const bar = document.getElementById('timerFixedBar');
        const fab = document.getElementById('fabTimer');
        bar.classList.remove('active');
        fab.classList.add('visible');
    }

    let timerInterval;
    let timerDuration = ${timerDuration};
    let timeLeft = timerDuration;
    let isTimerRunning = false;
    
    const timerDisplay = document.getElementById('timerDisplay');
    const btnPause = document.getElementById('btnPause');

    function startTimer() {
        if(isTimerRunning) return;
        if(timeLeft <= 0) {
            resetTimer();
        }
        isTimerRunning = true;
        updatePauseButton();
        
        const fab = document.getElementById('fabTimer');
        fab.classList.add('running');

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                timerFinished();
            }
        }, 1000);
    }

    function togglePause() {
        if(isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function pauseTimer() {
        if(!isTimerRunning) return;
        clearInterval(timerInterval);
        isTimerRunning = false;
        updatePauseButton();
        
        const fab = document.getElementById('fabTimer');
        fab.classList.remove('running');
    }

    function resetTimer() {
        stopTimer();
        timeLeft = timerDuration;
        updateTimerDisplay();
        timerDisplay.classList.remove('warning');
        updatePauseButton();
    }

    function stopTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        
        const fab = document.getElementById('fabTimer');
        fab.classList.remove('running');
    }

    function updateTimerDisplay() {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.innerText = \`\${m}:\${s}\`;
        
        if(timeLeft < 10) timerDisplay.classList.add('warning');
        else timerDisplay.classList.remove('warning');
    }
    
    function updatePauseButton() {
        if(isTimerRunning) {
            btnPause.innerHTML = "⏸️";
        } else {
            btnPause.innerHTML = "▶️";
        }
    }

    function timerFinished() {
        stopTimer();
        
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.value = 880; 
            gainNode.gain.value = 0.2;
            oscillator.start();
            setTimeout(() => oscillator.stop(), 600);
        } catch(e) {}

        if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
        
        setTimeout(() => {
            alert("⏰ Время вышло! Начинайте следующий подход!");
            resetTimer();
        }, 100);
    }

</script>

</body>
</html>`;
