const otpgenerator = require('otp-generator')

const otpKeys = require("../utils/otp-keys");

const accountSid = process.env.ACCOUNT_Sid;
const authToken = process.env.AUTHTOKEN;
const serviseId = process.env.SERVIEId;
const client = require('twilio')(accountSid, authToken)

module.exports = {
   
    otpsender: (Mobile) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(serviseId)
                .verifications
                .create({ to: `+91${Mobile}`, channel: 'sms' })
                .then(verification => {
                    console.log(verification.status)
                    resolve()
                });
        })
    }
}
