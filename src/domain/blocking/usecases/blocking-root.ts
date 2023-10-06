// Import the individual modules for blocking operations
import { CreateBlocking } from "./create-blocking";
import { GetAllBlockings } from "./get-all-blockings";
import { GetBlockingById } from "./get-blocking-by-id";
import { UpdateBlocking } from "./update-blocking";
import { DeleteBlocking } from "./delete-blocking";

// Export these modules as an object
module.exports = {
    CreateBlocking,
    GetAllBlockings,
    GetBlockingById,
    UpdateBlocking,
    DeleteBlocking
};
