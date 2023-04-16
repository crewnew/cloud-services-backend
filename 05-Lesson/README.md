# Lesson 5

## Homework

1. Check the Vanilla JS example done with Firebase from Chapter 11, page 15: https://discord.com/channels/1088000003710124093/1088000004880351297/1096406422335537203
2. Build on your own using React, VanillaJS or whatever you wish simple email/password register/login and give the registered user "customer", "client" or some sensible role you have.
3. Feel free to re-use your previously written React code, some template, whatever you wish.
4. Finally you shall create a permission for the role in Hasura so that user can see only own invoices when logged in and then running the following query from front-end should not show all the invoices:

```
query GetInvoices {
  invoices {
    date
        company_id
        id
        user_id
        amount
        status
        created_at
        updated_at
  }
}
```

Want to get grade 5 for this, too? Make it looks nice and decent so that I could look at it and say "yeah, let's ship it to the customer."

## Subscriptions

1. What they are?
2. Two different types

## Actions

If I had to explain as simple as possible: think of it as a event that also gets response back.

## Group work: e-shop

1. Group size 3? Or 2 or 4? Ask GPT?

2. Draw wireframes in [Whimsical](https://whimsical.com/) and ER diagram. Best team gets 5

### 3.1. Directus

Let's set up CMS/admin panel with [Directus](https://directus.io) for the e-shop and learn that Hasura isn't the only GraphQL engine. Why not to use only Directus? Yeah, you can for a "cheap" and simple e-shop. You can go even cheaper and use WordPress (WP) and WooCommerce and create old-school multi-page application (MPA) instead of single-page application (SPA) that you do with modern front-end frameworks like React, Svelte, Vue or Angular. OK, so we hate WP so still why Hasura? Well, well, well. Directus is low-funded enthusiast-driven and much less mature and much more buggy whereas in Hasura I have seen I think one bug during three years. It became 2022 unicorn meaning it's valuation is at least $1 billion. They got some World's top brains improving it constantly. Some Hasura features that Directus doesn't have: no subscriptions, no O2O relationship, no computed fields, no PostgreSQL views, no functions, triggers, missing most of the PosgreSQL brilliant native functionality, no actions, no remote schemas, no schemas at all, not blazing fast performance, sometimes API requests fail, no inherited roles, CLI doesn't have up/down migrations and metadata must be created manually, etc. You'll love it in the beginning but if you start using it as a API engine you'll see it is not that scalable and enterprise grade solid at all. Shortly: Directus is great admin panel and headless CMS but not enterprise grade super fast GraphQL API. Now we need admin panel for our e-shop so we are going to use Directus for that and keep using Hasura for the API engine. In cheaper projects you may use only Directus but then I suggest also to use REST API instead as Directus's GraphQL is crappier. Picking the right stack has a huge impact on any software project.

### 3.2. Install

You can use Docker and follow these [instructions](https://docs.directus.io/self-hosted/quickstart.html) or for playground activities you may save your RAM and just `npm init directus-project <project-name-here>` The idea is to connect the Directus to the same DB Hasura is connected. Create a new Hasura project for the e-shop and [from here](https://i.imgur.com/cGuvbtL.png) you get the DB connection strong from where you get the DB host, name, username, password (paste it to GPT if unsure what is what in the connection string and Postgres default port if not stated otherwise in the connection string). Create admin user & set password, then check edit your [.env like this](../directus/.env) and run npx `directus start`



### 3.3. Create tables and relations

If you create tables/relations from Hasura and then track them in Directus then you are very likely end up Directus crashing at one moment. It is pretty terrible pice of software in that terms - it is just damn brilliant to create any admin panels damn quick. Many people I have moved from spreadsheets to Directus and they love it. So, if we create tables/relations in Directus and then track them in Hasura, then we're much more safe and also make sure admin panel looks as nice and with good UX as we can get. Process to create and possibly delete things (because you make stupid tables, columns, relationships sometimes that need to be deleted):

- Create/edit/delete in Directus and make it look nice
- Export your changes `npx directus schema snapshot ./snapshot.yaml` and commit
- Track changes in Hasura if new table/relation was created and refresh metadata from console if column changes (localhost console, of course)
- `hasura migrate create <migration_name> --from-server` and commit

### 4. Back to Hasura

4.1. Create roles/permissions
4.2. Create queries for FE for multilingual homepage, contact us, categories, category products, single products

### Create in FE category page

We're not going to build the whole FE as we're about BE here, really.

## More advanced SQL functions

In e-shop let's imagine we are importing products from (various) suppliers and into `own_price` field is saved the price we pay for the products but let's imagine that we sell products with *1.5 profit margin when the price is <500€ and if products are more expensive then the profit margin is *1.4. I'm not that good in writing SQL functions so back in old days I would grab some existing examples and gobble it together. Now I used GPT and although it wasn't that quick (although still quicker than writing on my own). It suggested actually better approach than I planned in the beginning: instead of computed field that is not supported by Directus, it suggested to create a new field `price` and create a trigger that will store the sales price there every time when we create/update product. Now we can see the sales price also in admin panel. Solution:

Create the SQL function:
```
CREATE OR REPLACE FUNCTION calculate_product_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.own_price < 500 THEN
        NEW.price := NEW.own_price * 1.5;
    ELSE
        NEW.price := NEW.own_price * 1.4;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

```
And then create the trigger:
```
CREATE TRIGGER update_product_price
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION calculate_product_price();
```

Test it out, create or update product where you add for example 100 as `own_price` and if you check the product now you will see as expected the `price` 150.