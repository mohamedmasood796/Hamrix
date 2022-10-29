// getUserCart:async(req,res)=>{
//     let productId = req.params.id
//     let userId = req.session.user._id

//     let productExist = await cartModel.aggregate([
//         { $match: { UserId: userId } },
//         { $unwind: '$products' },
//         { $match: { 'products.productId': productId } },
//       ]);
//     cartModel.findOne({UserId:userId},async(err,data)=>{
//         if(data){
//                 if(productExist.length!==0){
//                     await cartModel.updateOne({UserId:userId,'products.productId':productId},{
//                         $inc : {
//                             'products.$.quantity' : 1
//                         }
//                     })
                    
//                 }else{
//                     await cartModel.updateOne({UserId:userId},{
//                         $push:{
//                             products : {
//                                 productId : productId ,
//                                 quantity : 1 
//                             }
//                         }
//                     })
//                 }
           
//         }else{
//             const cart = new cartModel ({
//                 UserId : userId,
//                 products : {
//                     productId : productId,
//                     quantity: 1 
//                 }
//             })
//             cart.save()
//         }
//     })
// },