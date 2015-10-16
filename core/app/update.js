var coreEvents = appRequire('core/events.js');
var viewEvents = appRequire('view/events.js');
var https = require('https');
var fs = require('fs');
var path = require('path');
var user = 'pawel-jakubowski';
var repo = 'budget-app';
var progress = 0;

var appInfoFile = "package.json";
$.getJSON(appRootDir + '/' + appInfoFile).then(function(data) {
  console.log("BudgetApp version: " + data.version);
  coreEvents.appInfoReady.info = data;
  $(document).trigger(coreEvents.appInfoReady);
});

module.exports = {
  updateApplication: updateApplication
};

function updateApplication() {
  $(document).on(coreEvents.appInfoReady.type, function(e) {
    var request = https.get(new fileOptions(user, repo, appInfoFile), function(response) {
      var output = "";
      response.on("data", function(chunk){
        output += chunk.toString('utf8');
      }).on("end", function(){
        output = JSON.parse(output);
        console.log("compare " + e.info.version + " with " + output.version);
        if (e.info.version < output.version) {
          coreEvents.appUpdateAvailable.newVersion = output.version;
          coreEvents.appUpdateAvailable.currentVersion = e.info.version;
          $(document).trigger(coreEvents.appUpdateAvailable);
        }
      });
    });
  });
}

$(document).on(coreEvents.appUpdateStart.type, function() {
  console.log("Start updating...");
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
});

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
    if (process.platform != 'darwin')
      mkdirpSync("resources/app/" + file.path);
    else
      mkdirpSync(appRootDir + "/Contents/Resources/app/" + file.path);
  });
}

function downloadFiles(files) {
  console.log("download files");
  var filesCount = files.length;
  var filesSended = new Array(filesCount);
  console.log(files);
  $.each(filesSended, function(index, fileSended) { filesSended[index] = false; });
  $.each(files, function(index, file) {
    var filePath = appRootDir + "/" + file.path;
    var newFile = fs.createWriteStream(filePath);
    var request = https.get(new fileOptions(user, repo, file.path), function(response) {
      response.pipe(newFile);
      response.on("end", function() {
        filesSended[index] = true;
        var filesNotSendedYet = $.map(filesSended, function(val,key){ if(!val) return val;});
        var completedInPercent = 100 - parseInt((filesNotSendedYet.length * 100) / filesCount);
        viewEvents.appUpdateProgress.value = completedInPercent;
        $(document).trigger(viewEvents.appUpdateProgress);
        if (filesNotSendedYet.length == 0)
          $(document).trigger(coreEvents.appUpdateCompleted);
      });
    });
  });
}
