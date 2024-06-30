import { StreamClient } from "@stream-io/node-sdk";


const apiKey = "xfe2e4bqvhqs";
const apiSecret = process.env.SECRET!;


export const client = new StreamClient(apiKey, apiSecret);

