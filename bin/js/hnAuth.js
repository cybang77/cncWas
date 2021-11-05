const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

exports.TokenCheck = (arg) => {
  if (typeof(arg) == 'string') {
    arg = JSON.parse(arg);
  }
  let access = arg.access_token;
  let refresh = arg.refresh_token;
  let cert = fs.readFileSync('/home/rnd03/workspace/source/WAS/sprint1/routes/public.pem');
  var res;
  
  //token 유효성 검사
  jsonwebtoken.verify(access, cert, { algorithms: ['RS256'] }, function (err, decoded) {
    if (err) {
      // 변질된 access 토큰
      if (err.message == 'invalid token') {
        res = { res: false, code: 401, message: { "result": "Invalid Access Token", "errormessage": "invalid_access_token", "hnerrorcode": 'E001' } };
        // 만료된 access 토큰
      } else if (err.message == 'jwt expired') {
        // refresh 가능한지 확인
        jsonwebtoken.verify(refresh, cert, { algorithms: ['RS256'] }, function (err, decoded) {
          if (err) {
            // 변질된 refresh 토큰
            if (err.message == 'invalid token') {
              res = { res: false, code: 401, message: { "result": "Invalid Refresh Token", "errormessage": "invalid_refesh_token", "hnerrorcode": 'E002' } };
              // 만료된 refresh 토큰
            } else if (err.message == 'jwt expired') {
              res = { res: false, code: 401, message: { "result": "Access Token expired", "errormessage": "get_new_access_token", "hnerrorcode": 'E003' } };
            } else {
              res = { res: false, code: 401, message: { "result": "Refresh Token expired", "errormessage": "refresh_your_token", "hnerrorcode": 'E004' } };
            }
          }
        });
      } else {
        console.log(err.message )
        res = { res: false, code: 403, message: { "result": "Unexpected Error", "errormessage": "get_access_token", "hnerrorcode": 'E005' } };
      }
    } else {
      //realm check
      if (!decoded.iss.includes('cyservice')) {
        res = { res: false, code: 401, message: { "result": "Invalid Request", "errormessage": "not_found_realm", "hnerrorcode": 'E006' } };
      }
      //client check
      if (decoded.azp != 'was') {
        res = { res: false, code: 401, message: { "result": "Invalid Request", "errormessage": "clientId_is_invalid", "hnerrorcode": 'E007' } };
      }
      //role check
      if (decoded.resource_access.was.roles[0] != 'admin') {
        res = { res: false, code: 402, message: { "result": "Invalid Access Token", "errormessage": "invalid_access_token", "hnerrorcode": 'E008' } };
      }
      res = { res: true, code: 200, message: { "result": "success" } };
    }
  });
  return res;
}