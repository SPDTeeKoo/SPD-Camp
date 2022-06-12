const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError ('Invalid Campground Data',400);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!!')
    res.redirect(`/campgrounds/${campground._id}`)
});

module.exports.showCampground = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
});

module.exports.updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground!!')
    res.redirect(`/campgrounds/${campground._id}`)
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!!')
    res.redirect(`/campgrounds`);
});