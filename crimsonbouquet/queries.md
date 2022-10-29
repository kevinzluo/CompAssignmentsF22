How would you design a query that, given a contributor's id, tells you the titles of the content that they've written? As an example, give me the query that would tell which articles the contributor with id 1 has written.

Given an article's slug, give the first and last name of the authors that wrote it. As an example, give me the query that would tell me who wrote the article with slug "why yelan is gamechanging". (spoiler alert: she wasn't really)


```
query {
  contributor(id: 1) {
    id
    firstName
    lastName
    content {
    	title
    }
  }
  
  content(slug: "why-yelan-is-gamechanging") {
    contributors {
      firstName
      lastName
    }
  }
} 
```