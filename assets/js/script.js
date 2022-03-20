//global vars
var currentDayEl = $("#currentDay");
var containerEl = $(".container");
var tasksArray;

// function is triggered at midnight each night and each time site is visited
// loads empty time slots onto the screen and color codes based on current time
var newDay = function() {
    currentDayEl.text(moment().format('MMMM Do YYYY'));
    
    var i = 8;
    var AMPM = "AM";
    do {

        i++;
        if (i === 12) {
            AMPM = "PM";
        }
        if (i === 13) {
            i = 1;
        }

        var currRow = $("<div>");
        currRow.addClass("row")
        var timeCol = $("<div>");
        timeCol.addClass("col-1 hour text-center")
        var timeContainer = $("<div>");
        timeContainer.addClass("my-4")
        var textCol = $("<div>");
        textCol.addClass("col-10 pl-0")
        var textArea = $("<textarea>");
        var saveCol = $("<div>");
        saveCol.addClass("col-1 saveBtn")
        var saveIconContainer = $("<div>")
        saveIconContainer.addClass("my-4")
        var saveIcon = $("<i>");
        saveIcon.addClass("fa fa-save");

        timeContainer.text(i + AMPM);
        timeCol.append(timeContainer);

        textCol.append(textArea);

        saveIconContainer.append(saveIcon);
        saveCol.append(saveIconContainer);

        currRow.append(timeCol, textCol, saveCol);
        containerEl.append(currRow);


    } while (i !== 5);
    
    shadeTimeSlots();
}

// function is called if user leaves and returns to site or refreshes the page
// loads saved content into empty timeslots
var reloadDay = function() {
    currentDayEl.text(localStorage.getItem("currentDay"));
    tasksArray = JSON.parse(localStorage.getItem("tasks"));
}

//shades the timeslots based on current time
var shadeTimeSlots = function() {
    var currentTime = moment().format("hA");
    currentTime = moment(currentTime, "hA")
    
    containerEl.children('.row').each(function () {
        var textColEl = $(this).find(":nth-child(2)")
        var thisTime = moment($(this).find(":first").text(), "hA")

        if (thisTime.isBefore(currentTime)) {
            textColEl.addClass("past");
        }
        else if (thisTime.isSame(currentTime)) {
            textColEl.addClass("present");
        }
        else {
            textColEl.addClass("future");
        }
    });
}

//function is called to save items to local storage
var localSave = function() {
    localStorage.setItem("currentDay", currentDayEl.text());
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}




// run these if statements every visit
// if this is first time visiting website
if (localStorage.getItem("currentDay") === null) {
    console.log("first visit. welcome!");
    newDay();
    localSave();
}
// if we are revisiting website on the same day
else if (localStorage.getItem("currentDay") === moment().format('MMMM Do YYYY')) {
    console.log("welcome back!");
    newDay();
    reloadDay();
}
// if we are revisiting website on a new day
else {
    console.log("welcome back! it is a new day!");
    newDay();
    localSave();
}