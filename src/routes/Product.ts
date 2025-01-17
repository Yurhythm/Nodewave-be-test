import { Router } from "express";
import * as ProductController from "$controllers/rest/ProductController"

const ProductRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

ProductRoutes.get("/",
    ProductController.getDataProduct
)

ProductRoutes.post("/import",
    ProductController.importProduct
)

ProductRoutes.get("/upload-status/:id",
    ProductController.getImportStatus
)

export default ProductRoutes