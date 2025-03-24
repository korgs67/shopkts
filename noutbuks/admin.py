from django.contrib import admin
from .models import Noutbuk

class NoutbukAdmin(admin.ModelAdmin):
    list_display = ['id', 'link', 'nalichiye', 'description', 'img', 'price']
    list_display_links = ['description']
    list_editable = ['price']
    search_fields = ['price', 'id']
    list_filter = ['price']

admin.site.register(Noutbuk, NoutbukAdmin)
