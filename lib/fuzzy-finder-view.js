(function() {
  var $$, FuzzyFinderView, Point, SelectListView, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, SelectListView = _ref.SelectListView;

  fs = require('fs-plus');

  module.exports = FuzzyFinderView = (function(_super) {
    __extends(FuzzyFinderView, _super);

    function FuzzyFinderView() {
      return FuzzyFinderView.__super__.constructor.apply(this, arguments);
    }

    FuzzyFinderView.prototype.filePaths = null;

    FuzzyFinderView.prototype.projectRelativePaths = null;

    FuzzyFinderView.prototype.initialize = function() {
      FuzzyFinderView.__super__.initialize.apply(this, arguments);
      this.addClass('related-files overlay from-top');
      this.setMaxItems(10);
      this.subscribe(this, 'pane:split-left', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitLeft(session);
          });
        };
      })(this));
      this.subscribe(this, 'pane:split-right', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitRight(session);
          });
        };
      })(this));
      this.subscribe(this, 'pane:split-down', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitDown(session);
          });
        };
      })(this));
      return this.subscribe(this, 'pane:split-up', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitUp(session);
          });
        };
      })(this));
    };

    FuzzyFinderView.prototype.getFilterKey = function() {
      return 'projectRelativePath';
    };

    FuzzyFinderView.prototype.destroy = function() {
      this.cancel();
      return this.remove();
    };

    FuzzyFinderView.prototype.viewForItem = function(_arg) {
      var filePath, projectRelativePath;
      filePath = _arg.filePath, projectRelativePath = _arg.projectRelativePath;
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var ext, repo, status, typeClass;
            repo = atom.project.getRepo();
            if (repo != null) {
              status = repo.getCachedPathStatus(filePath);
              if (repo.isStatusNew(status)) {
                _this.div({
                  "class": 'status status-added icon icon-diff-added'
                });
              } else if (repo.isStatusModified(status)) {
                _this.div({
                  "class": 'status status-modified icon icon-diff-modified'
                });
              }
            }
            ext = path.extname(filePath);
            if (fs.isReadmePath(filePath)) {
              typeClass = 'icon-book';
            } else if (fs.isCompressedExtension(ext)) {
              typeClass = 'icon-file-zip';
            } else if (fs.isImageExtension(ext)) {
              typeClass = 'icon-file-media';
            } else if (fs.isPdfExtension(ext)) {
              typeClass = 'icon-file-pdf';
            } else if (fs.isBinaryExtension(ext)) {
              typeClass = 'icon-file-binary';
            } else {
              typeClass = 'icon-file-text';
            }
            _this.div(path.basename(filePath), {
              "class": "primary-line file icon " + typeClass
            });
            return _this.div(projectRelativePath, {
              "class": 'secondary-line path no-icon'
            });
          };
        })(this));
      });
    };

    FuzzyFinderView.prototype.openPath = function(filePath, lineNumber) {
      if (filePath) {
        return atom.workspaceView.open(filePath).done((function(_this) {
          return function() {
            return _this.moveToLine(lineNumber);
          };
        })(this));
      }
    };

    FuzzyFinderView.prototype.moveToLine = function(lineNumber) {
      var editorView, position;
      if (lineNumber == null) {
        lineNumber = -1;
      }
      if (!(lineNumber >= 0)) {
        return;
      }
      if (editorView = atom.workspaceView.getActiveView()) {
        position = new Point(lineNumber);
        editorView.scrollToBufferPosition(position, {
          center: true
        });
        editorView.editor.setCursorBufferPosition(position);
        return editorView.editor.moveCursorToFirstCharacterOfLine();
      }
    };

    FuzzyFinderView.prototype.splitOpenPath = function(fn) {
      var filePath, lineNumber, pane, _ref1;
      filePath = ((_ref1 = this.getSelectedItem()) != null ? _ref1 : {}).filePath;
      if (!filePath) {
        return;
      }
      lineNumber = this.getLineNumber();
      if (pane = atom.workspaceView.getActivePane()) {
        return atom.project.open(filePath).done((function(_this) {
          return function(editor) {
            fn(pane, editor);
            return _this.moveToLine(lineNumber);
          };
        })(this));
      } else {
        return this.openPath(filePath, lineNumber);
      }
    };

    FuzzyFinderView.prototype.confirmed = function(_arg) {
      var filePath, lineNumber;
      filePath = _arg.filePath;
      if (!filePath) {
        return;
      }
      if (fs.isDirectorySync(filePath)) {
        this.setError('Selected path is a directory');
        return setTimeout(((function(_this) {
          return function() {
            return _this.setError();
          };
        })(this)), 2000);
      } else {
        lineNumber = this.getLineNumber();
        this.cancel();
        return this.openPath(filePath, lineNumber);
      }
    };

    FuzzyFinderView.prototype.getFilterQuery = function() {
      var colon, query;
      query = FuzzyFinderView.__super__.getFilterQuery.apply(this, arguments);
      colon = query.indexOf(':');
      if (colon === -1) {
        return query;
      } else {
        return query.slice(0, colon);
      }
    };

    FuzzyFinderView.prototype.getLineNumber = function() {
      var colon, query;
      query = this.filterEditorView.getText();
      colon = query.indexOf(':');
      if (colon === -1) {
        return -1;
      } else {
        return parseInt(query.slice(colon + 1)) - 1;
      }
    };

    FuzzyFinderView.prototype.setItems = function(filePaths) {
      return FuzzyFinderView.__super__.setItems.call(this, this.projectRelativePathsForFilePaths(filePaths));
    };

    FuzzyFinderView.prototype.projectRelativePathsForFilePaths = function(filePaths) {
      if (filePaths !== this.filePaths) {
        this.filePaths = filePaths;
        this.projectRelativePaths = this.filePaths.map(function(filePath) {
          var projectRelativePath;
          projectRelativePath = atom.project.relativize(filePath);
          return {
            filePath: filePath,
            projectRelativePath: projectRelativePath
          };
        });
      }
      return this.projectRelativePaths;
    };

    FuzzyFinderView.prototype.attach = function() {
      this.storeFocusedElement();
      atom.workspaceView.append(this);
      return this.focusFilterEditor();
    };

    return FuzzyFinderView;

  })(SelectListView);

}).call(this);
