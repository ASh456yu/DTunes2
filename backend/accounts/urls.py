from django.contrib import admin
from django.urls import path, include
from .views import send_user_info, UserView, searchUsers, sendAccount, modifyFriendRequest


urlpatterns = [
    path("send_user_info/", send_user_info.as_view(), name="send_user_info"),
    path("update_user/", UserView.as_view(), name="update_user"),
    path("search_user/", searchUsers, name="search_user"),
    path("send_account/", sendAccount, name="send_account"),
    path("modify_frnd_request/", modifyFriendRequest, name="modify_frnd_request"),
]
