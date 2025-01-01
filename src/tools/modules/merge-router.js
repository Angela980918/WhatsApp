// 动态路由模块合并函数
/**
 * 合并动态路由模块的默认导出
 * @param {Record<string, unknown>} routeModules 动态导入的路由模块对象
 * @returns {Array} 合并后的路由配置数组
 */
function mergeRouteModules(routeModules) {
  const mergedRoutes = [];

  // 遍历所有导入的路由模块并合并
  for (const routeModule of Object.values(routeModules)) {
    // 提取路由模块中的默认导出（即路由配置数组）
    const moduleRoutes = routeModule?.default ?? [];
    // 将这些路由推送到合并后的路由数组中
    mergedRoutes.push(...moduleRoutes);
  }

  return mergedRoutes;
}

export { mergeRouteModules };
