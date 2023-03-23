# Cloud-Services Backend

EVERERYBODY, PLEASE FILL [THIS FORM](https://docs.google.com/forms/d/e/1FAIpQLSekGcQeZW1CQodTJZQUQQrG5CIkZDYiD8pZ09vPFDLG-Or2OA/viewform)​ and once added to the repo, please create a branch with your first name. If it is taken then firstname.s (surname initial).​​​​​​

FYI on Fridays and Saturdays I deal with your course, usually study myself on Sun and Mon-Thu busy with my other projects so if you have homework then it is better for you to do it on Friday after the class (half of the weeks I go on Friday back to Tartu and can deal in the train/car/etc. And half of the Saturdays if I stay in Tallinn for Friday night🎉)

## Bookmarks
* [Hasura Documentation](https://hasura.io/docs/latest/index/) (well, rather a reminder than a bookmark as hey who should bother coming here to click this link vs google "hasura doc" and click the first result)
* [DrawSQL course ER Diagram](https://drawsql.app/teams/study-23/diagrams/course)
* [Canva Slides](https://www.canva.com/design/DAFdXTQs4P0/1ns8MePSBWTVvqmgq9eV_w/edit?utm_content=DAFdXTQs4P0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Notebook
Feel free to add useful notes' pull requests from your branch.

### Lesson 1
Hasura column default string and column type "text": `'NoSurname'::text`

🚨 (IMPORTANT TO REMEMBER): CTRL + ENTER in GraphiQL, [Thunder Client for VSC](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client), [GraphQL Playground](https://github.com/graphql/graphql-playground) or similar.

🚨 (IMPORTANT TO REMEMBER): Naming! Names like ´q1´, ´q1´, ´i´, ´funny´, ´bla´ in Queries, Variables, Functions, classes, table names, columns, everywhere are forbidden. If I see such things on your repo, you get a huge minus and won't be probably hired.

#### Operators that you can use
* ´_eq´: equal to == and _neq: not equal to !=
* ´_gt´: greater than > and _gte: greater or equal than >=
* ´_lt´: less than < and _lte: less or equal than <=
* ´_is_null´: NULL value true/false. For example, let’s get only the books that have a
publisher: where: {publisher_id: {_is_null: false}}
* ´_like´: traditional SQL LIKE operator and _nlike: NOT LIKE. The easy approach to do the
pattern matching. The % selector can be zero or more characters and the _ sign replaces a
single character. For example, to search for all the books that have “Hasura” in their title:
where: {title: {_like: "%Hasura%"}}
* ´_ilike´: ILIKE and _nilike: NOT ILIKE. The ILIKE does a case-insensitive search.
* ´_similar´: SIMILAR TO and _nsimilar: NOT SIMILAR TO. For example, get the books
whose title starts with H or N: where: {title: {_similar: "(H|N)%"}} Read
more: https://www.postgresql.org/docs/current/functions-matching.html
* ´_regex´: Postgres equivalent is ~, _iregex is ~*, _nregex is !~ and _niregex is !~*
* ´_in´: in a list and _nin: not in a list. Compare field values to list values. Compatible with
PostgreSQL types JSON or JSONB. Read more about list-based search operators in the Hasura
API reference here: https://hasura.io/docs/latest/api-reference/graphqlapi/query/#generic-operators