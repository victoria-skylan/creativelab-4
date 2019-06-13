const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();
var db = firebase.firestore();

var eventRef = db.collection('events');
        
app.get('/api/events', async (req, res) => {
    try{
        let querySnapshot = await eventRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.post('/api/events', async (req, res) => {
    try {
        let event = {
            id: Math.random(),
            eventDate: req.body.EventDate,
            month: req.body.Month,
            eventType: req.body.EventType,
            eventName: req.body.EventName,
            description: req.body.EventDescription,
            displayMess: req.body.DisplayMessage,
            reservations: req.body.Reservations,
          };
        eventRef.doc(event.id.toString()).set(event);
        res.send(event);
      } catch (error) {
        console.log(error);
        res.sendStatus(600);
      }
});
app.put('/api/events/:id', async (req,res) => {
    try {
        let thisID = req.params.id.toString();
        let event = {
            id: thisID,
            eventDate: req.body.EventDate,
            month: req.body.Month,
            eventType: req.body.EventType,
            eventName: req.body.EventName,
            description: req.body.EventDescription,
            displayMess: req.body.DisplayMessage,
            reservations: req.body.Reservations,
        }
        eventRef.doc(event.id.toString()).set(event);
        res.send(event);
    }catch (error) {
        console.log(error);
        res.sendStatus(600);
      }
});

app.delete('/api/events/:id', async (req,res) => {
    let id = req.params.id.toString();
    var documentToDelete = eventRef.doc(id);
    try{
        var doc = await documentToDelete.get();
        if(!doc.exists){
            res.status(404).send("was already deleted, something went wrong");
            return;
        }
        else{
            documentToDelete.delete();
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send(err);
    }
});


exports.app = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//curl -d '{"displayMess":"Daniel","reservations":"0"}' -H "Content-Type: application/json" -X POST localhost:5000/api/events
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });