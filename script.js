let mapCoords
let map
let group = L.layerGroup()
class Map {
    constructor(name) {
        this.coords = []
        this.name = name
    }
    
    async getCoords() {
        let pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        this.coords = [pos.coords.latitude, pos.coords.longitude]
        mapCoords = this.coords
    }
    
    buildMap() {
        this.name = L.map('map', {
            center: this.coords,
            zoom: 13
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.name)
    }
    
    markSearch(businessData) {
        // if(group !== undefined) {
            group.clearLayers()
            // markers.removeLayer()
            businessData.forEach(business => {
                let lat = business.geocodes.main.latitude
                let lon = business.geocodes.main.longitude
                let businessName = business.name
                business.name = L.marker([lat, lon]).addTo(group)
                .bindPopup(`${businessName}`)
                .openPopup();
                
                // markers.push(business.name)
            });
            group.addTo(this.name)
            console.log(group)
        }
    }
    
    window.onload = async  () => {
    map = new Map("myMap")
    await map.getCoords()
    await map.buildMap()
    // console.log(map)
    console.log(await getBusinessData())
}


let businessType = document.getElementById("business-Type")
businessType.addEventListener("submit", async (e) => {
    e.preventDefault()
    // console.log(business)
    
    let businessData = await getBusinessData()
    map.markSearch(businessData)
})

async function getBusinessData() {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3lRxy/ESIhkzljQl7p6MfQX2NfpCr2LcMF+ik1kFEO2c='
        }
    }
    let business = document.getElementById("business-Select").value
    let limit = 10
    let lat = mapCoords[0]
    let lon = mapCoords[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&fields=name,geocodes&ll=${lat}%2C${lon}&radius=10000`, options)
    let data = await response.json()
    // console.log(data.results)
    return data.results
}