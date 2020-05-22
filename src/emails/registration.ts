import keys from '../keys';

export default ( email:string ) => {
   return {
    from: keys.BASE_URL,
    to: email,
    subject: 'Вы успешно создали аккаунт',
    html: `
    <h1>Добро пожаловать в погодное приложение</h1>
    <p>Вы успешно создали аккаунт с email -  ${email}</p>
    <hr />
    <a href=${keys.BASE_URL}>Погодное приложение</a>`
   }
}