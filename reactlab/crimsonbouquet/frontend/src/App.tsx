import React from 'react';
import { Route, Routes, Navigate, Link, useParams } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client'

const GET_ALL_CONTENT = gql`
  query GetAllContent {
    allContent {
      title
      slug
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

const GET_ALL_WRITERS = gql`
  query GetAllWriters {
    allContributors {
      id
      firstName
      lastName
    }
  }
`

interface ArticleGQL {
  title: string;
  slug: string;
}

interface ContributorGQL {
  id: number
  firstName: string;
  lastName: string;
}

const MainPage = function() {
  const { loading: contentLoading, error: contentError, data: contentData } = useQuery(GET_ALL_CONTENT);
  const { loading: writerLoading, error: writerError, data: writerData } = useQuery(GET_ALL_WRITERS);

  if (contentLoading || writerLoading) return <p>Loading ...</p>;
  if (contentError || writerError) return <p>Error :(</p>;



  const articleLists = contentData.allContent.map((a: ArticleGQL) => (
    <li key={a.slug}><Link to={'article/' + a.slug}>{a.title}</Link></li>
  ));

  const writerLists = writerData.allContributors.map((a: any) => (
    <li key={a.id}>{a.firstName} {a.lastName}</li>
  ));

  return (
    <div className="MainPage">
      <h1>Articles</h1>
      <ul>
        { articleLists }
      </ul>
      <h1>Writers</h1>
      <ul>
        { writerLists }
      </ul>
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
        <Route path ='/article/:slug' element={<ArticlePage /> } />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
