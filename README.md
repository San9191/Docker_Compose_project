Ever wanted to catch Pokémon… but instead of throwing Pokéballs, you use API requests?
Well, this little NodeJS app  lets you do exactly that. 🎉

What This Project Does 🚀

GET /pokemons → Picks a random Pokémon from the PokéAPI
 and tries to save it as your favorite, if the Pokemon is of the strong ones.

POST /favorites → Save your own favorite Pokémon manually (if they have base experience ≥ 100).

GET /favorites → See all the Pokémon you’ve honored with a spot in your heart (and your database).

DELETE /favorites/name/:name → Release a Pokémon from your favorites (sad but sometimes necessary 🪦).

Tech Stack 🛠

Node.js + Express → API structure

MongoDB + Mongoose → digital Pokémon collection database 

Axios → Sending requests to the Poke API

body-parser → Making sense of JSON payloads

