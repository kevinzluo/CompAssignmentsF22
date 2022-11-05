import React from 'react';
import { Route, Routes, Navigate, Link, useParams } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client'
import { StringLiteral } from 'typescript';

interface ArticleGQL {
  title: string;
  slug: string;
}

interface ContributorGQL {
  firstName: string;
  lastName: string;
  id: string;
}

const GET_PARTICULAR_WRITER = gql`
  query Writer($id: Int!) {
    contributor(id: $id) {
      firstName
      lastName
      content {
        title
      }
    }
  }
`
const GET_ALL_CONTENT = gql`
  query GetAllContent {
    allContent {
      title
      slug
    }
    allContributors {
      firstName
      lastName
      id
    }
  }
`

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

const MainPage = function() {
  const { loading, error, data } = useQuery(GET_ALL_CONTENT);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;
  
  console.log("beepbop")
  console.log(data)

  const artLists = data.allContent.map((a: ArticleGQL) => (
    <li key={a.slug}><Link to={'article/' + a.slug}>{a.title}</Link></li>
  ));

  const peopleLists = data.allContributors.map((a: ContributorGQL) => (
    <li key={a.firstName + a.lastName}><Link to={'writer/' + a.id}>{a.firstName} {a.lastName}</Link></li>
  ));

  return (
    <div className="MainPage">
      <h1> The Harvard Crimson </h1>
      <h2> Latest Articles</h2>
      <ul>
        { artLists }
      </ul>
      <h2>People Masthead</h2>
      <ul>
        { peopleLists }
      </ul>
    </div>
  )
}

const WriterPage = function() {
  const params = useParams()
  console.log(params);
  const {loading, error, data} = useQuery(GET_PARTICULAR_WRITER, {variables: params})
  
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data)
  const artLists = data.contributor.content.map((a: ArticleGQL) => (
    <li key={a.slug}><Link to={'article/' + a.slug}>{a.title}</Link></li>
  ));

  return (
    <div className="writer">
      <h1> Article Page for {data.contributor.firstName} {data.contributor.lastName}</h1>
      <ul>
        {
          artLists
        }
      </ul>
      <p> <Link to = {'/'}> Back Home </Link></p>
    </div>
  )
}

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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path ='/' element ={<MainPage />} />
        <Route path = '/writer/:id' element={<WriterPage />}/>
        <Route path ='/article/:slug' element={<ArticlePage /> } />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
