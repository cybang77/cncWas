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
```
- 작업중단 GET /work-drop
  request parameter: none  
  작업 중단시 AI 판정 UI reset. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
  ex) http://localhost:1234/work-drop

- 가동 현황 update GET /cycle-info  
  request parameter: - startTime: string   ex) '1621488609391.011'  
                     - endTime: string     ex) '1621488619391.011'  
                     - opCode: string      ex) 'OP10-3'  
                     - count: Integer      ex) 1  
                     - cycleTime: Float    ex) 137.8   
  한 공정이 끝날 때 마다 가동 현황 update. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
  ex) http://localhost:1234/cycle-info?startTime=1621488609391.011&endTime=1621488619391.011&opCode=OP10-3
                                                                                &count=1&cycleTime=131.4

- 작업중단 GET /real-time-loss   
  request parameter: - loss: Float         ex) 0.0032  
  작업 중단시 AI 판정 UI reset. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다. 
  ex) http://localhost:1234/real-time-loss?loss=0.002
```

## 5. socket event 명세서 - version: 1.0.0  
![1](https://user-images.githubusercontent.com/33340094/120181693-6140c280-c248-11eb-9af2-511cb679cfb5.jpg)
![2](https://user-images.githubusercontent.com/33340094/120181705-64d44980-c248-11eb-9bd6-6414bab0177a.jpg)

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

* bin: 프로그램 실행시 변수를 초기화하는 함수<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- js: timestamp를 date로 변환해주는 라이브러리 및 추후 라이브러리가 모여질 디렉토리<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- www: http 서버 선언 및 socket 통신을 위한 설정 및 통신 구현<br>
* public: UI 빌드 후 저장되는 경로
* routes: 라우팅에 관련되어 정의되어있는 디렉토리
* views: express-generator 기본 views. 에러 및 예외에 관련된 화면이 정의되어있는 디렉토리
* app.js: was 기동시 프로그램 진입점
