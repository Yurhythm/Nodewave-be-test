import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import Logger from '$pkg/logger';
import { prisma } from "$utils/prisma.utils";
import { createWriteStream } from "fs";
import { get } from "https";
import { join } from 'path';


interface FileStatus {
    id: string;
    filePath: string;
    status: "pending" | "success" | "fail";
}

// In-memory storage for file processing status (use a database in real cases)
const fileStatusStore: FileStatus[] = [];

export async function importProduct(url: string): Promise<ServiceResponse<{}>> {
    try {
        const filePath = join(__dirname, 'uploads', 'product.csv'); // Ganti path sesuai kebutuhan

        // Mengunduh file dari URL
        await downloadFile(url, filePath);

        // add to background process (mocked)
        const processId = `file_${Date.now()}`;
        fileStatusStore.push({
            id: processId,
            filePath: filePath,
            status: "pending",
        });

        setTimeout(() => processBackroundFile(processId), 2000);

        console.log('Products imported successfully');

        return {
            status: true,
            data: {
                processId: processId
            }
        }
    } catch (err) {
        Logger.error(`ProductService.importProduct : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export async function downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = createWriteStream(filePath);
        get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            reject(`Error downloading file: ${err}`);
        });
    });
}

export async function processCsv(filePath: string) {

}

// mock bcgound process
const processBackroundFile = (processId: string) => {
    const file = fileStatusStore.find((f) => f.id === processId);

    if (file) {
        const isSuccessful = Math.random() > 0.2;

        // import data to database
        const fs = require('fs');
        const data = fs.readFileSync(file.filePath, 'utf-8');

        const products = data.split('\n').slice(1).filter((line: string) => line.trim() !== '' && line !== undefined).map((line: string) => {
            const [code, productName, category, price, description] = line.split(',');
            return { code, productName, category, price: parseFloat(price), description };
        });

        prisma.product.createMany({
            data: products,
        });

        // Update the file status
        file.status = isSuccessful ? "success" : "fail";
        console.log(`File processing ${isSuccessful ? "succeeded" : "failed"}`);
    }
};

// get backround status
export async function getImportStatus(processId: string): Promise<ServiceResponse<{}>> {
    try {
        const file = fileStatusStore.find((f) => f.id === processId);

        if (file) {
            return {
                status: true,
                data: {
                    percentage: file.status ? 100 : 0,
                    status: file.status
                }
            }
        } else {
            const message = "Process not found";
            return {
                status: false,
                err: {
                    message,
                    code: 404
                }
            }
        }
    } catch (err) {
        Logger.error(`ProductService.getImportStatus : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

// get all data filterable and paginate
interface ProductFilterOptions {
    filter: string;
    page: number;
    pageSize: number;
    sort: "asc" | "desc";
}

export async function getDataProduct({ filter, page, pageSize, sort }: ProductFilterOptions): Promise<ServiceResponse<{}>> {
    try {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const products = await prisma.product.findMany({
            where: {
                productName: {
                    contains: filter,
                },
            },
            orderBy: {
                code: sort,
            },
            skip,
            take,
        });

        const totalProducts = await prisma.product.count({
            where: {
                productName: {
                    contains: filter,
                },
            },
        });

        return {
            status: true,
            data: {
                products,
                pagination: {
                    page,
                    pageSize,
                    total: totalProducts,
                },
            },
        };
    } catch (err) {
        Logger.error(`ProductService.getDataProduct: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}