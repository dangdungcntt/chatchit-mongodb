## ChatChit
ChatChit is realtime web application. It can help you chat with your friends, send emoji icon, images. Writen in nodejs, backed by socket.io, mongodb,..
## Installation
ChatChit requires nodejs and mongodb.
```
$ git clone https://github.com/dangdungcntt/chatchit-mongodb.git
$ cd chatchit-mongodb
$ npm install
$ cp .env.example .env
```
## Config
You must have a ConnectionString of Mongodb and replace it in .env
```
DB_STRING_URL=Your ConnectionString of Mongodb
```
Start the application with
```
npm start
```

