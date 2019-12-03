
const pako = require('pako');
const request = require('request');
 
const requstOptions = {
  gzip: true, // forces 'gzip,deflate' headers.
  encoding: null, // ??? profit ???
  headers: {
    Host: 'prod.escapefromtarkov.com',
    'User-Agent': 'UnityPlayer/5.6.5p3',
    accept: '*/*',
    Connection: 'Keep-Alive',
    Cookie: cookie, // this is your `PHPSESSID=_some_SID_here`
    'X-Unity-Version': '5.6.5p3',
    'Content-Type': 'application/json',
  },
};
const makeRequest = (settings, type) =>
  new Promise((resolve, reject) => {
    console.log('Sending Request to...', type);
    request({ ...requstOptions, ...settings }, (req, res, body) => {
      console.log('byteLength of response:', Buffer.byteLength(body));
      const pak = JSON.parse(
        pako.inflate(body, {
          to: 'string',
        }),
      );
      resolve(pak);
    })
      .on('response', response => {
        response.headers['content-encoding'] = 'deflate'; // we force deflate here, devs didn't include it... retards.
      })
      .on('error', err => reject(err));
  });
 
const updatePlayer = () =>
  new Promise((resolve, reject) => {
    makeRequest({
      method: 'post',
      uri: 'http://prod.escapefromtarkov.com/client/game/profile/list',
    })
      .then(res => {
        console.log(res)
        resolve(res);
      })
      .catch(err => resolve(err));
  });