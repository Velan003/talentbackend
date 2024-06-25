const mongoose = require('mongoose'); // connecting monogodb
const express = require('express');// connecting express
const cors = require('cors');//connecting crosss origin
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://senthilvelans21it:murugan@cluster0.7dpgmnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')//used for connecting server and database

    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error(err);
    });

const DBSchema = new mongoose.Schema({//Schema () is used to create schema

    todo: { type: String, require: true },
});

const DBModel = mongoose.model('student', DBSchema);//creating collections

//now creating schema for signup

const DBScheme = new mongoose.Schema({//Schema () is used to create schema

    fullName: { type: String, require: true },

    email: { type: String, require: true },

    password: { type: String, require: true },

   aadharNumber: { type: Number, require: true },

   phoneNumber: { type: Number, require: true }
});


const DBDetail = mongoose.model('signup', DBScheme);


app.use(express.json());
app.use(cors());
app.post('/posting', async (req, resp) => {
    try {
        const user = new DBModel(req.body);
        const results = await user.save();
        const datasending = results.toObject();
        //text string
        // converting all datas to obj
        resp.send(datasending);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});



//post for signup


app.post('/signup', async (req, resp) => {
    try {
        const {fullName,
            email,
            password,
            aadharNumber,
            phoneNumber}=req.body.formData;
            
        const user = new DBDetail({fullName,email,password,aadharNumber,phoneNumber});
        console.log(user);
        const results = await user.save();
        const datasending = results.toObject();
        
        //text string
        // converting all datas to obj
        resp.send(datasending);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});

app.get('/getting', async (req, resp) => {
    try {
        const users = await DBModel.find({}, 'todo');
        resp.json(users);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to retrieve user data');
    }
});

app.put('/updating/:id', async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const updatedTodo = await DBModel.findByIdAndUpdate(
            id,
            { todo },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).send('Todo not found');
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Failed to update todo:', error);
        res.status(500).send('Failed to update todo');
    }
});



app.delete('/deleting/:id', async (req, resp) => {
    try {
        const { id } = req.params;

        const result = await DBModel.findByIdAndDelete(id);

        if (!result) {
            return resp.status(404).send('Todo not found');
        }

        resp.send('Todo deleted successfully');
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to delete todo');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

