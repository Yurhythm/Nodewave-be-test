import { seedAdmin } from './seedAdmin';
import { prisma } from '../../src/utils/prisma.utils';

async function seed(){
    seedAdmin(prisma);
}


seed().then(()=>{
    console.log("ALL SEEDING DONE")
})