const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"Sunny","password":"12345"},
            {"username":"Bunny","password":"ffg"},
            {"username":"Chunni","password":"fghhgfh"}
];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid
for(let user of users){
  
  if(username===user.username)
    {
      return true
    }
}
return false
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

if(isValid(username)){
   
  for(let user of users){
    if(user.password===password)
      {
        return true
      }
  }
return false
}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username=req.body.username
  let password=req.body.password


  if(authenticatedUser(username,password)){

    const accessToken=jwt.sign({username},"access",{expiresIn:'50s'})
    req.session.authorization ={accessToken}
    return res.status(200).json({ message: "Login successful" });
  }
  else{
    return res.status("404").send("Password or username provided are invalid")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here 
   // Retrieve username from the session
   let username=null
   jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      // If the token is invalid or expired, handle the error
      console.error("Error verifying JWT token:", err);
      // Handle the error, such as responding with a 403 Forbidden status
      return res.status(403).json({ message: "Invalid or expired token" });
    } else {
      // If the token is valid, retrieve the username from the decoded payload
      username = decoded.username;
      // Now you have the username available for further processing
      console.log("Username:", username);
      // Proceed with your logic here
      // For example, you can use the username to fetch user-specific data or perform actions
    }
  });

   if (!username) {
     return res.status(401).json({ message: "User not logged in" });
   }
 
   // Extract review from the request body
   const review = req.body.review;
   const isbn = req.params.isbn;
 
   if (!review) {
     return res.status(400).json({ message: "Review is required" });
   }
 
   // Check if a review for the given ISBN already exists for the current user
   if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
     // If a review exists, modify it
     books[isbn].reviews[username] = review;
     return res.status(200).json({ message: "Review modified successfully" });
   } else {
     books[isbn].reviews[username] = review;
     return res.status(200).json({ message: "Review added successfully" });
   }
});

const getusername = (token)=>{ //returns boolean
  //write code to check if the username is valid
 
  
  }

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here 
   // Retrieve username from the session
   let username;
   jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      // If the token is invalid or expired, handle the error
      console.error("Error verifying JWT token:", err);
      // Handle the error, such as responding with a 403 Forbidden status
      return res.status(403).json({ message: "Invalid or expired token" });
    } else {
      // If the token is valid, retrieve the username from the decoded payload
      username = decoded.username;
      // Now you have the username available for further processing
      console.log("Username:", username);
       
      // Proceed with your logic here
      // For example, you can use the username to fetch user-specific data or perform actions
    }
  });
 

   if (!username) {
     return res.status(401).json({ message: "User not logged in" });
   }
 
   // Extract review from the request body
    
   const isbn = req.params.isbn;
 
    
   // Check if a review for the given ISBN already exists for the current user
   if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
     // If a review exists, modify it
     delete books[isbn].reviews[username]
     return res.status(200).json({ message: "Review deleted successfully" });
   } else {
    return res.status(200).json({ message: "No review exist for current user!" });
   }

  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
