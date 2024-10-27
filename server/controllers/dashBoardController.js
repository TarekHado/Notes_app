const Note = require('../models/note');
const mongoose = require('mongoose');
const User = require('../models/user');

exports.dashboard = async (req, res) => {
    let perPage = 12;
    let page = req.query.page || 1;

    const u = await User.findById(req.user._conditions._id)
    const locals = {
        title: "Dashboard",
        description: "Free NodeJs Notes App"
    };
        // const notes = await Note.find({});
        Note.aggregate([
            {
                $sort: { createdAt: -1, }
            },
            {
                $match: { user: new mongoose.Types.ObjectId(req.user._conditions._id) }
            },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] },
                }
            }
        ]).skip(perPage * page - perPage)
            .limit(perPage)
            .exec()
            .then((notes) => {
                Note.countDocuments().then((count) => {
                res.render('dashboard/index', {
                    userName: u.firstName,
                    locals,
                    notes,
                    layout: process.env.DASHBOARD_LAYOUT,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
        })}).catch(err => console.log(err));
}

exports.viewNote = async (req, res) => {
    const note = await Note.findById(req.params.id)
        .where({ user: req.user._conditions._id }).lean();
    if (note) {
        res.render('dashboard/view-notes', {
            noteId: req.params.id,
            note,
            layout: process.env.DASHBOARD_LAYOUT
        });
    } else {
        res.send("Something went wrong.");
    }
};

exports.editNote = async (req, res) => {
    const note = await Note.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body
    }, { new: true }).where({ user: req.user._conditions._id });
    res.redirect('/dashboard');
}

exports.deleteNote = async (req, res) => {
    const note = await Note.findByIdAndDelete(req.params.id).where({ user: req.user._conditions._id });
    res.redirect('/dashboard');
}

exports.createNotePage = async (req, res) => {
    res.render('dashboard/add', {
            layout: process.env.DASHBOARD_LAYOUT
        });
}

exports.createNote = async (req, res) => {
    await Note.create({
        title: req.body.title,
        body: req.body.body,
        user: req.user._conditions._id
    });
    res.redirect('/dashboard');
}

exports.searchNotePage = async (req, res) => {
    res.render('dashboard/search', {
        searchResults: '',
        layout: process.env.DASHBOARD_LAYOUT
    });
}

exports.searchNote = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const termNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(termNoSpecialChars, 'i') } },
                { body: { $regex: new RegExp(termNoSpecialChars, 'i') } }
            ]
        }).where({ user: req.user._conditions._id });
        res.render('dashboard/search', {
            searchResults,
            layout: process.env.DASHBOARD_LAYOUT
        });
    } catch (error) {
        console.log(error.message);
    }
}