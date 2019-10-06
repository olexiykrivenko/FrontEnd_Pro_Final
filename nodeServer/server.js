var fs = require('fs');
let express = require('express');                 //подключить express
let bodyParser = require('body-parser');          //body-parser

let app = express();                              //server is created
app.use(bodyParser.json());                       //parse from body
app.use(bodyParser.urlencoded({extended: true})); //parse from form

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

//send tasks from tasksDatabase.json to client
app.get('/tasks', (req, res) => {
    let list = JSON.parse(fs.readFileSync('tasksDatabase.json', 'utf8'));
    res.send(list);
});


//post new task into tasksDatabase.json
app.post('/tasks', (req, res) => {
    let list = JSON.parse(fs.readFileSync('tasksDatabase.json', 'utf8'));
    list.push(req.body);
    list = JSON.stringify(list, null, 2);
    fs.writeFile('tasksDatabase.json', list, function(error, data){
        if(error) throw new Error("tasksDatabase.json is not available");
    })
    res.send("added");
})


//change existing record in tasksDatabase.json
app.put('/tasks/update', (req, res) => {
    let list = JSON.parse(fs.readFileSync('tasksDatabase.json', 'utf8'));
    list.forEach(item => {
        if(item.id === req.body.id){
            item.taskText = req.body.taskText;
        }
    })

    list = JSON.stringify(list, null, 2);
    fs.writeFile('tasksDatabase.json', list, function(error, data){
        if(error) throw new Error("tasksDatabase.json is not available");
    })

    res.send("updated");
})


//delete record from tasksDatabase.json
app.delete('/tasks/:id', (req, res) => {
    let list = JSON.parse(fs.readFileSync('tasksDatabase.json', 'utf8'));
    list = list.filter(listTask => listTask.id !== req.params.id);
    list = JSON.stringify(list, null, 2);
    fs.writeFile('tasksDatabase.json', list, function(error, data){
        if(error) throw new Error("tasksDatabase.json is not available");
    })
    res.send("deleted");
})



app.listen(4321, () => console.log('API started'));