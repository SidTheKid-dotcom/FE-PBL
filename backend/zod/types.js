const {z} = require('zod');

const createUser = z.object({
    firstname: z.string(),
    lastname: z.string(),
    mobile: z.string().length(10),
    email: z.string().email(),
    password: z.string().min(6)
})

const createAdmin = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

module.exports = ({
    createUser: createUser, 
    createAdmin: createAdmin
})