# GraphQL-React

##  Clientside GraphQL

### The Next App

* let's get started on our next project where we're going to start to venture into the front end and build out a real web application.

```
git clone https://github.com/StephenGrider/lyrical-graphql

npm install
```
### Starter Pack Walkthrough

*  I want to show you this diagram just to give you a better idea of how the back end is working. (Refer : graphql29)

* We still have Express. We still have graph. And the graphQL server the graph a module it's already been put together will be serving down data to the browser. (So this will be like a list of songs or a list of lyrics within a song.)

* There's also a webpack server running in the background as well that together inside of the starter package.

* So the webpack server is what is responsible for taking all the client side react code that we're going to be writing shipping it down to the browser.(Refer : graphql29)

* So this time around we are being served by data out of a real MongoDB database rather than having a kind of fake data json server or some fake data just sitting in memory.(Refer : graphql29). So this is a very real database where we will actually persist all the different songs and all the different lyrics that we create inside of our application.

* The MongoDB database is not going to be hosted on our local machine. You definitely can if you want to. I want to throw that out there. But all the setup that we're going to go through is going to need to set up a mongoDB server hosted for free by Mongolab.com. MongoLab is a service that host mongodb server

* And usually you pay them just scads of money to host production databases for you. And we do that because it really got a reputation for scalability quality up time all that kind of good. But they do offer a free sandbox which is what we're going to be using.

* Now again if you have Mongo DB already installed on your local machine you can definitely use a local copy of Mago DB in this course we're using Mongo lab here.

### New MongoDB Atlas Users
1.  Go to:  https://www.mongodb.com/cloud/atlas and click the "Start Free" button (or Sign In if you already have account)

2.  Create your MongoDB user account.

3.  After creating your account, you will be prompted to create your first cluster. Leave all free tier options selected - AWS, North America: N. Virginia etc.

4. Scroll down on the page to name your app.

5. Click the "Create Cluster" button.

6. Continue to the All Users instructions below.

### MongoLab Setup

* that's to set up a new Mongo DB database hosted remotely by Mongo lab or in lab. Refer : https://mlab.com/

* The only reason that we are using in lab here rather than setting up a local database on our own machine is just to avoid doing any type of set up on our local machine.

* So once I'm signed in I'm going to find the create new button on the top right hand side to create a new database.

* Once db created click on it there you will see To connect using a driver via the standard MongoDB URI

```
mongodb://<dbuser>:<dbpassword>@ds117829.mlab.com:17829/lyricaldbgraphql
```
* So this is the URL or you or I that we're looking for right here. However you will notice that it says DB user and DB password in here.

* So of course this is saying hey you need to replace DB user right here DB password with your username and password.

* Now you might be tempted to think oh well that's the data that's the username and password for in mlab.com. And that's actually not the case. It is not your username and password that you just signed up to.

* Is talking about users who are assigned to that database as like a database administrator now by default. So to use this URI right here we have to first add a database user with a username and the password and then we can make use of that Mongo DB you or I up here.

* And then I should see the new database user appear right here and you'll notice that it does say read only false which is exactly what we want because this is not a read only user. It is a user who should have both read and write access to the database.

* So now that we created this new user we can make use of the Mongo DB URI appear so I'll select you or I can copy it.Then we'll flip back over toward code editor. I'm inside my server.js

```
const MONGO_URI = 'mongodb://<dbuser>:<dbpassword>@ds112qWQW.mlab.com:1129/lyricaldbgraphql';
```

* So that should be it. I think we're about ready to do a little test here let us running
```
npm run dev
```
* if successful it will show Connected to MongoLab instance. then you are done connected to MongoLab

### Working Through the Schema

* I've now got a graphical open and we're going to spend a little bit of time to walk through all the schema that has already been set up in the project that we're making use of it. "http://localhost:4000/graphql"

* one of the fantastic things about graft well is the automatic automatically generated documentation system that is available to us from within graphical.

```json
mutation{
  addSong(title:"Aluma doluma esaa langadi saaluma"){
    	id
  }
}
```
* Response will be
```json
{
  "data": {
    "addSong": {
      "id": "5fc0e338c42ab9368d0dbc01"
    }
  }
}
```
* You'll notice here that we've got this really long string for the ID these are this is a good hour and expect to see coming back from Mongul lab.

* But the good thing about that is that they're usually globally unique. So even if I have multiple collections of data like say a collection of songs and a collection of lyrics usually ends up that the ideas I get are unique between all these different collections which is especially relevant later on in the client side of our application.

```json
mutation{
  addLyricToSong(
    songId: "5fc0e338c42ab9368d0dbc01",
    content:"asasasas ScZXc ZXczxczxcv zxcvzxcvzxcv"
  ){
    id
  }
}
```
* for the above request we will get below response

```json
{
  "data": {
    "addLyricToSong": {
      "id": "5fc0e338c42ab9368d0dbc01"
    }
  }
}
```
* We can fetch all songs as well

```json
// Request
{
  songs{
    id
    title
    lyrics {
      id
      content
    }
  }
}
```
* for the above request we will get below response

```json
{
  "data": {
    "songs": [
      {
        "id": "5fc0e338c42ab9368d0dbc01",
        "title": "Aluma doluma esaa langadi saaluma",
        "lyrics": [
          {
            "id": "5fc11951b005e36ffa48e24f",
            "content": "asasasas ScZXc ZXczxczxcv zxcvzxcvzxcv"
          },
          {
            "id": "5fc119e9b005e36ffa48e251",
            "content": "czxczxczxczxczxcv"
          }
        ]
      }
    ]
  }
}
```
### Apollo Client Setup

* It's time to work on the client side of our application.

* It's time to work on the client side of our application. Inside my project directory I'm going to find my client folder and then open up the index file. This is the starting point of our application.And inside of here you'll notice that I've got a component defined as root where it currently is just showing a single div with the text "lyrical" inside of it.

* The vast majority of early work inside of our application for getting a couple of different pieces set up we are going to do all the Apollo setup and all the graphQL set up from scratch.

* A lot of the work that we're going to do here is going to revolve around how we kind of wrap our react application with some helpers from the Apollo client library.

* So let's get a better idea or a better understanding of exactly how that's going to work. (Refer : graphql30)

* So in this diagram kind of diagram out more or less how a react application is going to work with the graphQL server on our back end

* What's really important is to understand exactly how our react to application is going to work with the graphQL server

* in-between our react application and the graphQL server are two different important pieces of technology.The first is the Apollo provider. The second is the Apollo store.

* The Apollo store is what is going to communicate directly with the graphical server and store data that comes back from it.

* So we can think of this Appollo store as a store of data that exists on the client side of our application. The Apollo's store is a client side repository of all the data that is coming from the graphQL server

* we're going to talk a lot about exactly what is going on inside of that store and what data is really being held inside of there as well.

* The Apollo store is a really a abstract piece of technology. It is something that doesn't really care about what client side framework we're using for showing data on the screen.

* So the Apollo store it has no idea  that we're using re-act the integration layer  it doesn't care it could care less that we're using re-act 

* the integration layer between the Apollo's store and our actual react application is the Apollo provider.So it's a provider of data to our react application is the Apollo provider.The provider will take data from the store and inject it into our re-act application.

* It is the glue layer between the Apollo's store and our actual re-act application.

* So a lot of the configuration and probably the vast majority of the configuration we're going to do is around the Apollo provider

* for the most part the Apollo store is going to be pretty standalone and we're not really going to have to touch it too much 

* So in this section we're going to continue with doing a little bit to set up the provider in the store and throughout the rest of the section we will also talk a lot more about exactly how the provider interacts with the store to get data into our application.

* the first thing that we're going to do is do a little bit of a refactor to this root component in index.js to create our new Appollo client and set up the Apollo provider.

* Now I've already installed the relevant libraries inside of this starter package so we don't need to install any modules here. They are already installed for us but for any package or any project that you're going to work on yourself you will want to install these modules yourself.

```js
//client/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client'; /* This is what is actually interacting with our graphQL server on the backend is what is actually making requests for data and then storing that data locally when the response comes back.*/
import { ApolloProvider } from 'react-apollo';

/* we create new instance of ApolloClient and pass it to the ApolloProvider */
const client = new ApolloClient({}); /* empty configuration object right here*/

const Root = () => {
  return (
    // take that client and pass it to the Apollo provider.
    <ApolloProvider client={client}>
      <div>Lyrical</div>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
```
* Apollo client really has no idea that we're working with re-act here.It is not tied to any specific client side rendering library like react angular or vue js 

* Apollo provider imported from react-apollo package that is saying OK I know how to work with a client.I also know how to work with react. I will take care of being the glue layer inside of this application. So now we can make use of that Apollo provider.

* One thing I want to mention about the Apollo client is that we passed in an empty configuration object right here. So out of the box Apollo client is kind of nice in that it makes a couple assumptions about how your back end is set up. Everything we've done so far like all this code is all that is required for getting Apollo to interact with our back end server.

* Everything we've done so far like all this code is all that is required for talent for getting Apollo to interact with our back end server.

* So you'll notice that we didn't have to tell Apollo client to go like look at some specific endpoint on our server. It just makes the assumption of where our graphical server is listening for incoming requests (ie empty configuration)

* if you move to server.js there you could find we had set up that express graphical server to listen to the /graphql endpoint on our server.

```js
// am talking about this...
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));
```

* So we are listening on a very specific endpoint for incoming graphQL requests the Apollo store or the Apollo client that we just created right here assumes that the graphQL server is available on the /graphql route.

* So there is some kind of assumptions made by this Apollo client right here on exactly how your back end is set up.

* If you start to deviate from those assumptions you're going to have to start to add a little bit more configuration inside this object (new ApolloClient({})). But for the vast vast majority of applications you'll probably ever work on. The assumptions are going to line up pretty well and you won't really need have need to have to add in any additional configuration.

* The last thing I want to mention about the Apollo provider right here again it is the glue layer between react and the Apollo work ie graphql world

* Apollo provider itself. It is a re-act component which is why we're using JSX tags around it and we're passing it the client as a prop.

* Again we will come back a little bit later and talk about exactly how Apollo provider is shoveling data over to the react side of our application.

* All I really want to say right now is just to point out that yes it is a react component and we are passing it a reference to the Apollo store.

### React Component Design

* In the last section we spent a little bit of time doing the very root level set up for application. We made use of the Apollo client library and the react Apollo library. Remember Apollo client is frontend or rendering library agnostic. It doesn't care if we're using react or vue js or backbone or angular it just wants to get data from our server and store it locally.

* in this section I want to really prove that to you. I want to create a new component that will show a list of all the songs in our application and we're going to write out some query in our code here somewhere that's going to go and fetch that data from the server like the list of songs from the server.

* So we're going to get started with the actual react side of our application the section.

* We are going to create a song list component

```js
//SongList
import React, { Component } from 'react';

class SongList extends Component {
    render() {
        return (
            <div>
                SongList
            </div>
        );
    }
}

export default SongList;
```

* To view this component in our application we need to inform root component about this component

```js
//index.js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import SongList from './components/SongList'; // we import SongList and use it below

const client = new ApolloClient({});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <SongList /> 
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
```
### GraphQL Queries in React

* The songlist component is supposed to show a list of all the different songs on an application to the user. So we need to make sure that we somehow get data from our graphQL server into this component

* So that's a we're going to take care of inside the section to help guide us through that process. We're going to walk through a little checklist. (Refer: graphql3)

* first we will fetch the exact data we want graphql promise us exact data not over fetch. then for our practice use graphql to wite query and then bond query to the component to access data

* All we have to do is define the query and boom the data is going to show up inside of our component which is really nice.

```json
// this query we already practice in graphql
{
  songs{
    title
  }
}
```
* Now we can use this query inside of the component,to handle all the different queries that we're going to write inside of our component file. We're going to make use of a library called graftQL tag.

```js
import React, { Component } from 'react';
import gqltag from 'graphql-tag';

class SongList extends Component {
    render() {
        return (
            <div>
                SongList
            </div>
        );
    }
}

/* here we used back tick (This is using template strings from es6) to wrap query */
const query = gqltag`
{
    songs {
        title
    }
}
`;

export default SongList;
```
* graphql helpers library help us to write queries inside of a component 

* We are using a template string and using the helper from the gql library to form up the query itself.

###  Bonding Queries with Components

* We already defined the queries now we have to execute query. It is just forming up the idea of a query that can be executed at some point in the future. Now we have to execute query.

* to bond our query in our component together we're going to import another helper library

```js
import React, { Component } from 'react';
import gqltag from 'graphql-tag';
import { graphql } from 'react-apollo';

class SongList extends Component {
    render() {
        return (
            <div>
                SongList
            </div>
        );
    }
}

const query = gqltag`
{
    songs {
        title
    }
}
`;

export default graphql(query)(SongList); 
```
* while export we combined query and component, So make sure you've got one set of parentheses around Querey and then a second set around component ie SongList

* So the first part returns a function and we are immediately indicating that function with the second set of parentheses.

* The idea behind bonding the query and the component together works like so (Refer : graphql32)

*  when we first render our component to the screen the query that we wrote will be automatically sent to our back end server.the query got sent to the backend server to fetch some data for us.  fetching some data from the server is an asynchronous process. It is something that takes some amount of time. So when the component gets rendered it will show up on the screen temporarily without any data whatsoever. Then after some amount of time when the query is complete the component will be automatically re-rendered with the data that was fetched from the query.

* So now the real question we need to answer is where does this data appear. Inside the component like OK the query was executed and the query was resolved by the server. How do we actually make use of the data.

* the data that we that it gets returned from the graphQL query is returned and placed inside of our components prop's object

```js
class SongList extends Component {
    render() {
    console.log(this.props); //by this.props we could access data
    return (
      <div>
        SongList
      </div>
    );
  }
}
```
* Now before we execute that in the browser I just want to remind you one more time that when we run the query it takes some amount of time for the query to actually be completed.

* So our component is going to be rendered two times one time without any data.And then a second time after the data has been returned from the server.

* songs is only available after the query has been completed. This is really important because if our component always assumes that songs are being passed to it we might run into some type of error where maybe the songs have not been fetched yet.And I kind of suspect we just might run into that issue.
