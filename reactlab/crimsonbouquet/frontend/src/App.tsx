import React from 'react';
import { Route, Routes, Navigate, Link, useParams } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client'

const MainPage = function() {
  return (
    <div className="MainPage">
      i am the main page now
    </div>
  )
}

const ArticlePage = function() {
  return (
    <div className="article">
      i am a page lol
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
