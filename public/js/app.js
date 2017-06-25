console.log('App.js here');

const loginForm = $('#log');
const regForm = $('#reg');
const signTab = $('.tab')[0];
const joinTab = $('.tab')[1];

signTab.addEventListener('click', () => {
  regForm.hide();
  loginForm.show();
});
joinTab.addEventListener('click', () => {
  regForm.show();
  loginForm.hide();
});
