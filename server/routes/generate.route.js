import express from "express";
import { generateNotes } from "../controllers/generate.controller.js";
import isAuth from "../middleware/isAuth.js";
import { getMyNotes, getsingleNotes } from "../controllers/notes.controller.js";

const notesRouter = express.Router();

notesRouter.post("/notes", isAuth, generateNotes);
notesRouter.get("/getnotes", isAuth, getMyNotes);
notesRouter.get("/:id", isAuth, getsingleNotes);


export default notesRouter;