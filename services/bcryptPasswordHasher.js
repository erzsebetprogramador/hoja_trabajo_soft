const bcrypt = require("bcryptjs");

class BcryptPasswordHasher {
    async hash(password) {
        return bcrypt.hash(password, 10);
    }
}

module.exports = BcryptPasswordHasher;
