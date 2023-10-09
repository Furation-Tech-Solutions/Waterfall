import { CreateFeedBack } from "./create-feedBack";
import { GetAllFeedBacks } from "./get-all-feedBacks";
import { GetFeedBackById } from "./get-feedBack-by-id";
import { UpdateFeedBack } from "./update-feedBack";
import { DeleteFeedBack } from "./delete-feedBack";

// Export the feedback-related use case classes
module.exports = {
    CreateFeedBack,       // Use case for creating feedback
    GetAllFeedBacks,      // Use case for retrieving all feedback entries
    GetFeedBackById,      // Use case for retrieving a feedback entry by ID
    UpdateFeedBack,       // Use case for updating a feedback entry
    DeleteFeedBack        // Use case for deleting a feedback entry
  };
  