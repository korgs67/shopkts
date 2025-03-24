from django.db import models

class Noutbuk(models.Model):
    link = models.TextField('Ссылка')
    nalichiye = models.TextField('Есть в наличии')
    description = models.TextField('Описание')
    img = models.TextField('Фото')
    price = models.DecimalField('Цена',max_digits=12, decimal_places=2)

    def get_absolute_url(self):
        return self.link

    def __str__(self):
        return f'{self.link} ||{self.nalichiye} | {self.description[:60]} | {self.img}  ||  {self.price}'

    class Meta:
        verbose_name = 'Ноутбук'
        verbose_name_plural = 'Ноутбуки'
        ordering = ['link', 'nalichiye', 'description', 'img', '-price']


