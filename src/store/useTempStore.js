import { defineStore } from 'pinia'
export const useTempStore = defineStore('template', {
    state: () => ({
        selectAccount: [],
        searchContents: '',
        selectCategory: [],
        selectLanguage: [],
        selectStatus: [],
    }),
    actions: {
        setAccount(value) {
            this.selectAccount = value;
        },
        setContent(name) {
            this.searchContents = name;
        },
        setCategory(value) {
            this.selectCategory = value;
        },
        setLanguage(value) {
            this.selectLanguage = value;
        },
        setStatus(value) {
            this.selectStatus = value;
        }
    },
})
