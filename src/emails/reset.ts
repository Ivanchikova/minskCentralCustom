import keys from '../keys';

export default ( email:string, tolen:string ) => {
   return {
    from: keys.EMAIL_FROM,
    to: email,
    subject: 'Восстановение доступа',
    html: `
    <h1>Did you forget your password?</h1>
    <p>If not, ignore the letter</p>
    <p>Otherwise click below:</p>
    <p><a href="${keys.BASE_URL}/auth/password/${tolen}">Restore access</a></p>
    <hr />
    <a href=${keys.BASE_URL}>Weather application</a>`
   }
}