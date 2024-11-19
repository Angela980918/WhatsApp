// 群发计划
const marketingRoutes = [
    {
        path: '/marketing',
        name: 'marketing',
        component: ()=> import('@/page/marketing/index.vue'),
        meta: { title: '群發計劃', icon: 'SendOutlined'},
        children: [
            {
                // 消息群发
                path: 'broadcast',
                name: 'broadcast',
                component: ()=> import('@/page/marketing/broadcast.vue'),
                meta: { title: '消息群發', icon: 'SendOutlined'},
            },
            {
                // WhatsApp模板
                path: 'templates',
                name: 'templates',
                component: ()=> import('@/page/marketing/templates.vue'),
                meta: { title: 'WhatsApp模板', icon: 'SendOutlined'},
            },
        ],
    },
];

export default marketingRoutes;