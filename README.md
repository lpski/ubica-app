# UBICA Web Application Structure and Setup

## Application Setup 

### Prerequisites
 If running locally ensure you have the latest version of NodeJS, MongoDB, and npm installed


### Install 
* Copy entire directory to your desired location or server
* From root directory of your chosen location run `npm install`


### MongoDB
Prior to attempting to start the application, ensure that MonogoDB is running

* To start mongoDB enter `mongod` in terminal



### Configuration
Prior to running the application must be configured to allow for a successful database connection. Lines 36 - 43 of app.js must be modified with your credentials and database location as seen below.

For hosting locally:

`mongoose.connect('mongodb://localhost:27017/test');`

For remote hosting (azure example):

```
mongoose.connect('mongodb://[user].documents.azure.com:[port]/capstonedb?ssl=true', {
    auth: {
      user: '[user]',
      password: '[password]'
    }
  })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));
```

### Starting the app
To start the application run `npm start` from the folder's root directory


## Application structure

**bin:** Contains www file which initializes node app server

**config:** Contains passport (user authentication) and app configuration file

**controllers:** Contains controllers for views

**models:** Contains models used for mongoDB database manipulation

**public:** Contains all javascript, css, fonts, and images

**uploads** Temporary storage location for uploaded files -- contains nothing initially

**views** Contains all web application views in pug format

**.env** Environment variables

**app.js** Initializes controllers, routing, mongoDB connection, and application settings