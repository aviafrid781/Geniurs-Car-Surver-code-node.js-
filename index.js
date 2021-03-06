const express = require('express');

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zoeq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected database Successfully'); 
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        //Get multiple  api 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        })


        //Get single API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId };
            const service = await servicesCollection.findOne(query);
            res.json(service);


        })



        //POST API
        app.post('/services', async (req, res) => {

            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //delete API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        });


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running Genius-Car server');
})

app.listen(port, () => {
    console.log('Running geniours-Car-server', port);
})

//install heroku software

//step every project
// git init
//.gitignore
//push everything to git
//login commad
//heroku crate 
//command :git push heroku

// for update 
// 1. save everything cheakking locally 
//git add ,git cimmit-"",git push
//git push heroku main

