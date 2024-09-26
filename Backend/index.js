import dotenv from "dotenv";
import  connectdb  from "./src/db/index.js";
import app  from "./app.js";

dotenv.config({
    path: './.env'
})

connectdb().
then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server is running at PORT: ${process.env.PORT}`);
        
    }) 
})
.catch((error) => {
    console.log("Failed to connect with database due to", error);
    
})

// 