import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

function setRem() {
    const baseSize = 16; // 基准字体大小
    const designWidth = 1920; // 设计稿宽度
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const fontSize = (viewportWidth / designWidth) * baseSize;
    document.documentElement.style.fontSize = fontSize + 'px';
 }
 setRem();
 window.onresize = setRem;

createApp(App).mount('#app')

