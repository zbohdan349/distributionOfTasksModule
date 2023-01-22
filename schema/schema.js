const User = require('../models/User');
const Task = require('../models/Task');

const typeDefs = `
    enum Role {
        MASTER
        SLAVE
    }  
    enum TaskState {
        TODO
        PROGRESS
        DONE
        PAUSE   
    }
    type User {
        id:ID!
        username: String!
        login: String!
        password: String!
        role: Role!
    }
    type Task {
        id:ID!
        title: String!
        description: String!
        due: String!
        status: TaskState
        from: User
        to: User
    }

    type Query {
        user(id: ID!): User
        users:[User]!
        task(id: ID!): Task
        tasks:[Task]!
        myTasks: Task
    }

    type Mutation {
        addUser(input: AddUserInput!): User
        addTask(input: AddTaskInput!): Task
        assignTask(task_id: ID!, user_id: ID!): Task
        setStatus(task_id: ID!, status: TaskState!): Task
        
    }

    input AddUserInput {
        username: String!
        login: String!
        password:String!
        role: Role!
    }
    input AddTaskInput {
        title: String!
        description: String!
        due: String
        status: TaskState
        from: ID!
    }
`;
const resolvers = {

    Task:{
        async from(parent){
            return await User.findById(parent.from)
        },
        async to(parent){
            return await User.findById(parent.to)
        },
    },
    Query: {
        async user(parent, args, contextValue, info) {
            return await User.findById(args.id);
        },
        async users(parent, args, contextValue, info) {
            return await User.find({});
        },
        async task(parent, args, contextValue, info) {
            return await Task.findById(args.id);
        },
        async tasks(parent, args, contextValue, info) {
            return await Task.find({});
        },
        async myTasks(parent, args, contextValue, info) {
            return await Task.find({to: args.id});
        },
       
    },
    Mutation: {
        async addUser(_, {input}){
            let user = new User({
                ...input
            });
            return await user.save();
        }, 
        async addTask(_, {input}){
            let task = new Task({
                ...input
            });
            return await task.save();
        },
        async assignTask(_, {task_id, user_id}){
            return await Task.findOneAndUpdate(
                {_id: task_id},
                {to: user_id}, 
                {new: true}
            );
        } 
    },
}
module.exports = {
    typeDefs,
    resolvers
}
