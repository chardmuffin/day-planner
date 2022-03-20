// global vars
var currentDayEl = $("#currentDay");
var containerEl = $(".container");
var tasksArray = Array(9).fill("");

// function is triggered at midnight if tab is left open, or each time site is visited
// loads empty time slots onto the screen and color codes based on current time
var newDay = function() {

    //empty task list in case user passes midnight
    containerEl.empty();
    tasksArray = Array(9).fill("");

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
        textCol.addClass("col-10 pl-0 pr-0")
        var textArea = $("<textarea>");
        var saveCol = $("<div>");
        saveCol.addClass("col-1 saveBtn text-center")
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
// loads saved tasks into empty timeslots
var reloadDay = function() {
    currentDayEl.text(localStorage.getItem("currentDay"));
    tasksArray = JSON.parse(localStorage.getItem("tasks"));

    var i = 0;
    containerEl.children('.row').each(function () {
        $(this).find("textarea").val(tasksArray[i]);
        i++;
    });
}

//shades the timeslots based on current time
var shadeTimeSlots = function() {
    var currentTime = moment().format("hA");
    currentTime = moment(currentTime, "hA");
    
    containerEl.children('.row').each(function () {
        var textColEl = $(this).find(":nth-child(2)");
        var thisTime = moment($(this).find(":first").text(), "hA");

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

var checkDate = function() {
    if (localStorage.getItem("currentDay") !== moment().format('MMMM Do YYYY')) {
        newDay();
        localSave();
    }
}

//init blank tasks
newDay();

// if we are revisiting website (a save exists) ...
if (localStorage.getItem("currentDay") !== null) {
    // ... on the same day, then reload today's tasks
    if (localStorage.getItem("currentDay") === moment().format('MMMM Do YYYY')) {
        reloadDay();
    }
}

// if save is not from the same day, or if first time visiting site, create a save with blank tasks
localSave();

// shade timeslots and check the date every minute
setInterval(function() {
    shadeTimeSlots();
    checkDate();
}, 60 * 1000);

//save text when respective save button is clicked
containerEl.on("click", "i", function() {
    var row = $(this).closest(".row");
    var rowIndex = row.index();
    tasksArray[rowIndex] = row.find("textarea").val();
    localSave();
});