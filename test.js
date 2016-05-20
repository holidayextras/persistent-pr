var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    //protocol: "https",
    //host: "github.my-GHE-enabled-company.com", // should be api.github.com for GitHub
    timeout: 10000,
    headers: {
        "user-agent": "PR-Opener" // GitHub is happy with a unique user agent
    }
});