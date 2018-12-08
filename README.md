- mysql 5.7 설치
- create database mohin;
- mysql password는 config/config.json에 설정됨


## API
### 회원가입
- POST http://1.201.139.81:5900/users/register
- http header: Content-Type=application/json
```
// http body
{
	"email":  <텍스트 값>,
	"name": <텍스트 값>,
	"password": <텍스트 값>
}
```
*****
### 로그인
- POST http://1.201.139.81:5900/users/login
- http header: Content-Type=application/json
```
// http body
{
	"email":  <텍스트 값>,
	"password": <텍스트 값>
}
```
*****
### 클럽 생성
- POST http://1.201.139.81:5900/clubs/make
- http header: Content-Type=application/json
```$xslt
// http body
{
	"user": {
        "email": "minmin0416@naver.com",
        "uname": "minho",
        "pwd": "123",
        "cyber_money": 0
    },
    "clubName": "클럽1",
    "clubInfo": "클럽1에 대한 설명입니다."
}
```
*****
### 전체 클럽 목록
- GET http://1.201.139.81:5900/clubs/search

*****
### 클럽 가입 요청
- PUT http://1.201.139.81:5900/clubmembers/add
- http header: Content-Type=application/json
```$xslt
// http body
{
	"user": {
        "email": "gogomin0416@gmail.com",
        "uname": "gogo",
        "pwd": "123",
        "cyber_money": 0
    },
    "clubName": "클럽1"
}
```
*****
### 가입된 클럽 목록
- GET http://1.201.139.81:5900/users/clubs
- http header: Content-Type=application/json
```$xslt
// http body
{
	"user": {
        "email": "gogomin0416@gmail.com",
        "uname": "zxc",
        "pwd": "asd",
        "cyber_money": 0
    }
}
```
