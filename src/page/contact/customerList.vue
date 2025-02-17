<template>
  <div class="Container">
    <ContactModal  ref="showContact" @createContact="createContact" :formData="formData"/>
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
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, getCheckboxProps: (record) => ({
      id: `checkbox-${record.key}`,
      name: `checkbox-${record.key}`
    })
  }"
        :columns="columns"
        :data-source="data"

        :pagination="{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'] }"
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


        <template v-if="column.key === 'operation'">
          <a @click="checkInfo(record)">編輯</a>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue';
import * as ycloudApi from "@/api/ycloud/index.js";
import ContactModal from "@/components/contact/ContactModal.vue";

type Key = string | number;

const formData = reactive({
    nickname: '',
    countryCode: undefined,
    phoneNumber: '',
    email: '',
});

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

const columns = [
  {
    key: 1,
    title: 'Name',
    dataIndex: 'nickname',
    fixed: 'left',
  },
  {
    key: 2,
    title: 'Owner',
    dataIndex: 'ownerEmail',
  },
  {
    key: 3,
    title: 'Tag',
    dataIndex: 'tags',
  },
  {
    key: 4,
    title: 'Country',
    dataIndex: 'countryName',
  },
  {
    key: 5,
    title: 'Email',
    dataIndex: 'email',
  },
  {
    key: 6,
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
  },
  {
    key: 7,
    title: 'Last connected number',
    dataIndex: 'lastMessageToPhoneNumber',
  },
  {
    key: 8,
    title: 'Create Time',
    dataIndex: 'createTime',
    sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
  },
  {
    key: 9,
    title: 'Last contacted',
    dataIndex: 'lastSeen',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right'
  },
];

const data = ref<DataItem[]>([]);
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const hasSelected = computed(() => state.selectedRowKeys.length > 0);
const showContact = ref(null);

const start = () => {
  state.loading = true;
  showContact.value.showModal();

  setTimeout(() => {
    state.loading = false;
    state.selectedRowKeys = [];
  }, 1000);
};
const onSelectChange = (selectedRowKeys: Key[]) => {
  state.selectedRowKeys = selectedRowKeys;
};

const createContact = async (data) => {
    let result = await ycloudApi.contactApi.createContact(data);
    if(result !== undefined) {
        updateContactList();
    }
}

const updateContactList = async () => {
    let response = await ycloudApi.contactApi.getContactList();
    response.items.map(item => {
        // item.tags = ['test1', 'test2'];
        item.key = item.id;
        data.value.push(item);
    });
}

const checkInfo = (data) => {
    formData.value = {...data};
    state.loading = true;
    showContact.value.showModal();
}


onMounted( () => {
  updateContactList();
})

</script>

<style scoped>
.Container {
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
