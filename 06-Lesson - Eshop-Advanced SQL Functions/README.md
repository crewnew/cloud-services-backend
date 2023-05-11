# Lesson 6

## Homework check

Let's complete the admin panel

## Group work: e-shop

### 4. Back to Hasura

4.1. Create roles/permissions
4.2. Create queries for FE for multilingual homepage, contact us, categories, category products, single products
4.3. Create events/actions: new user email, new order SMS/email/discord, new invoice PDF, new invoice to accounting, external products, sync products, payment gateway, order delivery, email customer when shipped, etc. etc.

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

## Another advanced SQL functions example

https://crnw.uk/match

## Actions

If I had to explain as simple as possible: think of it as a event that also gets response back.