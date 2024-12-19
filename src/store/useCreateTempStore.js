import { defineStore } from 'pinia'
export const useCreateTempStore = defineStore('createTemplate', {
    state: () => ({
        templateData: null,
    }),
    actions: {
        setTemplateData(data) {
            this.templateData = data;
        },
    },
})
