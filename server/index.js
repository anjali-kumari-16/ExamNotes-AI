import "dotenv/config"
import express from "express"
import connectDb from "./utils/connectDb.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/generate.route.js"
import pdfRouter from "./routes/pdf.route.js"
import creditRouter from "./routes/credits.route.js"
import { stripeWebhook } from "./controllers/credits.controller.js"

const port = process.env.PORT || 8000
const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}
)) // frontend and backend connectivity
//stripe webhook 
app.post(
  "/api/credits/webhook",

  express.raw({ type: "application/json" }),
  stripeWebhook
)
app.use(express.json())
app.use(cookieParser())
app.get("/", (req, res) => {
  res.json({ message: "ExamNotes AI Backend Running" })

})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/generate", notesRouter)
app.use("/api/pdf", pdfRouter)
app.use("/api/credits", creditRouter)


/*connectDb().then(() => {
    app.listen(port,()=>{
        console.log(` Server running on port ${port}`)
    })
})*/
const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("Startup error:", error);
  }
};

startServer();

