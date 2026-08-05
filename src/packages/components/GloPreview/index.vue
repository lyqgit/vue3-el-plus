<template>
  <div v-if="fileType === 'image'">
    <el-image-viewer
      v-if="previewImgVisible"
      :url-list="[fileUrl]"
      :show-progress="showProgress"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      teleported
      :z-index="3000"
      @close="handleClosePreview"
    />
  </div>
  <GloDialog
    v-else
    ref="previewDialogRef"
    title="预览"
    width="1200px"
    height="600px"
    cancel-btn-text="关闭"
    :show-confirm-btn="false"
    @cancel="cancel"
    @closed="clearCon"
  >
    <div v-if="fileType === 'video'">
      <video
        :src="fileUrl"
        controls
        controlsList="nodownload"
        class="pre-video"
        @error="handleVideoError"
      >
        您的浏览器不支持视频播放
      </video>
    </div>
    <div v-if="fileType === 'audio'">
      <audio
        controls
        :src="fileUrl"
        preload="auto"
        style="margin-top: 300px"
      >
        你的浏览器不支持HTML5音频播放，请升级浏览器！
      </audio>
    </div>
    <div
      v-if="fileType === 'office'"
      class="h-600px"
    >
      <file-viewer
        :url="fileUrl"
        :options="options"
      />
    </div>
  </GloDialog>
</template>

<script setup lang="ts">
import {ref, computed, nextTick} from 'vue';
import {ElMessage} from 'element-plus';
import officePreset from '@file-viewer/preset-office';
import {getFileExtension, getFileUrl} from '../../utils/file';
import type {GloPreviewProps, GloPreviewOpenOptions, GloPreviewExpose, FileCategory} from './type';
import GloDialog from '../GloDialog';
import {FileViewer} from '@file-viewer/vue3';
import type {FileViewerOptions} from '@file-viewer/vue3';

const props = withDefaults(defineProps<GloPreviewProps>(), {
  showProgress: true,
  filePrefix: ''
});

const options: FileViewerOptions = {
  preset: officePreset,
  rendererMode: 'replace',
  theme: 'light',
  toolbar: {position: 'bottom-right'}
};

const previewImgVisible = ref(false);
const previewDialogRef = ref();
const fileName = ref('');

const fileType = computed<FileCategory | undefined>(() => {
  const ext = getFileExtension(fileName.value);
  if (['png', 'jpg'].includes(ext)) return 'image';
  if (['mp4'].includes(ext)) return 'video';
  if (['mp3'].includes(ext)) return 'audio';
  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf'].includes(ext)) return 'office';
  return undefined;
});

const fileUrl = computed(() => getFileUrl(fileName.value, props.filePrefix));

function handleClosePreview() {
  previewImgVisible.value = false;
}

function handleVideoError() {
  ElMessage.error('视频预览失败，请检查文件地址或格式');
}

function open({fileNameStr}: GloPreviewOpenOptions) {
  fileName.value = fileNameStr;
  if (fileType.value === 'image') {
    previewImgVisible.value = true;
  } else {
    nextTick(() => {
      previewDialogRef.value?.open();
    });
  }
}

function cancel() {
  previewDialogRef.value?.close();
}

function clearCon() {
  fileName.value = '';
}

defineExpose<GloPreviewExpose>({
  open
});
</script>

<style lang="scss" scoped>
.pre-video {
  width: 100%;
  height: 560px;
}
.pdf-container {
  height: 560px;
}
</style>
