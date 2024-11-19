// 群发计划
const marketingRoutes = [
    {
        path: '/marketing',
        name: 'marketing',
        component: ()=> import('@/page/marketing/index.vue'),
        children: [
            {
                // 营销群发
                path: 'broadcast',
                name: 'broadcast',
                component: ()=> import('@/page/marketing/broadcast.vue'),
            },
            {
                // WhatsApp模板
                path: 'templates',
                name: 'templates',
                component: ()=> import('@/page/marketing/templates.vue'),
            },
        ],
    },
];

export default marketingRoutes;