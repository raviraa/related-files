(function() {
  var FuzzyFinderView, GitStatusView, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs-plus');

  var cson = require('cson-safe');

  var patterns = cson.parse(fs.readFileSync(path.join(__dirname, "../conf/patterns.cson")));


  relatedFiles = require('./related-files-lib');

  FuzzyFinderView = require('./fuzzy-finder-view');

  module.exports = GitStatusView = (function(_super) {
    __extends(GitStatusView, _super);

    function GitStatusView() {
      return GitStatusView.__super__.constructor.apply(this, arguments);
    }

    GitStatusView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.cancel();
      } else if (atom.project.getRepo() != null) {
        this.populate();
        return this.attach();
      }
    };

    GitStatusView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No files found';
      } else {
        return GitStatusView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    GitStatusView.prototype.populate = function() {
      var filePath, paths, status, workingDirectory, _ref;
      paths = [];
      workingDirectory = atom.project.getRepo().getWorkingDirectory();

      paths.push(path.join(workingDirectory, 'Rakefile'));

      var currentFile = atom.workspace.getActiveEditor().getPath();
      currentFile = currentFile.replace(workingDirectory, '.');
      var files = relatedFiles.relatedFiles(currentFile, patterns, workingDirectory);
      // console.log(files);
      return this.setItems(files);
    };

    return GitStatusView;

  })(FuzzyFinderView);

}).call(this);
