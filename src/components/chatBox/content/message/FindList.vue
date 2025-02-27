<template>
    <div class="fixed-list-container">
        <a-list
                :grid="{ gutter: 5, column: 3 }"
                :data-source="paginatedData"
                :pagination="paginationConfig"
                :loading="loading"
        >
            <template #renderItem="{ item }">
                <a-list-item style="display: flex;flex-direction: column; " :key="item.id">

                    <a-image v-if="props.type === 'image'"  :src="item.link"/>

                    <a :href="item.link"
                       v-else-if="props.type === 'document'"
                       download
                       target="_blank"
                       style="display: flex; justify-content: center; font-size: 50px;width: 100px;padding: 15px; border-width: 1px; border-style: solid; border-radius: 10px; border-color: #0e0e0e0e;">
                        <FileOutlined style="color: #DCDCDC; cursor: pointer;"/>
                    </a>

                    <span class="item-title">{{ getFileName(item.link) }}</span>
                </a-list-item>
            </template>
        </a-list>

<!--        <a-pagination-->
<!--            v-model:current="paginationConfig.current"-->
<!--            v-model:pageSize="paginationConfig.pageSize"-->
<!--            :total="paginationConfig.total"-->
<!--            style="padding: 16px; background: white;"-->
<!--            show-less-items-->
<!--        />-->
    </div>
</template>

<script lang="ts" setup>
import {ref, reactive, watch, computed} from "vue";
import {FileOutlined} from "@ant-design/icons-vue";
import {useChatStore} from "@/store/chatStore";

const chatStore = useChatStore();
const props = defineProps({
    type: {
        type: String,
        default: ""
    },
})

const data = reactive({
    list: [],
});

const isSelect = ref(false);

// 分页配置
const paginationConfig = ref({
    current: 1,
    pageSize: 9,
    total: data.list.length,
    showSizeChanger: false,
    showQuickJumper: true,
    onChange: (page) => {
        paginationConfig.value.current = page;
    },
});

// 计算当前分页数据
const paginatedData = computed(() => {
    const { current, pageSize } = paginationConfig.value;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    return data.list.slice(start, end);
});
const loading = ref(false);

watch(() => chatStore.chatMessages, (newValue) => {
    data.list = [];
    // let test = "";
    newValue.forEach(item => {
        if (item.type === props.type) {
            // test = item.content.link
            data.list.push({ link: item.content.link });
            // let index = 0;
            // for(index; index <= 10; index++) {
            //     data.list.push({ link: test });
            // }
        } else if (item.type === 'template' && item.content.header?.format.toLowerCase() === props.type) {
            // test = item.content.header.content;
            data.list.push({ link: item.content.header.content });
            // let index = 0;
            // for(index; index <= 10; index++) {
            //     data.list.push({ link: test });
            // }
        }
    });
    // console.log("test",data.list)
    // 更新分页总数
    paginationConfig.value.total = data.list.length;
}, {immediate: true})

const getFileName = (url) => {
    const filename = url.split('/').pop();
    const fileExtension = filename.split('.');
    return fileExtension[0];
}

</script>

<style scoped>
.item-title {
    display: block;
    width: 100%; /* 使标题适应父容器宽度 */
    white-space: nowrap; /* 防止换行 */
    overflow: hidden; /* 隐藏溢出部分 */
    text-overflow: ellipsis; /* 超过宽度显示省略号 */
    font-size: 14px; /* 根据需求设置字体大小 */
    text-align: center; /* 可选，确保居中显示 */
}

/* 分页定位 */
.fixed-list-container {
  height: 500px;
}
:deep(.ant-spin-container) {
    height: 350px;
}



</style>
