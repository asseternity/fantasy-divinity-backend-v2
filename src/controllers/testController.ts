import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response, NextFunction } from "express";

const emptyAsyncMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({ message: "empty" });
  } catch (err) {
    next(err);
  }
};

const findLatestUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ user: users[0] });
  } catch (err) {
    next(err);
  }
};

const findUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_name = req.params.user_name;
    const user = await prisma.user.findFirst({
      where: {
        name: user_name,
      },
    });
    return res.status(200).json({ user: user });
  } catch (err) {
    next(err);
  }
};

export default { emptyAsyncMiddleware, findLatestUser, findUser };
