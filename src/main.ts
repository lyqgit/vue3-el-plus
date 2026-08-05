import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/dist/index.css';
import 'virtual:uno.css'; // 引入 UnoCSS 样式
import App from './App.vue';
import {dictPlugin, setFilePrefix} from './lib';
import type {DictData} from './lib';

// 字典数据
const dictData: DictData = {
  gender: [
    {label: '男', value: '1', enum: 'MALE', color: '#409eff'},
    {label: '女', value: '0', enum: 'FEMALE', color: '#f56c6c'}
  ],
  status: [
    {label: '在职', value: '1', enum: 'ACTIVE', color: '#67c23a'},
    {label: '离职', value: '0', enum: 'RESIGNED', color: '#909399'}
  ]
};

setFilePrefix('https://unpkg.com/element-plus@2.3.3/theme-chalk');

createApp(App).use(ElementPlus, {locale: zhCn}).use(dictPlugin, dictData).mount('#app');
