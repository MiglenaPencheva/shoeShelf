const Product = require('../models/Product');

async function getAll(query) {
    return await Product
        .find({ title: { $regex: query || '', $options: 'i' } })
        .sort({ likedBy: -1 })
        .lean();
}

async function getOne(productId, userId) {
    let product = await Product.findById(productId).lean();
    product.isOwn = product.creator == userId;
    if (product.likedBy) {
        product.isLiked = product.likedBy.toString().includes(userId);
    }
    return product;
}

async function create(productData, userId) {
    let product = new Product(productData);
    product.creator = userId;
    return product.save();
}

async function like(productId, userId) {
    let product = await Product.findById(productId);
    
    if (product.creator == userId) return;
    if (product.likedBy.toString().includes(userId)) return;

    product.likedBy.push(userId);
    product.isLiked = true;

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
    create,
    like,
    edit,
    remove,
};