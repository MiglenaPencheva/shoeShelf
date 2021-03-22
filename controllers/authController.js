const router = require('express').Router();
const { register, login } = require('../services/authService');
const { getMy } = require('../services/productService');
const { COOKIE_NAME } = require('../config/config');
const { isLogged, isGuest } = require('../middlewares/authMiddleware');

router.get('/login', isGuest, (req, res) => {
    res.render('login');
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email) throw { message: 'Email required' };
        if (!password) throw { message: 'Password required' };
        
        let token = await login(email, password);
        res.cookie(COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');

    } catch (error) {
        return res.render('login', { error });
    }
});

router.get('/register', isGuest, (req, res) => {
    res.render('register');
});

router.post('/register', isGuest, async (req, res) => {
    let { email, fullName, password, rePassword } = req.body;
    
    try {
        if (!email) throw { message: 'Email required' };
        if (!fullName) fullName = '';
        if (!password) throw { message: 'Password required' };
        if (!rePassword) throw { message: 'Password required' };
        if (password != rePassword) throw { message: 'Password missmatch!' };
        
        await register(email, password);

        let token = await login(email, password);
        res.cookie(COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');

    } catch (error) {
        return res.render('register', { error });
    }
});

router.get('/logout', isLogged, (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/auth/login');
});

router.get('/profile', isLogged, async (req, res) => {
    let myProducts = await getMy(req.user._id);
    res.render('profile', { myProducts });
});

module.exports = router;