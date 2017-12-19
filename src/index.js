const blessed = require('blessed');
const repositoryInfo = require('git-info');
const isEqual = require('lodash.isequal');

const BranchList = require('./panels/BranchList');

const POLL_INTERVAL = 5000;
// git-info API: https://github.com/michalbe/git-info#api
const API_FIELDS = [
  'author', // top author of the repo
  'authors', // list of all the authors
  'authorDate', // date of last commit
  'authorDateRelative', // date of last commit
  'name', // name of the repository
  'repository', // address of the repo
  'branch', // current branch
  'branches', // all the branches in the repo
  'sha', // the sha of the last commit
  'shaShort', // the sha of the last commit but in the short form
  'subject', // the message of the last commit
];

class Dashboard {
  constructor() {
    const title = 'Git Dashboard';
    // Store info for this repo
    this.repoInfo = null;
    // initialize Blessed
    this.screen = blessed.screen({
      title,
      smartCSR: true,
      fullUnicode: true,
      autoPadding: true,
      dockBorders: true,
    });
    this.render = this.render.bind(this);
    this.addEventHandlers = this.addEventHandlers.bind(this);
    this.layout = this.layout.bind(this);
    this.getRepoInfo = this.getRepoInfo.bind(this);
    this.poll = this.poll.bind(this);
    this.updateRepoInfo = this.updateRepoInfo.bind(this);
    this.hasChanged = this.hasChanged.bind(this);

    this.addEventHandlers();
    this.getRepoInfo(this.updateRepoInfo);
  }
  // eslint-disable-next-line
    getRepoInfo(cb) {
    repositoryInfo(API_FIELDS, cb);
  }
  render() {
    // GO
    this.screen.render();
  }
  poll() {
    setTimeout(() => {
      this.getRepoInfo(this.updateRepoInfo);
    }, POLL_INTERVAL);
  }
  updateRepoInfo(err, result) {
    if (err) {
      throw new Error(err);
    }
    if (this.hasChanged) {
      this.repoInfo = result;
      this.layout();
      this.render();
      this.poll();
    }
  }
  hasChanged(result) {
    return isEqual(this.repoInfo, result);
  }
  addEventHandlers() {
    this.screen.key(['escape', 'q', 'C-c'], () => {
      this.screen.destroy();
      process.exit(0);
    });
  }
  layout() {
    const { branch, branches } = this.repoInfo;
    const List = new BranchList({
      listItems: Array.isArray(branches) ? branches : [branches],
    });
    List.selectItem(branch);
    this.screen.append(List.getList());
  }
}
// kick it off
new Dashboard();
module.exports = Dashboard;
