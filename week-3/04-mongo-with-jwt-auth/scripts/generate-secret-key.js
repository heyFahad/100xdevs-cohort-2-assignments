const { randomBytes } = require('node:crypto');

// Generate a random 256-bit (32 bytes) key
randomBytes(32, (error, buffer) => {
    if (error) {
        throw error;
    }

    console.log(buffer.toString('hex'));
});
