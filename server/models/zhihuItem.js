const _ = require('loadsh');
const LinkItem = require('./linkItem');
const { S, T } = require('../ModelType');

/**
 * 自建搜索引擎副表：zhihu
 * 区别于主表，记录爬虫获取的热榜信息
 *
 * title:   标题
 * link:    链接 url 地址
 * img:     热榜标题配图
 * excerpt: 新闻、话题摘要
 * extra:   JSON.stringify 后的对象字符串，放些备注之类的信息
 * typeId 这里不需要
 */

let ZhihuItem = _.cloneDeep(LinkItem);

ZhihuItem = {
  ...ZhihuItem,
  img: S(260),
  extra: {
    type: T,
    allowNull: true
  }
};

module.exports = ZhihuItem;
