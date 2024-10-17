import { createClient } from "redis";
const client = createClient({
    url: "redis://127.0.0.1:6379/0"
});
export default client;