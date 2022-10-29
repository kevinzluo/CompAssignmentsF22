from django.contrib import admin

# Register your models here.

from .models import Contributor, Article

admin.site.register(Contributor)
admin.site.register(Article)