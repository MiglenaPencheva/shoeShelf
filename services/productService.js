const Product = require('../models/Product');

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
    let myProducts = await Product.find({ boughtBy: userId } ).lean();
    
    myProducts.count = myProducts.length;
    myProducts.total = 0;
    for (const p of myProducts) {
        myProducts.total += Number(p.price);
    }
    myProducts.total = myProducts.total.toFixed(2);

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