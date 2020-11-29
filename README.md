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
import { Link, hashHistory } from 'react-router';

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
import { Link, hashHistory } from 'react-router';
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