# Backend on TypeScript

## Installation
```bash
npm install
npm i express-session
npm i express-fileupload
```

## Test

* Signup
```http
POST /signup HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Content: {
    "login": "test",
    "password": "test"
}
```

* Login
```http
POST /login HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Content: {
    "login": "test",
    "password": "test"
}
```

* Logout
```http
POST /logout HTTP/1.1
Host: localhost:8000
```

* Check auth
```http
GET /auth/check HTTP/1.1
Host: localhost:8000
```
