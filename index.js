var express = require('express');
var bodyParser = require('body-parser');
var GitHubApi = require("github");

var port = process.env.PORT || 4646;

var github = new GitHubApi({
  version: "3.0.0",
  debug: true,
  timeout: 10000,
  headers: {
    "user-agent": "Persistent-PR"
  }
});

github.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});

var sourceBranch = process.env.SOURCE_BRANCH;
var targetBranch = process.env.TARGET_BRANCH;

var app = express();

app.use(bodyParser.json());

app.post('/hook', function (req, res) {
  console.log(req.body);

  if (req.body.ref === 'refs/heads/' + sourceBranch) {
    github.repos.getContent({
      user: process.env.REPO_OWNER,
      repo: process.env.REPO_NAME,
      path: '/.github/DEPLOYMENT_PULL_REQUEST_TEMPLATE.md',
      ref: sourceBranch
    }, function(err, fileContents) {
      var body = (err || !fileContents) ? '' : new Buffer(fileContents.content, 'base64').toString('utf8');

      // This will fail if there are not differences or if one is already open,
      // keeping things simple by always attempting it and ignoring errors.
      github.pullRequests.create({
        user: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
        title: sourceBranch + ' -> ' + targetBranch,
        head: sourceBranch,
        base: targetBranch,
        body: body
      }, function(err) {
        if (err) {
          console.error(err);
        }
      });
    });
  }

  res.end();
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
