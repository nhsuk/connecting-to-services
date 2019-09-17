# Scripts

See [https://github.com/github/scripts-to-rule-them-all](https://github.com/github/scripts-to-rule-them-all)
for additional background on these scripts.

Below is a list of scripts available, along with a simple description of
what each one does. The details of what they are doing is available within the
script.

[`backstop`](backstop)
Runs BackstopJS in the [BackstopJS Docker container](https://hub.docker.com/r/backstopjs/backstopjs/). If the script is called without passing any arguments the BackstopJS binary will be called with no arguments. This will result in the help text being returned where additional information about how to interact with the binary can be discovered.
In order to run the tests, the `backstop` script must be run with the appropriate command e.g. running `./scripts/backstop test` runs the tests as defined in the config file `./backstop-tests/backstop.js`
The most common commands to be run are `test` and `approve`.

[`bootstrap`](bootstrap)
Installs project's direct dependencies e.g. npm packages.

[`deploy`](deploy)
Clone [ci-deployment](https://github.com/nhsuk/ci-deployment.git) repo and
execute `deploy` script.

[`pre-bootstrap`](pre-bootstrap)
Directs towards base development machine setup.

[`start`](start)
Starts the application a Docker container. Available at:
`http://localhost:3000`

[`test`](test)
Starts a Docker container specifically for continually running tests.

[`test-ci`](test-ci)
Runs the tests in a Docker container once so that an exit code is reported and
can be used by the CI server.
