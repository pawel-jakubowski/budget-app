var coreEvents = appRequire('core/events.js');
var viewEvents = appRequire('view/events.js');
var https = require('https');
var fs = require('fs');
var path = require('path');
var user = 'pawel-jakubowski';
var repo = 'budget-app';
var progress = 0;

var appInfoFile = "package.json";
var appVersion = "";
var appWaitForInfo = false;

var appContentDir = /*process.platform != 'darwin') ? "resources/app/" : */
  appRootDir;
var updateDir = appContentDir + "/update_files";

$.getJSON(appContentDir + "/" + appInfoFile).then(function(data) {
  console.log("BudgetApp version: " + data.version);
  coreEvents.appInfoReady.info = data;
  $(document).trigger(coreEvents.appInfoReady);
});

$(document).on(coreEvents.appInfoReady.type, function(e) {
  appVersion = e.info.version;
  if (appWaitForInfo)
    $(document).trigger(coreEvents.appCheckUpdate);
});

$(document).on(coreEvents.appCheckUpdate.type, function() {
  var request = https.get(new fileOptions(user, repo, appInfoFile), function(response) {
    var output = "";
    response.on("data", function(chunk){
      output += chunk.toString('utf8');
    }).on("end", function(){
      output = JSON.parse(output);
      coreEvents.appUpdateInfo.newVersion = output.version;
      coreEvents.appUpdateInfo.currentVersion = appVersion;
      coreEvents.appUpdateInfo.updateNeeded = isGreaterVersion(appVersion, output.version);
      $(document).trigger(coreEvents.appUpdateInfo);
    });
  });
});

module.exports = {
  updateApplication: updateApplication
};

function updateApplication() {
  if (appVersion === "")
    appWaitForInfo = true;
  else
    $(document).trigger(coreEvents.appCheckUpdate);
}

function isGreaterVersion(oldVersion, newVersion) {
  console.log("compare " + oldVersion + " with " + newVersion);
  var oldVersion = oldVersion.split('.');
  var newVersion = newVersion.split('.');
  return parseInt(newVersion[0]) > parseInt(oldVersion[0]) ||
    parseInt(newVersion[1]) > parseInt(oldVersion[1]) ||
    parseInt(newVersion[2]) > parseInt(oldVersion[2]);
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
      console.log("create directory: " + dirpath);
      var parts = dirpath.split(path.sep);
      for( var i = 1; i <= parts.length; i++ ) {
        mkdirSync( path.join.apply(null, parts.slice(0, i)) );
      }
    }
    mkdirpSync(updateDir + "/" + file.path);
  });
}

function downloadFiles(files) {
  console.log("download files");
  var filesCount = files.length;
  var filesSended = new Array(filesCount);
  console.log(files);
  $.each(filesSended, function(index, fileSended) { filesSended[index] = false; });
  $.each(files, function(index, file) {
    var filePath = updateDir + "/" + file.path;
    var newFile = fs.createWriteStream(filePath);
    fs.exists(updateDir, function(exists){
      if(!exists) {
        console.log("ERR: Update directory does not exists!");
        return;
      }
    });
    newFile.on('open', function(fd) {
      var request = https.get(new fileOptions(user, repo, file.path), function(response) {
        response.pipe(newFile);
        response.on("end", function() {
          filesSended[index] = true;
          var filesNotSendedYet = $.map(filesSended, function(val,key){ if(!val) return val;});
          var completedInPercent = 100 - parseInt((filesNotSendedYet.length * 100) / filesCount);
          viewEvents.appUpdateProgress.value = completedInPercent;
          $(document).trigger(viewEvents.appUpdateProgress);
          if (filesNotSendedYet.length == 0)
            finishUpdate();
        });
      });
    });
  });
}

function finishUpdate() {
  moveDownloadedFiles();
  $(document).trigger(coreEvents.appUpdateCompleted);
}

function moveDownloadedFiles() {
  fs.rename(updateDir, appContentDir);
}
