const fs = require('fs');
var crypto = require('crypto');

// This plugin will watch a file and update the global data when the file changes
module.exports = function (context, options) {
  const { filePath } = options;

  let fileData = null;

  return {
    name: 'tds-watcher-plugin',

    async loadContent() {
      if (fs.existsSync(filePath)) {
        fileData = fs.readFileSync(filePath, 'utf-8');
      }
      // We don't need real content, we just need to know when the file changes
      const id = crypto.createHash('md5').update(fileData).digest('hex');
      return { id };
    },

    getPathsToWatch() {
      return [filePath];
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      // Set global data to trigger a site rebuild
      setGlobalData(content);
    },
  };
};
