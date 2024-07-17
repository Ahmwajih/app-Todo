const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const { Sequelize, DataTypes } = require('sequelize');

const  sequelize = new Sequelize('sqlite:./db.sqlite3');



const todo = sequelize.define('todo', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    create: {
        type: DataTypes.DATE,
        allowNull: false
    },
    done: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

//  sequelize.sync({ force: true }).then(() => {
//     console.log(`Database & tables created!`);
// })

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});








app.listen(port, () => {
    console.log(`server running on :${port}`);
});