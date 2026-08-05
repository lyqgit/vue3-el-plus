<template>
  <div class="upload-container">
    <slot
      v-if="slots.CustomFileList"
      name="CustomFileList"
      :file-list="fileList"
      :preview-file="previewFile"
      :handle-remove="handleRemove"
      :get-file-extension="getFileExtension"
      :get-file-url="getFileUrl"
    ></slot>
    <div
      v-else-if="fileList.length"
      class="file-list"
    >
      <div
        v-for="(item, idx) in fileList"
        :key="idx"
        class="file-item"
      >
        <img
          class="thumb"
          :src="getFileUrl(item)"
          alt=""
        />
        <div class="img-hover-mask">
          <el-icon @click.stop="previewFile(idx)">
            <View />
          </el-icon>
          <el-icon
            v-if="isEdit"
            style="margin-left: 16px"
            @click.stop="handleRemove(idx)"
          >
            <Delete />
          </el-icon>
        </div>
      </div>
    </div>
    <GloPreview ref="gloPreviewRef" />
    <el-upload
      v-if="fileList.length < limit && isEdit && !isChangeImg"
      name="file"
      :multiple="multiple"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="customUpload"
    >
      <slot
        v-if="slots.CustomBtn"
        name="CustomBtn"
      ></slot>
      <div
        v-else
        class="upLoad-btn"
      >
        <div class="no-img">
          <img
            class="icon-upload"
            :src="IconUpload"
            alt="upload"
          />
          <span>上传照片</span>
        </div>
      </div>
    </el-upload>
    <!-- 只为单个更换图片使用 -->
    <el-upload
      v-else-if="isChangeImg && isEdit"
      name="file"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="customUpload"
    >
      <slot
        v-if="slots.CustomBtn"
        name="CustomBtn"
      ></slot>
      <div
        v-else
        class="upLoad-btn"
      >
        <div class="no-img">
          <img
            class="icon-upload"
            :src="IconUpload"
            alt="upload"
          />
          <span>上传照片</span>
        </div>
      </div>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import {ref, useSlots, watch} from 'vue';
import {View, Delete} from '@element-plus/icons-vue';
import {ElMessage} from 'element-plus';
import {tryCatchLoading} from '../../utils/handler';
import {getFileExtension, getFileUrl} from '../../utils/file';
import type {GloUploadProps, GloUploadEmits, GloUploadExpose} from './type';
import IconUpload from '@/assets/icon-upload.png';

const slots = useSlots();

const props = withDefaults(defineProps<GloUploadProps>(), {
  limit: 3,
  maxSize: 10,
  ext: () => ['jpeg', 'png', 'jpg'],
  isEdit: true,
  modelValue: '',
  multiple: false,
  showProgress: true,
  customBeforeUpload: null,
  isChangeImg: false,
  uploadRequest: null
});

const emits = defineEmits<GloUploadEmits>();

const fileList = ref<string[]>([]);
const gloPreviewRef = ref();

// 预览指定文件
function previewFile(idx: number) {
  gloPreviewRef.value.open({fileNameStr: fileList.value[idx]});
}

// 删除单个图
function handleRemove(idx: number) {
  fileList.value.splice(idx, 1);
  emits('update:modelValue', fileList.value.join(','));
}

// 验证文件类型
function validateFileType(fileName: string) {
  const ext = getFileExtension(fileName);
  return props.ext.map((e) => e.toLowerCase()).includes(ext);
}

// 上传文件之前的钩子
function beforeUpload(file: globalThis.File) {
  const inExt = validateFileType(file.name);
  if (!inExt) {
    ElMessage.error(`只能上传${props.ext.join(',')}格式文件!`);
    return false;
  }

  if (fileList.value.length >= props.limit && props.limit !== 0 && !props.isChangeImg) {
    ElMessage.error(`上传文件不能超过${props.limit}个!`);
    return false;
  }

  const isLtSizeM = file.size / 1024 / 1024 > props.maxSize;
  if (isLtSizeM && props.maxSize !== 0) {
    ElMessage.error(`文件大小不能超过${props.maxSize}MB!`);
    return false;
  }

  if (props.customBeforeUpload) {
    return props.customBeforeUpload(file, {fileList: fileList.value, getFileExtension});
  }

  return true;
}

const customUpload = tryCatchLoading(
  async function (rawFile: {file: globalThis.File}) {
    if (!props.uploadRequest) {
      ElMessage.error('未配置上传请求函数 uploadRequest');
      return false;
    }

    const formData = new globalThis.FormData();
    formData.append('file', rawFile.file);
    const uploadRes = await props.uploadRequest(formData);
    if (props.isChangeImg) {
      fileList.value = [uploadRes.data];
    } else {
      fileList.value.push(uploadRes.data);
    }
    emits('update:modelValue', fileList.value.join(','));
    return true;
  },
  {
    successText: '上传成功',
    throwError: true
  }
);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      fileList.value = [];
      return;
    }
    fileList.value = val.split(',').filter(Boolean);
  },
  {immediate: true}
);

defineExpose<GloUploadExpose>({
  previewFile,
  handleRemove
});
</script>
<style lang="scss" scoped>
.upload-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  position: relative;

  .file-list {
    display: flex;
    flex-wrap: wrap;
    .file-item {
      width: 88px;
      height: 88px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #dde0e5;
      cursor: pointer;
      margin-right: 8px;
      padding: 4px;
      box-sizing: border-box;
      position: relative;
      &:hover {
        .img-hover-mask {
          width: 100%;
        }
      }

      .img-hover-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        transition: width 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        overflow: hidden;
        color: #ffffff;
        font-size: 20px;
        z-index: 999;
      }

      .thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        border-radius: 4px;
        overflow: hidden;
      }
    }
  }

  .upLoad-btn {
    width: 88px;
    height: 88px;
    border: 1px solid #dde0e5;
    border-radius: 8px;
    color: #666a70;
    display: flex;
    justify-content: center;
    padding: 5px;
    box-sizing: border-box;
    align-items: center;
    .no-img {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .icon-upload {
        width: 20px;
        height: 20px;
      }
      span {
        font-size: 12px;
        line-height: 14px;
        margin-top: 6px;
      }
    }
  }
  .upLoad-tips {
    color: #aaadb3;
    font-size: 12px;
    position: absolute;
    bottom: -20px;
    left: 0;
    line-height: normal;
  }
  :deep(.el-loading-spinner) {
    top: 50%;
    transform: translateY(-50%);
    margin-top: 0;
  }
}

.preview-img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
