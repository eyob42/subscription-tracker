import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error(`Please define the MONGODB_URI environment variables inside .env<development/production>.local`)
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`connected to database in ${NODE_ENV} mode`);
    }catch (error) {
        console.error('Error connecting database: ', error);

        process.exit(1);  // 1 is failure
    }
}

export default connectToDatabase;
