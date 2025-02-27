<template>
    <div>
        <a-modal v-model:open="open" :title="props.msgName !== '' ? props.msgName : '快捷回復'"
                 style="justify-items: center" @ok="handleOk" :width="1000">
            <div class="flex-container">
                <!--                显示可选快捷信息列表-->
                <a-table v-show="showQuickList" class="ant-table-striped" :columns="columns" :pagination="pagination"
                         :customRow="handleRowClick" rowKey="_id" :row-class-name="setRowClassName"
                         :data-source="quickList" style="min-width: 600px">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'operation'">
                            <span>
                                 <a-button @click="confirm(record)" type="primary">发送</a-button>
                            </span>
                        </template>
                    </template>
                </a-table>

                <!--                显示可编辑或可新增内容-->
                <div style="min-width: 600px; display: flex; flex-direction: column; padding: 10px"
                     v-show="!showQuickList">
                    <!--                   快捷回復標題 -->
                    <div style="display: flex;flex-direction: column; ">
                        <span style="font-size: 18px">標題</span>
                        <div style="padding: 12px 0; margin-top: 10px; max-width: 400px">
                            <a-input
                                    name="headerInput"
                                    v-model:value="headerTxt"
                                    show-count
                            />
                        </div>
                    </div>

                    <!--                   选择公共库还是个人账号 -->
                    <div style="display: flex;flex-direction: column; ">
                        <span style="font-size: 18px">賬號</span>
                        <div style="padding: 12px 0; margin-top: 10px; max-width: 400px">
                            <a-select
                                    v-model:value="value1"
                                    style="width: 200px"
                                    :options="options"
                                    @change="changeOptions"
                            ></a-select>
                        </div>
                    </div>

                    <!--                   快捷回復文件 -->
                    <div style="display: flex;flex-direction: column; margin-top: 10px">
                        <span style="font-size: 18px">选择素材</span>
                        <div style="display: flex; flex-direction: row">
                            <a-button @click="btnUpload('image')" style="margin-right: 12px">
                                <upload-outlined></upload-outlined>
                                上傳圖片
                            </a-button>
                            <a-button @click="btnUpload('document')" style="margin: 0 12px">
                                <upload-outlined></upload-outlined>
                                上傳文檔
                            </a-button>
                            <a-button @click="btnUpload('video')" style="margin: 0 12px">
                                <upload-outlined></upload-outlined>
                                上傳視頻
                            </a-button>
                        </div>
                    </div>
                    <!--                   快捷回復內容 -->
                    <div style="display: flex;flex-direction: column; margin-top: 10px">
                        <span style="font-size: 18px">編輯內容</span>
                        <div style="border: 1px solid #ccc; width: 100%; max-width: 100%; box-sizing: border-box;">
                            <Toolbar
                                    style="border-bottom: 1px solid #ccc"
                                    :editor="editorRef"
                                    :defaultConfig="toolbarConfig"
                                    mode="default"
                            />
                            <Editor
                                    style="height: 300px;overflow-y: hidden;width: 100%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;white-space: pre-wrap;box-sizing: border-box"
                                    v-model="selectContent"
                                    :defaultConfig="editorConfig"
                                    mode="default"
                                    @onCreated="handleCreated"
                            />
                        </div>
                    </div>
                </div>

                <!--                预览消息效果-->
                <div class="phoneBox">
                    <div class="phone">
                        <div class="phoneTop"/>
                        <div class="phoneCenter" style="max-height: 500px; overflow-y: auto;">
                            <div v-if="selectFileArr.length > 1" v-for="item in selectFileArr">
                                <div class="arrow"/>
                                <div class="content">
                                    <div class="mediaCenter">
                                        <div v-if="item.file_type  === 'image'">
                                            <a-flex justify="center" align="center"
                                                    style="width: 100%; height: 130px">
                                                <a-image height="100%" width="100%"
                                                         :src="`https://cos.jackycode.cn/${item.file_path}`"></a-image>
                                            </a-flex>
                                        </div>

                                        <div v-else-if="item.file_type  === 'video'">
                                            <a-flex justify="center" align="center"
                                                    style="width: 100%; height: 130px">
                                                <iframe :src="`https://cos.jackycode.cn/${item.file_path}`"
                                                        style="width: 100%; height: 100%">
                                                </iframe>
                                            </a-flex>
                                        </div>

                                        <div v-else-if="item.file_type  === 'document'">
                                            <a-flex justify="center" align="center"
                                                    style="width: 100%; height: 130px">
                                                <iframe :src="`https://cos.jackycode.cn/${item.file_path}`"
                                                        style="width: 100%; height: 130px">
                                                </iframe>
                                            </a-flex>
                                        </div>

                                        <div v-else>
                                            <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)"
                                                    justify="center" align="center">
                                                <FileTextOutlined style="font-size: 50px; color: #ffffff;"/>
                                            </a-flex>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="selectFileArr.length == 1 " v-for="item in selectFileArr">
                                <div class="arrow"/>
                                <div class="content">
                                    <div class="mediaCenter">
                                        <div v-if="item.file_type  === 'image'">
                                            <a-flex justify="center" align="center"
                                                    style="width: 100%; height: 130px">
                                                <a-image height="100%" width="100%"
                                                         :src="`https://cos.jackycode.cn/${item.file_path}`"></a-image>
                                            </a-flex>
                                        </div>

                                        <div v-else-if="item.file_type  === 'video'">
                                            <a-flex justify="center" align="center"
                                                    style="width: 100%; height: 130px">
                                                <iframe :src="`https://cos.jackycode.cn/${item.file_path}`"
                                                        style="width: 100%; height: 100%">
                                                </iframe>
                                            </a-flex>
                                        </div>

                                        <div v-else-if="item.file_type  === 'document'">
                                            <a-flex justify="center" align="center"
                                                    style="width: 100%; height: 130px">
                                                <iframe :src="`https://cos.jackycode.cn/${item.file_path}`"
                                                        style="width: 100%; height: 130px">
                                                </iframe>
                                            </a-flex>
                                        </div>

                                        <div v-else>
                                            <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)"
                                                    justify="center" align="center">
                                                <FileTextOutlined style="font-size: 50px; color: #ffffff;"/>
                                            </a-flex>
                                        </div>
                                        <p class="contentBody"
                                           v-html="selectContent"></p>
                                    </div>
                                </div>
                            </div>

                            <div v-if="selectContent !== '' && selectFileArr.length > 1">
                                <div class="arrow"/>
                                <div class="content">
                                    <div class="mediaCenter">
                                        <p class="contentBody" v-html="selectContent"></p>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="selectContent !== '' && selectFileArr.length  === 0">
                                <div class="arrow"/>
                                <div class="content">
                                    <div class="mediaCenter">
                                        <p class="contentBody" v-html="selectContent"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="phoneBottom"/>
                    </div>
                </div>
            </div>
            <Confirm ref="confirmRef" @sendMsg="sendQuickMsg" :msgName="selectName" msgType="快捷回復"/>
        </a-modal>
        <SelectItem :account="accountChange" :type="type" @getSelected="getSelected" ref="selectItemRef"/>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch, shallowRef, nextTick, onBeforeMount} from "vue";
import {FileTextOutlined} from "@ant-design/icons-vue";
import {useTempStore} from "@/store/useTempStore";
import {useChatStore} from "@/store/chatStore";
import Confirm from "@/components/chatBox/content/message/Confirm.vue";
import * as ycloudApi from "@/api/ycloud/index.js";
import {UploadOutlined} from '@ant-design/icons-vue';
import type {UploadProps} from 'ant-design-vue';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import SelectItem from "@/components/contact/SelectItem.vue";
import {cosApi} from "@/api/whatsapp/index.js";

const templateStore = useTempStore();
const chatStore = useChatStore();
const open = ref(false);

// 确认栏
const confirmRef = ref(null);
const selectName = ref(null);
const sendQuickMsg = async () => {
    const fromNumber = "+8613672967202";
    const toNumber = currentPhone.value;
    const files = selectFileArr.value;
    const messageContent = selectContent.value;

    const sendMessage = async (data) => {
        const result = await ycloudApi.messageApi.sendMessage(data);
        let message = {
            direction: "outbound",
            _id: result.id,
            status: result.status,
            type: result.type,
            deliverTime: result.createTime,
            content: {}
        };

        if (data.type === 'text') {
            message.content.body = result.text.body;
        } else {
            message.content.link = result[result.type].link;
            const url = message.content.link;
            // message.content.filename = fileExtension;
            message.fileExtension = url.split('.').pop();
            message.content.caption = result[result.type].caption;
        }

        chatStore.addMessage(message);
    };

    if (files.length > 1) {
        for (const item of files) {
            await sendMessage({
                from: fromNumber,
                to: toNumber,
                type: item.file_type === 'file' ? 'document' : item.file_type,
                link: `https://cos.jackycode.cn/${item.file_path}`,
                message: ""
            });
        }
    } else if (files.length === 1) {
        await sendMessage({
            from: fromNumber,
            to: toNumber,
            type: files[0].file_type === 'file' ? 'document' : files[0].file_type,
            link: `https://cos.jackycode.cn/${files[0].file_path}`,
            message: messageContent
        });
    }

    if (messageContent && files.length !== 1) {
        await sendMessage({
            from: fromNumber,
            to: toNumber,
            type: 'text',
            message: messageContent
        });
    }


}

//
const selectedRow = ref<number | null>(1);
const fileList = ref<UploadProps['fileList']>([]);


// 選擇上傳庫
const selectItemRef = ref(null);
const options = ref([
    {value: '449711484896804', label: 'DataS素材库'},
    {value: '67890', label: '个人素材库'},
]);
const value1 = ref(options.value[0].value);

// 上傳modal
const type = ref("");
const accountChange = ref("public");

// 編輯器配置
const editorRef = shallowRef();
const toolbarConfig = {
    toolbarKeys: ['bold', 'italic', 'emotion'], // 仅显示加粗、斜体和表情菜单
}
const editorConfig = {
    placeholder: '请输入内容...',
}
const handleCreated = (editor) => {
    editorRef.value = editor
}

const selectOpen = () => {
    selectItemRef.value.setOpen();
}

// 切換公共\個人素材庫
const changeOptions = (value) => {
    let source = "";
    if (!value1.value.length > 6) {
        source = "wabaId=" + value1.value;
    } else {
        source = "userId=" + value1.value;
    }
    templateStore.setMaterialListData(source);
}

const handleOk = async () => {
    let list = [];
    console.log("selectFileArrselectFileArr", headerTxt.value)
    selectFileArr.value.map(item => {
        list.push(item.id)
    });

    let data = {
        fileIds: list,
        title: headerTxt.value,
        content: selectContent.value,
        userId: "user-67890",
        userType: 'user'
    }

    let result = await cosApi.uploadQuickMsg(data);
    console.log("code", result);
}

const setOpen = () => {
    open.value = !open.value
}

const btnUpload = (fileType) => {
    type.value = fileType;
    nextTick(() => selectItemRef.value.showModal());
}

const getSelected = (value) => {
    let list = selectFileArr.value;
    list.push(value);
    // console.log("list-list", list)
    selectFileArr.value = list;

};

const htmlChange = (value) => {
    selectContent.value = value
}

const selectFileArr = ref([]);
const selectContent = ref(null);
const selectRecord = ref(null);

let headerTxt = ref('');

// 分页配置
const pagination = {
    pageSize: 8,
};

const columns = [
    {
        title: '快捷消息',
        dataIndex: 'title',
        width: '30%',
    },
    {
        title: '消息內容',
        dataIndex: 'content',
        width: '30%',
    },
    {
        title: '操作',
        key: 'operation',
    },
];
const quickList = computed(() => templateStore.getQuickMsg);
const currentPhone = computed(() => chatStore.currentPhone);

// 点击列
const handleRowClick = (record: any) => {
    return {
        onClick: () => {
            preViewQuick(record);
            selectedRow.value = record._id; // 更新选中行的 ID
        },
    };
};

const setRowClassName = (record: any) => {
    return record._id === selectedRow.value ? 'table-striped' : '';
};

const handleRemove: UploadProps['onRemove'] = file => {
    const index = fileList.value.indexOf(file);
    const fileArrayIndex = selectFileArr.value.findIndex(item => file.name === item.file_name);
    if (fileArrayIndex !== -1) {
        const newFileArray = selectFileArr.value.slice();
        newFileArray.slice(fileArrayIndex, 1);
        selectFileArr.value = newFileArray;
    }
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
};

const props = defineProps({
    showQuickList: {
        type: Boolean,
        default: false
    },
    msgName: {
        type: String,
        default: "快捷回復"
    },
    fileArray: {
        type: Array,
        default: []
    },
    fileContent: {
        type: String,
        default: ""
    }
})

watch(
    () => props.fileArray,
    (newVal) => {
        selectFileArr.value = newVal;
        if (newVal.length !== 0) {
            console.log("")
            newVal.map(item => {
                let newFile = {
                    uid: item?.file_id || '1',
                    name: item?.file_name,
                    status: 'done',
                    response: '',
                    url: 'https://cos.jackycode.cn/' + item?.file_path
                }
                fileList.value.push(newFile);
            })

        }
    },
    {immediate: true}
);

watch(
    () => props.fileContent,
    (newVal) => {
        selectContent.value = newVal;
    },
    {immediate: true}
);

watch(
    () => props.msgName,
    (newVal) => {
        headerTxt.value = newVal;
    },
    {immediate: true}
);

const preViewQuick = (data) => {
    console.log("datadata", data)
    selectContent.value = data.content;
    selectFileArr.value = data.attachments;

    selectedRow.value = data._id;
}

const confirm = (record) => {
    const {title} = record
    selectName.value = title;
    confirmRef.value.showModal();
}


// 上傳檢查
const beforeUpload = async (file) => {
    const isAllowedType = ['image/jpeg', 'image/png', 'video/mp4', 'application/*'].includes(file.type);

    if (!isAllowedType) {
        // message.error('仅支持 JPG/PNG/PDF 文件!');
        return false;
    }

    let type = file.type.split('/')[0];
    if (type === 'application') {
        type = 'document'
    }

    let {code, message, result} = await cosApi.uploadTempFile(file, type, '67890');

    let newFile = {
        uid: result?._id || '1',
        name: result?.file_name || file.name,
        status: code === 200 ? 'done' : 'error',
        response: code === 200 ? '' : "错误信息",  // 修复拼写错误
        url: result?.file_path ? 'https://cos.jackycode.cn/' + result.file_path : ''
    };
    fileList.value.push(newFile);
    selectFileArr.value.push(result);

    // let data = new FormData();
    // data.append("file", file);
    // data.append("fileCategory", type)
    // data.append("userId", '67890')
    // try {
    //     await fetch('http://localhost:3001/materials/upload-material', {
    //         method: 'POST',
    //         body: data
    //     }).then(res => res.json())  // 先解析 JSON
    //         .then(({code, message, result}) => {
    //             console.log("code, message, result", code, message, result);
    //             let newFile = {
    //                 uid: result?._id || '1',
    //                 name: result?.file_name || file.name,
    //                 status: code === 200 ? 'done' : 'error',
    //                 response: code === 200 ? '' : message,  // 修复拼写错误
    //                 url: result?.file_path ? 'https://cos.jackycode.cn/' + result.file_path : ''
    //             };
    //             console.log("codecodecodecode", code, selectFileArr.value)
    //             fileList.value.push(newFile);
    //             if (code === 200) {
    //                 selectFileArr.value.push(result);
    //             }
    //         }).catch(error => {
    //             console.error("请求失败:", error);
    //         });
    // } catch (error) {
    //     console.error('上传过程中发生错误:', error);
    // }
    return false;
};

onBeforeMount(() => {
    !props.showQuickList && changeOptions(options.value[0].value)
})

onMounted(() => {
    props.showQuickList && preViewQuick(quickList.value[0]);
})

defineExpose({
    setOpen: () => {
        setOpen();
    }
})

</script>

<style scoped>
.flex-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
}

.phoneBox {
    min-width: 320px;
    width: calc(100% - 616px);
    height: calc(100% - 120px);
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    align-items: flex-start;

    .phone {
        top: 74px;
        right: 92px;
        min-height: 595px;
        max-height: 100%;
        display: flex;
        flex-direction: column;

        .phoneTop {
            background-image: url(https://app.salesmartly.com/img/phoneheader.4b8c90cf.png);
            background-size: contain;
            background-repeat: no-repeat;
            width: 320px;
            height: 83px;
            position: relative;
            bottom: -1px;
            flex-shrink: 0;
        }

        .phoneCenter {
            width: 320px;
            min-height: 445px;
            height: calc(100% - 146px);
            overflow-y: auto;
            box-sizing: border-box;
            border-left: 5.5px solid rgb(26, 30, 34);
            border-right: 5.5px solid rgb(26, 30, 34);
            background-color: rgb(232, 224, 213);
            padding: 18px 13px 9px;
            position: relative;

            .arrow {
                width: 0px;
                height: 0px;
                border-width: 3.5px;
                border-style: solid;
                border-color: rgb(255, 255, 255) rgb(255, 255, 255) transparent transparent;
                border-image: initial;
                position: absolute;
                left: 7px;
            }

            .content {
                background-color: rgb(255, 255, 255);
                border-radius: 0px 8px 8px;
                padding: 8px;
                margin-top: 20px;

                .contentHeader {
                    margin: 0px 0px 4px;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 24px;
                    font-family: Roboto, Helvetica, Arial, sans-serif;
                    letter-spacing: 0.00938em;
                    word-break: break-word;
                    white-space: break-spaces;
                }

                .contentBody {
                    margin: 0px;
                    font-size: 16px;
                    font-weight: 400;
                    font-family: Roboto, Helvetica, Arial, sans-serif;
                    letter-spacing: 0.01071em;
                    line-height: 24px;
                    word-break: break-word;
                    white-space: break-spaces;
                }

                .contentFooter {
                    margin: 4px 0px 0px;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 22px;
                    font-family: Roboto, Helvetica, Arial, sans-serif;
                    letter-spacing: 0.00938em;
                    color: rgb(162, 157, 174);
                    overflow-wrap: break-word;
                }
            }

        }

        .phoneCenter::-webkit-scrollbar {
            display: none;
        }

        .phoneBottom {
            background-image: url(https://app.salesmartly.com/img/phonebottom.a32a8d85.png);
            background-size: contain;
            background-repeat: no-repeat;
            width: 320px;
            height: 63px;
            position: relative;
            top: -1px;
            flex-shrink: 0;
        }
    }
}

.ant-table-striped {
    padding: 10px;
}

.ant-table-striped :deep(.table-striped) td {
    background-color: #E8E8E8;
}
</style>
