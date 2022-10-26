const otpgenerator = require('otp-generator')

const otpKeys = require("../utils/otp-keys");

const accountSid = otpKeys.accountSid;
const authToken = otpKeys.authToken;
const servieId = otpKeys.servieId;
const client=require('twilio')(accountSid,authToken)

module.exports={
    otpgeneratorto:()=>{
        console.log('masood')
        return otpgenerator.generate(4,{
            digits:true,
            upperCaseAlphabets:false,
            specialChars:false,
            lowerCaseAlphabets:false,
        })
    },
    otpsender:(otp)=>{
        return new Promise((resolve,reject)=>{
            client.messages
                .create({
                    body:`sent from your Hamrix food account : ${otp}`,
                    messagingServiceSid: otpKeys.servieId,
                    to: otpKeys.number
                })
                .then(message=>{
                    resolve(message)
                })
                .catch((err)=>{
                    console.log(err);
                })
                .done();
        })
    }
}
