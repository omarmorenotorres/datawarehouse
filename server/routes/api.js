const router = require('express').Router();
const apiRegionsRouter = require('./api/regions');
const apiCountriesRouter = require('./api/country');
const apiCityRouter = require('./api/city');
const apiUsersRouter = require('./api/user');
const apiCompanyRouter = require('./api/company');
//const apiChanelRouter = require('./api/chanel');
const apiContactRouter = require('./api/contact');
/*const apiProductsRouter = require('./api/products');
const apiOrdersRouter = require('./api/orders');*/
const middleware = require('../middlewares/middlewares');
    
router.use('/regions', /*middleware.checkToken,*/ apiRegionsRouter);
router.use('/countries'/*, middleware.checkToken*/, apiCountriesRouter);
router.use('/city',/* middleware.checkToken,*/ apiCityRouter);
router.use('/users', /*middleware.checkToken,*/ apiUsersRouter);
router.use('/company', /*middleware.checkToken,*/ apiCompanyRouter);
//router.use('/chanel', /*middleware.checkToken,*/ apiChanelRouter);
router.use('/contact', /*middleware.checkToken,*/ apiContactRouter);
/*router.use('/orders', middleware.checkToken, apiOrdersRouter);*/

module.exports = router;
