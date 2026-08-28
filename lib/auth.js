import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined in .env.local");
}

const JWT_SECRET = new TextEncoder().encode(secret);

export async function createToken(user) {
  return await new SignJWT({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.split(" ")[1];
  }

  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...value] = cookie.trim().split("=");

      return [key, value.join("=")];
    })
  );

  return cookies.token || null;
}

export async function getUserFromRequest(request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}