# Scripts

See [https://github.com/github/scripts-to-rule-them-all](https://github.com/github/scripts-to-rule-them-all)
for additional background on these scripts.

Below is a list of scripts available, along with a simple description of
what each one does. The details of what they are doing is available within the
script.

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
