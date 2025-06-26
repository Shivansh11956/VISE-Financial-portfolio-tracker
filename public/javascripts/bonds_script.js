document.addEventListener('DOMContentLoaded', async function () {    
    loadData(); 
});
let hammenu = document.getElementById('hammenu')
let sidebar = document.getElementsByClassName('sidebar')[0]
let x = 0
hammenu.addEventListener('click',()=>{
   if(x==0){
    sidebar.style.display = 'block'
    x = 1
    hammenu.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>`
    hammenu.style.color = 'white'
   }else{
    sidebar.style.display = 'none'
    x = 0
    hammenu.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>`
    hammenu.style.color = 'black'
   }
})
gsap.to(".letter", {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    duration: 0.2,
    ease: "power2.out"
});
setTimeout(()=>{ 

  document.querySelector('.loading').classList.add('hidden')
  document.querySelector('.container').style.display = 'block'
  setTimeout(() => {
     document.querySelector('.loading').style.display = "none";
  }, 1000);

  
},2000);


async function loadData(){
    function generateGreyShades(n) {
        if (n < 1) return [];
        if (n > 254) {
            console.error("Maximum 254 shades are possible (excluding black and white).");
            return [];
        }
    
        let shades = [];
        let step = Math.floor(254 / (n + 1)); 
    
        for (let i = 1; i <= n; i++) {
            let shade = 255 - i * step;
            let hex = `#${shade.toString(16).padStart(2, '0').repeat(3)}`;
            shades.push(hex);
        }
    
        return shades;
    }
    function calculateInterest(startDate, endDate, principal, rate) {
        
        let start = new Date(startDate);
        let end = new Date(endDate);
        
      
        let days = (end - start) / (1000 * 60 * 60 * 24);
        
       
        let T = days / 365;
        let n = 365; 
        
       
        let A = principal * Math.pow(1 + (rate / (100 * n)), n * T);
        let CI = A - principal; 
        
        return CI.toFixed(2); 
    }
    
    

    
    
 
    let allBonds;
    await fetch('/api/bonds')
        .then(response => response.json())
        .then(data => {
            // console.log("Mutual Funds:", data);
            allBonds = data;
        })
    .catch(error => console.error("Error fetching data:", error));
    console.log(allBonds)
    let netassetcon = document.querySelector('#invested p')
    let currentassetcon = document.querySelector('#current p')
    let pnlcon = document.querySelector('#pnl p');
    let pnlcon2 = document.querySelector('#pnl span p')
    let bondNames = []
    let bondVal = []
    let percentArr = []
    let couponRateArr = []
    let investedDates = []
    let totalval = 0;
    let mflistHTML = "";
    let allmflist = document.querySelector('.allmflist');
    for(let key in allBonds){
        bondNames.push(allBonds[key].bondName.toUpperCase());
        bondVal.push(allBonds[key].faceValue)
        investedDates.push(allBonds[key].date.split("T")[0])
        couponRateArr.push(allBonds[key].couponRate)
        totalval += allBonds[key].faceValue
    }
    console.log(investedDates)
    netassetcon.innerHTML =`₹` + totalval.toFixed(2)
    for(let i = 0;i<bondVal.length;i++){
        let x = bondVal[i]/totalval
        x = x*100;
        percentArr.push(x);
    }
    for(let i = 0;i<bondNames.length;i++){
        let str = bondNames[i].slice(0,30);
        if(bondNames[i].length > 30) str += ' ...'
        mflistHTML =  
        `
            <div class="mfcompo">
                                    <div class="mflistfirst">
                                    <span class="allmflistlogo"></span>
                                    </div>
                                    <div class="mflistsecond"> 
                                        <div class="mflistsecondone">${str}</div>
                                        <div class="mflistsecondtwo" style="font-weight: 400;">
                                            <span>Invested Amount : ${bondVal[i]}</span>
                                            <span >Interest Rates : ${couponRateArr[i].toFixed(2)}</span>
                                        </div>
                                    </div>
            </div>
        ` + mflistHTML
    }
    let profitdiv = document.querySelector(".profits .allmflist")
    let currentval = 0;
    for(let j = 0;j<bondNames.length;j++){
        let today = new Date().toISOString().split('T')[0]
        console.log(today)
        
        let ci = calculateInterest(investedDates[j],today,bondVal[j],couponRateArr[j])
       
        
        // console.log(Number(ci));
        // console.log(bondVal[j])
        // console.log(bondVal[j]+(Number)(ci))
        currentval += (bondVal[j]+(Number)(ci))
        let str = bondNames[j].slice(0,30);
        if(bondNames[j].length > 20) str += ' ...'
        let clr = "#2CEBBE";
        let tempper = (ci/bondVal[j])*100
        tempper = tempper.toFixed(2)
        let x = `<div class="mfcompo">
                                <div class="mflistfirst">
                                <span class="allmflistlogo" style="background-color : ${clr};"></span>
                                </div>
                                <div class="mflistsecond pmflistsecond"> 
                                    <div class="mflistsecondone pmflistsecondone">${str}</div>
                                    <div class="mflistsecondtwo pmflistsecondtwo" style="font-weight: 400;">
                                        <span style = "color : ${clr};">${tempper} %</span>
                                    </div>
                                </div>
                            </div> `
        profitdiv.innerHTML = x + profitdiv.innerHTML
    }
    console.log(currentval)
    currentassetcon.innerHTML = `₹` + currentval.toFixed(2)
    pnlcon.innerHTML = `₹` + ((Number)(currentval)-(Number)(totalval)).toFixed(2)
    let totalperreturn = ((((Number)(currentval)-(Number)(totalval)).toFixed(2))/(Number)(totalval))*100
    pnlcon2.innerHTML = '+'+ totalperreturn.toFixed(2) + '%'

    allmflist.innerHTML = mflistHTML
    const ctx = document.getElementById('myPieChart').getContext('2d');
    new Chart(ctx, {
                type: 'pie',
                data: {
                    labels : bondNames,
                    datasets: [{
                        data: percentArr,
                        backgroundColor: generateGreyShades(bondNames.length)
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
    });
    const ctx2 = document.getElementById('myBarChart').getContext('2d');
        const myBarChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: bondNames,
                datasets: [{
                    label: 'Interest Rates',
                    data: couponRateArr,
                    backgroundColor: '#353935',
                    borderColor: 'black',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        beginAtZero: true
                    }
                }
            }
        });
}
