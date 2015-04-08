# rest-engine
REST API engine and toolkit that bundles [restify](https://www.npmjs.com/package/restify), [nconf](https://www.npmjs.com/package/nconf),[mongoose](), and utilities
that help aid in spinning up an API in Node.js

The MIT License (MIT) Copyright (c) 2015 Taylor Kisor-Smith

### Why?
I wanted the separation of concerns between route handlers (controllers) and the explicit route, along with a standard way
to develop APIs without having to manually do [this](http://mcavage.me/node-restify/#routing). AUTOMATE WHEN POSSIBLE!

### How does it work?

####Usage

```javascript
engine.bootstrap({
    name: 'muber',
    version: '0.1.0'
}, null, function () {
    console.log('Server is online...');
});
```

rest-engine bootstraps onto Node.js projects that follow a few conditions:

####Structure
```
/app
|   /controllers
|
/config
|
|   /environments
|
```
Within ```config/environments``` there should be a ```default.json```

####default.json
A projects ```default.json``` should explicitly define a ```VERSION```, ```SERVER_PORT```, & ```RESOURCES```
* ```Version``` is a symbolic version to be prepended in front of an API request, i.e.:
    ``` { "VERSION": "v1" }``` GET /v1/<resource>
* ```SERVER_PORT``` the port for the server to listen on.
* ```RESOURCES``` an object that links desired URI's to resources and the appropriate controller and its methods.
    * See ```./core/router``` to see how the linking occurs
    * a resource contains a controller property and a routes object, this is where the HTTP method is mapped to controller function.

Ex. used by [muber-api](https://github.com/t4ks/muber):
```javascript
{
  "VERSION": "v1",
  "SERVER_PORT": 8080,
  "RESOURCES": {
    "STOP": {
      "CONTROLLER": "stops",
      "ROUTES": {
        "/stops": [
          {
            "METHOD": "GET",
            "VALUE": "getMany"
          }
        ],
        "/stops/:id": [
          {
            "METHOD": "GET",
            "VALUE": "getOne"
          }
        ]
      },
      "ERRORS": {
        "400.0": {
          "message": "Invalid stop id.",
          "http": 400
        },
        "400.1": {
          "message": "Invalid query params: Expected both longitude and latitude",
          "http": 400
        },
        "400.2": {
          "message": "Invalid query params: Expected numbers",
          "http": 400
        },
        "400.3": {
          "message": "Query Parameter: 'distance' exceeds the max.",
          "http": 400
        },
        "404.0": {
          "message": "Stop could not be found",
          "http": 404
        },
        "500.0": {
          "message": "Internal Database Error: Stops",
          "http": 500
        }
      }
    },
    "DEPARTURE": {
      "CONTROLLER": "departures",
      "ROUTES": {
        "/stops/:id/departures": [
          {
            "METHOD": "GET",
            "VALUE": "getForStop"
          }
        ]
      },
      "ERRORS": {
        "500.0": {
          "message": "Service request failed",
          "http": 500
        },
        "502.0": {
          "message": "Unexpected upstream request failure",
          "http": 502
        }
      }
    }
  }
}
```

###Other configurations
```"DB_URI"``` does not necessarily need to be defined in ```default.json```, as long as it is defined in an environmental config file
rest-engine will be able to use mongoose without manual code declarations.
