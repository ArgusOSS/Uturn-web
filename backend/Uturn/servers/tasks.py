from Uturn.celery import app
from .celery_utility import on_failure
from .models import UserProjectBranches, UserProjectCommits, UserServerProjects, UserServers
import requests

@app.task(bind=True, autoretry_for=(Exception,), retry_backoff=2)
def verifyconnection(
    self,
    server_id: int,
    url: str,
    token: str,
    on_failure=on_failure):
    
    r = requests.get(
        url+"/verifyconnection", 
        headers={
            "uturn-access-key": token
        },)
    if r.status_code == 403:
        raise Exception("Unauthorised")

    json_res = r.json()
    OS = json_res.get("OS")
    IP = json_res.get("IP")
    if OS is None:
        raise Exception("OS not sent back")
    Server = UserServers.objects.get(id=server_id)
    Server.OS = OS
    Server.IP = IP
    Server.verified = True
    Server.save(
        update_fields=[
            'OS',
            'IP',
            'verified'
        ]
    )

@app.task(bind=True, autoretry_for=(ConnectionError, TimeoutError), retry_backoff=2)
def rollbackToCommit(
    self,
    server_id: int,
    project_id: int,
    shahash: str,
    on_failure=on_failure):

    project = UserServerProjects.objects.filter(id=project_id).first()
    project_name = project.name
    server = project.server
    url = server.uturn_server_url
    token = server.token
    
    r = requests.get(
        url + "/rollback",
        params={
            "hash": shahash,
            "name": project_name
        },
        headers={
            "uturn-access-key": token
        }
    )
    if r.status_code == 403:
        raise Exception("Unauthorised")

@app.task(bind=True, autoretry_for=(ConnectionError, TimeoutError), retry_backoff=2)
def refreshProjectCommits(
    self,
    server_id: int,
    url: str,
    token: str,
    project_name: str,
    project_id: int,
    on_failure=on_failure):

    r = requests.get(
        url + "/commits",
        params={
            "name": project_name,
        },
        headers={
            "uturn-access-key": token
        }
    )
    if r.status_code == 403:
        raise Exception("Unauthorised")

    json_res = r.json()
    project = UserServerProjects.objects.filter(id=project_id).first()
    for i in json_res:
        commit = UserProjectCommits.objects.create(
            msg=i.get("msg"),
            author_name=i.get("author_name"),
            author_email=i.get("author_email"),
            date=i.get("date"),
            shahash=i.get("hash"),
            project=project
        )
        commit.save()    

@app.task(bind=True, autoretry_for=(ConnectionError, TimeoutError), retry_backoff=2)
def refreshProjects(
    self,
    server_id: int,
    url: str,
    token: str,
    on_failure=on_failure):

    r = requests.get(
        url+"/projects",
        headers={
            "uturn-access-key": token
        }
    )
    if r.status_code == 403:
        raise Exception("Unauthorised")
    
    json_res = r.json()

    Server = UserServers.objects.filter(id=server_id).first()
    projects = UserServerProjects.objects.filter(server=Server)

    for project in projects:
        branches = UserProjectBranches.objects.filter(project=project)
        for branch in branches:
            branch.delete()
        project.delete()
    
    for i in json_res:
        name = i.get("name")
        details = i.get("details")
        project = UserServerProjects.objects.create(
            name=name,
            path=details.get('path'),
            branch=details.get('branch'),
            server=Server
        )
        project.save()

        r = requests.get(
            url+"/branches",
            params={
                "name": project.name,
            },
            headers={
                "uturn-access-key": token
            }
        )
        if r.status_code == 403:
            raise Exception("Unauthorised")
        
        branch_data = r.json()
        for branch in branch_data:
            branch_obj = UserProjectBranches.objects.create(
                name=branch,
                project=project
            )
            branch_obj.save()