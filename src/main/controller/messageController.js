// Import necessary dependencies
import Realtors from "@data/realtors/model/realtor-model";
import Chat from "@main/models/chatModel";
import Message from "@main/models/messageModel";

const allMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chatId: req.params.chatId },
      include: [
        {
          model: Realtors,
          as: "sender",
          attributes: ["firstName", "profileImage", "email"],
        },
        { model: Chat, as: "chat" },
      ],
    });

    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    // Create a new message
    const newMessage = {
      senderId: req.user._id, // Assuming req.user._id is the sender's ID
      content: content,
      chatId: chatId,
    };

    // Use Sequelize create method to insert a new message
    const message = await Message.create(newMessage);

    // Populate sender and chat information
    const populatedMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: Realtors,
          as: "sender",
          attributes: ["firstName", "profileImage"],
        },
        { model: Chat, as: "chat" },
      ],
    });

    // Populate additional user information in the chat
    await Realtors.scope("withEmailAndPic").findAll({
      include: [
        {
          model: Chat,
          where: { id: chatId },
          attributes: ["firstName", "profileImage"],
        },
      ],
    });

    // Update the latestMessage in the chat
    await Chat.update(
      { latestMessageId: populatedMessage.id },
      {
        where: { id: chatId },
      }
    );

    res.json(populatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default { allMessages, sendMessage };
