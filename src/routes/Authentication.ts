import { Router } from "express";
import * as AuthenticationController from "$controllers/rest/AuthenticationController"

const AuthenticationRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

AuthenticationRoutes.post("/",
    AuthenticationController.authenticate
)

export default AuthenticationRoutes