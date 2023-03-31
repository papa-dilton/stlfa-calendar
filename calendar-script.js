// Get Google Calendar data
var calendarRequest = await fetch(`https://www.googleapis.com/calendar/v3/calendars/stlfashionalliance.org_95en9inu13fgfg7l9ang95teek@group.calendar.google.com/events?orderBy=startTime&showDeleted=false&singleEvents=true&key=AIzaSyBrWKPmp_Kyd_j-X4JY7KZOAJU6SYpeA9M&timeMin=${(new Date()).toISOString()}`)
var calendarData = await calendarRequest.json()

// Constant for number of results per page
const resultsPerPage = 30
// Get .calendar div to place events in
const rootDiv = document.querySelector(".calendar")

// Make arrows to navigate pages
document.querySelector("#cal-nav-left").addEventListener("click", () => {changePage(-1)})
document.querySelector("#cal-nav-right").addEventListener("click", () => {changePage(1)})

// Set current page to 1 on page load
var pageNumber = 1;
// Display first page of events at page load
displayEvents()

// Display current page of events using pageNumber
function displayEvents() {
    // Calculate start and end items for current page
    const startItem = (pageNumber - 1) * resultsPerPage
    const endItem = pageNumber * resultsPerPage

    // Loop through events and display them
    calendarData.items.slice(startItem, endItem).forEach(event => {
        // Regex to find URL in description
        const urlRegexp = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        // Check if any URLs are in the description
        let urlMatches = event.description == undefined ? undefined : event.description.match(urlRegexp)
        
        // Remove description URL and write "No description" if no description
        if (urlMatches != null) event.link = urlMatches[0]
        if (event.description != undefined) {
            event.description = event.description.replace(event.link, "")
        } else {
            event.description = "No description Provided"
        }

        // Create JS Date objects for start and end times
        let eventDate = new Date(event.start.dateTime)
        let eventEnd = new Date(event.end.dateTime)

        // Create div for event
        let eventNode = document.createElement("div")
        eventNode.classList.add("calendarEvent")

        // Create div for event date
        let eventDateNode = document.createElement("div")
        eventDateNode.classList.add("calendarDate")

        // Create span for event month
        let eventMonthNode = document.createElement("span")
        eventMonthNode.classList.add("calendarMonth")
        eventMonthNode.innerText = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()

        // Create span for event day
        let eventDayNode = document.createElement("span")
        eventDayNode.classList.add("calendarDay")
        eventDayNode.innerText = eventDate.getDate()

        // Append date to event
        eventDateNode.appendChild(eventMonthNode)
        eventDateNode.appendChild(eventDayNode)
        eventNode.appendChild(eventDateNode)



        // Create div for event body
        let eventBodyNode = document.createElement("div")
        eventBodyNode.classList.add("calendarBody")

        // Create h1 for event title
        let eventTitleNode = document.createElement("h1")
        eventTitleNode.classList.add("calendarTitle")
        eventTitleNode.innerText = event.summary

        // Create div for event details
        let eventDetailsNode = document.createElement("div")
        eventDetailsNode.classList.add("calendarDetails")

        // Create span for event time
        let eventTimeNode = document.createElement("span")
        eventTimeNode.classList.add("calendarTime")
        eventTimeNode.innerText = `${eventDate.toLocaleString('en-US', { timeStyle: 'short', hour12: true})} to ${eventEnd.toLocaleString('en-US', { timeStyle: 'short', hour12: true})}`

        // Append time to event
        eventDetailsNode.appendChild(eventTimeNode)
        
        // Append location to event
        if (event.location != undefined) {
            let eventLocationNode = document.createElement("span")
            eventLocationNode.classList.add("calendarLocation")
            eventLocationNode.innerText = event.location
            eventDetailsNode.appendChild(eventLocationNode)
        }

        // Append link to event
        if (event.link != undefined) { 
            let eventLinkNode = document.createElement("a")
            eventLinkNode.classList.add("calendarLink")
            eventButtonNode = document.createElement("button")
            eventButtonNode.innerText = "See Event &rarr;"
            eventLinkNode.appendChild(eventButtonNode)
            eventNode.appendChild(eventLinkNode)
        }

        // Append body to event
        eventBodyNode.appendChild(eventTitleNode)
        eventBodyNode.appendChild(eventDetailsNode)
        eventNode.appendChild(eventBodyNode)




        // Append event to root div
        rootDiv.appendChild(eventNode)
    });
}

function changePage(dir) {
    // Clear current page
    rootDiv.innerHTML = ''

    // Calculate total number of available pages
    const totalPages = Math.ceil(calendarData.items.length / resultsPerPage)
    
    // Change page number based on direction
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

    // Make sure page number is within range
    if (pageNumber < 1) {
        pageNumber = 1
    } else if (pageNumber > totalPages) {
        pageNumber = totalPages
    }

    // Display new page
    displayEvents()
}