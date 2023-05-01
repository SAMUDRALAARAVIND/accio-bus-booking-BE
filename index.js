const express = require("express")
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")

const PORT = 8080 || process.env.PORT
const uri = "mongodb+srv://Aravind:Aravind@cluster0.tjbxerd.mongodb.net/bus-portal?retryWrites=true&w=majority"
const {CityModel, SeatLayoutModel, TourModel, BusTypeModel} = require("./schemas/citiesSchema")

app.use(cors())
app.use(express.json())

async function connect(){
    try{
        const connection = await mongoose.connect(uri)
        console.log("connected successfully")
    }
    catch(error){
        console.log("Something went wrong", {error})
    }
};
connect();

app.post("/add/cities", async (req, resp) => {
    const citiesList = req.body;
    console.log(citiesList)
    try {
        let response ;
        if(Array.isArray(citiesList)){
             response = await CityModel.insertMany(citiesList)
             resp.status(201).json({message: `${response.length} cities saved successfully.`})
        }
        else{
            response = await CityModel.create(citiesList)
            resp.status(201).json({message: `1 city saved successfully.`})
        }
    }
    catch(error){
        console.log(`Something went wrong ${error}`)
        resp.status(500).json({message: "Something went wrong!"})
    }
})

app.get("/find/tour",async (req, resp) => {
    const src = req.query.src;
    const dest = req.query.dest;
    console.log(src, dest)
    try {
        const response = await TourModel.findOne({"source.city_id": src, "destination.city_id" : dest});
        resp.status(200).json({message: "Loaded available tours successfully", result: response})
    }
    catch(error){
        console.log(error)
        resp.status(500).json({message: "Something went wrong!", error})
    }
})

app.get("/all/cities", async (req, resp) => {
    try{
        const citiesList = await CityModel.find({});
        resp.status(200).json({message: "Loaded cities suceessfully", cities_list: citiesList})
    }
    catch(error){
        resp.status(500).json({message: `Failed to load cities ${error}`})
    }
})

app.get("/city", async (req, resp) => {
    const searchString = req.query.search;
    try{
        const response = await CityModel.find({city_name: { $regex: new RegExp(searchString, 'i')  }})
        resp.status(200).json({results: response})
    }   
    catch(error){
        resp.status(500).json({message: "Failed to load", error})
    }
})

app.post("/add/tour", async (req, resp) => {
    try{
        let allCityIds = await CityModel.find({}, "_id");
        allCityIds = allCityIds.map((item) => item._id.toString());
        const {source, destination} = req.body;

        console.log(allCityIds, source.city_id, destination.city_id)

        if(allCityIds.includes(source.city_id) && allCityIds.includes(destination.city_id)){
            const response = await TourModel.create(req.body);
            resp.status(201).json({message: "Created tour successfully!", tour_id: response._id})
        }
        else{
            resp.status(400).json({message: "Invalid City Id's"})
            return ;
        }
    }
    catch(error){
        resp.status(500).json({message:`SOmething went wrong ${error}`})
    }
})

app.get("/tour/:tourId", async (req, resp) => {
    // fetch the details of a particular tour_id
    const tourId = req.params.tourId;
    try{
        const response = await TourModel.find({_id: tourId});
        resp.status(200).json({message: "Loaded tour details succeessfully!", result: response})
    }
    catch(error){
        resp.status(500).json({message: "Something went wrong", error})
    }
});

app.post("/create/bus-type", async (req, resp) => {
    const busType = req.body ;
    try {
        const response = await BusTypeModel.create(busType);
        resp.status(201).json({message: 'Created successfully', result: response})
    }
    catch(error){
        resp.status(500).json({message: 'Failed to create bus type', error})
    }
})

app.get("/bus-types", async (req, resp) => {
    try{
        const response = await BusTypeModel.find({});
        resp.status(200).json({message: "Loaded successfully", result: response})
    }   
    catch(error){
        resp.status(500).json({message: "Failed to load", error})
    }
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

