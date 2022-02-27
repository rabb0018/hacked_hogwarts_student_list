"use strict";



const allStudents = []; 

// Dette skal være en variabel, så den ikke giver fejl med use strict. (skal være defineret)
let studentData;

const Student = {
firstName: "",
middlename: "",
nickName: "",
lastName: "",
photo: "",
house: "",
gender: ""
};

window.addEventListener("DOMContentLoaded", start);


function start() {
console.log("start");
loadJson();
}

async function loadJson() {
    console.log("load json URL");
    const StudentListUrl = "https://petlatkea.dk/2021/hogwarts/students.json";

    const jsonData = await fetch(StudentListUrl);
    studentData = await jsonData.json();
    console.table(studentData);
    prepareObjects();
}




function prepareObjects(jsonData) {

    studentData.forEach((element) => {
        const student = Object.create(Student);
        let fullname = element.fullname.trim();
        let house = element.house.trim();
        let gender = element.gender.trim();

        

        // firstname 
        if (fullname.includes(" ")) {
            student.firstName = fullname.substring(fullname.indexOf(0), fullname.indexOf(" "));
          } else {
            student.firstName = fullname.substring(fullname.indexOf(0));
          }
          student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();
        
        // middlename
        student.middleName = fullname.substring(fullname.indexOf(" "), fullname.lastIndexOf(" ")).trim().substring(0, 1).toUpperCase() +
        fullname.substring(fullname.indexOf(" "), fullname.lastIndexOf(" ")).trim().substring(1).toLowerCase();
        
        // nickname
        if (fullname.includes(`"`)) {
            student.nickName = fullname.substring(fullname.indexOf(`"`) + 1, fullname.lastIndexOf(`"`));
            student.middleName = "";
          }

        // lastname
        student.lastName = fullname.substring(fullname.lastIndexOf(" ") + 1, fullname.lastIndexOf(" ") + 2).toUpperCase() + fullname.substring(fullname.lastIndexOf(" ") + 2).toLowerCase();


        // student.photo = 


        // house and gender
        student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

        student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

        

        allStudents.push(student);
    });

    console.table(allStudents);

    displayList(allStudents);
}



function displayList(students) {
  // clear the list 
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list 
  students.forEach ( displayStudents );
}



function displayStudents ( student ) {
// create clone 

const clone = document.querySelector("template#student").content.cloneNode(true);

// set clone data 
clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );


}