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
// Display first page of events at page load and selector
displayEvents()
displayPageNumber()

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
        let eventDate, eventEnd
        if (event.start.dateTime != undefined) {
            eventDate = new Date(event.start.dateTime)
            eventEnd = new Date(event.end.dateTime)
            event.isFullDay = true
        } else {
            eventDate = new Date(event.start.date)
            eventEnd = new Date(event.end.date)
            event.isFullDay = false
        }

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
        eventTimeNode.innerHTML = `<?xml version="1.0" ?><svg class="timeIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.09814,12.63379,13,11.42285V7a1,1,0,0,0-2,0v5a.99985.99985,0,0,0,.5.86621l2.59814,1.5a1.00016,1.00016,0,1,0,1-1.73242ZM12,2A10,10,0,1,0,22,12,10.01114,10.01114,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20Z" fill="#6563ff"/></svg>`
        if (event.isFullDay) {
            eventTimeNode.innerHTML += ` ${eventDate.toLocaleString('en-US', { timeStyle: 'short', hour12: true})} to ${eventEnd.toLocaleString('en-US', { timeStyle: 'short', hour12: true})}`
        } else {
            eventTimeNode.innerHTML += ` All Day`
        }
        // Append time to event
        eventDetailsNode.appendChild(eventTimeNode)
        
        // Append location to event
        if (event.location != undefined) {
            let eventLocationNode = document.createElement("span")
            eventLocationNode.classList.add("calendarLocation")
            eventLocationNode.innerHTML = `<?xml version="1.0" ?><svg class="locationIcon style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M256,32c-74,0-134.2,58.7-134.2,132.7c0,16.4,3.5,34.3,9.8,50.4l-0.1,0l0.6,1.2c0.5,1.1,1,2.2,1.5,3.3L256,480l121.8-259.1   l0.6-1.2c0.5-1.1,1.1-2.2,1.6-3.4l0.4-1.1c6.5-16.1,9.8-33.1,9.8-50.3C390.2,90.7,330,32,256,32z M256,206.9   c-25.9,0-46.9-21-46.9-46.9c0-25.9,21-46.9,46.9-46.9c25.9,0,46.9,21,46.9,46.9C302.9,185.9,281.9,206.9,256,206.9z"/></g></svg>`
            eventLocationNode.innerHTML += ` ${event.location}`
            eventDetailsNode.appendChild(eventLocationNode)
        }

        // Append link to event
        if (event.link != undefined) { 
            let eventLinkNode = document.createElement("a")
            eventLinkNode.classList.add("calendarLink")
            eventLinkNode.setAttribute("href", event.link)
            eventLinkNode.setAttribute("target", "_blank")
            eventLinkNode.setAttribute("rel", "noopener noreferrer")
            
            let eventButtonNode = document.createElement("button")
            eventButtonNode.innerHTML = "See Event &rarr;"
            eventLinkNode.appendChild(eventButtonNode)
            eventDetailsNode.appendChild(eventLinkNode)
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

    // Display new page number in selector UI
    displayPageNumber()
    // Display new page
    displayEvents()
}

function displayPageNumber() {
    const totalPages = Math.ceil(calendarData.items.length / resultsPerPage)
    
    let navEl = document.querySelector("#cal-nav")
    let leftEl = document.querySelector("#cal-nav-left")
    let rightEl = document.querySelector("#cal-nav-right")

    // Display page number in selector UI
    if (totalPages === 1) {
        // Hide page selector if there is only one page
        navEl.style.display = "none"
    } else {
        navEl.style.display = "flex"
        switch (pageNumber) {
            case 1:
                // Hide previous button if on first page
                leftEl.style.display = "none"
                rightEl.style.display = "block"
                break
            case totalPages:
                // Hide next button if on last page
                leftEl.style.display = "block"
                rightEl.style.display = "none"
                break
            default:
                // Show both buttons if on a page in the middle
                leftEl.style.display = "block"
                rightEl.style.display = "block"
        }
    }
    document.querySelector("#cal-nav-page").innerText = pageNumber
}
