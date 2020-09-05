
const http = require("http");
const url = require("url");
const fs = require("fs");
const { StringDecoder } = require('string_decoder');


const server = http.createServer(function(req, res) {
  //console.log(req.url);
  let parsedURL = url.parse(req.url, true);
  let path = parsedURL.pathname;
  
  path = path.replace(/^\/+|\/+$/g, "");
  console.log(path);
  let qs = parsedURL.query;
  let headers = req.headers;
  let method = req.method.toLowerCase();

  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
    console.log("got some data")
});

  req.on("end", function() {
    //request part is finished... we can send a response now
    console.log("send a response");
    
    buffer += decoder.end();

    const parsedPayload = buffer.length ? JSON.parse(buffer) : {};
    
    console.log(parsedPayload);
    req.body = parsedPayload;
    //we will use the standardized version of the path
    let route =
      typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];

    let data = {
      path: path,
      queryString: qs,
      headers: headers,
      method: method,
      payload: parsedPayload
    };
    //pass data incase we need info about the request
    //pass the response object because router is outside our scope
    route(data, res);
  });
});

server.listen(8080, function() {
  console.log("Listening on port 8080");
});

//define functions for the different Routes
//This object and the functions could be defined in another file that we import
//Each route has a function that takes two parameters
//data: the info about the request
//callback: the function to call to send the response
let routes = {
  books: function(data, res) {
      // let id = data.headers.id;
      
    //   function create_UUID(){
    //     var dt = new Date().getTime();
    //     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //         var r = (dt + Math.random()*16)%16 | 0;
    //         dt = Math.floor(dt/16);
    //         return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    //     });
    //     return uuid;
    // }
    let id = Math.floor(Math.random() * 100)
    let books = {
        id:id,
        name: 'The Man Died',
        author:'Wole Soyinka',
        price: "$20",
        publisher: "Lucius Trust"
    }

     if(data.method === 'get'){

      var nuUser = data.payload.name + ".json";
      fs.readFile(nuUser, (err)=> {
        console.log("information received");
        if (err) throw err;
    })

        let payloadStr = JSON.stringify(books);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200);
        res.write(payloadStr);
        res.end("\n");

     }
     else if(data.method === 'post')
     {
      
        let book = data.payload;
        var nuUser = data.payload.name + ".json";
         
      let newBook = JSON.stringify(book);
      fs.writeFile(nuUser, newBook , (err)=> {
          console.log('Book Saved');
          if (err) throw err;
      })
         
        //  let newBook = JSON.stringify(books)
         res.write(newBook);
         res.end()
     }
     else if(data.method === 'delete'){
      var nuUser = data.payload.name + ".json";  
     
     fs.unlink(nuUser, (err)=> {
         console.log('Book Deleted');
         if (err) throw err;
     })
        let deletedBook = JSON.stringify(books);
       //  let newBook = JSON.stringify(books)
        res.write(deletedBook);
        res.end()
     }
     else{
      var nuUser = data.payload.name + ".json";
       let book = data.payload; 
      let updatedBook = JSON.stringify(book);
      fs.writeFile(nuUser, updatedBook , (err)=> {
          console.log('Book Updated');
          if (err) throw err;
      })
         
        //  let newBook = JSON.stringify(books)
         res.write(updatedBook);
         res.end()
     }

  },
  users: function(data, res) {
  
    let users = {
      name: "Cartman",
      address: "Detroit 2 Off Big Sean's Lane"
    };
    if(data.method === 'get'){

      var nuUser = data.payload.name + ".json";
      fs.readFile(nuUser, (err)=>{
        if (err) throw err
        console.log('i got users')
      })
    let userStr = JSON.stringify(users);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(userStr);
    res.end("\n");
  }
  else if(data.method === 'post'){
    users = {
      name: data.payload.name,
      address: data.payload.address
    }
            var nuUser = data.payload.name + ".json";
            
            let newUser = JSON.stringify(users);
            fs.writeFile(nuUser, newUser , (err)=> {
                console.log('Information Saved');
                if (err) throw err;
            })
    
    res.writeHead(200);
    res.write(newUser);
    res.end("\n");
  }    
},
  "users/books": function(data, res) {
  
    let payload = {
      name: "Mysterion",
      enemy: "The Coon",
      today: +new Date()
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end("\n");
  },
  notFound: function(data, res) {
    //this one gets called if no route matches
    let payload = {
      message: "File Not Found",
      code: 404
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(404);

    res.write(payloadStr);
    res.end("\n");
  }
};