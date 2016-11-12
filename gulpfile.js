var gulp = require('gulp');

var path = require('path');
var fs = require('fs');
var assert = require('assert');
var EL_VERSION = '1.4.6';

gulp.task('clear',()=>{
  var del = require('del');
  return del([
    'app/node_modules/lodash/!(lodash.js|package.json)',
    'app/node_modules/moment/!(moment.js|package.json)'
  ]);
});

gulp.task('pack', ['clear'],clbk=>{
  var elpack = require('electron-packager');
  var opt = {
    asar:true,
    arch:'x64,ia32',
    dir:'app',
    platform:'win32',
    out:'pack',
    version:EL_VERSION,
    icon:'img/logo.ico'
  };
  elpack(opt, (e)=>{
    assert(!e, e);
    clbk();  
  });
});
gulp.task('build', clbk=>{
  var env = process.env;
  var pgfiles = env['ProgramFiles(x86)'] || env.ProgramFiles;
  console.log(pgfiles);
  var iscc = path.join(pgfiles, 'Inno Setup 5', 'iscc.exe');
  assert(fs.existsSync(iscc), 'Inno setup does not found in normal install folder');
  var installerScript = 'installer/myl2.iss';
  var spawn = require('child_process').spawn;
  var proc = spawn(iscc, [installerScript]);
  proc.stdout.on('data',data=> process.stdout.write(data.toString()));
  proc.on('close', ()=>{
    clbk();
  });
});