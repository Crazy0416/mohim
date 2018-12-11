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
*****
### 사이버머니 충전
- PUT http://1.201.139.81:5900/users/cyberMoney
- http header: Content-Type=application/json
```$xslt
// http body
{
	"user": {
		"email": "gogomin0416@gmail.com",
		"uname": "zxc",
		"pwd": "asd",
		"cyber_money": 0
	},
	"chargeMoney": 10000
}
```
- 주의: chargeMoney 값이 0 이하이면 오류처리
```
// http response 결과.
{
    "message": "사이버 머니 충전완료.",
    "code": 200,
    "time": "2018-12-10T12:50:38.257Z",
    "data": [   // 충전한 뒤의 유저 정보
        {
            "email": "gogomin0416@gmail.com",
            "uname": "gogo",
            "pwd": "123",
            "cyber_money": 10000
        }
    ]
}
```
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
### 출석 생성
- POST http://1.201.139.81:5900/users/attend/make
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
    "clubName": "클럽1",
    "title": "두번째 출석체크",
    "deadline": "2018-12-25T14:00",
    "code":"123"
}
```
- 주의: deadline 값이 날짜 타입이 아니거나 방장이 아니면 오류처
```
// http response 결과.
{
    "message": "클럽이 없거나 권한이 없습니다.",
    "code": 500,
    "time": "2018-12-10T14:43:04.562Z"
}
```
*****
### 클럽이름으로 출석 리스트 검색 
- POST http://1.201.139.81:5900/attend/search
- http header: Content-Type=application/json
```$xslt
// http body
{
    "clubName": "클럽1"
}
```
### 공지 생성
- POST http://1.201.139.81:5900/users/notice/make
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
    "clubName": "클럽1",
    "title": "첫번째 공지사항",
    "content": "이번 모임은 101 카페에서 할 예정입니다~~"
}
```
- 주의: 클럽의 방장이 아니면 오류처리
```
// http response 결과.
{
    "message": "클럽이 없거나 권한이 없습니다.",
    "code": 500,
    "time": "2018-12-10T14:43:04.562Z"
}
```
*****
### 유저 출석
- PUT http://1.201.139.81:5900/users/attend/read
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
	"_id":4 // attend의 _id값
}
```
- 성공했으면 code값 200
- 주의: 이미 출석했으면 오류처리
```
// http response 결과.
{
    "message": "이미 출석했습니다.",
    "code": 304,                    // 304 코드지만 HTTP status 코드는 500
    "time": "2018-12-11T10:21:36.833Z"
}
```
*****
### 출석 벌금 부과
- PUT http://1.201.139.81:5900/users/attend/fine
- http header: Content-Type=application/json
```$xslt
// http body
{
	"user": {   // 클럽 방장이어야 함.
        "email": "gogomin0416@gmail.com",
        "uname": "gogo",
        "pwd": "123",
        "cyber_money": 0
    },
    "clubName": "클럽1",
    "_id": 1        // attend의 _id값
}
```
- 성공했으면 code값 200. message는 "벌금 부과 완료"
- 모두 출석했어도 성공으로 함. code값 200. 하지만 message가 다르다. "이미 모두 출석하였습니다."
```
// http response 결과.
{
    "message": "이미 모두 출석하였습니다.",
    "code": 200,
    "time": "2018-12-11T13:27:14.344Z"
}
```
- 유저가 방장이 아니라면 오류처리.
```
// http response 결과.
{
    "message": "클럽이 없거나 권한이 없습니다.",
    "code": 500,
    "time": "2018-12-11T13:33:43.447Z"
}
```
*****
### 클럽 이름으로 공지 검색 
- PUT http://1.201.139.81:5900/notice/search
- http header: Content-Type=application/json
```$xslt
// http body
{
	"clubName": "클럽1"
}
```
- 응답
```
{
    "message": "공지 검색 완료.",
    "code": 200,
    "time": "2018-12-11T14:32:54.252Z",
    "data": [
        {
            "_id": 1,
            "c_club_name": "클럽1",
            "title": "첫번째 공지사항",
            "create_on": "2018-12-11T07:12:00.000Z",
            "content": "이번 모임은 101 카페에서 할 예정입니다~~"
        },
        {
            "_id": 2,
            "c_club_name": "클럽1",
            "title": "두번째 공지사항",
            "create_on": "2018-12-11T08:12:00.000Z",
            "content": "이번 모임은 다음주로 미뤄졌습니다!!"
        }
    ]
}
```