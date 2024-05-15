const express = require("express");
const router = express.Router();
const supabaseProvider = require("../provider/supabase");

/**
 * Feature 1: Getting a list of restaurants
 */
router.get("/", async (_req, res) => {
  const { data } = await supabaseProvider.from("restaurants").select("*");

  res.json(data);
});

/**
 * Feature 2: Getting a specific restaurant
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Find the restaurant with the matching id.
  const { data } = await supabaseProvider.from("restaurants").select("*").eq("id", id);
  const restaurant = data.length > 0 ? data[0] : undefined;

  // If the restaurant doesn't exist, let the client know.
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  res.json(restaurant);
});

/**
 * Feature 3: Adding a new restaurant
 */
router.post("/", async (req, res) => {
  const { body } = req;
  const { name } = body;

  const { data, error } = await supabaseProvider.from("restaurants").insert([{ name }]).select();

  if (error || data.length !== 1) {
    res.status(400).send({ error });
    return;
  }

  res.json(data[0]);
});

/**
 * Feature 4: Deleting a restaurant.
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseProvider.from("restaurants").delete().match({ id });

  if (error) {
    res.status(404).send({ error });
    return;
  }

  res.sendStatus(200);
});

/**
 * Feature 5: Updating the name of a restaurant.
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  const { error } = await supabaseProvider.from("restaurants")
    .update({ name: newName })
    .match({ id });

  if (error) {
    res.status(404).send({ error });
    return;
  }

  res.sendStatus(200);
});

exports.router = router;
