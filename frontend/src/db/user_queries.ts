import prisma from "./prisma_client";

const createUser = async(username: string, email: string, password: string) => {
    console.log(username, email, password);
    const user = await prisma.user.create({
        data:{
            username,
            email,
            password
        }
    })

    return {
        userId: user.id,
        username: user.username
    }
}

const getFullUserObject = async(usernameOrEmail: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        }
    })

    return user;
}

const getUserWithoutPassword = async(usernameOrEmail: string, email: string | null) => {
    const OR_FILTER = email ? [
        { username: usernameOrEmail },
        { email: email }
    ] : [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
    ]


    const user = await prisma.user.findFirst({
        where: {
            OR: OR_FILTER
        },
        omit:{
            password:true
        }
    })

    return user;
}

const checkUserExists = async(userId: string, username: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
        where:{
            id_username:{
                id: userId,
                username
            }
        }
    })

    return Boolean(user);
}
export {
    createUser,
    getFullUserObject,
    getUserWithoutPassword,
    checkUserExists
}