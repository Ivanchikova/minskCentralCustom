import keys from '../keys';

export default ( email:string, tolen:string ) => {
   return {
    from: keys.EMAIL_FROM,
    to: email,
    subject: 'Восстановение доступа',
    html: `
    <h1>Вы забыли свой пароль??</h1>
    <p>Если нет, игнорируйте это письмо</p>
    <p>Для восстановления перейдите по ссылке ниже:</p>
    <p><a href="${keys.BASE_URL}/auth/password/${tolen}">Восстановить пароль</a></p>
    <hr />
    <a href=${keys.BASE_URL}>Минская центральная таможня</a>`
   }
}