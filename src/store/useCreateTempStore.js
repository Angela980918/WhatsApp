import { defineStore } from 'pinia'

export const useCreateTempStore = defineStore('createTemplate', {
    state: () => ({

        // 模板的數據
        templateData: null,
    }),
    actions: {
        setTemplateData(data) {
            this.templateData = data;
        },
    },
})
