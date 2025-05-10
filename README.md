# Web-Vulnerabilities-Lab
Welcome to my cybersecurity lab, where I built a website from scratch to hack into it! My goal for this project was to gain insight into common web vulnerabilities by seeing things from the perspectives of both the hacker and the developer. The tech stack used here: HTML/CSS for the front-end, JavaScript with Node.js/Express.js for the middleware and back-end code, and MySQL for the database. In this write-up, I'll cover SQL Injection and Cross-Site Scripting attacks, coupled with video demonstrations.  

**Disclaimer**: These techniques were done on a local instance of my website for educational purposes only. Using these hacking techniques on a live website without expressed written consent from the owner/admin is ILLEGAL.

## SQL Injection
An SQL Injection(SQLi) attack occurs when a threat actor can manipulate SQL queries through vulnerable user input fields on a website. This can give the threat actor access to sensitive information or even allow them to escalate their privileges.  

First, let's quickly review how the user, web server, and database interact. Suppose a user enters their username and password into a website's login form. The website's API then has the web server request that the database run an SQL query with the user's credentials. The database's response will be whether or not this pair of credentials exists in its records. Depending on the database's response, the web server will allow or deny the user access to the site.  

If the developer is not careful here, an attacker may be able to change the SQL query that reaches the database. Here is an example of an unsafe query([server.js, line 52](https://github.com/kevin-m-v/Web-Vulnerabilities-Lab/blob/main/server.js#L52)):
```js
connection.query("SELECT * FROM sql_injection WHERE user = '" + req.body.login_user + "' AND password = '" + req.body.login_password + "'",
```
The vulnerability is present because the user's input is not sanitized for special characters. If the attacker inputs `' OR 1=1;#` into the password field, the database will respond that the credential pair does exist since this is a true statement. This way, the attacker can access any user account without knowing the password. Here, I show the attack in action:  

https://github.com/user-attachments/assets/d70e020e-d996-430d-9fdc-e4a874cc2329

To fortify our queries against SQLi attacks, we must ensure that user inputs cannot change the code that reaches our database. Here is an example of a safe query that I use for the create user functionality([server.js, line 39](https://github.com/kevin-m-v/Web-Vulnerabilities-Lab/blob/main/server.js#L39)):
```js
connection.query("INSERT INTO sql_injection (user, password) VALUES (?,?)",
```
Instead of hard-coding the SQL syntax into the JavaScript code, we use a parameterized input that prevents special characters from impacting the SQL query. This will cut off this attack vector from threat actors trying to run custom queries on our database.

## Cross-Site Scripting
Cross-Site Scripting(XSS) allows a threat actor to inject malicious code into webpages viewed by legitimate users. The threat actor can use this vulnerability to execute code that accesses a victim's sensitive information. There are three types of XSS attacks: Stored, DOM-Based, and Reflected. We'll cover the most common type of XSS attack, Reflected XSS.  

XSS can allow attackers to retrieve a user's cookie data. A commonly stored cookie value is the session ID, which is a cookie that allows a user to maintain their session on the website without having to log in again. If an attacker obtains a legitimate user's session ID, they can then spoof this cookie value and steal that victim's logged-in session. This way, the attacker effectively skips authentication and compromises a victim's account without even knowing their credentials. This is called Session Hijacking, which is the attack I'll be simulating.

In this Reflected XSS attack scenario, the malicious JavaScript code is embedded in a URL that, when clicked by a user, runs on the user's browser and pulls their session ID from their browser's cookies.
