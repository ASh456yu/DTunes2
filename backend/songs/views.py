from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import SongsSerializer, ArtistsSerializer, Artist
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Songs, Playlist, Nationality, Language, Artist
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
import json
from accounts.models import User
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response


class SongsListView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):

        title = request.data.get("title")
        artists = []
        artist_id = 0
        all_artists = request.data.get(f"artist[{artist_id}][id]")

        while all_artists:
            artists.append(all_artists)
            artist_id += 1
            all_artists = request.data.get(f"artist[{artist_id}][id]")

        artists_instances_array = []
        try:
            for ids in artists:
                artists_instances = Artist.objects.get(id=ids)
                artists_instances_array.append(artists_instances)
        except Artist.DoesNotExist:
            return JsonResponse(
                {"status": 404, "message": f"Artist with id {artist_id} not found"}
            )
        except Exception as e:
            return JsonResponse({"status": 500, "message": str(e)})

        languages = []
        language_id = 0
        all_languages = request.data.get(f"language[{language_id}][id]")

        while all_languages:
            languages.append(all_languages)
            language_id += 1
            all_languages = request.data.get(f"language[{language_id}][id]")

        languages_instances_array = []
        try:
            for ids in languages:
                languages_instances = Language.objects.get(id=ids)
                languages_instances_array.append(languages_instances)
        except Language.DoesNotExist:
            return JsonResponse(
                {"status": 404, "message": f"Language with id {language_id} not found"}
            )
        except Exception as e:
            return JsonResponse({"status": 500, "message": str(e)})

        song = request.data.get("song")

        try:
            songs_create = Songs.objects.create(title=title, song=song)
            songs_create.language.set(languages_instances_array)
            songs_create.artist.set(artists_instances_array)
            songs_create.save()
        except Exception as e:
            return JsonResponse({"status": 500, "message": str(e)})

        return JsonResponse({"status": 201})


class SongDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Songs.objects.all()
    serializer_class = SongsSerializer
    permission_classes = [AllowAny]


class ArtistsListView(generics.ListCreateAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistsSerializer
    permission_classes = [AllowAny]


class ArtistDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistsSerializer
    permission_classes = [AllowAny]


@csrf_exempt
@require_POST
def send_songs(request):
    try:
        data = json.loads(request.body)
        user_id = data.get("id")
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        songs = Songs.objects.all()
        songs_data = []

        for song in songs:
            has_liked = song.like.filter(id=user_id).exists()
            has_dliked = song.dlike.filter(id=user_id).exists()
            no_of_likes = song.like.all().count()

            artists_data = []
            for artist in song.artist.all():
                artists_data.append(
                    {
                        "id": artist.id,
                        "name": artist.user.first_name,
                    }
                )
            songs_data.append(
                {
                    "id": song.id,
                    "song_title": song.title,
                    "song_artist": artists_data,
                    "song_file": str(song.song),
                    "has_liked": has_liked,
                    "has_dliked": has_dliked,
                    "no_of_likes": no_of_likes,
                }
            )

        return JsonResponse({"status": 210, "songs": songs_data})
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def sendPlaylist(request):
    try:
        data = json.loads(request.body)

        user_id = data.get("id")
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        user = User.objects.get(id=user_id)
        fetch_all_playlist = user.playlists.all()

        playlists_data = []

        for playlist in fetch_all_playlist:

            all_songs = playlist.songs.all()
            songs_data = []

            for song in all_songs:
                has_liked = song.like.filter(id=user_id).exists()
                has_dliked = song.dlike.filter(id=user_id).exists()
                no_of_likes = song.like.all().count()

                artists_data = []
                for artist in song.artist.all():
                    artists_data.append(
                        {
                            "id": artist.id,
                            "name": artist.user.first_name,
                        }
                    )
                songs_data.append(
                    {
                        "id": song.id,
                        "song_title": song.title,
                        "song_artist": artists_data,
                        "song_file": str(song.song),
                        "has_liked": has_liked,
                        "has_dliked": has_dliked,
                        "no_of_likes": no_of_likes,
                    }
                )

            playlists_data.append(
                {
                    "id": playlist.id,
                    "playlist_name": playlist.playlist_name,
                    "all_songs": songs_data,
                }
            )
        response_data = {
            "status": 200,
            "playlists": playlists_data,
            "message": "User info successfully extracted",
        }

        return JsonResponse(response_data)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def create_playlist(request):
    try:
        data = json.loads(request.body)
        user_id = data.get("id")
        user = User.objects.get(id=user_id)
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        playlist = Playlist.objects.create(playlist_name="New Playlist", user=user)
        playlist.save()

        return JsonResponse(
            {
                "status": "ok",
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def delete_playlist(request):
    try:
        data = json.loads(request.body)
        playlist_id = data.get("id")
        playlist = Playlist.objects.get(id=playlist_id)
        playlist.delete()

        return JsonResponse(
            {
                "status": 201,
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def alter_playlist(request):
    try:
        data = json.loads(request.body)
        playlist_id = data.get("id")
        playlist = Playlist.objects.get(id=playlist_id)
        
        name = data.get("pl_name")
        if not name == "":
            playlist.playlist_name = name
        
        playlist.save()

        return JsonResponse(
            {
                "status": 201,
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def likes_manage(request):
    try:
        data = json.loads(request.body)
        song_id = data.get("song_id")
        user_id = data.get("user_id")

        if not song_id:
            return JsonResponse({"error": "Song ID is required"}, status=400)
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        song = Songs.objects.get(id=song_id)
        user = User.objects.get(id=user_id)

        has_liked = song.like.filter(id=user_id).exists()

        if has_liked:
            song.like.remove(user)
            action = "removed"
        else:
            song.like.add(user)
            action = "added"

        song.save()
        return JsonResponse({"status": "ok", "action": action})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
@require_POST
def dlikes_manage(request):
    try:
        data = json.loads(request.body)
        song_id = data.get("song_id")
        user_id = data.get("user_id")

        if not song_id:
            return JsonResponse({"error": "Song ID is required"}, status=400)
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        song = Songs.objects.get(id=song_id)
        user = User.objects.get(id=user_id)

        has_dliked = song.dlike.filter(id=user_id).exists()

        if has_dliked:
            song.dlike.remove(user)
            action = "removed"
        else:
            song.dlike.add(user)
            action = "added"

        song.save()
        return JsonResponse({"status": "ok", "action": action})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
@require_POST
def modify_playlist(request):
    try:
        data = json.loads(request.body)
        song_id = data.get("song_id")
        playlist_id = data.get("playlist_id")

        if not song_id:
            return JsonResponse({"error": "Song ID is required"}, status=400)
        if not playlist_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        song = Songs.objects.get(id=song_id)
        playlist = Playlist.objects.get(id=playlist_id)

        is_present = playlist.songs.filter(id=song_id).exists()

        if is_present:
            playlist.songs.remove(song)
            action = "removed"
        else:
            playlist.songs.add(song)
            action = "added"

        playlist.save()
        return JsonResponse({"status": "ok", "action": action})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
@require_POST
def send_nationality(request):
    try:
        nationality = []
        nation = Nationality.objects.all()
        for n in nation:
            nationality.append({"id": n.id, "country_name": n.country_name})
        return JsonResponse({"status": 210, "nationality": nationality})
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def send_language(request):
    try:
        languages = []
        lang = Language.objects.all()
        for n in lang:
            languages.append({"id": n.id, "language": n.language})
        return JsonResponse({"status": 210, "languages": languages})
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def send_all_artists(request):
    try:
        artists = Artist.objects.all()
        artist_data = []
        for art in artists:
            artist_data.append(
                {
                    "id": art.id,
                    "first_name": art.user.first_name,
                    "last_name": art.user.last_name,
                    "email": art.user.email,
                }
            )
        return JsonResponse({"status": "ok", "all_artists": artist_data})
    except Exception as e:
        return JsonResponse({"status": "no"})
