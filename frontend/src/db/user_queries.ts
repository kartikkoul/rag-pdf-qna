import { randomBytes } from "crypto";
import prisma from "./prisma_client";

function deriveUsernameFromGoogle(email: string, displayName?: string) {
  const raw = (displayName || email.split("@")[0] || "user")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  const base = raw.length >= 3 ? raw.slice(0, 20) : `${raw || "user"}_usr`.slice(0, 20);
  return base.padEnd(3, "0").slice(0, 20);
}

async function ensureUniqueUsername(base: string): Promise<string> {
  let candidate = base.slice(0, 20);
  for (let n = 0; n < 1000; n++) {
    const exists = await prisma.user.findFirst({ where: { username: candidate } });
    if (!exists) return candidate;
    const suffix = `_${n + 1}`;
    candidate = (base.slice(0, Math.max(0, 20 - suffix.length)) + suffix).slice(0, 20);
  }
  return `${base.slice(0, 10)}_${randomBytes(4).toString("hex")}`.slice(0, 20);
}

const createUser = async(username: string, email: string, password: string) => {
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

const getUserByGoogleSub = async (googleSub: string) => {
    return prisma.user.findFirst({
        where: { googleSub },
    });
};

const getUserByEmail = async (email: string) => {
    return prisma.user.findFirst({
        where: { email },
    });
};

const linkGoogleSub = async (userId: string, username: string, googleSub: string) => {
    await prisma.user.update({
        where: {
            id_username: { id: userId, username },
        },
        data: { googleSub },
    });
};

const createUserFromGoogle = async (
    email: string,
    displayName: string | undefined,
    googleSub: string,
) => {
    const password = randomBytes(32).toString("hex");
    const baseUsername = deriveUsernameFromGoogle(email, displayName);
    const username = await ensureUniqueUsername(baseUsername);
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password,
            googleSub,
        },
    });
    return {
        userId: user.id,
        username: user.username,
    };
};

export {
    createUser,
    getFullUserObject,
    getUserWithoutPassword,
    checkUserExists,
    getUserByGoogleSub,
    getUserByEmail,
    linkGoogleSub,
    createUserFromGoogle,
}