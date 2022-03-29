export default function ganttConfigStamb(LabelY, LabelXJ,LabelXJ_1,progressData,progressDataJ_1,sizeY){
        return{
            type: 'bar',
            data: {
                labels: LabelY,
                datasets: [
                    {
                        label: 'data j-1',
                        data: LabelXJ_1,
                        progress:progressDataJ_1,
                        titres : LabelY,
                        //status=statusData,
                        backgroundColor : 'black',
                        borderColor: ['black'],
                        borderWidth: 0.2,
                        barThickness : 5,
                        borderSkipped: false,
                        opacity : 0.2
                    },
                    {
                    label: 'data J',
                    data:  LabelXJ,
                    progress:progressData,
                    titres : LabelY,
                    // status=statusData,
                    backgroundColor:(context)=>{
                        let Taskstatus=context.dataset.progress[context.dataIndex].status;
                        if (context.dataset.titres[context.dataIndex].slice(0,3)!='DVR') {
                            return 'yellow'
                        }
                        if(Taskstatus=='COMPLETED'){
                            return 'blue'
                        }
                        if(Taskstatus=='ABORTED'){
                            return 'red'
                        }
                        if(Taskstatus=='EXECUTED'){
                            return 'orange'
                        }
                    },
                    borderColor: ['black'],
                    borderWidth: 1,
                    borderSkipped: false,
                }]
            },
            options: {
                layout:{
                    padding:40
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        // filter: (tooltipItem)=>{
                        //     console.log(tooltipItem);
                        // },
                        yAlign:'bottom',
                        callbacks:{
                            label:(context)=>{
                                console.log();
                                let date=context.dataset.data[context.dataIndex]
                                let tempsDebut=date[0]
                                let tempsFin=date[1]
                                let tempsR = 0
                                let tempsEst = 0
                                tempsR=context.dataset.progress[context.dataIndex].duree
                                tempsEst =context.dataset.progress[context.dataIndex].tempsEstime
                                return ['Progres: '+ Math.round(context.dataset.progress[context.dataIndex].ratio)+' % => '
                                        + context.dataset.progress[context.dataIndex].status,
                                        'Début: '+ dateShort(tempsDebut)+' Fin: '+dateShort(tempsFin),
                                        'Durée réelle: '+ tempsR,
                                        'Durée Estimé: '+ tempsEst]
                            }
                        }
                    },
                    legend: {
                        display: false,
                        position: 'top'
                    },
                    datalabels:{
                        layout:{
                            padding:20
                        },
                        formatter:(value,context)=>{
                            let Taskstatus=context.dataset.progress[context.dataIndex].status;
                                if(context.datasetIndex == 1){
                                    if(Taskstatus=='ABORTED'){
                                        var reste='🔥  📖'
                                    }
                                    if(Taskstatus=='COMPLETED'){
                                        var reste='✅  📖'
                                    }
                                    if(Taskstatus=='EXECUTED'){
                                        var reste='⏳  📖'
                                    }
                                    return Math.round(context.dataset.progress[context.dataIndex].ratio)+' %' + reste
                                }
                                return ''
                        },
                        font: {
                            size: 10
                        },
                        yAlign:'bottom',
                        anchor:'end',
                        align:  'right',
                        offset:12,
                        color: (context)=>{
                                let Taskstatus=context.dataset.progress[context.dataIndex].status;
                                // console.log(context);
                                if(Taskstatus=='ABORTED'){
                                    return 'red'
                                }
                                if(Taskstatus=='EXECUTED'){
                                    return 'orange'
                                }
                                return 'black'
                        },
                        // backgroundColor:'#BFC63D'
                        display: true,
                        font:{
                            weight:'bold'
                        },
                        opacity:1,
                        listeners:{
                            click: (context)=>{
                                // console.log(context);
                                let url='http://10.150.0.214/mediawiki/index.php/Alimentation_des_r%C3%A9f%C3%A9rentiels_(temps,_magasins,_produits).'
                                window.open(url, '_blank');
                            }
                        },
                        //important pour masqué l'exces des labels.
                        clip:true,
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                            speed:0.4,
                            threshold: 90
                        },
                        drag :{
                            enabled:true,
                            modifierKey:'ctrl',
                            backgroundColor: 'rgba(245, 40, 145, 0.2)',
                            borderColor:'rgba(245, 40, 145, 1)',
                            borderWidth: 2
                        },
                        // specific to phone or tablet screen
                        pinch :{
                            enabled:true,
                        }
                    },
                    pan: {
                        enabled: true,
                        mode : 'xy',
                        // overScaleMode: 'xy'
                        threshold: 90
                    }
                },
                },
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    y: {
                        ticks: {
                            align: 'start',
                            color: (context)=>{
                                // console.log(context);
                                if(context.tick.label.slice(0,3)!='DVR'){
                                    return 'green'
                                }
                                else{
                                    let title = context.tick.label.split('_')
                                    if(title[2]=='SAS') return 'blue'
                                    if(title[2]=='ODS') return 'red'
                                    if(title[2]=='DWH') return 'black'
                                } 
                                return 'black'
                            },
                            font: {
                                size: (context) =>{
                                    if(context.tick.label.slice(0,3)!='DVR'){
                                        return 14
                                    }
                                    return 10
                                },
                                weight :(context) =>{
                                    if(context.tick.label.slice(0,3)!='DVR'){
                                        return 900
                                    }
                                    return 100
                                } 
                            },
                        },
                        backgroundColor: (context) => {
                            return 'white'
                        },
                        font: {
                            size: 8,
                            color: 'red'
                        },
                        beginAtZero: false,
                        grid: {
                            borderDash: [100, 0.1],
                            color : (context) => {
                                if(context.tick){
                                    if(context.tick.label.slice(0,3)!='DVR'){
                                        return 'green'
                                    }
                                }
                                
                                return 'white'
                            }
                        },
                        // type : 'hierarchical'
                    },
                    x: {
                        offset: false,
                        parsing:false,
                        min: ()=>{
                            return LabelXJ[0][0]
                        },
                        max:()=>{  
                            // console.log(LabelXJ[LabelXJ.length-1][1]);  
                            return '2000-01-02 08:40:00'
                        },
                        position: 'top',
                        type: 'time',
                        time: {
                            unit: 'minute',
                            displayFormats: {
                                millisecond: 'HH:mm:ss.SSS',
                                second: 'HH:mm:ss',
                                minute: 'HH:mm',
                                hour: 'HH'
                            },
                            stepSize: 30,
                        },
                        ticks: {
                            align: 'start',
                            display: true,
                            align: 'center',
                            color: (context) =>{
                                if (context.tick.label == '22:05') {
                                    return 'green'
                                }
                            return 'purple'
                            },
                            font: {
                                size: 12
                            },
                            // major :{
                            //     enabled : true
                            // },
                            // showLabelBackdrop : true
                        },
                        grid: {
                            borderDash: (context) =>{
                                // console.log(context);
                                return [1, 1]
                            },
                            color : (context)=>{
                                // console.log(context.tick);
                                if(context.tick.label == '20:35' || context.tick.label == '03:05' )return 'red'
                               return  'purple'
                            }
                        },
                    },
                }
            },
            plugins : [ChartDataLabels]
        };
    }
    
    function dateLong(date){
        // console.log(date);
        let getDate=new Date(date)
        let h=getDate.getHours()
        let m=getDate.getMinutes()
        let s=getDate.getSeconds()
        let y = getDate.getFullYear()
        let M = getDate.getMonth()
        let D = getDate.getDate()
        if(h<10){
            h='0'+h
        }
        if(m<10){
            m='0'+m
        }
        if(s<10){
            s='0'+s
        }
        if(M<10){
            M=M+1
            M='0'+M
        }
        if(D <10){
            D='0'+D
        }
        return `${y}-${M}-${D} ${h}:${m}:${s}`
        }
    
        function progressRec(val)
    {
        if(val==Infinity){
            return 1
        }
        return val
    }
    
    function dateShort(DateLongue){
        let getDate=new Date(DateLongue)
        let h=getDate.getHours()
        let m=getDate.getMinutes()
        let s=getDate.getSeconds()
        if(h<10){
            h='0'+h
        }
        if(m<10){
            m='0'+m
        }
        if(s<10){
            s='0'+s
        }
        return h+':'+m+':'+s
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
    
    // filtre pour récupérer l'intitulé du traitement stambia
    function filterStambiaArr(a){
        const aLength=a.length
        for (let i = 0; i < aLength; i++) {
            if(a[i] =='D'){
                if(a.slice(i, i+7)=='DVR_DEC'){
                    return a.slice(i,aLength)
                }
            }
        }
    }
    