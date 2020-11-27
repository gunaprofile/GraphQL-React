# GraphQL-React

## The GraphQL Ecosystem

###  GraphQL Clients - Apollo vs Relay

* We've made a lot of progress so far with graft well but so far all of that progress has been limited to the graphical client here in the browser.We still are not actually putting any of this information onto a screen that an end user can look at.

* but I really do not expect my end user to boot up graphical and write out the queries for the information they want to get from my application.

* instead I want to take my graphQL server I want to take the information out of it and I want to integrate that with some front end framework like React 

* I can use react then to pull information out of graphQL tool and have it show up on the screen and some nice pretty fashion which will give my users something very easy to look at.

* So in this section we're going to start working towards taking our graphQL through all server and integrating it with react.That's the good news.

* The bad news is that this is also where graphQL starts to get a little bit hairy, GraphQL is bleeding edge of the Internet and web design technology. And there's a lot of very rapid changes that are coming out in the graphQL ecosystem especially on the front and side of things.

* So in this section we're going to look at some of the different evolving technologies that are used on the front end of graphQL applications and we're going to talk about the pros and cons of each of them. 

* So my overall goal here is really to get you familiar with some of the different libraries and to yield to speak intelligently about the purpose of each of them.

* After we talk about each of these libraries we will pick one and move forward with it. 

* To start off with I want to remind you of where we're at right now. (Refer: graphQL6)

* Anyways we've got a graphical client running inside of the browser right now.We write out a graphQL query which presumably gets sent down to our express server in some fashion

* then the graphQL side of things. Works with our json server data store to formulate a response and send that back to graphical.So that is what is happening right now.

* One of the really important parts about this application and especially understanding how we're going to integrate a client to read the data from our graphical server is to understand exactly what information is being exchanged with the server.

* In particular talking about graphQL query. If we can understand what information is being sent from the browser to the server. Maybe that would give us a little bit more insight on exactly how we can interface with the graphQL server.

* So if we understand what information is being exchanged here maybe it'll give us a little bit more insight on how to work with grahQL inside the browser when working with re-act.

* If you check the inspect network to check graphical call response.. So clearly the response that comes back from our graph server is just very plain very raw data.

* If you check the request payload Now inside here you'll see that the request payload has three properties.The operation name, the query and the variables.will talk about what variables is later on.

* But right now I really want to focus on the query.The query is the exact character  we entered into our graphical client.This is actually rather important to understand.

* Out of all the different clients that we can make use of and the graphQL they all really speak the same language over the wire.They all speak the same identical type of queries that we see right here.(Refer: graphql26)

* So no matter what front end client I'm using and no matter what back end client I'm using they can all communicate with each other because they're exchanging the exact same information. There's nothing library specific about this query that's being issued right here.

* The only point that I want to make right now is that the front end application and the back end application we can kind of imagine are working just like how traditional Ajax request with json work.

* It's really just data over the wire that is more or less unformatted and not specifically formatted for any one particular technology

* So I just wanted to make that first point clear let you know that hey we're using one client that doesn't necessarily mean that we can't work with another particular back end graphql server.

* So let's now pivot just a little bit and talk about exactly what this graphQL client is going to do for us.

* The big difference is what's going on inside the browser now. So we're going to very soon have a re-act application and this reactor application is going to be very tightly coupled with a graphQL client.

* The purpose of this graphQL client right here is to do exactly what graphical is currently doing.

* We're going to handwrite out some queries we're going to feed them into this graphQL client then the graphQL client will issue them to our back and get some response back and then pass that data onto our react application.

* So we really should be thinking of this graphQL client that we're going to be using as a bonding layer between react and graphQL server.

* Everything you're just talking about about how this graphQL query right here is essentially language agnostic or at least technology or client you know type agnostic is really to describe the relation between this graphQL client and the graphQL server that we already put together.They are very loosely coupled.

* So again these are javascript clients that would be made use of inside of the browser. These are not necessarily back end technologies. So these are all three these are loosely organized in kind of increasing difficulty or increasing complexity
(Refer: graphQL27)


  * Lokka - As simple as possible. Basic queries and mutations, simple caching.

  * Apollo - Produced by Meteor team, Good balance between features and complexity

  * Relay - Amazing performance for mobile. By far the most insanely complex. used by Facebook team.So if you are working on application where you absolutely unequivocally know that your users are going to have awful internet connections then relay is definitely a very good solution to go with because that is really what it was built for.However you pay for all that performance in complexity 
  
* But if you're making if you're building application for a startup I have to direct you away from relay  I have to right now because it is relay overkill in some places for your general typical application.

* So that is our overview on graphQL clients remember the purpose of each of these is to make a request to our graph tool server get the response back and forward it on to the react application. we will be using Appollo client

### Apollo Server vs GraphQL Server

* So in the last section we were discussing all the clients that we were making use of. So when I say client I'm talking about something that runs in our users browser but we're also making use of a graph tool technology on our back end as well.

* So on the back end that we've been working on. So here is our schema file. This is our graphQL back end right here.
If I open up my package.js on file which contains all the dependencies that our project has You'll notice that we are using Express graphql. So this is not a part of the Apollo stack.

* There is an Apollo server that we could be making use of. But I made the decision to go with Express graphQL. So I want to take a second to tell you why we're going this direction rather than using the Apollo client.

* So this is a little snippet of code out of each of the out of the schema file from graphical express and then the possible equivalent file from the Apollo server on the right hand side. (Refer: graphql28)

* The server that we're using graphical Express is referred to as the reference implementation of graphQL because it is the official implementation that Facebook maintains and it's the sort of spec on how a server can be implemented with graphQL.(Refer: graphql28)

* Well Apollo server on the other hand is a different interpretation of how to implement graphQL on the server.Neither of them is inherently better than the other.

* I made the executive decision to go with  graphql Express on the backend because it is significantly far less likely to get big API changes in the future.

* Apollo server is still in very active development and might get some very earth shattering very big API changes in the future. And even in the past couple of releases that they've done over the past couple of months opposer has changed in a big way.

* Express graphQl however has been relatively stable in the last year or so and so personally I think that you're getting more backup by doing graphql express right now than worrying about big API changes with the Apollo server

* graphql express side we form up these really big objects you know the graph tool object type things from these really big objects and inside of each then we list all the different fields that each one has and then resolve functions to kind of travel between each node on the graph of all our data.So that's what we've been doing so 

* with the Apollo server. However they really break up all that information into two separate files or two separate locations

* on the Apollo server world.They require you to define a schema file that uses kind of a fancy markup language to describe what each type of data looks like and the relationship between each of them.

* So the big difference between the Apollo server and graphical express is that graph tool express co-locate. All of that type information with the resolve logic whereas the Apollo server says Give me just one location to define almight types and then a location separate location to define how to relate all the types together.