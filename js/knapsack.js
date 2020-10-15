function createConfig(w, W) {
    let s = w.reduce((a, b) => a + b)
    let cw = w.map((sum => value => sum += value)(0))
    // let cw = w.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], [])
    let ww = cw.map(x => x - s + W)
    let xw = ww.map((x, i) => x > w[i] ? x : w[i])
    let lo = xw.map(x => x - 1)
    let dt = lo.map(x => W - x)
    return {
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
                    data: ww,
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
                    data: xw,
                    borderWidth: 0,
                    fill: 0,
                    type: 'line',
                    xAxisID: 'nostackX',
                    yAxisID: 'nostackY'
                },
                {
                    label: '省去的计算',
                    data: lo,
                    borderWidth: 1,
                    categoryPercentage: 1,
                    barPercentage: 1
                },
                {
                    label: '必需的计算',
                    backgroundColor: 'rgba(88, 255, 47, 0.2)',
                    borderColor: 'rgba(88, 255, 47, 0.2)',
                    data: dt,
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
    }
}

function createChart(divID, w, W) {
    let div = document.getElementById(divID)
    let canvas = document.createElement('canvas')
    div.appendChild(canvas)
    canvas.setAttribute('width', 400)
    canvas.setAttribute('height', 400)
    return new Chart(canvas.getContext('2d'), createConfig(w, W))
}

window.onload = () => {

    let w = [2, 4, 2, 1, 3, 5, 2, 1, 5, 2, 1, 4, 1]
    let W = 13

    let inputW = document.getElementById('input_W')
    let inputwi = document.getElementById('input_wi')

    inputW.value = W.toString()
    inputwi.value = w.reduce((a, b) => a + ' ' + b.toString())

    chart = createChart('chart', w, W)
    function updateChart() {
        let w = inputwi.value.split(' ').map(x => parseInt(x))
        let W = parseInt(inputW.value)
        let conf = createConfig(w, W)
        chart.data = conf.data
        chart.options = conf.options
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

}