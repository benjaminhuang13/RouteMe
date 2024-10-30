# Docker Commands

The period at the end tells the command to search for the Dockerfile in the same directory
`docker build -t benjhg13/proj2-test:0.0.2 .`

choose which ports
`docker container run -d -p 8800:8000 benjhg13/proj2-test:0.0.1`

`docker container ls`

`docker container stop f43249fc4443`

### Secret Files in Docker Builds

- https://docs.render.com/docker-secrets#:~:text=Secret%20Files%20in%20Docker%20Builds&text=will%20print%20the%20content%20of,that%20requires%20the%20secret%20file.
- Didn't use this: https://blog.taskforce.sh/building-docker-images-in-ci-using-a-secret/
