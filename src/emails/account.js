const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'argote.john@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'argote.john@gmail.com',
        subject: 'Sorry to see you go!',
        text: `We hate to see you go ${name}. Please help us by letting us know what we could have done better.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}