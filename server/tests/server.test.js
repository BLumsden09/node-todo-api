const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'I am a todo'
}, {
  _id: new ObjectID(),
  text: 'I am another todo',
  completed: true,
  completedAt: 555
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) =>{
    var text = 'Testing Text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {return done(err);}

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) =>{
      if (err) {return done(err);}

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) =>{

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) =>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) =>{
    let tempID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${tempID}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) =>{
    let nonID = '123';
    request(app)
      .get(`/todos/${nonID}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete todo doc', (done) =>{
    let deleteID = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${deleteID}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(deleteID);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        Todo.findById(deleteID).then((todo) =>{
          expect(todo).toBeNull();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) =>{
    let tempID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${tempID}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', (done) =>{
    let nonID = '123';
    request(app)
      .delete(`/todos/${nonID}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) =>{
    let updateID = todos[0]._id.toHexString();
    let updateText = "I am an updated todo";
    request(app)
      .patch(`/todos/${updateID}`)
      .send({text: updateText, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateText);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }
        done();
      });
  });

  it('should clear completedAt when todo is not completed', (done) =>{
    let updateID = todos[1]._id.toHexString();
    let updateText = "I am another updated todo";
    request(app)
      .patch(`/todos/${updateID}`)
      .send({text: updateText, completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateText);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }
        done();
      });
  });
});
