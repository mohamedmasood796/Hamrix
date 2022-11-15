const otpgenerator = require('otp-generator')

const otpKeys = require("../utils/otp-keys");

const accountSid = otpKeys.accountSid;
const authToken = otpKeys.authToken;
const serviseId = otpKeys.servieId;
const client = require('twilio')(accountSid, authToken)

module.exports = {
    // otpgeneratorto:()=>{
    //     // console.log('masood')
    //     // return otpgenerator.generate(6,{
    //     //     digits:true,
    //     //     upperCaseAlphabets:false,
    //     //     specialChars:false,
    //     //     lowerCaseAlphabets:false,
    //     // })
    // },
    otpsender: (Mobile) => {
        return new Promise((resolve, reject) => {
            // client.messages
            //     .create({
            //         body:`sent from your Hamrix food account : ${otp}`,
            //         messagingServiceSid: otpKeys.servieId,
            //         to: otpKeys.number
            //     })
            //     .then(message=>{
            //         resolve(message)
            //     })
            //     .catch((err)=>{
            //         console.log(err);
            //     })
            //     .done();

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
