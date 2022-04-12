<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnANZz2V7ZWIsbyjtJzH4zw2B-LQObn06ziQ&usqp=CAU" height=150 alt="Uturn"/>
  

![image](https://img.shields.io/badge/Release-0.0.1-orange?style=for-the-badge&logo=appveyor)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge&logo=appveyor)](https://github.com/UturnOSS/uturn-web/graphs/commit-activity)
![Linux](https://img.shields.io/badge/For-Linux-green?style=for-the-badge&logo=appveyor)
[![GitHub forks](https://img.shields.io/github/forks/Naereen/StrapDown.js.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/Naereen/StrapDown.js/network/)
[![GitHub stars](https://img.shields.io/github/stars/Naereen/StrapDown.js.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/Naereen/StrapDown.js/stargazers/)


# Uturn

**Uturn** is a web framework to rollback and auto deploy services in one click.

### Context

Uturn Web is the part which is supposed to be deployed at a server separate from your active exposed infrastructure. It is supposed to be an internal tool to help manage servers better.

### Getting started

<code>
  sudo docker-compose up
</code>

Now, to create a user do the following:

<code>
  docker exec -it uturn_backend python3 manage.py createsuperuser
</code>

Use this user when you are trying to login. You would require to setup [Uturn CLI](https://github.com/UturnOSS/Uturn-CLI) on your infrastructure to start adding servers to continue smoothly.
