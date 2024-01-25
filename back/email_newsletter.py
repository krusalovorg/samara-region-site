import smtplib
from email.mime.text import MIMEText
import config

register_text = 'Не забывайте сохранить свои учетные данные в надежном месте.\n' \
                'В случае утери пароля, вы всегда можете его восстановить\n' \
                'Благодарим за выбор наших услуг! Желаем вам приятного путешествия по миру "Чудеса Самарского края.'

register_title = 'Добро пожаловать на сайт Чудеса Самарского края! Регистрация прошла успешно'

login_text = 'Мы рады сообщить вам о успешном входе в ваш аккаунт на сайте "Чудеса Самарского края".\n' \
             'Ваше вход был авторизован, и теперь вы можете полноценно пользоваться всеми возможностями нашего портала..\n' \
             'Благодарим вас за использование наших услуг.\n' \
             'Если у вас возникнут вопросы или замечания, не стесняйтесь обращаться к нам. Мы всегда готовы помочь.'

login_title = 'Успешный вход в ваш аккаунт на сайте Чудеса Самарского края'

reset_title = "Вы получили это письмо, потому что запросили восстановление пароля на сайте Чудеса Самарского края."

reset_text = "Чтобы установить новый пароль для вашей учетной записи, пожалуйста, введите следующий код подтверждения в соответствующее поле на сайте:Код восстановления: "


def send_email(receiver_email, text, title):
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    try:
        server.login(config.sender_email, config.password_email)
        msg = MIMEText(text)
        msg['Subject'] = title
        server.sendmail(config.sender_email, receiver_email, msg.as_string())

        return "Message was sent"
    except Exception as _ex:
        return f"{_ex}\n check your password"

