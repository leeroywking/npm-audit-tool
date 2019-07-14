'use strict'
const token = require('./.env.js')
//contents of this file are a single line in this syntax
// module.exports = 'THIS_IS_A_GITHUB_PERSONAL_ACCESS_TOKEN'
//this is necessary if you have a large number of repos instructions for generating one of these can be found here 
// https://github.com/settings/tokens
// if you have a small number of repos or want to handle your authentication your way comment out the line annotated below

const superagent = require('superagent');
const fs = require('fs');
const usernames = ['leeroywking-401-advanced-javascript', 'leeroywking', 'storyadventure', 'fmla-leave-assistant'];
const shell = require('shelljs');
let urlArray = [];
let promiseArray = [];
let folderArray = [];


usernames.forEach(user => {
  promiseArray.push(superagent.get(`https://api.github.com/users/${user}/repos`)
    .set('User-Agent', `${user}`)
    // this authorization line is necessary if you want to make a larger number of requests
    .set('Authorization', `token ${token}`)
    .then(data =>
      data.body.forEach(datum =>
        urlArray.push(datum.url.replace(/api\./, '').replace(/repos\//, '') + '.git\n')))
  )
})
shell.cd('repo-folder');

Promise.all(promiseArray)
  .then(promises => {
    fs.writeFile(`./urlList.txt`, urlArray.join(''), (err) => {
      if (err) { throw err; }
      console.log('The file has been saved!')
      return true
    })
  })
  .then(variable => {
    urlArray.forEach(url => {
      folderArray.push(url.split('/')[4].split('.')[0])
      shell.exec(`git clone ${url}`);
    })
  })
  .then(after => {
    folderArray.forEach(folder =>{
      shell.cd(folder);
      shell.exec('npm audit fix');
      shell.exec('git add .');
      shell.exec(`git commit -m "automated vulnerability patching on ${new Date()}`);
      shell.exec('git push origin master');
      shell.cd('..');
    })
  })
  .catch(err => console.error(err))

