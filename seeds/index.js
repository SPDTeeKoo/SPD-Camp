const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            //My User ID
            author: '62970075fd41b5c8235eec1d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dxj2qxjsh/image/upload/v1655090464/SPDCamp/vuklvier0vnsk4xqogzo.jpg',
                    filename: 'SPDCamp/vuklvier0vnsk4xqogzo'
                },
                {
                    url: 'https://res.cloudinary.com/dxj2qxjsh/image/upload/v1655090469/SPDCamp/mwp8oo1usgksgxtnuv7y.jpg',
                    filename: 'SPDCamp/mwp8oo1usgksgxtnuv7y'
                }
            ],
            description: 'Best Place in the world',
            price,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})