'use strict'
// const token = require('./.env.js')
//contents of this file are a single line in this syntax
// module.exports = 'THIS_IS_A_GITHUB_PERSONAL_ACCESS_TOKEN'
//this is necessary if you have a large number of repos instructions for generating one of these can be found here 
// https://github.com/settings/tokens
// if you have a small number of repos or want to handle your authentication your way comment out the line annotated below

const superagent = require('superagent');
const fs = require('fs');

// these are the usernames you can find them in the url for any repo you control 
// for example here https://github.com/leeroywking/npm-audit-tool the username is leeroywking 
const usernames = ['leeroywking-401-advanced-javascript', 'leeroywking','leeroywking-schoolin'];

const shell = require('shelljs');
let urlArray = [];
let promiseArray = [];
let repoArray = [];


usernames.forEach(user => {
  promiseArray.push(superagent.get(`https://api.github.com/users/${user}/repos`)
    .set('User-Agent', `${user}`)
    // this authorization line is necessary if you want to make a larger number of requests
    // if you get a failure message that mentions being throttled you will need this line
    // .set('Authorization', `token ${token}`)
    .then(data =>
      data.body.forEach(datum =>
        urlArray.push(datum.url.replace(/api\./, '').replace(/repos\//, '') + '.git\n')))
  )
})


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
      repoArray.push(url.split('/')[4].split('.')[0])
      shell.exec(`git clone ${url} `);
    })
  })
  .then(after => {
    repoArray.forEach(repo =>{
      shell.cd(repo);
      shell.exec('npm audit fix ');
      shell.exec('git add . ');
      shell.exec(`git commit -m "automated vulnerability patching on ${new Date()}" `);
      shell.exec('git push origin master ');
      shell.cd('..');
    })
  })
  .catch(err => console.error(err))

