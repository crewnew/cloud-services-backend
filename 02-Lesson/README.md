# 02 - Lesson

[hasura.io/docs/latest/getting-started/docker-simple](https://hasura.io/docs/latest/getting-started/docker-simple)

### Finish 01-Lesson
Who finished. Teach others who need help.

### Github / Team Chat
* Everybody to GitHub team and team chat. 
* Install Discord on all devices
* Integrate Github to the Team Chat.
* Clone the repo
* Create your own branch

### Let's meet each other & questions from last lesson
Questions Kaspar will tell and you will answer verbally. Later you edit this file and add your question/answer as a separate file under `/answers`.

### Let's make a query from the internet

So, what's the point of the API? You give the endpoint and the API password to someone or make youerself a query from your app. 

I build SvelteKit apps, I think you do React/Next some and use vanialla JS? PHP? Anyway with JS you can just use ´fetch()´. But we can try it out with [Thunder Client for VSC](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client), [GraphQL Playground](https://github.com/graphql/graphql-playground) or similar. Sometimes some things don't work as you know and then it's good to have multiple tools in your toolbox. Eg. for this Hasura instance the docs doesn't work: https://i.imgur.com/zNGcYO0.png Some some web tools for your toolbox, too: https://reqbin.com (I like it for it's speed and no login needed) and https://www.postman.com/ (I like it because it has a huge amount of readymade requests for the popular different APIs and you can invite others to collaborate on queries).

History and saving queries in the repo ´.gql´ format.

### Hasura "Test GrphQL"
Did we learn the cool new button on the "Data" -> "Users" for example: 

### GrphiQL

Prettify (what's the keyboard shortcut in VSC?), History (and favoriting),  

### Limit and offset
Most use-cases for the limit: do not want to get too many if there's tons of data
Most use-cases for offset: pagination but also for example when I'm checking for the new data for example with CRON job (you know what it is?) then I will remember the last item ID and offset on the next request.

### Aggregation
If you look at the Explorer on the left and the documentation part on the right you will notice that you have there for example, also `users_aggregate` and if you open it up you will already get more clue what it is all about.

You can fetch various aggregations on your columns like `count` to count for example the total number of users or you can also set the `distinct: true` for the `columns: role` and count the amount of of users belong to the different role. In my example I have all users' role 1 or 2 so the result for me will be 2.

Another popular aggregation is `sum` for getting for example the total amount of money made during a certain time period but also finding with `min`, `max`, and `avg` for example, the smallest, the biggest and the average invoices. There are also more complex statistical aggregations like `variance`, `var_pop` and `var_samp` that stand for sample variance in statistics and one good place to read about them is https://statisticshowto.com We are also not going to cover in-depth `stddev`, `stddev_pop` and
`stddev_samp` that stand for the standard deviation of the values that measure of how spread out numbers are. You can read more about that here: https://mathsisfun.com/data/standarddeviation.html It can be used for example to find anomalies. 

### Mutations
Hasura GraphQL Engine automatically generates GraphQL mutation fields for inserting, updating, or deleting data based on your database's schema. For any tracked table, a set of mutations are generated and exposed as part of the GraphQL API.

Just as with queries, as soon you paste in your connection string and track (you can use HAsura only on some tables - bring examples) your tables, you're ready to start writing mutations!

#### Insert Mutation

There's `insert_tablename` and `insert_tablename_one`. I'm not really sure why one should use at all the last one. If you think that you just insert users one by one and then one day plan to insert multiple then you need to change the query. Why? 

In `insert` the JSON objects argument is necessary and you can pass multiple objects to the mutation. Eg.

```
objects: {
      first_name: "Uugo"
      email: "uugo@uugometsast.ee"
      role: 2
      company_id: 2
    },
    {
      first_name: "Uugo"
      email: "uugo@uugometsast.ee"
      role: 2
      company_id: 2
    }
 ```
 
 Or multiple objects in the array. See examples.

 #### Update mutation
 Screenshots from the book:
 * https://i.imgur.com/YxY24h6.png
 * https://i.imgur.com/Yq7zwgM.png

#### Delete mutation
https://i.imgur.com/dUPhVC3.png

(Teaser: upsert next time: It is an insert mutation with on_conflict argument that will first check if there’s no conflict with another row in the table. If there is any conflict then it will instead of inserting a new record, update the existing one or ignore the request.)

### Mutation exercise from email
https://mail.google.com/mail/u/1/#drafts?compose=GTvVlcSBnNPWSlfRwWTpbFSlwxbCngGGxnPdgDrwBTzrQcMGrPxCxGpzptlhhDnXQzcSxScQLJsfq
### Docker on Win10/11

* Install as administrator
* Enable WSL on Win
* Youtube: Mac/Ubuntu/Win11 install Docker Desktop (not easy)