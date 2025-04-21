# Web-Vulnerabilities-Lab
Welcome to my cybersecurity lab, where I built a website from scratch to hack into it! My goal for this project was to gain insight into common web vulnerabilities by seeing things from the perspectives of both the hacker and the developer. The tech stack used here: HTML/CSS for the front-end, JavaScript with Node.js/Express.js for the middleware and back-end code, and MySQL for the database. In this write-up, I'll cover SQL Injection and Cross-Site Scripting attacks, coupled with video demonstrations.  
**Disclaimer**: The techniques shown here were done on a local instance of my website for educational purposes only. Using these hacking techniques on a live website without expressed written consent from the owner/admin is ILLEGAL.

## SQL Injection
An SQL Injection(SQLi) attack occurs when a threat actor can manipulate SQL queries through vulnerable user input fields on a website. This can give the threat actor access to sensitive information or even allow them to escalate their privileges.  
First, let's quickly review how the user, web server, and database interact. Suppose a user enters their username and password into a website's login form. The website's API then has the web server request that the database run an SQL query with the user's credentials. The database's response will be whether or not this pair of credentials exists in its records. Depending on the database's response, the web server will allow or deny the user access to the site.  
If the developer is not careful here, an attacker may be able to change the SQL query that reaches the database. Here is an example of an unsafe query:
```js
connection.query("SELECT * FROM sql_injection WHERE user = '" + req.body.login_user + "' AND password = '" + req.body.login_password + "'",
```
The vulnerability presents itself because the user's input is not sanitized for special characters. If the attacker inputs `' OR 1=1;#` into the password field, the database will respond that the credential pair does exist since this is a true statement. This way, the attacker can access any user account without knowing the password. Here, I show the attack in action:  

https://github.com/user-attachments/assets/d70e020e-d996-430d-9fdc-e4a874cc2329

