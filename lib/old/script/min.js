/**
 * 压缩脚本
 * @author: SimonHao
 * @date:   2015-11-02 14:25:21
 */

'use strict';

var uglifyjs = require("uglify-js");
var path     = require('path');
var fs       =  require('fs');
var glob     = require('glob');
var page     = require('made-build-page');
var file     = require('made-build-file');
var async    = require('async');

module.exports = function(build_path, build_model, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){

      files.forEach(function(file_name){
        page.set(file_name).script().forEach(function(script_info){
          var file_info = file.get(script_info.src);
          var file_path = file_info.dist();

          if(!file_info.__min){
            file_info.__min = true;
            fs.writeFileSync(file_path, uglifyjs.minify(file_path).code);
          }
        });
      });

      console.info('· success - min script');
      done();
    });
  }else{
    done();
  }
};