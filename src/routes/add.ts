import Router from "express";
import FreeVacancy from "../models/vacancies";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import { Request, Response, NextFunction } from "express";
import { vacancyValidators } from "../utils/validators";
import { validationResult } from "express-validator";

const router = Router();

router.get("/", (req, res) => {
  res.render("add", {
    title: "Новая вакансия",
    isAdd: true,
  });
});

router.post(
  "/",
  vacancyValidators,
  auth,
  admin,
  async (req: Request, res: Response) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).render("add", {
        title: "Новая вакансия",
        isAdd: true,
        error: error.array()[0].msg,
        data: {
          jobVacancy: req.body.jobVacancy,
          description: req.body.description,
          wage: req.body.wage,
        },
      });
    }
    try {
      await FreeVacancy.create({
        jobVacancy: req.body.jobVacancy,
        description: req.body.description,
        wage: req.body.wage,
      });
      res.redirect("/vacancies");
    } catch (e) {
      console.log(e);
    }
  }
);

export default router;
