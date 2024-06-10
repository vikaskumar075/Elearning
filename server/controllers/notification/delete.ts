import cron from "node-cron";
import notificationModel from "../../models/notification.model";

// delete read notification using node-cron
cron.schedule("0 0 0 * * *", async() => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  await notificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
});
