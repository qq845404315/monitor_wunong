<template>
  <div class="video-container">
    <div class="video-box">
      <div class="video-label">{{ label }}</div>

      <!-- Token获取中 -->
      <div v-if="loadingToken" class="loading-overlay">
        <div class="spinner"></div>
        <div>正在获取Token...</div>
      </div>

      <!-- 播放器容器 -->
      <div
        :id="'ezuipt-' + deviceId"
        class="ezuipt-player"
        :class="{ 'loading': loadingPlayer }"
      ></div>

      <!-- 状态指示器 -->
      <div class="video-status">
        <span class="status-dot" :class="statusClass"></span>
        {{ statusText }}
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ errorMessage }}
      </div>

      <!-- 播放器控制栏（自定义） -->
      <div v-if="player && !loadingToken" class="player-controls">
        <button @click="togglePlay" class="control-btn" :title="isPlaying ? '暂停' : '播放'">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <button @click="toggleMute" class="control-btn" :title="isMuted ? '取消静音' : '静音'">
          <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
        </button>
        <button @click="requestFullscreen" class="control-btn" title="全屏">
          <i class="fas fa-expand"></i>
        </button>
        <button @click="reconnect" class="control-btn" title="重新连接">
          <i class="fas fa-sync"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ysApi from '@/utils/ysApi';
import EZUIKit from "ezuikit-js";

export default {
  name: 'VideoPlayerEZUI',
  props: {
    // 直接使用EZOPEN地址
    ezopenUrl: {
      type: String,
      default: ''
    },
    // 或者使用设备序列号自动获取
    deviceSerial: {
      type: String,
      default: ''
    },
    // 通道号
    channelNo: {
      type: Number,
      default: 1
    },
    // 萤石云应用配置
    appKey: {
      type: String,
      default: ''
    },
    appSecret: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '监控'
    },
    deviceId: {
      type: [Number, String],
      required: true
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      player: null,
      loadingToken: false,
      loadingPlayer: false,
      errorMessage: '',
      isPlaying: true,
      isMuted: false,
      currentEzopenUrl: '',
      tokenInfo: null
    };
  },
  computed: {
    statusClass() {
      if (this.loadingToken || this.loadingPlayer) return 'status-warning';
      if (this.errorMessage) return 'status-offline';
      if (this.isPlaying) return 'status-online';
      return 'status-offline';
    },
    statusText() {
      if (this.loadingToken) return '获取Token中...';
      if (this.loadingPlayer) return '连接中...';
      if (this.errorMessage) return '连接失败';
      if (this.isPlaying) return '播放中';
      return '已停止';
    }
  },
  watch: {
    ezopenUrl(newUrl) {
      if (newUrl && this.player) {
        this.reconnect();
      }
    },
    deviceSerial(newSerial) {
      if (newSerial && this.appKey && this.appSecret) {
        this.reconnect();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init() {
      try {
        

        // 1. 获取EZOPEN地址
        if (this.ezopenUrl) {
          this.currentEzopenUrl = this.ezopenUrl;
          this.initPlayer();
        } else if (this.deviceSerial && this.appKey && this.appSecret) {
          await this.getEzopenUrlAndInit();
        } else {
          this.errorMessage = '缺少必要的参数：ezopenUrl 或 deviceSerial + appKey + appSecret';
        }
      } catch (error) {
        console.error('初始化失败:', error);
        this.errorMessage = error.message || '初始化失败';
      }
    },

    async getEzopenUrlAndInit() {
      this.loadingToken = true;
      this.errorMessage = '';

      try {
        // 获取EZOPEN地址（内部会先获取Token）
        const ezopenUrl = await ysApi.getEzopenUrlWithCredentials(
          this.appKey,
          this.appSecret,
          this.deviceSerial,
          this.channelNo
        );

        this.currentEzopenUrl = ezopenUrl;
        this.loadingToken = false;

        // 获取Token信息用于显示
        this.tokenInfo = ysApi.getCurrentTokenInfo();

        this.$emit('tokenReady', this.tokenInfo);
        this.initPlayer();

      } catch (error) {
        this.loadingToken = false;
        this.errorMessage = `获取Token失败: ${error.message}`;
        this.$emit('error', error);
      }
    },

    initPlayer() {
      this.loadingPlayer = true;
      this.errorMessage = '';

      const containerId = `ezuipt-${this.deviceId}`;
      const container = document.getElementById(containerId);

      if (!container) {
        this.errorMessage = `找不到播放器容器: ${containerId}`;
        this.loadingPlayer = false;
        return;
      }
      // 检查SDK是否加载
    if (typeof EZUIKit.EZUIKitPlayer === 'undefined') {
        this.errorMessage = 'EZUIPlayer SDK未加载，请刷新页面';
        return;
    }
      try {
        // 创建播放器实例
        this.player = new EZUIKit.EZUIKitPlayer({
          id: containerId,
          url: this.currentEzopenUrl,
          autoplay: this.autoPlay,
          controls: false, // 使用自定义控制
          width: '100%',
          height: '100%',
          // 视频加密处理
          accessToken: this.tokenInfo ? this.tokenInfo.accessToken : '',
        });

        // 绑定播放器事件
        this.bindPlayerEvents();

        // 延迟设置加载完成
        setTimeout(() => {
          this.loadingPlayer = false;
        }, 3000);

      } catch (error) {
        console.error('初始化播放器失败:', error);
        this.errorMessage = `播放器初始化失败: ${error.message}`;
        this.loadingPlayer = false;
        this.$emit('error', error);
      }
    },

    bindPlayerEvents() {
      if (!this.player) return;

      // 播放成功
      this.player.on('play', () => {
        console.log('视频开始播放');
        this.isPlaying = true;
        this.errorMessage = '';
        this.$emit('playing');
      });

      // 播放失败
      this.player.on('error', (error) => {
        console.error('播放器错误:', error);
        this.isPlaying = false;
        this.errorMessage = error.message || '播放失败';
        this.$emit('error', error);
      });

      // 暂停
      this.player.on('pause', () => {
        this.isPlaying = false;
        this.$emit('paused');
      });

      // 视频加载中
      this.player.on('waiting', () => {
        this.loadingPlayer = true;
      });

      // 视频加载完成
      this.player.on('loadeddata', () => {
        this.loadingPlayer = false;
      });

      // 视频结束
      this.player.on('ended', () => {
        this.isPlaying = false;
        this.$emit('ended');
      });
    },

    togglePlay() {
      if (!this.player) return;

      if (this.isPlaying) {
        this.player.pause();
      } else {
        this.player.play();
      }
    },

    toggleMute() {
      if (!this.player) return;

      if (this.isMuted) {
        this.player.unmute();
      } else {
        this.player.mute();
      }
      this.isMuted = !this.isMuted;
    },

    requestFullscreen() {
      const container = document.getElementById(`ezuipt-${this.deviceId}`);
      if (container && container.requestFullscreen) {
        container.requestFullscreen();
      }
    },

    async reconnect() {
      if (this.player) {
        this.player.stop();
        this.player.destroy();
        this.player = null;
      }

      this.isPlaying = false;
      this.isMuted = false;
      this.errorMessage = '';

      // 重新初始化
      await this.init();
    },

    // 重新获取Token并刷新播放
    async refreshTokenAndReconnect() {
      if (!this.appKey || !this.appSecret) {
        this.errorMessage = '缺少appKey或appSecret';
        return;
      }

      try {
        // 清理现有token
        ysApi.clearToken();

        // 重新获取
        await this.getEzopenUrlAndInit();

        this.$emit('tokenRefreshed');
      } catch (error) {
        this.errorMessage = `Token刷新失败: ${error.message}`;
        this.$emit('error', error);
      }
    }
  },
  beforeUnmount() {
    if (this.player) {
      this.player.stop();
      this.player.destroy();
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

.ezuipt-player {
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
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

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 77, 77, 0.9);
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 0.85rem;
  text-align: center;
  max-width: 80%;
  z-index: 15;
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-controls {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  gap: 10px;
  z-index: 15;
}

.control-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(0, 242, 254, 0.3);
  color: #00f2fe;
}
</style>
