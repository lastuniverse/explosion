var explosion = require( '../../../explosion' );
var router = explosion.Router();

// middleware that is specific to this router
router.use( function (req, res, next) {
  console.log('test router 1:', res.message );
  res.broadcast();
  next();
});

// создаем еще обработчик для '/system/chat'
router.use('/chat', function (req, res, next) {
  console.log('test router 2:', res.message );
  res.broadcast();
  next();
});

module.exports = router;
