const { shield, rule, and, or } =require('graphql-shield')

  const isMaster = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.currentUser.role == 'MASTER'
  })
   
  const isSlave = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.currentUser.role == 'SLAVE'
  })
   
  // Permissions
  const permissions = shield({
    Query: {
      user: or(isMaster,isSlave),
      users: or(isMaster, isSlave),
      task: or(isMaster, isSlave),
      tasks: or(isSlave, isMaster),
    },
    Mutation:{
      addUser: isMaster,
      addTask: isMaster,
      assignTask: isMaster,
      setStatus: isMaster
    }
  })
  module.exports = {
    permissions
  }