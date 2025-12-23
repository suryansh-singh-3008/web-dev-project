import express from "express";
import Parking from "../models/Parking.js";

const router = express.Router();

/**
 * LANDOWNER → ADD PARKING
 * POST /api/parking/add
 */
router.post("/add", async (req, res) => {
  try {
    const parking = new Parking(req.body);
    await parking.save();
    res.json({ message: "Parking added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * CAR OWNER → GET NEARBY PARKING
 * GET /api/parking/nearby?lat=..&lng=..&radius=2
 */
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const R = 6371; // Earth radius in km

    const parkings = await Parking.find();

    const nearby = parkings.filter(p => {
      const dLat = (p.lat - lat) * Math.PI / 180;
      const dLng = (p.lng - lng) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * Math.PI / 180) *
        Math.cos(p.lat * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

      const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return d <= radius;
    });

    res.json(nearby);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
