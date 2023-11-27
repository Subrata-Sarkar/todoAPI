const express = require("express");
const auth = require("../middleware/user_jwt");

const Todo = require("../models/todo");

const router = express.Router();

// Create new todo task

router.post("/", auth, async(req,res,next) => {
    try {
        const toDo = await Todo.create({ title: req.body.title, description: req.body.description, user: req.user.id });
        if(!toDo) {
            return res.status(400).json({
                success: false,
                msg: "Something went wrong"
            });
        }

        res.status(200).json({
            success: true,
            todo: toDo,
            msg: "Successfully created."
        });
    } catch (error) {
        next(error);
    }
});


// fetch all data

router.get("/", auth, async(req,res,next) => {
    try {
        const todo = await Todo.find({ user: req.user.id, finished: false });

        if(!todo){
            return res.status(400).json({ success: false, msg: "Something error happened" });
        }

        res.status(200).json({ success: true, count: todo.length, todos: todo, msg: "Successfully fetched" });
    } catch (error) {
        next(error);
    }
});


// update a task

router.put("/:id", async(req, res, next) => {
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo){
            return res.status(400).json({ success: false, msg: "Task todo not exits" });
        }

        toDo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!toDo){
            return res.status(400).json({ success: false, msg: "Something went wrong" });
        }

        res.status(200).json({ success: true, todo: toDo, msg: "Successfully added" });

    } catch (error) {
        next(error);
    }
});

// Delete a task

router.delete("/:id", async(req,res,next) => {
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo){
            return res.status(400).json({ success: false, msg: "Task do not exist" });
        }
    
        toDo = await Todo.findOneAndDelete(req.params.id);
    
        if(!toDo){
            return res.status(400).json({ success: false, msg: "Something went wrong" });
        }
    
        res.status(200).json({ success: true, msg: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});


// fetch all data

router.get("/finished", auth, async(req,res,next) => {
    try {
        const todo = await Todo.find({ user: req.user.id, finished: true });

        if(!todo){
            return res.status(400).json({ success: false, msg: "Something error happened" });
        }

        res.status(200).json({ success: true, count: todo.length, todos: todo, msg: "Successfully fetched" });
    } catch (error) {
        next(error);
    }
});
module.exports = router;