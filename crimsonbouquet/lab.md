# Django

Quick note to start: We will be working inside this directory (the directory containing `lab.md`) the entire time. Whenever there is a command saying run `python manage.py ...`, you will need to run it from this directory as well, since this is the directory containing `manage.py`.

You will need to update your local repository, as usual. The instructions for that are located here: `https://crimsontechcomp.github.io/Pages/Submitting.html`

## What is Django?

Python-based web framework used as the Crimson's backend.

## Overview

Django follows the Model-View-Template framework. Urls are processed by `urls.py`, which then calls the appropriate function in `views.py`. `views.py` is then able to request data from models and use templates to render a response, which the user then sees. See slides for more.

## Installation and Setup

Run `pip install Django graphene graphene-django`. 

Most of the initial setup has been done for you.

## Writing a view and routing

We will first write a barebones view and route to it. We will not be covering Django templates because most of that is taken care of by React on the site, with a very small number of exceptions (one of them is `https://www.thecrimson.com/columns/opinion` - can you tell that the page is different?). 

Place in `content/views.py`: 
```python
from django.http import HttpResponse

# Create your views here.
def index(request):
    return HttpResponse("Hello lah.")
```

This constitutes your first view. Essentially, when this function gets called, it will return an HTML page with the text "Hello lah."

We now need to tell Django when to use this view.

In the `content` directory, create `urls.py`. Add

```python
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

Uncomment the following line in `crimsonbouquet/urls.py`:   
```python
path('content/', include('content.urls'))
```

**!! Now start up the server with `python manage.py runserver`**. Go to `localhost:8000/content/`. What do you see?
In essence, any url is first passed to crimsonbouquet/urls.py. It matches against each of the url patterns, here with `content/`. That portion is now stripped off, and is passed to `content.urls`, where the remainder, which is just `/`, matches to display what is defined by `views.index`.

## Building models and migrating

Models are the most important part of this lesson, because views and templates are essentially no longer used in the existing codebase. 

Paste the following code into `content/models.py'.

```python
from django.db import models

# Create your models here.

class Contributor(models.Model):
    first_name = models.CharField(max_length = 100)
    last_name = models.CharField(max_length = 100)
    middle_name = models.CharField(max_length = 100)

    bio_text = models.CharField(blank = True, max_length = 500, null = True)

    TITLE_CHOICES = (
        ('cstaff', 'Crimson staff writer'),
        ('contrib', 'Contributing writer'),
        ('photog', 'Photographer'),
        ('design', 'Designer'),
        ('editor', 'Editor'),
        ('opinion', 'Crimson opinion writer'),
        ('opinion_contrib', 'Contributing opinion writer'),
        ('sponsored_contrib', 'Sponsored Contributor'),
    )

    _title = models.CharField(
        blank=True, null=True, max_length=70, choices=TITLE_CHOICES,
        verbose_name='title'
    )

    @property
    def title(self):
        TITLE_CHOICES_MAP = dict(self.TITLE_CHOICES)

        if self._title:
            return TITLE_CHOICES_MAP[self._title]
        # generate default title
        else:
            return 'Contributor'

    def __str__(self):
        return " ".join(filter(None, [self.first_name, self.middle_name, self.last_name]))

class Article(models.Model):
    title = models.CharField(max_length = 200)
    contributors = models.ManyToManyField(Contributor, related_name = 'content')
    text = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(max_length = 70)

    def __str__(self):
        return self.title
```

The code above defines our two models, that of the Contributor and the Article. Let's discuss what's going on. 
```python
class Contributor(models.Model):
    first_name = models.CharField(max_length = 100)
    last_name = models.CharField(max_length = 100)
    middle_name = models.CharField(max_length = 100)

    bio_text = models.CharField(blank = True, max_length = 500, null = True)

    TITLE_CHOICES = (
        ('cstaff', 'Crimson staff writer'),
        ('contrib', 'Contributing writer'),
        ('photog', 'Photographer'),
        ('design', 'Designer'),
        ('editor', 'Editor'),
        ('opinion', 'Crimson opinion writer'),
        ('opinion_contrib', 'Contributing opinion writer'),
        ('sponsored_contrib', 'Sponsored Contributor'),
    )

    _title = models.CharField(
        blank=True, null=True, max_length=70, choices=TITLE_CHOICES,
        verbose_name='title'
    )

    @property
    def title(self):
        TITLE_CHOICES_MAP = dict(self.TITLE_CHOICES)

        if self._title:
            return TITLE_CHOICES_MAP[self._title]
        # generate default title
        else:
            return 'Contributor'

    def __str__(self):
        return " ".join(filter(None, [self.first_name, self.middle_name, self.last_name]))
```

When we define the Contributor Model, we are telling Django what fields each contributor will have. Here, we're telling it that they have a first, last, and middle name, of `max_length` 100 characters. We're telling it that they can have a bio, which can be blank, and we're also giving them a title. Here, `_title` is the private value, and `title` will be the public value, serving as a wrapper for people with weird title values. Finally, the `__str__` method just makes it easier to read when we are testing these.

Let's now look at the Article class.
```python
class Article(models.Model):
    title = models.CharField(max_length = 200)
    contributors = models.ManyToManyField(Contributor, related_name = 'content')
    text = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(max_length = 70)

    def __str__(self):
        return self.title
```
This is even simpler. We are just saying that every `Article` needs a title, text, a creation date, and a slug, which is the dashed text you see in the url `https://www.thecrimson.com/article/2022/4/1/admissions-class-of-2026/`. However, note the `contributors` attribute. This defines a relationship between `Articles` and `Contributors`. It is a `ManyToMany` field, since any article can have multiple contributors, and of course every contributor can write many articles. This attribute is able to be accessed from either a Contributor or an Article, which we will see soon. 

In order to tell Django that we are using these, we need to add them to the INSTALLED_APPS variable in our `settings.py` file. So add 'content.apps.ContentConfig' to the INSTALLED_APPS list in `settings.py`:
```python
INSTALLED_APPS = [
    'content.apps.ContentConfig',
    ...
]
```

When creating and modifying models, we need to run migrations. Understanding this portion is less important.

```
python manage.py migrate
python manage.py makemigrations content
python manage.py migrate
```

## Testing the built in API

We can run `python manage.py shell` to play with some objects. This opens up an interactive session. In it, we'll run some lines, and you should get the same output.

Let's first create a Contributor. This is done as follows. Note that after they are created, they are given an id, which is not even a field we specified when creating the model. 
```pycon
>>> from content.models import Contributor, Article
>>> c = Contributor(first_name = "Hu", last_name = "Tao")
>>> c
<Contributor: Hu Tao>
>>> Contributor.objects.all()
<QuerySet []>
>>> c.save()
>>> c.id
1
>>> Contributor.objects.all()
<QuerySet [<Contributor: Hu Tao>]>
```
The above begins to show how we are able to query different models. We just asked for every `Contributor` model currently in the database. For any model, we're able to access all the objects using `[class_name].objects.all()`. Instead of `.all()`, there are other commands we can use to filter down these objects, which we'll learn later.

Let's now create an article:
```pycon
>>> a = Article(title = "How to Consistently VV Vape", text = "Just get gud 5head", slug = "how-to-consistently-vv-vape")
>>> a.save()
>>> a
<Article: How to Consistently VV Vape>
>>> a.contributors.add(c)
>>> a.contributors.all()
<QuerySet [<Contributor: Hu Tao>]>
>>> c.content.all()
<QuerySet [<Article: How to Consistently VV Vape>]>
```
We just created an article and added to its contributors the contributor we just created. You can see that this is now able to be seen in the database in two ways: our contributor is in the `contributor` set of the article, and the article is in the `content` set of the contributor. The reason it is called `content` from the Contributor side is because we set `related_name = "content"` earlier. This is the same way it is set up in the Crimson's database. 

Let's create a second article:
```pycon
>>> a2 = Article(title = "Why Yelan is gamechanging", text = "makes rotations shorter", slug = "why-yelan-is-gamechanging")
>>> a2.save()
>>> c.content.add(a2)
>>> c.content.all()
<QuerySet [<Article: How to Consistently VV Vape>, <Article: Why Yelan is gamechanging>]>
>>> a2.contributors.all()
<QuerySet [<Contributor: Hu Tao>]>
```
Here, we've now added the relation from the other side - before we added a contributor to an article, and now we've added an article to a contributor. Note that the effect is exactly the same.

We can even create contributors directly from articles:
```pycon
>>> a2.contributors.create(first_name = "Xing", last_name = "Qiu")
>>> a2.contributors.all()
<QuerySet [<Contributor: Hu Tao>, <Contributor: Xing Qiu>]>
>>> Contributor.objects.all()
<QuerySet [<Contributor: Hu Tao>, <Contributor: Xing Qiu>]>
```

Playing around with the actual Crimson database is pretty fun. We'll get access in a couple weeks, and you can figure out who has the lowest primary key (which contributor was first added). Turns out he's some assistant professor at UTA. I actually reached out to him and he responded!

## Dealing with admin

You can now quit out of the django interactive shell. We'll now be working with the Django admin, which is the way staff at the Crimson upload articles and set layouts for the website.

We need to first create a super user. Run `python manage.py createsuperuser`. Set its credentials to whatever you want, but remember them.

Change `content/admin.py` to be the following. This tells Django to display these two models in the admin:
```python
from django.contrib import admin

# Register your models here.

from .models import Contributor, Article

admin.site.register(Contributor)
admin.site.register(Article)
```

Go to admin at `localhost:8000/admin`. Remember to boot the server back up if you closed it!

We can now edit our objects here, interactively instead of through the shell. Click on Articles and go capitalize the "g" in gamechanging!

We are now going to write some more complicated views. This part isn't important to understand because views and templates are no longer used. The templates already exist in the code, we just have to modify `content/views.py` to be the following:
```python
from django.shortcuts import render, get_object_or_404

from .models import Contributor, Article
from django.http import HttpResponse

# Create your views here.
def index(request):
    return HttpResponse("Hello lah.")

def display_contributor(request, contrib_id):
    contributor = get_object_or_404(Contributor, pk = contrib_id)
    return render(request, "content/contributor.html", {"contributor": contributor})

def display_article(request, slug):
    article = get_object_or_404(Article, slug = slug)
    return render(request, "content/article.html", {"article": article})
```

Also modify `content/urls.py`:
```python
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('contrib/<int:contrib_id>/', views.display_contributor, name = "display_contributor"),
    path('article/<slug:slug>/', views.display_article, name = "display_article")
]
```
We won't give much explanation on this since it isn't important, as stated before. Basically, each `<>` group acts as a capture group, taking in the variable specified of the type specified. This is then passed to the view function we call. As you can see in our definition of these views, we are returning the respective contributor/article. 

Now we can look at these articles. Visit `localhost:8000/content/contrib/1/`. What do you see? Visit `localhost:8000/content/article/why-yelan-is-gamechanging`. What do you see?

This is all for the Django portion of this lab. The most important things to become comfortable with are working with the API and understanding how models were defined. We now move on to GraphQL. 

# GraphQL

A query language for APIs. We want to make the data stored in Django available through GraphQL.
This will be useful when we start working with React and want to query this backend that we've built.

Create `content/schema.py`, and put this inside it:
```python
import graphene
from graphene_django import DjangoObjectType

from content.models import Contributor, Article

class ContributorGQL(DjangoObjectType):
    class Meta:
        model = Contributor

class ArticleGQL(DjangoObjectType):
    class Meta:
        model = Article

class Query(graphene.ObjectType):
    contributor = graphene.Field(ContributorGQL, id = graphene.Int())
    content = graphene.Field(ArticleGQL, slug = graphene.String(required = True))
    all_content = graphene.List(ArticleGQL)
    all_contributors = graphene.List(ContributorGQL)

    def resolve_content(self, info, slug):
        return Article.objects.get(slug = slug)

    def resolve_contributor(self, info, id):
        return Contributor.objects.get(pk = id)
    
    def resolve_all_content(self, info):
        return Article.objects.all()

    def resolve_all_contributors(self, info):
        return Contributor.objects.all()

schema = graphene.Schema(query=Query)
```

**!! In `crimsonbouquet/settings.py`, uncomment the settings for GRAPHENE, and also uncomment the line in `crimsonbouquet/urls.py` that has GraphQL in it. !!**

The `schema.py` file essentially is telling GraphQL the underlying representation of the data we already have stored, and how to respond when certain things are queried of it. 
Let's discuss what's going on here. 
```python
class ContributorGQL(DjangoObjectType):
    class Meta:
        model = Contributor

class ArticleGQL(DjangoObjectType):
    class Meta:
        model = Article
```
These define GraphQL types/classes that directly inherit all of their fields from the respective Django model, specified by `model`. This means that from a ContributorGQL object, we can ask for their `first_name` and `last_name`; likewise, from an ArticleGQL object, we can ask for the `title`, just as we defined in `content/models.py`.

```python
class Query(graphene.ObjectType):
    contributor = graphene.Field(ContributorGQL, id = graphene.Int())
    content = graphene.Field(ArticleGQL, slug = graphene.String(required = True))
    all_content = graphene.List(ArticleGQL)
    all_contributors = graphene.List(ContributorGQL)

    def resolve_content(self, info, slug):
        return Article.objects.get(slug = slug)

    def resolve_contributor(self, info, id):
        return Contributor.objects.get(pk = id)
    
    def resolve_all_content(self, info):
        return Article.objects.all()

    def resolve_all_contributors(self, info):
        return Contributor.objects.all()
```
The `Query` class is the root type. All access to the data must go through this class. Since there is no class we can directly inherit from here, we must explicitly define the fields that can be queried from `Query`, here being `contributor, content, all_content` and `all_contributors`. Moreover, we need to tell GraphQL what to spit back out when these things are queried from it. These are done using the `resolve` methods. Most of the `resolve` methods here should make intuitive sense: when we are asking for a certain piece of `content` with a specified `slug`, we are just querying from the `Article`s the object that has that slug. The rest are similar.

Now let's go to `localhost:8000/graphql`. From here, we are able to test various queries. Paste in the following query: 
```
query {
  contributor(id: 1) {
    id
    firstName
    lastName
  }
} 
```
This should just be the first contributor we created, `Hu Tao`! We could try some more queries for fun, but we don't have much data, so let's add more.

Run `python manage.py loaddata sample_data`. I have gathered all the articles from the last published issue of the Crimson (the one on 1 April 2022) as well as all the contributors involved in it. They are now all loaded into your database.

Here are some queries that show more of the power of GraphQL:
```
query {
  allContributors {
    firstName
    lastName
    content {
      title
      createdOn
    }
  }
}
```
Note that here, when we query allContributors (note that it's now camel case and not snake case), we are returned a list of Contributors. Recall that from the Django models, each Contributor has a `content` set that contains all of its articles. This means that from GraphQL, we can then furthermore ask for the title, and the creation data of these articles.

Here it is from the other side: 
```
query {
  allContent {
    title
    contributors {
      firstName
      lastName
    }
  }
}
```

We ask for all the existing content pieces; each one comes with a set of contributors, and we can then ask for their first and last names. 

As a submission, answer the following two questions. 
- How would you design a query that, given a contributor's id, tells you the titles of the content that they've written? As an example, give me the query that would tell which articles the contributor with id `1` has written.
- Given an article's slug, give the first and last name of the authors that wrote it. As an example, give me the query that would tell me who wrote the article with slug `"why yelan is gamechanging"`. (spoiler alert: she wasn't really)


For fun, are the commands I used to generate the sample data. It can tell you some more about using the API. 
```pycon
>>> Aset = Article.objects.filter(issue__issue_date = datetime.date(2022, 4, 1))
>>> Cset = []
>>> for a in Aset:
...     Cset.extend(a.contributors.all())
>>> unique_id = [c.pk for c in Cset]
>>> to_id = range(3, 3 + len(unique_id))
>>> data = []
>>> def conv_id(id):
...     return to_id[unique_id.index(id)]
>>> for c in Cset:
...     obj = {"model": "content.contributor",
...             "pk": conv_id(c.id),
...             "fields": {
...                     "first_name": c.first_name,
...                     "middle_name": c.middle_name,
...                     "last_name": c.last_name,
...                     "bio_text": c.bio_text,
...                     "_title": c._title
...             }
...             }
...     data.append(obj)
>>> unique_a_id = [a.pk for a in Aset]
>>> to_a_id = range(3, len(unique_a_id) + 3)
>>> def conv_a_id(id):
...     return to_a_id[unique_a_id.index(id)]
>>> for a in Aset:
...     obj =   {"model": "content.article",
...                 "pk": conv_a_id(a.id),
...                 "fields": {
...                 "title": a.title,
...                 "text": a.text,
...                 "created_on": a.created_on.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
...                 "slug": a.slug,
...                 "contributors": [conv_id(c.pk) for c in a.contributors.all()]
...                 }
...     }
...     data.append(obj)
```

