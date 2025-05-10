'use strict';

const Controller = require('ee-core').Controller;

/**
 * 主页控制器
 * @class
 */
class HomeController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值
   */
  
  /**
   * 获取应用信息
   */
  async getAppInfo() {
    const appInfo = {
      name: '牛马实时薪资计算器',
      version: '1.0.0',
      author: 'liujie99606'
    };
    
    return appInfo;
  }

  /**
   * 保存用户配置
   */
  async saveConfig(args) {
    const { config } = args;
    const storageService = this.service.storage;
    
    await storageService.setItem('userConfig', config);
    
    return {
      success: true,
      message: '配置已保存'
    };
  }

  /**
   * 获取用户配置
   */
  async getConfig() {
    const storageService = this.service.storage;
    const config = await storageService.getItem('userConfig');
    
    return config || {};
  }
}

module.exports = HomeController; 