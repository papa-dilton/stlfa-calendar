// Get Google Calendar data
var calendarRequest = await fetch(`https://www.googleapis.com/calendar/v3/calendars/stlfashionalliance.org_95en9inu13fgfg7l9ang95teek@group.calendar.google.com/events?orderBy=startTime&showDeleted=false&singleEvents=true&key=AIzaSyBrWKPmp_Kyd_j-X4JY7KZOAJU6SYpeA9M&timeMin=${(new Date()).toISOString()}`)
var calendarData = await calendarRequest.json()

// Constant for number of results per page
const resultsPerPage = 30
// Get .calendar div to place events in
const rootDiv = document.querySelector(".calendar")


document.querySelector("#cal-nav-left").addEventListener("click", () => {changePage(-1)})
document.querySelector("#cal-nav-right").addEventListener("click", () => {changePage(1)})

var pageNumber = 1;

// Display first page of events at page load
displayEvents()


function displayEvents() {
    const startItem = (pageNumber - 1) * resultsPerPage
    const endItem = pageNumber * resultsPerPage
    calendarData.items.slice(startItem, endItem).forEach(event => {
        const urlRegexp = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        let urlMatches = event.description == undefined ? undefined : event.description.match(urlRegexp)
        if (urlMatches != null) event.link = urlMatches[0]
        if (event.description != undefined) {
            event.description = event.description.replace(event.link, "")
        } else {
            event.description = "No description Provided"
        }
        let eventDate = new Date(event.start.dateTime)
        let eventEnd = new Date(event.end.dateTime)
        let node = document.createElement("div")
        node.classList.add("calendarEvent")
        node.innerHTML = `<div class="calendarDate"><span class="calendarMonth">${eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}</span><span class="calendarDay">${eventDate.getDate()}</span></div><h1 class="calendarTitle">${event.summary}</h1><span class="calendarDetails">${eventDate.toLocaleString('en-US', { timeStyle: 'short', hour12: true})} to ${eventEnd.toLocaleString('en-US', { timeStyle: 'short', hour12: true})}`
        if (event.link != undefined) node.innerHTML += `<a href=${event.link} target="_blank" rel="noreferer noopener"><button>See Event &rarr;</button></a>`
        rootDiv.appendChild(node)
    });
}

function changePage(dir) {
    rootDiv.innerHTML = ''
    const totalPages = Math.ceil(calendarData.items.length / resultsPerPage)
    switch (dir) {
        case -1:
            pageNumber--
            break
        case 1:
            pageNumber++
            break
        default:
            throw new Error("Cannot changePage by non 1 or -1 number")
    }
    if (pageNumber < 1) {
        pageNumber = 1
    } else if (pageNumber > totalPages) {
        pageNumber = totalPages
    }
    displayEvents()
}