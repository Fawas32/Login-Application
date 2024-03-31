My Task Appication is a simple and easy application that lrts users upload the the tasks that they want to do so that they can be producive and stay organized.

To make this application i was assisted with the help of https://www.w3schools.com/nodejs/nodejs_get_started.asp & https://www.youtube.com/watch?v=O5kh3sTVSvA&ab_channel=Honeywebdesigner 

I have a little bit of experience with this from my internship.

To creat my project i used the following commands:
npm init
npm init -y
npm install express sqlite3 body-parser
Then created app.js, index.html and login.html in my directory on VScode.

To start my application i just used this command:
node app.js

Then a localhost link will show up in terminal:
http://localhost:3000/ That is where i accessed my web application.

I used this XSS code for my insecure feature:
" <script>alert(‘XSS’)</script> "

I used this command for my SQL injection and and Sensitive data exposure:
SELECT * FROM users WHERE username = 'username' AND password = 'password' OR '1'='1';
