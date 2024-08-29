# Projet Hamurabi

## Savings Calculator

This application includes a Savings Calculator that computes the future value of an investment with regular contributions over a specified period, considering compound interest. 

### Key Features:
- **Initial Investment (Principal):** The starting amount of money.
- **Regular Contributions:** Monthly contributions added to the investment.
- **Interest Rate:** The annual interest rate applied to the investment.
- **Compounding Frequency:** The frequency at which the interest is compounded (quarterly, in this case).
- **Time Period:** The total number of years over which the investment grows.

### Formulae Used

The calculator utilizes the following financial formulae to compute the future value:

1. **Future Value of the Initial Investment (P):**

   \[
   A = P \times \left(1 + \frac{r}{n}\right)^{nt}
   \]

   - \(P\): Initial investment (Principal)
   - \(r\): Annual interest rate (decimal)
   - \(n\): Number of compounding periods per year (quarterly compounding means \(n = 4\))
   - \(t\): Time in years
   - \(A\): Future value of the initial investment

2. **Future Value of the Regular Contributions (PMT):**

   \[
   FV_{\text{contributions}} = PMT \times \sum_{m=1}^{12 \times t} \left(1 + \frac{r}{n}\right)^{n \times (t - \frac{m}{12})}
   \]

   - \(PMT\): Monthly contribution amount
   - \(m\): Month index, representing each contribution month
   - \(r\): Annual interest rate (decimal)
   - \(n\): Number of compounding periods per year
   - \(t\): Time in years
   - \(FV_{\text{contributions}}\): Future value of the series of contributions