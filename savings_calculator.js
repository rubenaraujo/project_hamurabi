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
                backgroundColor: "rgb(255, 0, 0)",
                borderColor: "rgb(255, 0, 0)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgb(255, 0, 0)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(255, 0, 0)",
                pointHoverBorderColor: "rgb(255, 0, 0)",
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
        var P = $("#start-amount").val().replace(/[^\d\.]/g, '');
        var t = $("#years").val();
        var PMT = $("#contributions-amount").val().replace(/[^\d\.]/g, '');
        var n = $("#contribution-rate").val();
        var r_percentage = $("#interest-rate-amount").val().replace(/[^\d\.]/g, '');
        var r = parseFloat(r_percentage) / 100.0;

        // Push years into labels array within data array
        data.labels = [];

        for (i = 0; i <= t; i++) {
            data.labels.push(i);
        }

        // Calculate values with and without interest
        data.datasets[0].data = [];
        data.datasets[1].data = [];
        for (j = 0; j < data.labels.length; j++) {
            var compound_interest_for_principal = P * (Math.pow(1 + r / n, n * j));
            var a = Math.round(compound_interest_for_principal * 100) / 100;
            var future_value_of_series = ((PMT * n) / r) * (Math.pow(1 + r / n, n * j) - 1)
            var b = Math.round(future_value_of_series * 100) / 100;
            var A = a + b
            var A = A.toFixed(2);
            var A = parseInt(A);

            if (data.datasets[0].data[j] === undefined) {
                data.datasets[0].data[j] = A;
            }
        }
        for (k = 0; k < data.labels.length; k++) {
            var r = 0;
            var principal_no_interest = P;
            var a = Math.round(principal_no_interest * 100) / 100;
            var monthly_no_interest = PMT * n * k;
            var b = Math.round(monthly_no_interest * 100) / 100;
            var A = a + b;
            var A = A.toFixed(2);
            var A = parseInt(A);
            if (data.datasets[1].data[k] === undefined) {
                data.datasets[1].data[k] = A;
            }
        }

        // Update chart and results
        savingsLineChart.update();

        var last_year_sum_interest = data.datasets[0].data[data.datasets[0].data.length - 1];
        var last_year_sum_no_interest = data.datasets[1].data[data.datasets[1].data.length - 1];

        $("#savings-results").empty();
        if (n == 12) {
            $("#savings-results").append("Após " + t + " anos de poupança a uma taxa de juro anual de " + r_percentage + "% e reforços mensais de €" + PMT + ", terias " + "<strong style='color: green'>€" + last_year_sum_interest + "</strong>" + ". Sem qualquer juro, teria apenas " + "<strong style='color:red'>€" + last_year_sum_no_interest + "</strong>" + ".");
        } else if (n == 1) {
            $("#savings-results").append("Após " + t + " anos de poupança a uma taxa de juro anual de " + r_percentage + "% e reforços anuais de €" + PMT + ", terias " + "<strong style='color: green'>€" + last_year_sum_interest + "</strong>" + ". Sem qualquer juro, teria apenas " + "<strong style='color:red'>€" + last_year_sum_no_interest + "</strong>" + ".");
        }
    }

    // Add event listeners
    document.addEventListener("DOMContentLoaded", calculateSavings);
    $(".savings-form").change(calculateSavings);

}