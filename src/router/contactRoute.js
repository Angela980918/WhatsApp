// 客户管理路由
const contactRoutes = [
    {
        path: '/contact',
        name: 'contact',
        component: ()=> import('@/page/contact/index.vue'),
        children: [
            {
                // 客户列表
                path: 'customer-list',
                name: 'customer-list',
                component: ()=> import('@/page/contact/customerList.vue'),
            },
            {
                // 会话列表
                path: 'chat-management',
                name: 'chat-management',
                component: ()=> import('@/page/contact/chatManagement.vue'),
            },
            {
                // 标签管理
                path: 'contact-tags',
                name: 'contact-tags',
                component: ()=> import('@/page/contact/contactTags.vue'),
            },
            {
                // 快捷用语(文本)
                path: 'verbal-trick',
                name: 'verbal-trick',
                component: ()=> import('@/page/contact/verbalTrick.vue'),
            },
            {
                // 快捷素材(附件类)
                path: 'material-list',
                name: 'material-list',
                component: ()=> import('@/page/contact/materialList.vue'),
            },
        ],
    },
];

export default contactRoutes;