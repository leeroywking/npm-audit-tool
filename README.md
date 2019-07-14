# NPM Audit fixer

## Requirements
* github account with potential vulnerabilities 
* desire to fix those vulnerabilities
* personal access token for github account
* non-risk adverse mindset
* nodejs/npm on your system already
* time to let it run 
* this tool is hacky
  * Duplicate names are not handled well ATT
  * if this applies to you then do it for each org 1 at a time
  * this will hit the github api a fair amount
  * this takes a really long time to run
  * these make commits to your master branch directly
  * use at your own risk


## Instructions for use 
* clone this repo down to your system
* add the usernames for all the organizations you want updated 
* then cd into that directory
* run index from within that garbage folder
* below is full list of commands

```
git clone 
mkdir garbage
cd garbage
node ../index.js
```