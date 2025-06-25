document.addEventListener('DOMContentLoaded',async () => {
    loadData();
})


let loadData = async () => {
    let allmutuals;
    await fetch('/api/mutual-funds')
        .then(response => response.json())
        .then(data => {
            // console.log("Mutual Funds:", data);
        allmutuals = data;
    })
    .catch(error => console.error("Error fetching data:", error));
    // console.log(allmutuals)
    let mutualDetails = []
    for(let i = 0;i<allmutuals.length;i++){
        let obj = {
            "name" : allmutuals[i].fundName,
            "fundCode" : allmutuals[i].fundCode,
            "amcName" : "Default",
            "buyingDates" : allmutuals[i].buyingDates,
            "investedAmount" : allmutuals[i].investedAmount,
            "boughtUnits" : allmutuals[i].boughtUnits,
            "xirr" : 0,
            "latestNav" : 0,
            "latestDate" : 0,
            "totalUnits" : 0,
            "totalAmount" : 0
        }
        mutualDetails.push(obj)
    }
    let alltotal = 0,allUnits = 0
    for(let i = 0;i<mutualDetails.length;i++){
        let res = await fetch(`https://api.mfapi.in/mf/${mutualDetails[i].fundCode}/latest`)
        let rec = await res.json()
        // console.log(rec.meta.fund_house)
        let totalUnits = 0,totalAmount = 0;
        for(let j = 0;j<mutualDetails[i].boughtUnits.length;j++){
            totalUnits += mutualDetails[i].boughtUnits[j]
            totalAmount += mutualDetails[i].investedAmount[j]
        }
        alltotal += totalAmount
        allUnits += totalUnits
        // console.log(totalUnits)
        mutualDetails[i].amcName = rec.meta.fund_house
        mutualDetails[i].latestNav = parseFloat(rec.data[0].nav);
        mutualDetails[i].latestDate = rec.data[0].date
        mutualDetails[i].totalUnits = totalUnits
        mutualDetails[i].totalAmount = totalAmount
    }
    document.getElementsByClassName('stat-value')[0].innerHTML = '₹' + alltotal
    document.getElementsByClassName('stat-value')[1].innerHTML = allUnits.toFixed(2)
    let mutualsxirr;
    mutualsxirr = await fetch('/calculateXirr', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(mutualDetails)
    });
    mutualsxirr = await mutualsxirr.json()
    let n = mutualDetails.length
    document.getElementsByClassName('stat-value')[3].innerHTML = n
    let avgxirr = 0
    console.log(mutualsxirr)
    let tbody = document.getElementsByClassName('addele')[0]
    for(let i = 0;i<mutualDetails.length;i++){
        avgxirr += mutualsxirr[i]*100
        let toaddclass = ''
        if(mutualsxirr[i]*100 < 0) toaddclass = 'negative-return'
        else if(mutualsxirr[i]*100 <= 10) toaddclass = 'neutral-return'
        else toaddclass = 'positive-return'
        tbody.innerHTML +=  `<tr>
                            <td>
                                <div class="fund-cell">
                                    <div class="fund-icon">${mutualDetails[i].name.slice(0,2).toUpperCase()}</div>
                                    <div class="fund-details">
                                        <div class="fund-name">${mutualDetails[i].name.slice(0,15)}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="amc-name">${mutualDetails[i].amcName}</td>
                            <td class="invested-amount">₹${mutualDetails[i].totalAmount}</td>
                            <td class="units">${mutualDetails[i].totalUnits.toFixed(2)}</td>
                            <td><span class="${toaddclass}">${(mutualsxirr[i]*100).toFixed(2)}%</span></td>
                        </tr>`
    }
    avgxirr = avgxirr/n
    console.log(avgxirr)
    document.getElementsByClassName('stat-value')[2].innerHTML = `${avgxirr.toFixed(1)}%`
}
