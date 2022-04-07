import json
import celery
from .models import ServerAlerts, UserServers

@celery.signals.task_retry.connect
@celery.signals.task_failure.connect
@celery.signals.task_revoked.connect
def on_failure(**kwargs):
    exec = kwargs.get("exception")
    task_id = kwargs.get("task_id")
    msg = kwargs.get("einfo")
    server_id = kwargs.get("args")[0]
    server = UserServers.objects.filter(id=server_id).first()
    alert = ServerAlerts.objects.create(
        type="server",
        exec=exec,
        msg=msg,
        task_id=task_id,
        server=server
    )
    alert.save()
