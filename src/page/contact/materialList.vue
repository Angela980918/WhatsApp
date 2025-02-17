<template>
    <div class="Container">

        <div class="Table">
            <div style="display: flex; justify-content: space-between">
<!--                公共素材库 OR 个人素材库-->
                <a-select
                    v-model:value="value1"
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
import {ref, onBeforeMount, watch, nextTick, computed} from "vue";
import {List, Card, message} from 'ant-design-vue';
import FileList from "@/components/contact/FileList.vue";
import {cosApi} from "@/api/whatsapp/index.js";
import { SelectProps, MenuProps } from 'ant-design-vue';
import {
    DownOutlined
} from '@ant-design/icons-vue';
import {useTempStore} from "@/store/useTempStore.js";
const { Item: ListItem } = List;
const { Meta: CardMeta } = Card;
const activeKey = ref('1');

const tempStore = useTempStore();

const size = ref<SelectProps['size']>('middle');

// 素材庫類型
const options = ref([
    { value: '449711484896804', label: 'DataS素材库' },
    { value: 'user-67890', label: '个人素材库' },
]);
const value1 = ref(options.value[0].value);

const imgRef = ref(null);
const docRef = ref(null);
const videoRef = ref(null);

// 上傳
const fileInput = ref<HTMLInputElement | null>(null);
const fileType = ref("");
const type = ref("");

// 素材列表
let imageList  = computed(() => tempStore.imageList);
let docList = computed(() => tempStore.docList)
let videoList = computed(() => tempStore.videoList);
console.log("imageList",imageList.value)
console.log("docList",docList.value)
console.log("videoList",videoList.value)

// 选择
const isSelecting = ref(false); // 是否进入选择模式
const toggleSelectMode = () => {
    isSelecting.value = !isSelecting.value;
};
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
            data = {
                userId: value1.value,
                userType: value1.value.startsWith('user-') ? 'user' : 'waba',
                materialIds: selectList
            }
            let { result, code, message } = await cosApi.deleteMaterial(data)
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

onBeforeMount(async () => {
    // await checkCos();
})

// 私人和公共素材切换
watch(() => value1.value, (newValue) => {
    checkCos();
    isSelecting.value = false;
})

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

    let result = await cosApi.uploadMaterial(fileContent, type.value, value1.value)
    console.log("resultresult",result)

    await checkCos();
};

// 检索素材库
async function checkCos() {
    let source = "";
    if(!value1.value.startsWith('user-')) {
        source = "wabaId=" + value1.value;
    }else {
        source = "userId=" + value1.value;
    }
    tempStore.setMaterialListData(source);

}

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
.tabs-extra-demo-button {
    margin-right: 16px;
}
</style>
