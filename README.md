# GraphQL-React

## Gotchas with Queries in React

### Handling Pending Queries

* the actual data that we're after is located on the "this.props.data.songs" That's where our list of songs is just to be really clear. I want to talk a little bit more about why our data is available on the songs property inside of the data object.

* the data object itself is provided by the graphical library.

* So down at the bottom here we used the graphic helper the graph tool a helper right  here

```
export default graphql(mutation)(
  graphql(query)(SongList)
);
```

* is what creates that dot data property on our prop's object

* as far as the actual dot songs property on there. You'll recall that the Querey that we wrote said find me a list of songs specifically.

```js
const query = gqltag`
{
    songs {
        title
    }
}
`;
```

* From the above code we used dot songs to fetch data.So because we said songs right here the data that was fetched was available on the dot songs property.

* Now that we've got access to our data inside of our component our next step is going to be to render a list of all the different songs inside of our component


```js
import React, { Component } from 'react';
import gqltag from 'graphql-tag';
import { graphql } from 'react-apollo';

class SongList extends Component {
    renderSongs() {
      return this.props.data.songs.map(({ id, title }) => {
        return (
          <li key={id} className="collection-item">
            {title}
          </li>
        );
      });
    }
    render() {
        return (
            <div>
                <ul className="collection">
                  {this.renderSongs()}
                </ul>
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

* If we reload we will get error as cannot read map property on undefined property. ie "this.props.data.songs" is undefined.In other words this Propst our data that songs returned undefined. So here's what's happening.

* So when our component first appears on the screen the query gets issued. So our component renders one time without any data having come back from the back end server. Nothing has come back and the graphQL server yet this.props.data.songs is undefined at that point in time 

* only when the query has actually been completed is or is the songs list of songs going to be available on the data property.

* And that's when we can actually show some data on the screen. So there's going to be a huge chunk of time in here when we have no list of songs and if we try to access it it's going to be undefined and we're going to get a big error message appear on the screen.

* You need to make sure that you handle the case in which your data has not yet been fetched by graphQL

* As we already discuss while data loading if we try to access we will get an error to avoid that inside render return loading if status is loading 



```js
import React, { Component } from 'react';
import gqltag from 'graphql-tag';
import { graphql } from 'react-apollo';

class SongList extends Component {
    renderSongs() {
      return this.props.data.songs.map(({ id, title }) => {
        return (
          <li key={id} className="collection-item">
            {title}
          </li>
        );
      });
    }
    render() {
      if (this.props.data.loading) { return <div>Loading...</div>; }
        return (
            <div>
                <ul className="collection">
                  {this.renderSongs()}
                </ul>
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

* So the thought process here is if we're loading if we're still fetching this query. This query is still pending on the network. You know we're still waiting for this thing. Then don't try to render everything inside the component. Don't try to access the list of songs that don't yet exist. Just show something that says loading instead.

### Architecture Review

* So here's our overall application as it stands right now (Refer : graphql33)

* at the very top. We've got our graphql server which is hosting all the data

* the Apollo store which we set up inside of our index js file is the point of contact with the graphql server.It's what's making sure that the data that we are fetching is coming back and being distributed throughout the application.

* Then on the react side of things which is more or less everything inside this box right here we've got the Apollo provider.

* Remember that this provider is the integration point between the react side of things and the actual Appollo store where the data sits.

* We then have our root component which is displaying a song list with an attached query right now.

* The point that I really want to convey here with this last little step is that in a Appollo application like this or a graph tool application like this we tend to pick centralized components like the song list as receiving these queries or receiving some amount of data from the graph server. We can then allow data to trickle from that component down into its components as props.

### Adding React Router

* we need to have re-act router inside of our application to navigate between these different pages that we're using. So let's continue now by setting up re-act router inside of our application.

* We already installed package for react-router

```js
npm install react-router
```
* So we just have to start importing objects from it and we can do all the routes set up directly inside of this top level index.js file. we're also going to use a very stable version of re-act router. So we're not going to use the much newer experimental version 4. We're going to use the battle tested version 3 which has a really straightforward API to work with.

* So let's start off by importing a couple helpers from the re-act router library at the top of this file from re-act router.

```js
import './style/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import SongList from './components/SongList';

const client = new ApolloClient({});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}> 
        <Route path="/" component={App}>
          <IndexRoute component={SongList} />
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

* Rather then directly render component let us pack our component inside our router component.

* So we'll define an instance of the router and we'll pass it the history object 

* I've said that the Apollo provider is wrapping the entire re-act router 

* So in practice by convention we usually put Appollo provider on the outside and then define all the different routes associated with our application inside the provider.

* for "/" we not yet created component let us assume a new component "App" component. we will create app componenet in sometime now

* So we again we do not yet have the app component the app component is intended to solely be presentational in nature. So it's just going to be something that's going to receive a component as a child and then show it on the screen.

* All we really need to understand is that the app component is going to just show another component on the screen.

* We can then define our song list component.I want to show the song list whenever a user hits the route of our application. 

* So just '/' by itself to accomplish that effect.We can use the index route like so and we'll say whenever someone goes to that index route we should show the song list like so.

* Let's import the app component. Again we haven't created it yet but we'll assume that we'll make it just right now.

```js
//app.js
import React from 'react';

export default ({ children }) => {
  return <div className="container">{children}</div>;
};

```
* make sure that we show any children component that are passed into this thing as props.

* This app component right here is saying if re-act router decides to show the index route right here of song list song list will be passed to the app component as children and we'll show that component as a child like so using children.

* Going to go over to the browser will refresh the page and you'll notice that I get a hash in the URL which is very good it means that re-act routers working as we expect and I still see the component on the screen.

### Creating a Song

* In the last section we finish wiring up re-act router inside of our application.

* So this component they we're about to make is going to show the form for creating and submitting a new song.

* We haven't spoken too much about the use of state with graphQL and I'm sure one of the burning questions you have in your head is how do I use redux with graphQL. Well that's all stuff that will certainly get around to in time.

```js
// SongCreate.js
import React, { Component } from 'react';

class SongCreate extends Component {
  render() {
    return(
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
        </form>
      </div>
    )
  }
}

export default SongCreate;
```

* Now we can import and use this component in index.js

```js
import SongCreate from './components/SongCreate';

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={SongList} />
          <Route path="songs/new" component={SongCreate} />
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

* So now that we've got this component showing up on the screen we can start worrying a little bit about the details of the form inside of here.

* We're going to make this input right here a controlled input or a controlled form component which means we're going to watch for a change event on the input whenever a user typed something in there. We will update our component level state and then push the new updated value back into the input itself.

* So whenever we're making use of component level state we do have to initialize it inside of our constructor function 

```js
// SongCreate.js
import React, { Component } from 'react';

class SongCreate extends Component {

  constructor(props) {
    super(props);
    this.state = { title: '' };
  }
  
  render() {
    return(
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
    )
  }

}

export default SongCreate;
```

* So then the last step in here is to make sure that whenever a user types inside this thing. So on change we're going to pass a callback function where we take the event that was issued by the change event and we'll update our state.
