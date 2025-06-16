let count = 0;
let lastSoundIndex = -1; // 新增上次播放索引
const counterElement = document.getElementById('count');

// 移除固定音频元素

// 新增声音文件数组
const soundFiles = Array.from({length: 10}, (_, i) => `audio/sheep${i+1}.mp3`);

// 主点击处理
document.addEventListener('click', (e) => {
    const settingsModal = document.getElementById('settingsModal');
    // 检查点击是否发生在设置模态框内部或设置按钮上
    if (!settingsModal.contains(e.target) && e.target.id !== 'settingsBtn' && !e.target.closest('#settingsBtn')) {
        createSheep(e.clientX, e.clientY);
        playSound();
        updateCounter();
    }
});

// 修改 playSound 函数
function playSound() {
    let currentIndex;
    do {
        currentIndex = Math.floor(Math.random() * soundFiles.length);
    } while(currentIndex === lastSoundIndex);
    
    const audio = new Audio(soundFiles[currentIndex]);
    lastSoundIndex = currentIndex;
    
    audio.play().catch(() => {
        document.body.addEventListener('click', () => audio.play(), { once: true });
    });
    audio.volume = currentVolume / 100;
}

function createSheep(x, y) {
    const sheepContainer = document.createElement('div');
    sheepContainer.className = 'sheep';
    sheepContainer.style.left = `${x - 30}px`;
    sheepContainer.style.top = `${y - 30}px`;
    sheepContainer.style.setProperty('--rotation', `${Math.random() * 360}deg`);

    const sheep = document.createElement('img');
    sheep.src = 'sheepy.png';
    sheep.alt = 'Sheep';
    sheep.className = 'sheep-inner';

    sheepContainer.appendChild(sheep);
    document.body.appendChild(sheepContainer);
    
    setTimeout(() => {
        sheep.remove();
    }, 1400);
}

function updateCounter() {
    count++;
    counterElement.textContent = count;
    // 当计数增加时，确保重置按钮是可用的
    if (resetCountBtn) { // 确保按钮已加载
        resetCountBtn.disabled = false;
    }
}

// 新增：重置计数器函数
function resetCounter() {
    count = 0;
    counterElement.textContent = count;
    // 禁用按钮，因为计数已为0
    if (resetCountBtn) { // 确保按钮已加载
        resetCountBtn.disabled = true;
    }
    // 轻微反馈：可以简单地改变一下按钮文字或样式，然后恢复
    const originalText = resetCountBtn.textContent;
    resetCountBtn.textContent = '已清空!';
    setTimeout(() => {
        resetCountBtn.textContent = originalText;
    }, 1000); // 1秒后恢复文字
}

// 新增音量相关变量
let currentVolume = 50;
let isMuted = false;

// 页面加载时初始化音量图标
document.addEventListener('DOMContentLoaded', () => {
  updateVolumeIcon();
});

// 获取新的模态窗口元素
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
const resetCountBtn = document.getElementById('resetCountBtn'); // 获取重置按钮
// 定时器功能元素
const timerDurationInput = document.getElementById('timerDuration');
const countdownDisplay = document.getElementById('countdownDisplay');
const startTimerBtn = document.getElementById('startTimerBtn');

// 初始化设置菜单（新的模态窗口逻辑）
document.getElementById('settingsBtn').addEventListener('click', (e) => {
  e.stopPropagation(); // 阻止事件冒泡，避免立即触发全局点击关闭
  settingsModal.classList.add('show');
});

// 关闭模态窗口按钮事件
closeSettingsModalBtn.addEventListener('click', () => {
  settingsModal.classList.remove('show');
});

// 新增：重置计数按钮事件
if (resetCountBtn) { // 确保按钮存在
    // 初始化按钮状态
    resetCountBtn.disabled = (count === 0);

    resetCountBtn.addEventListener('click', () => {
        if (count > 0) { // 再次检查，以防万一
            resetCounter();
        }
    });
}

// 点击模态窗口外部区域关闭菜单
settingsModal.addEventListener('click', (e) => {
  // 如果点击的是覆盖层本身，而不是菜单内容区域
  if (e.target === settingsModal) {
    settingsModal.classList.remove('show');
  }
});

// 音量滑动条事件
document.getElementById('volumeSlider').addEventListener('input', (e) => {
  currentVolume = parseInt(e.target.value);
  document.getElementById('volumeValue').textContent = currentVolume;
  updateVolumeIcon();
});

// 定时器状态变量
let timerInterval = null;
let autoClickInterval = null;
let remainingTime = 0; // 秒
let isTimerRunning = false;
let isTimerPaused = false;
let selectedDurationInSeconds = parseInt(timerDurationInput.value) * 60;

// 初始化倒计时显示
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

countdownDisplay.textContent = formatTime(selectedDurationInSeconds);

// 当用户更改定时时长输入时，更新显示和selectedDurationInSeconds
timerDurationInput.addEventListener('input', () => {
    if (!isTimerRunning) { // 只在计时器未运行时允许更改
        selectedDurationInSeconds = parseInt(timerDurationInput.value) * 60;
        if (isNaN(selectedDurationInSeconds) || selectedDurationInSeconds < 0) {
            selectedDurationInSeconds = 0;
        }
        countdownDisplay.textContent = formatTime(selectedDurationInSeconds);
    }
});

// 静音按钮事件
document.getElementById('volumeIcon').addEventListener('click', () => {
  isMuted = !isMuted;
  if (isMuted) {
    currentVolume = 0;
  } else {
    // 点击恢复时，音量设置为50
    currentVolume = 50;
  }
  document.getElementById('volumeSlider').value = currentVolume;
  document.getElementById('volumeValue').textContent = currentVolume;
  updateVolumeIcon();
});

// 更新音量图标函数
function updateVolumeIcon() {
  const icon = document.getElementById('volumeIcon');
  if(currentVolume === 0 || isMuted) {
    icon.textContent = '🔇';
  } else if(currentVolume < 50) {
    icon.textContent = '🔉';
  } else {
    icon.textContent = '🔊';
  }
}

// 自动随机点击函数
function performAutoClick() {
    // 注意：此函数现在只负责执行点击，不再检查 isTimerRunning 或 isTimerPaused
    // 这些检查应该在调用 performAutoClick 的地方（如 startTimer 和 resumeTimer）进行

    const settingsModalRect = settingsModal.getBoundingClientRect();
    const settingsBtnRect = document.getElementById('settingsBtn').getBoundingClientRect();

    let randomX, randomY;
    let attempts = 0;
    const maxAttempts = 200; 
    let targetElement = null;

    do {
        randomX = Math.random() * window.innerWidth;
        randomY = Math.random() * window.innerHeight;
        attempts++;

        if (attempts > maxAttempts) {
            console.warn("Max attempts reached for performAutoClick. Could not find a valid click position outside the settings area.");
            return; 
        }

        targetElement = document.elementFromPoint(randomX, randomY);

        if (!targetElement) { 
            continue; 
        }

        const isTargetInsideModalOrIsModalItself = settingsModal.classList.contains('show') && 
                                                 (settingsModal.contains(targetElement) || targetElement === settingsModal);
        const isTargetTheSettingsBtn = targetElement === settingsBtn || settingsBtn.contains(targetElement);

        if (isTargetInsideModalOrIsModalItself || isTargetTheSettingsBtn) {
            targetElement = null; 
            continue;
        }
        
        break; 

    } while (true); 

    if (!targetElement) {
        console.warn("performAutoClick could not secure a valid targetElement after loop.");
        return;
    }
    
    createSheep(randomX, randomY);
    playSound();
    updateCounter();
}

// 开始定时器函数
function startTimer() {
    if (isTimerRunning && !isTimerPaused) return; // 如果正在运行且未暂停，则不执行

    if (!isTimerPaused) { // 如果不是从暂停状态恢复，则重置剩余时间
        remainingTime = selectedDurationInSeconds;
        if (remainingTime <= 0) {
            alert("请设置一个有效的定时时长。");
            return;
        }
    }

    isTimerRunning = true;
    isTimerPaused = false;
    startTimerBtn.textContent = '停止';
    startTimerBtn.classList.add('timer-active'); // 添加激活状态样式
    timerDurationInput.disabled = true; // 计时开始后禁止修改时长

    countdownDisplay.textContent = formatTime(remainingTime);

    timerInterval = setInterval(() => {
        remainingTime--;
        countdownDisplay.textContent = formatTime(remainingTime);
        if (remainingTime <= 0) {
            stopTimer(true); // 倒计时结束，自动停止
        }
    }, 1000);

    // 每3秒自动点击一次
    if (autoClickInterval) clearInterval(autoClickInterval);
    
    // 无论是否暂停恢复，只要计时器启动/恢复，就应该开始自动点击
    performAutoClick(); // 立即执行一次
    autoClickInterval = setInterval(performAutoClick, 3000);
}



// 停止定时器函数
function stopTimer(isAutoStop = false) {
    clearInterval(timerInterval);
    clearInterval(autoClickInterval);
    timerInterval = null;
    autoClickInterval = null;
    isTimerRunning = false;
    isTimerPaused = false;
    startTimerBtn.textContent = '开始';
    startTimerBtn.classList.remove('timer-active'); // 移除激活状态样式
    timerDurationInput.disabled = false; // 允许修改时长
    // remainingTime = selectedDurationInSeconds; // 重置剩余时间为初始选定值
    // countdownDisplay.textContent = formatTime(remainingTime);
    if (!isAutoStop) { // 如果是手动停止，则重置为初始选定值
        remainingTime = selectedDurationInSeconds;
        countdownDisplay.textContent = formatTime(remainingTime);
    } else {
        // 如果是自动结束，则显示00:00
        countdownDisplay.textContent = formatTime(0);
    }
}

// 暂停定时器函数
function pauseTimer() {
    if (!isTimerRunning || isTimerPaused) return;
    clearInterval(timerInterval);
    clearInterval(autoClickInterval); // 暂停时也清除自动点击的interval
    autoClickInterval = null; // 重置autoClickInterval
    isTimerPaused = true;
    // 按钮文字保持“停止”，因为再次点击是停止而不是恢复
}

// 恢复定时器函数
function resumeTimer() {
    if (!isTimerRunning || !isTimerPaused) return;
    isTimerPaused = false; // 清除暂停状态
    // 重新启动计时器逻辑，但不重置 remainingTime
    timerInterval = setInterval(() => {
        remainingTime--;
        countdownDisplay.textContent = formatTime(remainingTime);
        if (remainingTime <= 0) {
            stopTimer(true); // 倒计时结束，自动停止
        }
    }, 1000);

    // 恢复自动点击
    if (autoClickInterval) clearInterval(autoClickInterval);
    performAutoClick(); // 立即执行一次
    autoClickInterval = setInterval(performAutoClick, 3000);
}

// 开始/停止按钮事件
startTimerBtn.addEventListener('click', () => {
    if (isTimerRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

// 修改设置按钮点击事件，以处理定时器暂停
document.getElementById('settingsBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  if (isTimerRunning && !isTimerPaused) {
      pauseTimer();
  }
  settingsModal.classList.add('show');
});

// 修改关闭模态窗口按钮事件和点击外部关闭逻辑，以处理定时器恢复
closeSettingsModalBtn.addEventListener('click', () => {
  settingsModal.classList.remove('show');
  if (isTimerRunning && isTimerPaused) {
      resumeTimer();
  }
});

settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove('show');
    if (isTimerRunning && isTimerPaused) {
        resumeTimer();
    }
  }
});


// 旧的菜单自动关闭逻辑和阻止冒泡逻辑可以移除了，因为新的模态窗口有自己的关闭机制
// document.addEventListener('click', function closeMenu(e) { ... });
// document.querySelector('.settings-menu').addEventListener('click', (e) => { ... });
