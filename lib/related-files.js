(function() {
  module.exports = {
    configDefaults: {
      ignoredNames: []
    },
    activate: function(state) {
      var PathLoader, editor, _i, _len, _ref;
      
      atom.workspaceView.command('related-files:toggle-rails-related-finder', (function(_this) {
        return function() {
          return _this.createRailsRelatedViewView().toggle();
        };
      })(this));
      
    },
    deactivate: function() {
      if (this.railsRelatedView != null) {
        this.railsRelatedView.destroy();
        this.railsRelatedView = null;
      }
      return this.projectPaths = null;
    },

    createRailsRelatedViewView: function() {
      var RailsRelatedView;
      if (this.railsRelatedView == null) {
        RailsRelatedView = require('./rails-related-view');
        this.railsRelatedView = new RailsRelatedView();
      }
      return this.railsRelatedView;
    }
    
  };

}).call(this);
