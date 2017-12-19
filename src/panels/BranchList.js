const blessed = require('blessed');
const isEqual = require('lodash.isequal');

class BranchList {
  constructor(config = {}) {
    const defaultStyles = {
      fg: 'blue',
      bg: 'black',
      shadow: true,
    };
    this.listItems = config.listItems || [];
    this.styles = Object.assign({}, defaultStyles, config.styles);
    this.list = blessed.list({
      items: this.listItems,
      style: this.styles,
    });
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
