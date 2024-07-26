# serializers.py
from rest_framework import serializers
from .models import Songs, Artist, Language, Nationality

class SongsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Songs
        fields = '__all__'

class ArtistsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'