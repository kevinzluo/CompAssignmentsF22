import React from 'react';
import { Route, Routes, Navigate, Link, useParams } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client'
import { MainPage } from './pages/MainPage'
import { ContributorPage } from './pages/ContribPage'

const GET_ARTICLE = gql`
  query GetArticle($slug: String!) {
    content(slug: $slug) {
      title
      text
      contributors {
        id
        firstName
        lastName
        title
      }
    }
  }
`

const ArticlePage = function() {
  const params = useParams()
  const {loading, error, data} = useQuery(GET_ARTICLE, {variables: params})
  
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;

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
        <Route path ='/contrib/:id/:name' element={<ContributorPage />} />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
