from typing import Any

from django.db import models
from django.db.models import Q


class PublicIdManager(models.Manager):
    """Used so that switching back to datacube won't be too much of an issue"""
    def filter(self, *args: Any, **kwargs: Any):
        new_kwargs = {}
        similars = ["public_id", "workspace_id", "used"]
        if kwargs:
            if "_id" in kwargs:
                new_kwargs["id"] = kwargs["_id"]

            for key in kwargs:
                if key in similars:
                    new_kwargs[key] = kwargs[key]
            
        return super().filter(*args, **new_kwargs)


class PublicId(models.Model):
    workspace_id = models.CharField(max_length=200)
    public_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    used = models.BooleanField(default=False)
    objects = models.Manager()
    dc_objects = PublicIdManager()

    def __str__(self):
        return self.public_id

    class Meta:
        unique_together = ["workspace_id", "public_id"]
