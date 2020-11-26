# GraphQL-React

## Fetching Data with Queries

### Nested Queries

* In Json server we have idea about companies, So we're going to put back over to our graphQL schema and add in the idea of a company type inside my schema.

* So it's really important right now that you make sure you define your company type above the user type.

```js
const graphQL = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphQL;

/* CompanyType */
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
});

/* So now you've got the company type in place. We need to associate it with a user. */

/* We treat associations between types get an association between the company type and the user type exactly
as though it were another field.*/

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});

```

* whether we are defining our own type as in the case of company type or using one of the built in ones they're really treated all identically by graphQL

### More on Nested Queries

* We were just working on relating companies with users.We created a new company field on the user type and we told it that it would be of type company.

* Our next step is going to be to find a resolve function on this property. So graphQL who knows how to find the company that is associated with a given user.

* The big thing they want you to keep in mind right now like all of this kind of headache that we're going through in the last section and this one is all about teaching graphQL how to take a user like a user with ID 23 and find their associated company and that is what we're trying to do here.

* We want to teach graphQL how to walk from a user over to a company.

* There is one thing that I want to tell you about before we start writing out the result function however notice that on the user type we call this field company.

* So all the other property names on our user type remain the same but the company ID we seem to kind of arbitrarily change from company ID to just company. (Refer graphql14 and userType code).

* (Refer graphql15).In this diagram on the left hand side.We have the user model So this represents the data that is coming from our json server.It is our very real data that is presumably coming from an API or our database

* on the right hand side is our user type the user type is what we define inside of our schema file.

* when the data that is coming from our database or the user model has an identically named property to the user type. We don't have to do any work whatsoever. Graphql it's just going to say OK the incoming data has an ID I'm supposed to have an ID. I guess that's the ideal use.

* The incoming data has a first name. I have a first name I'll use their first names same with the age. However when it comes to the company ID the user type inside of our schema is the graphQL side of things over here on the right hand side.
It says OK I've got a company but the incoming data doesn't have a company record or doesn't have a company property. So where am I supposed to get my data from ?

* to teach graphQL how to get some data to populate this company property with. We define the resolve function.

* So keep in mind the resolve functions purpose is resolves differences between the incoming json or the incoming data model and the actual data type that we're trying to use here.

* So we're going to use the result function to populate this company property inside UserType

```js
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
              /* Our job is to somehow return the company associated with the given user from this result function. */
              return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(res => res.data);
            }
        }
    }
});
```
* if we try this in graphiql query

```json
{
  user(id:"40") {
    firstName
    company {
      id
      name
      description
    }
  }
}
```
* its response ...

```js
{
  "data": {
    "user": {
      "firstName": "Alex",
      "company": {
        "id": "2",
        "name": "Google",
        "description": "search"
      }
    }
  }
}
```
* So it looks good. It looks like we have correctly associated to our user together with our company.

### A Quick Breather

* I'm going to present you with two sets of diagrams to help clarify exactly what is going on with our schema right now and help us understand how our request is being resolved.

* So let's take a look at the first set of diagrams. (Refer: graphql16) This is what our data's property looks like in a place and I like to call reality land.By reality land I'm talking about the real data that is sitting on our device like in our database. In reality land. We've got the ID first name age and company ID and then we've got the company as well.

* (Refer: graphql17) - On the other side of the coin is graphql land. we treat all of our data as though it were a graph in this world we enter into our data structure through the root Querrey which points us out the user type and then points us at a company type.Right now all these associations are set up in one direction.

* By that I mean we can only go from a user to a company.We cannot yet ask the question hey given a company I want to find all of the users who belong to it. So right now our entire graph is unidirectional in nature.

* Let's talk now about a little bit about what happens when we make a query.(Refer: graphql18) this is the process that we go through when we make a query and it gets sent off to our server when we make our initial query for user with say Id 23 the query goes to our root query within args object that contains an ID of 23 (That's what we passed into the query.)

* We said hey I want to find the user with an ID of 23. The root query then points us to the user with an ID of 23 things to the resolve function.

* So we can think of these resolved functions as taking us from one place on our graph to another location on the graph.So thanks to the resolve function on the query we traveled on to the user 

* then the query says hey you know we also need to know a little bit about the company as well. Tell me more about the company at that point the users resolve function gets called this time with a first argument of the parent value which is the node on the graph that the query is coming from which is user 23.

* The args don't get passed through that chain from earlier on. You know we don't get the args from ID 23 over here.We just get user 23 passed onto this second resolve function

* the resolve function then returns a promise that eventually gives us the company that we're looking for and the whole data structure gets sent back to our user.

*  best to think of our schema or our data as a bunch of functions that return references to other objects in our graph so we can think of each of the edges in our graph as being like a resolve function.

* Another way to think of this is (Refer : graphql19) Each node on our graph or each edge on our graph can really be thought of as being a resolve function.

* So we're working from a node which is an actual piece of data and then if we say hey go find me. You know if I'm this user go find me the company I'm associated with.

* in this diagram. I color coded all the different companies as being blue. And then all of a users as being kind of black and white.

### Multiple RootQuery Entry Points

* we can ask for details about each company that a user is associated with.

* we do not yet have the ability to ask for just a company by itself. So I can't do something like Hey you want to give me the company with an idea of one and tell me the name.

* We don't have a field on the query type that allows us to do this yet.

* So if we think back to the diagram (Refer : graphql18) Remember our Root queery only allows us to go to a user.We dont have the ability to go directly to a company just yet.We can only access the company by first going to the user. And then over to the company.

* So in this section I want to work on adding the ability to go from a root query over to our company directly without having to worry about any users in between.

* After we do that we'll be able to make a query that looks just 

```js
{ 
  company(id: "1"){
    name
  }
}
```
* For this we will get error as "Cannot query field".

* So let's open up our schema file. We're going to find our root query type inside of there.And we're going to add on another field to our query type that we're going to call a company

* So let's get to it in the fields object as a sibling to user.

```js
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data);
            }
        },
        /* CompanyType  */
        company: {
            type: CompanyType, /* because that's what this field is going to return it's going to return a instance of a company */
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data);
            }
        }
    }
});
```
* Now in graphiQL for the companies request we are getting the below response

```js
// request
{ 
  company(id: "1"){
    name
  }
}
```


```json
// Response
{
  "data": {
    "company": {
      "name": "Apple"
    }
  }
}
```
### Bidirectional Relations

* In the last section we hooked up our company to the route query type. so that in graphical we could successfully ask for a very particular company without having to first ask for user.However if I now take this query and ask for you know who are all the users who are associated with this company tell me their first names. We do this. We get an error message that says cannot create field users on type company. So why is that.

* It definitely feels like we should be able to ask a company for all the users who are who belong to that company but it turns out that we haven't actually set up that definition yet or that relationship.

* we do not yet have the ability to go from a company over to a user. So for every single one of these relationships going from one type of data over to another type we have to set up the relationship manually.

* What we want to have is something like this (Refer: graphql20) where we can go from a user to a company or from a company to a list of all the different users who belong to that company.

* So let's get started on the implementation before we do.I just want to remind you one more thing. Every company that we have is has a Association of multiple users so many users belong to just one company (Refer: graphql21). But when we go from a company over to our users I would expect to get back a list of multiple users.

* Okay time for implementation. We're going to handle this in two separate steps.First we need to check out our Json server and figure out how to get our list of users given a company ID. So your company would like "http://localhost:3000/company/2/users"

* For this URL we will get response as below json

```json
[
  {
    "id": "40",
    "firstName": "Alex",
    "age": 40,
    "companyId": "2"
  },
  {
    "id": "41",
    "firstName": "Nick",
    "age": 40,
    "companyId": "2"
  }
]
```
* Remember This is a relationship that is set up for us automatically by on server just because we add it on the company ID property to each of our users.So this is step number one.

* Now that we know how to get a list of all the users who are associated with the company from json server.we can update our schema file to teach the company type on how to go from a company over to a list of users.

* So I got to find my company type in the Fields property. We're going to add on a new property called users.

```js
//Schema.js
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: { // users list
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res => res.data)
            }
        }
    }
});
```

### Resolving Circular References

* We are trying to make use of a variable before it has actually been defined inside of our application. We've got the user type reference up here but only later on do we actually define the user type.

* You might be thinking seman why don't we just first define the user type and then we can define the company type. That way the company can freely make reference to the user. Well that would sure be nice. That would definitely serve me nice but unfortunately that's not going to quite work out. Here's why. Here's my company type. I've got my user type reference right here. Later on I make reference to it. Let's go look at the user type the user type. Also makes reference to the company. So we've got a circular reference between the two types.

* The user depends on the company but the company also depends upon the user.So we've got essentially an order of operations issue here.

* Luckily the creators of graphQL realized that this would be a big issue for whenever we have one type relying upon another.

* So They came up with a little work around to get around it.All you have to do is find our fields object change to arrow function

```js
const graphQL = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphQL;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({ /* here */
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
          type: new GraphQLList(UserType),
          resolve(parentValue, args) {
              return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
              .then(res => res.data)
          }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({ /* here */
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
          type: CompanyType,
          resolve(parentValue, args) {
              return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
              .then(res => res.data);
          }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
        type: UserType,
        args: { id: { type: GraphQLString } },
        resolve(parentValue, args) {
            return axios.get(`http://localhost:3000/users/${args.id}`)
            .then(resp => resp.data);
        }
        },
        company: {
          type: CompanyType,
          args: { id: { type: GraphQLString } },
          resolve(parentValue, args) {
              return axios.get(`http://localhost:3000/companies/${args.id}`)
              .then(resp => resp.data);
          }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
```

* So this turns the fields object right here are the fields property the fields value into an arrow function that will return an object that has keys ID name description end users with the way that closures inside of javascript work.

* That means that this function gets defined but does not get executed until after this entire file has been executed.

* So the entire file will get executed. That will define the company type and the user type then graphed well internally will execute this function and we'll say okay like let's resolve all the types here the user type is now inside of the closure scope of this closure function or this anonymous function right here. It means that everything will be correctly defined as we would expect.

* In short this is not really a graphQL issue. This is really a javascript kind of thing dealing with closures and closure scopes.

* So if you ever have gone through basic javascript courses and heard about closure scopes this is really closer's one on one right here.

* Now that we've got a relationship going from users to companies and from the company to the user we can start doing some really weird things in the graphical world.

* So what would happen if we take our user object right here and we ask the user to tell us a little bit about the company so we can say hey user what company do you belong to.So notice that we have already fetched the company up here. So we got the company we said give me the users associate with it. And then for each user. Tell me about the company you're associated with. So we're really kind of a nest team some data within the company structure. It's the same data really getting copy pasted down inside itself. (Refer: graphql22) We can set up these type of circular relations as deep as we want to go

```json
{ 
  company(id: "1"){
    name
    users{
      firstName
      age
      company{
        name
      }
    }
  }
}
```
* So you can see that we can really nest arbitrarily down with this kind of recursive structure.

* It's very rare that you'll ever actually do this.It's just kind of one of the odd things about graphQL that you can get away with if you so chose.

###  Query Fragments

* Now that we've fully connected our schema of data so we can go from companies to users and from users to companies let's spend a little bit more time to talk about the syntax of the queries we've been making and expand on what we can do with the syntax in here just a little bit.

* First you may sometimes see these queries written like so.

```json
query{ 
  company(id: "1"){
    name
    users{
      firstName
      age
      company{
        name
      }
    }
  }
}
```
* So sometimes you might see it written as saying hey specifically this is a query I'm about to make right here. Now that doesn't change the behavior of the query at all. It just kind of names the query and says Yup I'm making a query. That's pretty much it.

* What is a little bit more useful however is the ability to name the query so I could call it something like fetch company or maybe I can call it find company find company their real name in the query starts to a little bit more useful.

```json
query findCompany{ 
  company(id: "1"){
    name
  }
}
```
* When you're working on the front end and you might have many different queries running around and you may want to reuse these queries in different locations inside your codebase.So for use in graphical and not too useful but when you start to use this in the front end Name your query starts to get a little bit more helpful.

* The next thing I want to remind you about queries is that the opening set of curly braces right here we can kind of imagine that the overall query is being sent to a root query type. So on the root query type we are asking for something from the company field.

* So if we flip back over to our schema file  and then scroll on down to the RootQuery  type remember we've got the user field and the company field.

* The opening set of curly braces you can imagine that that entire query is being sent to this root query object right here.

* And we are asking for a user or a company from from there. Resolve functions take over and we've covered that.

* Now let's talk a little bit more about some syntax around queries. we can freely ask for as many companies in a single query as we would like.So I can take the query up top and duplicate it down on below.


```json
{ 
  company(id: "1"){
    name
  },
  company(id: "2"){
    name
  }
}
```

* You've got this same company or the same query name inside of the same query twice.So we are asking for company twice here 

* We can name the result of the query when it comes back by writing out some arbitrary key in front of it.

```json
{ 
  apple : company(id: "1"){
    name
  },
  google : company(id: "2"){
    name
  }
}
```
* So I would say you know what whatever comes back from this query I want to be assigned to the key apple and then this one down here I want to assign the result to key Google

* why we couldn't have company twice inside that query.Take a look at the response object that we have over here the response key is company and inside javascript we can cannot have duplicate keys on an object. So if we have company twice over here graphic you all just gets confused and it says hey you know what I don't want to put two keys on the object called Company.

* You need to rename at least one of them which we just did by calling one apple and the other Google.

```json
{
  "data": {
    "apple": {
      "name": "Apple"
    },
    "google": {
      "name": "Google"
    }
  }
}
```
* We do not have to rename both of them. We can rename just one of them.So the first one we called Apple and the second one company 

*  I want to talk to you about is the use of what are called Query fragments. 

* You might notice that in both of these company queries that we have right here we are listing out the properties ID name and description twice but some people really dislike that.If We had many other properties on here. It would definitely get a little bit tiresome to have to duplicate them all over the place.So to solve this we can you make use of what are called query fragments.

* query fragment is essentially just a list of different properties that we want to get access to.

* Let's define the fragment first and we'll see how we make use of it.

```json
fragment companyDetails on Company {
   name
  description
}
```
*  now rather than listing out the individual properties in both locations. I can simply write 

```json
{ 
  apple : company(id: "1"){
   ...companyDetails
  },
  google : company(id: "2"){
   ...companyDetails
  }
}

fragment companyDetails on Company { // Company type checking ....
   name
  description
}
```
* When i run this query

```json
{
  "data": {
    "apple": {
      "name": "Apple",
      "description": "iphone"
    },
    "google": {
      "name": "Google",
      "description": "search"
    }
  }
}
```

* So the purpose of fragments is solely to reduce the amount of copy and paste of properties that you want to make inside of your query.

* Looking at the syntax of the fragment first we declare that we want to make a fragment we say that the fragment will be called company details and then very importantly we specify on company.

* This allows graphQL to do a little bit of type checking and make sure that the properties that we're asking for actually belong to the object that we are trying to pull them off of.

* So if I said that I want to pull maybe name and description off of a user which does not have a name and description. Now I get a nice error message that says hey your user object doesn't have anything called Name your user object doesn't have anything called description.

* in practice using fragments inside of graphical and not terribly common only somewhat common you'll see fragments way more frequently when you start to get in the front end as well.

###  Introduction to Mutations

* Nearly every graphical tutorial or resource you'll find out there is obsessed with writing queries to read data from our graphical server.

* Even in this course we've now spend probably 30 seconds or so just figuring out how to set up the ability to read data from our graphical server. We haven't touched the process of manipulating our data in the smallest bit.

* In this section we're going to start to look at how to use graphQL to modify the data stored on our server in some fashion by using a system called mutations.

* Mutations are used to change our data in some fashion. Mutations can be used to delete records update them or even create new records.Mutations are somewhat notorious and graphically well for being quite challenging to work with but I'm pretty confident that we can walk through that process and figure out exactly how they work.

* First I want to mention to you that the json server that we set up earlier has support for editing records that follows the restful conventions that we spoke about much earlier.

* So we have on our graphQL servers simiar db.json server, our collection of users in our collection of companies. 

* following restful conventions. If we post some data to "/companies" that will add a new record to our company's collection.

* We can make a delete request to  /users/23 to delete some particular user.

* So all I'm trying to say here is that we really don't have to worry about the json server setup at all.Everything that we're going to do is can be focused around the graphical side of things.

* right now we're most focused on making sure that this schema works together with these mutations nicely.

* Let's talk about a little little bit how mutations are set up. (Refer: graphql23) 

* Right now our graphQL schema consists of a single root query. the root query gives us access to the user type and the company type

* we are going to set up our mutations in a somewhat similar fashion where we make a nutation type sort of thing. And then we add more or less fields to it do some very particular operation to manipulate our collection of data.

* So we will have a mutation that might add a user to our collection of users you might have a mutation that deletes a user or any other similar operation.All of these operations will be tied to this mutations object.(Refer: graphql23) 

* So none of this data manipulation is going to be associated with the actual types(user, company) that we've defined already.

* we're going to make a completely separate object and teach that object on how to manipulate some of the data in our application.

* We're going to start by defining our root mutation

```js
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addUser: { /*the fields of the mutation describe the operation that this mutation is going to undertake.*/
          type: UserType, /* refers to the type of data that we are going to eventually return from the result function. */
          args: {
              firstName: { type: GraphQLString },
              age: { type: GraphQLInt },
              companyId: { type: GraphQLString }
          },
          resolve() {
             /* we will have logic to add new user here */
          }
      }
  }
});
```
* addUser - the fields of the mutation describe the operation that this mutation is going to undertake.

* type - refers to the type of data that we are going to eventually return from the result function.

* type - The difference is that sometimes when you have a mutation what you were the collection of data that you're operating on and the type that you return might not always be the same.

* And we'll actually see an example of that in the next application that we work in where the type that we are kind of like you we're presumably working with users here but we might not actually be returning a user however vast majority the time we can definitely make the assumption that that is what we're going to be returning.

* I just want to kind of throw it out there and prep you let you know that we're not always going to be returning the same type as what we're working on now.

* when we make a new user. I would expect that user to need a first name and age and a company ID because we would want to associate

###  NonNull Fields and Mutations

* Remember that mutations are used to change our underlying data in some fashion.

* Every mutation that we create will have a very specific name. The one that we've created so far is called adduser. The name should at least somewhat indicate what the purpose of the mutation is. And so in the case of AD user. Yeah I think it's pretty reasonable to assume that that means that we're going to add a user to our database.

* We specify the type that the result function would return which is a user type. And we also specified the args object.

* Now I want to talk a little bit more about these args for just a moment. Let's imagine that firstName is mandatory.

```js
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull /* GraphQLNonNull */
} = graphQL;

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) }, /* this tells our schema that whenever someone calls this mutation they must provide a first name and age. Otherwise an error would be thrown*/
        age: { type: new GraphQLNonNull(GraphQLInt) }, 
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId }) {
        
      }
    }
  }
});
```
* So all it's doing the only validation it's doing is asserting that there is a value being passed in.

* GraphQLNonNull is a helper from the graphQL library. So we will be sure to add in a require statement at the top.

* So we've now told graph Well what the type of record will be that we're going need to return. We've specified these three different args and we've also specified that to the args must be provided for the mutation to run successfully. The last thing we have to do here is fill in the implementation for a resolve function.

* Remember that in a mutation the resolve function is where we actually undergo the operation to create this new record or this new piece of data inside of our database.

* Now for the result function we'll put in a post request over to our Json server.

```js
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId }) { // destructuring firstName, age, companyId from args
        // here
        return axios.post('http://localhost:3000/users', { firstName, age, companyId })
          .then(res => res.data);
      }
    }
  }
});
```

* There is one less thing we have to do. We have created this mutation object right here but we have to actually associated it with our graphQL schema just yet.

```js
module.exports = new GraphQLSchema({
  mutation, // added here...
  query: RootQuery
});
```

* Let's flip back over to the browser refresh the page to make sure that our schema updates if we open up the docs panel now. You'll see that our group types has a mutation type if we click on it we see hey here's the user mutation and we've got string x exclamation mark in the exclamation marks on here indicate that we are requiring that value. (Refer: graphql24)

* So you must provide in a value for the first name and it must be of type string.

* So let's call our mutation clayey mutation has a slightly different syntax from the from the queries that we've been writing so far to indicate that we're going to write a mutation. We first write the key word mutation like so

```json
mutation {
  addUser(firstName:"Guna", age:30, companyId:"1"){
    /* Below or the response we will get back after user added*/
    id /*Notice that because the record has been saved on the server it will automatically be assigned an ID.*/
    firstName
    age 
  }
}
```
* When this post request succeeds it will resolve with the record that was just created over on the base on server side.

### Delete Mutation!

```js
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: { /* the fields of the mutation describe the operation that this mutation is going to undertake. */
            type: UserType, /* type refers to the type of data that we are going to eventually return from the result function. */
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, { firstName, age, companyId }) {
                return axios.post('http://localhost:3000/users', { firstName, age, companyId })
                    .then(res => res.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                .then(res => res.data);
            }
        }
    }
});
```

* I think we're ready to give us a shot inside the browser.

```json
mutation {
  deleteUser(id:"1"){
    id 
  }
}
```
* For the above request we will get response as an object

```json
{
  "data": {
    "deleteUser": {
      "id": null
    }
  }
}
```
* it looks like the user was deleted but why did graphQL fail to return the ID of the user who was deleted.

* Well this is going into the details of how the json server works just a little bit. So here's what's going on.

* So here's what's going on. GraphQL is successfully making the request over to the json server to delete the user but when the user is deleted the json server does not actually respond with any of the details about the record that was deleted. This is how the server behaves by default.

* GraphQL is left holding an empty bag of sorts.It doesn't have a user to return any details from and so that's why we see an id of null inside the response here.

* So this is a little bit of an awkward part of graft. Well in my opinion it really expects to always get back some useful data from that result function but in this case our hands are really tied. Like we really don't have any data to hand it back over to graft well so that it can tell us a little bit about the ID of the user that was deleted or for example the first name or whatever else we might be.

### Edit Mutation!

* Before proceed  I want to remind you about one particular little rough spot and that is the difference between a request and a patch request.

* A put request is used when we want to completely replace the existing record saved on some other remote database with the details inside of our request body. (Refer: graphql25)

* So for example if we take this object over here an I.D. of 23 and a first name of Billy and we made a put request to our Jason server. It would completely replace the existing record with ID of 23. So because our response or me because our requests body did not contain an age and company I.D. the age and company I.D. of I.D. 23 or record 23 would be set to null Again this is an overriding step. So if the record on inside the database previously had a. Age and company I.D. they would be overridden by a request a patch request. On the other hand only overwrites the properties that are contained within the request body.

* So in my opinion you probably want to use a patch request here. Now I would say probably definitely like I highly recommend going with the patch request making a patch request with axios you know is going to look very similar to all the ones that we've used previously.

```js
editUser: { 
    type: UserType, 
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
    },
    resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
            .then(res => res.data);
    }
}
```
* In graphial request as

```json
mutation{
  editUser(id:"40", age: 50, firstName:"Guna1234"){
    firstName
  }
}
```
* So we had said that resolve was going return a user type. That is how graphical nodes to populate all these auto complete fields inside of here.