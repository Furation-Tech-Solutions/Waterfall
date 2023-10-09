// Import necessary use case classes
import { CreateRealtor } from "./create-realtor";
import { DeleteRealtor } from "./delete-realtor";
import { GetRealtorById } from "./get-realtor-by-id";
import { GetAllRealtors } from "./get-all-realtors";
import { UpdateRealtor } from "./update-realtor";

// Export the use case classes as a module
module.exports = {
  CreateRealtor, // Export the CreateRealtor use case
  DeleteRealtor, // Export the DeleteRealtor use case
  GetRealtorById, // Export the GetRealtorById use case
  GetAllRealtors, // Export the GetAllRealtors use case
  UpdateRealtor // Export the UpdateRealtor use case
};
