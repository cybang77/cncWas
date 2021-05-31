## 1. 의존성
* @influxdata/influxdb-client 1.13.0
* express 4.16.1
* express-history-api-fallback 2.2.1
* influx 5.9.0
* socket.io 1.3.5
* node 12.16.1
## 2. was 기동 방법
1. npm install
2. DEBUG=cnc-was:* npm start
## 3. 기동 후 UI
![image](https://user-images.githubusercontent.com/33340094/120166343-706b4480-c237-11eb-9c4f-a90f2482d979.png)

## 4. API 명세서
* version: 1.0.0  
### * 작업중단 GET /work-drop
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;request parameter: none  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;작업 중단시 AI 판정 UI reset. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
### * 가동 현황 정보 GET /cycle-info  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;request parameter: - startTime: string   ex) 'YYYY/MM/DD hh:mm:ss'  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- endTime: string     ex) 'YYYY/MM/DD hh:mm:ss'  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- opCode: string      ex) 'OP10-3'  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- count: Integer      ex) 1  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- cycleTime: Float    ex) 137.8   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;한 공정이 끝날 때 마다 가동 현황 update. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
### * 작업중단 GET /real-time-loss   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;request parameter: - loss: Float         ex) 0.0032  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;작업 중단시 AI 판정 UI reset. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다. 

## 5. socket event 명세서
* version: 1.0.0  
### * 총 제품 생산 개수 setCount   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return: integer   ex) 1027  
### * 가동 여부 확인 setWork  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return: string    ex) start  
### * 평균 CT  setMeanCycleTime  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return: float     ex) 160.7  
### * 일간 생산량 개수  setCount1Day  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return: array     ex) [[‘2021-05-26’,156],[2021-05-27’,7]]  
### * 월간 생산량 setCount1Month  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return: array     ex) [[‘2021-05-30’,163],[2021-05-31’,7]]  
### * CT 리스트 setCycleTimeList  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return: array     ex) [[‘2021/5/31 16:38:40’, ‘2021/5/31 16:40:52’,131.5], [‘2021/5/31 16:42:40’, ‘2021/5/31 16:42:52’,131.5] … , [‘2021/5/31 17:21:40’, ‘2021/5/31 16:23:52’,131.5]]

### *디렉토리 및 파일 구성

├── bin<br>
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── js<br>
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── hnLibrary.js<br>
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── socket.js<br>
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── www<br>
├── public<br>
├── routes<br>
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── index.js<br>
├── src<br>
├── views<br>
├── app.js<br>
└── README.md<br>
<br>
* bin: 프로그램 실행시 변수를 초기화하는 함수<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- js: timestamp를 date로 변환해주는 라이브러리 및 추후 라이브러리가 모여질 디렉토리<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- www: http 서버 선언 및 socket 통신을 위한 설정 및 통신 구현<br>
* public: UI 빌드 후 저장되는 경로
* routes: 라우팅에 관련되어 정의되어있는 디렉토리
* views: express-generator 기본 views. 에러 및 예외에 관련된 화면이 정의되어있는 디렉토리
* app.js: was 기동시 프로그램 진입점
