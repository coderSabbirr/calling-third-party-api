const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
async function run() {
  try {
    // todo api
    app.get("/todos", async (req, res) => {
      async function getTodo() {
        try {
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
          );
          return response.data;
        } catch (error) {
          //  on errors.
        }
      }
      const todosCollection = await getTodo();
      const result = todosCollection.map((todo) => {
        delete todo.userId;
        return todo;
      });
      res.json(result);
    });

    app.get("/user/:id", async (req, res) => {
      const userId = req.params.id;
      let todoApi = "https://jsonplaceholder.typicode.com/todos";
      let userApi = `https://jsonplaceholder.typicode.com/users/${userId}`;

      const todoRequest = axios.get(todoApi); //todo api request
      const userRequest = axios.get(userApi); // users api request

      axios
        .all([todoRequest, userRequest])
        .then(
          axios.spread((...responses) => {
            const todoResponse = responses[0];
            const userResponse = responses[1];

            const { id, name, phone, email } = userResponse.data;

            let userDeatils = {
              id,
              name,
              email,
              phone,
              todos: todoResponse.data,
            };

            res.json(userDeatils);
          })
        )
        .catch((errors) => {
          //  on errors.
        });
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
