const blessed = require('blessed');
const getRepoInfo = require('git-repo-info');


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
    });
    //  Populate data
    this.getData();
    console.log(this.repoInfo);

    // add panel
    this.layout();
    // Events
    this.addEventHandlers();
    // GO
    this.screen.render();
  }
  getData() {
    this.repoInfo = getRepoInfo();
  }
  addEventHandlers() {
    this.screen.key(['escape', 'q', 'C-c'], () => {
      process.exit(0);
    });
  }
  layout() {
    const box = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      content: 'Hello {bold}world{/bold}!',
      tags: true,
      style: {
        fg: 'orange',
        bg: 'black',
      },
    });
    this.screen.append(box);
  }
}
// kick it off
new Dashboard();
module.exports = Dashboard;
