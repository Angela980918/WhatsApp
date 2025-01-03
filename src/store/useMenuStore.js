import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menuStore', {
    state: () => ({
        // 模板的數據
        openKeys: [],
        selectedKeys: []
    }),
    actions: {
        setOpenKey(data) {
            // console.log("data1",data)
            this.openKeys = [data];
        },
        setSelectedKey(data) {
            // console.log("data2",data)
            // this.selectedKeys.push(data);
            this.selectedKeys = [data];
        },
        removeSelected(data) {
            // const index = this.array.indexOf(data); // 找到值的索引
            // if (index > -1) {
            //     this.array.splice(index, 1); // 移除索引位置的值
            // }
        }
    },
})
