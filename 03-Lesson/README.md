# 03 - Lesson

## Homework check
### 1. As a admin, I want to get the total amount of all invoices for a specific company. I want to be able to find the company by remembering just part of its name.

### 2. As an admin, I want to be able to mass delete bookings for a specific room between specific date range.

I have used a timezone for the time `+01` that is central European time. Actually I like to use UK time mostly because I'm in Europe and work with other European people in Central and Western Europe so it makes easier for this use case. In Estonia at the moment is DST (daylight saving time) `+03` and in the winter `+02` and if I knew all the users are from the same timezone I would surely go with that timezone. In this example, correct is with timezone already because it is a physical room booking and that room is in a specific timezone.

I would use the timezone also when signing some contracts or any other legal reasons. Then we want to have the user's local timestamp with timezone.

At most cases, it is preferrable using UTC (Coordinated Universal Time) - letter Z at the end. Why?

Consistency! Always good thing! UTC ensures that you have a consistent time base, regardless of where your users are located. And easier to compare and sort timestamps. And it avoids potential issues with time zone differences. And daylight saving time changes. Pretty many advatages, right?

Also flexibility. By storing data in UTC, you can easily convert it to any other time zone when presenting it to users. Useful again for apps with users in multiple time zones or when users traveling between time zones.

## Use CLI (command line interface)

1. Install Hasura CLI:

Download the appropriate binary for your operating system from the official Hasura CLI GitHub releases page: https://github.com/hasura/graphql-engine/releases

It's under "Assets" at the bottom: https://i.imgur.com/c99841v.png

Save the file wih name `hasura.exe` under the folder you will create the folder with Hasura metadata, migrations and seeds. On UNIX terminal:

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

Run the following command from the project directory in VSCode: `hasura console`

5. `hasura metadata export`

This command will export the metadata and create a metadata directory inside your Hasura project folder with files like `tables.yaml` or `query_collections.yaml`/`rest_endpoints.yaml` with REST queries, [relations/permissions](https://github.com/crewnew-git/cloud-services-backend/blob/main/metadata/databases/default/tables/public_rooms.yaml) etc., depending on the features you've used in your Hasura instance.

6. To export the migrations, run the following command:

`hasura migrate create <migration_name> --from-server`(name, eg.`init`)

This command will create a new folder inside the migrations directory with the given migration name and a timestamp/version. The folder will contain two files: up.sql and down.sql, representing the forward and backward migration steps, respectively. Initial one won't have down.

7. Commit/push
8. Modify your schema using the localhost Hasura console
9. Commit/push. Now you should see something like this: https://github.com/crewnew-git/cloud-services-backend/commit/cad357e0d41410e1d8825ab9f53554d1ddeb6ac9
10. Once imaginary co-workers have approved, they will:

`hasura metadata apply`
and
`hasura migrate apply`

If you see the message "nothing to apply on database: default" even though there are new migrations in your migrations directory, it's possible that the migration status is out of sync between your local Hasura project and your Hasura instance.

Reset the migrations on your Hasura instance: `hasura migrate apply --down all` This command will undo all applied migrations on your Hasura instance. Be careful when using this command, as it may result in data loss or schema changes.

Apply the migrations again: `hasura migrate apply` This command should now apply all migrations in your migrations directory, including the new changes.

More about CLI in the documentation: https://hasura.io/docs/latest/hasura-cli/commands/hasura_migrate_create/

## Relationships

### Repeat the super important FK (foreign key) in O2M
FK from the plural side (many side) to the PK (primary key) in the singular side.
![](images/Relationships%201%20-%20Foreign%20key.png)

### O2O
![](images/Relationships%202%20-%20one2one.png)
![](images/Relationships%203%20-%20why%20one2one%20and%20in%20Hasura.png)

### Enum (enumerated)
Specific type of table that contains a predefined list of values. Enum tables are often used when you have a column that should only accept a limited number of distinct values. For example, a "status" column could have values like "pending", "approved", or "rejected". What else could be Eenum in our schema?

Create enum-roles (customer, vip, manager, worker)

Update (test) data query.

Create the foreign key. Which side? But don't go to the permissions. I show you another smart shortcut: `/console/data/default/schema/public`

Test it out. Get all the workers user data. 

## Predicate

When you use an aggregate functions like `count`, `average` etc. you can filter the results based on a condition(s) using the `predicate` property. 

### 3. As a marketing manager, I want to email some marketing stuff to all the users who haven't made any bookings.

## `_and`, `_or` and `_not` operators

You can use `_and`, `_or` and `_not` operators between your conditions and let's bring a complex example: 

(field1 = "value1" 
  AND 
  (field2 = "value2" 
    OR 
    field3 = "value3"
    )
  ) 
AND 
(field4 ≠ "value4")

```
where: {
  _and: [
    {
      field1: {_eq: "value1"},
      _or: {
        field2: {_eq: "value2"},
        field3: {_eq: "value3"}
      }
    },
    {
      _not: {
        field4: {_eq: "value4"}
      }
    }
  ]
}
```

## Violation

From the [book](https://crnw.uk/hasurali):

`Restrict` is the Hasura’s default option as the name says it restricts you, for example, update or delete the role “customer” if there is at least one user with that role. Most probably it is fine when deleting because when someone by mistake tries to delete the `customer` role we will want to prevent it if some users have that role. 

`No action` is pretty much the same. You can not delete the `customer` role. There will be no (delete) action when you try to delete. The difference really is when the check is made `restrict` will check in the beginning and `no action` at the end. So do you want the whole query fail or do you want everything happen and just the constrait violation to fail?

When we update the name of the `customer` role for example to `customer_vip` then with the `cascade` option all the users with the `customer` role will become `customer_vip`. In case of delete it is dangerous because when we delete the `customer` role from the enum table, all the users with that role will be deleted. 

Well, we might want that in some situations but remember that the `cascade` is the most dangerous one when it comes to deleting.

`set null` and `set default` are the easiest to understand probably as on deletion or updating the `customer` role all the users will either have their role NULL or set to default.

Delete cascade makes sense sometimes, too: when you delete the user then you may want to also delete all the reviews made by the user but hell no all the invoices from the accounting😄

## Upsert

It is an insert mutation with on_conflict argument that will first check if there’s no conflict with another row in the table. If there is any conflict then it will instead of inserting a new record, update the existing one or ignore the request.

Example: Insert a new object in the `article` table or, if the unique constraint `article_title_key` is violated, update the `content` and `title` columns of the existing article:

```
mutation UpsertArticle {
  insert_article (
    objects: [
      {
        title: "Article name",
        content: "Updated article 1 content",
        published_on: "2022-10-12"
      }
    ],
    on_conflict: {
      constraint: article_title_key,
      update_columns: [content, title]
    }
  ) {
    returning {
      id
      title
      content
      published_on
    }
  }
}
```

Now make yourself a query where we inser some user data and if the email address exists then update the user.

## User story 1: As a customer I want to add reviews for the rooms

Need to makse some changes in the database but first, please help your customer to properly write this user story. 

## Hints
* Play button at GraphiQL can execute only one query if you have multiple there