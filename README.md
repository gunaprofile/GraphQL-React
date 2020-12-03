# GraphQL-React

## Building From (Mostly) Scratch - Full stack

### App Overview

* In this course we've gone through one application where we focused on the back end one application where we focused on the front end and now we're going to focus on an app where we are concerned with the entire full stack.So everything from the back end database all the way to the front end.

* next application that we're going to be working on we're going to be working on an application using authentication with graphQL.

* So we've already had a lot of content where we've kind of figured out how to associate data sitting in our database with our graphQL queries

* We need to have a reasonable idea of how to authenticate our users and especially in the context of graphQL we need to understand how we tie our authentication system with graphQL quries.

* because a extremely common case and we'll talk about this in great detail is figuring out exactly how to best restrict the amount of data that a user can feed that a user can see inside of our application.

* especially in the context of graphQL we need to understand how we tie our authentication system with our graphQL because a extremely common case how to best restrict the amount of data that a user can feed that a user can see inside of our application.

### App Challenges

* Let's now talk about some of the big challenges of this application. (Refer : full1)

* Last thing I want to talk about just a little bit is a little bit of the full stack approach that we're taking here in all the different technologies that we're going to be making use of.(Refer : full2)

* No big changes here per say. We're still going to have a mongo DB database that is hosted by Mago lab. Again recall that we're making use of Mago lab just so that we do not have to set up a local Mongo DB database. And that also makes life a little bit easier when we migrate over to production.

* So we don't have to worry about big differences in our database solution between production and our local environment

* the server the web server that we're going to be making use of it's still going to be an express 

* express is going to be hosting a graphQL instance and we're also still going to making use of Web pack for developing all of our client side assets

* webpack and graphQL are going to be the main points of interface with our user inside the web browser where we're going to have our react js application.

###  Boilerplate Setup

```
git clone https://github.com/StephenGrider/auth-graphql-starter

npm install
```
* Now the general architecture of this project here is very similar to the ones the projects that we'veworked with previously.

* So we have an index.js file at the very top level that starts up our app.We have a server folder with a bunch of our server related code and then a client folder that is supposed to be that is intended to contain some of the client side javascript code for our application.

* I want to start off by looking at the code that is included inside of the client folder. So if I open up index.js

* OK just route dead simple absolute minimum boilerplate for getting a re-act application on the screen we create the root component and then we render on the screen. That's pretty much it.

* Now let's check out the source server folder. So there's definitely a couple of different folders inside of here.

* There we create the root component and then we render on the screen. That's pretty much it. check server.js and auth.js

### Authentication Approach

* In the last section we installed our boilerplate package and took a look at some of the different files inside of it.

* In particular we looked at the auth.js file and I had mentioned that there was some compatibility coding here that makes graphQL and passport work nicely and you'll certainly read a little bit about that.

* So I want talk a little bit more about passport and how it works with the graphical side of our application.

* Let's take a look at a diagram to help us understand this a little bit better.(Refer : full3)

* to authenticate a user. We get some incoming request from, we might call a mystery user. We don't really know who is making the authentication request.(Refer : full3)

* (Refer : full3) - The request will come in with some username and password and it's up to passport to figure out which user that is and authenticate them successfully.

* So passport will take that username. It will look through its database it will find a user with that username and then it will compare the stored password with a password that was provided on the incoming request and decide whether or not the authentication request is valid or not if the request is valid than passport will say. Ah fantastic. This is user number so-and-so

* and it will save a little token or a little note on the user's cookie so that any time the user makes a request in the future we will immediately know that that is user number 5 or user number 6 or 7 or 8 or whoever it might be.

* So this is how authentication works and really the vast majority of applications in the world today.

* So let's talk a little bit about how this authentication scheme is going to change once we start involving graphQL.

* So when would you start involving graphQL with passport. There's really two different approaches that we can take which I like to refer to as a de-couple approach and a coupled approach. So these are two different methods of involving graphQL and passport together

* we'll first talk about the de-coupled approach right now and we'll talk a little bit about a couple.And then some of the pros and cons between the two 

* de-coupled approach - because we first take care of passport or all the authentication without any concern of graphQL whatsoever. GraphQL not involved in the slightest bit.(Refer : full4)

* A user is still going to make some authentication request where they provide their username and password. Passport is going to attempt to authenticate them and then identify the user in some fashion and set the users cookie.

* Then whenever that user makes any type of follow up request the request will be identified automatically by passport and then the request will enter into the graphQL phase.

* GraphQL will say oh this is user so and so they've already been identified by passport. I'm going to give them all the data that they would deserve as you desired. No.5 , So then graft who will formulate the response and send it back to the client.

* Now the one thing I want to point out about this solution right now is that I've talked about identifying the user.And if we really think about identifying the user it's kind of like a change in the authentication state of our application. And whenever I say the word change we should be thinking mutation right. That's what we've been saying about graphQL all along. Anytime we change anything about our application it's always a mutation.

* So if we use this de-coupled approach and graphQL is not involved at all we're not making use of any type of mutation to our code or any type of mutation of our application state.

* So let's look at what would happen if we do involve graphQL using this couple of approach  (Refer full5) by the way coupled approach and de-coupled approach this is not official terminology.By the way is this terminology that I introduced to help you understand what's going on here.

* OK so let's talk about what's different with this coupled approach.So at the coupled approach we'll make use of a mutation to authenticate the user in some fashion.

* So we'll have this incoming authentication request which will really be a mutation.(Refer full5) 

* graphQL will see that the user is making a mutation or request to attempt to identify themselves and it will pass along the request to passport and say oh. Looks like they're attempting to identify or to identify or authenticate themselves in some fashion.

* I'm going to let passport take care of this passport will then identify the user in some fashion. It will still place a little cookie or a little identifier on the user's cookie and then will hand the request back to graphQL and then grafphQL will respond with whatever appropriate data.(Refer full5) 

* whenever the user makes that followup request. when request comes into the graphQL side of things already with an identified user or graftQL can fetch any relevant data for that user and respond in turn.

* So when the couple approached the big key is that we're going to allow graphQL to receive the authenticating request and then pass along or defer handling that request to passport.

* So no matter what passports always going to be involved in some fashion it's really a question of whether or not we're going to allow graphQL to handle the request.

* So let's talk a little bit about the pros and cons of each of these approaches.

* But I personally don't think that there is a one size fits all solution. And instead I want to inform you about some of the different alternatives so you can come to a conclusion by yourself and decide which approach is best for you.

* Well to be honest with you I would not want to use the coupled approach because graphQL and passport are absolutely positively not set up to work well with each other in any way shape or fashion.

* Now if there was some alternative as passport out there if there was some other authentication framework where we could just very easily say log is user end or log this user out then that would make this a much easier decision. But unfortunately passport is really the de facto standard of authentication in the nodeJs world.And so we're kind of stuck with it for now.

* for this course. We're going to go with the coupled approach right here. So we're going to go with this approach where we allow graphQL to handle all things related to authentication. All incoming requests and it's going to delegate the actual authentication part off to passport. And I think that's going to work out nicely with the code that we end up writing on the graphQL side but again trust me there was some headache around putting together this compatibility layer between graphical and passport in the first place.

### MLab Setup

* We have spent a lot of time talking about different approaches of handling authentication with graphQL.

* at the end of the day we agreed that going with a couple approach would probably make more sense for the app that we're going to work on right now

* because I think it's just slightly more technically challenging and I would like to show you an example of some of the really complex sides of graphQL

* So in this section we're going talk a little bit about the different types and mutations that I think that we'll need for application and then we'll start working on the first mutation or type or whatever we decide we need to make.

* There is one less piece of set up I want to take care of.we have to get a mongo lab instance to throw in here.I want to do that sign up piece really quick or make that new database piece really quick and then we can move onto the authentication stuff and we won't have to worry about any set up code and anything like that in the future.

* Create a database in mlab and then create user the use the URL in server.js and
```js
const MONGO_URI = 'mongodb://<dbuser>:<dbpassword>@ds1fs5t353.mlab.com:62334/auth';
```
* We've got our you are for our Mongo lab instance.

### The User Type

* With any type of graphQL application you ever work on it always pays to do a little bit of homework or design planning ahead of time to plan out all the different types and all the different mutations you expect to have in your application.So spend a little bit of time to plan out the different types and the different mutations we're going to have for our authentication app.

* I think that we should have a single type called the user type and then we have three different mutations called Sign up log in and log out on mutation side.

* I want to be able to create a new user through sign up, because we're not only creating new user but we're also authenticating our users at the same time we're considering them to be logged in

* with a logging mutation. We are exchanging an e-mail or a username and password for the user's authentication.

* And then with log out we're going to destroy the authentication state that is held between the client and the server.

* The important thing to remember here is that all three of these are mutations because we are altering some of the data or some of the state that exist between our client and the server.

* User type is Totally appropriate will make that user type and then add it to our root query and maybe the user can look at a list of different users or a very particular user or maybe even get a reference to just the current user as well.

* So those would all be possible queries that we would add to the query type.

* I want to first start by creating the user type and then once we've created that type we can start worrying about the different mutations that we're going to have 

*  after we put all the types of mutations together we can start testing them inside of graphical 

* and then once we are confident with how they work in graphical we'll move on over to the client side of our application and start working on the react side of things as well.

* So let's get started first with our user type 

* So in the past we created just one file that we called the schema file for all the different types of mutations inside of our application. This time I want to take a little bit more modular approach where we split out all the different types of mutations into separate files.

* Inside the schema folder - types - user_types.js

```js
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        email: { type: GraphQLString }
    }
});

module.exports = UserType;
```

* Remember that whenever we work with a type it usually corresponds to a model of sorts in our database or a collection of data that sits in our database.
 
 * The board the plate that we're making use of right now already has a user model defined inside the models/user.js So let's open that up and look at what the default model is 

 * in our database. We are currently storing just the email and password that is associated with each user. Now in no way shape or form does it really make sense to add the password to the fields object of our user type.

 * I am never ever going to think of a single situation where I want to for any reason expose the password field of any of my users.

 * Even though the password as it's saved in the database is going to be hashed insulted. So the password is not in plain text in the database. Nonetheless I cannot think of a single reason to ever expose that to the outside world And my graphQL schema.

 * So I think that as far as my user type goes the only field I really care about is the e-mail field. Like maybe it's totally reasonable to share a user's e-mail with other users inside the application.So I will expose the email field to everyone else.

 * So I'm going to take my user type and we'll define the name property and the fields property on it.

 ### The Signup Mutation

 * Now that we've got our user type put together we can start thinking about the different mutations that we're going to be working with.

 * When we started thinking about signing up logging in logging out all these different things. My head Personally I immediately start thinking about checking the user's password and reading users from the database and making sure that that a user's e-mail is not in use and the password exists and blah blah blah all these different steps that are all associated with signing a user in and just authentication in general.

 * So the question very quickly becomes where do we put all that logic and where do we put all the logic for comparing a user's password or making sure they that a valid e-mail was provided.

 * Do we stuff that all into the resolve function for each mutation. The answer is unequivocally no. No it's not.

 * For every mutation that we write we want to ensure that as little logic as possible is located in the mutation itself.

 * So for every one of these mutations we're going to work with Sign-Up log in log out. We are going to have one with three lines of logic at most inside of every resolved function

 * rather than placing all the logic first say creating a new user inside the mutation. We were always going to delegate to an outside helper function or a Helper Object or a helper service of some sorts.

 * Remember that the idea behind graphQL is that it's kind of an abstraction layer of sorts between our front end and our true backend which might consist of many different services running in our background.

 * In theory any one of those services might change in some very fundamental way at any time.And so it really make sure that we don't couple are backend service too closely with our graphQL code. which is really just there to be kind of a presentation layer of all the different data in our application.

 * So rather than stuffing all authentication logic inside the mutations itself we're going to make use of outside helper functions and outside objects.

 * Now again we spoke about this in the last few sections for the project that we're working on making passport and graphQL work nicely is a little bit of a pain in the rear.So I've taken the liberty of writing out a couple of these helper functions for us but we certainly will go back to the code and take a look at it and say hey look at all the stuff that we did not place inside the mutation.

 * So with that in mind let's get started with our different mutations.I'm going to make a single file to house all the different mutations of my project.

 * Now again I could certainly make a folder of sorts and place a bunch of different mutations in that folder and then reference it from somewhere else for this time. I'm going to make a single file because as you're going to see our mutations are going to end up being very small and very compact.

 * So inside of my schema directory I'm going to make a new file called mutations.js then inside of here will place some of our boilerplate code for working with mutations.

 ```js
 const graphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString
} = graphQL;
const UserType = require('./types/user_type');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) { 
              
              /* The third argument in here that we really care about is something called request, request right here represents the request object coming from Express. */
            }
        }
    }
});

module.exports = mutation;
 ```
### Delegating to the Auth Service

* In the last section we started doing a little bit of work on our sign up mutation. We defined the result function and we also spoke a little bit about the third argument that we've never spoken about what the result function which is the incoming requests from our express server.

* The authentication service that's already been included with the starter project relies heavily upon this request object right here.

* So it's definitely important that we maintain that request object and we pass it to the auth service and we try to sign up for an account.

*  let's go and look at the auto service really quick and figure out exactly how we sign up for a new account given some email and password.

* In auth.js file if we call the sign up function with an email a password and a request object. This being the request object from the Express side of our application it will automatically attempt to sign up a new user for our application and then save them and log them into our application.

* So if we import this function right here into our mutations file and we call the sign up function with the e-mail password in requesting that result function then presumably that will create our new user and automatically log the user in.

* Let us try, I know that it's a little bit painful to make use of this function without having built it ourselves. Again there's some kind of nasty stuff in here around making passport work nicely with graphQL

* really what's happening is graphQL expects to receive a promise for dealing with any asynchronous code but passport has no built in support for promises.

* And so that's kind of where there's a mismatch in the expected API here.
And that's why you see this kind of nasty looking promise statement inside of the sign up function. (Refer auth.js sign up function)

* Let us import and use this sign up function in our graphql mutation

```js
 const graphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString
} = graphQL;
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) { 
                 return AuthService.signup({ email, password, req });
            }
        }
    }
});

module.exports = mutation;
 ```
 * Now remember signing up a new user is going to have to interact with the database in some fashion.

 * Not only do we have to make sure that the email is not in use. So we're going to have to look over our entire list of emails and our user collection but we're also going to have to save a new user to the database as well.

 * So this is a lot of asynchronous calls which means that the AuthService.signup function right here returns a promise 

 * whenever we return a promise from our resolve function So that graphQL knows to look at the promise that gets returned right here and say okay I'm going to hold up for a second and wait for this operation to resolve before I attempt to return any values to my front end.

 * So our Sign-Up resolve function right now is incredibly small. It's exactly one line of code and rather than putting all the logic in the resolve function for actually signing up a user We're placing all that kind of business logic is what I really want to call it inside of a helper function or a helper object.

 * So this right here is a very nice looking mutation. It just says hey I don't really know what's going on here. I'm just going to completely delegate handling all this Sign-Up business to this outside piece of code.

 ### Testing Signup

 * we finished up the sign up mutation and we're just about ready to test it inside of graphical.

 * There is a little bit of last minute set up that we have to do inside of our project ahead of time though we do have to make sure that we wire up these newly created mutations to our schema inside of the schema.js file.So inside of schema Geass we will import or require in our mutation file.

 ```js
 const graphql = require('graphql');
const { GraphQLSchema } = graphql;

const RootQueryType = require('./types/root_query_type');
const mutation = require('./mutations'); //here

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation //here
});

 ```
 * Now in types/root_query type we need atleast one field. let us add some dummy field for now.

 ```js
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    dummyField : GraphQLID
  }
});

module.exports = RootQueryType;
 ```
 * Now we'll start up the project with the very classic command and then npm run dev.

 * Now let's write signup query in graphql

 ```js
 //request
 mutation { 
     singup(email:"reachtoguna@gmail.com", password:"password"){
         email
     }
 }
 ```
 * We will get response data with saved email.

 * So presumably we can kind of assume at this point that a user has been added to our users collection in our lab database and more importantly that we are currently authenticated or signed into our application number that's what the real goal here is of the Sign-Up mutation. It's not only to create a new user it is also to simultaneously authenticate ourselves with the application as well

* Lets move to mlab and check this entry

* I should see automatically a new collection appear on the list here. So here's the users collection that was just created automatically. You'll notice that there's also a sessions collection in here as well. That's part of the session record keeping part of express that is already wired up inside of our project.

* So let's look at the users collection looks like our user was successfully created.

* You'll also notice that our password is in here as well and it is absolutely not a plain text password.So it is salted and hashed which means that if anyone just happens to get access to all of our user records including all of our user passwords they'll have a heck of a time trying to figure out the user's actual password from this encrypted string right here.

* So it looks like our sign up at least the user creation side is working correctly. Again my expectation right now is that in addition to creating this new user I should have also gotten a cookie place on my session or I should say and identify or place on my session that says hey whoever's making requests from this browser right here and we consider them to be authenticated.

* So we don't really have any good way of proving that on our server just yet. We don't really have any good way of testing authentication. We certainly will in a moment but right now we're just going to have to kind of take it on blind faith that we are being successfully authenticate with our server.

### The Logout Mutation

* so logging out user is going to be another type of mutation that we put together.

* passport that's going to handle really signing out a user all the mutation that we're writing here is going to do is make sure to instruct passport to sign out the user

* check passport js logout method Refer : http://www.passportjs.org/docs/logout/

```js
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString
} = graphql;
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) {
                return AuthService.signup({ email, password, req });
            }
        },
        logout: {
                type: UserType,
                resolve(parentValue, args, req) {
                    const { user } = req;
                    req.logout(); 
                    return user;
                }
            }
    }
});
```

* So again it is just a very small order of operations thing here when we call req.logout. It removes the user property off the request object. So we first save a reference to the user property then we log the user out and then we return the user.

```js
// mutation request

mutation{
    logout {
        email
    }
}
```
###  The Login Mutation

* we already have server side logic with passport to login user, let us add mutation logic for this.

```js
login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) {
                return AuthService.login({ email, password, req });
            }
        }
```
* Mutation request will be as follows

```js
//request
 mutation { 
     login(email:"reachtoguna@gmail.com", password:"password"){
         email
     }
 }
```

### Checking Authentication Status

* We've got our sign up log out and log in mutations put together. But again we really don't have any useful way of figuring out whether or not the current user is authenticated.

* Once we start moving over to the client side of this application we're very soon going to have to figure out whether or not the user is authenticated

* because if they try to visit some route that requires the user to be logged in we want to be able to ask the question hey is this person actually logged in.Because if they're not we need to kick them out to somewhere else inside of our application and make sure that they first log in before they go to this protected route.

* So to be able to make the determination of whether or not we are currently logged into our application I propose that we add a field to our root query type.

* I'm going to suggest that we add a field to this object of maybe something just like user or current user and we'll just return the currently

```js
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID } = graphql;
const UserType = require('./user_type');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      // return current logged in user
    user: { 
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      }
    }
  }
});

module.exports = RootQueryType;
```
* Now as we've seen the request object gets some properties automatically placed on it by passport

* whenever we authenticate a user. So that's passport kind of working behind the scenes to interact with the request object automatically.

* So if the user is authenticated when they access this graph property right here the request object should have a record user property assigned to it if the user is not currently signed in. Then req.user will be undefined with graphql is going to translate into a value of No.

* So I think you know what comes next who are going to give this a shot out inside of graphical

```js
mutation {
    login(email:"reachtoguna@gmail.com", password:"password"){
         email
     }
}
```
* And now in theory I am signed into our application as reachtoguna@gmail.com

```js
// request
{
    user {
        email
    }
}
```
* and the response will be

```js
{
    "data" : {
        "user": {
            "email": "reachtoguna@gmail.com"
        }
    }
}
```
* If you try after logout and try this request, then we will get null response

```js
{
    "data" : {
        "user": {
            "email": null
        }
    }
}
```