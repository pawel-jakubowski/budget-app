var coreEvents = appRequire('core/events.js');
var viewEvents = appRequire('view/events.js');
var https = require('https');
var fs = require('fs');
var path = require('path');
var progress = 0;

var appInfoFile = "package.json";
var appInfo = {};
var appWaitForInfo = false;

var appContentDir = appRootDir;
var relativeUpdateDir = "";
var updateDir = appContentDir;

$.getJSON(appContentDir + "/" + appInfoFile).then(function(data) {
  console.log("BudgetApp version: " + data.version);
  appInfo = data;
  coreEvents.appInfoReady.info = data;
  $(document).trigger(coreEvents.appInfoReady);
});

$(document).on(coreEvents.appInfoReady.type, function(e) {
  if (appWaitForInfo)
    $(document).trigger(coreEvents.appCheckUpdate);
});

$(document).on(coreEvents.appCheckUpdate.type, function() {
  var user = appInfo.repository.author;
  var repo = appInfo.repository.name;
  var request = https.get(new fileOptions(user, repo, appInfoFile), function(response) {
    var output = "";
    response.on("data", function(chunk){
      output += chunk.toString('utf8');
    }).on("end", function(){
      output = JSON.parse(output);
      coreEvents.appUpdateInfo.newVersion = output.version;
      coreEvents.appUpdateInfo.currentVersion = appInfo.version;
      coreEvents.appUpdateInfo.updateNeeded = isGreaterVersion(appInfo.version, output.version);
      console.log("update needed? " + coreEvents.appUpdateInfo.updateNeeded);
      $(document).trigger(coreEvents.appUpdateInfo);
    });
  });
});

module.exports = {
  updateApplication: updateApplication
};

function updateApplication() {
  if (!appInfo.hasOwnProperty("version"))
    appWaitForInfo = true;
  else
    $(document).trigger(coreEvents.appCheckUpdate);
}

function isGreaterVersion(oldVersion, newVersion) {
  console.log("compare " + oldVersion + " with " + newVersion);
  var oldVersion = oldVersion.split('.');
  var newVersion = newVersion.split('.');
  var oldVersionInt = [parseInt(oldVersion[0]), parseInt(oldVersion[1]), parseInt(oldVersion[2])];
  var newVersionInt = [parseInt(newVersion[0]), parseInt(newVersion[1]), parseInt(newVersion[2])];
  var majorIsGreater = newVersionInt[0] > oldVersionInt[0];
  var majorIsEqual = newVersionInt[0] === oldVersionInt[0];
  var minorIsGreater = newVersionInt[1] > oldVersionInt[1];
  var minorIsEqual = newVersionInt[1] === oldVersionInt[1];
  var patchIsGreater = newVersionInt[2] > oldVersionInt[2];

  if (majorIsGreater) {
    return true;
  }
  else if (majorIsEqual) {
    if (minorIsGreater) {
      return true;
    }
    else if (minorIsEqual) {
      return patchIsGreater;
    }
  }
  return false; // fallback
}

$(document).on(coreEvents.appUpdateStart.type, function() {
  console.log("Start updating...");
  var user = appInfo.repository.author;
  var repo = appInfo.repository.name;
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
  this.path = '/repos/' + user + '/' + repo + '/git/trees/' + appInfo.repository.sha +'?recursive=1';
  this.method = 'GET';
  this.headers = {'user-agent': 'node.js'};
};

function fileOptions(user, repo, filePath) {
  this.host = 'raw.githubusercontent.com';
  this.path = '/' + user + '/' + repo + '/' + appInfo.repository.branch + '/' + filePath;
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
        var dirpath = appContentDir + "/" + path
        console.log("create directory: " + dirpath);
        fs.mkdirSync(dirpath);
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
    mkdirpSync(relativeUpdateDir + "/" + file.path);
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
      var user = appInfo.repository.author;
      var repo = appInfo.repository.name;
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
  $(document).trigger(coreEvents.appUpdateCompleted);
}
