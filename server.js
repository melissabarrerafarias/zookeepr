const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals.json');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
//parse incoming string or array data 
app.use(express.urlencoded({ extended: true }));
//pase incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];

    // Note that we save the animalsArray as filteredResults here
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        //save personalityTraits as a dedicated array. If its a string, place it into a new array and save. 
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }
        // check the trait of each animal in the filterdResults array. For each trait being targetted by the filter, the filteredResults array will then contain only the entries that contain
        // the trait, so at the end we'll have an array of aninmals that have every one
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }

    return true;
}


app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect send a 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }
    else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});














// start off in your terminal by running "npm init -y" (-y standing for yes and it measn to initialize a local npm repo with an implicit "yes" for all of the prompts.). Then run "npm i express", 
// ("i" standing for "install"). 

// setting up the server only takes two steps: we need to instantiate the server, then tell it to listen for requests. 

// const app = express();

// ^ here we assign express() to the app variable so that we can later chain on methods to the Express.js server. Now we just need to use on method to make our server listen. We're going to chain 
// the listen() method onto our server to do it. To do that we need to add the following code to the end of the server.js file: 

// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
//   });

// what are ports? Imagine that a website is like a college campus. A website has an address, referred to as the host. A college campus also has an address. The host tells the client where to
// go, but it doesn't specify exactly where to go. Likewise, if you have the address for a college campus, you don't know exactly which building or classroom to go to. The port is like a
// building/classroom; it gives the exact desination on the host. If you're on the internet, chances are you're visiting the address on one of two ports: 80 or 443. 80 is typically used
// for sites that begin with http://, and 443 is used for sites that begin with https://. Running our server on any port with numbers 1024 and under are considered special by operating 
// systems, and often require special permission. 


// app.get('/api/animals', (req, res) => {
//     res.send('Hello!');
//   });
// there are two important takeaways from this code: 
// the first is that the get() method requires two arguments. the first is a string that describes the route the client will have to fetch from. The second is a callback function that will 
// execute every time that route is accessed with a GET request. the second takeaway is that we are using the send() method from the res parameter to send the string "Hello!" to our client.


// function filterByQuery(query, animalsArray) {
//     let filteredResults = animalsArray;
//     if (query.diet) {
//         filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
//     }
//     if (query.species) {
//         filteredResults = filteredResults.filter(animal => animal.species === query.species);
//     }
//     if (query.name) {
//         filteredResults = filteredResults.filter(animal => animal.name === query.name);
//       }
//     return filteredResults;
// }
// This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array. 


// let personalityTraitsArray = [];

//     let filteredResults = animalsArray;

//     if(query.personalityTraits) {
//         if (typeof query.personalityTraits === 'string') {
//             personalityTraitsArray = [query.personalityTraits];
//         }
//         else {
//             personalityTraitsArray = query.personalityTraits;
//         }

//         personalityTraitsArray.forEach(trait => {
//             filteredResults = filteredResults.filter(
//                 animal => animal.personalityTraits.indexOd(trait) !== -1
//             );
//         });
//     }
// We're revising the filteredResults array for each trait that we loop through with .forEach(). Each iteration revises filteredResults so that it only contains animals that have all of the 
// traits we are targeting. 


// We have to pay extra attention to the order of the routes when we are working with mutiple. A param route must come after the other GET route. We could have used findbyQuery instead of 
// findByID... but findById() will for certain return a single animal, because the id is unique. We also know that there won't be a query on a single animal, so there's no need for all 
// that other code. 



// app.post('/api/animals', (req, res) => {}); 
// this is another method of the app object that allows us to create rotues, much like app.get(). This method doesn't say get though, it says post, which means that we defined a route that
// listens for POST requests, not GET requests. POST requests differ from GET requests in that they represent the action of a client requesting the server to accept data rather than 
// vice versa. 
// If we make a GET request to /api/animals, then the app.get('/api/animals') callback function will execute. But is its a POST request, it'll go to the one we just created. 

// app.post('/api/animals', (req, res) => {
//     // req.body is where our incoming content will be
//     console.log(req.body); 
//     res.json(req.body);
// });
// we are using the info that the request object (the req in our callback function) gives us. Earlier, we used req.query and req.params to look for specific data that our server can send back 
// to the client. With POST requests, we can package up data, typically as an object, and send it to the server. The req.body property is where we can access that data on the server side and
// do something with it. In this code, we are simply using console.log() to view the data we're posting to the server and then using res.json() to send the data back to the client. Obviously 
// this isn't what we'll typically do with a POST request, but when creating and resting new routes, it's the fastest way to ensure that the data send from the client gets to the endpoint 
// correctly. 


//parse incoming string or array data 
// app.use(express.urlencoded({ extended: true}));
//pase incoming JSON data
// app.use(express.json());
// Here we used the app.use() method. this method executed by our express.js server that mounts a function to the server that our requests will pas through before gettng to the intended 
// endpoint. the functions we can mount to our server are referred to as middleware. 
// MIDDLEWARE FUNCTIONS can serve many different purposes. Utlimately they allow us to keep our route endpoint callback functions more readable while letting us reuse functionality
// across routes to keep our code DRY. 
// express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object.
// the extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POSt data as possible to 
// parse all of the data correctly. 
// the express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body Javascript object. Both of the above middleware functions need to be set up 
// everytime you create a server that's looking to accept POST data. 



// app.post('/api/animals', (req, res) => {
//     // set id based on what the next index of the array will be
//      req.body.id = animals.length.toString();

//      // add animal to json file and animals array in this function
//      const animal = createNewAnimal(req.body, animals);

//     // req.body is where our incoming content will be
//     res.json(animal);
// });

// function createNewAnimal(body, animalsArray) {
//     const animal = body;
//     animalsArray.push(animal);

//     // return finished code to post route for response
//     return animal;
// }
// Now when we POST a new animal, we'll add it to the imported animals array from the animals.json file. Keep in mind though, that whenever we use require() to import data or functionaility, 
// its only reading the data and creating a copy of it to use in server.js. So nothing we do with the imported data will ever affect the content of the file from  which that data came. We'll
// have to not only use .push() to save the new data in this local server.js copy of our animal data, but we'll also have to import and use the fs library to write that data to animals.json. 


// const path = require('path');
// this is another module built inot the node.js API that provides utilities for working with file and directory paths. It ultimately makes working with our file system a little more
// predicatbale, especially when we work with production enviornments such as Heroku. 


// function createNewAnimal(body, animalsArray) {
//     const animal = body;
//     animalsArray.push(animal);

//     fs.writeFileSync(
//         path.join(__dirname, './data/animals.json'),
//         JSON.stringify({ animals: animalsArray }, null, 2)
//     );

//     // return finished code to post route for response
//     return animal;
// }
// Here we are using the fs.writeFileSync() method, which is the synchronous version of fs.writeFile() and doesn't require a callback function. We want to write to our animals.json file in
// the data subdirectory, so we use the method path.join() to join the value of __dirname, which represents the directory of the file we executed the code in, with the path to the
// animals.json file. Next we need to save the Javascript array data as JSON, so we use JSON.stringify() to convert it. The other arguments used in the method, null and 2, are means of
// keepin out data formatted. The null argument means e dont want to edit any of our existing data, if we did, we could pass something in there. The 2 indicates we want to create white space
// between our values to make it more readable. If we were to leave those two arguments out, the entire animals.json file would worl, but it would be really hard to read. 


// app.post('/api/animals', (req, res) => {
//     // set id based on what the next index of the array will be
//     req.body.id = animals.length.toString();

//     // if any data in req.body is incorrect send a 400 error back
//     if (!validateAnimal(req.body)) {
//         res.status(400).send('The animal is not properly formatted.');
//     }
//     else {
//         // add animal to json file and animals array in this function
//         const animal = createNewAnimal(req.body, animals);
//         res.json(animal);
//     }
// });
// Here we added validation to ensure the user inputs correct information. When we dont send data the server can use or understand, we respond with a 400 error. This indicates to the user that 
// our server doesn't have any problems and we can understand their request, but they incorrectly made the request and we can't allow it to work. 
// the line res.status().send() is a response method to relay a message to the client making the request. We send them an HTTP status code and a message explaning what went wrong. Anything
// in the 400 range means that it's the user error and not a server error, and the message can help the user understand what went wrong on their end. 