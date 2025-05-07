const { PrismaClient } = require('@prisma/client');
const database= new PrismaClient(); 

async function main() {
    try{
        await database.category.createMany({
            data : [
                {name: "Programming"},
                {name: "Design"},
                {name: "Marketing"},
                {name: "Business"},
                {name: "Photography"},
                {name: "Music"},
                {name: "Health"},
                {name: "Science"},
                {name: "Education"},
                {name: "Lifestyle"},
                {name: "Travel"},
                {name: "Food"},
                {name: "Sports"},
                {name: "Gaming"},
                {name: "Finance"}
            ]
        });

        console.log("Success");
    }
    catch (error){
        console.log("error seeeding the database categories",error);
    } finally{
        await database.$disconnect();
    }
}

main();