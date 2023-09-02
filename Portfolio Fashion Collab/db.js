db.collection('events').onSnapshot(snapshot =>{
    //This Handles the latest added Event
    const newestEvent = snapshot.docChanges()[0].doc.data()
    const id = snapshot.docChanges()[0].doc.id
    showLatestEvent(newestEvent, id);


    //delete the lastest event element
    snapshot.docChanges().shift()

    snapshot.docChanges().forEach(event =>{
        showEvents(event.doc.data(), event.doc.id)
    });
})

const addNewEvent = () =>{
    const event ={
        name: form.name.value,
        attendee: form.attendee.value,
        booked: 0,
        description: form.description.value,
        status: parseInt(form.status.value, 10)
    }

    db.collection('events').add(event)
    .then(() =>{
        //Resets the form values

        form.name.value = "",
        form.attendee.value = "",
        form.description.value = "",
        form.status.value = ""

        alert('Your event has been saved sucessfully')
    })
    .catch(err => console.log(err))
}

let bookedEvents =[];

const bookEvent = (booked, id) =>{
    const getBookedEvents = localStorage.getItem('booked-events');

    if(getBookedEvents){
        bookedEvents = JSON.parse(localStorage.getItem('booked-events'));
        if(bookedEvents.includes(id)){
            alert("You already have the event booked")
        }
        else{
            saveBooking(booked, id)
        }
    }

    else{
        saveBooking(booked, id)
    }
};

const saveBooking = (booked, id) =>{
    bookedEvents.push(id);
    localStorage.setItem('booked-events', JSON.stringfly(bookedEvents));

    const data = {booked: booked +1 }
    db.collection('events').doc(id).update(data)
    .then(()=> alert('Events sucessfully booked'))
    .catch(err => console.log(err))
}

