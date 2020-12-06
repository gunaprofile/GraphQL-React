# GraphQL-React

## Moving Client Side

### Client Side Setup

* We made some great progress on the server side of our application as we now have the ability to sign up a user logged them out and sign them back in. And also the ability to determine whether or not a user is currently authenticated

* we can now start thinking about the client side of our application the client side of our application is going to be a re-act application that is backed by re-act router for handling navigation to some of the different pages.

* In header we will show signup and signIn button after user authenticated we will only show signout button.

* I think we can probably go ahead and get started inside of our application on the client side by wiring up some of the Apollo boilerplate we'll open up our client directory and then find the index file.

* So this is where we're going to do a lot of the initial setup of our application 

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  dataIdFromObject: o => o.id /*Its purpose is to identify every record that comes back from the server */

  /* So rather than refetching our data for every single query that is issued Apollo will have the ability to identify the information that its already been pulled down from the server and store it inside of some local cache.*/

});

const Root = () => {
  return (
    <div>
    Auth Starter
    </div>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
```

* Now one thing I do want to point out is that the only type that were turning from our back and right now is the user type and we currently have not yet defined the ID on that type just yet we have not yet defined the ID field.

```js
const graphQL = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = graphQL;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString }
  }
});

module.exports = UserType;

``` 
* So remember that data ID from object. The assumption here is that every single record that comes back from our back end will have an id property defined on it. So that's why we just added that ID field to the user type.

* We need to make sure that whenever we ask for user from the back end we have to specify that we want the ID field as well. And that's just what allows the Apollo client to uniquely identify every record that we fetch

* So remember the Apollo client is just the piece of technology that interacts with our back end. It has no idea how to work with the re-act library. It's up to the Apollo provider to provide that glue layer the tween the Apollo client which fetches all the data and our re-act application which displays all the data.

* Rather than just showing div we will wrap apollo provicer add in the Apollo provider we'll pass it to the client that we just created 

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>  
        <div>
            Auth Starter
        </div>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
```
* I think we could probably give us a test out inside of our browser and just make sure that we still see the text Auth. starter on the screen.

### Root Routes with React Router   

* We've now got some of our boilerplate together for starting up our Appollo client which means we can start moving over to the re-act router side of our application.

* One thing I want to add into our discussion about all the different components we'll have is that just to make re-act router work nicely we will have a top level app component which will be responsible for always showing the header on the screen

* All the re-act router configuration that we're going to have will be around deciding what to show on the body of the app component.

* Everything besides the header that we're going to be swapping out with different routes.So going from the landing form to the sign up form etc.

* we'll start off first by importing the re-act router library and a couple of different properties from it.So at the top we'll grab our router object the hash history object route and index routes and all this is coming from re-act router.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/app';


const client = new ApolloClient({
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>

        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));

```
* we'll first create our router and we'll tell it that we want to use hashHistory. Again we've had a little bit of a discussion about the use of hashHistory here as opposed to browser history.

* We're using hash history as opposed to browser history just because it's a lot more flexible when you want to move the hosting environment here

* when we making use of hash history We don't really have to worry quite so much about the proper or correct set up inside of the Express side of our application 

* It's now inside of here.I want my root component which is what's always going to be displayed on the screen at all times to be something that we're going to call the app component.

* So again the app component is always going to show the header and then it will show any nested component inside of it as well.right now let's define this app component and make sure that it always shows a header component which we also need to define.

```js
import React from 'react';
import Header from './Header';

const App = (props) => {
  return (
    <div className="container">
      <Header />
      {props.children}
    </div>
  );
};

export default App;
```
* we have to define Header component also

```js
// Header.js
import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
        <div>
            Header
        </div>
    );
  }
}

export default Header
```
### Figuring Out the Current User

* Now that we've got the header on the screen we need to start thinking about what content it needs to show.

* we want to make sure that it shows the correct buttons inside the head or depending on whether or not the user is currently authenticated with our application.

* So when our Header first loads up I'm going to suggest that maybe we make a query to get our current authentication state. if the user is currently signed in we'll show a set of buttons that allow the user to log out.

* Now if the user is not currently authenticated so if they are not yet signed into our application we can show a set of login buttons 

```js
//graphical query
{
    user{
        id
        email
    }
}
```

* Now one of the last queries that we wrote was actually to test the current user query on the root the root query type.

* we get back the ID and the e-mail of that user just as we would expect.

* Lets place this query in seperate query and we can import wherever we need.

```js
// gueries/CurrentUser.js
import gql from 'graphql-tag';

export default gql`
  {
    user {
  		id
      email
    }
  }
`;
```
* Now we can use this in our header component
```js
// Header.js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import query from '../queries/CurrentUser';

class Header extends Component {
  render() {
      console(this.props.data);
    return (
        <div>
            Header
        </div>
    );
  }
}

export default graphql(query)(Header);
```
* I'm going to flip on over to my application I can refresh the page and I get my two queries console log as expected.

* Remember that the first result right here is from when before the query is actually completed.and then the component renders another time. Once the component or some new ones the query has been completed.

* So let's look at the data on these things and see what we have available.So it looks like in the case that the user or the query has not been completed loading is true and we've seen this property several times before.

* Chances are that when loading is true we have not yet fetched any details about the user whatsoever.

* In our graphical we got user information but this query after completed sends user as null value, 

* So it looks like between graphical and our application there is a little bit of a disagreement on whether or not we're currently authenticated.

* So let's take a pause from our head or in the next section and let's figure out what's going on here and let's figure out why our current user is not correctly being fetched inside of our application.

### Including Cookies with GraphQL Requests

* In the last section we added in a little query to figure out whether or not the user is currently authenticated. Now to be 100 percent clear I am currently authenticated with the back end server.So when I'm sitting in graphical and I run the query to fetch the current user I get a response back. So I'm definitely authenticated according to graphical but inside of my application when I run the same query to fetch the current user I get a response of null.

* So clearly something either in graphical or inside of my application is not functioning the way I expect because there is a big difference in the response that I get from each query (graphical and application). Even though the query is identical.

* So this is one of the biggest gotchas in the world around Appollo. One of the biggest gotchas.

* Let's take a look at a diagram that's going to help us understand exactly what's happening and what's going wrong with our application. (Refer : full6)

* remember that with this coupled approach we allow mutation to handle all of the different authentication operations that we have.

* So we rely on a mutation to figure out or to signin to log out all that kind of good stuff.

* Whenever we make requests to our back end using graphQL so whenever we execute a query whenever we execute a mutation by default graphQL does not attempt to attach any of our cookies to the request. 

* What that means is when a request goes from our browser to our back end graphQL it does not attach any of the information that identifies us to our backend server.

* So inside of graphical when we execute this query graphical by default does attach queries to the request.

* So I run this through this query right here. My query is issued to the backend server and my cookie is sent along as well. That identifies me to the back end server 

* That identifies me to the back end server the back end server looks at the cookie. It identifies me as user test@test.com It sends the response back that contains the current user

* inside of my application.However when my request is made to identify the current user by default my cookies are not included with that request.

* And so when the server looks at the request to figure out hey what am I trying to do here. Passport is not able to identify the current user. And so when we attempt to return the current user the server says well they didn't pass along any cookies. I guess it's just some anonymous person. I'm not going to make any assumptions about who they are.

* So in short by default graphQL does not send along cookies which tends to break authentication just right out of the box. If you're depending upon cookies for handling authentication.

* So what we really have to do here is do a little bit of configuration for graphQL to instructed that it needs to send along our cookies with every single request.

* And then we should be able to run the same query and get back to the current user from our backend as we would expect.

* So again it's really just going to be a tiny bit of configuration with our GraphQL client

* Remember is the Apollo client that is making actual requests to the back end server.

* We can customize the way in which these requests are being made by specifying another option inside of this options object called the network interface

* the network interface is a little piece of code inside of the Apollo client that is in charge of making actual net network requests to our back and server.

```js
import React from 'react';
import ReactDOM from 'react-dom';
//createNetworkInterface helper function
import ApolloClient, { createNetworkInterface } from 'apollo-client'; 
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/app';

const networkInterface = createNetworkInterface({
  uri: '/graphql', /*  I've said several times that the Apollo client assumes that your graphical client on the Express side is listening on the endpoint /graphql.*/

  /* Well remember we set that up as said of some of the configuration inside of our server.js file.*/

  opts: {
      // short for options property.
    credentials: 'same-origin'
    /* This is the magic line right here.The credentials are key of same origin means hey you're making requests to the same origin that the browser is currently on the long of the short of it is that this says it's safe to attempt to send along cookies with the outgoing request.*/
  }
});

const client = new ApolloClient({
  networkInterface, /* So now we're going to take this network interface and pass it along to the Apollo client. */
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>

        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));

```

* whenever you make a request to the back end. Just make sure you send along some cookies along with the request. Then we'll take that network interface and pass it along to this Appollo client.

* you might be thinking if Apollo client assumes that the server is listening on the route graphQL why are we redefining that right here.

* And the aswer is whenever you create your own network interface it no longer makes the assumption that your End Point is hosted at /graphQL.

* Well so we're just very directly saying yeah it's still the same end point. Don't worry you're still going to use the same end point as before.

* credentials: 'same-origin' - This is the magic line right here.The credentials are key of same origin means hey you're making requests to the same origin that the browser is currently on the long of the short of it is that this says it's safe to attempt to send along cookies with the outgoing request

* It should send along cookies whenever it makes a query to the backend server.

* When Apollo tends to make a request to our graphQL server it's going to include cookies with the request when the request hits our express Server Express will automatically populate the request.user field.And so our graphQL server will understand who the current user of our application is.

* If you refresh the application, we will get the console data as we expected

### Authentication State

```js
// Header.js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import query from '../queries/CurrentUser';
import { Link } from 'react-router';

class Header extends Component {

  renderButtons() {
    const { loading, user } = this.props.data;

    if (loading) { return <div />; }

    if (user) {
      return (
        <li>Logout</li>
      );
    } else {
      return (
        <div>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </div>
      );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo left">
            Home
          </Link>
          <ul className="right">
            {this.renderButtons()}
          </ul>
        </div>
      </nav>
    );
  }
}

export default graphql(query)(Header);
```

* Lets add logout as link 

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import query from '../queries/CurrentUser';
import mutation from '../mutations/Logout';

class Header extends Component {
  onLogoutClick() {
    this.props.mutate({
    // refetchQueries: [{ query : query}] 
      refetchQueries: [{ query }] // refetch after logout to update query
    });
  }

  renderButtons() {
    const { loading, user } = this.props.data;

    if (loading) { return <div />; }

    if (user) {
      return (
        <li><a onClick={this.onLogoutClick.bind(this)}>Logout</a></li>
      );
    } else {
      return (
        <div>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </div>
      );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo left">
            Home
          </Link>
          <ul className="right">
            {this.renderButtons()}
          </ul>
        </div>
      </nav>
    );
  }
}

export default graphql(mutation)(
  graphql(query)(Header)
);
```

* Make sure we added logout mutation logic 

```js
import gql from 'graphql-tag';

export default gql`
  mutation {
    logout {
      id
      email
    }
  }
`;

```

* OK so it's looking pretty good after mutation runs rerun this queery render any component that is associated with that query. And I will expect to see the header automatically update on the screen.

* Lets login with graphical login and then check application it should show logout button

```
mutation { 
    login(email : "test@test.com", password :"password") {
        id
    }
}
```

* So I should now have a running session with the server which means I should be able to flip back over to my application refresh the page I see log out appear on the screen

* of course we're running this application locally but we want to remind you that our MongoDB database is hosted remotely. So even though our application itself is hosted locally the data that we're fetching is from some remote server. So the speed with which this button up on the top right hand side renders is pretty darn representative of how I would expect this to render inside of a production environment.

###  Login Form Design

* I'm thinking that we'll make a log in form component and a sign up form component but they will both make use of a common component called the auth form 

* the auth form right here. Will it contain the actual form element with the labels the inputs and the buttons that we want to show on the form itself.

* But as soon as the user clicks submit to submit the form will pass us and we will call a callback that is passed from the parent down into the auth form.

* By doing that we can have all the common logic around rendering the form itself inside of the auth form but for handling the very customized logic around which mutation we call to actually log in or sign up the user we can to find that mutation inside of the parent component.

* Inside of my components directory I'm going to make a new file called loggin form.

```js
import React, { Component } from 'react';

class LoginForm extends Component {

  render() {
    return (
      <div>
        <h3>Login</h3>
      </div>
    );
  }
}

export default LoginForm;
```
* Now we can import and use this in our app component

```js
<ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <Route path="login" component={LoginForm} />
          
        </Route>
      </Router>
    </ApolloProvider>
```
### The Auth Form

* We've got our log in form on the screen right now. I want to make sure that we have a separate component called auth form that is going to render the actual form that the user is going to type their input into.

* this would be a pretty straightforward component. It's going to house a simple form that's going to show some details or associated inputs to the user.

```js
import React, { Component } from 'react';

class AuthForm extends Component {

/* So let's for first define our component level state and then we'll put together the actual form. So in the constructor we will receive our prop's object and we'll initialize our state first by pulling super with props.*/

  constructor(props) {
    super(props);

    this.state = { email: '', password: '' };
  }

  render() {
    return (
      <div className="row">
        <form className="col s6">
          <div className="input-field">
            <input
              placeholder="Email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              placeholder="Password"
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value})}
            />
          </div>
          <button className="btn">Submit</button>
        </form>
      </div>
    );
  }
}

export default AuthForm;
```

* The last thing you have to do is think about how we're going to intercept the form being submitted. Let's first place this on the form inside of the log and form and then we can think about adding in a callback handler for the actual submit event.

* So I'm going to flip on over to the login form I want to import the form that we just created and show it inside of the log in form and then we'll pass a couple of props down into it to customize what auth form does whenever it is submitted.

```js
import React, { Component } from 'react';
import AuthForm from './AuthForm';

class LoginForm extends Component {

  render() {
    return (
      <div>
        <h3>Login</h3>
         <AuthForm />
      </div>
    );
  }
}

export default LoginForm;
```
* Now auth form visible inside of login form

### Importing the Login Mutation

* In the last section and we put together our art form in its entirety we now need to make sure that whenever the user submits this form right here we call mutation to log the user in.

* So as a reminder this is logging the user and we're not attempting to sign up the user just yet.

* First off we need to be aware that whenever we submit our mutation there might be some errors that get returned to us.

* So maybe user enters in the incorrect password maybe they enter in an email that doesn't exist.We have to figure out some way to communicate those errors back down into the form to get them to show up on the screen so that the user knows that they need to make a little change to their log in information.

* But first let's worry about just putting the mutation together and then we'll come back wired up to the component itself and then worry about dealing with the error handling.

```js
//mutation/Login.js
import gql from 'graphql-tag';

export default gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;
```
* So the last thing we have to do is wired up to our log in form and then we can worry about passing it down as some type of callback or something like that to the actual Auth form.

* Ok so now our last step is going to be to take the graph view all helper take the mutation and push it up together with the log in form.

```js
import React, { Component } from 'react';
import AuthForm from './AuthForm';
import mutation from '../mutations/Login';

class LoginForm extends Component {

  render() {
    return (
      <div>
        <h3>Login</h3>
         <AuthForm />
      </div>
    );
  }
}

export default graphql(mutation)(LoginForm);
```
### Submitting the Auth Form

* Login form now has access to the log in mutation, emember that whenever we call the log and mutation from within the component we call it this.props.mutate this mutation in particular expects both an email and a password as query variables to be provided.

* So we have to somehow get our component level state from the Auth form and move it on up into the login form.In practice this is going to end up as being a simple callback.

* So I'm going to define a callback inside of the log in form and then I'll pass that down to the auth form and it should be called whenever the form inside out then gets submitted.

```js
import React, { Component } from 'react';
import AuthForm from './AuthForm';
import mutation from '../mutations/Login';
import { graphql } from 'react-apollo';
import query from '../queries/CurrentUser';

class LoginForm extends Component {

  onLoginFormSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password }
    });
  }

  render() {
    return (
      <div>
        <h3>Login</h3>
        <AuthForm
          onLoginSubmit={this.onLoginFormSubmit.bind(this)}
        />
      </div>
    );
  }
}

export default graphql(query)(
  graphql(mutation)(LoginForm)
);

```
* So now inside auth form whenever the forms get submitted. Make sure that we call on submit and pass in both the email and password that the user is trying to authenticate with.

```js
import React, { Component } from 'react';

class AuthForm extends Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '' };
  }

  onAuthSubmit(event) {
      //here
    event.preventDefault();

    this.props.onLoginSubmit(this.state); // here we sent state with email and password
    //this.props.onLoginSubmit -> from login auth component props 
  }

  render() {
      // form onSubmit bind with onSubmit function
    return (
      <div className="row">
        <form onSubmit={this.onAuthSubmit.bind(this)} className="col s6">
          <div className="input-field">
            <input
              placeholder="Email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              placeholder="Password"
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value})}
            />
          </div>
          <button className="btn">Submit</button>
        </form>
      </div>
    );
  }
}

export default AuthForm;
```

* With this change we successfully logged in 

* So that's a little bit more the way I expect so I am successfully signing in here. But again you'll notice I am not successfully updating the header in this case so my application state is not quite reflecting the fact that my user is now signed into the application.

###  Refreshing the Current User and Error Handling with GraphQL

* In the last section we finished up our log in form and we were able to see the mutation successfully the issued to our back end.

* after mutation we didn't see the header update and we didn't get automatically navigated anywhere.

* We need to update header and also we need to handle error. The first thing I'd like to take care of is make sure that we're maintaining the header in the correct fashion.

* In login form

```js
onSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query }]
    }).catch(res => {
        // collect all the errors and put this into a single array
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors });
    });
  }
```
* Now we need to pass this error to the auth component and show there 

```js
// Login form
render() {
    return (
      <div>
        <h3>Login</h3>
        <AuthForm
          errors={this.state.errors}
          onSubmit={this.onSubmit.bind(this)}
        />
      </div>
    );
  }
```
* Now we can populate this erroe in our Auth template as follows

```js
render() {
    return (
      <div className="row">
        <form onSubmit={this.onSubmit.bind(this)} className="col s6">
          <div className="input-field">
            <input
              placeholder="Email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              placeholder="Password"
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value})}
            />
          </div>
          <div className="errors">
            {this.props.errors.map(error => <div key={error}>{error}</div>)}
          </div>
          <button className="btn">Submit</button>
        </form>
      </div>
    );
  }
```
### The Signup Mutation
```js
import React, { Component } from 'react';
import AuthForm from './AuthForm';
import { graphql } from 'react-apollo';
import mutation from '../mutations/Signup';
import query from '../queries/CurrentUser';
import { hashHistory } from 'react-router';

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  onSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors });
    });
  }

  render() {
    return (
      <div>
        <h3>Sign Up</h3>
        <AuthForm
          errors={this.state.errors}
          onSubmit={this.onSubmit.bind(this)}
        />
      </div>
    );
  }
}

export default graphql(query)(
  graphql(mutation)(SignupForm)
);

```
* Let us use this router in our index.js
```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/app';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin'
  }
});

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <Route path="login" component={LoginForm} />
          <Route path="signup" component={SignupForm} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));

```

