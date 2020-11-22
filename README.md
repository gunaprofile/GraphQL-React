# GraphQL-React

## Intro

* Refer : https://github.com/StephenGrider/GraphQLCasts

## Review of REST-ful Routing

* Before we get started on anything related to graphql and relay

* We need to first make sure that we have a super solid foundation on the basics of restful routing.

* GraphQL and relay was built to solve a very specific set of problems. And unless you understand what those problems are.

* So when I say restful routing I'm referring to some set of conventions used in web development for manipulating a collection of data hosted on a server. (Refer : basic1)

* This common rule of HTTP request used for CRUD operation.

* So let's look at a practical example let's look at a very practical example of this. I want you to imagine that you're building a user interface that allows a user to create blog posts and then after post has been created they have the ability to read the blog post edit it or delete it.

* So when we talk about rest for routing as applied to a application like this we're talking about what type of  HTTP request we use.(Refer : basic2)

* And in addition not only what type of request but also what URL We send that request to. So we imagine that we're working with a collection of posts here like we are reading posts or creating updating posts we would end up with a set of URL and HTTP request types or methods as listed on here.(Refer : basic3)

* So the general rule of thumb or the convention for restful routing are these five separate actions right here.(Refer : basic3) These are the frequently used operation.

*  So again these are conventions that we use when we are deciding what method of age HTTP request and what URL to point it to.

* Overall we can kind of generalize these rules as being slash the name of the resource that we're messing with or in the more particular cases slash the name of the resource we're messing around with Slash and then the idea of the record that we're trying to manipulate in some fashion. (Refer : basic4) So again these are the basics of restful routing.

* This is we're so far we're looking at how we manipulate singular records like just all the posts or all the whatever it might be that are hosted on our server.

* I want to change up this example little bit and I want to think about what these URL might look like if I wanted to say get a list of all the posts that are associated with a very particular user.

* maybe we've got a list of users and every user can have some number of blog posts. I would update my restful conventions to look like what I have down here.(Refer : basic5)

* So I would start to nest you or else a little bit if I made a get request to users/23/posts I would expect to get a list of all the posts that are created by user/23

* and then similar operations for fetching in particular posts for updating posts and deleting posts they would all have to do with a very particular user.

* So this is how it starts a style or else when we're doing restful conventions along with associated records or nested records.

* So everything we've looked at so far with kind of manipulating singular records or even nested records. Hopefully this doesn't look too weird right here.

* but once we start to nest data even further things start to get really really weird.

* So let's take a quick break and we're going to come back and look at a slightly different example. And we're going to see how these restful conventions start to break down.

### Shortcomings of RESTful Routing

* So remember restful conventions is talking about very common you URLs and HTTP method types that we use for these very common operations of manipulating data.

* So they are not a hard coded set of rules. It is just a set of conventions that you tend to see over different web frameworks of different languages.

* As I said these relations start to break down a little bit. Once you start to get to a very heavily nested or heavily related data

* in the case of having like a list of users with all the given post they've created. Well you know you start to get some very reasonable looking URLs

* you know we can really read this like give me all the users find me user 23 and then find all the posts they've made.

* But these rules start to break down. Once our data starts to get really nested. So let's start looking at a little bit more complex example. (Refer: basic6)

* (Refer: basic6) This one to look really simple and straightforward but trust me there are some hidden complexity here.

* So let's walk through this example and talk about what is so weird about it and how it starts to get a little bit challenging with restful routing.

* So in this diagram I have a list of users or a list of like maybe friends that I have on Facebook. So on every single one of these boxes I have a very particular friend like a very particular user then I have the company they work at and the position that they work or the title of their position.

* (Refer: basic7) Now let's imagine where each of these pieces of data come from. Well a user's image. OK. You know that's a user's image. We've got the user's name.We've got the company name and the position name or the position title.

* Now I want to ask you if we were using a relational database or maybe even a no sequel database like MongoDB How might we store this data in our database. How about we actually store this data.

* Well you might be thinking hey let's just make a user model and we can say every user has a name an image in a company name and a position name. (Refer : basic8)

* And I would say you know maybe that's not the ideal way to do it. Maybe we would not want to take that approach.

* And the reason for which is that it would be really hard to get a list of all the different company names that we have and trying to find all the users who work at a particular company or say even provide more details about that company.

* Search get a little bit more challenging.

* So as an alternative schema maybe we would end up with some type of scheme that looks like this right (Refer : basic9)

* here where we've got a collection of users a collection of companies and the collection of positions. That way every single position and every single company can have their own very particular details and a user can have a pointer or a foreign key that looks at a very particular company and a very particular position ID.

* So I want you to imagine what this might look like in diagram form.(Refer : basic10)

* You know we've got the current user. We've got all of their friends. And then we've got all the companies and positions related to them. Now I'm going to ask you a question I want you to produce some type of restful routing URL and each HTTP methodology for getting access to each of these records because like the current user the current user's friends and then the companies in positions that those friends work at what restful conventions might we use here.(Refer : basic10)

* (Refer : basic11) Well for the first two columns life is not that bad. Like we kind of we could kind of imagine how it might work we might have slashed users 23 to get access to the current user to find that current users friends we might go to users 23 slash friends or maybe even technically users 23 slash users. You know maybe that would work as well but then what you are l might we put in here to represent the companies or the positions for all of those friends.

* So that's where life starts to get really really challenging. I'm going to present to you a couple of different directions that we might go.

* All right so this might be like a couple of different options that we'd have for applying restful routing to this situation.

* So maybe forgetting all these particular companies and positions we could have URL like , for a friend with ID number one. I could do users slash one slash companies and that would give me you know the company with ID 5. And then we can do the same thing for their position and then repeat it for the other friends as well.(Refer : basic12)

* The downside to this approach right here is that we would be making a ton of separate HTTP requests to our back end server to get all of this data.

* Think about it you know for every single friend that our current user has we would have to make one. HTTP request just to get their company and then another one to get their position than another one to get the next Friends position in company as well.

* So it ended up being a lot of very separate requests just to get this data that otherwise looks like it would be simple to get for the market that we looked at earlier.

* So our next option if we wanted to follow restful conventions might look a little something like this(Refer : basic13)

* maybe we would do like Slash users slash 23 slash friends. So that would be like the list of all my friends and then slash companies and slash positions. So in theory that would give me all the companies and all of the positions related to user 23's friends. Ok this is starting to look a little more realistic.Like I could imagine putting an end point together like this.

* The problem with this point right here is that well its very particular its very customized.

* you imagine if we were making use of URL like this all over our application remember you know someone has to actually program this route right here.They have to like put together the queries to make this route.They will start to get a little bit of a pain if we wanted to have a lot of different endpoints that fetch these very customized pieces of data like

* so the final option that I would present to you and this is where a lot of people tend to go is to make just one very particular very customized endpoint that really starts to break RESTful conventions.(Refer: basic14)

* So maybe they would say Okay finally user 23 and then I'm going to make a custom endpoint called friends with companies and positions. And this single end point right here would fetch me user 23 with all of their friends and all the associated companies and positions as well. So with this you are all right here. Yeah we're definitely breaking restful conventions and definitely breaking restful conventions here.

* You know I really look at it and say like yeah that makes a ton of sense Like let's go definitely in that direction.

* when we're working with restful routing these conventions start to break down once we're working with highly related data.

* We either start to run into a lot of issues with too many HTTP requests or we start to run into big issues where we have these very customized endpoints that are very tightly coupled with very particular features on our front.

* Even then there is even one more big issue here that we haven't even addressed yet. Let's imagine that we were using this endpoint right here.
You know let's imagine we were programming this thing well if we made a request like that and we got back a list of all the companies that are social with our friends.(Refer : basic15)

* By default we might return the entire company model which might have all the data from like the stock ticker to the employee account to the founding date to the company type.(Refer : basic15)

* All this data that we don't really care about for showing what you know it's just a presentation of our current friends and the company is in position that they work at right.

* The only thing we really care about on that request or that company object is the name of the company.

* So even when we start to hone in on a very particular endpoint that we might be happy with we have to think very carefully about what data were serving back to the application

* because we might be dramatically over serving the amount of data that were tossing back to the client.

* The only thing that I want you to take away from this discussion is that restful routing with highly relational data starts to get quite challenging it starts to really bend your brain a little bit and you might start to very easily get into disagreements with your coworkers over how this routing should work.

* So this is what graphQL is looking to fix.

* GraphQL wants to fix some real big inconsistencies or challenges around restful routing and also tackle big issues around over serving data.


