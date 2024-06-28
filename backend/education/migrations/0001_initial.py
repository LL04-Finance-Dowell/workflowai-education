# Generated by Django 4.2.3 on 2024-06-28 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PublicId',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workspace_id', models.CharField(max_length=200)),
                ('public_id', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('used', models.BooleanField(default=False)),
            ],
            options={
                'unique_together': {('workspace_id', 'public_id')},
            },
        ),
    ]
