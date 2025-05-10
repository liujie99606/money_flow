'use strict';

const Service = require('ee-core').Service;
const Storage = require('ee-core').Storage;

/**
 * 存储服务
 * @class
 */
class StorageService extends Service {
  constructor(ctx) {
    super(ctx);
    
    // 初始化存储实例
    this.db = Storage.JsonStorage.create();
  }

  /**
   * 设置数据
   */
  async setItem(key, value) {
    return await this.db.setItem(key, value);
  }

  /**
   * 获取数据
   */
  async getItem(key) {
    return await this.db.getItem(key);
  }

  /**
   * 删除数据
   */
  async removeItem(key) {
    return await this.db.removeItem(key);
  }

  /**
   * 清空所有数据
   */
  async clear() {
    return await this.db.clear();
  }
}

module.exports = StorageService; 