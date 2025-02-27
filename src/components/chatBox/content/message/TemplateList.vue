
<template>
    <div>
        <a-modal :footer="false" v-model:open="open" title="選擇模板" @ok="handleSubmit" :width="1000">
            <div class="flex-container">
                <a-table class="ant-table-striped" :columns="columns" :pagination="pagination"
                         :customRow="handleRowClick" rowKey="key" :row-class-name="setRowClassName"
                         :data-source="templateList" style="min-width: 600px">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <a @click="preViewTemp(record)">預覽</a>
                            <a-divider type="vertical"/>
                            <span>
                        <a-button @click="confirm(record)" type="primary">发送</a-button>
                      </span>
                        </template>
                    </template>
                </a-table>
                <div class="phoneBox"> <!-- 确保居中 -->
                    <div class="phone">
                        <div class="phoneTop"/>
                        <div class="phoneCenter">
                            <div class="arrow"/>
                            <div class="content">
                                <h6 class="contentHeader" v-if="containerTemp.header.format === 'TEXT'">
                                    {{ containerTemp.header.text }}</h6>
                                <div class="mediaCenter" v-else>
                                    <div v-if="containerTemp.header.format  === 'IMAGE'">
                                        <a-flex v-if="containerTemp.header.url  !== ''" justify="center" align="center"
                                                style="width: 100%; height: 130px">
                                            <a-image height="100%" width="100%"
                                                     :src="containerTemp.header.url"></a-image>
                                        </a-flex>
                                        <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)"
                                                v-else justify="center"
                                                align="center">
                                            <FileImageOutlined style="font-size: 50px; color: #ffffff;"/>
                                        </a-flex>
                                    </div>
                                    <div v-else-if="containerTemp.header.format  === 'VIDEO'">
                                        <a-flex v-if="containerTemp.header.url !== ''" justify="center" align="center"
                                                style="width: 100%; height: 130px">
                                            <iframe :src="containerTemp.header.url" style="width: 100%; height: 100%">
                                            </iframe>
                                        </a-flex>
                                        <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)"
                                                v-else justify="center"
                                                align="center">
                                            <VideoCameraOutlined style="font-size: 50px; color: #ffffff;"/>
                                        </a-flex>
                                    </div>
                                    <div v-else-if="containerTemp.header.format === 'DOCUMENT'">
                                        <a-flex v-if="containerTemp.header.url !== ''" justify="center" align="center"
                                                style="width: 100%; height: 130px">
                                            <iframe :src="containerTemp.header.url" style="width: 100%; height: 130px">
                                            </iframe>
                                        </a-flex>
                                        <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)"
                                                v-else justify="center"
                                                align="center">
                                            <FilePdfOutlined style="font-size: 50px; color: #ffffff;"/>
                                        </a-flex>
                                    </div>
                                </div>

                                <p class="contentBody" v-html="containerTemp.body.text"></p>
                                <p class="contentFooter" v-if="containerTemp.footer != undefined">
                                    {{ containerTemp.footer.text }}</p>
                            </div>
                        </div>
                        <div class="phoneBottom"/>
                    </div>
                </div>
            </div>
            <Confirm ref="confirmRef" @sendMsg="sendTemplate" :msgName="selectName" msgType="模板消息"/>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted} from "vue";
import * as ycloudApi from "@/api/ycloud/index.js";
import {useTempStore} from "@/store/useTempStore";
import {useChatStore} from "@/store/chatStore.js";
import {FileImageOutlined, FilePdfOutlined, VideoCameraOutlined} from "@ant-design/icons-vue";
import {handleTemplateMsg} from '@/tools/modules/common'
import Confirm from "@/components/chatBox/content/message/Confirm.vue";

const chatStore = useChatStore();
const wabaId = computed(() => chatStore.wabaId);

const template = useTempStore();
const currentPhone = computed(() => chatStore.currentPhone);
const containerTemp = ref({});
const selectedRow = ref<number | null>(1);
const confirmRef = ref(null);
const selectRecord = ref(null);
const selectName = ref(null);
const templateList = computed(() => template.getRawTemplateList);

// 点击列
const handleRowClick = (record: any) => {
    return {
        onClick: () => {
            preViewTemp(record);
            selectedRow.value = record.key; // 更新选中行的 ID
        },
    };
};

const setRowClassName = (record: any) => {
    return record.key === selectedRow.value ? 'table-striped' : '';
};

const confirm = (record) => {
    const {name} = record
    selectName.value = name;
    selectRecord.value = record;
    confirmRef.value.showModal();
}

// 分页配置
const pagination = {
    pageSize: 8,
    // showSizeChanger: true,  // 是否显示切换每页数量的选择器
    // pageSizeOptions: ['5', '10', '15'],  // 可选择的每页显示条数
};

interface DataItem {
    key: string;
    name: string;
    language: number;
}

const columns = [
    {
        key: 'name',
        title: 'name',
        dataIndex: 'name',
        width: '30%',
    },
    {
        key: 'language',
        title: 'language',
        dataIndex: 'language',
    },
    {
        title: 'Action',
        key: 'action',
    },
];

let open = ref(false);
// 蒙版
const handleSubmit = () => {
    open.value = !open.value
}

defineExpose({
    controlTemp: () => {
        // console.log("4444444")
        handleSubmit();
    }
})

// 发送模板信息处理
const sendTemplate = async () => {
    const {name, language, components} = selectRecord.value
    //
    let sendData = {
        type: "template",
        template: {
            name: name,
            language: {
                code: language
            }
        },
        from: "+8613672967202",
        to: currentPhone.value
    }
    let msgContent = handleTemplateMsg(name, language);
    for (let i in msgContent) {
        let item = msgContent[i];
        let obj = {};
        obj.type = i;
        if (i === 'header') {
            if (item.format === 'TEXT') {
                obj.parameters = [{type: item.format.toLowerCase(), text: item.content}]
            } else {
                sendData.template.components = [];
                obj.parameters = [{type: item.format.toLowerCase()}]
                const dynamicKey = `${obj.parameters[0].type}`;
                let typeIndex = obj.parameters[0];
                typeIndex[dynamicKey] = {
                    link: item.content
                };
                sendData.template.components.push(obj);
            }
        }
    }

    const resultObj = await ycloudApi.messageApi.sendMessage(sendData)

    let message = {
        direction: "outbound",
        _id: resultObj.id,
        status: resultObj.status,
        type: resultObj.type,
        deliverTime: resultObj.createTime,
        content: msgContent
    }

    if (msgContent.header !== undefined && msgContent.header.format === 'DOCUMENT') {
        const url = msgContent.header.content;
        const filename = url.split('/').pop();
        const fileExtension = filename.split('.');
        message.fileExtension = fileExtension[1];
    }

    chatStore.addMessage(message);
    handleSubmit();
}

// 预览模板处理
const preViewTemp = (data) => {
    if (data.components === undefined) return;
    let components = data.components;
    let template = {
        body: undefined,
        footer: undefined,
        header: {},
    };
    components.map(item => {
        if (item.type === 'BODY') {
            template.body = item;
        } else if (item.type === 'FOOTER') {
            template.footer = item;
        } else if (item.type === 'HEADER') {
            if (item.format != 'TEXT') {
                let obj = {};
                obj = {
                    url: item.example.header_url[0],
                    format: item.format,
                    type: item.type
                }
                template.header = obj;
            } else {
                template.header = item;
            }

        }
    })
    containerTemp.value = template;
}

onMounted(() => {
    preViewTemp(templateList.value[0]);
})


</script>

<style scoped>
.flex-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
}

/* 浅色主题下的高亮行样式 */
.ant-table-striped :deep(.table-striped) td {
    background-color: #E8E8E8;
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
</style>
