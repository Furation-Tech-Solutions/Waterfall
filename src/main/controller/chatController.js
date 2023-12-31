// Import necessary dependencies
import ChatModel from "@main/models/chatModel";
import UserModel from "@main/models/userModel";
import MessageModel from "@main/models/messageModel";
import Realtors from "@data/realtors/model/realtor-model";

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }

    // Check if a chat exists between the current user and the target user
    const isChat = await ChatModel.findOne({
      where: {
        isGroupChat: false,
      },
      include: [
        {
          model: Realtors,
          as: "users",
          where: {
            id: [req.user._id, userId],
          },
        },
        { model: MessageModel, as: "latestMessage" },
      ],
    });

    if (isChat) {
      const populatedChat = await ChatModel.findByPk(isChat.id, {
        include: [
          {
            model: Realtors,
            as: "users",
          },
          {
            model: MessageModel,
            as: "latestMessage",
            include: [
              {
                model: Realtors,
                as: "sender",
                attributes: ["firstName", "profileImage"],
              },
            ],
          },
        ],
      });

      res.json(populatedChat);
    } else {
      // If no chat exists, create a new chat
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await ChatModel.create(chatData);

      const fullChat = await ChatModel.findByPk(createdChat.id, {
        include: [
          {
            model: Realtors,
            as: "users",
          },
        ],
      });

      res.status(200).json(fullChat);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchChats = async (req, res) => {
  try {
    const results = await ChatModel.findAll({
      where: {
        users: {
          $contains: [req.user._id],
        },
      },
      include: [
        {
          model: Realtors,
          as: "users",
        },
        {
          model: Realtors,
          as: "groupAdmin",
        },
        {
          model: Realtors,
          as: "latestMessage",
          attributes: ["firstName", "profileImage"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const populatedResults = await Realtors.populate(results, {
      path: "latestMessage.sender",
      select: "firstName profileImage email",
    });

    res.status(200).json(populatedResults);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default { accessChat, fetchChats };
