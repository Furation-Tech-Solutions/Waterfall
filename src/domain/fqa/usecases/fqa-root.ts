import { CreateFQA } from "./create-fqa";
import { GetAllFQAs } from "./get-all-fqas";
import { GetFQAById } from "./get-fqa-by-id";
import { UpdateFQA } from "./update-fqa";
import { DeleteFQA } from "./delete-fqa";

// Export the use case classes as an object
module.exports = {
    CreateFQA,      // Export the CreateFQA use case class
    GetAllFQAs,     // Export the GetAllFQAs use case class
    GetFQAById,     // Export the GetFQAById use case class
    UpdateFQA,      // Export the UpdateFQA use case class
    DeleteFQA,      // Export the DeleteFQA use case class
};
