# myJobPlanner API

This is the myJobPlanner API. You need `Node.js` to run it.

## Usage

### Setup

`npm install`

### Development

`npm run dev`

### Test

`npm test`

### Skaffold

`npm run skaffold`

`minikube dashboard`


### Production

    npm run build

    npm start

### Start minikube cluster

    minikube start -p knative

    minikube tunnel -p knative

    minikube ssh -p knative -- docker system prune --all

### Bind to 0.0.0.0 interface

    proxyboi -l 0.0.0.0:3000 --upstream-header="Host:myjobplanner-api.default.10.110.225.77.sslip.io" http://myjobplanner-api.default.10.110.225.77.sslip.io