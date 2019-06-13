var app = new Vue({
    el: '#app',
    data: {
        sort: true,
        create: false,
        month: '',
        eventDate: '',
        eventType: '',
        eventName: '',
        description: '',
        displayMess: '',
        password: '',
        events: [], 
        sortedEvents: [],
        EventTypes: ['Marathon','Art Gala','Concert','Festival','Learning', 'Fundraiser','Other'],
        months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    created(){
        this.getEvents();
    },
    watch: {
      create() {
        if(this.create){
          document.getElementById("enterInfo").style.display = "block";
        }
        else {
          document.getElementById("enterInfo").style.display = "none";
        }
      },
      sortedEvents() {
        console.log("the sorted events was changed");
      }
    },
    methods: {
        async addEvent(){
            try {
                let response = await axios.post("/api/events", {
                  Month: this.month,
                  EventDate: this.eventDate,
                  EventName: this.eventName,
                  EventType: this.eventType,
                  EventDescription: this.description,
                  DisplayMessage: this.displayMess,
                  Reservations: 0,
                });
                console.log("ADD EVENT - RESPONSE: ",response);
                this.month = "";
                this.eventDate = "";
                this.eventType = "";
                this.eventName = "",
                this.description = "";
                this.displayMess = "";
                this.getEvents();
                this.create = false;
                return true;
              } catch (error) {
                console.log(error);
              }
        },
        async getEvents(){
            try {
                let response = await axios.get("/api/events");
                console.log("GET EVENT - RESPONSE: ",response);
                this.events = response.data;
                if(this.sort) {
                  this.sortEvents;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async deleteEvent(event) {
          if (confirm("Are you sure you want to delete this event?")) {
            try {
              let response = axios.delete("/api/events/" + event.id);
              console.log("DELETE EVENT - RESPONSE: ",response);
              this.getEvents();
              window.location.reload();
              return true;
            } catch (error) {
              console.log(error);
            }
          }
        },
        async updateEvent(event){
            var r = event.reservations + 1;
            try {
                let response = await axios.put("/api/events/" + event.id, {
                  Month: event.month,
                  EventDate: event.eventDate,
                  EventType: event.eventType,
                  EventName: event.eventName,
                  EventDescription: event.description,
                  DisplayMessage: event.displayMess,
                  Reservations: r,
                });
                console.log("PUT EVENT - RESPONSE: ",response);
                this.getEvents();
                alert(event.displayMess);
                //window.location.reload();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        sortEvents() {
          console.log("the sorted events was changed");
          this.sortedEvents = [];
          for (var i = 0; i < this.events.length; i++) {
            if (this.events[i].eventType === this.eventType) {
              this.sortedEvents.push(this.events[i]);
            }
          }
        }
    }
});