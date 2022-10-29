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