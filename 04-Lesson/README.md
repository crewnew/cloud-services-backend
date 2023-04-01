# Lesson 4

## Hasura CLI (command line interface) 

1. Install Hasura CLI:

Console is GUI (graphical user interface). Now [download the latest version of the Hasura CLI](https://github.com/hasura/graphql-engine/releases). Scoll down and find under the assets: https://i.imgur.com/KmjgZV4.png On Windows save the file in the root folder where you keep your repos in your computer as `hasura.exe`

On UNIX terminal:

`curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | INSTALL_PATH=/usr/local/bin bash`

2. Set up a new Hasura project:

To create a new Hasura project, open a terminal, navigate to your desired directory, and run the following command: `hasura init cloud-services-hasura`

This will create a new directory called `cloud-services-hasura` with the necessary configuration files.

3. Create [.gitignore](https://github.com/crewnew-git/cloud-services-backend/blob/main/.gitignore) file

4. Move `config.yml` away from the folder temporarily, create a repo from the folder & commit/puh. Add the configuration file back.

5. Configure your Hasura project:

Open the folder in VSCode. CD to it and `code .`. Open the `config.yaml` file in your favorite text editor and update it according to [../hasura/config.yaml](../hasura/config.yaml)

NOTE: If not Cloud, then endpoint must end with `/v1/graphql` of course!!! Hasura CLI requires the root endpoint of the Hasura Cloud project without the /v1/graphql path. WEIRD!

4. Run Hasura console:

Run the following command from the project directory in VSCode: `hasura console` or if you are allowed to work in production environment (or dev environment in server) you can `hasura console --endpoint "https://cloud-services.hasura.app" --admin-secret "your-secret-here"`

1. `hasura metadata export`

This command will export the metadata and create a metadata directory inside your Hasura project folder with files like `tables.yaml` or `query_collections.yaml`/`rest_endpoints.yaml` with REST queries, [relations/permissions](https://github.com/crewnew-git/cloud-services-backend/blob/main/metadata/databases/default/tables/public_rooms.yaml) etc., depending on the features you've used in your Hasura instance.

6. To export the migrations, run the following command:

`hasura migrate create <migration_name> --from-server`(name, eg.`init`)

This command will create a new folder inside the migrations directory with the given migration name and a timestamp/version. The folder will contain two files: up.sql and down.sql, representing the forward and backward migration steps, respectively. Initial one won't have down.

7. Commit/push
8. Modify your schema using the localhost Hasura console
9. Commit/push. Now you should see and track changes: https://github.com/crewnew-git/cloud-services-backend/commit/4325bcb5c54e01c92f45e57f5198ed9b58df8595
10. Once imaginary co-workers have approved, they will:

`hasura metadata apply`
and
`hasura migrate apply`

If you see the message "nothing to apply on database: default" even though there are new migrations in your migrations directory, it's possible that the migration status is out of sync between your local Hasura project and your Hasura instance.

Reset the migrations on your Hasura instance: `hasura migrate apply --down all` This command will undo all applied migrations on your Hasura instance. Be careful when using this command, as it may result in data loss or schema changes.

Apply the migrations again: `hasura migrate apply` This command should now apply all migrations in your migrations directory, including the new changes.

### hasura migrate squash

If you have a lot of migrations that you want to squash into a single one:

`hasura migrate squash --name "<name>" --from 1680098627629 -to 1680116894316` - if you want 'em all do not use `-to`

[Squash documentation](https://hasura.io/docs/latest/hasura-cli/commands/hasura_migrate_squash/) and [All CLI commands doc](https://hasura.io/docs/latest/hasura-cli/commands/index/).