# RouteMe

This is a fullstack app that allows you to submit/save multiple addresses and output the optimal route (via Google Maps API). For the front end this app uses HTML, CSS, JavaScript. For the back end it uses NodeJS, ExpressJS. Each branch shows a different way to deploy this full stack app.

This is deploying using GitHub Actions, Docker, ECR, ECS, Service Connect.

![diagram](https://github.com/benjaminhuang13/RouteMe/blob/3_aws_serverless/diagram.png?raw=true)

# GitHub Actions

- How to build Gitlab Action to deploy image to ECR: https://plainenglish.io/community/build-push-docker-image-to-aws-ecr-using-github-actions
- How to create dockerfile https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker#step-3-writing-the-dockerfile

# ECS

https://catalog.us-east-1.prod.workshops.aws/workshops/8c9036a7-7564-434c-b558-3588754e21f5/en-US/02-setup

# Service Connect

# Google API Permissions

1. Create one API key for frontend. Click the Actions (3 dots) and click `Edit API Key` Restrict the key to `Websites` and add your domain ( benyellow.com, https://www.benyellow.com/). Restrict the key to APIs:
   Geocoding API
   Geolocation API
   Maps Embed API
   Maps JavaScript API
   Maps Static API
   Routes API
   Route Optimization API
   Places API
   Roads API
   Maps SDK for iOS
   Maps SDK for Android
   Directions API
   Distance Matrix API

2. Create another API key for the backend. Do the same and restrict the key to `IP addresses` and add your EC2 public IP. Restrict the key to the same APIs.
