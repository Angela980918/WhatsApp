<template>
  <div class="tempContainer">
    <div class="Common tempSearch">
      <WASelect direction="vertical" title="賬號" type="select-common" :select-item="selectAccount"
                :options="accounts" @handleChange="accountChange"/>

      <WASelect direction="vertical" title="搜索" type="search" :search-contents="searchContents"
                @handleChange="nameChange"/>

      <WASelect direction="vertical" title="類別" type="select-multiple" :select-item="selectCategory"
                :options="allCategory" @handleChange="categoryChange"/>

      <WASelect direction="vertical" title="語言" type="select-multiple" :select-item="selectLanguage"
                :options="allLanguage" @handleChange="langChange"/>

      <WASelect direction="vertical" title="狀態" type="select-multiple" :select-item="selectStatus"
                :options="tempStatus" @handleChange="statusChange"/>

    </div>

    <div class="Common">
      <div style="margin-bottom: 12px;padding: 0 12px">
        <a-space>
          <a-button type="primary" @click="createTemplate" :disabled="isButtonDisabled">
            創建模板
          </a-button>

          <a-button type="primary" danger @click="createTemplate">
            刪除
          </a-button>
        </a-space>
      </div>
      <a-table
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="filterData"
          class="tempList"
          :pagination="{ pageSize: 5, showSizeChanger: false }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 2">
            {{ getCategoryLabel(record.category) }}
          </template>
          <template v-if="column.key === 3">
            {{ getLangLabel(record.language) }}
          </template>
          <template v-if="column.key === 4">
            <a-tooltip :title="record.status === 'REJECTED'? getErrorLabel(record.reason):''" color="red">
              <a-tag
                  :color="record.status === 'APPROVED' ? 'success' : record.status === 'REJECTED' ? 'error' : 'default'">
                <template #icon>
                  <component :is="getTagIcon(record.status)"/>
                </template>
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </a-tooltip>
          </template>
          <template v-if="column.key === 5">
            <span>{{ formatDate(record.updateTime) }}</span>
          </template>

          <template v-if="column.key === 'operation'">
            <a-dropdown>
              <a-button>操作</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer"
                       @click="onPreview(record.key)">
                      預覽
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer"
                       @click="onEdit(record.key)">
                      編輯
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" @click="onDelete(record.key)">
                      刪除
                    </a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onBeforeMount, reactive, ref} from 'vue';
import WASelect from "@/components/templates/WASelect.vue";
import {useRouter} from "vue-router";
import {useTempStore} from '@/store/useTempStore'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import {SelectProps} from "ant-design-vue";
import {categoryMap, languageMap, statusMap} from '@/map/template';
import {errorMap} from '@/map/error';
import {getLabel} from '@/tools/common'

const router = useRouter();

// icon、顔色變化
const getTagColor = (status) => {
  if (status === 'APPROVED') return 'success';
  if (status === 'REJECTED') return 'error';
  return 'default';
}
const getTagIcon = (status) => {
  const icons = {
    APPROVED: CheckCircleOutlined,
    REJECTED: CloseCircleOutlined,
    PENDING: ExclamationCircleOutlined,
    IN_PROGRESS: SyncOutlined,
    WAITING: ClockCircleOutlined,
  };
  return icons[status] || MinusCircleOutlined;
};

type Key = string | number;

interface DataType {
  key: Key;
  name: string;
  age: number;
  address: string;
}

const columns = [
  {
    key: 1,
    title: '模板名稱',
    dataIndex: 'name',
    fixed: 'left',
  },
  {
    key: 2,
    title: '類別',
    dataIndex: 'category',
  },
  {
    key: 3,
    title: '語言',
    dataIndex: 'language',
  },
  {
    key: 4,
    title: '狀態',
    dataIndex: 'status',
  },
  {
    key: 5,
    title: '最近更新',
    dataIndex: 'updateTime',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right'
  },
];

// 原始数据
const data = computed(() => {
  return TempStore.tempData
})

// 表格显示数据
const filterData = ref([]);

// 模板数据
const TempStore = useTempStore()

// 賬號選擇
const selectAccount = ref([]);
const accounts = ref([]);

// 搜索欄
const searchContents = ref('');

// 種類
const selectCategory = ref([]);
const allCategory = ref<SelectProps['options']>(categoryMap);

// 語言
const selectLanguage = ref([]);
const allLanguage = ref<SelectProps['options']>(languageMap);

// 狀態
const selectStatus = ref([]);
const tempStatus = ref<SelectProps['options']>(statusMap);


const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [],
  loading: false,
});

const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};

const isButtonDisabled = computed(() => state.selectedRowKeys.length !== 0);

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');  // 月份从0开始，+1确保月份正确
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const createTemplate = () => {

  console.log("searchContents", searchContents.value)
}

const accountChange = (value) => {

}

const nameChange = (value) => {
  searchContents.value = value;
  dataFilter();
}

// 更新選擇
const updateSelection = (value, allItems, selectArray) => {
  selectArray.value = allItems.filter(item => value.includes(item.value));
  dataFilter();
};

const categoryChange = (value) => {
  updateSelection(value, allCategory.value, selectCategory);
};

const langChange = (value) => {
  updateSelection(value, allLanguage.value, selectLanguage);
};

const statusChange = (value) => {
  updateSelection(value, tempStatus.value, selectStatus);
};

// 数据过滤
const dataFilter = () => {
  const {value: searchValue} = searchContents;
  const {value: categoryValues} = selectCategory;
  const {value: languageValues} = selectLanguage;
  const {value: statusValues} = selectStatus;

  filterData.value = data.value.filter(item => {
    return (
        (!searchValue || item.name.includes(searchValue)) &&
        (categoryValues.length === 0 || categoryValues.some(c => c.value === item.category)) &&
        (languageValues.length === 0 || languageValues.some(l => l.value === item.language)) &&
        (statusValues.length === 0 || statusValues.some(s => s.value === item.status))
    );
  });
};

// label映射
const getStatusLabel = (status) => getLabel(statusMap, status)
const getCategoryLabel = (category) => getLabel(categoryMap, category)
const getLangLabel = (lang) => getLabel(languageMap, lang)
const getErrorLabel = (error) => getLabel(errorMap, error)

onBeforeMount(async () => {
  await TempStore.loadTemplates()
  dataFilter();
})

// 编辑模板 | 路由跳转
const onPreview = (index) => {
  // console.log('onPreview', data.value[index])
  TempStore.setTemplateData(data.value[index])
  router.push({
    name: 'createTemp2',
  })
}

// 编辑模板 | 路由跳转
const onEdit = (index) => {
  TempStore.setTemplateData(data.value[index])
  router.push({
    name: 'createTemp2',
  })
}

// 删除模板
const onDelete = (index) => {
  console.log('onDelete', data.value[index])
}

</script>

<style scoped>
.Common {
  padding: 20px;
}

.tempSearch {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.tempList {
  padding: 0 12px;
}

</style>
