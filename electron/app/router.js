'use strict';

/**
 * 路由配置
 */
module.exports = app => {
  const { router, controller } = app;
  
  // 主页路由
  router.get('/api/app/info', controller.home.getAppInfo);
  router.post('/api/config/save', controller.home.saveConfig);
  router.get('/api/config/get', controller.home.getConfig);
}; 