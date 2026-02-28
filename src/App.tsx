import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Edit2, Check, Plus, ArrowUp, ArrowDown, Trash2, Timer as TimerIcon, Download, FileText } from 'lucide-react';
import { getHtmlTemplate } from './exportTemplate';

type Exercise = {
  id: string;
  name: string;
  desc: string;
  sets: number;
  isPress?: boolean;
};

type Day = {
  id: string;
  name: string;
  exercises: Exercise[];
};

const initialWorkoutData: Day[] = [
  {
    id: 'day1',
    name: "День 1: Ягодицы + Внутр. пов-сть",
    exercises: [
      { id: 'd1e1', name: "Сумо-присед", desc: "15 раз (блин 10кг)", sets: 1 },
      { id: 'd1e2', name: "Болгарские выпады", desc: "12 раз (1 гантель 7-8 кг)", sets: 1 },
      { id: 'd1e3', name: "Отведение ноги в кроссовере", desc: "12 - 15 раз", sets: 1 },
      { id: 'd1e4', name: "Сведение ног", desc: "15 раз", sets: 1 },
      { id: 'd1e5', name: "Подъёмы прямых ног лёжа", desc: "15 раз", sets: 1, isPress: true },
      { id: 'd1e6', name: "Dead Bug", desc: "15 раз", sets: 1, isPress: true },
      { id: 'd1e7', name: "Планка", desc: "60 секунд", sets: 1, isPress: true }
    ]
  },
  {
    id: 'day2',
    name: "День 2: Спина + Трицепс",
    exercises: [
      { id: 'd2e1', name: "Тяга верхнего блока", desc: "15 раз", sets: 1 },
      { id: 'd2e2', name: "Тяга горизонтального блока", desc: "15 раз", sets: 1 },
      { id: 'd2e3', name: "Разгибание рук на блоке", desc: "15 раз", sets: 1 },
      { id: 'd2e4', name: "Отжимания узкие", desc: "12 раз", sets: 1 },
      { id: 'd2e5', name: "Гиперэкстензия", desc: "12 раз (без веса / 5 кг)", sets: 1 },
      { id: 'd2e6', name: "Боковая планка", desc: "30-40 сек на сторону", sets: 1, isPress: true },
      { id: 'd2e7', name: "Русские скручивания", desc: "по 12 раз на сторону", sets: 1, isPress: true },
      { id: 'd2e8', name: "Подъёмы прямых ног лёжа", desc: "15 раз", sets: 1, isPress: true }
    ]
  },
  {
    id: 'day3',
    name: "День 3: Ягодицы + Поясница + Кор",
    exercises: [
      { id: 'd3e1', name: "Румынская тяга", desc: "15 раз (вес по 5 кг)", sets: 1 },
      { id: 'd3e2', name: "Step-up", desc: "15 раз (вес по 5 кг)", sets: 1 },
      { id: 'd3e3', name: "Ягодичный мост", desc: "15 раз (10 кг блин)", sets: 1 },
      { id: 'd3e4', name: "Подъём ног в упоре на локтях", desc: "12 раз", sets: 1 },
      { id: 'd3e5', name: "Подъёмы", desc: "15 раз", sets: 1, isPress: true },
      { id: 'd3e6', name: "Велосипед медленный", desc: "20 раз", sets: 1, isPress: true },
      { id: 'd3e7', name: "Планка с касанием плеч", desc: "20 раз", sets: 1, isPress: true }
    ]
  }
];

export default function App() {
  const [workoutData, setWorkoutData] = useState<Day[]>(() => {
    const saved = localStorage.getItem('workoutData');
    return saved ? JSON.parse(saved) : initialWorkoutData;
  });
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem('gymPoints') || '0'));
  const [checkedSets, setCheckedSets] = useState<Record<string, boolean>>({});
  const [extraSets, setExtraSets] = useState<Record<string, number>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const [timerVisible, setTimerVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => parseInt(localStorage.getItem('gymTimerDuration') || '90'));
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Custom Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'alert' });

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');

  // Settings State
  const [timerDuration, setTimerDuration] = useState(() => parseInt(localStorage.getItem('gymTimerDuration') || '90'));
  const [userName, setUserName] = useState(() => localStorage.getItem('gymUserName') || '');

  // Tabs Drag-to-Scroll State
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isDraggingTabs, setIsDraggingTabs] = useState(false);
  const [tabsStartX, setTabsStartX] = useState(0);
  const [tabsScrollLeft, setTabsScrollLeft] = useState(0);

  const handleTabsMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDraggingTabs(true);
    setTabsStartX(e.pageX - tabsRef.current.offsetLeft);
    setTabsScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleTabsMouseLeave = () => {
    setIsDraggingTabs(false);
  };

  const handleTabsMouseUp = () => {
    setIsDraggingTabs(false);
  };

  const handleTabsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTabs || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - tabsStartX) * 2;
    tabsRef.current.scrollLeft = tabsScrollLeft - walk;
  };

  const handleTabsWheel = (e: React.WheelEvent) => {
    if (!tabsRef.current) return;
    if (e.deltaY !== 0) {
      tabsRef.current.scrollLeft += e.deltaY;
    }
  };

  const showAlert = (title: string, message: string) => {
    setModalState({ isOpen: true, title, message, type: 'alert' });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalState({ isOpen: true, title, message, type: 'confirm', onConfirm });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
  }, [workoutData]);

  useEffect(() => {
    localStorage.setItem('gymPoints', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('gymTimerDuration', timerDuration.toString());
    if (!isTimerRunning) {
      setTimeLeft(timerDuration);
    }
  }, [timerDuration]);

  useEffect(() => {
    localStorage.setItem('gymUserName', userName);
  }, [userName]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playTimerSound();
      if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
      setTimeout(() => {
        showAlert("Таймер", "⏰ Время вышло! Начинайте следующий подход!");
        setTimeLeft(timerDuration);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerDuration]);

  const playTimerSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.2;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 600);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleCheck = (dayId: string, exId: string, setIndex: number, isChecked: boolean) => {
    const key = `${dayId}-${exId}-${setIndex}`;
    setCheckedSets(prev => ({ ...prev, [key]: isChecked }));
    
    const pointsToAdd = 10;
    if (isChecked) {
      setPoints(prev => prev + pointsToAdd);
      
      const badge = document.getElementById('points-badge');
      if (badge) {
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
      }

      setTimerVisible(true);
      setTimeLeft(timerDuration);
      setIsTimerRunning(true);
    } else {
      setPoints(prev => prev - pointsToAdd);
    }
  };

  const addExtraSet = (exId: string) => {
    setExtraSets(prev => ({ ...prev, [exId]: (prev[exId] || 0) + 1 }));
  };

  const addRound = () => {
    showConfirm("Новый круг", "Начать новый круг? Прогресс сбросится, но очки останутся.", () => {
      const currentDay = workoutData[currentDayIndex];
      const newCheckedSets = { ...checkedSets };
      currentDay.exercises.forEach(ex => {
        const totalSets = ex.sets + (extraSets[ex.id] || 0);
        for (let i = 0; i < totalSets; i++) {
          delete newCheckedSets[`${currentDay.id}-${ex.id}-${i}`];
        }
      });
      setCheckedSets(newCheckedSets);
      setExtraSets({});
      
      const badge = document.getElementById('points-badge');
      if (badge) {
        badge.style.background = 'linear-gradient(135deg, #00e676, #00c853)';
        setTimeout(() => {
           badge.style.background = 'linear-gradient(135deg, #ff9800, #ff5722)';
        }, 500);
      }
    });
  };

  const currentDay = workoutData[currentDayIndex];
  let totalSetsCount = 0;
  let completedSetsCount = 0;

  if (currentDay && currentDay.exercises) {
    currentDay.exercises.forEach(ex => {
      const sets = ex.sets + (extraSets[ex.id] || 0);
      totalSetsCount += sets;
      for (let i = 0; i < sets; i++) {
        if (checkedSets[`${currentDay.id}-${ex.id}-${i}`]) {
          completedSetsCount++;
        }
      }
    });
  }

  const progressPercent = totalSetsCount === 0 ? 0 : Math.round((completedSetsCount / totalSetsCount) * 100);

  useEffect(() => {
    if (progressPercent === 100 && totalSetsCount > 0) {
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      setTimeout(() => showAlert("Поздравляем!", "🎉 Тренировка завершена! Ты супер!"), 500);
    }
  }, [progressPercent, totalSetsCount]);

  const updateExercise = (dayIdx: number, exIdx: number, updates: Partial<Exercise>) => {
    const newData = [...workoutData];
    const newExercises = [...newData[dayIdx].exercises];
    newExercises[exIdx] = { ...newExercises[exIdx], ...updates };
    newData[dayIdx] = { ...newData[dayIdx], exercises: newExercises };
    setWorkoutData(newData);
  };

  const moveExercise = (dayIdx: number, exIdx: number, direction: -1 | 1) => {
    const newData = [...workoutData];
    const newExercises = [...newData[dayIdx].exercises];
    if (exIdx + direction < 0 || exIdx + direction >= newExercises.length) return;
    
    const temp = newExercises[exIdx];
    newExercises[exIdx] = newExercises[exIdx + direction];
    newExercises[exIdx + direction] = temp;
    
    newData[dayIdx] = { ...newData[dayIdx], exercises: newExercises };
    setWorkoutData(newData);
  };

  const deleteExercise = (dayIdx: number, exIdx: number) => {
    showConfirm("Удаление", "Удалить упражнение?", () => {
      const newData = [...workoutData];
      newData[dayIdx] = {
        ...newData[dayIdx],
        exercises: newData[dayIdx].exercises.filter((_, i) => i !== exIdx)
      };
      setWorkoutData(newData);
    });
  };

  const addNewExercise = (dayIdx: number) => {
    const newData = [...workoutData];
    newData[dayIdx] = {
      ...newData[dayIdx],
      exercises: [
        ...newData[dayIdx].exercises,
        {
          id: `new-${Date.now()}`,
          name: "Новое упражнение",
          desc: "Описание",
          sets: 1,
          isPress: false
        }
      ]
    };
    setWorkoutData(newData);
  };

  const updateDayName = (dayIdx: number, newName: string) => {
    const newData = [...workoutData];
    newData[dayIdx] = { ...newData[dayIdx], name: newName };
    setWorkoutData(newData);
  };

  const addNewDay = () => {
    const newDay = {
      id: `day-${Date.now()}`,
      name: `День ${workoutData.length + 1}`,
      exercises: []
    };
    setWorkoutData([...workoutData, newDay]);
    setCurrentDayIndex(workoutData.length);
  };

  const deleteCurrentDay = () => {
    if (workoutData.length <= 1) {
      showAlert("Ошибка", "Нельзя удалить единственный день тренировки!");
      return;
    }
    showConfirm("Удаление", "Удалить текущий день со всеми упражнениями?", () => {
      const newData = workoutData.filter((_, idx) => idx !== currentDayIndex);
      setWorkoutData(newData);
      setCurrentDayIndex(Math.max(0, currentDayIndex - 1));
    });
  };

  const resetToDefault = () => {
    showConfirm("Сброс программы", "ВНИМАНИЕ! Это удалит все ваши изменения и вернет стандартную программу (по 1 подходу). Продолжить?", () => {
      setWorkoutData(initialWorkoutData);
      setCheckedSets({});
      setExtraSets({});
      setPoints(0);
      setCurrentDayIndex(0);
    });
  };

  const parseImportText = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const newDays: Day[] = [];
    let currentDay: Day | null = null;

    lines.forEach((line, index) => {
      // Ищем признаки того, что это название дня (содержит слово "День" или не содержит тире/цифр)
      const isDayHeader = /^день\s*\d+/i.test(line) || (!line.includes('-') && !line.includes('—') && !line.match(/\d/));
      
      if (isDayHeader) {
        currentDay = {
          id: `day-${Date.now()}-${index}`,
          name: line,
          exercises: []
        };
        newDays.push(currentDay);
      } else {
        // Если дня еще нет, создаем дефолтный
        if (!currentDay) {
          currentDay = {
            id: `day-${Date.now()}-default`,
            name: "Импортированный день",
            exercises: []
          };
          newDays.push(currentDay);
        }

        // Очищаем от начальных маркеров списка
        const cleanLine = line.replace(/^[-—–*•]\s*/, '');
        
        // Пытаемся разбить на название и описание по тире
        const splitMatch = cleanLine.match(/^(.*?)\s*[-—–]\s*(.*)$/);
        let name = cleanLine;
        let desc = '';
        
        if (splitMatch) {
          name = splitMatch[1].trim();
          desc = splitMatch[2].trim();
        }

        const isPress = /планка|скручивания|подъём|dead bug|пресс|велосипед|гиперэкстензия/i.test(name);

        currentDay.exercises.push({
          id: `ex-${Date.now()}-${index}`,
          name,
          desc,
          sets: 1,
          isPress
        });
      }
    });

    return newDays;
  };

  const handleImport = () => {
    if (!importText.trim()) {
      showAlert("Ошибка", "Текст для импорта пуст!");
      return;
    }
    const parsedDays = parseImportText(importText);
    if (parsedDays.length === 0) {
      showAlert("Ошибка", "Не удалось распознать дни тренировок. Проверьте формат текста.");
      return;
    }
    
    setIsImportModalOpen(false);
    
    showConfirm("Импорт программы", `Распознано дней: ${parsedDays.length}. Текущая программа будет удалена. Продолжить?`, () => {
      setWorkoutData(parsedDays);
      setCheckedSets({});
      setExtraSets({});
      setPoints(0);
      setCurrentDayIndex(0);
      setImportText('');
    });
  };

  const exportToHTML = () => {
    const htmlContent = getHtmlTemplate(JSON.stringify(workoutData, null, 2), timerDuration, userName);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-workout.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-[130px] min-h-screen flex flex-col">
      <header className="bg-[#1e1e1e] p-5 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-b border-[#333] pt-[calc(20px+env(safe-area-inset-top))]">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#ff9800] to-[#ff5722] px-5 py-2.5 rounded-2xl font-black text-2xl shadow-[0_4px_15px_rgba(255,87,34,0.4)] min-w-[80px] text-center transition-all duration-200" id="points-badge">
              {points}
            </div>
            <button onClick={addRound} className="bg-[#333] border-2 border-[#ff4081] text-[#ff4081] px-4 py-2 rounded-xl font-bold text-sm uppercase transition-all active:bg-[#ff4081] active:text-white active:scale-95">
              🔄 Круг
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={exportToHTML}
              className="p-2 rounded-xl border-2 border-[#555] text-[#aaa] hover:text-white hover:border-white transition-all flex items-center gap-2"
              title="Скачать HTML"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-2 rounded-xl border-2 transition-all flex items-center gap-2 ${isEditMode ? 'bg-[#ff4081] border-[#ff4081] text-white' : 'border-[#555] text-[#aaa] hover:text-white'}`}
            >
              {isEditMode ? <Check size={20} /> : <Edit2 size={20} />}
              <span className="font-bold text-sm uppercase hidden sm:inline">{isEditMode ? 'Готово' : 'Редактировать'}</span>
            </button>
          </div>
        </div>
        
        <div className="bg-[#333] h-4 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[#ff4081] transition-all duration-500 shadow-[0_0_15px_#ff4081]" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-right text-[#aaa] font-bold mt-2 text-sm">
          {progressPercent}% выполнено ({completedSetsCount}/{totalSetsCount})
        </div>
      </header>

      <div 
        ref={tabsRef}
        onMouseDown={handleTabsMouseDown}
        onMouseLeave={handleTabsMouseLeave}
        onMouseUp={handleTabsMouseUp}
        onMouseMove={handleTabsMouseMove}
        onWheel={handleTabsWheel}
        className={`flex justify-start p-5 gap-3 bg-[#121212]/80 backdrop-blur-sm sticky top-[calc(130px+env(safe-area-inset-top))] z-40 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDraggingTabs ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        {workoutData.map((day, idx) => (
          <button
            key={day.id}
            onClick={() => setCurrentDayIndex(idx)}
            className={`px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md whitespace-nowrap ${
              currentDayIndex === idx 
                ? 'bg-[#ff4081] text-white -translate-y-0.5 shadow-[0_6px_15px_rgba(255,64,129,0.5)]' 
                : 'bg-[#252525] text-[#aaa] hover:bg-[#333]'
            }`}
          >
            {day.name || `День ${idx + 1}`}
          </button>
        ))}
        {isEditMode && (
          <button
            onClick={addNewDay}
            className="px-4 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md bg-[#252525] text-[#ff4081] border-2 border-dashed border-[#ff4081] hover:bg-[#ff4081]/10 whitespace-nowrap flex items-center gap-1"
          >
            <Plus size={16} /> День
          </button>
        )}
      </div>

      <main className="p-5 max-w-[700px] mx-auto w-full flex-1">
        {isEditMode && (
          <>
            <div className="mb-6 bg-[#1e1e1e] p-4 rounded-2xl border border-[#333] space-y-4">
              <h3 className="text-[#ff4081] font-bold uppercase text-sm">Общие настройки</h3>
              <div>
                <label className="text-[#aaa] text-xs font-bold uppercase block mb-1">Имя спортсмена</label>
                <input 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Например: Иван Иванов"
                  className="w-full bg-[#2a2a2a] text-white p-3 rounded-xl border border-[#444] focus:border-[#ff4081] outline-none font-bold"
                />
              </div>
              <div>
                <label className="text-[#aaa] text-xs font-bold uppercase block mb-1">Время отдыха (сек)</label>
                <input 
                  type="number"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#2a2a2a] text-white p-3 rounded-xl border border-[#444] focus:border-[#ff4081] outline-none font-bold"
                />
              </div>
            </div>

            <div className="mb-6 bg-[#1e1e1e] p-4 rounded-2xl border border-[#333]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[#aaa] text-xs font-bold uppercase block">Название дня</label>
                <button 
                  onClick={deleteCurrentDay}
                  className="text-[#ff5252] text-xs font-bold uppercase flex items-center gap-1 hover:underline"
                >
                  <Trash2 size={14} /> Удалить день
                </button>
              </div>
              <input 
                value={currentDay.name}
                onChange={(e) => updateDayName(currentDayIndex, e.target.value)}
                className="w-full bg-[#2a2a2a] text-white p-3 rounded-xl border border-[#444] focus:border-[#ff4081] outline-none font-bold mb-4"
              />
              
              <button 
                onClick={() => setIsImportModalOpen(true)}
                className="w-full bg-[#2a2a2a] text-[#00e5ff] border border-[#00e5ff]/30 p-3 rounded-xl font-bold text-sm transition-all hover:bg-[#00e5ff]/10 flex items-center justify-center gap-2 mb-4"
              >
                <FileText size={16} /> Импорт программы из текста
              </button>

              <button 
                onClick={resetToDefault}
                className="w-full bg-[#ff5252]/10 text-[#ff5252] border border-[#ff5252]/30 p-3 rounded-xl font-bold text-sm transition-all hover:bg-[#ff5252]/20 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Сбросить всю программу (вернуть 1 подход)
              </button>
            </div>
          </>
        )}

        {(() => {
          let pressSectionStarted = false;
          
          return currentDay.exercises.map((ex, exIdx) => {
            const showPressTitle = ex.isPress && !pressSectionStarted;
            if (showPressTitle) pressSectionStarted = true;

            const totalSets = ex.sets + (extraSets[ex.id] || 0);

            return (
              <React.Fragment key={ex.id}>
                {showPressTitle && (
                  <div className="text-[#00e5ff] uppercase text-sm tracking-wider mt-8 mb-4 border-b-2 border-[#00e5ff] pb-2 font-bold">
                    🔥 Блок Пресса / Кора
                  </div>
                )}

                {isEditMode ? (
                  <div className={`bg-[#1e1e1e] rounded-2xl p-5 mb-5 border-l-8 shadow-lg flex flex-col gap-4 ${ex.isPress ? 'border-[#00e5ff]' : 'border-[#ff4081]'}`}>
                    <div className="flex justify-between items-center border-b border-[#333] pb-3">
                      <span className="font-bold text-[#aaa] uppercase text-xs tracking-wider">Упражнение {exIdx + 1}</span>
                      <div className="flex gap-2">
                        <button onClick={() => moveExercise(currentDayIndex, exIdx, -1)} disabled={exIdx === 0} className="p-2 bg-[#2a2a2a] rounded-lg text-white disabled:opacity-30"><ArrowUp size={16} /></button>
                        <button onClick={() => moveExercise(currentDayIndex, exIdx, 1)} disabled={exIdx === currentDay.exercises.length - 1} className="p-2 bg-[#2a2a2a] rounded-lg text-white disabled:opacity-30"><ArrowDown size={16} /></button>
                        <button onClick={() => deleteExercise(currentDayIndex, exIdx)} className="p-2 bg-[#ff5252]/20 text-[#ff5252] rounded-lg ml-2"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[#aaa] text-xs font-bold uppercase mb-1 block">Название</label>
                      <input value={ex.name} onChange={e => updateExercise(currentDayIndex, exIdx, {name: e.target.value})} className="w-full bg-[#2a2a2a] text-white p-3 rounded-xl border border-[#444] focus:border-[#ff4081] outline-none font-bold text-lg" />
                    </div>
                    
                    <div>
                      <label className="text-[#aaa] text-xs font-bold uppercase mb-1 block">Описание (вес, повторения)</label>
                      <input value={ex.desc} onChange={e => updateExercise(currentDayIndex, exIdx, {desc: e.target.value})} className="w-full bg-[#2a2a2a] text-[#aaa] p-3 rounded-xl border border-[#444] focus:border-[#ff4081] outline-none italic" />
                    </div>
                    
                    <div className="flex items-center gap-6 mt-2 flex-wrap">
                      <label className="flex items-center gap-3 text-white font-medium">
                        <span className="text-[#aaa] text-sm uppercase font-bold">Подходов:</span>
                        <div className="flex items-center bg-[#2a2a2a] rounded-lg border border-[#444] overflow-hidden">
                          <button 
                            onClick={() => updateExercise(currentDayIndex, exIdx, {sets: Math.max(1, ex.sets - 1)})}
                            className="px-3 py-2 hover:bg-[#333] text-white font-bold border-r border-[#444]"
                          >-</button>
                          <span className="px-4 py-2 text-white font-bold min-w-[40px] text-center">{ex.sets}</span>
                          <button 
                            onClick={() => updateExercise(currentDayIndex, exIdx, {sets: Math.min(10, ex.sets + 1)})}
                            className="px-3 py-2 hover:bg-[#333] text-white font-bold border-l border-[#444]"
                          >+</button>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 text-white font-medium cursor-pointer">
                        <input type="checkbox" checked={ex.isPress || false} onChange={e => updateExercise(currentDayIndex, exIdx, {isPress: e.target.checked})} className="w-5 h-5 accent-[#00e5ff]" />
                        <span className={ex.isPress ? 'text-[#00e5ff]' : 'text-[#aaa]'}>Блок Пресса</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className={`bg-[#1e1e1e] rounded-2xl p-5 mb-5 border-l-8 shadow-lg ${ex.isPress ? 'border-[#00e5ff] press-card' : 'border-[#ff4081]'}`}>
                    <div className="mb-4">
                      <div className="text-2xl font-extrabold leading-tight mb-1">{ex.name}</div>
                      <div className="text-lg text-[#aaa] italic">{ex.desc}</div>
                    </div>
                    
                    <ul className="m-0 p-0 list-none">
                      {Array.from({ length: totalSets }).map((_, setIdx) => {
                        const isChecked = checkedSets[`${currentDay.id}-${ex.id}-${setIdx}`] || false;
                        return (
                          <li key={setIdx} className="flex items-center justify-between py-4 border-b border-[#333] last:border-0">
                            <label className="flex items-center gap-4 flex-1 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="custom-checkbox"
                                checked={isChecked}
                                onChange={(e) => handleCheck(currentDay.id, ex.id, setIdx, e.target.checked)}
                              />
                              <span className={`text-xl font-medium transition-all ${isChecked ? 'line-through text-[#555]' : 'text-white'}`}>
                                Подход {setIdx + 1}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    
                    <button 
                      onClick={() => addExtraSet(ex.id)}
                      className="w-full bg-[#2a2a2a] text-[#aaa] border-2 border-dashed border-[#555] p-4 mt-4 rounded-xl font-bold text-lg transition-all active:bg-[#333] active:text-white flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> Ещё подход
                    </button>
                  </div>
                )}
              </React.Fragment>
            );
          });
        })()}

        {isEditMode && (
          <button 
            onClick={() => addNewExercise(currentDayIndex)}
            className="w-full bg-[#1e1e1e] text-[#ff4081] border-2 border-dashed border-[#ff4081] p-5 rounded-2xl font-bold text-lg transition-all hover:bg-[#ff4081]/10 flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={24} /> Добавить упражнение
          </button>
        )}
      </main>

      <button 
        onClick={() => setTimerVisible(true)}
        className={`fixed bottom-[calc(130px+env(safe-area-inset-bottom))] right-[calc(20px+env(safe-area-inset-right))] w-[60px] h-[60px] rounded-full flex justify-center items-center shadow-[0_5px_20px_rgba(0,0,0,0.5)] z-40 text-2xl border-3 transition-all ${
          !timerVisible ? 'flex' : 'hidden'
        } ${
          isTimerRunning 
            ? 'bg-[#ff5252] border-[#ff5252] animate-pulse-shadow' 
            : 'bg-[#333] border-[#555]'
        }`}
        style={{
          boxShadow: isTimerRunning ? '0 0 0 0 rgba(255, 82, 82, 0.7)' : '0 5px 20px rgba(0,0,0,0.5)'
        }}
      >
        <TimerIcon size={28} color="white" />
      </button>

      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-b from-[#2a2a2a] to-[#1e1e1e] border-t-4 border-[#ff4081] p-3 pb-[calc(12px+env(safe-area-inset-bottom))] px-[calc(10px+env(safe-area-inset-left))] z-50 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] transition-transform duration-300 ${timerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-[700px] mx-auto flex items-center justify-between gap-3">
          <div className={`text-5xl font-black tabular-nums min-w-[110px] text-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${timeLeft < 10 ? 'text-[#ff5252] drop-shadow-[0_0_15px_rgba(255,82,82,0.6)] animate-pulse' : ''}`}>
            {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-14 h-14 rounded-xl bg-[#ff9800] text-black flex items-center justify-center transition-transform active:scale-90"
            >
              {isTimerRunning ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={() => { setIsTimerRunning(false); setTimeLeft(timerDuration); }}
              className="w-14 h-14 rounded-xl bg-[#ff4081] text-black flex items-center justify-center transition-transform active:scale-90"
            >
              <RotateCcw size={28} />
            </button>
            <button 
              onClick={() => setTimerVisible(false)}
              className="w-14 h-14 rounded-xl bg-[#444] text-white flex items-center justify-center transition-transform active:scale-90"
            >
              <X size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Modal for Alerts and Confirms */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-white mb-2">{modalState.title}</h3>
            <p className="text-[#aaa] mb-6">{modalState.message}</p>
            <div className="flex gap-3 justify-end">
              {modalState.type === 'confirm' && (
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl font-bold text-[#aaa] bg-[#2a2a2a] hover:bg-[#333] transition-colors"
                >
                  Отмена
                </button>
              )}
              <button 
                onClick={() => {
                  if (modalState.type === 'confirm' && modalState.onConfirm) {
                    modalState.onConfirm();
                  }
                  closeModal();
                }}
                className="px-4 py-2 rounded-xl font-bold text-white bg-[#ff4081] hover:bg-[#c60055] transition-colors"
              >
                {modalState.type === 'confirm' ? 'Подтвердить' : 'ОК'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh]">
            <h3 className="text-xl font-bold text-white mb-2">Импорт из текста</h3>
            <p className="text-[#aaa] text-sm mb-4">
              Вставьте текст программы. Дни должны начинаться с текста (например, "День 1"), а упражнения — с дефиса ("-").
            </p>
            <textarea 
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="День 1 - Спина&#10;- Подтягивания - 10 раз&#10;- Тяга блока - 15 раз"
              className="w-full flex-1 min-h-[200px] bg-[#2a2a2a] text-white p-3 rounded-xl border border-[#444] focus:border-[#00e5ff] outline-none font-mono text-sm mb-4 resize-none"
            />
            <div className="flex gap-3 justify-end mt-auto">
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl font-bold text-[#aaa] bg-[#2a2a2a] hover:bg-[#333] transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleImport}
                className="px-4 py-2 rounded-xl font-bold text-black bg-[#00e5ff] hover:bg-[#00b8cc] transition-colors"
              >
                Распознать и импортировать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

