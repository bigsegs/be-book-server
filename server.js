const http = require("http");

const fs = require("fs/promises");

const server = http.createServer((request, response) => {
   console.log('Hello')

  const { method, url } = request;

  if (method === "GET" && url === "/api") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify({ message: "Hello" }));
    response.end();
  } 

  else if (method === "GET" && url === "/api/books") {
    fs.readFile("./data/books.json").then((data) => {
      const books = JSON.parse(data);
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify({ books: books }));
      response.end();
    });
  }

   else if (method === "GET" && url === "/api/authors") {
    fs.readFile("./data/authors.json").then((data) => {
      const authors = JSON.parse(data);
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify({ authors: authors }));
      response.end();
    });
  }

   else if (method === "GET" && url.slice(0, 11) === "/api/books/") {
    const bookIdNum = Number(url.slice(11, url.length));

    fs.readFile("./data/books.json").then((data) => {
      const books = JSON.parse(data);
      // console.log(books)
      const book = books.filter((book) => {
        return book.bookId === bookIdNum;
      });
      let object = {};
      if (book.length < 1) {
        object = "Error 404 : Book not found";
      } else {
        object.book = book;
      }
      console.log(book);
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify(object));
      response.end();
    });
  }
  
   else if (method === "POST" && url === "/api/books") {
    let body = "";
    request.on("data", (packet) => {
      body += packet.toString();
      request.on("end", () => {
        const newBook = JSON.parse(body);
        //console.log(newBook);
        fs.readFile('./data/books.json')
        .then((fileContents) => {
            const booksArr = JSON.parse(fileContents)
            //console.log(booksArr)
            console.log(newBook)
            const returnBooks = [...booksArr, newBook]  
            return fs.writeFile('./data/books.json', JSON.stringify(returnBooks, null, 2))
            .then(()=>{
                response.setHeader('Content-Type', 'applications/json')
                response.statusCode = 201;
                console.log({returnBooks},"before JSON.stringify")
                response.write(JSON.stringify({returnBooks}))
                response.end()
            })
        })
      });
    });
  }

  // response.statusCode=404;
  // response.setHeader("Content-Type", "application/json");
  //  response.write(JSON.stringify({Error:"404 not found"}));
  //  response.end();
});

server.listen(9090, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server listening on port 9090");
  }
});
