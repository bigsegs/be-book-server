const http = require("http");

const fs = require("fs/promises");

const server = http.createServer((request, response) => {
  //console.log('Hello')
  const { method, url } = request;
  if (method === "GET" && url === "/api") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify({ message: "Hello" }));
    response.end();
  } else if (method === "GET" && url === "/api/books") {
    fs.readFile("./data/books.json").then((data) => {
      const books = JSON.parse(data);
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify({books: books}));
      response.end();
    });
  } else if (method === "GET" && url === "/api/authors"){
    fs.readFile("./data/authors.json").then((data) => {
      const authors = JSON.parse(data);
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify({authors: authors}));
      response.end();
    });
  } else if (method === "GET" && url === "/api/books/1"){
    fs.readFile("./data/books.json").then((data) => {
      const books = JSON.parse(data);
      console.log(books)
      const book = books.filter((book) => {
        return book.bookId === 1
      })
      console.log(book)
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify({book: book}));
      response.end();
    });
  }
});

server.listen(9090, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server listening on port 9090");
  }
});
