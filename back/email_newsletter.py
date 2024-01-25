import smtplib
import ssl
from email.mime.text import MIMEText
import config

register_title = "Добро пожаловать на сайт Чудеса Самарского Края!"
register_text = "Здравствуйте, {username}! \n\nСпасибо за регистрацию на сайте Чудеса Самарского Края. Мы рады приветствовать вас на нашем ресурсе. \n\nС уважением, \nКоманда Чудеса Самарского Края"

login_title = "Добро пожаловать обратно на сайт Чудеса Самарского Края!"
login_text = "Здравствуйте, {username}! \n\nВы успешно вошли на сайт Чудеса Самарского Края. Насладитесь удивительными местами и информацией о нашем крае. \n\nС уважением, \nКоманда Чудеса Самарского Края"

reset_title = "Сброс пароля для сайта Чудеса Самарского Края"
reset_text = "Здравствуйте, {username}! \n\nВы запросили сброс пароля для вашего аккаунта на сайте Чудеса Самарского Края. Ваш временный код для сброса пароля: {code} \n\nС уважением, \nКоманда Чудеса Самарского Края"

def send_email(receiver_email, text, title):
    smtp_server = "smtp.mail.ru"
    port = 465
    sender_email = config.sender_email
    password_email = config.password_email

    message = MIMEText(text)
    message["Subject"] = title
    message["From"] = sender_email
    message["To"] = receiver_email

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password_email)
        server.sendmail(sender_email, receiver_email, message.as_string())