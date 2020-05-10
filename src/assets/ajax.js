import ls from 'local-storage'
// import corona from './corona.json'
const apiHost = 'https://coronavirus-tracker-api.herokuapp.com/v2/';
const host = 'https://api.covid19api.com/';


export function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

export async function fetchOverview() {
    const endpoint = encodeURI(apiHost + "latest");
    try {
        return await fetch(endpoint, {
            method: 'GET'
        }).then((response) => {
            if (response.status !== 200) {
                console.warn("Error fetching latest updates");
            } else {
                return response.json();
            }
        }).then((myJson) => {
            return myJson;
        });

    } catch(error) {
        console.error(error);
    }
}

export async function getAllData() {
    var countries = await getCountries();

    const endpoint = encodeURI(host + "all");
    try {
        return await fetch(endpoint, {
            method: 'GET'
        }).then((response) => {
            if (response.status !== 200) {
                console.warn("Error fetching summary");
            } else {
                return response.json();
            }
        }).then((myJson) => {
            sift(myJson, countries);
        });

    } catch(error) {
        console.error(error);
    }
}


export async function getCountries() {
    const endpoint = encodeURI(host + "countries");
    try {
        return await fetch(endpoint, {
            method: 'GET'
        }).then((response) => {
            if (response.status !== 200) {
                console.warn("Error fetching summary");
            } else {
                return response.json();
            }
        }).then((myJson) => {
            var toStore = JSON.stringify(myJson);
            ls.set('countries', toStore);
            return myJson;
        });

    } catch(error) {
        console.error(error);
    }
}


export async function getSummary() {
    console.log("Getting summary")
    const endpoint = encodeURI(host + "summary");
    try {
        return await fetch(endpoint, {
            method: 'GET'
        }).then((response) => {
            if (response.status !== 200) {
                console.warn("Error fetching summary");
            } else {
                return response.json();
            }
        }).then((myJson) => {
            return myJson;
        });

    } catch(error) {
        console.error(error);
    }
}



export async function updateDataIfNecessary() {
    var unpack = ls.get('all') || "Unfetched";
    if (unpack === "Unfetched") {
        await getAllData();
    } else {
        var data = JSON.parse(unpack);
        var mostRecentDate = new Date(getSortedKeysChron(data.confirmed.World)[0]).getTime();
        var currentDate = Date.now()
        var dateDifference = (currentDate - mostRecentDate)/(24*60*60*1000) // Converted to days, from milliseconds
        if (dateDifference > 2.0) {
            await getAllData();
        }
    }
    return
}


export async function sift(corona, countries) {
    countries.shift();

    var all = {"recovered":{'World':{}},"deaths":{'World':{}},"confirmed":{'World':{}}};

    countries.map((data) => {
        all["recovered"][data.Country] = {};
        all["deaths"][data.Country] = {};
        all["confirmed"][data.Country] = {};
    })
    corona.shift();
    corona.map((data) => {
        const date = data.Date;
        const country = data.Country;
        const province = data.Province;

        ["Confirmed", "Deaths", "Recovered"].forEach(disease_status => {
            let disease_status_lower = disease_status.toLowerCase();
            var cases = data[disease_status];


            if (all[disease_status_lower][country]) {
                if (all[disease_status_lower][country][date]) {
                    all[disease_status_lower][country][date] = cases+all[disease_status_lower][country][date];
                } else {
                    all[disease_status_lower][country][date] = cases;
                }
        
                if (!(country==="US" && province!=="US")) {
                    if (all[disease_status_lower]['World'][date]) {
                        all[disease_status_lower]['World'][date] = cases+all[disease_status_lower]['World'][date];
                    } else {
                        all[disease_status_lower]['World'][date] = cases;
                    }
                }
            }

            
        })

        
    })
    var toStore = JSON.stringify(all)
    ls.set('all', toStore);
    return 
}

export function getSortedKeysChron(arr) {
    return Object.keys(arr).sort((a, b) => new Date(b) - new Date(a))
}
export function percentDifference(a, b) {
    return 100.0*Math.abs(a-b)/((a+b)/2.0)
}
export function percentDifferenceDescription(a, b) {
    return String(Number((percentDifference(a, b)).toFixed(1))) + "%"
}
export function percentDifferenceIncreasing(a, b) {
    return percentDifference(a,b) > 0;
}

export function getLatestEntry(arr) {
    const lastKey = getSortedKeysChron(arr)[0]
    return arr[lastKey]
}

export function getGlobalArr(region) {
    var unpack = ls.get('all') || null
    var data = JSON.parse(unpack)
    var states = [
        {'key':'confirmed','label':'Confirmed Cases',"color":"rgb(253, 218,37)","bgColor":"rgba(253, 218,37,0.2)"},
        {'key':'deaths','label':'Deaths',"color":"rgb(238,56,49)","bgColor":"rgba(238,56,49,0.1)"},
        {'key':'recovered','label':'Recovered',"color":"rgb(121,217,124)","bgColor":"rgba(121,217,124,0.1)"}
    ]
    var toReturn = []

    states.map((state)=>{
        var s = state.key
        var l = state.label
        var a = {"state":s,"label":l,"series":[],"color":state.color,"bgColor":state.bgColor}
        var forState = data[s][region]
        var keys = getSortedKeysChron(forState)
        keys.reverse().map((k)=>{
            a['series'].push(forState[k]);
        });
        var series = a['series']
        a['percentDifference'] = percentDifferenceDescription(series[series.length-1], series[series.length-2])
        a['increasing'] = percentDifferenceIncreasing(series[series.length-1], series[series.length-2])
        a['dates'] = keys
        toReturn.push(a)
    })
    return toReturn
}

export async function getCountriesList() {
    let countries = await getCountries();
    countries.shift()
    var countryList = ['World']
    countries.map((c) => {
        countryList.push(c.Country)
    })
    return countryList;
}

export async function getPie(cutoff) {
    var sum = await getSummary();
    console.log(sum);
    let countries = sum.Countries  
    countries.shift()
    let obj = {}
    let stateTranslator = {'TotalConfirmed': 'Total Confirmed Cases', 'TotalDeaths': 'Total Deaths', 'TotalRecovered': 'Total Recoveries', 'NewConfirmed': 'New Confirmed Cases', 'NewDeaths':'New Deaths', 'NewRecovered':'New Recoveries'}
    Array.from(['TotalConfirmed', 'TotalDeaths', 'TotalRecovered', 'NewConfirmed', 'NewDeaths', 'NewRecovered']).map((state) => {
        let sorted = countries.sort((a, b) => a[state] - b[state]).reverse().map(x => ({'country': x.Country, 'value': x[state]})).filter(function(value, index, arr){ return value.country !== "Iran (Islamic Republic of)";})
        let other = sorted.slice(cutoff).map(x => x.value)
        let otherSum = other.reduce(function(a, b){return a+b})
        var fin = sorted.slice(0,cutoff)
        fin.push({"country":"Other", 'value': otherSum})
        obj[stateTranslator[state]] = fin

    })
    return obj;
}

function csvJSON(csv) {
    console.log(csv)
    const lines = csv.split(',!@#$%^&*')
    const comma_replacement = ',Do not touch this cell. 8274698723,'
    const result = []
    const headers = lines[0].split(comma_replacement)

    for (let i = 1; i < lines.length; i++) {        
        if (!lines[i])
            continue
        const obj = {}
        const currentline = lines[i].split(comma_replacement)

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j]
        }
        result.push(obj)
    }
    return result
}

export async function getEssays() {
    const googleSheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRATpDLZIEihPfIeqAF7PmF90NQtfnNN0J-3FxU4-xPCkCQhj3XkPPRYDAWQDtVeLJdzUbH3SrtNWxQ/pub?output=csv"
    const endpoint = encodeURI(googleSheetUrl);
    try {
        return await fetch(endpoint, {
            method: 'GET'
        }).then((response) => {
            if (response.status !== 200) {
                console.warn("Error fetching google sheet");
            } else {
                return response.text()
            }
        }).then((text) => {
            const csv = csvJSON(text);
            return csv;
        });
    } catch(error) {
        console.error(error);
        return "couldn't do it"
    }
}


export async function downloadResource(urlString) {
    const endpoint = encodeURI(urlString);
    try {
        return await fetch(endpoint, {
            method: 'GET'
        }).then((response) => {
            if (response.status !== 200) {
                console.warn("Error fetching resource");
            } else {
                return response.text()
            }
        }).then((text) => {
            const csv = csvJSON(text);
            return csv;
        });
    } catch(error) {
        console.error(error);
        return "couldn't do it"
    }
}



export function isWebsite(urlString) {
    var pattern = new RegExp(   '^(https?:\\/\\/)?'+ // protocol
                                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
                                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(urlString);
}

export function isGoogleID(str) {
    var pattern = new RegExp("[a-zA-Z0-9-_]+")
    return pattern.test(str)
}