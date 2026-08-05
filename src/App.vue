<script setup lang="ts">
import {ref, reactive} from 'vue';
import axios from 'axios';

// 组件导入
import GloTable, {type GloTableColumn, type GloTableConfig} from './packages/components/GloTable';
import GloDialog, {type GloDialogExpose} from './packages/components/GloDialog';
import GloDialogTip, {type GloDialogTipExpose} from './packages/components/GloDialogTip';
import GloDrawer, {type GloDrawerExpose} from './packages/components/GloDrawer';
import GloPreview from './packages/components/GloPreview';
import GloDescriptions from './packages/components/GloDescriptions';
import type {DescriptionsRow} from './packages/components/GloDescriptions';
import GloUpload from './packages/components/GloUpload';
import type {UploadRequest} from './packages/components/GloUpload';
import GloHeaderLabel from './packages/components/GloHeaderLabel';
import GloSelectMore from './packages/components/GloSelectMore';
import GloDictTag from './packages/components/GloDictTag';
import GloInfiniteScroll from './packages/components/GloInfiniteScroll';

// ==================== GloTable ====================
const tableRef = ref();
const formRef = ref();

const queryForm = reactive({
  name: '',
  department: '',
  status: ''
});

const tableColumn: GloTableColumn[] = [
  {prop: 'id', label: 'ID', width: 80, align: 'center'},
  {prop: 'name', label: '姓名', minWidth: 120},
  {prop: 'age', label: '年龄', width: 100, align: 'center'},
  {prop: 'gender', label: '性别', width: 100, align: 'center', dictName: 'gender'},
  {prop: 'email', label: '邮箱', minWidth: 200},
  {prop: 'phone', label: '电话', width: 150},
  {prop: 'department', label: '部门', minWidth: 150},
  {prop: 'position', label: '职位', minWidth: 150},
  {prop: 'status', label: '状态', width: 100, align: 'center', dictName: 'status'},
  {prop: 'joinDate', label: '入职日期', width: 180}
];

const fetchTableData = async (params: {current: number; size: number; name?: string; department?: string; status?: string}) => {
  const response = await axios.post('/api/table/list', params);
  return response.data;
};

const tableConfig: GloTableConfig = {
  local: false,
  showPagination: true,
  rowKey: 'id',
  emptyStr: '-',
  req: fetchTableData,
  initStart: true,
  pagination: true,
  size: 20,
  formRef: formRef,
  formData: queryForm
};

async function handleSearch() {
  await formRef.value?.validate();
  tableRef.value?.search(queryForm);
}

function handleReset() {
  formRef.value?.resetFields();
  tableRef.value?.resetQuery();
}

// ==================== GloDialog ====================
const gloDialogRef = ref<GloDialogExpose>();
function openDialog() {
  gloDialogRef.value?.open();
}

// ==================== GloDialogTip ====================
const dialogTipRef = ref<GloDialogTipExpose>();

// ==================== GloDrawer ====================
const drawerRef = ref<GloDrawerExpose>();

// ==================== GloDescriptions ====================
const desArr: DescriptionsRow[][] = [
  [
    {title: '姓名', content: '张三'},
    {title: '性别', content: '1', dictName: 'gender'},
    {title: '部门', content: '技术部'}
  ],
  [
    {title: '年龄', content: '28'},
    {title: '状态', content: '1', dictName: 'status'},
    {title: '入职日期', content: '2023-01-15'}
  ]
];

// ==================== GloUpload ====================
const uploadValue = ref('');
const uploadRequest: UploadRequest = async (formData) => {
  const response = await axios.post('/api/upload/file', formData);
  return response.data;
};

// ==================== GloSelectMore ====================
const selectMoreValue = ref('');
const fetchSelectOptions = async (params: {current: number; size: number; key?: string}) => {
  const response = await axios.post('/api/select/options', params);
  return response.data;
};

// ==================== GloDictTag ====================

// ==================== GloInfiniteScroll ====================
const fetchGrowthRecords = async (params: {current: number; size: number}) => {
  const response = await axios.post('/api/growth/records', params);
  return response.data;
};

function getRowField(row: unknown, field: string): string {
  return String((row as Record<string, unknown>)?.[field] ?? '');
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 h-full overflow-auto">
    <!-- ==================== GloTable ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloTable 表格" />
      <el-form
        ref="formRef"
        :model="queryForm"
        label-width="80px"
        class="flex flex-wrap gap-4 mt-4"
      >
        <el-form-item label="姓名">
          <el-input
            v-model="queryForm.name"
            placeholder="请输入姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="queryForm.department"
            placeholder="请选择部门"
            clearable
          >
            <el-option
              v-for="d in ['技术部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部', '行政部']"
              :key="d"
              :label="d"
              :value="d"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              label="在职"
              value="1"
            />
            <el-option
              label="离职"
              value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
          >
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <GloTable
        ref="tableRef"
        :table-column="tableColumn"
        :table-config="tableConfig"
      />
    </el-card>

    <!-- ==================== GloDialog ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloDialog 弹窗" />
      <div class="mt-4">
        <el-button
          type="primary"
          @click="openDialog"
        >
          打开弹窗
        </el-button>
        <GloDialog
          ref="gloDialogRef"
          title="测试弹窗"
          :has-cancel-func="true"
          @confirm="gloDialogRef?.close()"
          @cancel="gloDialogRef?.close()"
        >
          <p>这是弹窗内容</p>
        </GloDialog>
      </div>
    </el-card>

    <!-- ==================== GloDialogTip ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloDialogTip 提示弹窗" />
      <div class="mt-4">
        <el-button @click="dialogTipRef?.open()">打开提示</el-button>
        <GloDialogTip
          ref="dialogTipRef"
          title="提示"
          content="确认要执行此操作吗？"
          @confirm="dialogTipRef?.close()"
        />
      </div>
    </el-card>

    <!-- ==================== GloDrawer ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloDrawer 抽屉" />
      <div class="mt-4">
        <el-button @click="drawerRef?.open()">打开抽屉</el-button>
        <GloDrawer
          ref="drawerRef"
          title="测试抽屉"
        >
          <p>这是抽屉内容</p>
        </GloDrawer>
      </div>
    </el-card>

    <!-- ==================== GloDescriptions ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloDescriptions 描述列表" />
      <div class="mt-4">
        <GloDescriptions :des-arr="desArr" />
      </div>
    </el-card>

    <!-- ==================== GloUpload ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloUpload 上传" />
      <div class="mt-4">
        <GloUpload
          v-model="uploadValue"
          :upload-request="uploadRequest"
        />
        <p class="mt-2 text-sm text-gray-400">上传返回值: {{ uploadValue }}</p>
      </div>
    </el-card>

    <!-- ==================== GloSelectMore ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloSelectMore 远程搜索选择" />
      <div class="mt-4">
        <GloSelectMore
          v-model="selectMoreValue"
          :fetch-api="fetchSelectOptions"
          placeholder="搜索部门"
        />
        <p class="mt-2 text-sm text-gray-400">选中值: {{ selectMoreValue }}</p>
      </div>
    </el-card>

    <!-- ==================== GloDictTag ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloDictTag 字典标签" />
      <div class="mt-4 flex gap-4">
        <span>在职:</span>
        <GloDictTag
          status="1"
          dict-name="status"
        />
        <span>离职:</span>
        <GloDictTag
          status="0"
          dict-name="status"
        />
        <span>男:</span>
        <GloDictTag
          status="1"
          dict-name="gender"
        />
        <span>女:</span>
        <GloDictTag
          status="0"
          dict-name="gender"
        />
      </div>
    </el-card>

    <!-- ==================== GloInfiniteScroll ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloInfiniteScroll 无限滚动" />
      <div
        class="mt-4"
        style="height: 200px"
      >
        <GloInfiniteScroll
          :request-api="fetchGrowthRecords"
          :page-size="5"
          :distance="20"
        >
          <template #item="{list}">
            <div
              v-for="(row, idx) in list"
              :key="idx"
              class="flex justify-between p-2 border-b border-gray-100"
            >
              <span>{{ getRowField(row, 'title') }}</span>
              <span class="text-gray-400">{{ getRowField(row, 'points') }}积分 - {{ getRowField(row, 'date') }}</span>
            </div>
          </template>
        </GloInfiniteScroll>
      </div>
    </el-card>

    <!-- ==================== GloPreview ==================== -->
    <el-card class="shadow-sm">
      <GloHeaderLabel label="GloPreview 预览" />
      <div class="mt-4">
        <GloPreview />
        <p class="text-sm text-gray-400">通过代码调用 open() 方法预览文件</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.gap-4 {
  gap: 1rem;
}
.p-4 {
  padding: 1rem;
}
.h-full {
  height: 100%;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.text-sm {
  font-size: 12px;
}
.text-gray-400 {
  color: #c0c4cc;
}
.border-b {
  border-bottom: 1px solid;
}
.border-gray-100 {
  border-color: #f4f4f5;
}
.p-2 {
  padding: 0.5rem;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
