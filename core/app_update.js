var https = require('https');
var fs = require('fs');
var path = require('path');
var user = 'pawel-jakubowski';
var repo = 'budget-app';

module.exports = {
  updateApplication: updateApplication
};

function updateApplication() {
  console.log(new treeOptions(user, repo));
  var request = https.get(new treeOptions(user, repo), function(response) {
    var output = "";
    response.on("data", function(chunk){
      output += chunk.toString('utf8');
    }).on("end", function(){
      output = JSON.parse(output);
      var repoDirs = getRepositoryDirectories(output.tree);
      createDirectories(repoDirs);
      var repoFiles = getUpdatableFiles(output.tree);
      downloadFiles(repoFiles);
    });
  });
}

function treeOptions(user, repo) {
  this.host = 'api.github.com';
  this.path = '/repos/' + user + '/' + repo + '/git/trees/HEAD?recursive=1';
  this.method = 'GET';
  this.headers = {'user-agent': 'node.js'};
};

function fileOptions(user, repo, filePath) {
  this.host = 'raw.githubusercontent.com';
  this.path = '/' + user + '/' + repo + '/master/' + filePath;
  this.method = 'GET';
  this.headers = {'user-agent': 'node.js'};
};

function getUpdatableFiles(tree) {
  var files = $.map(tree, function(val,key){
    if(val.type === 'blob' && !val.path.match(/^settings\//))
      return val;
  });
  return files;
}

function getRepositoryDirectories(tree) {
  var dirs = $.map(tree,function(val,key){
    if(val.type === 'tree')
      return val;
  });
  return dirs;
}

function createDirectories(dirs) {
  $.each(dirs, function(key, file) {
    var mkdirSync = function (path) {
      try {
        fs.mkdirSync(path);
      } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
      }
    }
    var mkdirpSync = function (dirpath) {
      var parts = dirpath.split(path.sep);
      for( var i = 1; i <= parts.length; i++ ) {
        mkdirSync( path.join.apply(null, parts.slice(0, i)) );
      }
    }
    mkdirpSync("/update/" + file.path);
  });
}

function downloadFiles(files) {
  $.each(files, function(key, file) {
    var filePath = appRootDir + "/update/" + file.path;
    var newFile = fs.createWriteStream(filePath);
    var request = https.get(new fileOptions(user, repo), function(response) {
      console.log("Save file: " + filePath);
      response.pipe(newFile);
    });
  });
}
