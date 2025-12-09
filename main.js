class BookScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BookScene' });

    this.currentPage = 0;
    this.pages = [];
    this.isTurningPage = false;   // 防一次跳兩頁

    // ✅ 每頁語音對應表（你可以依實際檔名修改）
    // key 用「實際頁碼」，1~15
    this.pageAudioMap = {
      2: 'assets/audio_page2.wav',
      3: 'assets/audio_page3.wav',
      4: 'assets/audio_page4.wav',
      5: 'assets/audio_page5.wav',
      6: 'assets/audio_page6.wav',
      7: 'assets/audio_page7.wav',
      8: 'assets/audio_page8.wav',
      9: 'assets/audio_page9.wav',
      10: 'assets/audio_page10.wav',
      11: 'assets/audio_page11.wav',
      12: 'assets/audio_page12.wav',
      13: 'assets/audio_page13.wav',
      14: 'assets/audio_page14.wav',
      15: 'assets/audio_page15.wav',
    };

    this.pageAudioEl = null;
  }

  preload() {
    // ✅ 載入 1~15 頁的圖片
    const totalPages = 15;
    for (let i = 1; i <= totalPages; i++) {
      this.load.image(`page${i}`, `assets/page${i}.png`);
    }
  }

  create() {
    // 取得 <audio> 元素
    this.pageAudioEl = document.getElementById('pageAudio');

    const totalPages = 15;

    // 建立每一頁的圖片物件
    for (let i = 1; i <= totalPages; i++) {
      const image = this.add.image(540, 960, `page${i}`);
      image.setVisible(false);
      this.pages.push(image);
    }

    // 上一頁按鈕
    this.prevBtn = this.add.text(540, 50, '△', {
      fontSize: '48px',
      color: '#ffffff',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(999);
    this.prevBtn.on('pointerup', () => this.safeTurnPage(-1));

    // 下一頁按鈕
    this.nextBtn = this.add.text(540, 1870, '▽', {
      fontSize: '48px',
      color: '#ffffff',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(999);
    this.nextBtn.on('pointerup', () => this.safeTurnPage(1));

    // 顯示第一頁
    this.showPage(this.currentPage);
  }

  // ✅ 帶冷卻時間的翻頁，避免一次跳兩頁
  safeTurnPage(direction) {
    if (this.isTurningPage) return;
    this.isTurningPage = true;

    if (direction > 0) {
      this.nextPage();
    } else {
      this.prevPage();
    }

    // 0.25 秒內不接受下一次點擊
    this.time.delayedCall(250, () => {
      this.isTurningPage = false;
    });
  }

  showPage(index) {
    // 顯示正確的頁面
    this.pages.forEach((p, i) => {
      p.setVisible(i === index);
    });

    // 控制按鈕顯示
    this.prevBtn.setVisible(index > 0);
    this.nextBtn.setVisible(index < this.pages.length - 1);

    // 處理語音
    this.handleAudio(index);
  }

  nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
      this.showPage(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.showPage(this.currentPage);
    }
  }

  // ✅ 每頁語音處理
  handleAudio(index) {
    if (!this.pageAudioEl) return;

    // 停掉前一頁的語音
    this.pageAudioEl.pause();
    this.pageAudioEl.currentTime = 0;

    const pageNumber = index + 1;
    const src = this.pageAudioMap[pageNumber];

    // 沒設定語音的頁面就不播
    if (!src) return;

    // 只有在檔名不同時才換 src
    if (this.pageAudioEl.getAttribute('src') !== src) {
      this.pageAudioEl.setAttribute('src', src);
      this.pageAudioEl.load();
    }

    const p = this.pageAudioEl.play();
    if (p && p.catch) {
      p.catch(err => {
        // 若要 debug，可在這裡顯示錯誤
        console.log('Audio play blocked:', err);
      });
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 1920,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BookScene],
};

const game = new Phaser.Game(config);
