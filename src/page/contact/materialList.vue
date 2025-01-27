<template>
    <div class="Container">

        <div class="Table">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="图片">
                    <FileList />
                </a-tab-pane>
                <a-tab-pane key="2" tab="文档" force-render>Content of Tab Pane 2</a-tab-pane>
                <a-tab-pane key="3" tab="视频">Content of Tab Pane 3</a-tab-pane>
                <a-tab-pane key="4" tab="私人"></a-tab-pane>
            </a-tabs>
        </div>

    </div>
</template>

<script setup>
import {ref, computed, onMounted, h, render} from "vue";
import { List, Card } from 'ant-design-vue';
import FileList from "@/components/contact/FileList.vue";
const { Item: ListItem } = List;
const { Meta: CardMeta } = Card;
const activeKey = ref('1');


</script>

<style scoped>
/* 适当调整图片尺寸，确保展示美观 */
.ant-list-grid .ant-col {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 图片样式 */
img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

img:hover {
    transform: scale(1.05);
}
.Container {
    padding: 20px;

}
.Table {
    background-color: #ffffff;
    padding: 10px;
    border-radius: 10px;
}
</style>
