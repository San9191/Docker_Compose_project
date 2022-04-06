const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const mongoose = require('mongoose');

const Favorite = require('./models/favorite');

const app = express();

app.use(bodyParser.json());

app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.status(200).json({
    favorites: favorites,
  });
});

app.get('/pokemons', async (req, res) => {
  try {
    // Getting a list of Pokémons

    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
    const pokemonList = response.data.results;

    // Random index ( Pokemon) selection , to avoid always getting the first page of the API 

    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const selectPokemon = pokemonList[randomIndex];

    // Getting detailed info

    const details = await axios.get(selectPokemon.url);

    const favoritePayload = {
      name: details.data.name,
      height: details.data.height,
      weight: details.data.weight,
      base_experience: details.data.base_experience,
    };

    // Sending POST to /favorites 
    const postResponse = await axios.post('http://localhost:3000/favorites', favoritePayload);

    // Favorite save confirmation

    res.status(200).json({
      message: 'Favorite sent successfully!',
      data: postResponse.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Something went wrong.';
    res.status(500).json({ message: errorMessage });
  }
});

  // To Delete a databse entry

  app.delete('/favorites/name/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const result = await Favorite.findOneAndDelete({ name });

    if (!result) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }

    res.status(200).json({ message: 'Favorite deleted.', deleted: result });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


app.post('/favorites', async (req, res) => {
  const favName = req.body.name;
  const favHeight = req.body.height;
  const favWeight = req.body.weight;
  const favExperience = req.body.base_experience;

  try {
    if (favExperience < 100 ) {
      throw new Error('Base experience gained if defeated this Pokemon is too low');
    }
    const existingFav = await Favorite.findOne({ name: favName });
    if (existingFav) {
      throw new Error('Favorite exists already!');
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const favorite = new Favorite({
    name: favName,
    height: favHeight,
    weight: favWeight,
    base_experience: favExperience,
  });

  try {
    await favorite.save();
    res
      .status(201)
      .json({ message: 'Favorite saved!', favorite: favorite.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_USERNAME}@mongodb:27017/pokemon_registry?authsource=admin`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(3000, () => console.log('Server on http://localhost:3000'));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})();



