## 1. 의존성
* @influxdata/influxdb-client 1.13.0
* express 4.16.1
* express-history-api-fallback 2.2.1
* socket.io 1.3.5
* node 12.16.1
* npm 6.14.12 
## 2. was 기동 방법
1. npm install
2. DEBUG=cnc-was:* npm start
## 3. 기동 후 UI
![image](https://user-images.githubusercontent.com/33340094/120166343-706b4480-c237-11eb-9c4f-a90f2482d979.png)
[UI source & Readme](https://github.com/yeji3999/cncPrj/tree/sprint1)

## 4. API 명세서 - version: 1.0.0  
### summary  

|     Method and URI                                                               |     Description        |
|----------------------------------------------------------------------------------|------------------------|
|     Get   /work-drop                                                             |     작업 중단          |
|     Get   /cycle-info?{startTime}&{endTime}     &{opcode}&{count}&{cycleTime}    |     가동 현황          |
|     Get   /real-time-loss?{loss}                                                 |     실시간   loss율    |  
<br>

### 작업 중단 GET /work-drop
***
***Request Parameters***  
None  
***Response***  
작업 중단시 AI 판정 UI reset. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
***성공 예제:***  
{  
OK  
}  
### 가동 현황 GET /cycle-info
***    
***Request Parameters***  
|     Parameter    |     Type       |     Desctiption                       |
|------------------|----------------|---------------------------------------|
|     opCode       |     string     |     가공 코드                         |
|     startTime    |     string     |     timstamp형식으로 ns까지   표기    |
|     endTime      |     string     |     timstamp형식으로 ns까지 표기      |
|     count        |     integer    |     오직 1만 가능                     |
|     cycleTime    |     float      |     가공 시간                         |  

***Response***  
한 공정이 끝날 때 마다 가동 현황 update. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
***성공 예제:***  
{  
OK  
}  
### 실시간 loss율 GET /real-time-loss
***
***Request Parameters***  
|     Parameter    |     Type     |     Desctiption       |
|------------------|--------------|-----------------------|
|     loss         |     float    |      실시간 loss율    |  

***Response***  
실시간으로 loss관련 UI에 반영. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
***성공 예제:***  
{  
OK  
}  


## 5. socket event 명세서 - version: 1.0.0  
### summary  
|     Socket Event        |     Description                                                                              |
|-------------------------|----------------------------------------------------------------------------------------------|
|     setCount            |     총 생산량                                                                                |
|     setWork             |     가동 현황                                                                                |
|     setMeanCycleTime    |     최근 5개 CT 평균                                                                         |
|     setCount1Day        |     하루 생산한 제품 생산량     *특) influx 버그로 인하여     주간 생산량 또한 여기서 체크*    |
|     setCount1Month      |     한달 생산량                                                                              |
|     setCycleTimeList    |     최근 100개 CT 리스트                                                                     |
***
### 총 생산량 setCount  
***Request Parameters***  
None  
***Response***  
총생산량을 집계합니다. 요청이 성공적으로 서버에 전달되면 아래의 내용을 return 합니다. 
***성공 예제:***  
return 1027 

### 가동 현황 setWork
***
***Request Parameters***  
None  
***Response***  
현재 가동 여부를 전송합니다. 요청이 성공적으로 서버에 전달되면 아래의 내용을 return 합니다. 
***성공 예제:***  
return 'start' 

### 최근 5개 CT 평균 setMeanCycleTime
***
***Request Parameters***  
None  
***Response***  
최근 5개 평균 cycle time을 집계합니다. 요청이 성공적으로 서버에 전달되면 아래의 내용을 return 합니다. 
***성공 예제:***  
return 160.7 

### 하루 생산량 setCount1Day
***
***Request Parameters***  
None  
***Response***  
하루 생산량을 집계합니다.  
*특이사항)* influx2.0 버그로 인하여 주간 생산량 또한 여기서 집계
요청이 성공적으로 서버에 전달되면 아래의 내용을 return 합니다.

***성공 예제:***  
return [[‘2021-05-26’, 156],[2021-05-27’, 7]] 

### 한달 생산량 setCount1Month
***
***Request Parameters***  
None  
***Response***  
한달 생산량을 집계합니다. 요청이 성공적으로 서버에 전달되면 아래의 내용을 return 합니다. 
***성공 예제:***  
return [[‘2021-05-26’, 156],[2021-05-27’, 7]]

### 최근 100개 CT 리스트 setCycleTimeList
***
***Request Parameters***  
None  
***Response***  
한달 생산량을 집계합니다. 요청이 성공적으로 서버에 전달되면 아래의 내용을 return 합니다.
***성공 예제:***  
return [[‘2021/5/31 16:38:40’, ‘2021/5/31 16:40:52’,131.5], [‘2021/5/31 16:42:40’, ‘2021/5/31 16:42:52’,131.5] … , [‘2021/5/31 17:21:40’, ‘2021/5/31 16:23:52’,131.5]] 

### *디렉토리 및 파일 구성

```bash
.
├── app.js
├── bin
│   ├── js
│   │   └──hnLibrary.js
│   └── www.js
├── node_modules
├── package.json
├── public
├── routes
│   └── index.js
├── views
├── sprint1 API and Socket specification.docx
└── README.md
```

* bin: 프로그램 실행시 변수를 초기화하는 함수<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- js: timestamp를 date로 변환해주는 라이브러리 및 추후 라이브러리가 모여질 디렉토리<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- www: http 서버 선언 및 socket 통신을 위한 설정 및 통신 구현<br>
* public: UI 빌드 후 저장되는 경로
* routes: 라우팅에 관련되어 정의되어있는 디렉토리
* views: express-generator 기본 views. 에러 및 예외에 관련된 화면이 정의되어있는 디렉토리
* app.js: was 기동시 프로그램 진입점
