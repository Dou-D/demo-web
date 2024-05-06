import {createRouter, createWebHistory} from "vue-router";
import storage from "@/service/storage"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // 404
        {
            path: '/:pathMatch(.*)', component: () => import("@/views/NotFound404.vue")
        },
        {
            path: "/",
            redirect: "/home",
            component: () => import("@/views/MainView.vue"),
            children: [
                {
                    path: "/home",
                    component: () => import("@/views/HomeView.vue"),
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: "/detail",
                    name: "Detail",
                    props: route => ({query: route.query.id}),
                    component: () => import("@/views/SoftwareDetail.vue"),
                },
                {
                    path: "/admin",
                    name: "ConsoleAdmin",
                    component: () => import("@/views/console/user/ConsoleAdmin.vue"),
                },
                // 管理员 登录权限
                {
                    path: "/console",
                    name: "ConsoleManage",
                    meta: {
                        auth: true,
                        keepAlive: true
                    },
                    component: () => import("@/views/console/ConsoleView.vue"),
                    children: [
                        {
                            path: "/console",
                            name: "SoftwareManage",
                            meta: {
                                auth: true,
                            },
                            component: () => import("@/views/console/software/SoftwareManage.vue"),
                        }
                    ]
                },
            ],
        },
    ],
});
router.beforeEach((to, from, next) => {
    const token = storage.get("metc_user_token")
    if (to.meta.auth && !token) {
        next({path: "/admin"});
    } else {
        next();
    }
});
export default router;
