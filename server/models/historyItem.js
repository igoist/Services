const _ = require('loadsh');
const LinkItem = require('./linkItem');
const { B, S } = require('../ModelType');

let historyItem = _.cloneDeep(LinkItem);

historyItem = {
  ...historyItem,
  generatedId: S(96),
  isDeleted: {
    type: B,
    allowNull: false,
    defaultValue: 0,
    get() {
      x = this.getDataValue('isDeleted');
      console.log(`historyItem get isDeleted: ${x}`);
      return x;
    },
    set(val) {
      console.log(`historyItem set isDeleted: ${val}`);
      if (val === true) {
        val = 1;
        this.setDataValue('isDeleted', val);
      } else if (val === false) {
        val = 0;
        this.setDataValue('isDeleted', val);
      }
    }
  }
};

module.exports = historyItem;
