// dependencies
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import path from "node:path";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const app = express();

// Diagnostics
console.log("=== Startup diagnostics ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT (from env):", process.env.PORT);
console.log(
  "DATABASE_URL (masked):",
  process.env.DATABASE_URL ? "✅ set" : "❌ missing"
);
console.log("PWD:", process.cwd());
console.log("CWD files:", require("fs").readdirSync("."));
console.log(
  "Dist files:",
  require("fs").existsSync("./dist")
    ? require("fs").readdirSync("./dist")
    : "no dist dir"
);
console.log("============================");

// Prisma
let prisma!: PrismaClient;
try {
  prisma = new PrismaClient();
  console.log("✅ Prisma client initialized successfully");
} catch (err) {
  console.error("❌ Prisma initialization failed:", err);
}

// cors
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// test routes
app.get("/test", async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: "World" });
});

app.get(
  "/get-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json({ users: users });
    } catch (err) {
      return next(err);
    }
  }
);

app.get(
  "/add-user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await prisma.user.create({
        data: {
          name: "test",
        },
      });
      const responseString: string =
        "Hello, World! Created a user with the following id: " + newUser.id;
      return res.status(200).json({ message: responseString });
    } catch (err) {
      return next(err);
    }
  }
);

// launch
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});
