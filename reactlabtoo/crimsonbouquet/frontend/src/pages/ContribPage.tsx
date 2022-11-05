import { Link, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

const GET_CONTRIB = gql`
  query GetContributor($id: Int!) {
    contributor(id: $id) {
      firstName
      lastName
      bioText
      content {
        id
        title
        slug
      }
    }
  }
`

export const ContributorPage = function() {
  const params = useParams();
  console.log(params);
  let id:string = params.id!;
  const {loading, error, data} = useQuery(GET_CONTRIB, {variables: {
    "id": parseInt(id)
  }});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ur trash</p>;

  let articles = data.contributor.content.map((content: any) => <li key={content.id}><Link to={`/article/${content.slug}/`}>{content.title}</Link></li>)

  return (
    <div className="contributor">
      <h1>{data.contributor.firstName}  {data.contributor.lastName}</h1>
      <p>{data.contributor.bioText}</p>
      <h2>Articles</h2>
      <ul>
        {articles}
      </ul>
    </div>
  );
}
