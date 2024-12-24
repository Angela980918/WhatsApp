import {defineStore} from 'pinia'
import {templateApi} from "@/api/ycloud/index.js";
import {isEqual} from "lodash";

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
            if (response.status === 200) {
                if (!isEqual(this.rawTempData, response.data.items)) {
                    this.setRawTempData(response.data.items);
                    this.setTempData(response.data.items);
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
    }, persist: true
})
