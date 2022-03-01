"use strict";


// global variables 
let allStudents = []; 

let studentData;
let bloodStatusData;

//let popUp = document.querySelector("#studentview");



const Student = {
firstName: "",
middlename: "",
nickName: "",
lastName: "",
photo: "",
house: "",
gender: "",
bloodstatus: "",
squadProperty: false,
prefectProperty: false,
expelProperty: false
};


const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc"

}

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

    // fixed so we filter and sort on the first load
    buildList();
}

// When user select a filter button 
function selectFilter( event ){
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  // WORKING
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
buildList();
}

// For Filtering overall 
function filterList( filteredList ) {
  
  // let filteredList = allStudents;


  // create a filtered list for houses
  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);

  }else if(settings.filterBy === "Hufflepuff") {
   filteredList = allStudents.filter(isHufflepuff);

  }  else if(settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);

  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);

  }

  return filteredList;
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
  const sortDir = event.target.dataset.sortDirection;
 
// find old sortBy element and remove sortby
const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
oldElement.classList.remove("sortby");

  // indicate active sort
  event.target.classList.add("sortby");

  // toggle the direction 
  if ( sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
settings.sortBy = sortBy;
settings.sortDir = sortDir;
buildList();
}

// For sorting
function sortList(sortedList) {
      // let sortedList = allStudents;
      // let direction = 1;

      if (settings.sortDir === "desc") {
        settings.direction = -1;
      } else {
        settings.direction = 1;
      }

      sortedList = sortedList.sort (sortByProperty);

      
  
    function sortByProperty (studentA, studentB) {
      
      if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
        return -1 * settings.direction;
      } else {
        return 1 * settings.direction;
      }
    }


  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList( currentList);

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



    if ( student.squadProperty === true) {
      clone.querySelector("[data-field=squad]").textContent = "Ⓘ";
    } else {
      clone.querySelector("[data-field=squad]").textContent = "Ⓘwhite";

    }
    clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);

    function clickSquad() {
      if (student.squadProperty === true) {
        student.squadProperty = false;
      } else {
        student.squadProperty = true;
      }

      buildList();
    }


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

