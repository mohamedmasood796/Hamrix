// getCart: async (req, res) => {
//     const productId = req.params.proId
//     const quantity = parseInt(req.params.qty)
//     try {
//         const findProduct = await Product.findById(productId)
//         const price = findProduct.price
//         const name = findProduct.name
//         if (findProduct.quantity >= quantity) {
//             findProduct.quantity -= quantity
//             const userId = req.session.user._id
//             let cart = await Cart.findOne({ userId })
//             if (cart) {
//                 /Cart is exists for user/
//                 let itemIndex = cart.Products.findIndex(p => p.productId == productId)
//                 if (itemIndex > -1) {
//                     /* products exist in the cart and update the quantity*/
//                     let productItem = cart.Products[itemIndex]
//                     productItem.quantity += quantity
//                 }
//                 else {
//                     /products does not exists in cart,add new item/
//                     cart.Products.push({ productId, quantity, name, price })
//                 }
//                 //proce add chayyannm
//                 cart.total = cart.Products.reduce((acc, curr) => {
//                     return acc + curr.quantity * curr.price
//                 }, 0)
//                 await cart.save()
//             }
//             else {
//                 /*creating a new cart for a user */
//                 const total = quantity * price
//                 cart = new Cart({
//                     userId: userId,
//                     Products: [{ productId, quantity, name, price }],
//                     total: total
//                 })
//                 await cart.save()
//             }
//             res.json({ status: true })
//         }
//         else {
//             res.json({ status: true })
//         }
//     }
//     catch (err) {
//         res.json({ status: true })
//     }

// },
// /-------------cart view-------------------------------/
// cartView: async (req, res) => {
//     if (req.session.userloggedin) {
//         const userId = req.session.user._id
//         const viewcart = await Cart.findOne({ userId: userId }).populate("Products.productId").exec()

//         if (viewcart) {
//             req.session.cartNumber = viewcart.Products.length
//         }
//         const wishlist = await Wishlist.findOne({ userId: userId }).populate("myWish.productId").exec()
//         if (wishlist) {
//             req.session.wishlistNumber = wishlist.myWish.length
//         }
//         res.render('user/viewCart', { login: req.session.userloggedin, users: req.session.user, cartProducts: viewcart, wishlistNumber: req.session.wishlistNumber, cartNumber: req.session.cartNumber })
//     } else {
//         res.redirect('/userLogin')
//     }

// },

// /----------------change quantity--------------------------/
// changeQuantity: async (req, res) => {
//     let productId = req.params.proId.toString()
//     let changeStatus = req.params.changeStatus
//     let userId = req.session.user._id
//     let cart = await Cart.findOne({ userId })
//     let itemIndex = cart.Products.findIndex(p => p._id == productId)
//     let productItem = cart.Products[itemIndex]
//     if (changeStatus == -1) {
//         productItem.quantity -= 1
//     } else {
//         productItem.quantity += 1
//     }
//     cart.total = cart.Products.reduce((acc, curr) => {
//         return acc + curr.quantity * curr.price
//     }, 0)
//     await cart.save()
//     res.json({ status: true })
// },

// /---------------delete cart item--------------------/
// deleteCartItem: async (req, res) => {
//     let productId = req.params.proId
//     let userId = req.session.user._id
//     let cart = await Cart.findOne({ userId })
//     let itemIndex = cart.Products.findIndex(p => p._id == productId)
//     cart.Products.splice(itemIndex, 1)
//     cart.total = cart.Products.reduce((acc, curr) => {
//         return acc + curr.quantity * curr.price
//     }, 0)
//     await cart.save()
//     res.json({ status: true })
// },