<template>
    <div>
        <a-modal v-model:open="open" width="600px" centered title="选择素材" @ok="handleOk" :footer="false">
            <a-table :columns="columns" :data-source="fileList" :pagination="{ pageSize: 5 }">
                <template #bodyCell="{ column, record  }">
                    <template v-if="column.key === 'path'">
<!--                        {{ 'https://cos.jackycode.cn/'+ record.file_path}}-->
                        <a-image v-if="type === 'image'" :src="'https://cos.jackycode.cn/' + record.file_path" />

                        <a :href="'https://cos.jackycode.cn/' + record.file_path"
                           v-else-if="props.type === 'document'"
                           download
                           target="_blank"
                           style="display: flex; justify-content: center; font-size: 50px;width: 100px;padding: 15px; border-width: 1px; border-style: solid; border-radius: 10px; border-color: #0e0e0e0e;">
                            <FileOutlined style="color: #DCDCDC; cursor: pointer;"/>
                        </a>

                        <video v-else-if="type === 'video'" ref="videoPlayer" width="100%"
                               controls class="mt-2">
                            <source :src="'https://cos.jackycode.cn/' + record.file_path" type="video/mp4">
                        </video>
                    </template>

                    <template v-if="column.key === 'operation'">
                        <a @click="clickFile(record)">选择</a>
                    </template>
                </template>
            </a-table>
            <a-button @click="selectOthers" type="primary" > 选择电脑文件 </a-button>
            <input :accept="selectType" type="file" style="display: none" ref="startSelect" @change="selectOtherFile"/>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {defineEmits, ref, watch} from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import {useTempStore} from "@/store/useTempStore.js";
import {FileOutlined} from "@ant-design/icons-vue";
const open = ref<boolean>(false);

const tempStore = useTempStore();
const emits = defineEmits(['getSelected'])
const props = defineProps({
    type: {
        type: String,
        default: ""
    },
    account: {
        type: String,
        default: ""
    }
})
let type = ref(props.type);
let fileList = ref([]);
let startSelect = ref(null);
let selectType = ref("*/*");

watch([() => props.type, () => props.account], (newValue) => {
    if(newValue[0] === '') {
        newValue[0] = props.type
    }
    switch (newValue[0]) {
        case 'image':
            fileList.value = tempStore.imageList;
            selectType.value = 'image/*';
            break;
        case 'document':
            fileList.value = tempStore.docList;
            selectType.value = '.pdf';
            break;
        case 'video':
            fileList.value = tempStore.videoList;
            selectType.value = 'video/*';
            break;
    }
    console.log("fileListfileList", fileList.value)
    type.value = newValue[0];
}, {deep: true})



const columns: TableColumnsType = [
    { title: '素材', width: 100, dataIndex: 'path', key: 'path', fixed: 'left' },
    { title: '名稱', width: 100, dataIndex: 'fileName', key: 'fileName', fixed: 'left' },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
    },
];

interface DataItem {
    key: number;
    path: string;
    fileName: number;
}

const selectOthers = () => {
    startSelect.value?.click();
}

// const data: DataItem[] = [];
// for (let i = 0; i < 100; i++) {
//     data.push({
//         key: i,
//         name: `Edrward ${i}`,
//         age: 32,
//         address: `London Park no. ${i}`,
//     });
// }

// 選中已有素材
const clickFile = (value) => {
    emits("getSelected", value);
    showModal();
}

// 選中電腦其他文件
const selectOtherFile = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    let fileContent = files[0];


//     上傳到臨時文件夾
    let data = new FormData();
    data.append("file", fileContent);
    data.append("fileCategory", props.type);
    data.append("userId", '67890');

    try {
        await fetch('http://localhost:3001/materials/upload-material', {
            method: 'POST',
            body: data
        }).then(res => res.json())  // 先解析 JSON
            .then(({code, message, result}) => {
                // console.log("code, message, result", code, message, result);
                let newFile = {
                    key: result?._id || '1',
                    fileName: result?.file_name || fileContent.name,
                    file_path: result?.file_path ? result.file_path : '',
                    file_type: type.value
                };

                if (code === 200) {
                    emits("getSelected", newFile);
                }

            }).catch(error => {
                console.error("请求失败:", error);
            });
    } catch (error) {
        console.error('上传过程中发生错误:', error);
    }
}

const showModal = () => {
    open.value = !open.value
};

defineExpose({
    showModal: () => {
        showModal();
    }
})

const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
};
</script>

