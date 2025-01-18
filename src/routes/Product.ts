import { Router } from "express";
import * as ProductController from "$controllers/rest/ProductController"
import { authenticateMiddleware } from "$middlewares/authenticateMiddleware";

const ProductRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

ProductRoutes.get("/", authenticateMiddleware,
    ProductController.getDataProduct
)

ProductRoutes.post("/import", authenticateMiddleware,
    ProductController.importProduct
)

ProductRoutes.get("/upload-status/:id", authenticateMiddleware,
    ProductController.getImportStatus
)

export default ProductRoutes