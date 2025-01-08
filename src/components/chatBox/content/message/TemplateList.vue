<template>

    <a-modal v-model:open="open" title="選擇模板" @ok="handleSubmit" :width="800">
        <div class="flex-container">
            <a-table :columns="columns" :customRow="handleRowClick" rowKey="key" :row-class-name="setRowClassName" :data-source="templateList" style="width: 400px">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                        <a @click="preViewTemp(record)">預覽</a>
                        <a-divider type="vertical"/>
                        <span>
                        <a-button @click="sendTemplate(record)" type="primary">发送</a-button>
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
                            <h6 class="contentHeader" v-if="containerTemp.header.format === 'TEXT'">{{ containerTemp.header.text }}</h6>
                            <div class="mediaCenter" v-else>
                                <div v-if="containerTemp.header.format  === 'IMAGE'">
                                    <a-flex v-if="containerTemp.header.url  !== ''" justify="center" align="center"
                                            style="width: 100%; height: 130px">
                                        <a-image height="100%" width="100%" :src="containerTemp.header.url"></a-image>
                                    </a-flex>
                                    <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
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
                                    <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
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
                                    <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
                                            align="center">
                                        <FilePdfOutlined style="font-size: 50px; color: #ffffff;"/>
                                    </a-flex>
                                </div>
                            </div>

                            <p class="contentBody" v-html="containerTemp.body.text"></p>
                            <p class="contentFooter" v-if="containerTemp.footer != undefined">{{ containerTemp.footer.text }}</p>
                        </div>
                    </div>
                    <div class="phoneBottom"/>
                </div>
            </div>
        </div>
    </a-modal>
  <!--        <div class="contentRight" style="align-items: center">-->

  <!--        </div>-->

</template>

<script lang="ts" setup>
import {ref, computed, reactive, onMounted} from "vue";
import * as ycloudApi from "@/api/ycloud/index.js";
import {useChatStore} from "@/store/chatStore";
import {useTempStore} from "@/store/useTempStore";
import {FileImageOutlined, FilePdfOutlined, VideoCameraOutlined} from "@ant-design/icons-vue";

const chatStore = useChatStore();
const wabaId = computed(() => chatStore.wabaId);
console.log("wabaId", wabaId.value)
const template = useTempStore();
const currentPhone = computed(() => chatStore.currentPhone);
const containerTemp = ref({});
const selectedRow = ref<number | null>(0);
const templateList = computed(() => {
    let list = []
    template.rawTempData.map((item) => {
        console.log("item", item)
        if (item.status === "APPROVED" && item.wabaId === wabaId.value) {
            let cloumn = {
                key: item.key,
                name: item.name,
                language: item.language,
                components: item.components
            }
            list.push(cloumn)
        }
    })
    return list;
})
console.log("templateList", templateList.value)

const handleRowClick = (record: any) => {
    return {
        onClick: () => {
            preViewTemp(record);
            selectedRow.value = record.key; // 更新选中行的 ID
        },
    };
};

const setRowClassName = (record: any) => {
    return record.key === selectedRow.value ? "highlight-row" : "";
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
const handleSubmit = () => {
    open.value = !open.value
}


defineExpose({
    controlTemp: () => {
        // console.log("4444444")
        handleSubmit();
    }
})

const sendTemplate = async (value) => {

    // console.log("value", value);

    const {components} = value

    let sendData = {
        type: "template",
        template: {
            name: value.name,
            language: {
                code: value.language
            }
        },
        from: "+8613672967202",
        to: currentPhone.value
    }

    let msgContent = {}

    for (let index in components) {
        if (components[index].type === "HEADER") {
            msgContent.header = {
                format: components[index].format,
            }
            // console.log("components[index].format", components[index].format)
            if (components[index].format === "TEXT") {
                msgContent.header.content = components[index].text;
            } else {
                msgContent.header.content = components[index].example.header_url[0]

                //     修改调api传值(当header为媒体文件，特殊附加)
                let body = {
                    type: "header",
                    parameters: [{
                        type: components[index].format.toLowerCase()
                    }]
                }
                const dynamicKey = `${body.parameters[0].type}`;
                let typeIndex = body.parameters[0];
                typeIndex[dynamicKey] = {
                    link: components[index].example.header_url[0]
                };
                sendData.template.components = [body];
                // console.log("sendData", sendData)
            }

        } else if (components[index].type === "BODY") {
            msgContent.body = {
                content: components[index].text
            }
        } else if (components[index].type === "FOOTER") {
            msgContent.footer = {
                content: components[index].text
            }
        }
    }

    const resultObj = await ycloudApi.messageApi.sendMessage(sendData)
    console.log("resultObj", resultObj);
    // console.log("msgContent", msgContent);
    let message = {
        position: "outbound",
        id: resultObj.id,
        status: resultObj.status,
        type: resultObj.type,
        time: resultObj.createTime,
    }
    let res = Object.assign(message, msgContent);
    // console.log("tres", res)
    chatStore.addMessage(res);
}

const preViewTemp = (data) => {
    // console.log("data",data.components);

    if(data.components === undefined) return;
    let components = data.components;
    let template = {
        body: undefined,
        footer: undefined,
        header: {},
    };
    components.map(item => {
        if(item.type === 'BODY') {
            template.body = item;
        }else if(item.type === 'FOOTER') {
            template.footer = item;
        }else if(item.type === 'HEADER') {
            if(item.format != 'TEXT') {
                let obj = {};
                obj = {
                    url: item.example.header_url,
                    format: item.format,
                    type: item.type
                }
                template.header = obj;
            }else {
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

[data-doc-theme='light'] .ant-table-striped :deep(.highlight-row) td {
    background-color: #f0f8ff !important;
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
