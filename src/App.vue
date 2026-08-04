<script setup lang="ts">
import GloTable, {type GloTableColumn, type GloTableConfig} from './packages/components/GloTable';
import GloDialog, {type GloDialogExpose} from './packages/components/GloDialog';
import {ref, reactive} from 'vue';
import axios from 'axios';

const gloDialogRef = ref<GloDialogExpose>();
function openDialog() {
  gloDialogRef.value?.open();
}

// 表单引用
const formRef = ref();

// 查询表单数据
const queryForm = reactive({
  name: '',
  department: '',
  status: ''
});

const tableColumn: GloTableColumn[] = [
  {
    prop: 'id',
    label: 'ID',
    width: 80,
    align: 'center'
  },
  {
    prop: 'name',
    label: '姓名',
    minWidth: 120
  },
  {
    prop: 'age',
    label: '年龄',
    width: 100,
    align: 'center'
  },
  {
    prop: 'gender',
    label: '性别',
    width: 100,
    align: 'center',
    dictName: 'gender' // 字典翻译
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 200
  },
  {
    prop: 'phone',
    label: '电话',
    width: 150
  },
  {
    prop: 'department',
    label: '部门',
    minWidth: 150
  },
  {
    prop: 'position',
    label: '职位',
    minWidth: 150
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    dictName: 'status' // 字典翻译
  },
  {
    prop: 'joinDate',
    label: '入职日期',
    width: 180
  }
];

// 创建请求函数（使用 axios）
const fetchTableData = async (params: {current: number; size: number; name?: string; department?: string; status?: string}) => {
  const response = await axios.post('/api/table/list', params);
  return response.data;
};

// 配置表格使用远程数据
const tableConfig: GloTableConfig = {
  local: false, // 使用远程数据模式
  showPagination: true, // 显示分页
  rowKey: 'id',
  emptyStr: '-',
  req: fetchTableData, // 请求函数
  initStart: true, // 初始化时自动请求
  pagination: true, // 启用分页
  size: 20, // 每页条数
  formRef: formRef, // 表单引用
  formData: queryForm // 表单数据
};

// 搜索
async function handleSearch() {
  await formRef.value?.validate();
  // 触发表格查询
  tableRef.value?.search(queryForm);
}

// 重置
function handleReset() {
  formRef.value?.resetFields();
  // 触发表格重置
  tableRef.value?.resetQuery();
}

// 表格引用
const tableRef = ref();
</script>

<template>
  <div class="flex flex-col gap-4 p-4 h-full">
    <!-- 查询表单 -->
    <el-card class="shadow-sm">
      <el-form
        ref="formRef"
        :model="queryForm"
        label-width="80px"
        class="flex flex-wrap gap-4"
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
              label="技术部"
              value="技术部"
            />
            <el-option
              label="产品部"
              value="产品部"
            />
            <el-option
              label="设计部"
              value="设计部"
            />
            <el-option
              label="市场部"
              value="市场部"
            />
            <el-option
              label="运营部"
              value="运营部"
            />
            <el-option
              label="人事部"
              value="人事部"
            />
            <el-option
              label="财务部"
              value="财务部"
            />
            <el-option
              label="行政部"
              value="行政部"
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
    </el-card>

    <!-- 数据表格 -->
    <el-card class="flex-1 shadow-sm">
      <GloTable
        ref="tableRef"
        :table-column="tableColumn"
        :table-config="tableConfig"
      />
    </el-card>

    <!-- 测试弹窗 -->
    <GloDialog
      ref="gloDialogRef"
      title="测试"
    />
    <el-button
      type="primary"
      @click="openDialog"
    >
      打开弹窗
    </el-button>
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
.flex-1 {
  flex: 1;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
