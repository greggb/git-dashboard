const blessed = require('blessed');
const isEqual = require('lodash.isequal');

const theme = require('../theme');

class BranchList {
  constructor(props = {}) {
    const defaultConfig = {
      style: {
        fg: theme.fg,
        selected: {
          fg: theme.alt,
          bold: true,
        },
        border: {
          fg: theme.alt,
        },
      },
      border: {
        type: 'line',
      },
      width: '50%',
      height: '50%',
      left: 0,
      top: 0,
      scrollable: true,
    };
    this.listItems = props.listItems || [];
    const config = Object.assign({}, defaultConfig, { items: this.listItems });
    this.list = blessed.list(config);
  }
  updateList(items) {
    if (!isEqual(this.listItems, items)) {
      this.listItems = items;
      this.list.setItems(items);
    }
  }
  selectItem(item) {
    let itemIndex = item;
    if (typeof item === 'string') {
      itemIndex = this.list.getItemIndex(item);
    }
    this.list.select(itemIndex);
  }
  getList() {
    return this.list;
  }
}

module.exports = BranchList;
