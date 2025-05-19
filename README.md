# Web-Vulnerabilities-Lab
Welcome to my cybersecurity lab, where I built a website from scratch to simulate attack scenarios. My goal was to gain practical, hands-on experience in identifying and mitigating common web vulnerabilities while exploring the perspectives of both the hacker and the developer. The tech stack I employed: HTML/CSS for the front-end, JavaScript with Node.js/Express.js for the middleware and back-end operations, and MySQL for the database. In this writeup, I'll cover SQL Injection and Cross-Site Scripting attacks, accompanied by video demonstrations.

**Disclaimer**: These techniques were done on a local instance of my website for educational purposes only. Using these hacking techniques on a live website without expressed written consent from the owner/admin is against the law.

## SQL Injection
An SQL Injection(SQLi) attack occurs when a threat actor manipulates SQL queries through vulnerable user input fields on a website. This can lead to unauthorized access to sensitive information or even privilege escalation.  

First, let's quickly review how the user, web server, and database interact on my website. Consider this login process:
1. **User Input**: A user enters their username and password into a website's login form.
2. **Fetch Request**: Through the website’s API, the user sends a POST request to the web server with the given credentials.
3. **Verification**: The web server queries the database for the provided credentails. If the query returns `NULL`, the user is denied access because the credential pair does not exist.  

### SQLi Demonstration

If the developer is not careful here, an attacker may be able to change the SQL query that reaches the database. Here is an example of an unsafe query([server.js, line 52](https://github.com/kevin-m-v/Web-Vulnerabilities-Lab/blob/main/server.js#L52)):
```js
connection.query("SELECT * FROM sql_injection WHERE user = '" + req.body.login_user + "' AND password = '" + req.body.login_password + "'",
```
The vulnerability is present because the user's input is not sanitized for special characters. If the attacker inputs `' OR 1=1;#` into the password field, the condition 1=1 will make the query always return `True`. As a result, the injected statement will be treated as a valid credential pair, granting unauthorized access to the account. Here, I show the attack in action:  

https://github.com/user-attachments/assets/d70e020e-d996-430d-9fdc-e4a874cc2329

### Mitigation through Parameterization

To fortify our queries against SQLi attacks, it is crucial to prevent user input from altering the intended SQL code. Instead of hard-coding the SQL syntax into the JavaScript code, we use a parameterized input that prevents special characters from impacting the SQL query. Here is an example of a safe query that I use for the "Create User" functionality([server.js, line 39](https://github.com/kevin-m-v/Web-Vulnerabilities-Lab/blob/main/server.js#L39)):

```js
connection.query("INSERT INTO sql_injection (user, password) VALUES (?,?)",
```

By using parameterization, special characters in the user input do not affect the underlying SQL syntax, mitigating the risk of an SQLi attack.

## Cross-Site Scripting
Cross-Site Scripting(XSS) allows a threat actor to inject malicious code into webpages viewed by legitimate users. The threat actor can use this vulnerability to execute code that accesses a victim's sensitive information. There are three types of XSS attacks: Stored, DOM-Based, and Reflected. We'll cover the most common type of XSS attack, Reflected XSS.  

One primary risk of XSS is session hijacking. XSS can allow attackers to retrieve a user's cookie data. A commonly stored cookie value for web applications is the session ID, which allows users to maintain their login state. If an attacker obtains a legitimate user's session ID, they can spoof the cookie value and impersonate the victim without needing their login credentials, effectively skipping the authentication step.

### Reflected XSS Demonstration

In the following scenario, I exploit a vulnerability in the user-inputted query field on the webpage to run JavaScript code that extracts the session ID and shows it in an alert:

https://github.com/user-attachments/assets/19c240f0-7086-42f7-b77b-2fd0cfe71f16

The query input appears within the URL as part of the parameters. Using social engineering techniques, an attacker could make a well-crafted email and trick users into clicking a URL that contains malicious code.  

The attack works by using an HTML image tag with an empty source, which will throw an error. Then, we can use the `onerror` function to run the injected JavaScript code. The vulnerability here is that the user input for the query field on the webpage is rendered as HTML rather than plaintext([xss.html, line 37](https://github.com/kevin-m-v/Web-Vulnerabilities-Lab/blob/main/views/xss.html#L37)):

```js
document.getElementById('query-output').innerHTML = query
```

This line of code essentially allows any custom script to run on the website, as the browser will recognize the script as just part of the webpage. 

### Preventing XSS

To mitigate this vulnerability, we need to ensure that the webpage only recognizes the *visible* text within the user input. We can do this by using `innerText` instead of `innerHTML`:

```js
document.getElementById('query-output').innerText = query
```

Unlike `innerHTML`, which retrieves the HTML markup within the element, `innerText` excludes the HTML tags and hidden content within the element. Thus, the `<img>` and `<script>` tags used for XSS will no longer be injected into the browser.  

## Conclusion
These examples demonstrate how a single line of code can introduce critical vulnerabilities that often go undetected. Staying current with secure coding practices is essential for defending against SQL injection, cross-site scripting, and other common attack vectors. Thank you for engaging with this project; I trust it has provided valuable insights into the importance of web security.
