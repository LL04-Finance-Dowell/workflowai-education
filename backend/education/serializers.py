from rest_framework import serializers

from education.models import PublicId


class CreateCollectionSerializer(serializers.Serializer):
    DATABASE_CHOICES = (
        ("META_DATA", "META_DATA"),
        ("DATA", "DATA"),
    )

    workspace_id = serializers.CharField(max_length=100, allow_null=False, allow_blank=False)
    """collection_name = serializers.CharField(
        max_length=100, allow_null=False, allow_blank=False
    )"""
    database_type = serializers.MultipleChoiceField(choices=DATABASE_CHOICES)


class SinglePublicIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicId
        fields = ["id", "public_id", "used", "workspace_id"]

    def to_representation(self, instance):
        instance = super().to_representation(instance)
        data = {
            "_id": instance["id"],
            "public_id": instance["public_id"],
            "used": instance["used"],
            "database": f"{instance['workspace_id']}_workflowai_public_id_db",
        }
        return data


class PublicIdSerializer(serializers.Serializer):
    def to_representation(self, instance):
        data = {
            "success": True,
            "message": "Data found!",
            "data": SinglePublicIdSerializer(instance, many=True).data,
        }
        return data
