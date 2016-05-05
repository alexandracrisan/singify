const multer  = require('multer');
const storage = multer.diskStorage({});
var instance;

module.exports.init = function(app) {
	if (instance) {
		return instance;
	}

	instance = multer({ storage: storage });
console.log('instance,', instance);
	return instance;
};
