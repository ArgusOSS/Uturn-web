from django.urls import path

from .views import ProjectsForServerView, RefreshServerProjectsView, \
    ServerInfoView, ServerRetrieveView, RefreshCommitsView, FetchProjectCommitsView, \
    RollbackToCommitView, FetchAlertsView

urlpatterns = [
    path('info/', ServerInfoView.as_view(), name="ServerInfo"),
    path('find/<int:id>', ServerRetrieveView.as_view(), name="ServerViewSet"),
    path('projects/refresh/', RefreshServerProjectsView.as_view(), name="RefreshProjects"),
    path('projects/commits/refresh/', RefreshCommitsView.as_view(), name="RefreshCommits"),
    path('projects/commits/rollback/', RollbackToCommitView.as_view(), name="RollbackToCommit"),
    path('projects/commits/<int:id>', FetchProjectCommitsView.as_view(), name="FetchCachedCommits"),
    path('projects/', ProjectsForServerView.as_view(), name="ProjectInfo"),
    # ^ here 'id' is that of the owner server.
    path('alerts/', FetchAlertsView.as_view(), name="FetchAlerts")
]
