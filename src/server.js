 
// // import { drizzle } from 'drizzle-orm/node-postgres';
// // import { eq } from 'drizzle-orm';
// // import { usersTable } from './db/schema.js';
// // import cors from 'cors';
// // import bcrypt from 'bcrypt';
// // import dotenvt from 'dotenv';



// // import express from 'express';
// // const app = express();

// // dotenvt.config();

// // app.use(express.json())

// // app.use(cors({
// //     origin: '*',
// //     methods: ['GET', 'POST', 'OPTIONS'],
// //     allowedHeaders: ['Content-Type']
// // }));

// // const db = drizzle(process.env.DATABASE-URL);

// // app.get ('/', function (req, res){

// //     const string = "hdfhyrrrrrrrrrrrrrrrrrrrrr"
// //     console.log("string");
// //     console.log(string);
    
// //     res.json("Hello!")
// // })

// // app.post ('/users', async function (req, res){

// //     try{
// //     const { firstName, lastName, email, password} = req.body

// //     console.log('data comming from backend is');
// //     console.log(firstName, lastName, email, password);
    

// //     if(!firstName){
// //         res.json({
// //             msg:"provide all the required things!"
// //         })
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //    const emailCheck = await db.select().from(usersTable).where(eq(usersTable.email, email));

// //         console.log('email check is', emailCheck);
        

// //         if(emailCheck){
// //            return  res.json({
// //                 msg:"please enter another email as it is already exists!"
// //             })
// //         }

   
// //    const user1 =  await db.insert(usersTable).values({
// //         firstName,
// //         lastName,
// //         email,
// //         password: hashedPassword
// //     });
// //     console.log("New user created!")

// //     res.json({
// //         msg:"user created successful!",
// //         user1
// //     })
// // }catch(error){
// //     res.json({
// //         msg:"error found",
// //         error
// //     })
// // }
// // })

// //  app.post('/user', async function (req, res){
// //     const user = req.body
// //     user = {
// //         name: "",
// //         email: "",
// //         password: ""
// //     };

// //     res.json(user);
// //  })



// // app.listen(3333, function(){
// //     console.log("Server is on, 3333")
// // })






// // UPDATED / FIXED CODE
// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { eq } from 'drizzle-orm';
// import { usersTable } from './db/schema.js';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import express from 'express';

// const app = express();

// app.use(express.json());

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type']
// }));

// const db = drizzle(process.env.DATABASE_URL);

// app.get('/', (req, res) => {
//   res.json({ msg: 'Hello!' });
// });

// app.post('/users', async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;

//     if (!firstName || !lastName || !email || !password) {
//       return res.status(400).json({
//         msg: 'Please provide all required fields!'
//       });
//     }

//     const existingUsers = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.email, email));

//     if (existingUsers.length > 0) {
//       return res.status(409).json({
//         msg: 'Please enter another email; this email already exists!'
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [newUser] = await db
//       .insert(usersTable)
//       .values({
//         firstName,
//         lastName,
//         email,
//         password: hashedPassword
//       })
//       .returning();

//     return res.status(201).json({
//       msg: 'User created successfully!',
//       user: newUser
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       msg: 'Something went wrong',
//       error: error.message
//     });
//   }
// });

// app.post('/user', (req, res) => {
//   const user = {
//     name: '',
//     email: '',
//     password: ''
//   };

//   res.json(user);
// });

//  app.get('/posts', async function (req, res) {
//   try {
//     // This will now work perfectly because schema is provided to Drizzle
//     const posts = await db.query.posts.findFirst();

//     return res.json({
//       msg: "posts retrieved success!",
//       posts
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       msg: 'something went wrong',
//       error: err.message // Best practice to send back the string message
//     });
//   }
// })

// app.listen(3333, () => {
//   console.log('Server is running on port 3333');
// });




import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { defineRelations, eq } from 'drizzle-orm';
// import { usersTable } from './db/schema.js';
import { usersTable, posts } from './db/schema.js'; 
// Import your whole schema file so Drizzle can map db.query
import * as schema from './db/schema.js'; 
import cors from 'cors';
import bcrypt from 'bcrypt';
import express from 'express';
// import db from "./index.js"

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// FIX: Pass the schema configuration into the drizzle initialization block
const relations = defineRelations (schema);
const db = drizzle({ connection: process.env.DATABASE_URL, relations });

app.get('/', (req, res) => {
  res.json({ msg: 'Hello!' });
});

app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        msg: 'Please provide all required fields!'
      });
    }

    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUsers.length > 0) {
      return res.status(409).json({
        msg: 'Please enter another email; this email already exists!'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        // The "age" column holds last names in the existing data.
        name: firstName,
        age: lastName,
        email,
        password: hashedPassword
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email
      });

    return res.status(201).json({
      msg: 'User created successfully!',
      user: newUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Something went wrong',
      error: error.message
    });
  }
});

app.post('/user', (req, res) => {
  const user = {
    name: '',
    email: '',
    password: ''
  };

  res.json(user);
});

app.get('/posts', async function (req, res) {
  try {
    // This will now work perfectly because schema is provided to Drizzle
    const posts = await db.query.posts.findMany();

    return res.json({
      msg: "posts retrieved success!",
      posts
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: 'something went wrong',
      error: err.message // Best practice to send back the string message
    });
  }
});

app.get ('/users', async function (req, res){
  try{
    const users = await db.query.usersTable.findMany({
      columns: { password: false }
    });

    return res.json({
      msg: "data fetched succsessful!",
      users
    });
  } catch (err) {
    console.error (err);
    return res.status(500).json({
      msg: 'something went wrong',
      error: err.message
    });
  }
});

app.listen(3333, () => {
  console.log('Server is running on port 3333');
});
