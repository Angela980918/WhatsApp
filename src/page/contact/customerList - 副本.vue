<template>
  <div class="Container">
    <div style="margin-bottom: 16px">
      <a-button type="primary" :loading="state.loading" @click="start">
        创建用户
      </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${state.selectedRowKeys.length} items` }}
        </template>
      </span>
    </div>
    <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 'max-content' }"
        :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'tags'">
          <span>
            <a-tag
                v-for="tag in record.tags"
                :key="tag"
                :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>

        <template v-if="column.key === 4">
          {{ getCountryLabel(record.countryCode) }}
        </template>

        <template v-if="column.key === 'operation'">
          <a @click="showDrawer(record)">詳情</a>
        </template>
      </template>
    </a-table>

    <!-- Drawer 组件 -->
    <contact-drawer
        :visible="drawerVisible"
        :currentRecord="currentRecord"
        @close="onClose"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue';
import * as ycloudApi from '../../api/ycloud/index.js';
import {getCountryLabel} from '@/map/index.js';
import ContactDrawer from "@/components/contact/ContactDrawer.vue";

type Key = string | number;

interface DataItem {
  key: number;
  id: string;
  nickname: string;
  ownerEmail: string;
  tags: string[];
  countryCode: string;
  countryName: string;
  email: string;
  phoneNumber: string;
  lastMessageToPhoneNumber: string;
  createTime: string;
  lastSeen: string;
}

// 表格列配置
const columns = [
  {key: 1, title: '昵稱', dataIndex: 'nickname', fixed: 'left'},
  {key: 2, title: '歸屬郵箱', dataIndex: 'ownerEmail'},
  {key: 3, title: '會話標簽', dataIndex: 'tags'},
  {key: 4, title: '國家/地區', dataIndex: 'countryCode'},
  {key: 5, title: '電子郵件', dataIndex: 'email'},
  {key: 6, title: '電話號碼', dataIndex: 'phoneNumber'},
  {key: 7, title: '最近聯絡電話', dataIndex: 'lastMessageToPhoneNumber'},
  {
    key: 8,
    title: '創建時間',
    dataIndex: 'createTime',
    sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime)
  },
  {key: 9, title: '最后聯絡時間', dataIndex: 'lastSeen'},
  {title: '操作', key: 'operation', fixed: 'right'},
];

// 表格数据
const data = ref<DataItem[]>([]);

// 表格状态
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false,
});

// 分页配置
const pagination = {
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20', '50'],
};

// 是否选中
const hasSelected = computed(() => state.selectedRowKeys.length > 0);

// 处理行选择变化
const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};

// 行选择配置
const rowSelection = {
  selectedRowKeys: state.selectedRowKeys,
  onChange: onSelectChange,
  getCheckboxProps: (record: DataItem) => ({
    id: `checkbox-${record.key}`,
    name: `checkbox-${record.key}`,
  }),
};

// Drawer 状态
const drawerVisible = ref(false);
const currentRecord = ref<DataItem | null>(null);

// 打开 Drawer
const showDrawer = (record: DataItem) => {
  currentRecord.value = record;
  drawerVisible.value = true;
};

// 关闭 Drawer
const onClose = () => {
  drawerVisible.value = false;
};

// 创建用户
const start = () => {
  state.loading = true;
  setTimeout(() => {
    state.loading = false;
    state.selectedRowKeys = [];
  }, 1000);
};

// 获取数据
onMounted(async () => {
  const response = await ycloudApi.contactApi.getContactList();
  data.value = response.items.map((item) => ({
    ...item,
    key: item.id,
  }));
});
</script>

<style scoped>
.Container {
  padding: 20px;
}
</style>