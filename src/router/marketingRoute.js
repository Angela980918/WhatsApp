// 群发计划
const marketingRoutes = [
    {
        path: '/marketing',
        name: 'marketing',
        meta: {title: '群發計劃', icon: 'SendOutlined', toplevel: true},
        children: [
            {
                // 消息群发
                path: '/broadcast',
                name: 'broadcast',
                component: () => import('@/page/marketing/broadcast.vue'),
                meta: {title: '消息群發', icon: 'ClusterOutlined'},
            },
            {
                // WhatsApp模板
                path: '/templates',
                name: 'templates',
                component: () => import('@/page/marketing/templates.vue'),
                meta: {title: 'WhatsApp模板', icon: 'OneToOneOutlined'},
            },
            // {
            //     // 创建模板
            //     path: '/create-temp',
            //     name: 'createTemp',
            //     component: () => import('@/page/marketing/createTemp.vue'),
            //     meta: {title: '創建模板', icon: 'OneToOneOutlined'},
            // },
            {
                // 创建模板
                path: '/create-temp2',
                name: 'createTemp2',
                component: () => import('@/page/marketing/createTemp2.vue'),
                meta: {title: '創建模板', icon: 'OneToOneOutlined'},
            },
        ],
    },
];

export default marketingRoutes;
