# CncWas

## 의존성
* @influxdata/influxdb-client 1.13.0
* express 4.16.1
* express-history-api-fallback 2.2.1
* influx 5.9.0
* socket.io 1.3.5
* node 12.16.1


## 디렉토리 및 파일 구성

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

## was 명세서
![image](https://user-images.githubusercontent.com/33340094/120151412-2ed29d80-c227-11eb-9f82-698200d2e0c8.png)

## socket 명세서
![image](https://user-images.githubusercontent.com/33340094/120152332-4e1dfa80-c228-11eb-8b2e-7f37f56c1234.png)

## was 기동 방법
1. npm install
2. DEBUG=cnc-was:* npm start
