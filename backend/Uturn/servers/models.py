from django.db import models
from jsonfield import JSONField
from authentication.models import User

class UserServers(models.Model):
    OS = models.CharField(max_length=100, null=True)
    IP = models.CharField(max_length=15, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    uturn_server_url = models.CharField(max_length=225)
    token = models.CharField(max_length=225)
    verified = models.BooleanField(default=False)

    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{str(self.owner)}'s  {str(self.OS)} {str(self.IP)}"

class UserServerProjects(models.Model):
    name = models.CharField(null=False, max_length=225)
    path = models.TextField(null=False)
    branch = models.TextField(null=False)
    
    # Git branch has a limit of 28 characters.

    server = models.ForeignKey(to=UserServers, on_delete=models.CASCADE)

    def __str__(self):
        return f"{str(self.name)} {str(self.branch)}"

class UserProjectCommits(models.Model):
    msg = models.TextField(null=True)
    author_name = models.TextField(null=True)
    author_email = models.EmailField(null=True)
    date = models.CharField(max_length=1000)
    shahash = models.CharField(max_length=40)

    project = models.ForeignKey(to=UserServerProjects, on_delete=models.CASCADE)

class UserProjectBranches(models.Model):
    name = models.TextField(null=False)
    project = models.ForeignKey(to=UserServerProjects, on_delete=models.CASCADE)

class ServerAlerts(models.Model):
    service = models.CharField(max_length=225, null=True)
    type = models.CharField(max_length=225)
    exec = models.CharField(max_length=225)
    msg = models.TextField()
    server = models.ForeignKey(
        to=UserServers,
        on_delete=models.CASCADE
    )

    task_id = models.CharField(max_length=225, null=True)
    # ^ Only if celery is involved.