import { useRouter } from "vue-router";
import { useMenuStore } from "@/store/useMenuStore";

export function useMenuJump() {
    const router = useRouter();
    const menuStore = useMenuStore();

    const menupush = (path, back = false) => {
        // console.log("pathpath",path)
        const indexNode = findParentRoute(path);
        if (indexNode) {
            menuStore.setSelectedKey(path);
            menuStore.setOpenKey(indexNode.path);
            !back && router.push({ path });
        }
    };

    const btnpush = (pathname) => {
        const indexNode = findKeys(pathname);
        if (indexNode) {
            // console.log("indexNode",indexNode)
            menuStore.setSelectedKey(indexNode.currentPath);
            menuStore.setOpenKey(indexNode.parentPath);
            router.push({ name: pathname });
        }
    }

    const findParentRoute = (path) => {
        // console.log("path",path)
        const allRouter = router.getRoutes().filter(route => route.path !== '/');
        // console.log("allRouter",allRouter)
        // 优先查找子路由是否属于某个父路由
        for (const route of allRouter) {
            if (route.children && route.children.length > 0) {
                const childRoute = route.children.find(child => child.path === path);
                if (childRoute) {
                    // console.log("parentRoute", route);
                    return route; // 找到父路由，返回父路由
                }
            }
        }

        // 如果不是子路由，直接匹配一级路由
        const topLevelRoute = allRouter.find(route => route.path === path);
        if (topLevelRoute) {
            // console.log("topLevelRoute", topLevelRoute);
            return topLevelRoute; // 返回一级路由
        }
        return null;
    };

    const findKeys = (pathname) => {
        const allRouter = router.getRoutes().filter(route => route.path !== '/');
        for (const route of allRouter) {
            if (route.children && route.children.length > 0) {
                const parentRoute = allRouter.find(route =>
                    route.children.some(child => child.name === pathname)
                );
                if (parentRoute) {
                    const childRoute = parentRoute.children.find(child => child.name === pathname);
                    return {
                        parentPath: parentRoute.path,
                        currentPath: childRoute.path,
                    };
                }
            }
            if (route.name === pathname) {
                return {
                    parentPath: null, // 没有父节点
                    currentPath: route.path,
                };
            }
        }
        return null; // 如果没有匹配到任何路由
    };

    return { menupush, btnpush, findParentRoute };
}

