(function(){
  var fs = require('fs');
  var path = require('path');
  var glob = require('glob');

    //   # file_path - the file to look related files for
    // # patterns - a dictionary of patterns in the following format:
    // # {"(.+)_controller.rb": ["*/the/paths/$1/**", "*/test/$1_controller_test.rb"]}
    // #
    // # The glob paths will have their $i replaced by the matched groups within the file name
    // # matcher.
  var relatedFiles = function(file_path, patterns, root_folder){
    var files = [];
    for(var pattern in patterns){
      var re = new RegExp(pattern);
      if(re.test(file_path) === true){
        for(var regex_template in patterns[pattern]){
          var expanded_path = file_path.replace(re, patterns[pattern][regex_template]);
          // console.log(expanded_path);
          expanded_path = path.join(root_folder, expanded_path);
          if(expanded_path.contains("**")){
            var globbedFiles = glob.sync(expanded_path);
            for(var idx in globbedFiles){
              if(fs.statSync(globbedFiles[idx]).isFile()) files.push(globbedFiles[idx]);
            }
          }else{
            if(fs.existsSync(expanded_path)) files.push(expanded_path);
          }
        }
      }
    }
    return files;
  };
  
  module.exports.relatedFiles = relatedFiles;
}).call(this);