if ($("#savings-chart").length) {
    var canvas = $("#savings-chart");

    var data = {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
            {
                label: "Montante com juros",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgb(0, 100, 0)",
                borderColor: "rgb(0, 100, 0)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgb(0, 100, 0)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(0, 100, 0)",
                pointHoverBorderColor: "rgb(0, 100, 0)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: [1000, 2279, 3623, 5036, 6522, 8083, 9725, 11450, 13264, 15171, 17175],
            },
            {
                label: "Montante",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgb(100,136,234)",
                borderColor: "rgb(100,136,234)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgb(100,136,234)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(100,136,234)",
                pointHoverBorderColor: "rgb(100,136,234)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: [1000, 2200, 3400, 4600, 5800, 7000, 8200, 9400, 10600, 11800, 13000],
            },
        ]
    };

    var option = {
        showLines: true,
        legend: {
            labels: {
                fontColor: "white",
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "white",
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "white",
                }
            }]
        }
    };
    var savingsLineChart = Chart.Line(canvas, {
        data: data,
        options: option,
    });

    function calculateSavings() {
        // Get values from form
        var principal = parseFloat($("#start-amount").val().replace(/[^\d\.]/g, ''));
        var years = parseInt($("#years").val());
        var contributionAmount = parseFloat($("#contributions-amount").val().replace(/[^\d\.]/g, ''));
        var contributionRate = parseInt($("#contribution-rate").val());
        var interestRatePercentage = parseFloat($("#interest-rate-amount").val().replace(/[^\d\.]/g, ''));
        var interestRate = interestRatePercentage / 100.0;
        var compoundingFrequency = parseInt($("#compounding-frequency").val());
    
        // Push years into labels array within data array
        data.labels = [];
    
        for (var i = 0; i <= years; i++) {
            data.labels.push(i);
        }
    
        // Calculate values with interest
        data.datasets[0].data = [];
        data.datasets[1].data = [];
        for (var j = 0; j < data.labels.length; j++) {
            var compoundInterestForPrincipal = principal * Math.pow(1 + interestRate / compoundingFrequency, compoundingFrequency * j);
            var principalWithInterest = Math.round(compoundInterestForPrincipal * 100) / 100;
            var futureValueOfSeries = (contributionAmount * contributionRate / interestRate) * (Math.pow(1 + interestRate / compoundingFrequency, compoundingFrequency * j) - 1);
            var contributionsWithInterest = Math.round(futureValueOfSeries * 100) / 100;
            var totalWithInterest = principalWithInterest + contributionsWithInterest;
            totalWithInterest = totalWithInterest.toFixed(2);
            totalWithInterest = parseFloat(totalWithInterest);
    
            if (data.datasets[0].data[j] === undefined) {
                data.datasets[0].data[j] = totalWithInterest;
            }
        }
    
        // Calculate values without interest
        for (var k = 0; k < data.labels.length; k++) {
            var principalNoInterest = principal;
            var principalWithoutInterest = Math.round(principalNoInterest * 100) / 100;
            var monthlyNoInterest = contributionAmount * contributionRate * k;
            var contributionsWithoutInterest = Math.round(monthlyNoInterest * 100) / 100;
            var totalWithoutInterest = principalWithoutInterest + contributionsWithoutInterest;
            totalWithoutInterest = totalWithoutInterest.toFixed(2);
            totalWithoutInterest = parseFloat(totalWithoutInterest);
            if (data.datasets[1].data[k] === undefined) {
                data.datasets[1].data[k] = totalWithoutInterest;
            }
        }
    
        // Update chart and results
        savingsLineChart.update();
    
        var lastYearSumWithInterest = data.datasets[0].data[data.datasets[0].data.length - 1];
        var lastYearSumWithoutInterest = data.datasets[1].data[data.datasets[1].data.length - 1];
    
        $("#savings-results").empty();
        if (contributionRate == 12) {
            $("#savings-results").append("Após " + years + " anos de poupança a uma taxa de juro anual de " + interestRatePercentage + "% e reforços mensais de €" + contributionAmount + ", terias " + "<strong style='color: green'>€" + lastYearSumWithInterest + "</strong>" + ". Sem qualquer juro, teria apenas " + "<strong style='color:rgb(100,136,234)'>€" + lastYearSumWithoutInterest + "</strong>" + ".");
        } else if (contributionRate == 1) {
            $("#savings-results").append("Após " + years + " anos de poupança a uma taxa de juro anual de " + interestRatePercentage + "% e reforços anuais de €" + contributionAmount + ", terias " + "<strong style='color: green'>€" + lastYearSumWithInterest + "</strong>" + ". Sem qualquer juro, teria apenas " + "<strong style='color:rgb(100,136,234)'>€" + lastYearSumWithoutInterest + "</strong>" + ".");
        }
    }
    
    // Add event listeners
    document.addEventListener("DOMContentLoaded", calculateSavings);
    $(".form").change(calculateSavings);
    $("#compounding-frequency").change(calculateSavings);
}