const express = require("express");
const bcrypt = require("bcryptjs");
const generateVerificationEmail = require("./../middlewares/generateVerificationEmail");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middlewares/checkAuth");
const checkRole = require("./../middlewares/checkRole");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const userModel = require("./../models/userModel");
const shortUrlTaskModel = require("./../models/shortUrlTaskModel");
const userTaskLogModel = require("./../models/userTaskLogModel");
const userTaskSessionModel = require("./../models/userTaskSessionModel");
const userTransactionLogModel = require("./../models/userTransactionLogModel");
const taskReportModel = require("../models/taskReportModel");

const userRouter = express.Router();

// USER REGISTRATION
/*Chat gpt scanned and optimised*/
userRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password, country } = req.body;

    // check for existing user
    const existingEmail = await userModel.findOne({ email: email });
    if (existingEmail) {
      const error = new Error("Email already registered");
      error.status = 400;
      throw error;
    }

    // hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // save the user
    const userData = new userModel({
      email,
      password: hashedPass,
      country,
    });
    await userData.save();

    // generate token for email verification
    const userID = userData._id;
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // send verification email with token and user email
    const type = "emailVerification";
    generateVerificationEmail(email, token, type);

    return res.status(201).json({
      message: "user registered successfully please check ur email for verification link",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//VERIFY EMAIL
userRouter.get("/verify-email/:token", async (req, res, next) => {
  const { token } = req.params;
  try {
    // token verification
    const decodedToken = jwt.verify(token, "jwtkey process.env.like");
    const userId = decodedToken.userID;

    // update status
    await userModel.findByIdAndUpdate(userId, { isVerified: true, verifiedAt: new Date() });

    return res.status(200).json({
      message: "email verified successfully !",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//USER LOGIN
userRouter.post("/signin", async (req, res, next) => {
  console.log("signin Api called");

  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    console.log(existingUser);

    if (!existingUser) {
      const error = new Error("Email is not registered");
      error.status = 404;
      throw error;
    }
    // finding email
    const existingPass = existingUser.password;
    const passCheck = await bcrypt.compare(password, existingPass);
    if (!passCheck) {
      const error = new Error("Incorrect password");
      error.status = 400;
      throw error;
    }
    if (!existingUser.isVerified) {
      const error = new Error("please verify the email");
      error.status = 400;
      throw error;
    }

    // generate a new session id
    const sessionId = uuidv4();

    //update user sessionId
    existingUser.sessionId = sessionId;
    await existingUser.save();

    // token generation with userId,role,sessionId
    const token = jwt.sign(
      {
        email: existingUser.email,
        userId: existingUser._id,
        role: existingUser.role,
        sessionId: sessionId,
      },
      "encryption_key",
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: "login success",
      token: token,
      role: existingUser.role,
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//FORGOT PASSWORD (SEND EMAIL TO RESET PASSWORD)
userRouter.post("/forgotpassword", async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      const error = new Error("email is not registered");
      error.status = 400;
      throw error;
    }

    // generate token
    const userId = existingUser._id;
    const token = jwt.sign({ userId }, "jwt sectret key", {
      expiresIn: "15min",
    });

    // send token via email
    const type = "forgotPassword";
    await generateVerificationEmail(email, token, type);

    return res.status(200).json({
      message: "password reset link send to your registered email",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//RESET PASSWORD (FROM SIGNIN PAGE FORGOT PASSWORD)
userRouter.get("/resetpassword", async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const decodedToken = jwt.verify(token, "jwt secret key ");
    if (!decodedToken) {
      const error = new Error("Token expired");
      error.status = 400;
      throw error;
    }
    const userId = decodedToken.userId;
    const hashedPass = await bcrypt.hash(password, 10);

    const updatePass = await userModel.findByIdAndUpdate({ userId }, { password: hashedPass });
    return res.status(200).json({
      message: "password updated successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//UPDATE PASSWORD (UPDATE PASSWORD FROM USER PROFILE)
userRouter.post("/update-password", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const userId = req.userData.userId;
  const { currentPassword, newPassword } = req.body;
  console.log("currentPassword", currentPassword);
  console.log("newPassword", newPassword);

  try {
    const userData = await userModel.findById(userId);
    const passCheck = await bcrypt.compare(currentPassword, userData.password);
    if (!passCheck) {
      const error = new Error("incorrect old password");
      error.status = 400;
      throw error;
    }

    // hash the password
    const hashedPass = await bcrypt.hash(newPassword, 10);

    userData.password = hashedPass;
    await userData.save();
    return res.status(200).json({
      message: "password updated successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.log("error gaga", error);

    next(error);
  }
});

//DASHBOARD
userRouter.get("/dashboard-data", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const user_id = req.userData.userId;
  try {
    const walletBalance = await userModel.findById(user_id, { wallet: 1 });

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to midnight
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to end of day

    // Fetch today's earnings
    const todaysEarningsResult = await userTaskLogModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user_id), // Filter by user ID
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: { $toDouble: "$payment" } }, // Convert Decimal128 to double
        },
      },
    ]);

    const todaysEarning = todaysEarningsResult.length > 0 ? todaysEarningsResult[0].totalEarnings : 0;

    // Fetch today's completed tasks
    const todaysCompletedTasks = await userTaskLogModel.countDocuments({
      userId: user_id, // Filter by user ID
      isCompleted: true,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Fetch number of live tasks
    const numberOfLiveTasks = await shortUrlTaskModel.countDocuments({
      userId: user_id,
      status: "active",
    });

    return res.status(200).json({
      data: {
        walletBalance: walletBalance.wallet,
        todaysEarning: todaysEarning,
        completedTasks: todaysCompletedTasks,
        liveCampaigns: numberOfLiveTasks,
      },
      message: "user dashboard data fetched successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//USER PROFILE
userRouter.get("/profile", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  //api
  const user_id = req.userData.userId;
  try {
    const userData = await userModel.findById(user_id);
    console.log(userData);

    return res.status(200).json({
      message: "user data fetched successfully",
      data: userData,
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//DELETE ACCOUNT
userRouter.get("/delete-account", checkAuth, checkRole(["user"]), async (req, res, next) => {
  const userId = req.userData.userId;
  const password = req.body.password;
  try {
    const userData = await userModel.findById(userId);
    const passCheck = await bcrypt.compare(password, userData.password);
    if (!passCheck) {
      const error = new Error("incorrect password");
      error.status = 400;
      throw error;
    }
    userData.deleteOne();

    return res.status(200).json({
      message: "account deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// balance + log
userRouter.get("/wallet", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const user_id = req.userData.userId;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 6; // Default to 5 transactions per page if not provided

  try {
    const userWallet = await userModel.findById(user_id);
    const walletBalance = parseFloat(userWallet.wallet.toString()).toFixed(4);

    // Count the total number of transactions
    const totalTransactions = await userTransactionLogModel.countDocuments({ userId: user_id });

    // Get the transactions for the current page
    const transactionLog = await userTransactionLogModel
      .find({ userId: user_id })
      .skip((page - 1) * limit) // Skip the transactions for the previous pages
      .limit(limit) // Limit to the specified number of transactions per page
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    return res.status(200).json({
      message: "User wallet data fetched successfully",
      data: {
        walletBalance: walletBalance,
        transactionLog: transactionLog,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTransactions / limit), // Calculate total pages
        totalTransactions: totalTransactions,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

//list tasks 4 user
userRouter.get(
  "/list-url-shortener-tasks",
  checkAuth,
  checkRole(["user", "admin"]),
  async (req, res, next) => {
    const user_id = req.userData.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {
      const activeTask = await userTaskSessionModel.findOne({ userId: user_id });
      if (activeTask) {
        const taskData = await shortUrlTaskModel.findById(activeTask.taskId);
        if (taskData) {
          return res.status(200).json({
            message: "Active task session found",
            data: taskData,
            success: true,
            error: false,
          });
        }
      }

      const completedTasks = await userTaskLogModel.find({ userId: user_id }, { taskId: 1, _id: 0 }).lean();

      const completedTasksId = completedTasks.map((item) => item.taskId);
      const queryConditions = {
        approved: true,
        status: "active",
        userId: { $ne: user_id },
        _id: { $nin: completedTasksId },
        $expr: { $lt: ["$hits", "$targetViews"] },
      };

      const totalTasks = await shortUrlTaskModel.countDocuments(queryConditions);

      const allTaskData = await shortUrlTaskModel
        .find(queryConditions)
        .skip((page - 1) * limit)
        .limit(limit);

      if (allTaskData.length === 0) {
        return res.status(200).json({
          message: "No tasks available",
          data: [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks,
          },
          success: true,
          error: false,
        });
      }

      const allTaskIds = allTaskData.map((task) => task._id);

      const activeSessions = await userTaskSessionModel.aggregate([
        { $match: { taskId: { $in: allTaskIds } } },
        { $group: { _id: "$taskId", activeSessions: { $sum: 1 } } },
      ]);

      const activeSessionMap = new Map(
        activeSessions.map((session) => [session._id.toString(), session.activeSessions])
      );

      const filteredTasks = allTaskData.filter((task) => {
        const activeSessionsCount = activeSessionMap.get(task._id.toString()) || 0;
        const availableSlot = task.targetViews - (task.hits + activeSessionsCount);
        return availableSlot > 0;
      });

      res.status(200).json({
        message: "Task data fetched successfully",
        data: filteredTasks,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalTasks / limit),
          totalTasks,
        },
        success: true,
        error: false,
      });
    } catch (error) {
      next(error);
    }
  }
);

// report task
userRouter.get("/report-task/:taskId", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const userId = req.userData.userId;
  const taskId = req.params.taskId;
  const message = req.body.message;
  try {
    const saveData = await taskReportModel({ userId, taskId, message });
    saveData.save();

    return res.status(200).json({
      message: "task reported successfully",
      success: false,
      error: true,
    });
  } catch (error) {
    next(error);
  }
});

// START URL SHORTENER TASK
userRouter.get("/start-task/:taskId", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  console.log("api called");

  const taskId = req.params.taskId;
  const user_id = req.userData.userId;
  try {
    // check for if already started or not
    const existingSession = await userTaskSessionModel.findOne({ userId: user_id, taskId: taskId });
    if (existingSession) {
      // If an active session exists, return the task details/url
      const task = await shortUrlTaskModel.findById(taskId);
      if (task) {
        return res.status(200).json({
          message: "Task session already active",
          data: task.shortUrl,
          success: true,
          error: false,
        });
      } else {
        return res.status(404).json({
          message: "Task not found",
          success: false,
          error: true,
        });
      }
    }
    // else create a new session

    // double check before starting task

    // get active task sessions to check available slot
    const activeSessionsCount = await userTaskSessionModel.find({ taskId: taskId }).countDocuments();

    const task = await shortUrlTaskModel.findOne({
      _id: taskId,
      approved: true,
      status: "active",
      $expr: { $lt: ["$hits", "$targetViews"] }, // Ensure target views are greater than hits
      targetViews: { $gt: activeSessionsCount },
    });
    if (!task) {
      return res.status(400).json({
        message: "task expired",
        success: false,
        error: true,
      });
    }

    // create task session
    const taskSession = new userTaskSessionModel({ userId: user_id, taskId });
    await taskSession.save();
    // create task log
    const taskLog = new userTaskLogModel({ userId: user_id, taskId });
    await taskLog.save();

    return res.status(200).json({
      message: "task initiated successfully",
      data: task.shortUrl,
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// remove task from list
userRouter.get("/removetask/:taskId", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const taskId = req.params.taskId;
  const user_id = req.userData.userId;
  try {
    // create a task log such that this task no more displays
    const taskSession = new userTaskLogModel({ userId: user_id, taskId });
    await taskSession.save();

    return res.status(200).json({
      message: "task removed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// cancel started task
userRouter.get(
  "/cancel-shorturltask/:taskId",
  checkAuth,
  checkRole(["user", "admin"]),
  async (req, res, next) => {
    const userId = req.userData.userId;
    const taskId = req.params.taskId;

    try {
      const taskSession = await userTaskSessionModel.findOneAndDelete({ userId, taskId });
      if (!taskSession) {
        return res.status(404).json({
          message: "No active session found for the specified task",
          success: false,
          error: true,
        });
      }
      return res.status(200).json({
        message: "task session deleted successfully",
        success: true,
        error: false,
      });
    } catch (error) {
      next(error);
    }
  }
);

// VERIFY URL SHORTENER TASK COMPLETION
userRouter.get(
  "/verify-urlshortener-task/:userId/:uniqueId",
  checkAuth,
  checkRole(["user", "admin"]),
  async (req, res, next) => {
    const advertiserUserId = req.params.userId;
    const uniqueId = req.params.uniqueId;

    const user_id = req.userData.userId;
    try {
      const taskData = await shortUrlTaskModel.findOne({ userId: advertiserUserId, uniqueId: uniqueId });
      console.log("taskdata", taskData);

      const taskId = taskData._id;
      // task validation
      const activeTaskSession = await userTaskSessionModel.findOne({ userId: user_id, taskId: taskId });
      if (!activeTaskSession) {
        const error = new Error("task expired or invalid entry !");
        error.status = 400;
        throw error;
      }
      // update task hits/amount from task post after one user completes
      const task = await shortUrlTaskModel.findById(taskId);
      const currentAmount = parseFloat(task.setAmount.toString());
      // add 25% fee with pay per view
      const payPerView = parseFloat(task.payPerView.toString());
      const fee = (payPerView / 100) * 25;
      const deductableAmount = payPerView + fee;

      task.hits += 1;
      task.targetViews -= 1;
      task.setAmount = mongoose.Types.Decimal128.fromString((currentAmount - deductableAmount).toString());
      await task.save();

      // update task log completed
      const userTaskLog = await userTaskLogModel.findOne({ userId: user_id, taskId: taskId });
      userTaskLog.payment = mongoose.Types.Decimal128.fromString(payPerView.toString());
      userTaskLog.isCompleted = true;
      userTaskLog.save();

      // update payment to user wallet after task success
      const userData = await userModel.findById(user_id);
      const currentBalance = parseFloat(userData.wallet.toString());
      userData.wallet = mongoose.Types.Decimal128.fromString((currentBalance + payPerView).toString());
      await userData.save();
      // update payment to admin wallet
      const adminData = await userModel.findById("677bb688cfd1dc73c1e1e25e");
      const currentAdminBalance = parseFloat(adminData.wallet.toString());
      adminData.wallet = mongoose.Types.Decimal128.fromString((currentAdminBalance + fee).toString());
      await adminData.save();
      // create wallet/transaction log
      const userWalletLog = new userTransactionLogModel({
        userId: user_id,
        taskId: taskId,
        amount: mongoose.Types.Decimal128.fromString(payPerView.toString()),
        type: "credit",
      });
      await userWalletLog.save();

      // delete task session
      await activeTaskSession.deleteOne();

      return res.status(200).json({
        message: "task verified successfully",
        success: true,
        error: false,
      });
    } catch (error) {
      next(error);
    }
  }
);

// task log
userRouter.get("/tasklog", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const user_id = req.userData.userId;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 6; // Number of items per page

  try {
    const totalTasks = await userTaskLogModel.countDocuments({ userId: user_id });
    const taskLog = await userTaskLogModel
      .find({ userId: user_id })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      message: "User task log fetched successfully",
      data: taskLog,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// CHECK FOR DOCUMENTS
userRouter.get("/fetch-document", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const userId = req.userData.userId;
  try {
    const existingDocs = await shortUrlTaskModel.find({ userId: userId });
    if (!existingDocs) {
      return res.status(400).json({
        message: "no task present",
        data: existingDocs,
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "task data fetched successfully",
      data: existingDocs,
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// ADD SHORTLINK TASK
userRouter.post("/add-shorturl-task", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  ///
  console.log("add task api called");
  const user_Id = req.userData.userId;
  const { name, uniqueId, shortUrl, targetViews, payPerView, setAmount, status } = req.body;
  try {
    const userData = await userModel.findById(user_Id);

    // check user balance
    const userBalance = parseFloat(userData.wallet.toString());
    if (userBalance < setAmount) {
      const error = new Error("insufficient balance");
      error.status = 400;
      throw error;
    }

    // deduct setAmount and fee from wallet
    userData.wallet = mongoose.Types.Decimal128.fromString((userBalance - setAmount).toString());
    await userData.save();

    // create task document with unique id and other data's
    const taskData = new shortUrlTaskModel({
      userId: user_Id,
      name,
      uniqueId,
      shortUrl,
      targetViews,
      payPerView: mongoose.Types.Decimal128.fromString(payPerView.toString()),
      setAmount: mongoose.Types.Decimal128.fromString(setAmount.toString()),
      status,
    });
    await taskData.save();

    // create transaction log
    const type = "debit";
    const transactionData = new userTransactionLogModel({
      userId: user_Id,
      taskId: taskData._id,
      amount: mongoose.Types.Decimal128.fromString(setAmount.toString()),
      type,
    });
    await transactionData.save();

    return res.status(200).json({
      message: "task added successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// PAUSETASK (ADVERTISER MANAGE TASK)
userRouter.get("/pause-task/:taskId", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  console.log("api called");

  const user_Id = req.userData.userId;
  const taskId = req.params.taskId;
  try {
    const taskData = await shortUrlTaskModel.findOne({ _id: taskId, userId: user_Id });
    console.log(taskData);

    taskData.status = "paused";
    taskData.save();

    return res.status(200).json({
      message: "task paused successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// PUBLISH TASK (ADVERTISER MANAGE TASK)
userRouter.get("/publish-task/:taskId", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  console.log("api called");

  const user_Id = req.userData.userId;
  const taskId = req.params.taskId;
  try {
    const taskData = await shortUrlTaskModel.findOne({ _id: taskId, userId: user_Id });
    console.log(taskData);

    taskData.status = "active";
    taskData.save();

    return res.status(200).json({
      message: "task published successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE TASK (ADVERTISER MANAGE TASK)
userRouter.get("/delete-task/:taskId", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  console.log("api called");

  const user_Id = req.userData.userId;
  const taskId = req.params.taskId;
  try {
    const taskData = await shortUrlTaskModel.findOne({ _id: taskId, userId: user_Id });
    const userData = await userModel.findById(user_Id);
    console.log("userData", userData);
    console.log("taskData", taskData);
    // refund setamount/Balance amount
    const refundAmount = parseFloat(taskData.setAmount.toString());
    const currentWalletBalance = parseFloat(userData.wallet.toString());
    const totalRefund = currentWalletBalance + refundAmount;

    userData.wallet = mongoose.Types.Decimal128.fromString(totalRefund.toString());
    // save user data
    await userData.save();
    //finally delete task
    await taskData.deleteOne();

    return res.status(200).json({
      message: "task deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

// VIEW SINGLE SHORTURL TASK (ADVERTISER)
userRouter.get(
  "/view-shorturltask/:taskId",
  checkAuth,
  checkRole(["user", "admin"]),
  async (req, res, next) => {
    const userId = req.userData.userId;
    const taskId = req.params.taskId;
    try {
      const taskData = await shortUrlTaskModel.findById({ userId, taskId });

      return res.status(200).json({
        message: "task data fetched successfully",
        data: taskData,
        success: true,
        error: false,
      });
    } catch (error) {
      next(error);
    }
  }
);

// pause/publish shortlink task (from list & edit)
userRouter.get(
  "/update-status-shorturltask",
  checkAuth,
  checkRole(["user", "admin"]),
  async (req, res, next) => {
    const userId = req.userData.userId;
    const { taskId, status } = req.body;
    try {
      await shortUrlTaskModel.findOneAndUpdate({ userId, _id: taskId }, { status });

      return res.status(200).json({
        message: `task ${status}ed  successfuly`,
        success: true,
        error: false,
      });
    } catch (error) {
      next(error);
    }
  }
);

// delete shortlink task (from list & edit)
userRouter.get("/delete-shorturltask", checkAuth, checkRole(["user", "admin"]), async (req, res, next) => {
  const userId = req.userData.userId;
  const { taskId } = req.body.status;
  try {
    await shortUrlTaskModel.findOneAndDelete({ userId, _id: taskId });

    return res.status(200).json({
      message: "task deleted  successfuly",
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
