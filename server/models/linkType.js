const { I, S } = require('../ModelType');

/**
 * 链接类型表
 *
 * name:  类型名，如：CSS、Web、Other、Read
 * order: 排序 id，默认 0 吧，根据大于 1 的数，数越大，优先级越高，其余 0 的根据 id 排
 */

var LinkType = {
  name: S(32),
  order: {
    type: I,
    defaultValue: 0
  }
};

module.exports = LinkType;
