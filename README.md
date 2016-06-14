# gp-to-services

Connecting the user journey from GP details to services

## Environment variables

Environment variables are loaded by the
[dotenv](https://www.npmjs.com/package/dotenv) package. If the value is already
set in the environment it will be used otherwise the value in the file will
be used. If there is no file a warning will be issued when the application
starts but it will continue to function.

Values will be loaded from the `.env` file, in the root of the project. This
is ignored by git, in order to know what variables are required by the
application the file `.env.required` lists them.
