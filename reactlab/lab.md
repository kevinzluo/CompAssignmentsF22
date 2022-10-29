# React Lab (part 1)

We are picking up with the Django lab here and looking at how we can connect it to a React frontend. The next bit of notes on installation are taken from Richard Xu's comp materials from 2020. Thanks Richard! 

Also, some of these portions will differ with the actual codebase because that is super outdated (you'll see next week), and I did not want to struggle to go install old versions of all these packages.

## What is React?
React is a frontend framework used by the Crimson. It is developed by Facebook. Furthermore, React can also be used to build web apps.

The main object in React is the *Component*, an object managing its own states that can be rendered. There will be many times during this project where you want to visit the [React documentation](https://reactjs.org). A component is essentially a "smart" HTML tag - it can use Javascript. We won't be using too many of the fancy features of components today; the codebase in general doesn't seem to have too much of it. Instead, today we will be looking at how to set up queries on the frontend, and how we can then display this data to the user.

## Installing React
0. You probably know the drill by now, but you will need to pull from upstream. This means `git pull upstream main` and resolve any merge conflicts that arise.
1. Install Node.js. This is quite simple now that we have experience with the terminal! For MacOS, type `brew install node`. For Linux/WSL, use `sudo apt install nodejs`.
2. Check your versions by typing `node -v` and `npm -v`. `npm` comes packaged with Node. To run react, you will need `npm` version 5 or above and node version 8 or above.
3. If you do not have version 5 or above, run `npm install -g npm@latest`. This should get you the latest version.
4. Put your versions of `npm` and `node` into `lab3-responses.md`.

## Setting up for today
Hopefully this goes better than last week...

### Setting up the Django portion
The completed Django lab is located in this directory. We need to boot it up to allow the frontend to query it.
First install the necessary packages:
```
python3 -m pip install -r requirements.txt
```

You will need now to run the following:
```
python manage.py migrate
```
Find where `manage.py` is. If you run this in the wrong `directory, then obviously it's not going to work :P.

Now we will load in the Crimson data from last week:
```
python manage.py loaddata sample_data
```

### Setting up React
Hopefully this works. Run the following inside `crimsonbouquet/frontend`.
```
npm install --force
```

Nice! That should be it.

We now need to run both of these, so you will need at least 3 terminal tabs.

In one, run `python manage.py runserver` in the base directory (the same directory as this file).
In another, run `npm start` in the `crimsonbouquet/frontend`. In the third, you can actually type stuff i guess... 

# Actual React

I'm up at 3 am and have to get up at 7:30. Sad reacts only.

## What's going on here

The point of entry here is `index.js`. If we look inside, we see that it does some setup and then calls `App`, which is imported from `App.tsx`. `App.tsx` then has a Router that displays an appropriate component given the url, which is discussed in a little bit.

Head to `localhost:3000`. You see `i am the main page now`, which corresponds to the text in the `MainPage` component we just talked about. Why is this one being displayed? Because of the Router.

## Components

Glorified HTML. They are essentially HTML elements that are equipped with Javascript. A basic one is the current `MainPage` component:

```ts
const MainPage = function() {
  return (
    <div className="MainPage">
      i am the main page now
    </div>
  )
}
```

It returns a JSX element - an actual HTML element. However, we'll see moving forward that can do much more. Any functional component must return an appropriate JSX element, so React can render it (put it up for you to see).

This is an example of a functional component. There are also class components, and many cool features that these things have, none of which we will discuss today, but you're free to read about them online.

### Router Component

What is used here (and in the actual codebase) is a Router component. This begins with the `BrowserRouter` used in `index.js`, and includes the `Routes` and `Route` components in `App.tsx`. These do exactly what the look like, and behave similarly to `urls.py` for Django.

They simply match the url you ask for, and display the appropriate component. Since we're at `localhost:3000`, the path is just `/`, and thus we are shown the `MainPage` component. Let's actually put something on it now.

### Adding GraphQL Queries

Recall that last week, we set up GraphQL on the backend. Here, we've set it up such that we are able to query that backend. Go to `localhost:8000/graphql`. Put in the following query:

```
query {
	allContent {
    title
    slug
  }
}
```

Now let's add this query to `App.tsx`. Use logic to decide where to place it. We will need to use it in `MainPage`, but obviously you can't put this before the imports.

```js
const GET_ALL_CONTENT = gql`
  query GetAllContent {
    allContent {
      title
      slug
    }
  }
`
```

We have to run it when `MainPage` gets called, so replace the MainPage function with this:
```ts
const MainPage = function() {
  const { loading, error, data } = useQuery(GET_ALL_CONTENT);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;
  
  console.log(data)

  return (
    <div className="MainPage">
      i am the main page now
    </div>
  )
}
```

Note that we're logging out the data. Refresh the page and go open the console - what does it look like? It should be the same as the GraphQL output. Hit the arrow to expand it if needed.

Now let's display the data. Replace the MainPage function with this. Now what does your site look like? 
```ts
interface ArticleGQL {
  title: string;
  slug: string;
}

const MainPage = function() {
  const { loading, error, data } = useQuery(GET_ALL_CONTENT);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;
  
  console.log(data)

  const Lists = data.allContent.map((a: ArticleGQL) => (
    <li key={a.slug}><Link to={'article/' + a.slug}>{a.title}</Link></li>
  ));

  return (
    <div className="MainPage">
      <h1>Articles</h1>
      <ul>
        { Lists }
      </ul>
    </div>
  )
}
```

However, you see that when we click an article, we don't get sent anywhere good. To fix this, we need to actually set up the pages being linked to.

For this, we just need to fix the `ArticlePage` component.

Note that in the route, we capture the value of the slug of the article. How do we use this? Through `useParams`. This is one key place where the existing codebase is different, but you'll see that next week.

Let's first replace `ArticlePage` with the following:

```ts
const ArticlePage = function() {
  const params = useParams()
  console.log(params);

  return (
    <div className="article">
      i am a page lol
    </div>
  )
}
```

Pick one of the articles and click it to go to the page. Open up the console and look. We print params, and there's our slug!
Now that we have our slug, we can use it to query the backend and come up with the right article. Let's define the approriate query:

```js
const GET_ARTICLE = gql`
  query GetArticle($slug: String!) {
    content(slug: $slug) {
      title
      text
      contributors {
        firstName
        lastName
      }
    }
  }
`
```

Add it to `App.tsx` in an appropriate place (use logic). Now, we can use it. Replace `ArticlePage` with the following:

```ts
const ArticlePage = function() {
  const params = useParams()
  console.log(params);
  const {loading, error, data} = useQuery(GET_ARTICLE, {variables: params})
  
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data)

  return (
    <div className="article">
      i am a page lol
    </div>
  )
}
```

Note the syntax here in passing the GraphQL query with a parameter.

Refresh your page and look at the console. What gets printed in the console? Our article title and text, which is the data we requested. Now all we have to do is display it. Replace `ArticlePage` one last time with this:

```ts
const ArticlePage = function() {
  const params = useParams()
  console.log(params);
  const {loading, error, data} = useQuery(GET_ARTICLE, {variables: params})
  
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data)

  return (
    <div className="article">
      <h1> {data.content.title} </h1>
      <div className="body" dangerouslySetInnerHTML={{__html: data.content.text}} />
    </div>
  )
}
```

Now, refresh the page, and as you can see, its the article, though some things are screwed up because we can't process shortcodes. 

Thats it!

As an assignment, first add all the writers to the main page. Recall that we already have an `allContributors` query - use it. For displaying the data, you can reuse the code we used to display the articles, but you'll have to change a couple things. You don't need to have these be links to new pages. Google and StackOverflow are your friends - be independent!

If you're feeling up for it, after doing this, create pages for each of the writers, and link to them. Note that we only have a method for resolving a contributor given their id - this means you should probably include the id as a field in the URL. 


