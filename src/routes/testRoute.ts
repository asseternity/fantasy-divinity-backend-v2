import express from "express";
import testController from "../controllers/testController";

const testRoute = express.Router();

testRoute.get("/empty", testController.emptyAsyncMiddleware);
testRoute.get("/latest_user", testController.findLatestUser);
testRoute.get("/user/:user_name", testController.findUser);

export default testRoute;
