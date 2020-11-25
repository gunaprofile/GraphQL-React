# GraphQL-React

## GraphQL

## What is GraphQL?

* Remember there are three different areas where restful routing seems to kind of come up with some issues.

* 1. Deciding on a URL schema gets tough when we start to have heavily nested relationships.

* 2. when fetching heavily nested data we can easily run into situations where we make too many HTTP requests to get the data that we need.

* 3. we are vulnerable to over fetching data where we fetch an entire company when maybe we really only needed the Name property of that company.

* Keep in mind that with each of these issues there are definitely problems can be solved but coming up with solutions like this kind of takes a lot of engineering time. So we always want to be aware of how much time we're spending on solving any given problem.

* And this is where a graphQL comes in and allows us to solve these issues in a very timely fashion.

* So in this section I want to spend a little bit of time to tell you exactly what graphQL does to solve each of these inherent pieces of confusion around Restful routing.

* Let's think back to our diagram of our current user who is trying to fetch some details about their friends. This user had some friends and each friend had a company and the position records associated with it. Right now we're looking at this diagram in a sort of tree fashion where we start with the current user and then we look at the users they're associated with. And then we look at the associated companies and positions with them. (Refer: basic10)

* So everything is focused around this current user or it's all from this current user's viewpoint. Now I'm going to change up this diagram in a big way and rather than looking at everything from the viewpoint of this single user I want to imagine all of the data in this application all the data in this imaginary database including all the users all the positions and all the companies.

* So the diagram I'm going to swap to is going to look just a little bit crazy but really it is conveying very similar information as what we're seeing right now. (Refer: graphQL1)

* this program right here shows a graph of all the relations in our application.

* a graph is a data structure that contains "nodes" which are symbolized by all the different rectangles in here and relations between each of these nodes which referred to as "edges". (Refer: graphQL1)

* So this is the graph that graphQL is referring to and understanding how our information fits into a graph data structure like this is key to understanding how graphQL works.

* One thing I want to mention about this graph structure right here is that I'm not saying that we're going to change how our data is being stored in a database or anything like that.We can still use MongoDb postgres sql whatever you want to use to store data.

* We're just looking at this diagram to kind of visualize how all of our data is connected together via all the different relations now that our data is organized into a graph.I can't take all my different users in assign some IDs to them.

* once we've got all of our data in this graph structure. What do we do with it and how do we kind of query about the information that is contained in here.

* Well once we have organized our data into a graph we can query it using graphQL so let's see an example of what this might look like.

* we're going to kind of picture a graph Cuil Querrey running along this graph right here.

* Let's imagine that we want to start with user 23 right here.I want to find all of their friends who are other users in the application. And then I want to find all of the companies that those users work at.

* So let's visualize how we would form a query or ask a question like that graphQL.

* Well first we would tell graphQL that we wanted to go and find the user with ID 23. (Refer: graphql2)

* Next we would telle graphQL to go and find all the friends associated  with user 23.(Refer: graphql3)

* Finally we would tell graphQL to find the company associated with all of those friends and get like you name the name property off of it or something like that. (Refer: graphql4)

* So in summary we started by telling graphQL to go and look at a very particular record like this record.and then crawl through all the records associated with it.

*  how to excuse me to instruct graphQL on how to do this in practice we write and execute what is called a Query. 

* So lets look at a query that would do something very similar to what we just saw.Like start with a particular user and then go find the associated friends companies names.

* So the query that we're about to write you know we're just going to do right here on the side of this diagram is going to look really familiar.

* Once we start working with GraphQL it's going to look like javascript right now it might look a little bit weird but trust me we're going to get really familiar with graphQL queries.(Refer: graphql5)

* First we start off by telegraph whether we want to make a query. So I would say query and then open curly braces (Refer: graphql5)

* then I would say I want to find a user with ID of 23(Refer: graphql5)

* Next we'll tell graphQL that we want to find all the users who are friends of the initial user to crawl along to the next layer the next set of relations right here we are in friends like so (Refer: graphql5)

*  now you might be curious why I'm saying friends right here and not like users again. Well we'll get used to it. We'll talk about that.But really we could consider them to be just users as well.(Refer: graphql5)

* Either way we're essentially telling graph to kind of walk this graph a little bit like walk to the next relation walk to the next node (Refer: graphql5)

* now the last step would go from friends to finding all of the companies associated with those friends so I would say company.(Refer: graphql5)

* And then because I want the name property out of every single company I would write out name like so (Refer: graphql5)

* So this is the first query that we're going to look at. We're going to implement this ourselves inside of a graphical application.

* I only right now I don't like expect you to understand the syntax of queries at all. No not whatsoever. I just want to give you an example of how we take a query and we can imagine that is walking along a graph for every single statement in the query that we have got.

## Working with GraphQL

*  we form up a graph results to model our data and then we write queries to ask questions about the data in that graph.

* Now you might be starting to get a little bit of a sense of how this approach solve some of the issues that we get with restful routing because we can freely walk through all these relations and not have to worry about making separate or els or anything like that to deal with the relations.

* Our goal in this section is to create a graphical application that has a similar data structure to the one we've been looking at (Refer: graphql5)

* This going to be the first application that we're going to target we're going to make something that has a data structure that looks a lot like this.

* So the first thing we have to do is get a sense of exactly what pieces of technology we're going to need to make this happen.

* So let's kind of figure out exactly how this is all going to come together.

* This is going to be the overall architecture of the app that we're going to build. (Refer: graphql6)

* We are first going to make an express server and then hook it up to a data store of some kind.

* Then we will load up a prebuilt application called "graphical" (** extra i not graphQL its graphical)  into our browser and use it to make a couple of test queries.

* This graphical apparatus here is a pre-built application authored by the GraphQL Team

* it's made solely for development purposes to help us get a little bit of a better feel of how graphQL works and how we can execute queries with it.

* We're going to put together the Express side we're going to put together a little bit of stuff for the data side and then we're going to test it out in the browser using this graphical tool right here.

* Let us make new project directory "users"
 ```
 mkdir users
 cd users
 npm init
 ```
* Now we'll install a couple of packages that will help us get set up with Express and integrate express with graphsQL to kind of fit that architectural we were just looking at having this combination Express/GraphQL Server.

```
npm install --save express express-graphql graphql lodash
```
* So four separate packages here.

* Express is responsible for handling incoming HTTP requests and making responses to be sent back to a user.

* We also installed express-graphql Well that is a compatibility layer between Express and graphsQL.

* So by default graphQL express they have absolutely no idea how to work with each other.So that package is there to essentially provide some glue code to make the two work together nicely.

* We also installed graphQL which is the actual graph to a library that is used to crawl through all of our data.

* And the last thing that we got in there as well was lodash  which is a library that has a couple utility functions that are going to come in useful for us over time.

* So the installation process awfully fast.

* we're going to focus on just the bare essentials of putting together an express server. We're going to start off by making a new file called server.js

```js
//server.js
const express = require('express');

const app = express();

app.listen(4000, ()=> {
    console.log("Listening");
})
```
## Registering GraphQL with Express

* In the last section we created a new Express application and put together the tiniest bit of code to stand up and express server

* will now continue in this section by figuring out exactly how to make graphQL and express work together nicely.

* First we'll do a little bit of a review on how Xpress works by default just by itself.

* Express is an HTTP server so a user's browser might make an HTTP request Overto our express application Express will process it in some fashion Formulator response and then send response back to whoever made the initial request.(Refer: graphql7)

* When we add in Express however things start to get a little bit more complicated.(Refer: graphql8)

* Express is going to examine the incomming request. so its going to look at incomming request wheather Is this request trying to deal with graphql in some fashion. Like is it trying to deal with graphQL it all.If it is the request will be handed over to graphQL.(Refer: graphql8) and then it will processing the request on the graphQL once its done it will send the response back to express. which in turn send response back to browser.(Refer: graphql8)

* in an express application graphQL is just one discrete component of our app. It is not the entire app it's just one small little portion inside of the Express application. Our overall express application can still have tons and tons of other logic associated with it.

* So everything from server side template into standard API request handlers to authentication to anything else you can possibly do with Express. GraphQL just one small little portion inside of the Express application

* so let's go back over toward code editor and we're going to hook up graphQL to express.

```js
const express = require('express');
const expressGraphql = require('express-graphql'); /* Remember this library here is a sort of glue layer or compatibility layer between graphQL and express. */

const app = express();

/* Now that we've imported this compatibility layer right here we're now going to tell the Express application
that we created that if any request comes into our app looking for the route/graphQL we want the graphics library to handle it. */

/*This is done by placing a call to app.use */

app.use('graphql', expressGraphql({
    graphiql: true,
}));
/* graphiql as a development tool that allows us to make queries against our development server so only intended to use in a development environment right here. */

app.listen(4000, ()=> {
    console.log("Listening");
})
```
* Let's start this server up and see how we're doing.

```
node server.js
```
* Now let's open http://localhost:4000/graphql in browser we could see the below error

```js
{"errors":[{"message":"GraphQL middleware options must contain a schema."}]}
```

## GraphQL Schemas

* But when we tried to access the server in our browser We got an error message about a schema not being present in some middleware.

* So let's analyze this error message. SLet's really try to figure out what it's saying here. It says graphQL middleware options. The keyword in here is middleware.

* When we just wired up our server inside of the server.js we had a call to app.use(). 

* app.use is how we wire up middleware to an express application. middleware are tiny functions meant to intercept or modify requests as they come through and express server.

* So when we registered express graphQL with our application it was registered as a middleware.

* So the error message we're getting here clearly refers first that app.use line

* And if we looked at the second part of it. Options must contain a schema but when we wired up that middleware we passed in an options object to the Express graphical function.

* This options object right here is what that error message is talking about. It's really saying hey you have to provide a schema along with these options.

* So that really begs the question what is a schema.In a previous discussion or see the previous section we discussed how graphQL considers all of the data in our application to look like a graph

* we know like you as look at the diagram (Refer : graphql5) association with the position in the company and apparently with other users as well.

* But graphQL doesn't just magically go into our database and figure out all the different pieces of data in our application and how they're all related.

* Now we have to very specifically inform graphQL about how the data in our application is arranged and how it can be accessed. And we do all this inside of a schema file.

* So the schema file is the absolute link between of every graphical application.

* It is what tells graphQL about the type of data that we're working with and how all the relations play out between those different pieces of data.

* So let's make a new schema file and figure out what to place inside of it.

* I'm going to go back to my code editor and inside of my root project directory I'm going to make a new folder called schema and then inside there I'll make a new file called schema.js.

* So the key thing to keep in mind about your schema file is that it contains all of the knowledge required for telling graphQL exactly what your applications data looks like including most importantly what properties each object has and exactly how each object is related to each other.

* So we know that we're working with users companies and positions. But you know exactly what properties does the user have. What properties does a company or a position have.

* So I'm going to say that a user has a first name as a reference to a company and a reference to a position. Then every company has a name and every position has a name as well. And presumably we need some way for users to be related to other users. So we have to figure out that part as well.

* So our job now is to somehow communicate to graphQL we have the idea of a user and a user has an ID and a first name.

## Writing a GraphQL Schema

* So remember this schema is what tells graph Well exactly what our data looks like in this section.

* We're going to start writing out the schema for application before we get started i want to first tell you something I want to tell you a lot of the code that we're going to write here is going to look kind of crazy and really tough to reproduce in the future. That's the bad news.

* The good news is that all the schema stuff that we're doing here is mostly repetitive. So the first time you see it. Yeah. It's going to look crazy stuff but as we continue working throughout graft Well it's going to look like it's just more and more of the same stuff over time.

* So just keep that in mind. It looks crazy now. Don't worry we're just going to literally be copy pasting this stuff over and over again on future projects.

```js
/* So inside of our schema file the first thing we're going to do is import the graphical library */

const graphQL = require('graphql') /* Note that we're actually playing in the graphQL to a library this time not the Express graphQL */

const {
    GraphQLObjectType, /* we're going to use this GraphQLObjectType right here to instruction graphQL about the presence of a user in our application.*/
    GraphQLString,
    GraphQLInt
} = graphQL; /* for this object we're going to end up destructuring a lot of different properties from this thing. So this is going to end up being a pretty long list.*/

/* So do this by creating a new object that will call UserType  like so now will be a new graphQL object type. */

/* Remember the entire purpose of the schema file is to instruct graphically well about what type of data we have in our application.*/

/* So when you see the word user type right here you can think this object instructs craft well about what a user object looks like what properties as opposed to have.*/

const UserType = new GraphQLObjectType({
    /* Here object are going to pass two required properties.*/
    name: 'User', /*The first one is name the name property will always be a string that describes the type that we are defining.*/

    /* The second require property inside of this object is the Fields property */

    /* It is what tells graph well about all the different properties that a user has */
     fields: {
        id: { type: GraphQLString }, /* we need to define this GraphQLString from graphQL*/
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt } /* we need to define this GraphQLInt from graphQL*/
    }
    
});

```

* So by passing in the fields object with ID first name an age we have instructed graphed well that every single user will have an ID a first name and age.That's it.

* Now here's where things start to get a little bit interesting. We have telegraphed well about what type of data. Each of these fields are.

* And when I say type I mean like is the idea a string. Is it a numbers an array isn't an object.We do so by setting the value of each of these properties to an object and then defining a type property.

* So it is up to us as developers to decide what an appropriate type for each one of these properties is.

## Root Queries

* In the last section we started working on our scheme file and to find the first type of data in our application the UserType this instructs graphQL that our application has the concept of a "user" 

* Again remember then all the schemas we built they really do look quite similar to each other. So it's only going to look weird this first time and after that you're going to start seeing the same patterns over and over again.

* Now as per the previous diagram Start with user 23 and then find my friends and find their companies. Well it turns out that the first part of that equation like finding the user with Id 23 is actually a little bit tough for graphQL

* We have to give Well a piece of data called the root Querey 

* a root query is something that allows us to jump in to our graph of data.

* So if we say to graphQL Well hey give me a user with ID of 23 we're going to pass that instruction into this root query thing.

* And then the root query will have some logic in it to know OK I need to go jump to this part of the graph over here the user with ID of 23.(Refer: graphql9)

* In other words we can think of this root query as being an entry point into our application or an entry point into our data.

* Again the root query is certainly one of those things where I think it's going to make a lot more sense after you've seen it in action. So let's put together some code around this and go from there.

* So back in our schema file underneath the user type I'm going to declare a new variable called Root query

```js
const graphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt
} = graphQL;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

/*RootQuery - So this root query right here will be a graphQL object type.
Just like the user will have the same properties of name and fields*/

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    /*The Fields property is where things start to get a little bit more interesting.*/

    /* So we are going to tell it that if anyone comes into our app asking for a particular user then they're probably asking about that user type that we just created.We can make this clear by adding the following*/

    fields: {
        user: { // user rootquery 
            type: UserType, // return user type
            args: { id: { type: GraphQLString } }, // id as argument 
            resolve(parentValue, args) {
                /* resolve function purpose is to say oh you're looking for a user with idea of 23. OK I'll do my best to find it.*/
                /* The resolve function is where we actually go into our database.. we go into our database and we find the actual data that we're looking for */
                /* Notice the arguments in here. The first argument is parent value.  this argument right here is somewhat notorious for like not ever really being used ever. but right now we're going to say we can kind of ignore it */
                /* Second argument is  this is an object that gets called with whatever arguments were passed into the original query.*/
            }
        }
    }

});
```
* I remember the purpose of the root query is to allow graph Q L to jump and land on a very specific node in the graph of all of our data.

* You can read this as meaning you can ask me the root query about users in the application. If you give me the idea of the user you're looking for. I will return a user back to you. So args right here is short for arguments. It specifies arguments that are required for this root query of a given user. 

* So again in total we can say if you're looking for a user and you give me an ID I will give you back a user.

* A quick review in this section we started implementing our route Querrey which is used to allow graphical to enter into our applications data graph.

* The most important part of this route Querrey is the resolve function which is used to return an actual piece of data from our database or data store or whatever is holding our data.

## Resolving with Data

* So from this function we want to return a very particular user the user with some given ID

* So we're going to hard code in a list of users and then walk through that list of users and return some one of the users from this resolve function right here.

* It's going to go up to the top of my schema file and we'll make a hard coded list of users.

```js
const users = [
    { id: '23', firstName: 'Bill', age: 20 },
    { id: '47', firstName: 'Samantha', age: 21 }
];
```
* I'm also going to require in loadash while we're up here. loadash is a helper library work through collections of data for us in particular. We're going to use it to walk through the list of users and find a user with a very particular ID.

* So now let's go back down to our resolved function. Remember the root query right here is what points us to a very particular record in our graph of all the different data records that we have.

* We've said that the root query has the expectation of receiving an ID as an argument when the ID gets passed in it will be available on this args object right here.

```js
const graphQL = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema /*import a helper from the graph a library */
} = graphQL;

const users = [
    { id: '23', firstName: 'Bill', age: 20 },
    { id: '47', firstName: 'Samantha', age: 21 }
];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
        type: UserType,
        args: { id: { type: GraphQLString } },
        resolve(parentValue, args) {
            return _.find(users, { id: args.id }); /* We are walking through our list of users. So go through all the users and find and return the first user who has an ID equal to arg start ID.*/
            /* And remember this args.id right here will be provided to the query when the query is made.*/
        }
        }
    }
});

/* GraphQL schema takes in a root query and returns a graphQL schema instance.I want to export the schema that we just created from the schema js file.I want to make it available to other parts of my application  */

module.exports = new GraphQLSchema({
    query: RootQuery
});
```
* So we're going to take the two types that we made our user type in our route Querey right here. We're going to merge them together into a graphQL schema object. And then we're going to hand that back to the graphQL Middleware inside of our server.js file.

* Let us use this schema object in our server.js

```js
// Server.js
const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema'); // require schema

const app = express();
/* pass that schema as an option into our express express graphQL middleware.*/
/* Note that we're going to make use of E-6 right here because our key and our value has the same same variable name.*/
app.use('/graphql', expressGraphQL({
  schema, /* schema : schema*/
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening');
});
```
* So one last step we need to restart our server because we've made some changes to our code base. So I need to go back over to my terminal.

```
node server.js
```
* Then listen for http://localhost:4000/graphql

## The GraphiQL Tool

* We've now finished up our first schema with some dummy data and get our application to at least load up inside of the development tool graphical.

* As a reminder this is a tool that is provided to us by the graphQL express library. GraphiQL is an in-browser tool for writing, validating, and testing GraphQL queries. (Refer graphQl10)

* on the left hand side the screen is an area we can where we can enter in a graphical query. We can then run the query by pressing the play button at the top left hand side and see the results pop up on the right.

* Also note that on the very top right hand side is a panel that expands that call. It is called Doc's this documentation Explorer will be automatically populated as we start to add in more types of data to our application.

* So right now we can click on route query type must see that we can use it to fetch a user provided the fact that we pass an ID and we respond with a user and the user has a string of ID a first name and an age assigned to it as well. So over time this documentation panel starts to get a lot more information in it and it starts to get really useful for figuring out how data is working inside of your application without actually having to go read the schema. (Refer : graphql11)

* So back to the left hand side the query panel at this point in the course we have at least brushed on the basics of what is arguably the most difficult part of graph. Well which is writing your schema file.The schema is probably 50 percent of everything that is going on with graphQL the other 50 percent is all about writing queries.

* So we're going to write our first query right now and I'll discuss exactly what is going on with it.

```json
{
  user(id: "23") {
    id
    firstName
    age
  }
}
```
* for the above query we will get resonse JSON as

```json
{
  "data": {
    "user": {
      "id": "23",
      "firstName": "Bill",
      "age": 20
    }
  }
}
```
* Refer : graphql12 image for query and response.

* So let's talk a little bit more about what we just wrote though. Queries that we write look like javascript but they are decidedly not javascript code so this is not javascript that we're writing over here.

* this query. We asked graphQL look through our users and find a user with an ID of 23. Once the user with an I.D. of 23 was found we then asked for the idea of that user back the first name of the user and the age of that user as well.

* The response that we got back from the server looks nearly identical in structure.Note that the types of each of these properties are evident in the output.

* The purpose of the query type is to take the query and enter into our graph of data because we specified user as the field of the query. The root query went and found the user key inside of its fields object.

* We had specified inside of that field's object that the queries should come up with an ID that was a type string which you can see that we did right here.

* We said here is a ID argument and it has a id of type string.

* After that graph to goes and does its thing and finds the user that we're looking for. And then the object gets returned from this statement from the resolve function graphQL will take that it will pluck off the id property the first name property and the age property and return it in the response 

* Notice that inside of the resolve function we are returning a raw javascript object from the loadash So this returns a raw javascript object. We did not have to coerce it into a user like we didn't have to say new user type 

* So everything having to do with types gets handled behind the scenes by graphQL for us, We just have to return raw json or raw javascript objects from these resolve functions and graphQL will take care of everything for us from there.

* And the other thing that I want you to look at is that we can freely change the arguments or the elements that we're asking for the properties that we're asking for it out of the query itself.

* So I can remove the first name and the age and the response I get back. Now it just has the ID or I can say just given the age or just give me the first name.

* So this plays directly into one of the discussions we had much earlier about the shortcomings of restful routing. If you recall when we were talking about restful routing we had said that sometimes it's really easy to overfat the amount of data like we just want to know the name of a company or the first name of a user.

* And I don't want to have to handle all this extra data on my you know potentially mobile cell phone data plan which might be really slow or really expensive. I don't want to be shuffling around all that extra data about a user I just want to know just the first name. And so this definitely goes very well and solving that issue with restful routing.

* Now two other quick things I want to show you. First if we try to find a user that does not exist and is going to put a random ID in here we get back just null. So we don't get an error just say hey can find a user like too bad.Nothing found.
```json
// request
{
  user(id: "2234243") {
    id
    firstName
    age
  }
}

```
```json
// response
{
  "data": {
    "user": null
  }
}
```

* The other thing to take note of is that if we do not provide an argument at all. Like so let's try running this.

```json
// request
{
  user() {
    id
    firstName
    age
  }
}

```
```json
// response
{
  "errors": [
    {
      "message": "Syntax Error: Expected Name, found \")\".",
      "locations": [
        {
          "line": 2,
          "column": 8
        }
      ]
    }
  ]
}
```
## A Realistic Data Source

* if we look in our schema file we are using a static list of users right here just a hard coded list of users. And for me that is so boring I like using live dynamic data.So in this section we're going to investigate some different architectures of how to build and serve data to a graphical application and then we'll swap out the source of data from this hard coded list of users to something at least a little bit more dynamic.Still not going to be backed by a full database but it will be at least a little bit better and we'll see what we've got right now.

* So let's look at a diagram (Refer : graphql6) to help us understand some of the different ways to architect a graph to our application.

* We've got our browser running graphical as sends a graphical query to our express server and then in theory we could have like a local Mong0DB database or my sequela or postgresql whatever it might be where we could reach in and grab our data out and return that piece of data from our resolve method

* Resolve being the very magical location where we actually go and find a piece of data and return it.

* So if you are working on any smaller sized project this is very likely the architecture that you're going to be headed towards.

* Let's look at another option.This other option is something that is much more likely to be used by a large company or companies with lots of infrastructure and lots of separate services.

* Facebook in particular is like the perfect example. This is what they do internally. So Facebook internally does not have a single monolithic data store.

* You know they don't have like a single mySql database. And just you know running queries through that thing all the time Instead they have many different internal systems. Some systems might store user data while another system might serve up some random recommended articles that the current user may be interested in.

* graphQL can serve as a proxy of sorts to go and fetch data from all of these different sources pull all the data together and ship a response back to our user.

* So in this case we might say that our graphical server makes an HTTP request to some outside server which has its own database.

* So when this course we're going to try out both these approaches and we're going to go both with the database based approach and with this outside server type approach where we make an actual age request to some remote API

* Now Let's go with this approach right here where we're going to have an outside server or third party API that's going to service up some amount of data.

* So the idea here whenever a user makes a query or whenever you know realistically you and I press play on here our express server will receive the query. It will then reach out to some other API with the network request it'll fetch the data assemble the graphQL response and ship it back to our graphical client.

* So this means that we need to stand up a second server to act as our outside source of data.like the third party API like this outside API. So we're going to make a separate server to act as this outside API.

* Now this is a course about graph to of course. So we're not going to spend too much time working on this outside source of data. Instead we're just going to use this fantastic little framework called Json Server to host all of our data.

* Refer : https://github.com/typicode/json-server

* So this project right here is all about building very small very fast fake little API is to serve up some amount of data.

* First we have to create db.json file
```json
{
    "users": [
        { "id": "23", "firstName": "Bill", "age": 20 },
        { "id": "40", "firstName": "Alex", "age": 40 }
    ]
}
```
* We do have to start the server up separately from our own graphQL server to do so.I'm going to add a little helper script inside of my package.json file

```json
{
  "name": "users",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "json:server": "json-server --watch db.json" /* json:server */
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "express-graphql": "^0.12.0",
    "graphql": "^15.4.0",
    "json-server": "^0.16.3",
    "lodash": "^4.17.20"
  }
}

```
* So now we're going to flip back over to my terminal and we're going to start up this news server that we just created.

```
npm run json:server
```

* With this it says that localhost running on http://localhost:3000 

* We can try even http://localhost:3000/users or http://localhost:3000/users/23

* It's just the best little server for running with some fake data. When you're in a development environment.

* So let's now continue in the next section and we're going to figure out how to take our graphQL server and make a query over to this outside API to fetch some data about a very particular user and then send it back to our browser in a graphQL query.

## Async Resolve Functions

* In the last section we started up a separate server that serves raw Json data.

* The idea here was to get some experience where a graphQL application pulls in data from an outside server rather than using the static data that we are currently using which is the hard coded list of users inside of our schema file.

* Do note as well that this is running on a completely separate port from our graphQL instance or from our graphical instance.

* The other one is running on localhost 4000 server that we just started up as localhost 3000. So two completely separate disconnected servers 

* In our schema file I'm going to scroll down to our root query towards the bottom. Inside of here we are still making use of low dash to search through the local list of users. Remember the purpose of resolve and must return the data that represents a user object.

* Right now it is returning the user directly in a very synchronous fashion.So when resolve gets called we instantly return a user.

* The resolve function However can also work by returning a promise so it can work in asynchronous fashion.(Refer : graphql13);

* If we return a promise from the resolved function graphQL will automatically detect that we returned a promise. Wait for the promise to resolve and then once it does grab the data that it resolved with and send the response back to the user.

* So in practice once we make a request or a query from our graphical interface it's going to go to graphQL.

* graphQL going to reach out to our Json server and say hey I'm looking for user 23 and that is of course an asynchronous request is in HTTP request to go out and reach out to this other server.

* Json  server will then respond and say hey here you go here's the user 23 . graphQL is going to wait for the request to resolve and then it's going to get the user back and send it back to the response to the graphical client.

* So that's what we're going to do inside of this resolve function.Nearly all data fetching that where ever going to do inside of a node application is asynchronous in nature so we nearly always end up having to return a promise from this resolve function right here.

* OK so I think we've got a plan to move forward on. We need to make and H TTP request inside of this resolve function right here and return the promise that it generates to do so. We can either use the native fetch function or we can use the library axios (both to use for making HTTP requests.)

* Let us add axios to our server 

```
npm install --save axios
```
* Let us import and use axios we don't need axios anymore.

```js
const graphQL = require('graphql');
// const _ = require('lodash');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphQL;

// const users = [
//     { id: '23', firstName: 'Bill', age: 20 },
//     { id: '47', firstName: 'Samantha', age: 21 }
// ];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                // return _.find(users, { id: args.id });
                return axios.get(`http://localhost:3000/users/${args.id}`) /* graphql wait for this promise*/ 
                .then(resp => resp.data); 
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
```

* so through async call we are fething data from db.json

* The key thing to keep in mind about resolver here is that because it can handle a promise we can really fetch data from anywhere you can possibly imagine. You know this can be a third party server.This could be reading a file off the hard drive. It can be a database and anything we want to do resolve is really our playground for just fetching any piece of data in any fashion that we can possibly imagine.

## Nodemon Hookup

* This is not related to our graphQL. Let us do little bit of maintenance on our server. right now whenever we change our server code we have to manually stop and restart our server backup.This is really annoying to have to do and it's really not uncommon to forget to restart the server altogether which of course leads to errors.

* So to solve this we're going to hook up a little package called nodemon to our server package.json

* Nodemon purpose is to watch over all of our project files and automatically restart the server whenever our project code changes.

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "json:server": "json-server --watch db.json",
    "dev": "nodemon server.js"
  }
```
* hereafter instead of "node server.js" to start up our server we have to use "npm run dev"

## Company Definitions

* So I think it's time to move back over to our application and work on a little bit more logic around handling queries.

* As a reminder. We're going to see that every company has an ID a name and a description and then we're going to relate each company to a particular user by adding a company ID property to a particular user. (Refer: graphql14)

* In db.json let us add this company relation.

```json
{
    "users": [
        { "id": "23", "firstName": "Bill", "age": 20, "companyId": "1" },
        { "id": "40", "firstName": "Alex", "age": 40, "companyId": "2" },
        { "id": "41", "firstName": "Nick", "age": 40, "companyId": "2" }
    ],
    "companies": [
        { "id": "1", "name": "Apple", "description": "iphone" },
        { "id": "2", "name": "Google", "description": "search" }
    ]
}
```
* Now we can check "http://localhost:3000/users" for user and "http://localhost:3000/companies" for companies even futher down to "http://localhost:3000/companies/1" as well.

* Now the real question how do we get json server to tell us all the users who work at company with ID one. Well because we added that company ID key to the users object that automatically sets up a relationship behind the scenes with json server.

* ie http://localhost:3000/companies/2/users this will bring all the users working in companies 2.

