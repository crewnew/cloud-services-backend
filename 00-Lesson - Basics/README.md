# Basics

When creating a database (DB), common sense dictates that we use separate tables for different types of entities. Some examples are: customers, orders, items, messages etc. But we also need to have relationships between these tables. For instance, customers make orders, and orders contain items. These relationships need to be represented in the database.

## One to Many (O2M) and Many to One (M2O) Relationships

This is the most commonly used type of relationship. Consider an e-commerce website, with the following:

* Customers can make many orders.
* Orders can contain many items.
* Items can have descriptions in many languages.

In these cases we would need to create "One to Many" relationships. Here is an example:

![Customers](customers.png)

![Orders](orders.png)

Each customer may have zero, one or multiple orders. But an order can belong to only one customer.

![O2M](o2m.png)

## Many to Many Relationships (M2M)

In some cases, you may need multiple instances on both sides of the relationship. For example, each order can contain multiple items. And each item can also be in multiple orders.

For these relationships, we need to create an extra table:

![M2M tables](m2m-tables.png)

The `items_orders` table has only one purpose, and that is to create a "Many to Many" relationship between the items and the orders. In M2M relationship we need always a `joint table` to connect the two tables that need M2M relationship between them.

Here is a how we can visualize this kind of relationship:

![M2M](m2m_1.png)

If you want to include the `items_orders` records in the graph, it may look like this:

![M2M](m2m_2.png)

## Self Referencing Relationships

This is used when a table needs to have a relationship with itself. For example, let's say you have a referral program. Customers can refer other customers to your shopping website. The table may look like this:

![Referrals](customers_referrals.png)

Customers 102 and 103 were referred by the customer 101.

This actually can also be similar to "one to many" relationship since one customer can refer multiple customers. Also it can be visualized like a tree structure:

![Self referencing](self_referencing.png)

One customer might refer zero, one or multiple customers. Each customer can be referred by only one customer, or none at all.

If you would like to create a self referencing "many to many" relationship, you would need an extra table like just like we talked about in the last section.

## Definitions: Foreign Keys and Primary Keys

In the relationship examples above, we always had these "****_id" fields that referenced a column in another table. In our example, the `customer_id` column in the `orders` table is a Foreign Key (FK) column. 

The FK has M2O relationship to the `orders` table Primary Key (PK) column. The PK column is the column that uniquely identifies each row in the table. It is a good practice to always have the first column and call it `id`. In our example it is `integer` type that is the simplest and was standard at antique times. Today it is rather UUID (Universally Unique Identifier) that is used as PK and that looks something like this `5e8a48dc-a0f7-11ee-8c90-0242ac120002`.

## One to One Relationships (O2O)

Let's say we have two types of customers: regular customers and resellers. So for the most of the customers we do not need the information that resellers need so we don't want to keep the reseller information in the `users` or `customers` table. So we create a separate table for `resellers` for that purpose and store such data there. In that case we need O2O relationship between `customers` and `resellers` tables. Reselles table will have `customer_id` FK to the `customers` table PK in the same way we would have O2M relationship. The difference is that just one record can represent just one record in both tables.