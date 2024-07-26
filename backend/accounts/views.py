import json
from django.http import JsonResponse
from django.shortcuts import render
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from songs.models import Artist
from .serializers import UpdateUserSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from songs.models import Artist, Nationality, FriendRequest, Friends


class UserView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            user_instance = User.objects.get(id=request.data.get("id"))
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        if (
            request.data.get("date_of_birth") != ""
            and request.data.get("nationality") != ""
            and not user_instance.is_artist
        ):
            try:
                nationality = Nationality.objects.get(
                    id=request.data.get("nationality")
                )
            except Nationality.DoesNotExist:
                return Response(
                    {"error": "Nationality not found"}, status=status.HTTP_404_NOT_FOUND
                )

            artist, created = Artist.objects.get_or_create(
                user=user_instance, date_of_birth=request.data.get("date_of_birth")
            )
            artist.nationality.set([nationality])
            artist.save()

        user_serializer = UpdateUserSerializer(user_instance, data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse({"status": 201})
        else:
            print("error", user_serializer.errors)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class send_user_info(APIView):

    def post(self, request, *args, **kwargs):
        try:
            user_id = request.data.get("id")
            if not user_id:
                return JsonResponse({"error": "User ID is required"}, status=400)
            user = User.objects.get(id=user_id)

            is_artist = user.is_artist
            if is_artist:
                artist = Artist.objects.get(user=user)
                national = artist.nationality.all()
                nation = []
                for nat in national:
                    nation.append({"id": nat.id, "country_name": nat.country_name})
                friendReq = user.user_req2.all()
                frnds = user.user1.all()
                req = []
                friends = []
                for requ in friendReq:
                    req.append(
                        {
                            "id": requ.first_user.id,
                            "first_name": requ.first_user.first_name,
                            "last_name": requ.first_user.last_name,
                            "profile_image": requ.first_user.profile_image.url,
                        }
                    )

                for fr in frnds:
                    friends.append(
                        {
                            "id": fr.second_user.id,
                            "first_name": fr.second_user.first_name,
                            "last_name": fr.second_user.last_name,
                            "profile_image": fr.second_user.profile_image.url,
                        }
                    )
                user_data = {
                    "profile_image": user.profile_image.url,
                    "is_artist": is_artist,
                    "date_of_birth": artist.date_of_birth,
                    "nationality": nation,
                    "frnd_req": req,
                    "friends": friends,
                }
            else:
                friendReq = user.user_req2.all()
                frnds = user.user1.all()
                req = []
                friends = []
                for requ in friendReq:
                    req.append(
                        {
                            "id": requ.first_user.id,
                            "first_name": requ.first_user.first_name,
                            "last_name": requ.first_user.last_name,
                            "profile_image": requ.first_user.profile_image.url,
                        }
                    )

                for fr in frnds:
                    friends.append(
                        {
                            "id": fr.second_user.id,
                            "first_name": fr.second_user.first_name,
                            "last_name": fr.second_user.last_name,
                            "profile_image": fr.second_user.profile_image.url,
                        }
                    )
                user_data = {
                    "profile_image": user.profile_image.url,
                    "is_artist": is_artist,
                    "frnd_req": req,
                    "friends": friends,
                }

            return JsonResponse({"status": 210, "user_data": user_data})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_POST
def searchUsers(request):
    users = User.objects.all()
    matchedUsers = []
    try:
        data = json.loads(request.body)
        query = data.get("query")
        for usr in users:
            if (
                query in usr.get_full_name
                or query in usr.first_name
                or usr.first_name in query
                or query in usr.last_name
                or usr.last_name in query
                or query in usr.email
            ):
                matchedUsers.append(
                    {
                        "id": usr.id,
                        "first_name": usr.first_name,
                        "last_name": usr.last_name,
                        "profile_image": usr.profile_image.url,
                        "is_artist": usr.is_artist,
                    }
                )
        return JsonResponse({"status": 201, "matched_users": matchedUsers})

    except Exception as e:
        return JsonResponse({"status": "no"})


@csrf_exempt
@require_POST
def sendAccount(request):
    try:
        data = json.loads(request.body)
        user_id = data.get("user_id")
        user_id_sender = data.get("user_id_sender")
        user = User.objects.get(id=user_id)
        userSender = User.objects.get(id=user_id_sender)
        req = FriendRequest.objects.filter(
            first_user=userSender, second_user=user
        ).exists()
        reqSender = FriendRequest.objects.filter(
            second_user=userSender, first_user=user
        ).exists()
        friend = (
            Friends.objects.filter(first_user=userSender, second_user=user).exists()
            or Friends.objects.filter(second_user=userSender, first_user=user).exists()
        )

        matchedUsers = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "profile_image": user.profile_image.url,
            "is_artist": user.is_artist,
            "frnd_request": req,
            "frnd_request_sender": reqSender,
            "frnd": friend,
        }

        return JsonResponse({"status": 201, "send_account": matchedUsers})

    except Exception as e:
        return JsonResponse({"status": "no"})



@csrf_exempt
@require_POST
def modifyFriendRequest(request):
    try:
        data = json.loads(request.body)

        user_id1 = data.get("user_id1")
        user1 = User.objects.get(id=user_id1)

        user_id2 = data.get("user_id2")
        user2 = User.objects.get(id=user_id2)

        action = data.get("action")



        if action == "create":
            req = FriendRequest.objects.create(first_user=user1, second_user=user2)
            req.save()
        elif action == "accepted":
            req = FriendRequest.objects.get(first_user=user2, second_user=user1)
            create_friend1 = Friends.objects.create(first_user=user1, second_user=user2)
            create_friend1.save()
            create_friend2 = Friends.objects.create(first_user=user2, second_user=user1)
            create_friend2.save()
            req.delete()
        elif action == "rejected":
            req = FriendRequest.objects.get(first_user=user2, second_user=user1)
            req.delete()
        elif action == "remove":
            req = FriendRequest.objects.get(first_user=user1, second_user=user2)
            req.delete()
        elif action == "unfollow":
            req1 = Friends.objects.get(first_user=user1, second_user=user2)
            req1.delete()
            req2 = Friends.objects.get(first_user=user2, second_user=user1)
            req2.delete()
        


        return JsonResponse({"status": 201})

    except Exception as e:
        return JsonResponse({"status": "no"})
