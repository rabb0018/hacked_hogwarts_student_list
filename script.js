"use strict";


// global variables 
let allStudents = []; 

let studentData;
let bloodStatusData;

// TODO : make my freaking popup work man
let popUp = document.querySelector("#studentview");



const Student = {
firstName: "",
middlename: "",
nickName: "",
lastName: "",
photo: "",
house: "",
gender: "",
bloodstatus: ""
};

// Loading the window
window.addEventListener("DOMContentLoaded", start);

// Start all of the shit
function start() {
console.log("start");

selectedbuttons();
loadJson();
}

// Eventlisterners for buttons
function selectedbuttons() {
document.querySelectorAll("[data-action='filter']")
.forEach(button => button.addEventListener("click", selectFilter));


document.querySelectorAll("[data-action='sort']")
.forEach( button => button.addEventListener("click", selectSort));
}

// Fetching url
async function loadJson() {
    console.log("load json URL");
    // fetching student list
    const StudentListUrl = "https://petlatkea.dk/2021/hogwarts/students.json";

    // fetching blood status information 
    const bloodStatusUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

    
    // fetching for student list
    const jsonData = await fetch(StudentListUrl);
    studentData = await jsonData.json();
    console.table(studentData);

    // fetching for blood status
    const jsonFamiliesData = await fetch(bloodStatusUrl);
    bloodStatusData = await jsonFamiliesData.json();
    console.table(bloodStatusData);

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

        // Photo fixed
        student.photo = `./student_profile_pics/${fullname.substring(fullname.lastIndexOf(" ") + 1).toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.jpg`;
 

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

// When user select a filter button 
function selectFilter( event ){
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  // WORKING
  filterList(filter);
}

// For Filtering overall 
function filterList( filterBy ) {
  // create a filtered list for houses
  let filteredList = allStudents;


  if (filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);

  }else if(filterBy === "Hufflepuff") {
   filteredList = allStudents.filter(isHufflepuff);

  }  else if(filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);

  } else if (filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);

  }

  displayList(filteredList);
}

// For filtering the Gryffindor. 
function isGryffindor( student ) {
  return student.house === "Gryffindor";
}

// For filtering the Huffelpuff. 
function isHufflepuff( student ) {
  return student.house === "Hufflepuff";
}

// For filtering the Ravenclaw. 
function isRavenclaw( student ) {
  return student.house === "Ravenclaw";
}

// For filtering the Slytherin. 
function isSlytherin( student ) {
  return student.house === "Slytherin";
}

// TODO: filtering the bloodstatus

// function isPureblood( student ) {
//   return student.bloodstatus === "pure";
// }

// function isHalfblood( student ) {
//   return student.bloodstatus === "half";
// }

// function isMuggle( student ) {
//   return student.bloodstatus === "muggle";
// }


// TODO: filtering the resposibilites


// When user select a sort button
function selectSort( event ){
  const sortBy = event.target.dataset.sort;
  console.log(`User selected ${sortBy}`);

  sortList(sortBy);
}

// For sorting
function sortList(sortBy) {
      let sortedList = allStudents;

      sortedList = sortedList.sort (sortByProperty);
  
    function sortByProperty (studentA, studentB) {
      
      if (studentA[sortBy] < studentB[sortBy]) {
        return -1;
      } else {
        return 1;
      }
    }


  displayList(sortedList);
}

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


    //adding eventlistener for popup
    clone.querySelector("[data-field=firstname]").addEventListener("click", () => displayStudent(Student));
    clone.querySelector("[data-field=lastname]").addEventListener("click", () => displayStudent(Student));


    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );

}

// TODO: Popup student view
function displayStudent(Student) {
  console.log(Student);

  document.querySelector("#studentview").classList.remove("hide");
  document.querySelector("#studentview .closingbutton").addEventListener("click", closePopup);

  function closePopup() {
      document.querySelector("#studentview").classList.add("hide");
  }

  // display student in poppity oppity
  // document.querySelector(".firstname").textContent = Student.firstName;
  // document.querySelector(".middlename").textContent = Student.middlename;
  // document.querySelector(".nickname").textContent = Student.nickName;
  // document.querySelector(".lastname").textContent = Student.lastName;


  // TODO: make these work hehe 
  // document.querySelector(".bloodstatus").textContent = Student.bloodstatus;
  // document.querySelector(".studentphoto").textContent = Student.lastName;
  // document.querySelector(".housephoto").textContent = Student.lastName;

}

