from django.contrib import admin
from .models import Playlist, Songs, Language, Nationality, Artist, Friends, FriendRequest


admin.site.register(Artist)
admin.site.register(Playlist)
admin.site.register(Songs)
admin.site.register(Language)
admin.site.register(Nationality)
admin.site.register(Friends)
admin.site.register(FriendRequest)





