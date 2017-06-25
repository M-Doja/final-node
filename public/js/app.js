console.log('App.js here');


var lWrap = $('#login-wrap');
var rWrap = $('#register-wrap');
var sB = $('#sBtn');
var jB = $('#jBtn');

// lWrap.hide()
rWrap.hide();
sB.hide();
jB.on('click', function(){
  lWrap.hide();
  rWrap.show();
  sB.show();
  jB.hide();
});
sB.on('click', function(){
  rWrap.hide();
  lWrap.show();
  sB.hide();
  jB.show();
});
