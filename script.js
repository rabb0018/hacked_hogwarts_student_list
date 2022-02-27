"use strict";


// global variables 
const allStudents = []; 
let studentData;
let popUp = document.querySelector(".singlestudent");



const Student = {
firstName: "",
middlename: "",
nickName: "",
lastName: "",
photo: "",
house: "",
gender: ""
};

// Loading the window
window.addEventListener("DOMContentLoaded", start);

// Start all of the shit
function start() {
console.log("start");
loadJson();
}

// Fetching url
async function loadJson() {
    console.log("load json URL");
    // fetching student information
    const StudentListUrl = "https://petlatkea.dk/2021/hogwarts/students.json";

    // TODO - fetching blood status information 

    const jsonData = await fetch(StudentListUrl);
    studentData = await jsonData.json();
    console.table(studentData);
    prepareObjects();
}

// Clean and push the array. 
function prepareObjects(jsonData) {

    studentData.forEach((element) => {
      // creating the object. 
        const student = Object.create(Student);

        // trimming space away
        let fullname = element.fullname.trim();
        let house = element.house.trim();
        let gender = element.gender.trim();

        // Cleaning firstname  
        if (fullname.includes(" ")) {
            student.firstName = fullname.substring(fullname.indexOf(0), fullname.indexOf(" "));
          } else {
            student.firstName = fullname.substring(fullname.indexOf(0));
          }
          student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();
        
        // Cleaning middlename
        student.middleName = fullname.substring(fullname.indexOf(" "), fullname.lastIndexOf(" ")).trim().substring(0, 1).toUpperCase() +
        fullname.substring(fullname.indexOf(" "), fullname.lastIndexOf(" ")).trim().substring(1).toLowerCase();
        
        // Cleaning nickname
        if (fullname.includes(`"`)) {
            student.nickName = fullname.substring(fullname.indexOf(`"`) + 1, fullname.lastIndexOf(`"`));
            student.middleName = "";
          }

        // Cleaning lastname
        student.lastName = fullname.substring(fullname.lastIndexOf(" ") + 1, fullname.lastIndexOf(" ") + 2).toUpperCase() + fullname.substring(fullname.lastIndexOf(" ") + 2).toLowerCase();

        // ASK FOR HELP 
        // TODO student.photo = 

        // Cleaning house
        student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

        // Cleaning gender
        student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();


      // push the students out
        allStudents.push(student);
    });

    // To see the array in table format in the console. 
    console.table(allStudents);

    displayList(allStudents);
}

// For Filtering overall 
function filterList(studentHouse ) {
  // create a filtered list for houses
 let filteredList = allStudents;

  if (studentHouse === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);

  }else if(studentHouse === "Hufflepuff") {
   filteredList = allStudents.filter(isHufflepuff);

  }  else if(studentHouse === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);

  } else if (studentHouse === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);

  }

  displayList(filteredList);
}

// For filtering the houses. 
function isGryffindor( student ) {
  return student.house === "Gryffindor";
}

function isHufflepuff( student ) {
  return student.house === "Hufflepuff";
}

function isRavenclaw( student ) {
  return student.house === "Ravenclaw";
}

function isSlytherin( student ) {
  return student.house === "Slytherin";
}

// TODO: filtering the bloodstatus

// TODO: filtering the resposibilites


// For displaying the list of students. 
function displayList(students) {
  // clear the list 
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list 
  students.forEach ( displayStudents );
}

// Displaying all of the students
function displayStudents ( student ) {
// create clone 

const clone = document.querySelector("template#student").content.cloneNode(true);

// set clone data 
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );



// NOT WOKRING add eventlistener for popup
// clone.querySelector(".student").addEventListener("click", settingPopup);

}


// function settingPopup(event) {
//   displayStudent(Student);
// }

// // TODO: Popup student view
// function displayStudent(Student) {
//   console.log(Student);

//  popUp.classList.remove("hidden;")

//   // display student in poppity oppity
//   document.querySelector(".firstname").textContent = Student.firstName;
//   document.querySelector(".middlename").textContent = Student.middlename;
//   document.querySelector(".nickname").textContent = Student.nickName;
//   document.querySelector(".lastname").textContent = Student.lastName;


//   // TODO: make these work hehe 
//   // document.querySelector(".bloodstatus").textContent = Student.bloodstatus;
//   // document.querySelector(".studentphoto").textContent = Student.lastName;
//   // document.querySelector(".housephoto").textContent = Student.lastName;

// }