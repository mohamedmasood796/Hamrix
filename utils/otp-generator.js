const otpgenerator = require('otp-generator')

const accountSid ='ACe4503322fe45a5e9c31d0854c5668928'
const authToken ='70d2d899c0f431868bbe0762357820de'
const servieId ='MG43ce09544b7c6f8e9ecd645c4cbb5a49'
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
                    messagingServiceSid:'MG43ce09544b7c6f8e9ecd645c4cbb5a49',
                    to:`+917510260135`
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
