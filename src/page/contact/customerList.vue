<template>
    <div class="Container">
<!--        彈窗-->
        <ContactModal ref="showContact" :isDelete="isDelete" :isCreate="isCreate" @createContact="createContact"
                      @updateContact="updateContact" :formData="formData"/>

        <a-modal v-model:open="showDelete" title="是否刪除以下用戶" @ok="deleteContact">
            <div v-for="item in deleteData">
                <p>
                    <UserOutlined/>
                    {{ item }}
                </p>
            </div>
        </a-modal>

<!--        聯繫人-table-->
        <div style="margin-bottom: 16px">
            <a-button type="primary" :loading="state.loading" @click="startCreate">
                創建聯繫人
            </a-button>

            <a-button v-if="isDelete" danger :loading="state.loading" style="margin-left: 10px" @click="setShowDelete">
                刪除聯繫人
            </a-button>
            <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `選擇了 ${state.selectedRowKeys.length} 個數據` }}
        </template>
      </span>
        </div>
        <div style="height: 680px">
        <a-table
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, getCheckboxProps: (record) => ({
      id: `checkbox-${record.key}`,
      name: `checkbox-${record.key}`
    })
  }"
                :columns="columns"
                :data-source="data"
                :scroll="{ x: 1500 }"
                :pagination="pagination"
        >
            <template #bodyCell="{ column, text, record }">
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

                <template v-if="column.dataIndex === 'createTime'">
                    <span>
                      {{ formatDate(record.createTime) }}
                    </span>
                </template>

                <template v-if="column.dataIndex === 'lastSeen'">
                    <span>
                      {{ record.lastSeen !== undefined ? formatDate(record.lastSeen) : '' }}
                    </span>
                </template>


                <template v-if="column.key === 'operation'">
                    <a @click="checkInfo(record)">編輯</a>
                </template>
            </template>
        </a-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue';
import * as ycloudApi from "@/api/ycloud/index.js";
import ContactModal from "@/components/contact/ContactModal.vue";
import {formatDate} from '@/tools'
import {UserOutlined} from '@ant-design/icons-vue';
import {useCustomerStore} from "@/store/customerStore.js";

type Key = string | number;
const formData = ref({});
const customerStore = useCustomerStore();

// 表格參數
const pagination = computed( () => {
    return {
        current: 1,
        pageSize: 10,
        total: customerStore.total,
        // showSizeChanger: true, // 显示每页条数切换器
        // pageSizeOptions: ['5', '10', '20', '50'], // 每页条数选项
        onChange: (page) => {
            showDelete.value = false;
            isDelete.value = false;
            state.selectedRowKeys = [];
            // 页码或每页条数变化时触发
            pagination.value.current = page;
            // pagination.value.pageSize = pageSize;
            // fetchData(page, pageSize); // 调用 API 获取数据
            customerStore.changeContactList(page);
        },
    }
});

const columns = [
    {
        key: 1,
        title: '名稱',
        dataIndex: 'nickname',
        fixed: 'left',
    },
    {
        key: 2,
        title: '聯繫客服',
        dataIndex: 'ownerEmail',
    },
    {
        key: 3,
        title: '標籤',
        dataIndex: 'tags',
    },
    {
        key: 4,
        title: '地區',
        dataIndex: 'countryName',
    },
    {
        key: 5,
        title: '電郵地址',
        dataIndex: 'email',
    },
    {
        key: 6,
        title: '手機號碼',
        dataIndex: 'phoneNumber',
        width: '10%'
    },
    {
        key: 7,
        title: '最近聯繫客服',
        dataIndex: 'lastMessageToPhoneNumber',
        width: '10%'
    },
    {
        key: 8,
        title: '建立時間',
        dataIndex: 'createTime',
        sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
        key: 9,
        title: '最近聯繫時間',
        dataIndex: 'lastSeen',
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right'
    },
];
// const data = ref<DataItem[]>([]);
const data = computed(() => customerStore.contactList)

// 按鈕狀態
const isCreate = ref(true);
const isDelete = ref(false);
const showDelete = ref(false);
const deleteData = ref([]);
const showContact = ref(null);
const hasSelected = computed(() => state.selectedRowKeys.length > 0);

// 選擇item
const state = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
}>({
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
});

// CheckBox選擇狀態改變
const onSelectChange = (selectedRowKeys: Key[]) => {
    state.selectedRowKeys = selectedRowKeys;
};

// 聯繫人操作(增、更新、刪)
const startCreate = () => {
    state.loading = true;
    isCreate.value = true;
    showContact.value.showModal();

    setTimeout(() => {
        state.loading = false;
        state.selectedRowKeys = [];
    }, 1000);
};
const createContact = async (value) => {
    let result = await ycloudApi.contactApi.createContact(value);
    if (result !== undefined) {
      setTimeout(() => {
          customerStore.contactOperate(isCreate.value, result)
      }, 1000)
    }
    showContact.value.showModal();
}

const updateContact = async (value) => {
    let result = await ycloudApi.contactApi.updateContact(value);
    if (result !== undefined) {
        customerStore.contactOperate(isCreate.value, result)
    }
    isCreate.value = false;
    showContact.value.showModal();
}

const setShowDelete = () => {
    deleteData.value = [];
    state.selectedRowKeys.map(item => {
        let index = data.value.findIndex(value => value.id === item)
        if (index !== -1) {
            deleteData.value.push(data.value[index].nickname)
        }
    })

    nextTick(() => {
        showDelete.value = true;
    })
}

const deleteContact = () => {
    state.selectedRowKeys.map(async item => {
        let result = await ycloudApi.contactApi.deleteContact(item);
    })
    nextTick(() => {
        showDelete.value = false;
        isDelete.value = false;
        state.selectedRowKeys = [];
        // customerStore.setContactList();
    })
}

// item點擊事件
const checkInfo = (data) => {
    isCreate.value = false;
    formData.value = {...data};
    state.loading = true;
    nextTick(() => {
        showContact.value.showModal();
        state.loading = false;

    })
}

watch(() => state.selectedRowKeys, (newValue) => {
    isDelete.value = newValue.length > 0;
})

onMounted(() => {
    // updateContactList();
})

</script>

<style scoped>
.Container {
    padding: 20px;
}
:deep(.ant-table-content) {
    height: 650px;
}
</style>
