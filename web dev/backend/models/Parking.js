import mongoose from "mongoose";

const ParkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    space: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },

    // ✅ FIXED IMAGE FIELD
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Parking", ParkingSchema);
