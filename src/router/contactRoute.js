// 客户管理路由
const contactRoutes = [
    {
        path: '/contact',
        name: 'contact',
        meta: { title: '客戶管理', icon: 'UsergroupAddOutlined', toplevel: true},
        children: [
            {
                // 客戶列表
                path: '/customer-list',
                name: 'customer-list',
                component: ()=> import('@/page/contact/customerList.vue'),
                meta: { title: '客戶列表', icon: 'TeamOutlined'},
            },
            {
                // 會話列表
                path: '/chat-management',
                name: 'chat-management',
                component: ()=> import('@/page/contact/chatManagement.vue'),
                meta: { title: '會話列表', icon: 'CommentOutlined'},
            },
            {
                // 標簽管理
                path: '/contact-tags',
                name: 'contact-tags',
                component: ()=> import('@/page/contact/contactTags.vue'),
                meta: { title: '標簽管理', icon: 'TagsOutlined'},
            },
            {
                // 快捷用語(文本)
                path: '/verbal-trick',
                name: 'verbal-trick',
                component: ()=> import('@/page/contact/verbalTrick.vue'),
                meta: { title: '快捷用語', icon: 'FileTextOutlined'},
            },
            {
                // 快捷素材(附件类)
                path: '/material-list',
                name: 'material-list',
                component: ()=> import('@/page/contact/materialList.vue'),
                meta: { title: '素材管理', icon: 'FileAddOutlined'},
            },
        ],
    },
];

export default contactRoutes;
