const express = require("express");
const app = express();
const port = 6000;

const cors = require("cors");
app.use(cors());

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite:./db.sqlite3");

const todo = sequelize.define("todo", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  create: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),

  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

//  sequelize.sync({ force: true }).then(() => {
//     console.log(`Database & tables created!`);
// })

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

app.use(express.json());

// Catch async errors to error handling middleware:
require("express-async-errors");

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await todo.findAll();
  res.json(todos);
  res.status(200).send({
    error: false,
    data: todos,
  });
});

router.post("/", async (req, res, next) => {
  const { title, description, done } = req.body;
  if (!title || !description) {
    const error = new Error(
      "title, description and create fields are required"
    );
    error.cause = "missing_fields";
    error.statusCode = 400;
    next(error);
  } else {
    const newTodo = await todo.create({
      title: title,
      description: description,
      create: new Date(),
      done: done || false,
    });
    res.status(201).send({
      error: false,
      data: newTodo,
    });
  }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const todoItem = await todo.findByPk(id);
    if (!todoItem) {
      const error = new Error("todo not found");
      error.cause = " tasks not_found";
      error.statusCode = 404;
      next(error);
    } else {
      res.status(200).send({
        error: false,
        data: todoItem,
      });
    }
    });

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { title, description, create, done } = req.body;
    const todoItem = await todo.findByPk(id);
    if (!todoItem) {
        const error = new Error("todo not found");
        error.cause = "not_found";
        error.statusCode = 404;
        next(error);
    } else {
        todoItem.title = title;
        todoItem.description = description;
        await todoItem.save();
        res.status(200).send({
        error: false,
        data: todoItem,
        });
    }
    });


router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const todoItem = await todo.findByPk(id);
    if (!todoItem) {
        const error = new Error("todo not found");
        error.cause = "not_found";
        error.statusCode = 404;
        next(error);
    } else {
        await todoItem.destroy();
        res.status(204).send();
    }
    });

app.use(router);

// Error handling middleware:
app.use((err, res) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).send({
    error: true,
    message: err.message,
    cause: err.cause,
  });
});

app.listen(port, () => {
  console.log(`server running on :${port}`);
});
