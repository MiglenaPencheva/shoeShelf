const Product = require('../models/Product');
// const User = require('../models/User');

async function getAll(query) {
    return await Product
        .find({ title: { $regex: query || '', $options: 'i' } })
        .sort({ boughtBy: -1 })
        .lean();
}

async function getOne(productId, userId) {
    let product = await Product.findById(productId).lean();
    product.isOwn = product.creator == userId;
    if (product.boughtBy) {
        product.isBought = product.boughtBy.toString().includes(userId);
    }
    return product;
}

async function getMy(userId) {
    let myProducts = await Product.find({ boughtBy: userId } );
    if (myProducts) {
        myProducts.areBought = myProducts.length > 0;
        myProducts.count = myProducts.length;
        // myProducts.total = myProducts.reduce((a, b) => a + b, 0);
    }
    console.log('service: ');
    console.log(myProducts.areBought);
    console.log(myProducts.count);
    return myProducts;
}

async function create(productData, userId) {
    let product = new Product(productData);
    product.creator = userId;
    return product.save();
}

async function buy(productId, userId) {
    let product = await Product.findById(productId);
    
    if (product.creator == userId) return;
    if (product.boughtBy.toString().includes(userId)) return;

    product.boughtBy.push(userId);
    product.isBought = true;
    return product.save(); 
}

async function edit(productId, editedData) {
    return await Product.updateOne({ _id: productId }, editedData);
}

async function remove(productId) {
    return await Product.deleteOne({ _id: productId });
}


module.exports = {
    getAll,
    getOne,
    getMy,
    create,
    buy,
    edit,
    remove,
};