from django.db import models
from accounts.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Playlist(models.Model):
    playlist_name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')

    def __str__(self) -> str:
        return self.playlist_name

class Nationality(models.Model):
    country_name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.country_name

class Language(models.Model):
    language = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.language

class Artist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(blank=False, null=False)
    nationality = models.ManyToManyField(
        Nationality, related_name="registered_country", blank=False
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.user.first_name

class Songs(models.Model):
    title = models.CharField(max_length=100)
    artist = models.ManyToManyField(Artist, related_name="artists", blank=False)
    language = models.ManyToManyField(Language, related_name="languages", blank=False)
    song = models.FileField(upload_to="audios/", null=False)
    playlist = models.ManyToManyField(Playlist, related_name="songs", blank=True)
    like = models.ManyToManyField(User, related_name="likes", blank=True)
    dlike = models.ManyToManyField(User, related_name="dlikes", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title

class Friends(models.Model):
    first_user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user1")
    second_user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user2")

    def __str__(self) -> str:
        return self.second_user.get_full_name

class FriendRequest(models.Model):
    first_user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user_req1")
    second_user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user_req2")

    def __str__(self) -> str:
        return f"Request sent from {self.first_user.first_name} to {self.second_user.first_name}"

@receiver(post_save, sender=Artist)
def set_is_artist(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        user.is_artist = True
        user.save()



