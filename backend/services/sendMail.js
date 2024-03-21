const nodemailer = require('nodemailer');

function sendCodeToEmail(email, code) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: 'testvue123456@gmail.com',
            pass: 'dwov ivac vxmn upig'
        },
        tls: {
            rejectUnauthorized: false //ideiglenes
        }
    });

    const mailOptions = {
        from: 'testvue123456@gmail.com',
        to: email,
        subject: '2FA kód',
        text: `A 2FA kódod: ${code}`
    };

    const info = transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendCodeToEmail;