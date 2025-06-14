from .userTasks import timeCheckUp
from .warningCheckUp import warningCheckUp
def distributor(scheduler, bot):
    scheduler.add_job(warningCheckUp, trigger='interval', seconds=60, kwargs={'bot': bot})
    scheduler.add_job(timeCheckUp, trigger='interval', seconds=60, kwargs={'bot': bot})