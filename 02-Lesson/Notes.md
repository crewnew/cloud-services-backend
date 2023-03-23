D2
* 
* What do you use for the FE? N8N
* Try it in Graphiql
* History, Explorer, 

![](..\.pastes\2023-03-17-16-28-45.png)

![](..\.pastes\2023-03-17-16-29-15.png)

Update a company's address:

```
mutation updateCompanyAddress($company_id: Int!, $new_address: String!) {
  update_companies(where: { company_id: { _eq: $company_id } }, _set: { address: $new_address }) {
    returning {
      company_id
      name
      address
    }
  }
}
```

Add a new room booking for a company:

```
mutation addRoomBooking($company_id: Int!, $room_id: Int!, $booking_date: date!, $number_of_people: Int!) {
  insert_company_room_bookings(objects: { company_id: $company_id, room_id: $room_id, booking_date: $booking_date, number_of_people: $number_of_people }) {
    returning {
      company_id
      room_id
      booking_date
      number_of_people
    }
  }
}
```
Get the total amount of all invoices for a specific company:
```
query getTotalAmountForCompany($company_id: Int!) {
  companies_by_pk(company_id: $company_id) {
    name
    invoices_aggregate {
      aggregate {
        sum {
          total_amount
        }
      }
    }
  }
}
```
Get the top 5 companies by total invoice amount:

```
query getTop5CompaniesByInvoiceAmount {
  companies(order_by: {invoices_aggregate: {sum: {total_amount: desc}}}, limit: 5) {
    name
    invoices_aggregate {
      aggregate {
        sum {
          total_amount
        }
      }
    }
  }
}
```

Get the list of companies that have booked a room on a specific date:

```
query getCompaniesByRoomBookingDate($booking_date: date!) {
  companies(where: {company_room_bookings: {booking_date: {_eq: $booking_date}}}) {
    name
    company_room_bookings(where: {booking_date: {_eq: $booking_date}}) {
      booking_date
      number_of_people
      room {
        room_number
        max_occupancy
      }
    }
  }
}
```

Update the number of people for a specific room booking:
```
mutation updateRoomBooking($company_id: Int!, $room_id: Int!, $booking_date: date!, $new_number_of_people: Int!) {
  update_company_room_bookings(where: {company_id: {_eq: $company_id}, room_id: {_eq: $room_id}, booking_date: {_eq: $booking_date}}, _set: {number_of_people: $new_number_of_people}) {
    affected_rows
  }
}
```
Get the list of users who have not made any bookings:

```
query getUsersWithoutBookings {
  users(where: {company_room_bookings: {booking_id: {_is_null: true}}}) {
    user_id
    name
    email
    company {
      name
    }
  }
}

```
Get the list of rooms that havem't   been booked on a specific date

```
query getUnbookedRooms($booking_date: date!) {
  rooms(where: {company_room_bookings: {booking_date: {_neq: $booking_date}}}) {
    room_id
    room_number
    max_occupancy
    company_room_bookings(where: {booking_date: {_eq: $booking_date}}, order_by: {booking_start_time: asc}) {
      booking_id
      booking_start_time
      booking_end_time
      number_of_people
      company {
        name
      }
    }
  }
}
```
Delete all bookings for a specific room and date range:
```
mutation deleteBookingsForRoom($room_id: Int!, $start_date: date!, $end_date: date!) {
  delete_company_room_bookings(where: {room_id: {_eq: $room_id}, booking_date: {_gte: $start_date, _lte: $end_date}}) {
    affected_rows
  }
}
```

https://www.google.com/search?q=enable+wsl+2+on+windows+11&sxsrf=AJOqlzX6y4DGnwk9JGoJxxR6Clutf5rAng%3A1679232438408&ei=tg0XZInPGMmMwPAPj5OA0A4&ved=0ahUKEwiJgvKnjOj9AhVJBhAIHY8JAOoQ4dUDCA8&uact=5&oq=enable+wsl+2+on+windows+11&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIFCAAQgAQyBQgAEIYDMgUIABCGAzoECAAQRzoECCMQJ0oECEEYAFCaBFjuBGCuBmgAcAJ4AIABvAGIAbICkgEDMC4ymAEAoAEByAEIwAEB&sclient=gws-wiz-serp