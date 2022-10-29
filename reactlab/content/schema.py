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