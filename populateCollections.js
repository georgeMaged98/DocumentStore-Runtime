const mongoose = require('mongoose')

const { createModel } = require('./schemas')
const { connectDB } = require('./connectDB')
const populateTasksAndTimesheets = async () => {
  try {
    const TasksAndTimesheets = await createModel('TasksAndTimesheets')
    // console.log(TasksAndTimesheets)
    const tasksAndTimesheets = [
      {
        Task: {
          points: 2,
          type: 'Design',
          name: 'Task 1',
          modelStoreId: 1,
          startDate: new Date(),
          endDate: new Date('2021-8-14'),
          Timesheets: [
            {
              Timesheet: {
                hrs: 3,
                description: 'QWERTY',
                modelStoreId: 1,
              },
            },
            {
              Timesheet: {
                hrs: 5,
                description: 'Task Reviewrdsafdc',
                modelStoreId: 2,
                Reviewer: {
                  User: {
                    firstName: 'George',
                    lastName: 'Maged',
                    gender: 'male',
                    modelStoreId: 1,
                  },
                },
              },
            },
          ],
        },
      },
      {
        Task: {
          points: 5,
          type: 'Tech',
          name: 'Task 2',
          startDate: new Date(),
          endDate: new Date('2021-8-30'),
          modelStoreId: 2,
        },
      },
    ]

    const tasksPromises = []
    tasksAndTimesheets.forEach((task) => {
      tasksPromises.push(TasksAndTimesheets.create(task))
    })

    await Promise.all(tasksPromises)
    console.log('Tasks and Timesheets Created!')
  } catch (err) {
    console.log(err)
  }
}

const populateViewProjectAndTeamMembers = async () => {
  try {
    const ViewProjectAndTeamMembers = await createModel(
      'ViewProjectAndTeamMembers'
    )
    const projects = [
      {
        Project: {
          type: 'Marketing',
          name: 'Project 1',
          modelStoreId: 1,
          TeamMembers: [
            {
              User: {
                firstName: 'Youssef',
                lastName: 'Sewefy',
                modelStoreId: 1,
                MySalary: {
                  Wallet: {
                    baseSalary: 0,
                    timesheetSalary: 5000,
                    modelStoreId: 1,
                  },
                },
              },
            },
            {
              User: {
                firstName: 'George',
                lastName: 'Maged',
                MySalary: {
                  Wallet: {
                    baseSalary: 0,
                    timesheetSalary: 3000,
                    modelStoreId: 2,
                  },
                },
                modelStoreId: 2,
              },
            },
          ],
          Owner: {
            User: {
              firstName: 'Samir',
              lastName: 'Orabi',
              modelStoreId: 3,
            },
          },
        },
      },
      {
        Project: {
          type: 'Development',
          name: 'Project 2',
          modelStoreId: 2,
          TeamMembers: [
            {
              User: {
                firstName: 'Youssef',
                lastName: 'Sewefy',
                MySalary: {
                  Wallet: {
                    baseSalary: 0,
                    timesheetSalary: 5000,
                    modelStoreId: 1,
                  },
                },
                modelStoreId: 1,
              },
            },
          ],
          Owner: {
            User: {
              firstName: 'Samir',
              lastName: 'Orabi',
              modelStoreId: 3,
            },
          },
        },
      },
    ]

    const projectsPromises = []
    projects.forEach((task) => {
      projectsPromises.push(ViewProjectAndTeamMembers.create(task))
    })
    await Promise.all(projectsPromises)
    console.log('Projects Created!')
  } catch (err) {
    console.log(err)
  }
}

const populate = async () => {
  // await populateTasksAndTimesheets()
  await populateViewProjectAndTeamMembers()
}
const start = async () => {
  await connectDB()
  await populate()
}

start()

module.exports = {
  populateTasksAndTimesheets,
}
