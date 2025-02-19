<template>
    <div class="Container">

        <div class="Table">
            <div style="display: flex; justify-content: space-between">
<!--                公共素材库 OR 个人素材库-->
                <a-select
                    v-model:value="selectValue"
                    :size="size"
                    style="width: 200px"
                    :options="options"
                ></a-select>

                <a-dropdown >
                    <template #overlay>
                        <a-menu @click="handleMenuClick">
                            <a-menu-item key="1">上傳圖片</a-menu-item>
                            <a-menu-item key="2">上傳附件</a-menu-item>
                            <a-menu-item key="3">上傳視頻</a-menu-item>
                        </a-menu>
                    </template>
                    <a-button  style="background-color: #108ee9; color: #ffffff">
                        上傳素材
                        <DownOutlined />
                    </a-button>
                </a-dropdown>
                <input id="upload"
                       :accept="fileType"
                       ref="fileInput" style="display: none" type="file" @change="uploadFile" />
            </div>

<!--            素材tab-->
            <a-tabs v-model:activeKey="activeKey">
                <template #leftExtra>
                    <a-button @click="toggleSelectMode" class="tabs-extra-demo-button">{{ isSelecting ? "取消选择" : "选择" }}</a-button>
                    <a-button
                        v-if="isSelecting"
                        type="primary"
                        danger
                        class="tabs-extra-demo-button"
                        @click="removeItem"
                        style="margin-left: 10px;">
                        删除
                    </a-button>
                </template>
                <a-tab-pane key="1" tab="图片">
                    <FileList ref="imgRef" :selectAble="isSelecting" type="image" :fileList="imageList"/>
                </a-tab-pane>
                <a-tab-pane key="2" tab="文档" force-render>
                    <FileList ref="docRef" :selectAble="isSelecting" type="document" :fileList="docList" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="视频" force-render>
                    <FileList ref="videoRef" :selectAble="isSelecting" type="video" :fileList="videoList" />
                </a-tab-pane>
            </a-tabs>
        </div>

    </div>
</template>

<script lang="ts" setup>
import {ref, watch, nextTick, computed} from "vue";
import {List, Card} from 'ant-design-vue';
import FileList from "@/components/contact/FileList.vue";
import {cosApi} from "@/api/whatsapp/index.js";
import { SelectProps, MenuProps } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import {useTempStore} from "@/store/useTempStore.js";
const { Item: ListItem } = List;
const { Meta: CardMeta } = Card;

const tempStore = useTempStore();

// 素材庫選擇
const size = ref<SelectProps['size']>('middle');
const options = ref([
    { value: '449711484896804', label: 'DataS素材库' },
    { value: '67890', label: '个人素材库' },
]);
const selectValue = ref(options.value[0].value);

//  素材 tab 頁面
const activeKey = ref('1');
const imgRef = ref(null);
const docRef = ref(null);
const videoRef = ref(null);
let imageList  = computed(() => tempStore.imageList);
let docList = computed(() => tempStore.docList)
let videoList = computed(() => tempStore.videoList);

// 上傳
const fileInput = ref<HTMLInputElement | null>(null);
const fileType = ref("");
const type = ref("");

// 选择
const isSelecting = ref(false);

const toggleSelectMode = () => {
    isSelecting.value = !isSelecting.value;
};

// 刪除
const removeItem = async () => {
    let list = [];
    let selectList = [];
    let data = {};
    switch (activeKey.value) {
        case "1":
            list = imgRef.value.getRemoveItem() ;
            list.map((item) => {
                selectList.push(item.id)
            })
            tempStore.imageList = imageList.value.filter(item =>
                !list.some(removedItem => removedItem.title === item.file_name)
            );
            break;
        case "2":
            list = docRef.value.getRemoveItem();
            tempStore.docList = docList.value.filter(item =>
                !list.some(removedItem => removedItem.title === item.file_name)
            );
            break;
        case "3":
            list = videoRef.value.getRemoveItem();
            tempStore.videoList = videoList.value.filter(item =>
                !list.some(removedItem => removedItem.title === item.file_name)
            );
            break;
    }
}

// 私人和公共素材切换
watch(() => selectValue.value, (newValue) => {
    checkCos();
    isSelecting.value = false;
})

// 上傳按鈕
const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
        case "1":
            type.value = "image";
            fileType.value = "image/jpeg,image/png";
            break;
        case "2":
            type.value = "document";
            fileType.value = "application/*";
            break;
        case "3":
            type.value = "video";
            fileType.value = "video/mp4";
            break;
    }

    nextTick(() => {
        fileInput.value?.click();
    });
};

// 触发上传素材
const uploadFile = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    let fileContent = files[0];

    let result = await cosApi.uploadMaterial(fileContent, type.value, selectValue.value)

    await checkCos();
};

// 检索素材库
async function checkCos() {
    let source = "";
    if(!selectValue.value.length > 6) {
        source = "wabaId=" + selectValue.value;
    }else {
        source = "userId=" + selectValue.value;
    }
    tempStore.setMaterialListData(source);

}

</script>

<style scoped>
.ant-list-grid .ant-col {
    display: flex;
    justify-content: center;
    align-items: center;
}


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
.tabs-extra-demo-button {
    margin-right: 16px;
}
</style>
