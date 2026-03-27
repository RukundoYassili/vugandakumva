import http from 'http';

const data = JSON.stringify({
  name: 'Backend Test User',
  email: 'hello.vugandakumva@example.com',
  password: 'SuperSecretPassword2026!'
});

console.log('Sending signup request to http://localhost:3000/auth/signup...');

const req = http.request({
  hostname: '127.0.0.1',
  port: 3000,
  path: '/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`\nHTTP STATUS: ${res.statusCode}`);
    console.log('RESPONSE:');
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
});

req.on('error', console.error);
req.write(data);
req.end();
