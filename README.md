# SureUp Front End Interview


## Setup & Goal ( TLDR )
1. Fork this repo.
2. Contact Tom or Kaoru and ask for an `api_key`.
3. Write a single-page CRUD (Create Read Update Delete) interface for vehicles. ( More details below. )
4. Create a PR (Pull Request) for review.

## Api end points
I have a [dumb server](https://github.com/KaoruDev/sureup-fe-api) on heroku to provide you with a basic CRUD API. Because Heroku spins downs dynos when not used, you may need to hit the url before you start getting responses.

The root url is http://sureup-fe-interview.heroku.com

|  Action | Endpoint           | rest action   | parameters  | response
| -------| ------------- |:-------------:| -----:      | -----:
| List Vehicles | /vehicles.json | GET | N/A | Array of vehicle objects
| Create Vehicle | /vehicles.json      | POST      |   vehicle params | vehicle object |
| Update Vehicle | /vehicles/:id.json | PUT      |    vehicle params   | vehicle object |
| Destroy Vehicle| /vehicles/:id.json | DELETE | N/A | { success : true } |
`:id` stands for the integer that represents a vehicle's unique id. For example the vehicle's id below is 1. It's update url would be `/vehicles/1.json`

** Vehicle Object ** is what the server will send back with a valid request.
```json
{
  "user_id": 1,
  "id": 1,
  "nickname": "killer",
  "year": "2012",
  "make": "lexus",
  "model": "e200",
  "created_at": "2015-01-14T03:18:26.609Z",
  "updated_at": "2015-01-14T03:18:26.609Z"
}
```
** Vehicle Params ** is what you will be sending the server. A vehicle model has validations on it to check if a vehicle has a nickname, year, make, model. If any of these fields are missing an error will be thrown and the server will respond with a 406 response. **Year Make Model** do not have to exist, i.e. the server doesn't check if a 2080 Batmobile AwesomeCar exists. A vehicle's information must be wrapped under `vehicles` attribute. Otherwise the server will respond with an error.
```json
{
  "vehicles": {
    "nickname": "Car nickname", // Required
    "year": "2015",             // Required
    "make": "Subaru",           // Required
    "model": "WRX",             // Required
  }
}
```
** Server Errors ** 400 server errors will look like:
```json
 {
   "errors": ["Year can't be blank", "Make can't be blank", "Model can't be blank"]
 }
```
If there is any more relevant information the server will send it down under different property names. It is up to you to investigate that information. Please report any 500 server errors to Kaoru. Remember to log down exactly what you're doing. I.e. the server *should* not respond with a 500.


## Goal ( long )

Setup a single page app with a CRUD ( Create / Read / Update / Delete ) interface for vehicles. The page should:

1. Show a the list of vehicles you have on the page ( via `/vehicles.json` `method:GET` ).
2. Have a way to create new vehicles via form. The form should not refersh the page, instead should send an `ajax` request to the server (via `/vehicles.json` `method:POST`) and update the `DOM` when the server responds with a success.
3. A user should be able to edit any existing vehicles on the list (via `/vehicles/:id` `method: put`).
4. A user should be able to remove vehicles from the list (via `/vehicles/:id` `method: delete`)

#### Libraries:
You are limited to [jQuery](http://jquery.com/), [underscore](http://underscorejs.org/) and [backbone](http://backbonejs.org) as we use these on our stack.

#### CSS:
You have the freedom of choosing a css framework. You're free to use your imagination. Kudos on making it pretty, but it definitely will not be held against you if it isn't. We're more concerned with how you setup your css rather than how it looks.
____

Questions? Concerns? Feel free to ask Kaoru!

