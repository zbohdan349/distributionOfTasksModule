const graphql = require('graphql');

const User = require('../models/User');
const Task = require('../models/Task');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLEnumType,
    GraphQLList,
    GraphQLNonNull
} = graphql;


const TaskStateEnumType = new GraphQLEnumType({
    name: 'TaskStateEnum',
    values: {
        TODO: {value: 'todo'},
        PROGRESS: {value: 'progress' },
        DONE: { value: 'done' },
        PAUSE: { value: 'pause' }
    },
});

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        login:{type:GraphQLString},
        password:{type:GraphQLString},
    })
});

const taskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        due: { 
            type: GraphQLString,
            resolve(parent,args){
                const date = new Date(parent.due);
                return date.toLocaleString();
            } 
        },
        status:{type:TaskStateEnumType},
        from:{
            type: userType,
            resolve(parent,args){
                return User.findById(parent.from)
            }
        },
        to:{
            type: userType,
            resolve(parent,args){
                return User.findById(parent.to)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: userType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(userType),
            resolve(parent, args){
                return User.find({});
            }
        },
        task: {
            type: taskType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Task.findById(args.id);
            }
        },
        tasks: {
            type: new GraphQLList(taskType),
            resolve(parent, args){
                return Task.find({});
            }
        },
        myTasks: {
            type: new GraphQLList(taskType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Task.find({to: args.id});
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: userType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                login: { type: new GraphQLNonNull(GraphQLString) },
                password:{ type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let user = new User({
                    username: args.username,
                    login: args.login,
                    password:args.password
                });
                return user.save();
            }
        },
        addTask: {
            type: taskType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                from: { type: new GraphQLNonNull(GraphQLID) },
                due: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                const date = new Date(args.due);

                let task = new Task({
                    title: args.title,
                    description: args.description,
                    from: args.from,
                    status:args.status,
                    due:date
                });
                return task.save();
            }
        },
        assignTask: {
            type: taskType,
            args: {
                task_id: { type: new GraphQLNonNull(GraphQLID) },
                user_id: { type: new GraphQLNonNull(GraphQLID) },

            },
            resolve(parent, args){

                return Task.findOneAndUpdate(
                    {_id:args.task_id},
                    {to:args.user_id}, 
                    {new:true}
                );
            }
        },
        setStatus: {
            type: taskType,
            args: {
                task_id: { type: new GraphQLNonNull(GraphQLID) },
                status: { type: new GraphQLNonNull(TaskStateEnumType) },

            },
            resolve(parent, args){

                return Task.findOneAndUpdate(
                    {_id:args.task_id},
                    {status:args.status}, 
                    {new:true}
                );
            }
        },
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});


