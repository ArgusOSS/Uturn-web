from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .serializers import FetchAlertsSerializer, FetchCommitsSerializer, RollbackCommitSerializer, ServerInfoSerializer, ServerProjectUserSerializer, ServerUserSerializer, UserServerSerializer
from .models import UserProjectCommits, UserServerProjects, UserServers, ServerAlerts
from .tasks import rollbackToCommit, verifyconnection, refreshProjects, refreshProjectCommits

class CheckServerOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class CheckProjectOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        id = view.kwargs.get("id")
        project = UserServerProjects.objects.filter(id=id).first()
        if project:
            server = project.server
            owner = server.owner
            return obj.owner == owner
        return False

class CheckCommitProjectOwnerPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        shahash = view.kwargs.get("shahash")
        commit = UserProjectCommits.objects.filter(shahash=shahash).first()
        if commit:
            project = commit.project
            server = project.server
            return request.user == server.owner

        return False

class ProjectsForServerView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServerUserSerializer

    def get(self, request):
        serializer = self.serializer_class(data=request.GET, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        id = serializer.validated_data.get("id")
        server = UserServers.objects.filter(id=id).first()
        projects = UserServerProjects.objects.filter(server=server)

        response = []

        for project in projects:
            response.append(
                {
                    "id": project.id,
                    "server_id": project.server.id,
                    "name": project.name,
                    "branch": project.branch
                }
            )
        return Response(
            response,
            status=status.HTTP_200_OK
        )

class FetchProjectCommitsView(generics.ListAPIView):
    permission_class = [permissions.IsAuthenticated, CheckProjectOwnerPermission]
    serializer_class = FetchCommitsSerializer
    lookup_field = 'id'
    url_kwarg = 'id'
    # ^ ID of the project

    def get_queryset(self):
        id = self.kwargs.get("id")
        project = UserServerProjects.objects.filter(id=id).first()
        queryset = UserProjectCommits.objects.filter(
            project=project
        )
        return queryset

class ServerRetrieveView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, CheckServerOwnerPermission]
    serializer_class = UserServerSerializer
    lookup_field = 'id'
    queryset = UserServers.objects.all()
    url_kwarg = 'id'

class RefreshCommitsView(generics.GenericAPIView):
     permission_classes = [permissions.IsAuthenticated]
     serializer_class = ServerProjectUserSerializer

     def get(self, request):
        serializer = self.serializer_class(
             data=request.GET,
             context={
                 'user': request.user
             }
         )
        serializer.is_valid(raise_exception=True)

        server_id = serializer.validated_data.get("server_id")
        project_id = serializer.validated_data.get("id")
        server_url = serializer.validated_data.get("server_url")
        token = serializer.validated_data.get("server_token")
        project_name = serializer.validated_data.get("project_name")

        refreshProjectCommits.apply_async(
            [
                server_id,
                server_url,
                token,
                project_name,
                project_id,
            ]
        )

        return Response(
            {
                "status": "success", 
                "meta": "Commit information would be refreshed in a bit"
            }, 
                status=status.HTTP_200_OK
        )


class RefreshServerProjectsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServerUserSerializer

    def get(self, request):
        serializer = self.serializer_class(data=request.GET, context={'user': request.user})
        serializer.is_valid(raise_exception=True)

        id = serializer.validated_data.get("id")
        server = UserServers.objects.get(
            id=id
        )
        refreshProjects.apply_async(
            [
                id,
                server.uturn_server_url, 
                server.token, 
            ]
        )
        return Response(
                {
                    "status": "success", 
                    "meta": "Project information would be refreshed in a bit"
                }, 
                status=status.HTTP_200_OK
            )

class RollbackToCommitView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated, 
        CheckProjectOwnerPermission
    ]

    serializer_class = RollbackCommitSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        id = serializer.validated_data.get("id")
        shahash = serializer.validated_data.get("shahash")
        server_id = UserServerProjects.objects.filter(id=id).first().server.id
        rollbackToCommit.apply_async(
            [
                server_id,
                id,
                shahash
            ]
        )

        return Response(
            {
                "status": "success", 
                "meta": "Server would be verified in a bit"
            }, 
            status=status.HTTP_200_OK
        )


class ServerInfoView(generics.GenericAPIView):
    serializer_class = ServerInfoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = self.serializer_class(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )
        
        uturn_server_url = request.data.get("uturn_server_url")
        token = request.data.get("token")

        server = UserServers.objects.create(
            owner=request.user,
            token=token,
            uturn_server_url=uturn_server_url)

        server.save()
        id = server.id
        verifyconnection.apply_async(
            [
                id,
                uturn_server_url,
                token,
            ]
        )

        return Response(
            {
                "status": "success", 
                "meta": "Server would be verified in a bit"
            }, 
            status=status.HTTP_200_OK
        )

    def get(self, request):
        user = request.user
        servers_owned = UserServers.objects.filter(
            owner = user.id
        )

        server_data = []
        for server in servers_owned:
            if server.verified:
                server_data.append(dict(
                id=server.id,
                OS=server.OS,
                IP=server.IP,
                created_at=server.created_at,
                last_updated=server.updated_at
            ))

        return Response(
            server_data, 
            status=status.HTTP_200_OK
        )

class FetchAlertsView(generics.ListAPIView):
    serializer_class = FetchAlertsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ServerAlerts.objects.all()