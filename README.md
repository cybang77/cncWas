## 1. 의존성
* flood/node-influx 5.0.9
* express 4.16.1
* express-history-api-fallback 2.2.1
* socket.io 4.1.2
* node 12.16.1
* npm 6.14.12 
## 2. was 기동 방법
1. npm install
2. DEBUG=cnc-was:* npm start
## 3. 기동 후 UI
![image](https://user-images.githubusercontent.com/33340094/140264526-04422736-e1d3-47e3-914e-a7a73f01d726.jpg)
[UI source & Readme](https://github.com/yeji3999/cncPrj/tree/sprint1)

## 4. API 명세서 - version: 1.0.0  
<h3>4-1. REST API Summary  </h3>
<table>
    <tr>
        <th>Method and URI</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Get /main/work-drop</td>
        <td>작업 중단</td>
    </tr>
    <tr>
        <td>Get /main/cycle-info?{startTime}&{endTime} &{opcode}&{count}&{cycleTime}</td>
        <td>가동 현황</td>
    </tr>
    <tr>
        <td>Get /main/real-time-loss?{loss}</td>
        <td>실시간 loss율</td>
    </tr>
    <tr>
        <td>Get /quality/start?{opcode}&{sn}</td>
        <td>품질판정 시작</td>
    </tr>
    <tr>
        <td>Get /quality/end?{opcode}&{sn}&{filename}&{acc}&{predict}&{file}</td>
        <td>품질판정 완료</td>
    </tr>

</table>

* ### 작업 중단 GET /main/work-drop
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    작업 중단시 AI 판정 UI reset. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
    ***Success Example:***  
    {  
    OK  
    }  
* ### 가동 현황 GET /main/cycle-info</h3>
    ---

    ***Request Parameters***  

    |     Parameter    |     Type       |     Desctiption                       |
    |:------------------|:----------------|:---------------------------------------|
    |     opCode       |     string     |     가공 코드                         |
    |     startTime    |     string     |     timstamp형식으로 ns까지   표기    |
    |     endTime      |     string     |     timstamp형식으로 ns까지 표기      |
    |     count        |     integer    |     오직 1만 가능                     |
    |     cycleTime    |     float      |     가공 시간                         |  

    ***Response***  
    한 공정이 끝날 때 마다 가동 현황 update. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
    ***Success Example:***  
    {  
    OK  
    }  
* ### 실시간 loss율 GET /main/real-time-loss
    ---

    ***Request Parameters***  
    |     Parameter    |     Type     |     Desctiption       |
    |:------------------|:--------------|:-----------------------|
    |     loss         |     float    |      실시간 loss율    |  

    ***Response***  
    실시간으로 loss관련 UI에 반영. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
    ***Success Example:***  
    {  
    OK  
    }  
* ### 품질 판정 시작 알림 GET /quality/start
    ---

    ***Request Parameters***  
    |     Parameter    |     Type     |     Desctiption       |
    |:------------------|:--------------|:-----------------------|
    |     opcode         |     string    |      공정코드    |  
    |     sn         |     string    |      제품 시리얼넘버    |  

    ***Response***  
    요청을 받으면 품질 판정 시작을 UI에 알림. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
    ***Success Example:***  
    {  
    OK  
    }  
* ### 품질 판정 끝 알림 GET /quality/end
    ---

    ***Request Parameters***  
    |     Parameter    |     Type     |     Desctiption       |
    |:------------------|:--------------|:-----------------------|
    |     opcode         |     string    |      공정코드    | 
    |     sn         |     string    |      제품 시리얼넘버    |  
    |     filename         |     string    |      파일이름    | 
    |     file         |     byte    |      품질 판정 주파수 이미지    | 
    |     acc         |     float    |      판정 정확도    | 
    |     predict         |     float    |      예측률     | 

    ***Response***  
    요청을 받으면 품질 판정 결과를 저장하고, UI에 시각화. 요청이 성공적으로 서버에 전달되면 200 OK를 반환합니다.  
    ***Success Example:***  
    {  
    OK  
    }  
<br/>

### 4-2. Socket IO Summary

<table>
    <tr>
        <th>Socket Event</th><th>Description</th>
    </tr>
    <tr>
        <td>setCount</td>
        <td>총 생산량</td>
    </tr>
    <tr>
        <td>setMeanCycleTime</td>
        <td>최근 20분 동안 CT 평균</td>
    </tr>
    <tr>
        <td>setCountsHistory</td>
        <td>하루,한주,한달 생산한 제품 생산량 <I>특) influxQL이 1M, 1w을 지원해주지 않아 직접 집계</I></td>
    </tr>
    <tr>
        <td>setCycleTimeList</td>
        <td>최근 100개 CT 리스트</td>
    </tr>
    <tr>
        <td>currentModelInfo</td>
        <td>현재 모델 정보</td>
    </tr>
    <tr>
        <td>modelStop</td>
        <td>현재 사용중인 예측 모델 사용 중지</td>
    </tr>
    <tr>
        <td>modelStart</td>
        <td>해당 모델 사용 시작</td>
    </tr>
    <tr>
        <td>recentlyPredictInfo</td>
        <td>최근 품질 판정 정보</td>
    </tr>
    <tr>
        <td>streamPredict</td>
        <td>실시간 예측 데이터</td>
    </tr>
    <tr>
        <td>disconnect</td>
        <td>소켓 연결 끊김</td>
    </tr>
    <tr>
        <td>error</td>
        <td>소켓 연결 에러</td>
    </tr>
</table>

* ### 총 생산량 setCount
     ---

    ***Request Parameters***  
    None  
    ***Response***  
    총생산량을 집계합니다. 요청이 성공적으로 서버에 전달되면 아래 예시와 같이 integer type data를 return 합니다.   
    ***Success Example:***  
    return 1027  
* ### 최근 20분 CT 평균 setMeanCycleTime
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    최근 5개 평균 cycle time을 집계합니다. 요청이 성공적으로 서버에 전달되면 아래의 예시와 같이 float type data를 return 합니다.   
    ***Success Example:***  
    return 160.7 

* ### 생산량 집계 setCountsHistory
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    하루, 한주, 한달 생산량을 집계합니다.  
    *특이사항)* influxQL이 1M, 1w을 지원해주지 않아 직접 집계
    요청이 성공적으로 서버에 전달되면 아래의 예시와 같이 object type data를 return 합니다.

    ***Success Example:***  
    return [[‘2021-05-26’, 156],[2021-05-27’, 7]] 
* ### 최근 100개 CT 리스트 setCycleTimeList
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    최근 100개 CT리스트를 집계합니다. 요청이 성공적으로 서버에 전달되면 아래 예시와 같이 object type data를 내용을 return 합니다.  
    ***Success Example:***  
    return [[‘2021/5/31 16:38:40’, ‘2021/5/31 16:40:52’,131.5], [‘2021/5/31 16:42:40’, ‘2021/5/31 16:42:52’,131.5] … , [‘2021/5/31 17:21:40’, ‘2021/5/31 16:23:52’,131.5]] 
* ### 현재 모델 정보 currentModelInfo
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    현재 사용 중인 모델 정보를 알려줌. 요청이 성공적으로 서버에 전달되면 아래 예시와 같이 json type data를 내용을 return 합니다.  
    ***Success Example:***  
    return {model:"conv2d-lstm", processCnt: 2}
* ### 현재 사용중인 예측 모델 중지 modelStop
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    현재 사용중인 예측 중지 요청. 요청이 성공적으로 서버에 전달되면 아래 예시와 같이 json type data를 내용을 return 합니다.  
    ***Success Example:***  
    return { state: 'Engine Stop Sucess' }
          or { state: 'Engine Stop Fail' }
* ### 특정 예측 모델로 예측 시작 modelStart
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    특정 예측 모델을 사용하여 예측 시작 요청. 요청이 성공적으로 서버에 전달되면 아래 예시와 같이 json type data를 내용을 return 합니다.  
    ***Success Example:***  
    return { state: 'Engine Start Sucess' }
          or { state: 'Engine Start Fail' }
* ### 최근 품질 판정 정보 recentlyPredictInfo
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    최근 품질 판정 정보 요청. 요청이 성공적으로 서버에 전달되면 아래 예시와 같이 json type data를 내용을 return 합니다.  
    ***Success Example:***  
    return {opcode: "OP10-3", sn: "A202111041030073", filename: "A202111041030073Tcode8080F", acc: 0.8113423432, predict:0.0033888888888888888}
* ### 실시간 예측 데이터 streamPredict
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    실시간 예측 데이터 요청. 요청이 성공적으로 서버에 전달되면 아래 예시와 같이 string type data를 내용을 1초 주기로 return 합니다.  
    ***Success Example:***  
    return OP10-3,1636007776567,0.008777777777777778,316,T1010,A202111041030063,0.008347675,300.5163073539734,0.00043010257350073987 
* ### 소켓 연결 끊김 disconnect
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    None  
* ### 연결 에러시 로그 출력 error
    ---

    ***Request Parameters***  
    None  
    ***Response***  
    None 

<br/><br/>

### *디렉토리 및 파일 구성

```bash
.
├── app.js
├── bin
│   ├── config
│   │   └──config.js
│   ├── js
│   │   └──hnLibrary.js
│   ├── kafka.js
│   ├── socket.js
│   └── www.js
├── node_modules
├── package.json
├── public
├── routes
│   ├── predict.js
│   └── main.js
├── views
├── sprint1 API and Socket specification.docx
└── README.md
```

* bin: 프로그램 실행시 변수를 초기화하는 함수<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- config: 설정 정보<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- js: timestamp를 date로 변환해주는 라이브러리 및 추후 라이브러리가 모여질 디렉토리<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- www: http 서버 선언<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- socket: socet 연결 및 구현 정보<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- kafka: kafka 선언 및 consumer 정의<br>
* public: UI 빌드 후 저장되는 경로
* routes: 라우팅에 관련되어 정의되어있는 디렉토리
* views: express-generator 기본 views. 에러 및 예외에 관련된 화면이 정의되어있는 디렉토리
* socket.js: was 기동시 프로그램 진입점
