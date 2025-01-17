import { Request, Response } from 'express';
import * as AuthenticationService from "$services/AuthenticationService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';

export async function authenticate(req:Request, res:Response):Promise<Response>{
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    const serviceResponse = await AuthenticationService.authenticate(data);

    // Error handling if service response having an error : 
    if(!serviceResponse.status) return handleServiceErrorWithResponse(res, serviceResponse)

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}