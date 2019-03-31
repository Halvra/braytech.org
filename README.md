# Braytech
_The source code of braytech.org_

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1.  https://nodejs.org: We use Node to run a development web server and build the project.
    Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    npm install


To start the app running on the default port of 3000 run: 
    
    npm start


The `npm run` command will list all of the scripts available to run for this project.

## Developement and deployment with Docker

First install docker: 

1. https://docs.docker.com/install/

To build the application and run the application on the default port 3000 then run the following: 

     docker-compose up --build
     
The application will then be accesible from localhost:3000

To background the command append -d 

    docker-compose up -d --build
  
To inspect running containers run: 
    
    docker ps -a

You should see something similar to:

```
[centos@ip-192-168-0-1 braytech.org]$ docker ps -a
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS                     PORTS                    NAMES
9ee0b7671ea2        braytechorg_braytech_org        "npm start"              14 minutes ago      Up 14 minutes              0.0.0.0:3000->3000/tcp   braytech_org
```

    
