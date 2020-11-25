const express = require('express');
const { graphqlHTTP } = require('express-graphql'); /* Remember this library here is a sort of glue layer or compatibility layer between graphQL and express. */
const schema = require('./schema/schema'); // require schema

const app = express();

/* Now that we've imported this compatibility layer right here we're now going to tell the Express application
that we created that if any request comes into our app looking for the route/graphQL we want the graphics library to handle it. */

/*This is done by placing a call to app.use */

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}));
/* graphiql as a development tool that allows us to make queries against our development server so only intended to use in a development environment right here. */

app.listen(4000, ()=> {
    console.log("Listening");
})