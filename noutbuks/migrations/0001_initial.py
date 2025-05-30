# Generated by Django 5.0.6 on 2025-02-04 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Noutbuk',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link', models.TextField(verbose_name='Ссылка')),
                ('nalichiye', models.TextField(verbose_name='Есть в наличии')),
                ('description', models.TextField(verbose_name='Описание')),
                ('img', models.TextField(verbose_name='Фото')),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
            ],
            options={
                'verbose_name': 'Ноутбук',
                'verbose_name_plural': 'Ноутбуки',
                'ordering': ['link', 'nalichiye', 'img', 'description', '-price'],
            },
        ),
    ]
