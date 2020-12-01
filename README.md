# GraphQL-React

## More on Client Side Mutations

### The Like Mutation

*  we can intercept a user clicking on the thumbs up symbol we can start thinking a little bit more about the mutation that we're going to call to like an individual lyric.

* first writing the mutation out inside of graphical then we'll move the mutation over to our lyric list component and call it from the online function.

* Looks like there is a very app named mutation in here like lyric. It expects us to call it with an ID and then it returns the like updated lyric.

* Remember that each lyric we have has a property called likes. So this is the number of likes that each lyric has.

* So presumably after we like lyric we can ask the lyric for the number of new likes that it has and get the response back and somehow update our application with it.

* The first thing we need to do is make sure that we have the ID of a lyric inside of our application.

* So I need to get a list of all the lyrics that I have. I'm going to check my docs again for that really quickly. Let's go back to the root documentation explore all find my root query type and it looks like I can either ask for a lyric by ID. I think that since we're trying to get at the ID of a lyric here we will get our big list of songs and then print out the ID of each lyric inside those songs.

```js
mutation LikeLyric($id: ID) {
  likeLyric(id: $id) {
    id
    likes
  }
}
```
* So when we first run this lyric or so I mean when we first run this mutation rate here I'm going to accept expect to see a response come back where we only have one like assigned to it. So I'm going to run this thing and ok.

* I've got one like if I run a mutation again I got two three four and so on. So every single time we run the mutation we're just incrementing the number of like associated with the individual lyric.

* I think that we're ready to move this thing over to our component so I'm going to select the entire mutation 

* I definitely want to place the mutation inside of the lyric list component because I want to call the mutation from inside of the component 

### Showing Likes with Lyrics

* We now need to make sure that we sandwich the mutation together with our component and we also need to import the gql and graphQL the helpers at the top.

* So let's first do our import statements and then come back to the bottom of the file

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class LyricList extends Component {

  onLike(id, likes) {
    this.props.mutate({
      variables: { id }
    });
  }

  renderLyrics() {
    return this.props.lyrics.map(({ id, content, likes }) => {
      return (
        <li key={id} className="collection-item">
          {content}
          <div className="vote-box">
            <i
              className="material-icons"
              onClick={() => this.onLike(id, likes)}
            >
              thumb_up
            </i>
            {likes}
          </div>
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

const mutation = gql`
  mutation LikeLyric($id: ID) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;

export default graphql(mutation)(LyricList);
```

### Fetching Likes

* The first thing that I want to point out to you that can kind of guide us toward the answer or the fix or solution for this problem is that it appears that none of the light numbers appear on the screen. When we first refresh the page.

* So I suspect that this is not something having to do with the mutation we put together instead. I suspect that it might be something around the Query that initially fetches the data for this page right here.

* So the query that fetches an individual song and all the lyrics that are associated with that song.If you recall we had put that query inside of the fetchSongQuery file.

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
* here we will fetch likes also as part of the song.when I click on a button the number of likes automatically increments for each one. Definitely the behavior that I was hoping for

* I really like how this application is turning out but there's one last thing in here that's really annoying. You'll notice that whenever we click on the button there is kind of that little imperceptible pause like just a quarter of a second or half a second. We're where we are waiting for the vote to be registered by the back end and then update the UI when we get the response back. That's not the best experience in the world.

* And I would personally really like it if there was some way that we could say well I want to vote this post right here Or this lyric and I want that number to instantly just instantly be incremented.

### Optimistic UI Updates

* In the last section we finished up the functionality for allowing a user to like an individual lyric.

* However we notice that whenever you click on the Like button there's like a quarter or a half of a second delay which is which is just a little bit irritating to see.

* You'll also note that this is a delay that is kind of minimized when we're running it on our local machine.

* And I suspect that if we deploy this to an actual production style app you might see even more latency or even more lag as we wait for that number to get updated.

* So I want to propose that maybe if we figure out a solution for making it appear that the update is instant as far as our user is concerned.

* Luckily Apollo has fantastic support for this directly out of the box through a system that it calls "optimistic updates" or "optimistic responses".

* So let's take a look at the diagram and try to understand a little bit about how it works (Refer : graphql40) So we are going down in time here. So in the vertical direction or vertical axis we are starting at the very beginning at the top and then time is passing as we go down.

* So here's the order of operations whenever we want to use an optimistic response.

* We're going to call mutation and when we call mutation we're going to pass along a little object that's going to say hey when you call this mutation I bet you anything that we're going to get a response that looks  something like this. we're going to guess at what the response is when it comes back.

* Apollo is going to take that guess of what we think the response is going to be and it's going to apply it to the data inside of its internal store.

* It's going to instantly render our re-act application with this new guess at what our data should be.

* So as far as our user is concerned the UI is going to instantly appear to update.

* Now simultaneously the mutation is going to be issued to our back and as a network request.And so that request has been pending for that quarter or half of a second that we are already waiting.

* When the mutation resolves and the response comes back Appollo we'll take that response and then update its local copy of data to match whatever the response actually is said.

* And then it will update our UI with whatever the real data is from the backend server.

* So again the idea here is that we are going to guess at the response that we expect to see if a mutation the UI will instantly update.

* And then when we actually get the response from the server UI going to update again with whatever data actually came back.

* Now of course we usually are going to really hope that the guess of our response is the same as the actual response because otherwise the user is going to see kind of this like rapidly changing little flip of data 

* Now am going to lyrics list component and I'm going to find a mutation that we define inside of there.So here's the mutation where we'd like an individual lyric 

```
onLike(id, likes) {
  this.props.mutate({
    variables: { id }
  });
}
```
* now telling Appollo to use an optimistic response is actually kind of straightforward in some regards.The real challenge is deciding what the response should be.

* So let's start off by first looking at the typical response that we get whenever this mutation is executed.

* If you check response You'll notice that we get back like lyric. We have the type name of the lyric and then we have the ID and the number of likes that are associated with it.

* So we're going to have to do a little bit of footwork on guessing what the current number of likes should be. After we run the mutation. OK. So that's our plan.

### Handling Optimistic Responses

* Next we're going to say hey here's the optimistic response when this mutation runs I want you to try to just early use this data as soon as possible.

* So I say here's the optimistic response like

```js
 onLike(id, likes) {
    this.props.mutate({
      variables: { id }, 
      optimisticResponse: {
        __typename: 'Mutation',
        likeLyric: {
          id, /* ie id : id , We'll provide the ID of the record that was changed. And remember we already received the ID as an argument*/
          __typename: 'LyricType',
          likes: likes + 1 /* we also received like in argument*/
        }
      }
    });
  }
```

* So we have to specifically say that we are making a mutation like so now the next part is the part that's much more straightforward. We're going to provide the response that we are going to expect to see from our back and server. And when I say that I'm talking about exactly what we see in our response log

* We are guessing that the request is going to go through successfully and we are hoping that when the response comes back there's going to be an increment value for the number of likes right there.So that's pretty much it for optimistic response.

* So now as we test this the expectation is that the instant I click on the thumbs up button I should see the number increment but then the request should only resolve some tiny amount of time later. Remember we're not delaying the request at all. The request is still being issued instantly. The only change is at this time around. We are guessing at what the update should be for the UI.

* so now your immediate question might be. Well what happens if I guess incorrectly  what happens if I thought that the like was going to go through.But it turns out that the server rejects it or it turns out that the number of likes is actually much greater than we expected.

* that's a great question and we can very easily see what happens.

*  let's just say you know what maybe we made a big mistake and maybe we think that on the client side we believe that it's going to be changed by 12 but the server still is only going to be incrementing by 1.

* Now lets refersh and try wih optimistic response value as 12 , Now that's some interesting behavior. The instant I click on the button the number adjusts by 12. That's the optimistic update. But as soon as the response comes in from the back end we get the real truth which is that it was only incremented by one.

* So you can see that optimistic updates are a pretty safe strategy for really increasing the speed of your UI.The only kind of risk here is that if you start doing things incorrectly your user is going to see that kind of jump of data which is very much unexpected for them.

* But in general at the end of the day it's not going to break anything 
You're not going to go totally out of whack here. The UI will automatically eventually resolve to the correct answer.

* So it's a reminder when we add a new lyric we run a mutation that grabs the whole song and all the associated lyrics. Let's try adding another lyric right now and see what happens.

* Let's say type a lyric and then I'll hit enter and you'll notice I see a big error message here. And I've got loading at the top of the screen and it appears that it's not actually resolving the request at all. So this is a little bit of a bug in the Apollo world.

* Again remember Apollo is still a developing technology. Let's check out the mutation that we run whenever we add a new lyric, 

* we are using the lyric create form. at the very bottom we can scroll down to find our mutation to add a new lyric to an individual song.

* So right now when we run that mutation we get back to song. Here we are asking for the ID we're asking for are all the lyrics around it. But we are only asking for the ID and the content. So that is what is causing an issue right now.

* That's what throwing the error part of the application is expecting that we're going to know the number of likes associated with each lyric but we are not actually asking for that data right now.

* So to get our error message to go away we have to include a request for the number of likes associated with each lyric.

```js
const mutation = gql`
  mutation AddLyricToSong($content: String, $songId: ID) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      lyrics {
        id
        content
        likes
      }
    }
  }
`;

export default graphql(mutation)(LyricCreate);
```

* I encourage you to generally make sure that if you are ever making use of some type of resource you do your best to always make sure that you're grabbing the same properties off of that resource.