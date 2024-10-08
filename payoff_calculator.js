function calculateSavingsWithAmortization() {
    var debt_amount = parseFloat($("#debt-amount").val().replace(/[^\d\.]/g, ''));
    var euribor = parseFloat($("#euribor").val());
    var spread = parseFloat($("#spread").val());
    var annualInterestRate = (euribor + spread) / 100;
    var totalInstallments = parseInt($("#installments").val());
    var annualAmortization = parseInt($("#amortization").val());

    // Convert annual interest rate to monthly interest rate
    const monthlyInterestRate = annualInterestRate / 12;

    let outstandingBalance = debt_amount;
    let totalPaidWithAmortization = 0;
    let actualInstallments = 0;

    for (let i = 1; i <= totalInstallments; i++) {
        // Calculate the current monthly installment based on the outstanding balance
        const monthlyPayment = outstandingBalance * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalInstallments - i + 1) /
            (Math.pow(1 + monthlyInterestRate, totalInstallments - i + 1) - 1);
        totalPaidWithAmortization += monthlyPayment;
        actualInstallments++;

        // Perform amortization every 12 months
        if (i % 12 === 0) {
            outstandingBalance -= annualAmortization;
            if (outstandingBalance <= 0) {
                break;
            }
        }

        // Update the outstanding balance after the payment
        outstandingBalance -= (monthlyPayment - outstandingBalance * monthlyInterestRate);
    }

    // Calculate the total amount paid without any amortization for comparison
    const paymentWithoutAmortization = debt_amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalInstallments) /
        (Math.pow(1 + monthlyInterestRate, totalInstallments) - 1);
    const totalWithoutAmortization = paymentWithoutAmortization * totalInstallments;

    // Total savings with amortizations
    const totalSavings = totalWithoutAmortization - totalPaidWithAmortization;

    // Format numbers with thousands separator
    const formatter = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Update the DOM
    document.getElementById("savings-amount").textContent = `Poupança de ${formatter.format(totalSavings)}€`;
    document.getElementById("info").textContent = `O valor total a ser pago sem as amortizações seria de ${formatter.format(totalWithoutAmortization)}€. O valor total amortizado seria de ${formatter.format(totalPaidWithAmortization)}€. Acabaria de pagar o empréstimo em ${actualInstallments} meses.`;

    //justify text on element info
    document.getElementById("info").style.textAlign = "justify";

}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate-button").addEventListener("click", calculateSavingsWithAmortization);
    document.getElementById("payoff-tab").addEventListener("click", calculateSavingsWithAmortization);
});