const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
    city_name: {
        required: true,
        type: String,
    },
    state: {
        required: true,
        type: String,
    },
    pincode: {
        required: true,
        type: String,
    },
    country: {
        required: true,
        type: String
    }
});

const UserDetailsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

const SeatSchema = mongoose.Schema({
    is_seat: {
        type: Boolean,
        required: true
    },
    seat_number: {
        type: String,
    },
    seat_type: { // 'SLEEPER' | 'SEMI_SLEEPER'
        type: String,
    },
    seat_price: {
        type: String,
    },
    is_booked: {
        type: Boolean,
    },
    user_details: {
        type: UserDetailsSchema,
    }
})

const SeatLayoutSchema = mongoose.Schema({
    tour_id: {
        type: String,
        required: true
    },
    structure: {
        type: [[SeatSchema]],
        required: true
    }
})

const LocationSchema = mongoose.Schema({
    city_id: {
        type: String,
        required: true
    },
    city_name: {
        type: String,
        required: true,
    },
    arrival_time: {
        type: Number,
        required: true
    }
})

const StopPoints = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    stop_number: {
        type: Number,
        required: true
    },
    arrival_time: {
        type: Number,
        required: true
    }
})

const TourSchema = mongoose.Schema({
    source: {
        type: LocationSchema,
        required: true,
    },
    destination: {
        type: LocationSchema,
        required: true
    },
    tour_date: {
        type: Number,
        required: true
    },
    bus_partner: {
        type: String,
        required: true
    },
    seat_layout: {
        type: [[SeatSchema]],
        required: true
    },
    dropping_points: [StopPoints],
    boarding_points: [StopPoints]
})

const BusTypeSchema = mongoose.Schema({
    identifier: {
        unique: true,
        type: String,
        required: true
    },
    display_text: {
        unique: String,
        type: String,
        required: true
    }
})

module.exports = {
    CityModel: mongoose.model("Cities", CitySchema), 
    SeatLayoutModel: mongoose.model("SeatLayout", SeatLayoutSchema),
    TourModel: mongoose.model("Tour", TourSchema),
    BusTypeModel: mongoose.model("BusType", BusTypeSchema)
}