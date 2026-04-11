<template>
  <div class="container">
    <div class="header">
      <h1>吴侬·洞庭（山）碧螺春数智茶链</h1>
      <div class="time">{{ currentTime }}</div>
    </div>

    <div class="info-panel">
      <div class="tea-info">
        <div class="panel-title">数智茶园</div>
        <div class="info-item-1">
          <div class="label">&nbsp;茶园名称</div>
          <div class="value">{{ chayuanInfo.name }}</div>
        </div>
        <div class="info-item-1">
          <div class="label">&nbsp;地理位置</div>
          <div class="value">{{ chayuanInfo.location }}</div>
        </div>
        <div class="info-item-1">
          <div class="label">&nbsp;茶园面积</div>
          <div class="value">{{ chayuanInfo.area }}亩</div>
        </div>
        <div class="info-item-1">
          <div class="label">&nbsp;茶树品种</div>
          <div class="value">{{ chayuanInfo.teabrand }}</div>
        </div>

      </div>

      <div class="traceability">
        <div class="panel-title">匠心茶链</div>
        <h3 @click="showQRCode = true" style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
          吴侬·洞庭（山）碧螺春茶产品区块链溯源
        </h3>



        <div class="trace-item" @click="showFertilizerDetail = true" style="cursor: pointer;">
          <div class="info-item">
            <div>&nbsp;施肥记录</div>
          </div>
          <div class="trace-status">{{ chayuanInfo.fertilizer }} ></div>
        </div>

        <div class="trace-item" @click="showBusinessDetail = true" style="cursor: pointer;">
          <div class="info-item">&nbsp;
            <div>企业公告</div>
          </div>
          <div class="trace-status">{{ chayuanInfo.business }} ></div>
        </div>

        <div class="trace-item" @click="showInfoDetail = true" style="cursor: pointer;">
          <div class="info-item">
            <div>&nbsp;商品信息</div>
          </div>
          <div class="trace-status">{{ chayuanInfo.information }} ></div>
        </div>

        <div class="trace-item" @click="showAuthDetail = true" style="cursor: pointer;">
          <div class="info-item">
            <div>&nbsp;有机认证</div>
          </div>
          <div class="trace-status">{{ chayuanInfo.qualityReport }} ></div>
        </div>

        <!-- <div class="trace-item"  @click="showInfoBlockchain = true" style="cursor: pointer;">
          <div class="info-item">
         &nbsp;区块链存证</div>
          <div class="trace-status">{{ chayuanInfo.blockchainStatus }}></div>
        </div> -->

        <div class="trace-item" @click="showCompanyDetail = true" style="cursor: pointer;">
          <div class="info-item">
            <div>&nbsp;企业介绍</div>
          </div>
          <div class="trace-status">详情 ></div>
        </div>
      </div>

      <div class="device-info">
        <div class="panel-title">设备工况</div>
        <div class="device-grid">
          <div v-for="device in devices" :key="device.id" class="device-card"
            :class="{ selected: selectedDevice === device.id }" @click="selectDevice(device)">
            <div class="device-icon">
              <i :class="device.icon"></i>
            </div>
            <div class="device-name">{{ device.name }}</div>
            <div class="device-status">
              <span class="status-dot"></span>
              在线
            </div>
          </div>
        </div>
      </div>
      <div class="four-info">
        <div class="panel-title">四情监测</div>
        <div class="situation-list">
          <div v-for="item in fourSituation" :key="item.name" class="situation-row">
            <div class="situation-label"><i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </div>
            <div class="situation-metrics">
              <span v-for="m in item.metrics" :key="m.label" class="metric-item">
                {{ m.label }}:<span class="hl">{{ m.value }}{{ m.unit }}</span>
              </span>
            </div>

            <div class="situation-conclusion" :class="item.status">
              {{ item.conclusion }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="map-container">
      <div id="baidu-map"></div>
      <div class="map-overlay">
        <div class="map-overlay-title">茶园位置与设备分布</div>
        <div>核心种植区：{{ chayuanInfo.area }}亩</div>
        <div>传感器节点：{{ videoStats.sensorCount }}个</div>
        <div>设备在线率：{{ onlineRate }}%</div>
        <div class="map-device-info" v-if="selectedDevice">
          <strong>当前选中：</strong>{{ getDeviceName(selectedDevice) }}
        </div>
      </div>
    </div>

    <div class="video-panel">
      <div class="panel-title">茶园实景</div>

      <div class="monitor-grid">
        <div class="monitor-box">
          <VideoPlayerEZUI :appKey="ysConfig.appKey" :appSecret="ysConfig.appSecret"
            :deviceSerial="ysConfig.deviceSerial1" :deviceId="1" :label="ysConfig.label1 || '核心种植区1'"
            @tokenReady="onTokenReady" @error="handleMonitorError(1)" ref="monitor1" />
        </div>

        <!-- <div class="monitor-box">
          <VideoPlayerEZUI :appKey="ysConfig.appKey" :appSecret="ysConfig.appSecret"
            :deviceSerial="ysConfig.deviceSerial2" :deviceId="2" :label="ysConfig.label2 || '核心种植区2'"
            @tokenReady="onTokenReady" @error="handleMonitorError(2)" ref="monitor2" />
        </div> -->
      </div>

      <div class="monitor-controls">
        <button v-for="btn in monitorControls" :key="btn.id" class="monitor-btn"
          :class="{ active: activeControl === btn.id }" @click="setActiveControl(btn.id)">
          {{ btn.label }}
        </button>
      </div>

      <div class="panel-box weather-section-extended">
        <div class="panel-title">实时气象</div>

        <div class="weather-scroll-content">
          <div class="weather-tall-grid">
            <div v-for="item in weatherMetrics" :key="item.label" class="weather-tall-item">
              <div class="device-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="tall-label">{{ item.label }}</div>
              <div class="tall-value">
                {{ item.value }}<span class="tall-unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="showDeviceDetail" class="modal-overlay" @click="closeDeviceDetail"></div>

    <div v-if="showDeviceDetail" class="device-detail-modal">
      <div class="modal-header">
        <div class="modal-title">{{ selectedDeviceDetail.name }}详情</div>
        <button class="close-btn" @click="closeDeviceDetail">×</button>
      </div>

      <div class="device-detail-content">
        <div class="detail-item">
          <span class="detail-label">设备工况：</span>
          <span class="detail-value" style="color: #00ff9d;">在线</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">最后维护：</span>
          <span class="detail-value">{{ selectedDeviceDetail.lastMaintenance }}</span>
        </div>

        <div class="device-image-container">
          <img :src="getDeviceImage(selectedDeviceDetail.name)" :alt="selectedDeviceDetail.name" class="device-img" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="showAuthDetail" class="modal-overlay" @click="showAuthDetail = false"></div>
  <div v-if="showAuthDetail" class="device-detail-modal auth-large-modal">
    <div class="modal-header">
      <div class="modal-title">有机产品认证证书 ({{ currentCertIndex + 1 }}/2)</div>
      <button class="close-btn" @click="showAuthDetail = false">×</button>
    </div>

    <div class="auth-carousel-container">
      <button class="arrow-btn left" @click.stop="prevCert">
        < </button>

          <div class="auth-image-wrapper">
            <img :src="certImages[currentCertIndex]" class="full-cert-img" />
          </div>

          <button class="arrow-btn right" @click.stop="nextCert"> > </button>
    </div>
  </div>

  <div v-if="showFertilizerDetail" class="modal-overlay" @click="showFertilizerDetail = false"></div>
  <div v-if="showFertilizerDetail" class="device-detail-modal">
    <div class="modal-header">
      <div class="modal-title">施肥作业记录</div>
      <button class="close-btn" @click="showFertilizerDetail = false">×</button>
    </div>
    <div class="device-detail-content"
      style="color: #fff; padding: 20px; line-height: 1.8; font-size: 15px; text-indent: 2em;">
      2025年11月5日起施肥，至12月25日止，总亩数500亩，施用50吨菜籽饼肥，每亩施肥量100KG，施肥天数31天。
    </div>
  </div>

  <!-- <div v-if="showInfoBlockchain" class="modal-overlay" @click="showInfoBlockchain = false"></div> -->
  <!-- <div v-if="showInfoBlockchain" class="device-detail-modal">
  <div class="modal-header">
    <div class="modal-title">区块链</div>
    <button class="close-btn" @click="showInfoBlockchain = false">×</button>
  </div>
  <div class="device-detail-content" style="color: #fff; padding: 20px; line-height: 1.8; font-size: 15px; text-indent: 2em;">
    已上链
  </div>
</div> -->



  <div v-if="showBusinessDetail" class="modal-overlay" @click="showBusinessDetail = false"></div>
  <div v-if="showBusinessDetail" class="device-detail-modal">
    <div class="modal-header">
      <div class="modal-title">企业公告详情</div>
      <button class="close-btn" @click="showBusinessDetail = false">×</button>
    </div>
    <div class="device-detail-content"
      style="color: #fff; padding: 20px; line-height: 1.8; font-size: 15px; text-align: justify;">
      吴侬洞庭（山）碧螺春茶年预产量约3420KG，其中有机碧螺春茶1170KG，绿色标准碧螺春2250KG。2026年吴侬订购有机碧螺春溯源码总数是2000枚，绿色标准碧螺春溯源码总数是5000枚，共发行7000枚碧螺春溯源码，每盒克重见外包装。商品一经出售，由客户扫码认证后，信息自动入链，不可篡改，永久追溯。
    </div>
  </div>
  <div v-if="showQRCode" class="modal-overlay qr-overlay" @click="showQRCode = false"></div>

  <div v-if="showQRCode" class="Fg qr-modal ">
    <div class="modal-header">
      <div class="modal-title">茶山区块链溯源码</div>
      <button class="close-btn" @click="showQRCode = false">×</button>
    </div>

    <div class="device-detail-content qr-content" style="text-align: center; padding: 30px;">
      <img :src="qrcodeImg" alt="二维码" class="qr-image" />
      <p style="color: #fff; margin-top: 15px; font-size: 14px;">
        扫描二维码访问区块链溯源系统
      </p>
    </div>
  </div>



  <div class="device-detail-content" style="padding: 20px 25px; color: #fff;"></div>
  <div v-if="showInfoDetail" class="modal-overlay" @click="showInfoDetail = false"></div>
  <div v-if="showInfoDetail" class="device-detail-modal info-custom-modal">
    <div class="modal-header">
      <div class="modal-title">商品信息详情</div>
      <button class="close-btn" @click="showInfoDetail = false">×</button>
    </div>

    <div class="device-detail-content custom-scroll">
      <div class="info-list">
        <div class="info-row"><span class="dot"></span><label>商品名称</label><span class="val">洞庭（山）碧螺春茶</span></div>
        <div class="info-row"><span class="dot"></span><label>品牌</label><span class="val">吴侬</span></div>
        <div class="info-row"><span class="dot"></span><label>品类</label><span class="val">绿色/有机</span></div>
        <div class="info-row"><span class="dot"></span><label>保质期</label><span class="val">12个月</span></div>
        <div class="info-row"><span class="dot"></span><label>贮存方式</label><span class="val">原封贮存于零下5℃环境</span></div>
        <div class="info-row"><span class="dot"></span><label>生产地址</label><span class="val">苏州洞庭（山）碧螺村</span></div>
        <div class="info-row"><span class="dot"></span><label>生产厂家</label><span class="val">苏州市东山吴侬碧螺春茶叶专业合作社</span>
        </div>
        <div class="info-row"><span class="dot"></span><label>联系方式</label><span class="val">400-6656-226</span></div>
        <div class="info-row"><span class="dot"></span><label>采摘时间</label><span class="val">见外包装</span></div>

        <div class="info-row no-line">
          <span class="dot"></span><label>采摘图</label>
          <div class="photo-container" @click="openAlbum(pickingImages, '采摘实景')">
            <img :src="pickingImages[0]" class="main-photo" />
            <div class="photo-count">{{ pickingImages.length }}</div>
          </div>
        </div>

        <div class="info-row">
          <span class="dot"></span><label>炒茶介绍</label>
          <div class="intro-text">
            甄选苏州东山半岛，洞庭山碧螺春小叶群体种鲜叶，纯手工采摘，全程纯手工炒制。运用精妙古法“炒”、“揉”、“焙”三字诀，成茶条索纤细，回甘生津。
          </div>
        </div>

        <div class="info-row no-line">
          <span class="dot"></span><label>炒茶车间</label>
          <div class="photo-container" @click="openAlbum(workshopImages, '炒茶车间')">
            <img :src="workshopImages[0]" class="main-photo" />
            <div class="photo-count">{{ workshopImages.length }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showPreview" class="modal-overlay preview-layer" @click="showPreview = false">
    <div class="album-wrapper" @click.stop>
      <div class="album-header">
        <span>{{ albumTitle }} ({{ currentImgIndex + 1 }}/{{ currentAlbum.length }})</span>
        <button class="close-btn" @click="showPreview = false">×</button>
      </div>

      <div class="album-main">
        <button class="nav-btn prev" @click="prevImg">
          < </button>

            <img :src="currentAlbum[currentImgIndex]" class="album-img" />

            <button class="nav-btn next" @click="nextImg"> > </button>
      </div>
    </div>
  </div>

  <div v-if="showCompanyDetail" class="modal-overlay" @click="showCompanyDetail = false"></div>
  <div v-if="showCompanyDetail" class="device-detail-modal company-custom-modal">
    <div class="modal-header">
      <div class="modal-title">企业介绍</div>
      <button class="close-btn" @click="showCompanyDetail = false">×</button>
    </div>

    <div class="device-detail-content custom-scroll">
      <div class="info-list">
        <div class="info-row">
          <span class="dot"></span>
          <label style="width: 100%;">苏州市东山吴侬碧螺春茶叶专业合作社</label>
        </div>

        <div class="company-full-text">
          苏州市东山吴侬碧螺春茶叶专业合作社是由364户农茶户入股组建的农产品专业股份合作社，基地位于苏州市东山镇碧螺村,有1400多亩茶园及9300多平方米的休闲品茶观光区，1500多平方米的茶叶炒制车间，在苏州和东山镇区设立了“吴侬”
          牌茶叶专卖店，基地年产洞庭（山）碧螺春茶3500—4000斤，茶叶总产值800—900万元，茶叶产销位居东山镇茶叶企业前茅。
          合作社生产的“吴侬”牌洞庭（山）碧螺春茶通过了ISO9001:2000国际质量管理体系认证，碧螺春茶和枇杷先后认定为国家A级绿色食品，2006年被评为苏州市名牌产品，同年合作社茶叶基地被授予洞庭（山）碧螺春茶原产地域产品保护“十大生产基地”
          及“十大品牌企业”之一,2007年3月通过了国家食品质量安全认证，同年六月在第七届“中茶杯”全国名优茶评比中荣获一等奖，同年被评为江苏省质量信用产品，在2008年5月“吴侬”碧螺春茶被中国极地研究中心认定为“中国南北极考察特供产品”，
          2008年7月合作社被列入江苏省“四有”示范农民专业合作社。2020年获得江苏省农业企业“茶叶类5强品牌”荣誉。2022年7月获得江苏省第二十届“陆羽杯”名特茶评价活动一等奖荣誉。2022年10月获得苏州市农业农村局“洞庭山碧螺春十强企业”荣誉。
          为保留地道醇正的洞庭东山碧螺春茶传统的品质和韵味，合作社统一栽培洞庭山群体小叶种茶树，并遵循传统的果茶间作种植模式，从而保证了基地产出的碧螺春茶的花果香气和滋味甘淳。
          基地茶园日常管理以生物管控为核心思想，并严格执行农产品质量安全制度，实行“六统一”规定：统一采摘、统一挑拣、统一炒制、统一包装、统一宣传，统一销售。
          目前吴侬基地已对土壤，水分，空气等茶园重要指标实施365天全天候全覆盖的实时监控管理，以科学检测数据指导茶园管理团队实施精准的日常管理。合作社通过前期茶园的科学管理，再加上后期炒茶车间的工艺优化，持续稳定的提高茶叶品质，持续稳定的提升吴侬品牌知名度。
        </div>
      </div>
    </div>
  </div>




</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import VideoPlayerEZUI from './components/VideoPlayerEZUI.vue';
import { getDeviceList, getRealTimeData, getSoilList } from '@/api/device/index.js'
import * as echarts from 'echarts';
import { getMetData, setMetData } from './utils/auth.js'

import ysApi from './utils/ysApi';

const getDeviceImage = (name) => {
  // name 对应图片文件名，例如 'picking1'
  // import.meta.url 是当前文件的路径，Vite 会自动解析相对路径
  return new URL(`./assets/img/${name}.png`, import.meta.url).href;
};
// 3. ✨ 导入二维码图片路径 (替换为你的真实路径)
import qrcodeImg from '@/assets/img/QKLEWM.png';
const showAuthDetail = ref(false);
const showCompanyDetail = ref(false); // 控制企业介绍弹窗
// 控制证书弹窗的当前图片索引
const currentCertIndex = ref(0);
const showFertilizerDetail = ref(false);
const showBusinessDetail = ref(false); // 控制企业公告弹窗
const showInfoDetail = ref(false); // 控制商品信息弹窗
const showInfoBlockchain = ref(false); // 控制区块链弹窗
// 1. 开关变量


const showPreview = ref(false);
const currentAlbum = ref([]);      // 存储当前要看的图片数组
const currentImgIndex = ref(0);    // 当前显示的图片索引
const albumTitle = ref('');        // 弹窗标题

// 核心函数：打开并初始化相册
const openAlbum = (images, title) => {
  if (!images || images.length === 0) return;
  currentAlbum.value = images;     // 把整组图存进去
  albumTitle.value = title;
  currentImgIndex.value = 0;       // 每次打开都从第一张看起
  showPreview.value = true;
};
const showQRCode = ref(false); // 控制二维码弹窗

// 切换逻辑：上一张
const prevImg = (e) => {
  e.stopPropagation(); // 阻止点击事件冒泡到父级导致弹窗关闭
  if (currentImgIndex.value > 0) {
    currentImgIndex.value--;
  } else {
    currentImgIndex.value = currentAlbum.value.length - 1;
  }
};

// 切换逻辑：下一张
const nextImg = (e) => {
  e.stopPropagation(); // 阻止点击事件冒泡
  if (currentImgIndex.value < currentAlbum.value.length - 1) {
    currentImgIndex.value++;
  } else {
    currentImgIndex.value = 0;
  }
};



// 2. 图片数组（确保资源路径匹配）
const pickingImages = [
  new URL('@/assets/img/picking1.jpg', import.meta.url).href,
  new URL('@/assets/img/picking2.jpg', import.meta.url).href,
  new URL('@/assets/img/picking3.jpg', import.meta.url).href,
  new URL('@/assets/img/picking4.jpg', import.meta.url).href
];
const workshopImages = [
  new URL('@/assets/img/workshop1.jpg', import.meta.url).href,
  new URL('@/assets/img/workshop2.jpg', import.meta.url).href,
  new URL('@/assets/img/workshop3.jpg', import.meta.url).href,
  new URL('@/assets/img/workshop4.jpg', import.meta.url).href
];

// 3. 预览函数
const openPreview = (url) => {
  previewImgUrl.value = url;
  showPreview.value = true;
};

const certImages = [
  new URL('@/assets/img/YJCPRZ1.jpg', import.meta.url).href,
  new URL('@/assets/img/YJCPRZ2.jpg', import.meta.url).href
];

const nextCert = () => {
  currentCertIndex.value = (currentCertIndex.value + 1) % certImages.length;
};

const prevCert = () => {
  currentCertIndex.value = (currentCertIndex.value - 1 + certImages.length) % certImages.length;
};




// 引入百度地图JS（确保在index.html中已引入百度地图API）
let map = null;


// 时间相关
const currentTime = ref('');
const currentDate = ref('')

let metData = getMetData()

// 环境数据
const environment = ref({
  temp: 24.5,
  humidity: 78,
  ions: 42,
  airQuality: '优',
  co2: 500,
  windSpeed: 2.5,
  wind: 2,
  rainfall: 15
});
if (metData.length > 0) {
  environment.value.temp = metData[metData.length - 1].tempValue;
  environment.value.humidity = metData[metData.length - 1].humValue;
  environment.value.ions = metData[metData.length - 1].ionsValue;
  environment.value.co2 = metData[metData.length - 1].co2Value;
  environment.value.windSpeed = metData[metData.length - 1].windSpeedValue;
  environment.value.wind = metData[metData.length - 1].windValue;

}

// 设备数据
const devices = ref([
  { id: 1, name: '气象站', icon: 'fas fa-cloud-sun', status: 'online', statusText: '在线' },
  { id: 2, name: '虫情分析仪', icon: 'fas fa-bug', status: 'online', statusText: '在线' },
  { id: 3, name: '孢子分析仪', icon: 'fas fa-virus', status: 'online', statusText: '在线' },
  { id: 4, name: '视频监控', icon: 'fas fa-video', status: 'online', statusText: '在线' }
]);
const chayuanInfo = ref({
  name: '吴侬碧螺春有机茶园',
  location: '苏州市吴中区东山镇碧螺村',
  area: 500,
  fertilizer: '详情',
  business: '详情',
  information: '详情',
  status: '正常',
  teabrand: '洞庭山群体小叶种',
  pickingTime: '2026-03-20 至 2026-04-10',
  processingCompany: '苏州市东山吴侬碧螺春茶叶专业合作社',
  qualityReport: '详情 ',
  blockchainStatus: '详情 ',
  plantingStandard: '有机认证'
});

const fourSituation = ref([
  {
    name: '墒情',
    icon: 'fas fa-tint',
    metrics: [
      { label: '温度', value: '22.5', unit: '℃' },
      { label: '湿度', value: '65', unit: '%' },
      { label: 'PH', value: '6.8', unit: '' },
      { label: 'EC', value: '0.45', unit: 'mS/cm' }
    ],
    conclusion: '墒情适宜',
    status: 'good' // 用于控制绿色显示
  },
  {
    name: '苗情',
    icon: 'fas fa-leaf',
    metrics: [
      { label: 'NDVI', value: '0.72', unit: '' },
      { label: '覆盖率', value: '85', unit: '%' }
    ],
    conclusion: '长势旺盛',
    status: 'good'
  },
  {
    name: '虫情',
    icon: 'fas fa-bug',
    metrics: [
      { label: '虫口密度', value: '0', unit: '头/㎡' },
      { label: '灯诱', value: '0', unit: '头' }
    ],
    conclusion: '没有发生',
    status: 'good'
  },
  {
    name: '灾情',
    icon: 'fas fa-exclamation-triangle',
    metrics: [
      { label: '低温冻害', value: '无', unit: '' },
      { label: '干旱风险', value: '无', unit: '' },
    ],
    conclusion: '没有发生',
    status: 'good'
  }
]);
const weatherMetrics = computed(() => [
  { label: '空气温度', value: environment.value.temp, unit: '℃', icon: 'fas fa-thermometer-half' },
  { label: '空气湿度', value: environment.value.humidity, unit: '%', icon: 'fas fa-tint' },
  { label: '光照指标', value: environment.value.ions, unit: 'lux', icon: 'fas fa-leaf' },
  { label: 'CO2浓度', value: environment.value.co2, unit: 'ppm', icon: 'fas fa-smog' },
  { label: '风速', value: `${environment.value.windSpeed}m/s  (${environment.value.wind}级)`, icon: 'fas fa-wind' },
  { label: '风向', value: '东南风', unit: '', icon: 'fas fa-compass' },
  { label: '空气质量', value: environment.value.airQuality, unit: '', icon: 'fas fa-star' },
  { label: '累计降雨', value: '12.4', unit: 'mm', icon: 'fas fa-cloud-showers-heavy' }
]);
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
// const monitorControls = ref([
//   { id: 'all', label: '全部播放' },
//   { id: 'pause', label: '全部暂停' },
//   { id: 'stop', label: '停止播放' },
//   { id: 'reconnect', label: '重新连接' },
//   { id: 'refreshToken', label: '刷新Token' }
// ]);
const activeControl = ref('all');

// 视频统计
const videoStats = ref({
  count: 4,
  duration: '24h',
  sensorCount: 146
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
    .filter(value => !isNaN(value) && value !== 0); // 过滤掉非数值

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

    // 限制metData长度不超过3000，超出时删除最旧的数据
    if (metData.length > 3000) {
      metData = metData.slice(-3000); // 保留最新的3000条数据
    }

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
    environment.value.ions = Math.round(liumingValue + (Math.random() - 0.5) * 5000);
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
  // switch (controlId) {
  //   case 'all':
  //     // 全部播放
  //     if (monitor1.value) monitor1.value.toggleToPlay();
  //     if (monitor2.value) monitor2.value.toggleToPlay();
  //     break;
  //   case 'pause':
  //     // 全部暂停
  //     if (monitor1.value) monitor1.value.togglePlay();
  //     if (monitor2.value) monitor2.value.togglePlay();
  //     break;
  //   case 'stop':
  //     // 停止播放
  //     if (monitor1.value) monitor1.value.reconnect();
  //     if (monitor2.value) monitor2.value.reconnect();
  //     break;
  //   case 'reconnect':
  //     // 重新连接
  //     if (monitor1.value) monitor1.value.reconnect();
  //     if (monitor2.value) monitor2.value.reconnect();
  //     break;
  //   case 'refreshToken':
  //     // 刷新Token
  //     refreshToken();
  //     break;
  // }
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
    "面积：500亩<br>" +
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
        if (item.devicelng === 0 || item.devicelat === 0) return
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