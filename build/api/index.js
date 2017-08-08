'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('./account');

var _account2 = _interopRequireDefault(_account);

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//data contests 배열에 첫값부터 차례로 실행. 결국 return값은 모든 값이 들어가 있는 배열이 될 것.
//reduce의 두 번째 값은 초기값. 즉, 초기값인 empty 객체에 저장.


router.use('/*', function (req, res, next) {
  next();
});

router.use('/account', _account2.default);
router.use('/post', _post2.default);
router.use('/category', _category2.default);
router.use('/comment', _comment2.default);
router.use('/image', _image2.default);

exports.default = router;