Scalable Websockets System Design

NestJS - Node.js framework for building efficient, reliable and scalable server-side applications
Redis - to communicate with other instances and for messaging service
Docker - to simulate multiple instances
socket.io library to be used in both server and client side



Setting up Redis
First we setup redis using docker

docker run --name poc-redis -p 6379:6379 -d redis
 
This will start a docker container with redis installed and map port 6379 from host machine to docker container


Setting up NodeJS Server
We will setup nodejs server with using NestJS framework as it is completely built with Typescript and has good support for microservices, modules, integration with other libraries
https://nestjs.com



Adding libraries
We will mainly add two libraries
socket.io - for maintaining websocket connections with client
ioredis - full featured redis client for NodeJS

npm install --save socket.io ioredis
npm install --save-dev @types/socket.io @types/ioredis



Understanding Working of Websockets

We are going to use websockets because we want to exchange messages between client and server in near realtime

So we need to open a connection between client and server which will remain alive for exchanges of messages. In order to do that we can utilize browsers Websocket API or we can use a library to ease maintenance of that connection. We will use the same library as we are using in backend (socket.io). After the connection is open we can then listen for messages from the server and send messages to the server or vice-versa.

Suppose we have only one server which handles this job of websockets and many clients are connected 



Here we have 3 clients (C1, C2, C3)  and have active socket connection with S1, Now suppose C1 does some action which we need to inform C2

C1 sends some data to server to perform and now server needs to send some information to C2, but for that Server (S1) should know that that there is active connection of C2 with him, so server sends data back to client C2, If server do not have active socket connection with him it cannot send information to that client as in case of client C4.

Now this works ok incase we have only few clients, now suppose we have millions of clients and we need to maintain an active connection with them to exchange messages, one server will not be able to handle those connections by itself. So we will scale out as usual adding more no. of servers and then the problem starts

The Problem

In order to send messages to clients we need to know that the client is connected to any of our servers and if it is connected to any one of the servers then only that server will be able to exchange messages.





Now we have 3 server instances which have active connections to the clients. Taking the above example again. 


C1 does some action which C2 needs to know, C1 send event data to S1 as it is connected to S1 and now S1 need to send some data back to C2 which S1 cannot as S1 do not have any active connection of C2, but if we look in the above diagram, C2 is actually connected to and is active here in case with S2.

Now in order to achieve this, we need to ask for any active connection of C2 to all of our instances, which we will achieve using Redis

In Redis we will use Publish/Subscribe to implement communication between our server instances.


