# cloudfdairy demo application
## 3-tier application on kubernetes cluster

We are going to deploy the following architecture:
```
,-----.  ,---.
|front|  |bff|
|-----|  |---|
`-----'  `---'


  ,-----.   ,-----------.
  |docdb|   |randomnames|
  |-----|   |-----------|
  `-----'   `-----------'
```

### front
A static single-page application built with vite
### bff
Our API server, exposed to interrnet incoming requests
### randomnames
A demo microservice, has only in-cluster access that provides random user names
### docdb
MongoDB instance

## Hardcoded values (for demo purposes)
### front
points to "bff.localhost:8000"
### bff
Hardcoded environment variable names:
- DB_HOST
- DB_PORT
- RN_HOST
- RN_PORT
- The mongo user and password (admin, pass)
### docdb
- MONGO_INITDB_ROOT_USERNAME=admin
- MONGO_INITDB_ROOT_PASSWORD=pass

# Steps to run demo

## 1. Install cloudfairy
`npm i -g @cloudfairy/cli`

## 2. Initialize a new project
`fairy init`

## 3. Install missing tools
- brew
- k3d
- openTofu/terraform
- terragrunt

`fairy tools check`

`fairy tools install <missing tool>`

## 4. Start the visual editor
`fairy devtool`

Drag and drop a "public website"
configure it to work locally for *dev* environments:
name it "front" or "frontend", or whatever makes sense.
- Artifact folder: ./apps/frontend/dist

Drag and drop "Application or service"
name it "bff" (our artifact is looking for "bff")
configure "expose to internet" to true
configure port to 8081
> No need to set environment variable, cloudfairy will help us later with that

Drag and drop "Application or service"
name it "randomnames" or whatever makes sense.
configure "expose to internet" to false (default value)
configure port to 8082

Drag and drop "Docker from dockerhub"
name it "database" or "docsdb" or whatever makes sense
confgure the image to "mongo"
configure the port to 27017
configure expose to internet access to false (or 0)
configure environment variables to `MONGO_INITDB_ROOT_USERNAME=admin,MONGO_INITDB_ROOT_PASSWORD=pass`
> No whitesspace after comma!

Connect bff to random names service
Connect bff to database
Open bff properties.
Configure the database connection variable names to:
- DB_HOST
- DB_PORT

Configure the random names connection variable names to:
- RN_HOST
- RN_PORT

## 5. Deploy to local environment
On the top-right side, open the action menu and choose "deploy".
We are expecting either a terminal screen reveals logs, or the logs will be printed in our terminal, where the process "fairy devtool" is running.

The process takes a few mintues.

### What's going on?
Cloudfairy scaffolds a terragrunt project structure based on our requirements, pulls the relevant terraform modules from the cloudfairy demo library and starts provisioning everything on our local machine.

K3D is being used to provision a local lightweight kubernetes cluster, then the rest of the modules provision the application stack required.

We can later on deploy it to GCP, Azure or Digital Ocean.
AWS is work in progress and still incomplete.

Any building block (or cloudfairy module) can be extended to support more cloud providers.

Let's test our application
The default port of our kubernetes load balancer is 8000.

### Static site
The client needs to be built first.
In `apps/frontend` folder, run "npm install" (or "yarn"). Once ready, let's build the artifact: `npm run build` or `yarn build`. We expect a dist folder to contain our single page application artifact.
Cloudfairy automatically shares this folder to the cluster so it would be server from within the cluster.
For cloud providers it will provision a static bucket, or storage account, and we then need to push the artifact to the target storage.

### API Server
In `apps/webserver` folder we need to build the docker and push it to our local registry.
`docker build -t localhost:5001/bff:dev .`
and then
`docker push localhost:5001/bff:dev`

### Random names microservice
We repeat the process similar to the API server.
The folder is `apps/randomnames`.
Build the docker container and make sure the name matches the name as appears in our diagram. The tag should be "dev".

### Database
Since pulled from dockerhub, it should already be running now

### Respawn the pods
with kubectl (or k9s) delete the bff and random-names pods. Kubernetes will pull the image now and create the proper containers.

Soon our API will connect to the database service, and will have access to our microservice as the environment variables are already injected.

Assuming we named the public website "frontend" - we can browse to "http://frontend.localhost:8000"

Select "register" and see that random names already provides a random name for the API server as a suggestion.
The API server will store your data using the mongo as database.

# Next steps
- TBD: Tutorials for building your own modules, such as managed services, existing resources, etc.
- TBD: How to use addons and the plugin system to provision argoCD artifacts alongside the infrastructure.
- TBD: How to resolve the missing dependencies (such as cluster, network, etc) so we can manually configure it, or use our own modules with cloudfairy.
- TBD: More tutorials

# Add external for fun and profit
Name: mongoui
Image: `mongo-express`
Port: 8081
Expose to ingress `true`
Env: `ME_CONFIG_BASICAUTH_USERNAME=admin,ME_CONFIG_BASICAUTH_PASSWORD=pass,ME_CONFIG_MONGODB_ADMINUSERNAME=admin,ME_CONFIG_MONGODB_ADMINPASSWORD=pass`
Connect to mongo:
- ME_CONFIG_MONGODB_SERVER
- ME_CONFIG_MONGODB_PORT

browse to mongoui.localhost:8000
user=admin
password=pass