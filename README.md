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

`skaffold dev --tail --port-forward`

`minikube dashboard`


### Production

    npm run build

    npm start

### Start minikube cluster

    minikube start -p knative

    minikube tunnel -p knative

### Bind to 0.0.0.0 interface

    proxyboi -l 0.0.0.0:3000 http://myjobplanner-api.default.10.110.225.77.sslip.io