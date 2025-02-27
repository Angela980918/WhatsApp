import {defineStore} from 'pinia'
import {templateApi} from "@/api/ycloud/index.js";
import {isEqual} from "lodash";
import {useChatStore} from "@/store/chatStore.js";
import {formatTime} from '@/tools'
import {cosApi} from "@/api/whatsapp/index.js";
import {loadQuickList} from "@/api/whatsapp/cos.js";

export const useTempStore = defineStore('template', {
    state: () => ({
        rawTempData: [], //原始數據
        createTempData: [], // 當前創建模板
        isTemplatesLoaded: false, // 标志位，表示模板数据是否已加载
        tempData: [], //處理后的數據

    //  快捷用语
        quickMessage: [],

    //   素材庫
        imageList: [],
        docList: [],
        videoList: []
    }), actions: {
        async loadTemplates() {
            if (this.isTemplatesLoaded) return;

            const response = await templateApi.getTemplateList();
            // console.log("response",response)
            if (response.items.length !== 0) {
                if (!isEqual(this.rawTempData, response.items)) {
                    this.setRawTempData(response.items);
                    this.setTempData(response.items);
                    this.isTemplatesLoaded = true;
                }
            }
        }, setTemplateData(data) {
            this.createTempData = data;
        }, setRawTempData(data) {
            this.rawTempData = data;
        }, setTempData(data) {
            data.map((item, index) => {
                item.key = index;
            });
            this.tempData = data
        }, resetCreateTempData() {
            this.createTempData = [];
        },
        async loadQuickMsg(){ //加载快捷短语
            let result  = await cosApi.loadQuickList();
            // console.log("resultresult", result)

            // 增加测试资料
            result.push({
                _id: '2d6f6ad8-db20-40a1-a595-2f97d85b2f7g',
                title: '纯文本消息',
                content: '这是只有文本的消息',
                owner_type: 'user',
                owner_id: '67891',
                createTime: '2025-01-14T02:44:06.261Z',
                attachments: []
            })

            result.push({
                _id: '2d6f6ad8-db20-40a1-a595-2f97d85b2f7h',
                title: '文件和视频消息',
                content: '这是有文件和视频的消息',
                owner_type: 'user',
                owner_id: '67892',
                createTime: '2025-01-13T02:44:06.261Z',
                attachments: [
                    {
                        file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
                        file_name: 'Sample.pdf',
                        file_path: '449711484896804/library/document/Sample.pdf',
                        file_size: 7583,
                        file_type: 'document'
                    },
                    {
                        file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
                        file_name: 'sign.mp4',
                        file_path: '449711484896804/library/videos/sign.mp4',
                        file_size: 7583,
                        file_type: 'video'
                    }
                ]
            })

            result.push({
                _id: '2d6f6ad8-db20-40a1-a595-2abcdd85b2f7i',
                title: '没有文本的消息，陌生类型',
                content: '',
                owner_type: 'user',
                owner_id: '67892',
                createTime: '2025-01-12T02:44:06.261Z',
                attachments: [
                    {
                        file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
                        file_name: 'Sample.pdf',
                        file_path: '449711484896804/library/document/Sample.pdf',
                        file_size: 7583,
                        file_type: 'file'
                    },
                ]
            })

            result.push({
                _id: '2d6f6ad8-db20-40a1-a595-2abcdddddbbbbbb',
                title: '只有一條文本一個素材',
                content: '一文本一素材',
                owner_type: 'user',
                owner_id: '67892',
                createTime: '2025-01-11T02:44:06.261Z',
                attachments: [
                    {
                        file_id: '141c3c07-4527-4a6d-a3a9-47ecbb590008',
                        file_name: 'Sample.pdf',
                        file_path: '449711484896804/library/document/Sample.pdf',
                        file_size: 7583,
                        file_type: 'file'
                    },
                ]
            })
            this.quickMessage = result;
            // }
        },
        async setMaterialListData(source) { // 素材列表
            await cosApi.libraryFiles(source).then(result => {
                if(result !== undefined) {
                    let { documents, images, videos } = result;
                    this.imageList = images;
                    this.docList = documents;
                    this.videoList = videos;
                }
            }).catch(error => console.log("error",error))
        },
    },getters:{
        getRawTemplateList: (state) => {
            const wabaId = useChatStore().wabaId;
            let list = []
            state.rawTempData.map((item) => {
                if (item.status === "APPROVED" && item.wabaId === wabaId) {
                    let cloumn = {
                        key: item.key,
                        name: item.name,
                        language: item.language,
                        components: item.components
                    }
                    list.push(cloumn)
                }
            })
            // console.log("listlistlist",list)
            return list;
        },
        getQuickMsg: (state) => {
            let list = JSON.parse(JSON.stringify(state.quickMessage));
            list.map(item =>  {
                const time = new Date(item.createTime);
                const formatter = new Intl.DateTimeFormat("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Shanghai"
                });
                // console.log(formatter.format(time));
                item.createTime = formatter.format(time);
            })
            return list;
        }
    }, persist: true
})
