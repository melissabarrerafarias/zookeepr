const { animals } = require('./data/animals.json');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

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