// xports.addToCart = async (req, res) => {

//     const productId = req.params.proId
//     const quantity = parseInt(req.params.qty)

//     try {
//         console.log('11');
//         const findProduct = await Product.findById(productId)
//         const price = findProduct.Price
//         const name = findProduct.Name
//         console.log(findProduct.Quantity);
//         if (findProduct.Quantity >= quantity) {
//             console.log('1');
//             findProduct.Quantity -= quantity
//             const userId = req.session.user._id
//             let cart = await cartModel.findOne({ userId });
//             if (cart) {
//                 console.log('2');

//                 //cart exists for user
//                 let itemIndex = cart.products.findIndex(p => p.productId == productId);
//                 console.log(itemIndex, '666666666');
//                 if (itemIndex > -1) {
//                     console.log('3');

//                     //product exists in the cart, update the quantity
//                     let productItem = cart.products[itemIndex];
//                     productItem.quantity += quantity;
//                 } else {
//                     //product does not exists in cart, add new item
//                     cart.products.push({ productId, quantity, name, price });
//                 }
//                 cart.total = cart.products.reduce((acc, curr) => {
//                     return acc + curr.quantity * curr.price;
//                 }, 0)

//                 await cart.save()
//             } else {
//                 console.log('4');

//                 //no cart for user, create new cart
//                 const total = quantity * price

//                 cart = new cartModel({
//                     userId: userId,
//                     products: [{ productId, quantity, name, price }],
//                     total: total
//                 });
//                 await cart.save()
//             }
//             res.json({ status: true })
//             // res.status(201).json({ message: "cart item updated" })
//         } else {
//             res.json({ status: true })

//             // return res.status(200).json({ message: "item not available" })
//         }
//     } catch (err) {
//         console.log(err);
//         res.json({ status: true })

//         //   res.status(500).send({ err });
//     }
// }















// addToCart: async (req, res) => {
//     if (req.session.user) {
//         const userId = req.session.user._id
//         console.log("heyheyhey" + userId);
//         productId = req.params.proId
//         const findProduct = await productCollection.findById(productId)
//         console.log(findProduct);
//         const price = findProduct.Price
//         const name = findProduct.Name
//         const userCart = await cartSchema.findOne({ userId })
//         // if user already has a cart
//         if (userCart) {
//             let itemIndex = userCart.products.findIndex(p => p.productId == productId);
//             console.log(itemIndex + "indexxxxxxxx");
//             if (itemIndex > -1) {
//                 //  then the product already exist
//                 let productItem = userCart.products[itemIndex];
//                 console.log(productItem);
//                 res.redirect('/')
//             } else {
//                 // product is not in cart
//                 console.log(userCart.products);
//                 userCart.products.push({ productId, name, price });
//                 await userCart.save()
//             }


//         } else {
//             const newCart = new cartSchema({
//                 userId: getUserId,
//                 products: [{ productId, name, price }],
//                 total: 1
//             })
//             await newCart.save()
//             res.redirect('/')
//         }
//         //     
//     }

// },



//     addToCart: async (req, res) => {
//         if (req.session.user) {
//             let quantity = req.params.quantity
//             const userId = req.session.user._id
//             cartProductQuantity = 1;
//             // console.log("heyheyhey" + userId);
//             if (quantity > 0) {
//                 productId = req.params.proId
//                 const findProduct = await productCollection.findById(productId)
//                 // console.log(findProduct);
//                 const price = findProduct.Price
//                 const name = findProduct.Name
//                 const userCart = await cartSchema.findOne({ userId })
//                 // if user already has a cart
//                 if (userCart) {
//                     let itemIndex = userCart.products.findIndex(p => p.productId == productId);
//                     console.log(itemIndex + "indexxxxxxxx");
//                     if (itemIndex > -1) {
//                         //  then the product already exist
//                         let productItem = userCart.products[itemIndex]
//                         productItem.quantity++;
//                         console.log(productItem.quantity);

//                         // let qtyproduct = await cartSchema.findOneAndUpdate({
//                         //     userId :userId}, {$inc : {'products.quantity' : 1}}).exec();
//                         //     qtyproduct.save()
//                         res.redirect('/')
//                     } else {
//                         // product is not in cart
//                         console.log(userCart.products);
//                         userCart.products.push({ productId, quantity: 1, name, price });
//                         await userCart.save()
//                         res.redirect('/')
//                     }
//                     userCart.total = userCart.products.reduce((acc, curr) => {
//                         return acc + curr.quantity * curr.price;
//                     }, 0)


//                     await userCart.save()
//                 } else {
//                     const newCart = new cartSchema({
//                         userId: userId,
//                         products: [{ productId, quantity: 1, name, price }],
//                         total: cartProductQuantity * price
//                     })
//                     await newCart.save()
//                     res.redirect('/')
//                 }
//                 //      
//             } else {
//                 console.log("OUT OF STOCK");
//             }
//         } else {
//             res.redirect('/login')
//         }


//     },
