/* 웹서버 구축 */

var http = require("http"); //http 모듈 가져오기
var fs = require("fs"); // File System 모듈 가져오기 

//http 모듈로 부터 server 객체 생성하기
// var server = http.createServer();

var server = http.createServer(function(request,respone){
    //아래의 코드들이 동작하기 전에 서버는 클라이언트가 원하는게 무엇인지 구분을 먼저 해야한다
    // 요청분석
    //요청분석을 들어가려면, 요청정볼르 담고있는 request 객체를 이용해야 한다!
    // console.log("클라이언트가 요청시 사용한 url",request.url);

    //1) 클라이언트가 회원가입시 양식을 보기원하면아래의 코드 수행
   
    
    //서버에 올려진 또는 존재하는 파일을 읽어서 클라이언트의 브라우저에 보내주자!
    fs.readFile("./회원폼유효성체크.html","utf-8",function(error,data){
        if(error){
            console.log("에러");
        }else{
            respone.writeHead(200,{"Content-Type": "text/html;charset=utf-8"});
            respone.end(data);
        }
    });
    //http 프로토콜 상, 약속을 지켜서 즉 형식을 지켜서 보내자

    //2) 가입을원할경우엔 db에넣어주고
    //3)이미지를 원하면이미지를 보여주고
    //4)
});

//서버 가동하기
server.listen(7979,function(){
    console.log("Server is running at 7979 port...");
});
