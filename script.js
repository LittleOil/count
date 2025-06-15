let count = 0;
let lastSoundIndex = -1; // 新增上次播放索引
const counterElement = document.getElementById('count');

// 移除固定音频元素

// 新增声音文件数组
const soundFiles = Array.from({length: 10}, (_, i) => `audio/sheep${i+1}.mp3`);

// 主点击处理
document.addEventListener('click', (e) => {
    // 检查点击是否发生在设置容器内部
    if (!e.target.closest('.settings-container')) {
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
}

// 新增音量相关变量
let currentVolume = 50;
let isMuted = false;

// 页面加载时初始化音量图标
document.addEventListener('DOMContentLoaded', () => {
  updateVolumeIcon();
});

// 初始化设置菜单
document.getElementById('settingsBtn').addEventListener('click', (e) => {
  e.stopPropagation(); // 阻止事件冒泡
  const menu = document.querySelector('.settings-menu');
  menu.classList.toggle('show');
  
  // 确保菜单显示时不会被其他事件关闭
  if(menu.classList.contains('show')) {
    e.stopImmediatePropagation();
  }
});

// 音量滑动条事件
document.getElementById('volumeSlider').addEventListener('input', (e) => {
  currentVolume = parseInt(e.target.value);
  document.getElementById('volumeValue').textContent = currentVolume;
  updateVolumeIcon();
});

// 静音按钮事件
document.getElementById('volumeIcon').addEventListener('click', () => {
  isMuted = !isMuted;
  if(isMuted) {
    currentVolume = 0;
  } else {
    currentVolume = document.getElementById('volumeSlider').value;
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

// 菜单自动关闭逻辑
document.addEventListener('click', function closeMenu(e) {
  const settingsContainer = document.querySelector('.settings-container');
  const settingsMenu = document.querySelector('.settings-menu');
  if (!settingsContainer.contains(e.target) && settingsMenu.classList.contains('show')) {
    settingsMenu.classList.remove('show');
  }
});

// 阻止设置菜单内的点击事件冒泡到document，防止菜单立即关闭
document.querySelector('.settings-menu').addEventListener('click', (e) => {
  e.stopPropagation();
});
