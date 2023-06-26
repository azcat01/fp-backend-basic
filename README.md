
# Hitorigoto API Server

Final Project to accomplish study club of KSM Android Backend Basic
Universitas Pembangunan Nasional Veteran Jakarta



## Features

- Create Account
- Authentication with JWT
- Upload images
- Input Validation
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`ATLAS_URI=<mongo-atlas-uri>`

`USER_TOKEN_KEY=<random-string>`

`ADMIN_TOKEN_KEY=<random-string>`


## Run Locally

Clone the project

```bash
  git clone https://github.com/azcat01/fp-backend-basic
```

Go to the project directory

```bash
  cd fp-backend-basic
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev # development
  npm run prod # production
```


## Usage/Examples

### User
Don't forget to input your own random password and the token you've got from login and create account.

Create an user account
```
curl --location 'http://localhost:5050/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "sakamatachloe",
    "email": "sakamata@gmail.com",
    "password": <password>
}'
```

Login with registered account
```
curl --location 'http://localhost:5050/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=***<your-jwt-key>***'
--data '{
    "username": "sakamatachloe",
    "password": <password>
}'
```

Update account information
```
curl --location --request PUT 'http://localhost:5050/edit/sakamatachloe' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=***<your-jwt-key>***' \
--data-raw '{
    "fullName": "Sakamata Chloe",
    "gender": "Perempuan",
    "birthDate": "2004-01-05",
    "job": "Student",
    "organization": "Universitas Pembangunan Nasional Veteran Jakarta",
    "phoneNumber": "085695403205",
    "email": "chloesakamata@yahoo.com"
}'
```
Upload image
```
curl --location --request PUT 'http://localhost:5050/edit/sakamatachloe' \
--header 'Cookie: token=***<your-jwt-key>***' \
--form 'profileimg=@"/absolute/path/to/image"'
```

Get account information
```
curl --location 'http://localhost:5050/edit/sakamatachloe' \
--header 'Cookie: token=***<your-jwt-key>***'
```

Delete account
```
curl --location --request DELETE 'http://localhost:5050/edit/sakamatachloe' \
--header 'Cookie: token=***<your-jwt-key>***'
```

### Admin

Create Admin Account
```
curl --location 'http://localhost:5050/admin/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "vestia.zeta@gmail.com",
    "password": <password>
}'
```

Get User account by username or email
```
curl --location --request GET 'http://localhost:5050/admin/' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=***<your-jwt-key>***' \
--data '{
    "username": <username>,
    "email": <email>
}'
```

Delete Admin account
```
curl --location --request DELETE 'http://localhost:5050/admin/account' \
--header 'Cookie: token=***<your-jwt-key>***'
```
## Optimizations

- Course Schema
- User Scores
## Authors

- [azcat01](https://www.github.com/azcat01)

