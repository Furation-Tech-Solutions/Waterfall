# Setting up github secrets

The following documents basics to set secrets and variables for github action to function properly

## Pre-requisite
To follow further install [GitHub CLI](https://github.com/cli/cli#installation)

## creating gh_secret and gh_variable file
Copy/Rename `.gh_secrets.env_example` and `.gh_vars.env_example` to `.gh_secrets.env` and `.gh_vars.env` respectively
```shell
cp .gh_secrets.env_example .gh_secrets.env
cp .gh_vars.env_example .gh_vars.env
```

## Turn SSH Certificate to base64
Raw ssh certificate consists contain line breaks causing undesired behaviour with cli, converting it to to base64 not only removes newline charater but also improves durability but preserving newline character   Using [Base64](https://linux.die.net/man/1/base64) we'll be creating string to save it to our [github secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
```shell
cat ./path_to/ssh_cert | base64 -w 0
```
copy an resulting string and past it into `.gh_secrets.env` for CERTIFICATE_BASE64
alternative you can directly update key directly 
```shell
cat ./path_to/ssh_cert | base64 -w 0 | gh secret set CERTIFICATE_BASE64
```
## Updating vars and secrets gh 
We can set individual variables using [github cli](https://cli.github.com/) secret [set](https://cli.github.com/manual/gh_secret_set)
```shell
gh secret set SECRET_NAME secret_value
```
or else can be set using file 
```shell
gh secret set -f - < gh_secrets.env
```
similarly variables can be set
`gh variable set VAR_NAME var_value`
and `gh variable set -f - < gh_vars.env`
