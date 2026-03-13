<template>
  <div class="video-container">
    <div class="video-box">
      <div class="video-label">{{ label }}</div>

      <!-- 未配置提示 -->
      <div class="video-placeholder" v-if="!videoUrl">
        <div class="placeholder-content">
          <i class="fas fa-video-slash"></i>
          <div>监控未配置</div>
        </div>
      </div>

      <!-- 视频播放器 -->
      <video
        v-else
        ref="videoPlayer"
        class="video-js vjs-default-skin"
        controls
        preload="auto"
        data-setup='{}'
      >
        <source :src="videoUrl" type="application/x-mpegURL" />
      </video>

      <!-- 状态指示器 -->
      <div class="video-status">
        <span class="status-dot" :class="statusClass"></span>
        {{ statusText }}
      </div>

      <!-- 加载中提示 -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <div>正在加载...</div>
      </div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default {
  name: 'VideoPlayerHLS',
  props: {
    videoUrl: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '监控'
    },
    status: {
      type: String,
      default: '离线'
    }
  },
  data() {
    return {
      player: null,
      loading: true
    };
  },
  computed: {
    statusClass() {
      if (this.loading) return 'status-warning';
      if (this.status === '在线') return 'status-online';
      if (this.status === '警告') return 'status-warning';
      return 'status-offline';
    },
    statusText() {
      if (this.loading) return '加载中...';
      return this.status || '离线';
    }
  },
  watch: {
    videoUrl: {
      immediate: true,
      handler(newUrl) {
        if (newUrl && this.player) {
          this.player.src({ src: newUrl, type: 'application/x-mpegURL' });
          this.player.load();
          this.player.play();
        } else if (!newUrl) {
          this.loading = false;
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.videoUrl) {
        this.initPlayer();
      } else {
        this.loading = false;
      }
    });
  },
  methods: {
    initPlayer() {
      try {
        this.player = videojs(this.$refs.videoPlayer, {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: true,
          preload: 'auto',
          techOrder: ['html5'],
          sources: [{
            src: this.videoUrl,
            type: 'application/x-mpegURL'
          }],
          // 自定义控制条
          controlBar: {
            children: [
              'playToggle',
              'volumePanel',
              'currentTimeDisplay',
              'timeDivider',
              'durationDisplay',
              'progressControl',
              'remainingTimeDisplay',
              'muteToggle',
              'fullscreenToggle'
            ]
          }
        });

        // 播放器事件
        this.player.on('error', (error) => {
          console.error('视频播放错误:', error);
          this.loading = false;
          this.$emit('error', error);
        });

        this.player.on('loadeddata', () => {
          console.log('视频加载成功');
          this.loading = false;
        });

        this.player.on('playing', () => {
          console.log('视频开始播放');
          this.loading = false;
        });

        this.player.on('waiting', () => {
          this.loading = true;
        });

      } catch (error) {
        console.error('初始化播放器失败:', error);
        this.loading = false;
      }
    },

    // 暂停播放
    pause() {
      if (this.player) {
        this.player.pause();
      }
    },

    // 恢复播放
    resume() {
      if (this.player) {
        this.player.play();
      }
    },

    // 停止播放
    stop() {
      if (this.player) {
        this.player.pause();
        this.player.currentTime(0);
      }
    },

    // 重新加载视频
    reload() {
      if (this.player && this.videoUrl) {
        this.player.src({ src: this.videoUrl, type: 'application/x-mpegURL' });
        this.player.load();
        this.player.play();
      }
    }
  },
  beforeUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

<style scoped>
.video-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-box {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(64, 158, 255, 0.2);
}

.video-label {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #00f2fe;
  z-index: 10;
}

.video-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #00ff9d;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 10;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-online {
  background: #00ff9d;
}

.status-warning {
  background: #ffcc00;
}

.status-offline {
  background: #ff4d4d;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a2a40 0%, #0c1e3a 100%);
  color: #8ec5fc;
  font-size: 0.9rem;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.placeholder-content i {
  font-size: 1.5rem;
  opacity: 0.6;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  color: #8ec5fc;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 242, 254, 0.3);
  border-top: 3px solid #00f2fe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 视频播放器自定义样式 */
::v-deep .video-js {
  width: 100%;
  height: 100%;
}

::v-deep .video-js .vjs-big-play-button {
  background-color: rgba(0, 242, 254, 0.3);
  border: 2px solid #00f2fe;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  line-height: 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -30px;
  margin-left: -30px;
}

::v-deep .video-js:hover .vjs-big-play-button {
  background-color: rgba(0, 242, 254, 0.5);
}

::v-deep .video-js .vjs-control-bar {
  background: rgba(0, 0, 0, 0.5);
}

::v-deep .video-js .vjs-volume-panel {
  order: -1;
}

::v-deep .video-js .vjs-play-progress {
  background-color: #00f2fe;
}

::v-deep .video-js .vjs-load-progress div {
  background-color: rgba(0, 242, 254, 0.3);
}

::v-deep .video-js .vjs-play-control.vjs-control:before {
  color: #00f2fe;
}

::v-deep .video-js .vjs-fullscreen-control.vjs-control:before {
  color: #00f2fe;
}

::v-deep .video-js .vjs-mute-control.vjs-control:before {
  color: #00f2fe;
}
</style>
