const router = require('express').Router();
const { create, getOne, like, edit, remove } = require('../services/productService');

router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/create', async (req, res) => {
    let productData = extractData(req);

    try {
        if (!productData.title) throw { message: 'Title is required' };
        if (!productData.description) throw { message: 'Description is required' };
        if (!productData.imageUrl) throw { message: 'Image is required' };

        await create(productData, req.user._id);
        res.redirect('/');
    } catch (error) {
        res.render('create', { error });
    }
});

router.get('/:id/details', async (req, res) => {
    let product = await getOne(req.params.id, req.user._id);
    res.render('details', { product });
});

router.get('/:id/like', async (req, res) => {
    try {
        let product = await like(req.params.id, req.user._id);
        res.render('details', { product }); 
    } catch (error) {
        res.render('details', { error });
    }
});

router.get('/:id/edit', async (req, res) => {
    let product = await getOne(req.params.id, req.user._id);
    res.render('edit', product);
});

router.post('/:id/edit', async (req, res) => {
    let productData = extractData(req);
    try {
        if (!productData.title) throw { message: 'Title is required' };
        if (!productData.description) throw { message: 'Description is required' };
        if (!productData.imageUrl) throw { message: 'Image is required' };

        const product = await getOne(req.params.id, req.user._id);
        if (product.creator == req.user._id) {
            await edit(req.params.id, productData);
            res.redirect(`/product/${req.params.id}/details`);
        }
    } catch (error) {
        res.render('edit', { error });
    }
});

router.get('/:id/delete', async (req, res) => {
    try {
        let product = await getOne(req.params.id, req.user._id);
        if (product.creator == req.user._id) {
            await remove(req.params.id);
            res.redirect('/');
        }
    } catch (error) {
        res.render('delete', { error });
    }
});

function extractData(req) {
    let { title, description, imageUrl } = req.body;

    return productData = {
        title,
        description,
        imageUrl,
    };
}

module.exports = router;