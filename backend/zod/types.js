const {zod} = require('zod');

const createUser = zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    email: zod.string().email(),
    password: zod.string.min(6)
})

const createAdmin = zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    email: zod.string().email(),
    password: zod.string.min(6)
})

module.exports({
    createUser: createUser, 
    createAdmin: createAdmin
})