const url = "data/rapport_prod1.csv";
const idLocalStorage='data'
const dataLength=localStorage.getItem('dataLength')
getCsvData(url,idLocalStorage)
//les bouttons de haut
//role :  - récupération des données spécifiques
//        - Générer la charts
import ganttConfigSession from './Models/ganttSessionOptionsV2.js'
import ganttConfig from './Models/ganttSessionOptionsV2.js'
import ganttConfigStamb from './Models/ganttStambiaOptions.js'
// import ganttConfigHierar from './Models/ganttOptionsHierar.js'
// import ganttConfigGrpdStambia from './Models/ganttOptionsStambiaGrpd.js' 

//**********mettre valeur date aujourd'hui************************//
document.getElementById("datePickerJ").value = getTodayTime();

//************Bouton de Comp session***********************//

let SessionCompBtn = document.getElementById('sessionCompBtn')
SessionCompBtn.onclick = async () => {
    chartdestroy()
    let dateJ = document.getElementById("datePickerJ").value
    let dateJ_1 = document.getElementById("datePickerJ_1").value
    //TODO SEND DATES TO SQL SERVER AND TRANDFORM IT TO ID FILE IN THE BACK END
    let inputDateJ = ''
    // document.getElementById('inputDateJ').value
    let inputDateJ_1 = ''
    // document.getElementById('inputDateJ_1').value
        if(inputDateJ=='' || inputDateJ_1==''){
            inputDateJ =   202203010901
            inputDateJ_1 =   202202280901
        }
    const data = await fetch(`/api/chart/sessionComp?ID_fichierJ=${inputDateJ}&ID_fichierJ_1=${inputDateJ_1} `)
    const json = await data.json()
    var sizeY=12
    const options = ganttConfigSession(json.data.labels,
        json.data.tempsDebutFin,
        json.data.tempsDebutFinJ_1,
        json.data.progress,
        json.data.progressJ_1,
        sizeY
        )
    chartRender(options)
}

let stmbBtn = document.getElementById('stmbBtn')
stmbBtn.onclick = async () => {
    chartdestroy()
    let inputDateJ = ''
    // document.getElementById('inputDateJ').value
    let inputDateJ_1 = ''
    // document.getElementById('inputDateJ_1').value
        if(inputDateJ=='' || inputDateJ_1==''){
            inputDateJ =   202203010901
            inputDateJ_1 =    202202280901
        }
    const data = await fetch(`/api/chart/fluxStambia?ID_fichierJ=${inputDateJ}&ID_fichierJ_1=${inputDateJ_1}`)
    const json = await data.json()
    var sizeY=12
    const options = ganttConfigStamb(json.data.labels,
        json.data.tempsDebutFin,
        json.data.tempsDebutFinJ_1,
        json.data.progress,
        json.data.progressJ_1,
        sizeY
        )
    chartRender(options)
}

let birtBtn = document.getElementById('birtBtn')
birtBtn.onclick = async () => {
    chartdestroy()
    let inputDateJ = ''
    // document.getElementById('inputDateJ').value
    let inputDateJ_1 = ''
    // document.getElementById('inputDateJ_1').value
        if(inputDateJ=='' || inputDateJ_1==''){
            inputDateJ =   202203010901
            inputDateJ_1 =    202202280901
        }
    const data = await fetch(`/api/chart/birt?ID_fichierJ=${inputDateJ}&ID_fichierJ_1=${inputDateJ_1}`)
    const json = await data.json()
    console.log(json);
    // var sizeY=12
    // const options = ganttConfigStamb(json.data.labels,
    //     json.data.tempsDebutFin,
    //     json.data.tempsDebutFinJ_1,
    //     json.data.progress,
    //     json.data.progressJ_1,
    //     sizeY
    //     )
    // chartRender(options)
}







let RefreshBtn = document.getElementById('refreshBtn')
RefreshBtn.onclick = () => {
    resetZoom()
}

// affichage par défaut ouverture de session

let ctx = document.getElementById('myChart');
let myChart = new Chart(ctx, ganttConfig(getSessionData(idLocalStorage).labels,
                     getSessionData(idLocalStorage).tempsDebutFin,
                     getSessionData(idLocalStorage).tempsDebutFin,
                     getSessionData(idLocalStorage).progress,
                     10)
                     )

//************Fonction destroy pour détruire chart js par défaut ***********************//
function chartdestroy() {
    myChart.destroy()
}
//************Fonction render pour dessiner une nouvelle charts js avec nouveau data set********//

function chartRender(options) {
    ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, options)
}
//*******************************reset zoom actuel*****************************************//
function resetZoom(){
    myChart.resetZoom()
}

// optimisation de la fonction getData()
// declaration fonction getCsvData()
// roles : - recupérer les données à partir de csv
//         - Stockage des données en local dans le navigateur
async function getCsvData(url, idLocalStorage){
    try {
        const response = await fetch(url);
        const tableData = await response.text();
        const table = tableData.split('\n');
        localStorage.setItem('dataLength',table.length-1)
        // store data in local storage 
        let i=0
        table.forEach(element => {
                const column = element.split(',');
                // condition if sur l'element 248 
                if(i<table.length-1){
                    localStorage.setItem(idLocalStorage+i,column)
                }
                i++
            }
        );
      } catch (error) {
        console.error(
            "c'est une erreur, pas de stockage local, Vérifier dans Application de ton serveur"
            );
      }
}

// creation des fonctions de filtrage des données
// fonction pour la donnée session

function getSessionData(idLocalStorage){
    let labels=[]
    let tempsDebutFin=[]
    let progress=[]
    for (let i = 1; i < dataLength; i++) {
        let lines=(localStorage.getItem(idLocalStorage+i)).split(',');
        let tempsDebutFin_temp=[]
        // console.log(lines[8]);
        if (dataFilter(lines[8]) == 'D' || dataFilter(lines[8]) == 'UD') {
            tempsDebutFin_temp.push(ExcelDateToJSDate(parseFloat(lines[11])));
            tempsDebutFin_temp.push(ExcelDateToJSDate(parseFloat(lines[12])));
            // remplissage donnée session
            labels.push(lines[6])
            progress.push({tempsReel: lines[13],tempsEstime:lines[14],status: lines[9]})
            tempsDebutFin.push(tempsDebutFin_temp)
        }
    }
    return {labels,tempsDebutFin,progress}
}
 
function dataFilter(a) {
    if (a != undefined) {
        if (a.slice(0, 11) == 'Uproc debut') {
            return 'UD'
        }
        if (a.slice(0, 5) == 'Debut') {
            return 'D'
        }
        if (a.slice(0, 9) == 'Uproc fin') {
            return 'UF'
        }
        if (a.slice(0, 3) == 'Fin') {
            return 'F'
        }
      // filtre supplimentaire pour les traitement Stambia
        for (let i = 0; i < a.length; i++) {
            if(a[i] =='D'){
                if(a.slice(i, i+7)=='DVR_DEC'){
                    return 'STMB'
                }
            }
        }
      }
}

function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

function getTodayTime(){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;       
}




// exemple clickabe button

// let dateSubmitBtn = document.getElementById('dateSubmitBtn')
// dateSubmitBtn.onclick = () => {
//     let datePicker = document.getElementById('datePicker')
//     let date = datePicker.value
//     console.log(date);
// }


// TO DO  organisation des data pour test hierrachical structure

// let stambiaHrrchyBtn = document.getElementById('stambiaHrrchyBtn')
// stambiaHrrchyBtn.onclick = async () => {
//     chartdestroy()
//     let inputDateJ = ''
//     // document.getElementById('inputDateJ').value
//     let inputDateJ_1 = ''
//     // document.getElementById('inputDateJ_1').value
//         if(inputDateJ=='' || inputDateJ_1==''){
//             inputDateJ = 202203010901
//             inputDateJ_1 =  202202280901
//         }
//     const data = await fetch(`/api/chart/stambiaGrpd?ID_fichierJ=${inputDateJ}&ID_fichierJ_1=${inputDateJ_1}`)
//     const json = await data.json()
//     var sizeY=12
//     let options = ganttConfigHierar(json.data.labels,
//     json.data.tempsDebutFin,
//     json.data.tempsDebutFinJ_1,
//     json.data.progress,
//     sizeY
//     )
//     chartRender(options)
// }

// let stambiaGrpd = document.getElementById('stambiaGrpd')
// stambiaGrpd.onclick = async () => {
//     chartdestroy()
//     let inputDateJ = ''
//     // document.getElementById('inputDateJ').value
//     let inputDateJ_1 = ''
//     // document.getElementById('inputDateJ_1').value
//         if(inputDateJ=='' || inputDateJ_1==''){
//             inputDateJ = 202203010901
//             inputDateJ_1 =  202202280901
//         }
//     const data = await fetch(`/api/chart/stambiaGrpd?ID_fichierJ=${inputDateJ}&ID_fichierJ_1=${inputDateJ_1}`)
//     const json = await data.json()
//     var sizeY=12
//     let options = ganttConfigGrpdStambia(json.data.labels,
//     json.data.tempsDebutFin,
//     json.data.tempsDebutFinJ_1,
//     json.data.progress,
//     sizeY
//     )
//     chartRender(options)
// }
