import mongoose from "mongoose";
import config from "./config";

async function connect(): Promise<void> {
    try {
        const db = await mongoose.connect(config.connectionString);
        console.log("We're connected to MongoDB, database: " + db.connections[0].name);
    }
    catch (err: any) {
        console.log(err);
    }
}

export default {
    connect
};