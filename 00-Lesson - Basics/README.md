# Basics

## One to Many and Many to One Relationships

This is the most commonly used type of relationship. Consider an e-commerce website, with the following:

* Customers can make many orders.
* Orders can contain many items.
* Items can have descriptions in many languages.

In these cases we would need to create "One to Many" relationships. Here is an example:

![Customers](customers.png)

![Orders](orders.png)

Each customer may have zero, one or multiple orders. But an order can belong to only one customer.

![O2M](o2m.png)

## Many to Many Relationships

In some cases, you may need multiple instances on both sides of the relationship. For example, each order can contain multiple items. And each item can also be in multiple orders.

For these relationships, we need to create an extra table:

![M2M tables](m2m-tables.png)

The Items_Orders table has only one purpose, and that is to create a "Many to Many" relationship between the items and the orders.

Here is a how we can visualize this kind of relationship:

![M2M](m2m_1.png)

If you want to include the items_orders records in the graph, it may look like this:

![M2M](m2m_2.png)