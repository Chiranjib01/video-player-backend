import mongoose from "mongoose";

const database = {
  connect: async (MONGODB_URI: string | undefined) => {
    try {
      const con = await mongoose.connect(MONGODB_URI!);
      console.log(`Connected to database host : ${con.connection.host}`);
    } catch (error: any) {
      console.error(`Error : ${error?.message}`);
      process.exit(1);
    }
  },
  disconnect: async () => {
    try {
      await mongoose.disconnect();
      console.log("Disconnect from database ...");
    } catch (error: any) {
      console.error(`Error : ${error?.message}`);
    }
  },
};

export default database;
