(function(){
  
  describe('Related files', function(){
    beforeEach(function(){
      this.boolval = true;
      var patterns = {
        ".+/app/controllers/(.+)_controller.rb" : [
          "app/views/$1/**",
          "app/helpers/$1_helper.rb"
        ]
      };
      this.patterns = patterns;
      this.relatedFiles = require('../lib/related-files-lib');
    });

    it('dummy ', function(){
      expect(this.boolval).toBeTruthy();
    });
    
    it('returns correct files', function(){
      var relatedFiles = this.relatedFiles.relatedFiles;
      expect(relatedFiles("./app/controllers/songs_controller.rb",this.patterns ,"/Users/raviteja/tmp/prog/app2")).toBe(42);
    })
  });
}).call(this);