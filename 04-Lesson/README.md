# 03 - Lesson

## Homework check
### 1. As a admin, I want to get the total amount of all invoices for a specific company. I want to be able to find the company by  remembering just part of its name.


![](images/Homework%201%20-%20Ilja%20almost%20correct%20answer.png)

What's wrong here? You count for each company the invoices so you need to do some math in frontend. You should start your query with `invoices_aggregate` and then there do the where company name `iregex` or `ilike` that is more logical as case in-sensitive but it would been correct also with `regex` and `like` (case sensitive) as the user story doesn't state it must be case in-sensitive.

I didn't send it back to Ilja because it is my fault that I didn't define that the queries must be built in a most efficient way so that there's no math needed in the front-end if possible. Also, doing one query only if possible instead of multiple. How we could do the same thing with multiple queries? First query all the company `id`'s that match the search pattern and then build a new query in the front-end and query the count of invoices for those companies and then reach to the point where Ilja's work was - sum up.

Here's a correct answer:

![](images/Homework%201%20-%20Correct%20answer.png)

Note: using `ilike` instead that is also correct but I'd prefer also `iregex` like Ilja did because you want to have your queries maximum re-usable and Regex gives surely more options without the change of the query. Why universal queries are better? Well, because then you have to make less changes in your front-end (= less chances to mess something up) or for example when you use the query for REST API then you have to create less REST API endpoints.

### Previous homework

Note2: compare my naming to Ilja naming. Do you understand why some queries are better? Rise hands who watched at least half of the first homework? What did Uncle Bob say there?

PS. What videos do you wach from YouTube?

### 2. As an admin, I want to be able to mass delete bookings for a specific room between specific date range.

[](images/Homework%202%20-%20Ilja%20almost%20correct%20answer.png)

What's wrong here? Again, I can't call it wrong because I wasn't precise enough with my user story. But from an experienced developer I would expect to understand what I mean. Obviously I wouldn't care as a user when the booking was created. I most probably want to get rid of the booking for some room that was booked between some dates. Maybe some super important thing came in so everybody shall be cancelled or it needs to go to renovation. Of course, then there must be some other actions too: inform everybody, say sorry, issue refund, issue discount to book another room, etc. Try to think always what could be the use-case. People doesn't give precise user stories and will tell you "there's a bug" at one moment and then you go nuts trying to understand "hat the heck!!!!". Tiny details. Detail orientation is all about development! Correct user story would end like this: "between specific date range **the room was booked**". So I would expect you to use `date` instead of `created_at`.

![](images/Homework%202%20-%20Correct%20answer.png)

Note: `_and` in my query - it is actually not necessary and Ilja's works exactly the same but we will touch that topic today.

Note2: Better naming.

Note3: Returning some useful data. Here Ilja isn't wrong at all again. Affected rows is fine. Just say "Deleted 2 reservations" in the front-end but just bringing an example where we could say display the date and timeframe we just cleaned up for the room.

In my case I have used a timezone for the time `+01` that is central European time. Actually I like to use UK time mostly because I'm in Europe and work with other European people in Central and Western Europe so it makes easier for this use case. In Estonia at the moment is DST (daylight saving time) `+03` and in the winter `+02` and if I knew all the users are from the same timezone I would surely go with that timezone. In this example, correct is with timezone already because it is a physical room booking and that room is in a specific timezone.

I would use the timezone also when signing some contracts or any other legal reasons. Then we want to have the user's local timestamp with timezone.

At most cases, it is preferrable using UTC (Coordinated Universal Time) - letter Z at the end. Why?

Consistency! Always good thing! UTC ensures that you have a consistent time base, regardless of where your users are located. And easier to compare and sort timestamps. And it avoids potential issues with time zone differences. And daylight saving time changes. Pretty many advatages, right?

Also flexibility. By storing data in UTC, you can easily convert it to any other time zone when presenting it to users. Useful again for apps with users in multiple time zones or when users traveling between time zones.

## Relationships

### Repeat the super important FK (foreign key) in O2M
FK from the plural side (many side) to the PK (primary key) in the singular side.
![](images/Relationships%201%20-%20Foreign%20key.png)

### O2O
![](images/Relationships%202%20-%20one2one.png)
![](images/Relationships%203%20-%20why%20one2one%20and%20in%20Hasura.png)