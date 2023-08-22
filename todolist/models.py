from django.db import models
from djongo import models as djongo_models


class Note(models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True)
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = "tasks"
