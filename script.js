"use strict";

// global variables 
let allStudents = []; 
let expelledStudents = [];

let studentData;
let bloodStatusData;

const Student = {
firstName: "",
middlename: "",
nickName: "",
lastName: "",
photo: "",
house: "",
gender: "",
bloodStatus: "",
squad: false,
prefect: false,
expel: false
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",

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

  // eventlistener for filter
document.querySelectorAll("[data-action='filter']")
.forEach(button => button.addEventListener("click", selectFilter));

// eventlistener for sort
document.querySelectorAll("[data-action='sort']")
.forEach( button => button.addEventListener("click", selectSort));

// eventlisterne for search input
document.querySelector("#search").addEventListener("input", searchFieldInput);
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
    // console.table(studentData);

    // fetching for blood status
    const jsonFamiliesData = await fetch(bloodStatusUrl);
    bloodStatusData = await jsonFamiliesData.json();
    // console.table(bloodStatusData);

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


        // Getting the blood status
        student.bloodStatus = getBloodType(student.lastName);

      // push the students out
        allStudents.push(student);
    });

    // To see the array in table format in the console. 
    console.table(allStudents);

    // fixed so we filter and sort on the first load
    buildList();
}

// Search field fucntion so the user can search on a students firstname og lastname
function searchFieldInput(event) {
  // write to the list with only those elements in the allStudents array that has properties containing the search frase
  displayList(
    allStudents.filter((elm) => {
      // comparing in uppercase so that m is the same as M
      return elm.firstName.toUpperCase().includes(event.target.value.toUpperCase()) || elm.lastName.toUpperCase()
      .includes(event.target.value.toUpperCase());
    })
  );
}

// Getting the blood type
function getBloodType(lastName) {
    let blood;
  
    if (lastName) {
      blood = "muggleborns";
  
      if (bloodStatusData.pure.includes(lastName)) {
        blood = "purebloods";
      }
  
      if (bloodStatusData.half.includes(lastName)) {
        blood = "halfbloods";
      }
    } else {
      blood = undefined;
    }
  
    return blood;
  
}

// When user select a filter button 
function selectFilter( event ){
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  // WORKING
  setFilter(filter);
}

// setting the filter
function setFilter(filter) {
  settings.filterBy = filter;
buildList();
}

// For Filtering overall 
function filterList( filteredList ) {
  
  // let filteredList = allStudents;

  // create a filtered list for all of the buttons you wanna filter.
  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);

  }else if(settings.filterBy === "Hufflepuff") {
   filteredList = allStudents.filter(isHufflepuff);

  }  else if(settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);

  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);

  } else if (settings.filterBy === "purebloods") {
    filteredList = allStudents.filter(isPureblood);

  } else if (settings.filterBy === "halfbloods") {
    filteredList = allStudents.filter(isHalfblood);

  } else if (settings.filterBy === "muggleborns") {
    filteredList = allStudents.filter(isMuggle);

  } else if (settings.filterBy === "prefects") {
      filteredList = allStudents.filter(isPrefect);

  } else if (settings.filterBy === "inquisitorialsquad") {
      filteredList = allStudents.filter(isSquad);

  } 
  // else if (settings.filterBy === "expelledstudents") {
  //   filteredList = allStudents.filter(isExpelled);
  // }

  // TODO:  filter for  expelled og active students as well---- not working look at it again 
  
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

// For filtering the purebloods
function isPureblood( student ) {
  return student.bloodStatus === "purebloods";
}

// For filtering the halfbloods
function isHalfblood( student ) {
  return student.bloodStatus === "halfbloods";
}

// For filtering the muggleborns
function isMuggle( student ) {
  return student.bloodStatus === "muggleborns";
}

// for filtering the prefects
// comment to myself. No need to make the === beacuse it is a true / false statement, can be without it aswell
function isPrefect( student ) {
  return student.prefect === true;
}

// for filtering the squad
function isSquad( student ) {
  return student.squad === true;
}

// TODO: filtering the exeplled and acive students. 
function isExpelled( student ) {
  return student.expel === true;
}


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

// setting the sort function
function setSort(sortBy, sortDir) {
settings.sortBy = sortBy;
settings.sortDir = sortDir;
buildList();
}

// For sorting the list
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

// TODO: for making the list show?? Watch peter videos again to be sure what this function does
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList( currentList);

  displayList(sortedList);
}

// For displaying the list of students. 
function displayList(students) {
  // clear the list 
  document.querySelector("#list tbody").innerHTML = "";
  //console.table(allStudents);
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
    clone.querySelector("[data-field=squad]").dataset.squad = student.squad;
    clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);


    // For when clicking on squad ( gives condition that if the student is pureblood OR slytherin they can be squad otherwise not)
    function clickSquad() {
      if (student.bloodStatus === "purebloods" || student.house === "Slytherin") {
        student.squad = true;
      } else {

        student.squad = false;
        document.querySelector("#notqualified").classList.remove("hide");
        document.querySelector("#notqualified .closebutton").addEventListener("click", closeDialog);
      }

      buildList();
      
      // To close the modal
      function closeDialog() {
        document.querySelector("#notqualified").classList.add("hide");
      document.querySelector("#notqualified .closebutton").removeEventListener("click", closeDialog);
        }
    }

    // PREFECT
      clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
      clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);


      function clickPrefect() {
        if ( student.prefect === true) {
          student.prefect = false;
        } else{
          tryToMakeAPrefect(student);

        }

        buildList();
      } 


    // EXPEL
    clone.querySelector("[data-field=expel]").dataset.expel = student.expel;
    clone.querySelector("[data-field=expel]").addEventListener("click", clickExpel);


      function clickExpel() {

        // closure method I used before, that I dont need, beause i dont need an if sentence,
        //  fordi den allerede er defineret når det er skrevet sådan ud.
        // if ( student.expel === true) {
        //   student.expel = false;
        // } else{
        //   // student.expel = true;
        // }

        const indexOfStudent = allStudents.indexOf(student);
        console.log(indexOfStudent);

        expelledStudents.push(allStudents.splice(indexOfStudent, 1));

        //  showing the expelled student array
        console.table(expelledStudents);

        buildList();
        
    } 


    //adding eventlistener for popup
    clone.querySelector("[data-field=firstname]").addEventListener("click", () => displayStudent(student));
    clone.querySelector("[data-field=lastname]").addEventListener("click", () => displayStudent(student));


    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );

}

// TODO: Popup student view
function displayStudent( student) {
  console.log("student",student);

  const popUp = document.querySelector("#studentview");

  document.querySelector("#studentview").classList.remove("hide");
  document.querySelector("#studentview .closingbutton").addEventListener("click", closePopup);

  function closePopup() {
      document.querySelector("#studentview").classList.add("hide");
  }

  // display student in poppity oppity
  popUp.querySelector(".firstname").textContent = `${student.firstName}`;
  popUp.querySelector(".middlename").textContent = `${student.middleName}`;
  popUp.querySelector(".nickname").textContent = `${student.nickName}`;
  popUp.querySelector(".lastname").textContent = `${student.lastName}`;
  popUp.querySelector(".bloodstatus").textContent = `${student.bloodStatus}`;
  popUp.querySelector(".house").textContent = `${student.house}`;


  // TODO: make these work hehe 
  popUp.querySelector(".studentphoto").src = student.photo;

//  TODO: house crest and color
  // document.querySelector(".housephoto").textContent = Student.lastName;

}

// PREFECTS 
function tryToMakeAPrefect(selectedStudent) {
const studentsPerHouse = allStudents.filter((student) => student.house === selectedStudent.house);
const prefectsPerHouse = studentsPerHouse.filter((student) => student.prefect);
const numberOfPrefects = prefectsPerHouse.length;

// if sentence for the prefects, that if there are more than 2 prefect per house, the user need to choose remove a or b or try to choose a new one.
if ( numberOfPrefects >= 2) {
  removePrefectAOrB(prefectsPerHouse[0], prefectsPerHouse[1]);
} else {
  makePrefect(selectedStudent);
}

  function removePrefectAOrB(prefectA, prefectB){

// ask the user to ignore og remove a or b
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb  #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb  #removeb").addEventListener("click", clickRemoveB);

    // Show name on buttons 
    document.querySelector("#remove_aorb [data-field=prefectA").textContent = `${prefectA.firstName} ${prefectA.lastName}`;
    document.querySelector("#remove_aorb [data-field=prefectB").textContent = `${prefectB.firstName} ${prefectB.lastName}`;

// if ignore do nothing - Closing the modal
function closeDialog () {
    document.querySelector("#remove_aorb").classList.add("hide");
    document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
    document.querySelector("#remove_aorb  #removea").removeEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb  #removeb").removeEventListener("click", clickRemoveB);
}

  function clickRemoveA() {
  //  if remove A:
  removePrefect(prefectA);
  makePrefect(selectedStudent);
  buildList();
  closeDialog();

}
  function clickRemoveB() {
  // else - if remove b: 
  removePrefect(prefectB);
  makePrefect(selectedStudent);
  buildList();
  closeDialog();
  }

}

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}
