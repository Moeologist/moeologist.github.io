function calData(w, W) {
    var s = w.reduce((a, b) => a + b)
    var cw = w.map((sum => value => sum += value)(0))
    // var cw = w.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], [])
    var ww = cw.map(x => x - s + W)
    var xw = ww.map((x, i) => x > w[i] ? x : w[i])
    var lo = xw.map(x => x - 1)
    var dt = lo.map(x => W - x)
    return {
        ww: ww,
        xw: xw,
        lo: lo,
        dt: dt
    }
}

function createChart(divID, w, W) {
    var div = document.getElementById(divID)
    var canvas = document.createElement('canvas')
    div.appendChild(canvas)
    canvas.setAttribute('width', 400)
    canvas.setAttribute('height', 400)
    var ctx = canvas.getContext('2d')

    var C = calData(w, W)

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: w.length }, (x, i) => i + 1).map(x => "i = " + x),
            datasets: [
                {
                    label: 'w[i]',
                    backgroundColor: 'rgba(0, 177, 244, 1)',
                    borderColor: 'rgba(0, 177, 244, 1)',
                    data: w,
                    borderWidth: 1,
                    fill: false,
                    type: 'line',
                    xAxisID: 'nostackX',
                    yAxisID: 'nostackY'
                },
                {
                    label: 'W - ∑',
                    backgroundColor: 'rgba(54, 32, 255, 1)',
                    borderColor: 'rgba(54, 32, 255, 1)',
                    data: C.ww,
                    borderWidth: 1,
                    fill: false,
                    type: 'line',
                    xAxisID: 'nostackX',
                    yAxisID: 'nostackY'
                },
                {
                    label: '下界改进',
                    backgroundColor: 'rgba(54, 32, 255, 0.1)',
                    borderColor: 'rgba(54, 32, 255, 0)',
                    data: C.xw,
                    borderWidth: 0,
                    fill: 0,
                    type: 'line',
                    xAxisID: 'nostackX',
                    yAxisID: 'nostackY'
                },
                {
                    label: '省去的计算',
                    data: C.lo,
                    borderWidth: 1,
                    categoryPercentage: 1,
                    barPercentage: 1
                },
                {
                    label: '必需的计算',
                    backgroundColor: 'rgba(88, 255, 47, 0.2)',
                    borderColor: 'rgba(88, 255, 47, 0.2)',
                    data: C.dt,
                    borderWidth: 1,
                    categoryPercentage: 1,
                    barPercentage: 1
                }
            ]
        },
        options: {
            elements: {
                line: {
                    tension: 0.000001
                }
            },
            scales: {
                xAxes: [
                    {
                        stacked: true
                    },
                    {
                        display: false,
                        stacked: false,
                        id: 'nostackX',
                        offset: true
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                        ticks: {
                            min: 0,
                            max: W,
                            stepSize: 1,
                            startAtZero: true
                        }
                    },
                    {
                        display: false,
                        stacked: false,
                        ticks: {
                            min: 0,
                            max: W,
                            stepSize: 1,
                            startAtZero: true
                        },
                        id: 'nostackY'
                    }
                ]
            }
        }
    })
    return myChart
}

var w = [2, 4, 2, 1, 3, 5, 2, 1, 5, 2, 1, 4, 1]
W = 13

inputW = document.getElementById('W')
inputwi = document.getElementById('wi')

inputW.value = W.toString()
inputwi.value = w.reduce((a, b) => a + ' ' + b.toString())

chart = createChart('myChart1', w, W)
function updateChart() {
    let w = inputwi.value.split(' ').map(x => parseInt(x))
    let W = parseInt(inputW.value)
    C = calData(w, W)
    chart.data.labels = Array.from({ length: w.length }, (x, i) => i + 1).map(x => "i = " + x),
    chart.data.datasets[0].data = w
    chart.data.datasets[1].data = C.ww
    chart.data.datasets[2].data = C.xw
    chart.data.datasets[3].data = C.lo
    chart.data.datasets[4].data = C.dt
    chart.options.scales.yAxes[0].ticks.max = W
    chart.options.scales.yAxes[1].ticks.max = W
    chart.update()
}

// inputW.onchange = updateChart
// inputwi.onchange = updateChart
document.getElementById('sort').onclick = () => {
    this.his = inputwi.value.split(' ').map(x => parseInt(x))
    inputwi.value = this.his.slice().sort((a, b) => a - b).reverse().reduce((a, b) => a + ' ' + b.toString())
    updateChart()
}

document.getElementById('refresh').onclick = () => {
    updateChart()
}
