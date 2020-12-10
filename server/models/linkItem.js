const { I, S, T } = require('../ModelType');

/**
 * 自建搜索引擎主表
 * 记录访问过的网页
 *
 * title:   标题
 * link:    链接 url 地址
 * excerpt: 信息备注
 * typeId:  对应 linkType
 * extra、img 这里不需要
 */

var LinkItem = {
  title: S(100),
  link: S(300),
  excerpt: {
    type: T,
    allowNull: true
  },
  typeIds: {
    type: T,
    defaultValue: '0',
    get() {
      return this.getDataValue('typeIds').split(',');
    },
    set(val) {
      this.setDataValue('typeIds', val.join(','));
    }
  }
};

module.exports = LinkItem;
