import {defineStore} from 'pinia'
import {templateApi} from "@/api/ycloud/index.js";
import {isEqual} from "lodash";
import {useChatStore} from "@/store/chatStore.js";

export const useTempStore = defineStore('template', {
    state: () => ({
        rawTempData: [], //原始數據
        createTempData: [], // 當前創建模板
        isTemplatesLoaded: false, // 标志位，表示模板数据是否已加载
        tempData: [], //處理后的數據
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
        }
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
        }
    }, persist: true
})
