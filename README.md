# GraphQL-React

## Handling Errors Gracefully

### Race Conditions - A Big Gotcha

* Both are log in form and or sign up form are in a really good spot.n both forms users can enter some details click the button and then are back in server then considers the user to be authenticated.

* So our application isn't a pretty good spot right now and it's time for us to move onto the home stretch which is going to be it to create a dashboard component which should only be visible to users if they are authenticated.

* And so that last part is really key.We want to make sure that if a user tries to visit the dashboard component when they have not signed in ahead of time we should redirect them back to the log in form.

* So really we just want her application to behave like a normal web app if you're not signed in. You can't access the internals of the web application.

* After mutation and query we need to redirect to dashboard,

* OK so let's look at the diagram really quick.So this is going to call our Auth flow. In a perfect world this is what we would really like to have happen. (Refer full7)

* So the thought process here is that we will run our loggin mutation that would reach out to our backend server.It would log the user and the users cookie would be set.

* Then after the mutation successfully runs we add it in that refetch queries statement.

* So here's re-fetch queries right here where we re-fetch the current user so we re-fetch the current user and that establishes our current authentication state as far as our front end is concerned.

* Then we are thining okay after refetch done then we could redirect to dashboard component. And then finally the dashboard would ensure that the user is authenticated Once the user comes to it.

* The thought process there is that a user might come to the dashboard either through the log in form or by attempting to navigate directly to the dashboard.

* And if the user navigates directly into the dashboard we would want to make sure that the user is authenticated before they get there. so dashboard is in charge of ensuring that the user is authenticated.

* So at the end of the day if the user was authenticated when they arrived on the dashboard great. They can stay there. However if the dashboard determines that the user is not authenticated look at it we're going to take them back out to the log in and they have to make sure they log in ahead of time.

* And so this is not exactly how authentication is going to come together inside of our application. So this is a little bit of a awkward spot in the world of Apollo. So we're going to you know work through this thing and figure out what the challenges are.

* But the good news is that even though there are a couple of challenges it's going to allow us to really figure out a lot more about how Apollo internally works.And we're also going to learn a little bit more about re-act along the way as well 

* So let's look at what the offload is in reality.(Refer full8) So this is how the authentication would flow if we wired up the flow as we just were looking at in the last diagram (Refer full7) this is what would really happen.

* So after the mutation runs we had been saying that we would chain on a dot then statement to the promise that has returned from this.props.mutate

* and the assumption there was that that promise would be only resolved after the current user was refetched.And unfortunately that's not quite the case!!!!

* So here's what really happens after the loggin nutation runs. Any dot then statement that is chained onto that promise is immediately executed And simultaneously we refetched the current user Query.

* So in other words the big catch here the big hang up is that the dashboard redirect promise does not quite work in the way that you would expect.

* Personally the way that I would really want mutate to work great here I would want the promise that is returned to only resolve after all after both the mutation and these queries that are associated on refetch queries right here have been resolved.

* But again that is not how the thing actually works.

* So after the mutation runs if we change on a and then the user would instantly be redirected over to the dashboard and we would also start the request to fetch our current user. Now let's talk about exactly why that's a bad thing.

* Redirecting our user over to the dashboard is a near instantaneous operation.We're talking about micro-seconds milliseconds or micro-seconds a very fast transition speed.

* However prefetching the current user that is a forced network request we are always going to reach out from our re-act application to our back end server and try to figure out whether or not the user is currently authenticated.

* This process over here this is something that can take anywhere from I don't know five milliseconds to five seconds. It can be wildly variable and speed.And so what we're really dealing with right now is an order of operations here or a race condition.

* So because we are redirecting the user to the dashboard at the same instant that we are attempting to re-offense the current user or the redirect is always going to kick in first. So we are instantly going to go over to the dashboard.

* But as far as our application is concerned we don't know if the user is currently logged in and we don't really have any super reasonable way of delaying the dashboard to decide to redirect the user until the refetch query is complete. We don't really have the ability to do that.

* So if we coded up this application according to this flow right here we would always get the same exact result which would be logged user logs and successfully we redirect the user over to the dashboard.The dashboard says hey you're not logged in get out here. It takes us back to the log in form and then milliseconds later the current user gets refreshed refreshed and that updates our application. And at that point time we're kind of left holding the bag sitting there like well we're looking at the logging. But I'm logged in what what went wrong here.And so that's what a big issue with the auth flow in reality is inside of our application.

* It all revolves around the fact that we don't have a super good way to figure out exactly when the whole mutation and refetch of the current user query is all complete.

* Again this is in my opinion a little bit of a rough edge around the Apollo in all of the research I've done. I really found that it really appears the Apollo team is not quite happy with the refashioning mechanics right now.

* And so I I kind of would expect to see this behavior maybe change at some point in the future. I don't know when that might be. And I really don't know if it would happen.

* And so the best workaround for this is to just understand how the mutation works how the research works and to write up some code that's going to work around it reliably 100 percent of the time.

* we're going to take we're going to figure out some work around here to successfully deal with the fact that while we're looking at this form we can't really hand or we can't really rely upon this request right here to change our authentication state.

### Finalized Auth Flow

* And I'm going to show you my suggestion of how we're going to deal with this case. The first thing I want to do is remind you or at least make something very crystal clear about how our components in our queries interact with each other 

* whenever we rerun a query. All of the components that are associated with that query inside of our application are automatically going to update with the results from the query.

* So if we consider the one query that we have right now the current user query we can associate this with 100 different components inside of our application. And if any one of those components decides to rerun this query right here all 100 components will Re-Read or with the updated data.

* And so that's something that's very important to keep in mind when we're thinking about rerunning queries inside of our application. the instant we fetch it boom and type re-act application or at least whichever components make use of the query is going to re render.

* So with that in mind we can probably figure out a way to trick our log in form and sign up form into being a little bit more aware of the user's authentication state.

* So this is why I refer to as the finalized authflow this is what we're going to do in practice to make our project actually work.

* The first thing we're going to do is associate our form with the current user Query and I say form I'm talking about the login form and the Sign-Up forms.

* So the idea here is that after we associate the form with the current user query we will allow the user to enter in some sign of information. So they're going to enter in their e-mail and password that's going to run the mutation and then refetch the current user.

* as we just discussed whenever we rerun the query after the query resolves it will force every component that uses that query to automatically re render. And so if we associate this current user query with the logon form.
Then after we refreshed this query the log in form will automatically render as well.

* So the login form will render with the knowledge that there is now a current user.

* So we can exploit that fact right there to get a little bit of a hook of at least some understanding of hey my company is about to update. There was not a current user before but it appears that there now is and we'll take that little change in the state of that current user Querrey we'll take the fact that there was not a current user but that now is as a sign that the user must have just successfully logged in.

* And so the instant the log in form he renders and we detect that there was no current user. But now there is we will take that as the sign that we need to redirect the user over to the dashboard than the dashboard can look at the current user property the current user has already been fetched.

* We let the thing finish and we let it finish all the way to the point of allowing it to rerun the log in form.

* So of course from the dashboard it actually looks at the user's authentication state. It's going to say oh yeah looks like they're authenticated. They can continue looking at the dashboard.

* The entire process right here is our ability to watch the components update process and watch the piece of user or current user state that has returned from the query

* and instantly we see that little piece of data change from not authenticated to authenticated we're going to take that as a sign that we need to take the user over to our dashboard component.

* The downside to this approach is solely the fact the fact that it's not super clear what's going on with this thing. It's just not it just feels kind of nasty where it really feels like there should be a better way to do it 

### Fixing the Login Process

* At the end of the day we had said that we would associate the form with our current user query. And then as soon as that query gets updated by our refetching of the query we would figure out some way to detect the fact that the component now has the access to a current user or that the user is now authenticated and we would make use of that to somehow kick the user over to our dashboard.

* Some practice a little bit more strict for than you might think. So here's how it's going to work.(Refer full10)

* When our query reruns and we get a response back from the server. The query will be updated. That's going to cause our login form component to be re rendered.(Refer full10)

* And at that point in time life cycle methods all the way. So component will update which is one of our lifecycle methods for re-act component will be automatically called with our new and old props.(Refer full10)

* okay if the user was not authenticated. But now they are then they must have just successfully logged in. They probably shouldn't be looking at the log in form anymore. Let's forcibly push them over to the dashboard.

* So that's got to be our plan. Again in practice ends up being very little code but understanding why we are doing it is kind of a big leap of faith there.

* In login component Remember we had imported the query to wired up to the refits query statement in the first place.

* So we need to first associate the query with the component itself through the use of the graphQL helper. after we do that. We can then add on that component will update lifecycle method.

* So let's first associate the query with the component with the graphic helper at the bottom of the file.

```js
export default graphql(query)(
  graphql(mutation)(LoginForm)
);
```
* OK so the query is now associated with the component.

* As soon as the query gets updated in any way shape or form that component will be updated it will be rendered with a set of props on this.props.data

* I'm going to define our lifecycle method componentWillUpdate

* whenever a component is about to be pre-rendered due to any reason whatsoever. This function right here will be automatically called.

```js
import React, { Component } from 'react';
import AuthForm from './AuthForm';
import mutation from '../mutations/Login';
import { graphql } from 'react-apollo';
import query from '../queries/CurrentUser';
import { hashHistory } from 'react-router';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  // here...
  componentWillUpdate(nextProps) {
    // this.props // the old, current set of props
    // nextProps // the next set of props that will be in place
    // when the component rerenders
    if (!this.props.data.user && nextProps.data.user) {
      // redirect to dashboard!!!!
      hashHistory.push('/dashboard');
    }
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
        <h3>Login</h3>
        <AuthForm
          errors={this.state.errors}
          onSubmit={this.onSubmit.bind(this)}
        />
      </div>
    );
  }
}

export default graphql(query)(
  graphql(mutation)(LoginForm)
);

```

* I do want to mention that we're going to repeat this exact same process over on the sign up form as well because I really do expect to have the same experience with both the sign up form and the log in form

* After did the same in sign up form also make sure we gave dashboard details also.

* So let's make a new dashboard component and then hook it up inside of our router 

```js
// Dashboard.js
import React from 'react';

export default () => {
  return <div>You are logged in.</div>
};

```

* Now we can import this and use inside our component(index.js)

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/app';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

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
          <Route path="dashboard" component={Dashboard} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
```

* There is a issue here ie even after log out we are able to access dashboard..why ?? But clearly the header is reflecting.No that's not the case I'm not actually logged in at this point in time.

* hey if the user is trying to get to the dashboard page let's make sure that they actually are logged in and then we also need to make sure that after the user signs out like when they click log out on the header. If they're currently on the dashboard route we need to make sure that we dump them back to the log in page

### The Need for a HOC

* In the last section we recognize that the dashboard component that we just created is not really properly tracking whether or not we are currently signed into the application.

* So I want to have some reusable amount of code that determines what to do based on the user's authentication status 

* to handle reusable code like this inside of re-act the classic go to solution is a higher order component

* to handle authentication between different components inside of our application that all need to make sure that the user is authenticated before they can visit that particular component.

* So we're going to create something called the requireAuth higher order component.(HOC)

### Getting Started with RequireAuth

* higher order component is how we get some amount of code reusability in the reactJS world.

* We take a standard component like that type of component we've been creating all throughout this course. It can be a class based component or a functional one.

* We take that component we compose it together with a higher order component and that adds some amount of functionality to our original component.We usually refer to these as enhanced or composed components 

* Now you will notice I used a lower case are here(file name - requireAuth) traditionally with higher order components.We use a lower case character for the first letter inside the name. That is because a higher order component actually is a function and traditionally functions are not capitalized.

* whenever that component has been rendered to the screen I want to check to see whether or not the user is currently signed in.

* So how do we check to see whether or not the users currently signed in we've done this several times before inside of our application. We've made use of that current user query. We said run this query right here. If a user is returned then they must be signed in.

* But if a user is not returned then they are not authenticated and we need to kick them out to somewhere else in our application.

* We're going to turn our component into a function that takes a wrapped component

* so we're then going to wrap the component we just created with the function that we just defined

* So the dashboard is coming in as the wrapped component. We create our new required off components. It's going to do some fancy logic to figure out whether or not the user is currently authenticated. And then it will end up showing the dashboard so wrapped computing right here ends up being the dashboard. And again this comes down to a little bit around how higher order components work.


```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import currentUserQuery from '../queries/CurrentUser';
import { hashHistory } from 'react-router';

export default (WrappedComponent) => {
  class RequireAuth extends Component {
    componentWillUpdate(nextProps) {
      if (!nextProps.data.loading && !nextProps.data.user) {
        hashHistory.push('/login');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  // at the bottom. We're going to return the graph qualified version of the required off component.
  return graphql(currentUserQuery)(RequireAuth);
};
```

* Now we have a HOC that will redirect to login if not authenticated

* Now we can use this HOC in our router ti wrap dashboard component. And I'm going to apply the higher order component to the dashboard.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/app';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import requireAuth from './components/requireAuth';

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
          <Route path="dashboard" component={requireAuth(Dashboard)} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
```

* Remember component did mount is only called when it component is first rendered to the screen.

* When I clicked on the button to sign out up here it did not cause the dashboard component to be rendered in any way shape or form.

* I shouldn't say that it did not cause the dashboard component to have the component did mount life cycle method calls again. Because the dashboard was not unmounted and remounted it was just updated.

* So right now placing all this authentication logic inside of only component did mount is not a good location for handling the updates to my current state

* to correctly handle that will instead use a different lifecycle method. componentWillUpdate

* We're going to get this thing called every single time that the query updates and state in any fashion. So maybe the query goes from not loading to loading or loading to not loading or we now have a current user assigned or the current user doesn't exist anymore. Every single time that our query updates in any way shape or form the component will update will be called again 