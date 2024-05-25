const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let user=req.body
  let username=user.username
 
  if(!isValid(username)){
    users.push(user)
    return res.status(200).send("User registered successfully")
  }
  else{
    return res.status(400).send("user already registered")
  }



});

// Get the book list available in the shop


let myPromise = new Promise((resolve,reject) => {
  public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
    resolve("Promise resolved")
  });
  })
//Console log before calling the promise
 
//Call the promise and wait for it to be resolved and then print a message.
myPromise.then((successMessage) => {
  console.log("From Callback " + successMessage)
})




public_users.get('/registeredUsers',function (req, res) {
   
  res.send(JSON.stringify(users,null,4));
});

let myPromise2 = new Promise((resolve,reject) => {
  public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let isbn=req.params.isbn
    if(isbn){
      res.send(books[isbn]) 
      resolve("Promise resolved")
    }
    else{
      res.send("Isbn not found!") 
      reject("Promise rejected")
    }
    
   });
  })
//Console log before calling the promise
 
//Call the promise and wait for it to be resolved and then print a message.
myPromise2.then((successMessage) => {
  console.log("From Callback " + successMessage)
})


 
  
// Get book details based on author

let myPromise3 = new Promise((resolve,reject) => {
  public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let author=req.params.author
    let foundAuthor=false
    for(let sbn in books){
      if(books[sbn].author.toLowerCase() === author.toLowerCase())
        {
          res.send(books[sbn]) 
          resolve("Promise resolved")
        }
    }
   
    if(foundAuthor==false){
      res.send("author not found!") 
      reject("Promise resolved")
    }
    
  });
  })
//Console log before calling the promise
 
//Call the promise and wait for it to be resolved and then print a message.
myPromise3.then((successMessage) => {
  console.log("From Callback " + successMessage)
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title=req.params.title
  for(let sbn in books){
    if(books[sbn].title.toLowerCase()===title.toLocaleLowerCase()){
      return res.send(books[sbn])
    }
  }


 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn
  if(isbn in books)
    {
      return res.send(books[isbn].reviews)
    }
  
  
});

module.exports.general = public_users;
