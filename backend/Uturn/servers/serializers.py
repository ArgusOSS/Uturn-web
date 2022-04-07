from django.forms import ValidationError
from rest_framework import serializers
from .models import ServerAlerts, UserProjectCommits, UserServerProjects, UserServers
import re

class UserServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserServers
        fields = [
            'id', 
            'OS', 
            'IP', 
            'created_at', 
            'uturn_server_url', 
            'token'
        ]

class ServerProjectUserSerializer(serializers.ModelSerializer):
    """
        Checks if the project exists with the server 
        the user is trying to access exists and is 
        owned by them at the same time.
    """
    id = serializers.IntegerField()

    class Meta:
        model = UserProjectCommits
        fields = [
            'id',
        ]

    def validate(self, attrs):
        id = attrs.get('id', '')
        user = self.context.get('user')

        try:
            project = UserServerProjects.objects.filter(id=id).first()
            server = project.server
            if server.owner != user:
                raise serializers.ValidationError(
                    "You don't own the project this server belongs to."
                )
            server_id = server.id
            print(server.id)
        except AttributeError:
            raise serializers.ValidationError(
                "Invalid id."
            )

        server = UserServers.objects.filter(
            id=server_id,
            owner=user
        ).first()

        print(server)
    
        attrs['server_id'] = server.id
        attrs['project_name'] = project.name
        attrs['server_url'] = project.server.uturn_server_url
        attrs['server_token'] = project.server.token
        
        return attrs

class FetchAlertsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerAlerts
        fields = [
            'id',
            'service',
            'type',
            'exec',
            'msg',
            'server',
            'task_id'
        ]

class FetchCommitsSerializer(serializers.ModelSerializer):
    """
        For validation of the Fetch commits API
    """
    id = serializers.IntegerField()
    # ^ id of the project

    class Meta:
        model = UserProjectCommits
        fields = [
            'id',
            'msg',
            'author_name',
            'author_email',
            'project',
            'date',
            'shahash'
        ]

    def validate(self, attrs):
        id = attrs.get('id', None)
        project = UserProjectCommits.objects.filter(
            id=id
        ).first()

        if not project:
            raise serializers.ValidationError(
                "Invalid Project Id"
            )

        return attrs

class RollbackCommitSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    shahash = serializers.CharField()

    class Meta:
        model = UserProjectCommits
        fields = ['id','shahash']

    def validate(self, attrs):
        shahash = attrs.get("shahash", None)
        commit = UserProjectCommits.objects.filter(shahash=shahash).first()
        if commit is None:
            raise serializers.ValidationError(
                "A commit with that shahash doesn't exist."
            )

        return attrs

class ServerUserSerializer(serializers.ModelSerializer):
    """
        Checks if the server the user is trying to access
        exists and is owned by them at the same time.
    """

    id = serializers.IntegerField()

    class Meta:
        model = UserServers
        fields = ['id']

    def validate(self, attrs):
        id = attrs.get('id', '')
        user = self.context.get('user')
        server = UserServers.objects.filter(
            id=id,
            owner=user
        ).first()
    
        if server is None:
            raise serializers.ValidationError(
                "Server with that ID doesn't exist."
            )
        
        return attrs

class ServerInfoSerializer(serializers.ModelSerializer):
    uturn_server_url = serializers.CharField(max_length=225)
    token = serializers.CharField(min_length=10, max_length=225)

    class Meta:
        model = UserServers
        fields = ['uturn_server_url', 'token']

    def validate(self, attrs):
        uturn_server = attrs.get('uturn_server_url', '')
        if bool(
            re.match(r"(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})", uturn_server)) is False:
            raise serializers.ValidationError(
                "Invalid uturn_server_url"
            )
        
        return attrs