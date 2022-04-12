There are many startups run by single-very-burnt-out engineers who are managing all of the infrastructures. The problem they come across is that of lack of proper DevOps and proper QA testing because they don't have either a QA tester or a DevOps engineer. If a client wants a particular feature then they have to provide that feature in time no matter what. This again, Leads to often bad testing practices taking place (Like testing in production :P etc).

Let's say, one of these bad practices followed leads to your frontend messing up really bad or one of your critical backend API endpoints just stops working, that too right after you push a commit you didn't test properly. Then what would you do?

You would take a U-turn and roll back to the commit that you know is the stablest and works properly. This web framework just makes that easy for you. It rolls back to the commit you select and automatically restarts your services, All with a single click.

Then there is the problem of too many alerts.

If you're security-conscious and use a security monitoring service that gives you automatic alerts, or use sentry in your organization to log errors so that you can work with other developers more nicely, or if you use Zabbix to get alerts right before your server is about to crash

All these alerts might just be too much for you to handle. The vision for Uturn is to build something that also serves as a single point for all these alerts to come and then to be propagated later as per your wish.

As of now, Uturn just shows the logs for failed celery tasks of its own. That too is necessary because the main web framework is supposed to be hosted at a different server than the rest of your main infrastructure in an ideal condition assuming your infrastructure might go down anytime (i have seen my place of work have these growing pains while we are scaling up so i need to careful) But soon enough space for the mentioned would be left more open as well.
