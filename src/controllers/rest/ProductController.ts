import { Request, Response } from 'express';
import * as ProductService from "$services/ProductService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';

export async function importProduct(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await ProductService.importProduct(req.body.fileUrl);

    // Error handling if service response having an error : 
    if(!serviceResponse.status) return handleServiceErrorWithResponse(res, serviceResponse)

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function getImportStatus(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await ProductService.getImportStatus(req.params.id);

    // Error handling if service response having an error : 
    if(!serviceResponse.status) return handleServiceErrorWithResponse(res, serviceResponse)

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}