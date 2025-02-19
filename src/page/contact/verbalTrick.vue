<template>
    <div class="Container">
<!--        快捷回复预览 OR 创建-->
        <QuickMsg :showQuickList="false" ref="quickRef" :fileArray="fileArray" :fileContent="fileContent" :msgName="msgName"/>

        <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="addQuickMsg">Add</a-button>

        <a-table bordered :data-source="data" :columns="columns">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'operation'">
                    <a @click="checkMsg(record)">查看</a>
                </template>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useTempStore} from "@/store/useTempStore";
import QuickMsg from "@/components/contact/QuickMsg.vue";

// 弹窗信息&控制
const quickRef = ref(null);
const fileArray = ref([]);
const fileContent = ref(null);
const msgName = ref(null);

const templateStore = useTempStore();

// table
interface DataItem {
    _id: string;
    title: string;
    content: string;
    owner_type: string;
    owner_id: string;
    createTime: string;
    attachments: object[];
}

const columns = [
    {
        title: '快捷消息',
        dataIndex: 'title',
        width: '30%',
    },
    {
        title: '消息內容',
        dataIndex: 'content',
    },
    {
        title: '創建時間',
        dataIndex: 'createTime',
    },
    {
        title: '預覽',
        dataIndex: 'operation',
    },
];
const data = ref<DataItem[]>([]);

// 预览 & 新增 方法
const checkMsg = (data) => {
    fileArray.value = data.attachments
    fileContent.value = data.content
    msgName.value = data.title
    quickRef.value.setOpen();
}

const addQuickMsg = () => {
    fileContent.value = "";
    fileArray.value = [];
    msgName.value = "";
    quickRef.value.setOpen();
}

onMounted(() => {
    data.value = templateStore.getQuickMsg;
})

</script>
<style lang="less" scoped>
.Container {
  padding: 20px;
}

.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
