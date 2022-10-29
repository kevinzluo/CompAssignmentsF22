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