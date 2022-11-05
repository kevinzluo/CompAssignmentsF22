import { Link } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

const GET_ALL_CONTENT = gql`
  query GetAllContent {
    allContent {
      title
      slug
    }
  }
`

const GET_ALL_CONTRIB = gql`
  query {
    allContributors {
      id
      firstName
      lastName
    }
}`


export const MainPage = function() {
  const { loading: contentLoading, error: contentError, data: contentData } = useQuery(GET_ALL_CONTENT);
  const { loading: contribLoading, error: contribError, data: contribData } = useQuery(GET_ALL_CONTRIB);

  if (contentLoading || contribLoading) return <p>Loading ...</p>;
  if (contentError || contribError) return <p>Error :(</p>;
  
  const contentLists = contentData.allContent.map((a: any) => (
    <li key={a.slug}><Link to={'article/' + a.slug}>{a.title}</Link></li>
  ));

  const contribList = contribData.allContributors.map((a: any) => (
    <li key={a.id}><Link to={`contrib/${a.id}/${a.firstName}_${a.lastName}`}>{a.firstName} {a.lastName}</Link></li>
  ));

  return (
    <div className="MainPage">
      <h1>Articles</h1>
      <ul>
        { contentLists }
      </ul>
      <h1>Writers</h1>
      <ul>
        { contribList }
      </ul>
    </div>
  )
}

