# GraphQL-React

## Frontend Mutations

### Mutations in React

* So presumably whenever a user enters some text here and then presses Enter that's probably the point in time at which we're going to want to somehow reach out to our back and graphQL server and add this song to our list of songs.

* to do so we'll add a on Summit event handler to the forum tag itself.

```js

class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { title: '' };
  }

  onSubmit(event) {

    event.preventDefault();  // So this keeps the farm from attempting to summit itself.
  }

render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

export default SongCreate;
```

* Remember that whenever we talk about editing or modifying or creating new records on our backend server we are immediately thinking mutation in our head.

* So we're really thinking how am I going to use a mutation to update the data on my back and server we

* Now we have to try out mutation query in graphical

```js
mutation{
  addSong(title: "Dog Call"){
    id
    title
  }
}
```

* So let's take this mutation and we're going to move it over to our component file.

```js
import React, { Component } from 'react';
import gql from 'graphql-tag';

class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { title: '' };
  }

  onSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

const mutation = gql`
  
`;

export default SongCreate;

```

* Hey wait a minute we have to provide the title inside of this thing. We have to provide the title inside of the mutation itself but we only know the title of the song inside of the form or inside the component. How are we going to communicate some data from the re-act component to the mutation itself.

* Ha let let me let's rewind here just for a second to make sure we're on the exact same page on this little issue that we just ran into. We've been saying all this time that whenever we call a mutation we pass the data for the mutation directly into it.

* But now all of a sudden I'm defining a mutation outside of the component class. How do I get data from the component class like specifically the state object on the component class back into this mutation that is defined completely outside of the component class.

* You might be thinking Well can't we do like this.state.title.No not at all.Remember how state works inside of javascript.this.state.title can only be used from inside of the component instance.

* This is a variable that is being declared outside of the component class.

### Query Params

* we ran into a huge show issue when we realized that whenever we call this mutation we have to pass in the title of the new song. But the title is only available inside of the component itself. In theory we want to call the mutation from this on submit event handler right here. So we have to somehow communicate the title of the song into that mutation.

* so that what we are going to see now here.

* To take care of this issue of somehow communicating data into our mutation.

* I want to think of mutations like a function. We're going to pass some argument to it from some outside source.

* We make use of the system inside of grafQL called query variables which is defined down here at the bottom left of the interface

* query variables are used to inject some variable from outside the query into the query. query variables are most frequently used inside of graphQL absolutely with mutations

*  we'll also use them with queries some time when ever we want to have a react componenet that somehow customizes the query in some fashion which is extremely helpful whenever we start thinking about say filtering or pagination.

* If you want to get only the first page of data from a query then the component needs to tell the query that has been made. Hey I only want the first page of data

* to communicate from our re-act component to the query or mutation itself. We make use of this query variable'

* So let's talk a little bit about how these query variables work.

* First the big thing to understand here is that the real change that's going to go on to make use of these query variables is how we write out the mutation and how we write out queries to make use of query variables.

* Going to flip over to a slide that's going to show us a little bit alternative syntax to mutation rate here that will help us understand exactly how we're going to modify that mutation.

* (Refer : graphql34) we still have this mutation keyword.We have the curly brace on the end and then inside of the mutation I'm still calling add song and saying hey here's a title that I want to pass in.

* first immediately after the key word mutation we're going to add a name for the mutation in this case am calling it AddSong.(Refer : graphql34)

* The purpose of ADD song out here is to have more make kind of.You should really imagine this mutation now as being a sort of function that we can call from anywhere inside of our application.(Refer : graphql34)

* So I would expect that by saying Hey everybody I have a mutation called add song when you call it it's going to invoke the AddSong mutation on our server.

* In practice the name of the mutation right here can be anything we really want. So it's not tied to any part of our back and schema it's not tied to the graph to all server in the back end it's really something for naming it for our personal use

* The named mutation will take some number of parameters or arguments into it just as we are used to with an individual mutation call like add song down here.

* But you'll notice that the argument list is a little bit unexpected.It says this is probably something we're right now I expect you're kind of scratching your head and saying this kind of seems arbitrary and strange like what's with the name of the mutation.

* Why am I passing in arguments right here. Again you want to be thinking of this thing as being a function of sorts.

* So this is like the name of the function and this is the same arguments you are passing into the function and it's going to customize the body of the function or the body of the mutation 

* So let's talk a little bit about the arguments that we pass in. The first thing I want to point out is that the argument list in here has a very different format a very different syntax than what we're used to with the argument list that we've previously had inside the mutation.

* We first list out dollar sign and then title that is the name of the parameter or the name of the argument that has been passed into this mutation.

* We then place a colon and then the type that that parameter is coming in as. So for a title I really expect that to be a string.

* So I'm going to annotate it as being a string to let everybody know hey if you call this mutation and you pass in a title I expect it to be a string

* once we call this mutation and pass in a title. We then have access to the dollar sign title variable inside of the mutation body.

* So anywhere inside this mutation we can now refer to dollar sign title and it will be a direct reference to the value that we passed into this mutation.

* We make use to make use of dollar sign title anywhere where we had previously just been passing in a direct stream.

* So notice that in the past we said hey that title should be exactly this you know. So the string dog call I'm now saying the title should be whatever was passed in as Dollar Sign title.

* So if you really think of dollar sign title as a reference back to the argument that was passed into the mutation itself

* mutation arguments at the very top we say variable name and then type. But then inside of the mutation body we're saying argument name variable name.

* So it's changing it's going from being first to second and then the other argument is changing from being a type to the name of the argument

```json
mutation AddSong($title : String){
  addSong(title: $title){
    id
    title
  }
}
```
* So now if we run this query we don't really get any argument at all. We passed in a title of no like we had undefined title I didn't define a variable of title.And so when I get a response back I get a title of null

* Because I did not pass in a title there is no validation on the title however like I didn't add any validation on the back end to say you must provide a title.

* So the record is still successfully created and but it has a title of null which is definitely probably something I don't want to have in my application.

* then pass title query variable as (Refer : graphql35)

```
{
  "title": "Hai Hello song title here"
}
```

* And you'll notice that the title has properly been sent into the mutation.(Refer : graphql35)

* So whenever you create a mutation that refers to some Query variable graphical is going to look at the defined query variables. It's going to take any defined query variable that matches up with the name inside of here and it's going to take the value and push it in as the value of dollar sign title.

* The real big thing to keep in mind is that when we're defining queery variables inside of graphical we do not use the dollar sign.So just the name of the query variable without the dollar sign. And you should be good to go.

### Defining Query Variables in React

* In the last section we checked out the use of Query variables inside of graphical to communicate some outside data to our mutation.

* This allows us to write a single mutation that is going to be working for a wide variety of different uses because we can customize it over time.

* We still have one big hang up however and that is we still don't really know how to somehow communicate our title of the song from that component to the mutation.

* There is of course a way to handle this using a graphQL so let's modify our mutation to look a little bit more how it does in the graphical simulator and then we'll worry a little bit about exactly how we communicate from the component down into this mutation

* So the first thing we're going to do is update the mutation to use that modified syntax we saw.

```js
const mutation = gql`
  mutation AddSong($title: String){
    addSong(title: $title) {
      title
    }
  }
`;
```
* Now we have to think about how we're going to communicate data from that component to the mutation itself.

* The first thing we'll do is sandwiched the mutation and the component together by using that graphical helper from the re-act Apollo library.

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo'; /* Make sure you import graphql to combine mutation and query to component */
import gql from 'graphql-tag';
import query from '../queries/fetchSongs';

class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { title: '' };
  }

  onSubmit(event) {
    event.preventDefault();

  
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

const mutation = gql`
  mutation AddSong($title: String){
    addSong(title: $title) {
      title
    }
  }
`;

export default graphql(mutation)(SongCreate); /* Her we combined this mutation with SongCreate component*/
```
* when we priviously did this using the query that we'd written out not mutation we use the query we saw that we got access to a property on our props object called data when we wrap a mutation. However that system changes just a little bit.

* So when we wrap a mutation we pass a mutation into the graphQL helper right here instead of getting access to something called props.data We get access to something called props.mutate

* so mutate appears to be a function that we can call if we call this.props.mutate it invokes the function that is tied to our component.

```js
//this.props.mutate it invokes below function
const mutation = gql`
  mutation AddSong($title: String){
    addSong(title: $title) {
      title
    }
  }
`;
```
* The real question is how do we communicate this queery variable into it And the answer is very simply 

```js
 onSubmit(event) {
    event.preventDefault();

    this.props.mutate({
      variables: {
        title: this.state.title
      }
    }).then(() => hashHistory.push('/'));
  }

```
* after called mutate we return back to song list component... and finally

```js
// Song create component
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, hashHistory } from 'react-router';
import query from '../queries/fetchSongs';

class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { title: '' };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.mutate({
      variables: { title: this.state.title },
    }).then(() => hashHistory.push('/'));
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

const mutation = gql`
  mutation AddSong($title: String){
    addSong(title: $title) {
      title
    }
  }
`;

export default graphql(mutation)(SongCreate);

```
### Troubleshooting List Fetching

* In the last section we finished up our first full flow of going from a song list and be able to click over to create a new song creating one and then automatically going back and seeing appear on the screen and that definitely worked the way we expected.

* There is a issue here unless we refresh we don't get the latest record from the DB.

* Well I definitely got the song appearing on the screen so it appears that the mutation worked correctly in that the record was created at my back end. But when I went back over to this page the data did not automatically appear on the screen.

* Hmm well let's take a look at a diagram that will maybe help us understand a little bit more about how Apollo works with the re-act side of our application.(Refer: graphql36)

* so we're going to walk through this flow right here and we're going to walk through two different scenarios the two scenarios that we just went through.So the left hand side I've got cold cache right hand side is warm cache.

* we should more think of this as just being the left hand side is the flow. Where I refreshed the page on the Create song form and the right hand side is when I go first to the song list and then navigate over to the Create song and go through that flow.

* So the right hand side is the side where things appear to not be working as I expect the left hand side is the good flow where everything went how we would want it to.

* So let's walk through these two flows.

* on the cold cache (Left handside) We currently are creating a new song that send to mutation The mutation runs successfully and then we get automatically redirected to the song list.

* As soon as we start to render the song list on the screen our query is automatically executed for us some number of songs are fetched in our component automatically read renders when the query is complete to show the list of songs on the screen. exactly the way we would hope. Exactly how we would expect.

* Now let's walk through this alternate situation in warm cache (Right hand side)

* The case in which I first go to the song list component and then go create a new song and come back to song list.

* So in this flow I'd go and fetch my list of songs we run that query we say give me all my songs I want to hear about them and we get back a list of songs we'll just imagine that we can call them songs 2, 3 and 4.So we'll say songs 2, 3 and 4 have been fetched. They are now sitting on the client side. Then we go to the Create song form and we create a new song called no. 5 . My expectation my hope would be that song number 5

* However when we are forcibly redirected back to the song list graphql says or I should say Apollo says you know what the song list queery I already fetched that thing.I do not need to run that query again. I could but you know what. No thanks I'm not going to that.

* so the result is that we only  re-render that form or see that list we render that list only with songs 2 3 and 4 because we do not refetch to get Song number 5 on our client side store

* So the big problem here is that our query right now to fetch our list of songs is only been executed one time.

* Now this is a very common problem throughout the entire Appollo world.

* Whenever you're working with a list of records if you go to insert a new record into that list you very frequently are going to have a little bit of trouble in making Appollo realize that you just created a new record that belongs in that list of data.

* Apolo is not going to assume oh hey you know what they just created a new song. Surely every other or every list of songs I've already fetched wants to get want to see this new song added to it.

* We can kind of imagine what's going on inside of the Apollo client or Apollo store as being something like this. It's kind of saying OK Will the first time I go and fetch your data. I'm going to grab song 2 3 and 4. And those are tied to the song list component. They're tied to this query that we just executed. When we then go and create song number five. Apollo says oh you know what. I know the song number five exists. I know that it's there but I'm not going to try and go back and insert it into any existing lists or collections of data that you've already fetched. I'm going to assume that all those collections you've already fetched are sitting off in their own nice little buckets in their own little containers and they don't really need to get this new song that we just created added into them.

* So our job what we need to do to make this thing work the way we expect is to completely rerun the query that fetches our list of songs after the mutation has been executed.

* If we rerun the entire queery then when Apollo gets the response back it will say Ah I see. OK song number five is a part of these songs that I should be showing inside of the songs component

* So our job is to instruct Apollo that when after we create this new song we do wanted to rerun the query that it's already executed and understand that song number five should be a part of the song list or the list of songs that we want to show on the song list component.

###  Refetching Queries

* So in this section we're going to figure out how to address this. Now the Apollo team is not crazy.They absolutely know that this is outstanding. I don't quite what to say bugger issue. I should say that they know that this is something that people want to fix inside their applications and so they've made a very easy tool for allowing us to re fetch a query after we have ran a mutation.

* So I'm inside of my song create file right now. I'm not the onsubmit handler and I've got my mutation.

* Right now we are passing it a single property of variables. And if you recall this is a variable to inject into the actual query to customize the way in which the mutation runs this query object that we're passing to the mutate function takes another property that we call refetch queries

* the refetch queries property will take an array of queries so we can pass it a list of different queries that should rerun automatically after the mutation is successfully executed.

* So we can pass the query that we want to run directly into this thing right here and query will automatically rerun after this file or after the mutation has been successfully completed. 

* We're going to say after you've ran successfully rerun the query to fetch the list of songs.

* Now the only kind of interesting part about this is that when we are passing in a specific query right here we are passing in the actual query like the actual graphQL or graphQL tag Query. So this little bit right here.

```js
const query = gqltag`
{
    songs {
        title
    }
}
`;
```
* So we have to pass in this exact query to that mutate function to let us know exactly what it needs to rerun.

* So in practice we generally do not duplicate queries throughout our code base. So if I write a query inside of my long song lists component write here to fetch my list of songs I don't want to be copy pasting this all over the place.

* I want to just write at one time and then be able to have to refer to it from different locations in my code base.

* So a very common convention that you'll see in graphQL applications is to pull queries just like this one right here into a separate file and then import it whenever we need to get access to this query

```js
//fetchSongs
import gql from 'graphql-tag';

export default gql`
  {
    songs {
      id
      title
    }
  }
`;
```

Now we can import and use this query inside our mutate function to rerun the query after mutations

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, hashHistory } from 'react-router';
import query from '../queries/fetchSongs';

...
....
onSubmit(event) {
    event.preventDefault();

    this.props.mutate({
      variables: { title: this.state.title },
      refetchQueries: [{ query }] /* this refetchQueries will solve our refetch issue*/
    }).then(() => hashHistory.push('/'));
  }

```

* Again the reminder here is that we need to make sure that whenever we insert a new record to a list of data we might have to refetch the query that is associated with it.

* finally ... create song will be

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, hashHistory } from 'react-router';
import query from '../queries/fetchSongs';

class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { title: '' };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.mutate({
      variables: { title: this.state.title },
      refetchQueries: [{ query }]
    }).then(() => hashHistory.push('/'));
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

const mutation = gql`
  mutation AddSong($title: String){
    addSong(title: $title) {
      title
    }
  }
`;

export default graphql(mutation)(SongCreate);

```
### Deletion by Mutation

* So in my mind I'm kind of thinking of two different pieces of code that we're going to have to add.

* One piece of code on the react side that will delete the existing Orosius me that will show an icon over here that the user can click to delete the song and the will also have to add an event handler that will probably call a mutation to make sure that the song actually gets deleted.

* Remember any time that we're talking about editing creating or deleting a record in our data source we automatically want to be thinking about mutations.

* So we're going to approach this mutation the exact same way we've approached all of the other queries and mutations.

* We're going to do this by first starting inside of graphical and writing mutation out by hand and then migrating that mutation over to live inside of one of our components.

* (Refer : graphql37) Now you'll notice that the we've got a little bit of a red highlight here and it says that we are using an ID of type string when type ID was expected. So the back end that I've put together has a little bit different assumption about the IDs that we're passing around here in the past application that we worked on we were saying that the IDs were always of type string.

```js
mutation DeleteSong($id: ID){ /* here we used type ID*/
  deleteSong(id: $id) {
    id
  }
}
```
* is just another type just like the string type just like the integer types that we've used previously. It is just another primitive type available to us in our graphQL schema.

### Associating Mutations with a Component

* when you finish experimenting with the delete song mutation inside of graphical. So now afraid to move it over to our song list component and wire it up.

* So I want to use the song list file to host my mutation cause I expect that every single song that I render inside of the render songs help or right here is going to get like a big X next to it or a big trash can or something like that that a user can click on to delete that particular song.

* So it definitely makes sense to locate this mutation to delete a song in the same location where we're going to have that thing to render a button to delete the song.

* So we're going to paste the mutation in here at the very bottom of the file. We absolutely could create a separate file to put this mutation in Just as we did with that fecche song previously that song Querrey previously but because I don't really expect to use this quite this mutation anywhere else in my codebase I really feel pretty comfortable just place inside of this component file.

* If I had any expectation that I would call this query or this mutation from anywhere else yes then I would definitely expect to be placing it inside of a helper file

```js
const mutation = gql`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`;

```

* So now we need to take this mutation and sandwich it or put it together with a song list component.You'll notice however that we are already making use of the graphQL help her with our existing fetch songs query.So we've now got two separate pieces of graphql.

```js
export default graphql(mutation)(
  graphql(query)(SongList)
);
```
* call this graph tool helper. Two times two separate times.

* So this says make a helper using graphQL function.And this mutation and then immediately invoke it with the result of this other helper and the song list.

### Invoking Delete Mutations

* all we have to do now is make sure that we call the mutation at a certain point in time from within the song list to delete a particular song. So let's get to it.

* I think that probably a good plan is going to be to find the render songs method right here. So here's render songs for every song we render on the screen as an ally. I think a good approach would be to show a delete icon or something like that that a user can click to delete a particular song.

* And then once the user clicks on it we'll make sure that we have a callback function to invoke the mutation that we just attach to the song list component.

```js
renderSongs() {
    return this.props.data.songs.map(({ id, title }) => {
      return (
        <li key={id} className="collection-item">
          <Link to={`/songs/${id}`}>
            {title}
          </Link>
          <i
            className="material-icons"
            onClick={() => this.onSongDelete(id)}
          >
            delete
          </i>
        </li>
      );
    });
  }
```
* On click onSongDelete we can call the mutation

```js
onSongDelete(id) {
  this.props.mutate({ variables: { id } })
}
```
* Now one thing that we just ran into in our song create component when we were creating a new song we saw that there was some issue where after we ran a mutation the underlying query that is responsible for getting the list of songs did not immediately rerun and get the updated list of songs from the server.

* That is to say that component did not reach render with the correct set of songs.After running the mutation

* So I don't really have any expectation that this mutation is going to work any differently. So I kind of expect that when we run this mutation I think that it's going to delete the song from our backend but I don't really feel like it's going to automatically update the UI for us.

* That is something that for better for worse we kind of have to take care of manually saying hey make sure you refreshed this query after you run.

### Refetching a Query

* now got our song list visible on the screen and we can successfully delete records. But when we delete a song it does not actually remove it from the UI.

* We have seen previously how to refresh query inside the song create component. So inside of song create. Here's the on submit handler and we use that refence queries option over here to rerun the query to fetch our list of songs.

* This time around we don't have to use that same method. And I want to show you a slightly different way for prefetching our list of songs from the back end

* Remember that whenever we call mutation it returns a promise which means we can change on a dot then statement that will be executed after the mutation has been successfully completed.

* So the alternate method of calling or somehow getting our list of songs refreshed is by calling this

```js
onSongDelete(id) {
    this.props.mutate({ variables: { id } })
      .then(() => c);
  }
```
* So first a reminder that his.props.data is added to our component automatically by the graphQL tag

* So that is a part of our prop's object that is managed by the crowd by the re-act Apollo library for us.

* One of the available functions on there is the  refetch function the refence function will automatically re execute any queries that are associated with this songlist component.

* In this case this query or this component has exactly one query associated with with it which is the fetch song's query.

* So I want to make sure that whenever we delete the song it actually really fetches the data that is associated from that query right there.

* why we might use this approach right here. Over the one that we had previously seen using re-fetch queries over here.to the refence queries option that we had seen previously.

* It really depends on exactly how you are trying to update your query associated with which component in your hierarchy.

* So case in point the song creates component. Over here(previosly song create) we wanted to update a query that was not associated with the song create component it was associated with a totally different component in our application. So in this case I could have not called this.props.data.refetch because the query that I wanted to refresh was not associated with this component.

* if the query you want run present in this component we can use this approch ie this.props.data.refetch() if different query use the old approch.

### Showing a Particular Song

```js
import React, { Component } from 'react';

class SongDetail extends Component {
  render() {
    return (
      <div>
        <h3>Song Detail</h3>
      </div>
    );
  }
}

export default SongDetail;

```
* Now we need to associate details with router

```js
import './style/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import SongList from './components/SongList';
import SongCreate from './components/SongCreate';
import SongDetail from './components/SongDetail';

const client = new ApolloClient({});

const Root = () => {
  // here check songs/:id route..
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={SongList} />
          <Route path="songs/new" component={SongCreate} />
          <Route path="songs/:id" component={SongDetail} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
```
### Fetching Individual Records

* fetch query 

```js
query SongQuery($id : ID!) {
  song(id :$id){
    title
  }
}
```
* If we want we can go for seperate query file as

```js
import gql from 'graphql-tag';

export default gql`
  query SongQuery($id: ID!) {
    song(id: $id) {
      id
      title
      lyrics {
        id
        content
        likes
      }
    }
  }
`;
```
* Now we can use this query in songDetails screen as follows:

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import fetchSong from '../queries/fetchSong';

class SongDetail extends Component {
  render() {
    return (
      <div>
       
      </div>
    );
  }
}

/* For fetchsong query we are passing id from the params as variable */

export default graphql(fetchSong, {
  options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);

```

* however in song detail over here with a query as we've seen these queries are executed manually and there's no time inside of the component where we can intercept it and say like oh hold on. Don't make that query. Let me call it manually and pass along these query variables. So they view the order in which we call a mutation and pass along some query variables is very different than the way in which we call a query and pass along some query variables.

* So with the mutation we've got a very clear location where we pass along these Querey variables

* In Query we do not have clear location where we pass query variables So that's the big challenge here.The big challenge here is understanding how we take some query variables and stick them into this query.When it's it

* So they have provided an interface for us to take some data from our component and run it with this query.

* So after fetch song I'm going to pass in a second argument of an object.And I'm going to define an options property the options property is going to take a prop's argument.

### Watching for Data

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import fetchSong from '../queries/fetchSong';

class SongDetail extends Component {
  render() {
    const { song } = this.props.data;

    if (!song) { return <div>Loading...</div>; }

    return (
      <div>
        <Link to="/">Back</Link>
        <h3>{song.title}</h3>
      </div>
    );
  }
}

export default graphql(fetchSong, {
  options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);

```

### Navigating Between Screens

* We always need to be cognisant of making sure that our user is able to navigate around to all the different pages on our Web site.

* We need to navigate (Back button) from song details to songlist and also vice versa.

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import fetchSong from '../queries/fetchSong';

class SongDetail extends Component {
  render() {
    const { song } = this.props.data;

    if (!song) { return <div>Loading...</div>; }

    return (
      <div>
        <Link to="/">Back</Link>
        <h3>{song.title}</h3>
      </div>
    );
  }
}

export default graphql(fetchSong, {
  options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);

```

* Now we moved to song list component with the help of back button from song details component.

* Now from songlist component we need to move to details component with the song id in the URL params.

```js
<Link to={`/songs/${id}`}>
  {title}
</Link>
```
* here we pass id in URL Param to the song details component

### Lyric Creation Form

* this we already have discussed in detail.. just a form submit with mutation and variable to pass data in between

```js
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class LyricCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { content: '' };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.mutate({
      variables: {
        content: this.state.content,
        songId: this.props.songId /* we will receive songId as props */
      }
    }).then(() => this.setState({ content: '' }));
    /* And that means that after the mutation successfully completes the input will automatically clear out */
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Add a Lyric</label>
        <input
          value={this.state.content}
          onChange={event => this.setState({ content: event.target.value })}
        />
      </form>
    );
  }
}

const mutation = gql`
  mutation AddLyricToSong($content: String, $songId: ID) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      lyrics {
        content
      }
    }
  }
`;

export default graphql(mutation)(LyricCreate);
```
* self explanatory... form now we can import and use this form in our song details componenet

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import fetchSong from '../queries/fetchSong';
import LyricCreate from './LyricCreate';

class SongDetail extends Component {
  render() {
    const { song } = this.props.data;

    if (!song) { return <div>Loading...</div>; }
    /* passing this.props.params.id to LyricCreate component - I'm going to make sure that I pass in the song Id that I'm working with to create
    
    So take the ID out of the parameters or out of the URL pass it down into lyric create as the property called Song ID  */
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>{song.title}</h3>
        <LyricCreate songId={this.props.params.id} /> 
      </div>
    );
  }
}

export default graphql(fetchSong, {
  options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);

```
### Showing a List of Lyrics

* creating a new component inside of our components directory called lyric list 
```js
//component/LyricList.js
import React, { Component } from 'react';

class LyricList extends Component {
  
  render() {
    return (
      <ul className="collection">
       Lyric List
      </ul>
    );
  }
}

export default LyricList;
```
* I want to hook this thing up to the parent component of song detail so some detail is the overall container for both lyric list and lyric create.

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import fetchSong from '../queries/fetchSong';
import LyricCreate from './LyricCreate';
import LyricList from './LyricList';

class SongDetail extends Component {
  render() {
    const { song } = this.props.data;

    if (!song) { return <div>Loading...</div>; }
    /* Here we are import and use lyric list component*/
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>{song.title}</h3>
        <LyricList/>
        <LyricCreate songId={this.props.params.id} />
      </div>
    );
  }
}

export default graphql(fetchSong, {
  options: (props) => { return { variables: { id: props.params.id } } }
})(SongDetail);

```
### Enhancing Queries

* And then we've also got the lyric list as a child of the song detail. So you might be thinking well let's just pass down the ID of the given song to the lyric list and then add in a query to lyric list to go and fetch all the lyrics around that song. That would definitely be one viable option but I think what might be a little bit more useful is if we enhance our song detail equerry to also ask for a list of all the lyrics associated with it.

* Remember our song detail screen using fetch song query we need to enhance fetch song query.

```js
//fetchSongQuery
import gql from 'graphql-tag';

export default gql`
  query SongQuery($id: ID!) {
    song(id: $id) {
      id
      title
      lyrics {
        id
        content
        likes
      }
    }
  }
`;

```

* So we have now modified the fetch song query. So I expect that in my song detail a component which is making use of fecche song.

* I can now look at the song that we pull off of prop stock data and pass song Daut lyrics down into the lyric list as a prop..

```js
 <LyricList lyrics={song.lyrics} />
```

* So again the whole thought process here is that we don't need to arbitrarily just keep on adding in more and more queries to our application. We can always modify an existing query and then pass data from that query down into some child component

* So now we are all we have to do is flip back over to our lyric list.We will map over this.prop.song.lyrics and we can print out one life for each lyric.
```js
import React, { Component } from 'react';

class LyricList extends Component {

  renderLyrics() {
    return this.props.lyrics.map(({ id, content, likes }) => {
      return (
        <li key={id} className="collection-item">
          {content}
        </li>
      );
    });
  }

  render() {
    // here we called renderLyrics instead of hardcoding the content
    return (
      <ul className="collection">
        {this.renderLyrics()} 
      </ul>
    );
  }
}

export default LyricList;

```
### Identifying Records

* So I've got my list of lyrics appearing on the screen. So I think we're about ready to test out the entire flow of adding a lyric right here and then hopefully seeing it appear in a list.

* I want to ask you when we add a lyric here we add a lyric to this song presumably so it will show up on this list. Do you expect the lyric to automatically appear on this list right here.


* Let's refresh the page that will rerun this query right here and we'll just ensure that the lyric was actually added to the song. So refresh OK. So it's definitely there. So what's going wrong here and how can we fix up this behavior.

* So let's think a little bit about how to solve this issue. We're adding a new Lerat does not update the list of lyrics inside the component itself.

* We have already deal with this issue And we had said that after the mutation was successfully executed Apollo should automatically rerun this query and the query was to fetch our list of songs and then rerun render the song list component.

* Now we certainly could take this approach this time around for fixing our lyric list. I want to make that really clear right now. We absolutely could take this approach right here but we're going to do something just a little bit different because it's going to allow us to learn a lot more about how Apollo works internally.

* So we're going to look at a different approach for fetching and updating our data after we call some mutation.

* So the first thing I want to do is take a look at a diagram that can help us understand a little bit more about how Apollo stores data internally.(Refer : graphql38)

* So this is a diagram of my Appollo store or my Appollo client. Remember we set this thing up inside of our index.js file and passed it to the Apollo provider component.

* Apollo client whichever you want to call it has internal buckets of data. So it has a internal list of songs and an internal list of lyrics and knows how to go out and fetch data from our graph to server and then store all the data that comes back in the query inside of one of these buckets.

* The Appollo store knows which bucket to place this data in specifically because every response that we get back from the server adds in a little field on the response that says what type of data was just fetched.

```js
{"data":{"song":{"id":"5fc0e338c42ab9368d0dbc01","title":"Aluma doluma esaa langadi saaluma","lyrics":[{"id":"5fc11b65b005e36ffa48e252","content":"sdfaDASD adfadsfasdf","likes":0,"__typename":"LyricType"},{"id":"5fc1e9101e3d7f3644695fca","content":"sdfaDASD adfadsfasdf","likes":0,"__typename":"LyricType"}],"__typename":"SongType"}}}
```

* In this above response we could find __typename

* So Appollo clearly knows what type of data it's fetching at all times. And that's exactly how it knows where to stuff each piece of data that it fetches from the back end and grabs and puts into our application.

* Apollo just does not know what piece of data this is right here it doesn't know what is sitting inside of it. It doesn't know what attributes it has. It has no way of identifying this very particular song right here. And that's kind of the root of what's going wrong with our current setup for refreshing data in the application.

* if you check the screen and the actual data there are some data mission on the screen why ??

* So there's absolutely no reason that Apollo could not know that this song. Lets say The song has four lyrics. Here's the song and here's the lyrics. It's you kind of want to slap Appollo upside the head and say hey what are you doing. I know that you know that there's four lyrics here. Why won't you update my component for me.

* But again the issue is that Apollo has no way of recognizing that the data that we just fetched right here like this very particular song is related to the song that is on the screen because it has no way of actually identifying the records that are being retrieved by our graphQL server.

* And that's the big core issue to fix this issue.We're going to make use of a little piece of configuration in the Apollo client.

* This piece of configuration is going to take all the different records we fetch and it's going to instruct Apollo that OK. When we fetched this song give this song an Id of one. And this song and ID of two and this song an ID of three.

* And when he fetched some lyrics I want you to know that this lyric has an ID of 20 and this one has an ID of 21 by telling Apollo a little bit more about the identity of every single record We've we fetch.

* Apollo can then bond with the re-act side of our application much more easily and say oh I see that that component right there is making use of song with ID one

* if any data associated with the song of ID one gets updated. Then I'm going to inform the re-act side of our application that that piece of data was just updated and it needs to re render.So that's the crux of the whole thing here. By identifying each piece of data that gets stored in our application at the Apollo client can then inform the react side of our application when any little data is updated.

* So let's walk through this process just one time and then we'll go through the implementation.(Refer: graphql39)

*  we initially fetch a list of lyrics and then we create a new lyric when we create that new lyric that mutation that comes back really fetches the entire song and all the lyrics associated with it.

* And that's what we just saw here inside of our mutation log or a request log. We saw that the song was re fetched and all the lyrics with it are associated with it were refetched as well.

* Because Appollo sees that song with ID 5 and I'm just making up that ID.5 right now we're just going to say OK this particular song was updated Appollo says ah this song with ID 5 was updated and any reacts components out there that are making use of song with ID 5 need to re render.

* And so then Appollo can correctly tell the react side of our application that it needs to rerun some set of components.

* So that's kind of the breakdown on what's happening a little bit with the internals of the Apollo client. It's really important to make sure that all these data updates propagate around our application to make sure that we somehow identify each record that gets fetched by the Apollo clients.

### Caching with DataIdFromObject

* In the last section we had a discussion about how Apollo internally stores some of the data and how it works with informing react about changes to our data.

* Remember the big takeaway here was that when Apollo fetches data for application it really has no idea about what piece of data is what.

* And so we have to help Appollo understand which piece of data is which that allows it to more effectively tell the re-act side of our application whenever a certain piece of data updates.So obviously the big challenge here is how do we tell Appollo about what record is what.

* That is very stright forward, in index.js inside of there o find the new Appollo client declaration. We're going to add one tiny piece of configuration here and you're going to be a little bit surprised at how straightforward it

```js
import './style/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import SongList from './components/SongList';
import SongCreate from './components/SongCreate';
import SongDetail from './components/SongDetail';

//here 
const client = new ApolloClient({
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={SongList} />
          <Route path="songs/new" component={SongCreate} />
          <Route path="songs/:id" component={SongDetail} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);

```

* This piece of configuration right here takes every single piece of data that is fetched by our Apollo client from the backend. Every piece of data and runs it through this function. The result of this function or whatever is returned from this function is used to identify that piece of data inside of the Apollo store or inside of the Apollo client.

* So what we're really saying here is go and fetch every piece of data you need. Look at every single piece of data every single record and use the ID field of that record to identify that piece of data.

* It might seem like well of course use the ID to identify that record. We're just telling Appollo use the ID of record to identify this piece of data and keep track of it and tell it react whenever the song with ID of one is updated.

* The reason that we have to do this configuration step is that Apollo does not want to automatically assume that you want to use that id property of every record to identify it.

* maybe you don't serve up an ID with every piece of data or maybe your ID aren't unique. Using this ID as an identifier only works when all the IDs inside of our application are unique against each other.

* When we use the ID of every record to identify it inside of the Apollo side of our application it means that when ever we make a query we have to make sure that we return or we ask for the ID of every record and every query that we put together.

* So if we don't provide an ID inside of a query we don't ask for an ID then Apollo will not be able to identify that piece of data which is definitely not what we want to have happen.

* So to make sure that this is going to work the way we expect we're going to go back to the mutation that we're using to create a new lyric and make sure that when we get back a song and the songs lyrics we're going to ensure that we are asking for the ID with that as well. And that will allow Apollo to track and follow every single one of the records that was fetched.

* So I'm going to find the mutation that we've been working with which is inside of the lyric create component.

```js
const mutation = gql`
  mutation AddLyricToSong($content: String, $songId: ID) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      lyrics {
        content
      }
    }
  }
`;
```

* So right now we are asking for the ID of the song that comes back that is good. That means that when we get the song back from our back end we'll be able to say Oh hey Apollo that song that you already fetched the one with the ID of five we've got an update for it.Here it is. That song now has a new list of lyrics. And here they are.

* So go tell the re-act side of our application that there's a new list of lyrics and the re-act component needs to re render. Now we also have to make sure that we ask for the ID of every single lyric that comes back as well.

```js
const mutation = gql`
  mutation AddLyricToSong($content: String, $songId: ID) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      lyrics {
        id
        content
      }
    }
  }
`;
```

* because that will again allow appollo to say hey any part of the re-act application that's showing lyrics maybe the content of these lyrics just change so you might need to re render.And if they did if you're showing a lyric with ID 20 21 or 22 23 then maybe the content just changed and you might need to re render yourself.

* If you add a new lyrics its automatically appeared in the list. 

* I want to remind you that you can avoid this whole system right here by making use of that refits queries thing that we had seen inside of song create.

* Song create we have refetch approach and lyric create we have a different approach both will give us solution to this.. we can take either of the way.

* You can always just re fetch all of your data and have a good time you know take care of it that way. But I want to point out that when you use this refetch queries system right here you have to run your mutation and then make a follow up request to re-offends all of your data.

* When we use this caching system more this data ID from object system only a single request is needed to update our data.

* See how we only made the mutation and we did not make any follow up request to re-fetch the song or the list of lyrics which is a huge benefit.

* We are cutting the number of requests we make in half which is really just perfect for our application.

* Refer : https://www.apollographql.com/docs/react/caching/cache-configuration/

### Thumbs Up Icon

* So a user should have some button over here where they can click to like an individual lyric. So here is my lyric list component and we're saying that every single lyric should have a big thumbs up where the user can click.

* The path we're tackling this will be just as we've done in the past. We're talking about modifying or updating a piece of data on our backend so we immediately want to start thinking mutation we want to mutate the data on our backend.

* So my goal is to show a icon inside of the slide that is being rendered for each lyric.

```js
import React, { Component } from 'react';

class LyricList extends Component {
  onLike(id) {
    console.log(id);
  }

  renderLyrics() {
    return this.props.lyrics.map(({ id, content }) => {
      return (
        <li key={id} className="collection-item">
          {content}
          <i
            className="material-icons"
            onClick={() => this.onLike(id)}
          >
            thumb_up
          </i>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="collection">
        {this.renderLyrics()}
      </ul>
    );
  }
}

export default LyricList;
```
* So here we have thumb up icon.
