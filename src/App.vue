<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <h1>吴侬碧螺春茶园溯源大屏</h1>
      <div class="time">{{ currentTime }}</div>
    </div>

    <!-- 左侧信息面板 -->
    <div class="info-panel">
      <div class="tea-info">
        <div class="panel-title">茶园信息</div>
        <div class="info-item">
          <div class="label">茶园名称</div>
          <div class="value">{{ chayuanInfo.name }}</div>
        </div>
        <div class="info-item">
          <div class="label">地理位置</div>
          <div class="value">{{ chayuanInfo.location }}</div>
        </div>
        <div class="info-item">
          <div class="label">茶园面积</div>
          <div class="value">{{ chayuanInfo.area }}亩</div>
        </div>
        <div class="info-item">
          <div class="label">茶树品种</div>
          <div class="value">{{ chayuanInfo.teabrand }}</div>
        </div>
        <div class="info-item">
          <div class="label">种植标准</div>
          <div class="value">{{ chayuanInfo.plantingStandard }}</div>
        </div>
      </div>

      <div class="traceability">
        <div class="panel-title">溯源信息</div>
        <h3>{{ chayuanInfo.teabrand }}春茶生产溯源</h3>
        <div class="trace-item">
          <div>采摘时间</div>
          <div>{{ chayuanInfo.pickingTime }}</div>
        </div>
        <div class="trace-item">
          <div>加工企业</div>
          <div>{{ chayuanInfo.processingCompany }}</div>
        </div>
        <div class="trace-item">
          <div>质检报告</div>
          <div class="trace-status">{{ chayuanInfo.qualityReport }}</div>
        </div>
        <div class="trace-item">
          <div>区块链存证</div>
          <div class="trace-status">{{ chayuanInfo.blockchainStatus }}</div>
        </div>
      </div>

      <!-- <div class="device-section">
        <div class="panel-title">萤石云配置</div>
        <div class="config-inputs">
          <div class="input-group">
            <label>AppKey:</label>
            <input 
              v-model="ysConfig.appKey" 
              type="text" 
              placeholder="请输入AppKey"
              class="config-input"
            />
          </div>
          <div class="input-group">
            <label>AppSecret:</label>
            <input 
              v-model="ysConfig.appSecret" 
              type="password" 
              placeholder="请输入AppSecret"
              class="config-input"
            />
          </div>
          <div class="input-group">
            <label>设备1序列号:</label>
            <input 
              v-model="ysConfig.deviceSerial1" 
              type="text" 
              placeholder="设备序列号1"
              class="config-input"
            />
          </div>
          <div class="input-group">
            <label>设备2序列号:</label>
            <input 
              v-model="ysConfig.deviceSerial2" 
              type="text" 
              placeholder="设备序列号2"
              class="config-input"
            />
          </div>
          <div class="config-buttons">
            <button @click="saveConfig" class="save-btn">保存配置</button>
            <button @click="clearConfig" class="clear-btn">清除配置</button>
          </div>
        </div>
        
        <div class="token-status" v-if="tokenInfo">
          <div class="panel-title">Token状态</div>
          <div class="token-info">
            <div><strong>Token:</strong> {{ tokenInfo.accessToken ? tokenInfo.accessToken.substring(0, 20) + '...' : '未获取' }}</div>
            <div><strong>过期时间:</strong> {{ tokenInfo.expireTime }}</div>
            <div><strong>状态:</strong> <span :class="tokenValid ? 'token-valid' : 'token-invalid'">{{ tokenValid ? '有效' : '已过期' }}</span></div>
          </div>
          <button @click="refreshToken" class="refresh-btn">刷新Token</button>
        </div>
      </div> -->

      <div class="device-section">
        <div class="panel-title">设备状态</div>
        <div class="device-grid">
          <div v-for="device in devices" :key="device.id" class="device-card"
            :class="{ selected: selectedDevice === device.id }" @click="selectDevice(device)">
            <div class="device-icon">
              <i :class="device.icon"></i>
            </div>
            <div class="device-name">{{ device.name }}</div>
            <div class="device-value">{{ device.value }}{{ device.unit }}</div>
            <div class="device-status">
              <div class="status-indicator" :class="{
                'status-online': device.status === 'online',
                'status-offline': device.status === 'offline',
                'status-warning': device.status === 'warning'
              }"></div>
              <span>{{ device.statusText }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="device-section">
        <div class="panel-title">环境监测</div>
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-value">{{ environment.temp }}℃</div>
            <div class="stat-label">平均气温</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ environment.humidity }}%</div>
            <div class="stat-label">空气湿度</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ environment.ions }}mg/m³</div>
            <div class="stat-label">负氧离子</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ environment.airQuality }}</div>
            <div class="stat-label">空气质量</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ environment.co2 }}ppm</div>
            <div class="stat-label">CO2浓度</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ environment.wind }}级</div>
            <div class="stat-label">风力</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ environment.windSpeed }}m/s</div>
            <div class="stat-label">风速</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间地图区域 -->
    <div class="map-container">
      <div id="baidu-map"></div>
      <div class="map-overlay">
        <div class="map-overlay-title">茶园位置与设备分布</div>
        <div>核心种植区：{{ chayuanInfo.area }}亩</div>
        <div>监控点位：{{ videoStats.count }}个</div>
        <div>传感器节点：{{ videoStats.sensorCount }}个</div>
        <div>设备在线率：{{ onlineRate }}%</div>
        <div class="map-device-info" v-if="selectedDevice">
          <strong>当前选中：</strong>{{ getDeviceName(selectedDevice) }}
        </div>
      </div>
    </div>

    <!-- 右侧视频面板 - 萤石云监控接入 -->
    <div class="video-panel">
      <div class="panel-title">实时监控</div>

      <!-- 监控视频区域 -->
      <div class="monitor-grid">
        <!-- 监控1: 使用EZUIPlayer（自动获取Token） -->
        <div class="monitor-box">
          <VideoPlayerEZUI :appKey="ysConfig.appKey" :appSecret="ysConfig.appSecret"
            :deviceSerial="ysConfig.deviceSerial1" :deviceId="1" :label="ysConfig.label1 || '核心种植区1'"
            @tokenReady="onTokenReady" @error="handleMonitorError(1)" ref="monitor1" />
        </div>

        <!-- 监控2: 使用EZUIPlayer（自动获取Token） -->
        <div class="monitor-box">
          <VideoPlayerEZUI :appKey="ysConfig.appKey" :appSecret="ysConfig.appSecret"
            :deviceSerial="ysConfig.deviceSerial2" :deviceId="2" :label="ysConfig.label2 || '核心种植区2'"
            @tokenReady="onTokenReady" @error="handleMonitorError(2)" ref="monitor2" />
        </div>
      </div>

      <div class="monitor-controls">
        <button v-for="btn in monitorControls" :key="btn.id" class="monitor-btn"
          :class="{ active: activeControl === btn.id }" @click="setActiveControl(btn.id)">
          {{ btn.label }}
        </button>
      </div>

      <div class="panel-title">监控区域</div>
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-value">{{ videoStats.count }}</div>
          <div class="stat-label">监控点位</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ videoStats.duration }}</div>
          <div class="stat-label">实时监控</div>
        </div>
      </div>

      <!-- 配置提示 -->
      <div class="config-tip" v-if="!ysConfig.appKey || !ysConfig.appSecret">
        <i class="fas fa-info-circle"></i>
        <div>请在左侧配置萤石云AppKey和AppSecret</div>
      </div>
    </div>
    <!-- 设备详情弹窗 -->
    <div v-if="showDeviceDetail" class="modal-overlay" @click="closeDeviceDetail"></div>
    <div v-if="showDeviceDetail" class="device-detail-modal">
      <div class="modal-header">
        <div class="modal-title">{{ selectedDeviceDetail.name }}详情</div>
        <button class="close-btn" @click="closeDeviceDetail">×</button>
      </div>
      <div class="device-detail-content">
        <div class="detail-item">
          <span class="detail-label">设备状态</span>
          <span class="detail-value">{{ selectedDeviceDetail.statusText }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">当前位置</span>
          <span class="detail-value">{{ selectedDeviceDetail.location }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">安装时间</span>
          <span class="detail-value">{{ selectedDeviceDetail.installTime }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">最后维护</span>
          <span class="detail-value">{{ selectedDeviceDetail.lastMaintenance }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">当前读数</span>
          <span class="detail-value">{{ selectedDeviceDetail.value }}{{ selectedDeviceDetail.unit }}</span>
        </div>
        <div class="detail-chart" id="deviceChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import VideoPlayerEZUI from './components/VideoPlayerEZUI.vue';
import { getDeviceList, getRealTimeData } from '@/api/device/index.js'
import * as echarts from 'echarts';
import { getMetData, setMetData } from './utils/auth.js'

import ysApi from './utils/ysApi';

// 引入百度地图JS（确保在index.html中已引入百度地图API）
let map = null;


// 时间相关
const currentTime = ref('');
const currentDate = ref('')
// 设备数据
const devices = ref([
  { id: 1, name: '气象站', icon: 'fas fa-cloud-sun', value: 24.5, unit: '℃', status: 'online', statusText: '在线', location: '核心区A', installTime: '2024-11-15', lastMaintenance: currentDate.value, list:[] },
  { id: 2, name: '虫情分析仪', icon: 'fas fa-bug', value: 3, unit: '只/天', status: 'online', statusText: '在线', location: '核心区B', installTime: '2024-11-15', lastMaintenance: currentDate.value, list:[] },
  { id: 3, name: '孢子分析仪', icon: 'fas fa-virus', value: 12, unit: '个/m³', status: 'online', statusText: '在线', location: '核心区C', installTime: '2024-11-15', lastMaintenance: currentDate.value, list:[] },
  { id: 4, name: '土壤墒情', icon: 'fas fa-tint', value: 68, unit: '%', status: 'online', statusText: '在线', location: '灌溉区', installTime: '2024-11-15', lastMaintenance: currentDate.value, list:[] },
  { id: 5, name: '光照传感器', icon: 'fas fa-sun', value: 42000, unit: 'lux', status: 'online', statusText: '在线', location: '育苗区', installTime: '2024-11-15', lastMaintenance: currentDate.value, list:[] },
  { id: 6, name: '摄像头', icon: 'fas fa-video', value: 4, unit: '路', status: 'online', statusText: '在线', location: '茶园各区域', installTime: '2024-11-15', lastMaintenance: currentDate.value, list:[] }
]);
const chayuanInfo = ref({
  name: '吴侬碧螺春有机茶园',
  location: '江苏省苏州市吴中区东山镇',
  area: 350,
  plantingDate: '2022-01-01',
  status: '正常',
  teabrand: '小叶种碧螺春',
  pickingTime: '2026-03-20 至 2026-04-10',
  processingCompany: '苏州市吴侬茶业有限公司',
  qualityReport: '已验证 ✓',
  blockchainStatus: '已上链 ✓',
  plantingStandard: '有机认证'
});
// 环境数据
const environment = ref({
  temp: 24.5,
  humidity: 78,
  ions: 186,
  airQuality: '优',
  co2: 500,
  windSpeed: 2.5,
  wind: 2,
});

// 萤石云配置
const ysConfig = ref({
  appKey: '56294eb349be42ea9b34a0acb3b28f0a',
  appSecret: '151ffbf8944dad466f65afc26c0cda8e',
  deviceSerial1: 'BA9038688',
  deviceSerial2: 'BA9038662',
  label1: '核心种植区1',
  label2: '核心种植区2'
});

// Token信息
const tokenInfo = ref(null);
const tokenValid = ref(false);

// 视频控制按钮
const monitorControls = ref([
  { id: 'all', label: '全部播放' },
  { id: 'pause', label: '全部暂停' },
  { id: 'stop', label: '停止播放' },
  { id: 'reconnect', label: '重新连接' },
  { id: 'refreshToken', label: '刷新Token' }
]);
const activeControl = ref('all');

// 视频统计
const videoStats = ref({
  count: 4,
  duration: '24h',
  sensorCount: 85
});

// 选中的设备
const selectedDevice = ref(null);
const showDeviceDetail = ref(false);
const selectedDeviceDetail = ref(null);

// 监控组件引用
const monitor1 = ref(null);
const monitor2 = ref(null);

// 计算属性
const onlineRate = computed(() => {
  const onlineCount = devices.value.filter(d => d.status === 'online').length;
  return ((onlineCount / devices.value.length) * 100).toFixed(1);
});
let metData = getMetData()

// 方法
const updateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentDate.value = `${year}-${month}-${day}`
  devices.value.forEach(device => {
    device.lastMaintenance = currentDate.value
  })
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// 通用的平均值计算函数
const calculateAverageOfField = (array, fieldName) => {
  if (array.length === 0) return 0;
  const numericValues = array
    .map(item => parseFloat(item[fieldName]))
    .filter(value => !isNaN(value)); // 过滤掉非数值
  
  if (numericValues.length === 0) return 0;
  
  const sum = numericValues.reduce((total, value) => total + value, 0);
  return sum / numericValues.length;
}
const updateDeviceData = () => {
  getRealTimeData().then(res => {
      let data = res.data
      let tempArray = []
      let liumingArray = []
      let ionsArray = []
      let tintArray = []
      let co2Array = []
      let windArray = []
      data.forEach(item => {
        let nodeData = item.data
        if (item.deviceType === 'met') {
          tempArray.push(nodeData.find(node => node.nodeName === "空气温湿度"));
          liumingArray.push(nodeData.find(node => node.nodeName === "光照"));
          ionsArray.push(nodeData.find(node => node.nodeName === "负氧离子"));
          tintArray.push(nodeData.find(node => node.nodeName === "土壤温湿度"));
          co2Array.push(nodeData.find(node => node.nodeName === "CO2"));
          windArray.push(nodeData.find(node => node.nodeName === "风力风速"));
        }
      })
      // 计算平均值
      let tempValue = parseFloat(calculateAverageOfField(tempArray, 'temValue').toFixed(1));  //空气温度
      let humValue = parseFloat(calculateAverageOfField(tempArray, 'humValue').toFixed(1)); //相对湿度
      let liumingValue = parseFloat(calculateAverageOfField(liumingArray, 'temValue').toFixed(0));  //光照强度
      let ionsValue = parseFloat(calculateAverageOfField(ionsArray, 'temValue').toFixed(0));  //负氧离子浓度
      let tintValue = parseFloat(calculateAverageOfField(tintArray, 'humValue').toFixed(0));  //土壤湿度
      let co2Value = parseFloat(calculateAverageOfField(co2Array, 'humValue').toFixed(0));  //CO2浓度
      let windValue = parseFloat(calculateAverageOfField(windArray, 'temValue').toFixed(1));  //风力
      let windSpeedValue = parseFloat(calculateAverageOfField(windArray, 'humValue').toFixed(1));  //风速
      metData.push({
          tempValue,
          humValue,
          liumingValue,
          ionsValue,
          tintValue,
          co2Value,
          windValue,
          windSpeedValue,
          currentTime: currentTime.value
      })
      setMetData(JSON.stringify(metData))
      devices.value.forEach(device => {
        if (device.id === 1) { // 气象站
          device.value = (tempValue + (Math.random() - 0.5) * 0.5).toFixed(1);
          environment.value.temp = parseFloat(device.value);
        } else if (device.id === 2) { // 虫情分析仪
          device.value = Math.max(0, Math.round(3 + (Math.random() - 0.5) * 2));
        } else if (device.id === 3) { // 孢子分析仪
          device.value = Math.max(5, Math.round(12 + (Math.random() - 0.5) * 10));
        } else if (device.id === 4) { // 土壤墒情
          device.value = Math.round(tintValue + (Math.random() - 0.5) * 5);
        } else if (device.id === 5) { // 光照传感器
          device.value = Math.round(liumingValue + (Math.random() - 0.5) * 5000);
        }
      });
      // 更新环境数据
      environment.value.humidity = humValue;
      environment.value.co2 = co2Value;
      environment.value.wind = windValue;
      environment.value.windSpeed = windSpeedValue;
      environment.value.ions = Math.round(ionsValue + (Math.random() + 0.5) * 10);
      const airQualities = ['优', '良', '轻度污染', '中度污染'];
      environment.value.airQuality = airQualities[Math.floor(Math.random() * 2)]; // 优或良
    })
};

const selectDevice = (device) => {
  selectedDevice.value = device.id;
  selectedDeviceDetail.value = { ...device };
  showDeviceDetail.value = true;
  // 在地图上定位到该设备
  if (map && device.location) {
    // 这里可以根据设备位置在地图上移动
    // 由于是示例，我们只更新地图覆盖层信息
  }
};

const getDeviceName = (deviceId) => {
  const device = devices.value.find(d => d.id === deviceId);
  return device ? device.name : '';
};

const closeDeviceDetail = () => {
  showDeviceDetail.value = false;
  selectedDevice.value = null;
};

const setActiveControl = (controlId) => {
  activeControl.value = controlId;

  // 根据控制按钮执行相应操作
  switch (controlId) {
    case 'all':
      // 全部播放
      if (monitor1.value) monitor1.value.toggleToPlay();
      if (monitor2.value) monitor2.value.toggleToPlay();
      break;
    case 'pause':
      // 全部暂停
      if (monitor1.value) monitor1.value.togglePlay();
      if (monitor2.value) monitor2.value.togglePlay();
      break;
    case 'stop':
      // 停止播放
      if (monitor1.value) monitor1.value.reconnect();
      if (monitor2.value) monitor2.value.reconnect();
      break;
    case 'reconnect':
      // 重新连接
      if (monitor1.value) monitor1.value.reconnect();
      if (monitor2.value) monitor2.value.reconnect();
      break;
    case 'refreshToken':
      // 刷新Token
      refreshToken();
      break;
  }
};

const handleMonitorError = (monitorId) => {
  console.error(`监控${monitorId}连接失败`);
};

// 保存配置
const saveConfig = () => {
  try {
    localStorage.setItem('ysConfig', JSON.stringify(ysConfig.value));
    alert('配置已保存！');
    // 重新加载监控
    if (monitor1.value) monitor1.value.reconnect();
    if (monitor2.value) monitor2.value.reconnect();
  } catch (error) {
    console.error('保存配置失败:', error);
    alert('保存配置失败！');
  }
};

// 清除配置
const clearConfig = () => {
  try {
    localStorage.removeItem('ysConfig');
    ysConfig.value = {
      appKey: '',
      appSecret: '',
      deviceSerial1: '',
      deviceSerial2: '',
      label1: '核心种植区1',
      label2: '核心种植区2'
    };
    tokenInfo.value = null;
    tokenValid.value = false;
    ysApi.clearToken();
    alert('配置已清除！');
  } catch (error) {
    console.error('清除配置失败:', error);
  }
};

// 刷新Token
const refreshToken = async () => {
  if (!ysConfig.value.appKey || !ysConfig.value.appSecret) {
    alert('请先配置AppKey和AppSecret');
    return;
  }

  try {
    // 如果已经有token，刷新它；否则重新获取
    const currentToken = ysApi.getCurrentTokenInfo();
    if (currentToken && currentToken.accessToken) {
      await ysApi.refreshAccessToken();
    } else {
      await ysApi.getAccessToken(ysConfig.value.appKey, ysConfig.value.appSecret);
    }

    // 更新token状态
    updateTokenStatus();

    // 重新连接监控
    if (monitor1.value) monitor1.value.reconnect();
    if (monitor2.value) monitor2.value.reconnect();

    alert('Token刷新成功！');
  } catch (error) {
    console.error('刷新Token失败:', error);
    alert(`刷新Token失败: ${error.message}`);
  }
};

// 更新Token状态
const updateTokenStatus = () => {
  tokenInfo.value = ysApi.getCurrentTokenInfo();
  tokenValid.value = ysApi.isTokenValid();
};

// Token准备就绪回调
const onTokenReady = (token) => {
  tokenInfo.value = token;
  tokenValid.value = ysApi.isTokenValid();
};

// 地图初始化
const initMap = () => {
  // 创建地图实例
  map = new BMap.Map("baidu-map");

  // 设置中心点坐标（苏州东山镇）
  const centerPoint = new BMap.Point(120.389, 31.085);

  // 初始化地图，设置缩放级别
  map.centerAndZoom(centerPoint, 15);

  // 启用滚轮缩放
  map.enableScrollWheelZoom();

  // 添加茶园标记
  const marker = new BMap.Marker(centerPoint);
  map.addOverlay(marker);

  // 添加信息窗口
  const infoWindow = new BMap.InfoWindow(
    "<div style='font-size:14px;'><strong>吴侬碧螺春有机茶园</strong><br>" +
    "地址：苏州市吴中区东山镇<br>" +
    "面积：350亩<br>" +
    "核心种植区：150亩</div>",
    { width: 250, height: 120, title: "茶园信息" }
  );

  marker.addEventListener("click", function () {
    map.openInfoWindow(infoWindow, centerPoint);
  });

  // 添加圆形覆盖物（茶园范围）
  const circle = new BMap.Circle(centerPoint, 1500, {
    fillColor: "#00f2fe",
    fillOpacity: 0.1,
    strokeOpacity: 0.3,
    strokeColor: "#00f2fe",
    strokeWeight: 1
  });
  map.addOverlay(circle);
};

const setPointPosition = (point) => {
    const pt = new BMap.Point(point.lng, point.lat);
    const marker = new BMap.Marker(pt);
    // 根据设备类型选择不同的图标
    let iconPath = "/images/met.png"; // 默认图标
    if (point.type === "气象站") iconPath = "/images/met.png";
    if (point.type === "虫情分析仪") iconPath = "/images/wormFlagship.png";
    if (point.type === "孢子分析仪") iconPath = "/images/spore.png";
    if (point.type === "监控") iconPath = "/images/camera.png";
    if (point.type === "土壤墒情") iconPath = "/images/spore.png";
    if (point.type === "光照传感器") iconPath = "/images/met.png";

    // 添加自定义图标
    const icon = new BMap.Icon(
      iconPath,
      new BMap.Size(24, 24),
      {
        imageSize: new BMap.Size(24, 24)
      }
    );
    marker.setIcon(icon);
    map.addOverlay(marker);

    // 添加标记点击事件
    marker.addEventListener("click", function () {
      const device = devices.value.find(d => d.id === point.deviceId);
      if (device) {
        selectDevice(device);
      }
    });
}

const chartDataCount = 7;
// 设备详情图表
const initDeviceChart = () => {
  const chartDom = document.getElementById('deviceChart');
  if (!chartDom || !selectedDeviceDetail.value) return;

  const myChart = echarts.init(chartDom);

  // 根据设备类型生成不同图表数据
  let chartData = [];
  let chartTitle = '';
  let xData = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
  if (selectedDeviceDetail.value.id === 1) { // 气象站
    chartData = [22, 24, 25, 24.5, 25.5, 26, 25];
    chartTitle = '24小时温度变化';
    if (metData.length > 7) {
      chartData = metData.slice(-chartDataCount).map(item => item.tempValue);
      xData = metData.slice(-chartDataCount).map(item => item.currentTime.split(' ')[1]);
    }
  } else if (selectedDeviceDetail.value.id === 4) { // 土壤墒情
    chartData = [65, 68, 70, 68, 67, 69, 68];
    chartTitle = '24小时土壤湿度变化';
    if (metData.length > 7) {
      chartData = metData.slice(-chartDataCount).map(item => item.humValue);
      xData = metData.slice(-chartDataCount).map(item => item.currentTime.split(' ')[1]);
    }
  } else if (selectedDeviceDetail.value.id === 5) { // 光照传感器
    chartData = [38000, 42000, 45000, 42000, 40000, 43000, 42000];
    chartTitle = '24小时光照强度变化';
    if (metData.length > 7) {
      chartData = metData.slice(-chartDataCount).map(item => item.liumingValue);
      xData = metData.slice(-chartDataCount).map(item => item.currentTime.split(' ')[1]);
    }
  } else {
    // 其他设备使用通用数据
    chartData = Array.from({ length: 7 }, () =>
      selectedDeviceDetail.value.value + Math.round((Math.random() - 0.5) * 5)
    );
    chartTitle = '24小时数据变化';
  }

  const option = {
    title: {
      text: chartTitle,
      textStyle: {
        color: '#00f2fe',
        fontSize: 12
      },
      left: 'center'
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '25%'
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLine: {
        lineStyle: {
          color: '#8ec5fc'
        }
      },
      axisLabel: {
        color: '#8ec5fc',
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#8ec5fc'
        }
      },
      axisLabel: {
        color: '#8ec5fc',
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(64, 158, 255, 0.1)'
        }
      }
    },
    series: [{
      data: chartData,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#00f2fe',
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 242, 254, 0.3)' },
            { offset: 1, color: 'rgba(0, 242, 254, 0)' }
          ]
        }
      },
      itemStyle: {
        color: '#00f2fe'
      }
    }]
  };

  myChart.setOption(option);

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    myChart.resize();
  });
};

// 监听设备详情显示，初始化图表
  watch(showDeviceDetail, (newVal) => {
      if (newVal) {
          setTimeout(initDeviceChart, 100);
      }
  });
// 生命周期钩子
onMounted(() => {
  // 初始化时间
  updateTime();
  setInterval(updateTime, 1000);
  
  // 初始化地图
  setTimeout(initMap, 300);
  setTimeout(() => {
    getDeviceList().then(res => {
      let data = res.data
      devices.value[0].list = data.filter(item => item.deviceType === "met")
      devices.value[1].list = data.filter(item => item.deviceType === "wormFlagship")
      devices.value[2].list = data.filter(item => item.deviceType === "spore")
      data.forEach(item => {
        if(item.devicelng === 0 || item.devicelat === 0) return
        let point = {
          lng: item.devicelng,
          lat: item.devicelat,
          name: item.deviceName,
          type: item.deviceType === "met" ? "气象站" : item.deviceType === "wormFlagship" ? "虫情分析仪" : item.deviceType === "spore" ? "孢子分析仪" : "监控",
          deviceId: item.deviceType === "met" ? 1 : item.deviceType === "wormFlagship" ? 2 : item.deviceType === "spore" ? 3 : 6,
        }
        setPointPosition(point)
      })
    })
  }, 3000)
  // 初始化设备数据更新
  updateDeviceData();
  setInterval(updateDeviceData, 15000);
  // 从localStorage加载配置
  try {
    const savedConfig = localStorage.getItem('ysConfig');
    if (savedConfig) {
      ysConfig.value = JSON.parse(savedConfig);
      // 如果有配置，尝试获取token
      if (ysConfig.value.appKey && ysConfig.value.appSecret) {
        refreshToken();
      }
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }

  // 每5分钟检查一次token状态
  setInterval(() => {
    updateTokenStatus();
  }, 5 * 60 * 1000);
});

onUnmounted(() => {
  // 清理地图
  if (map) {
    map = null;
  }
  // 清理Token定时器
  ysApi.clearToken();
});
</script>