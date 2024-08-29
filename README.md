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

   <img src="http://www.sciweavers.org/tex2img.php?eq=%0AA%20%3D%20P%20%5Cleft%281%20%2B%20%5Cfrac%7Br%7D%7Bn%7D%5Cright%29%5E%7Bnt%7D%0A&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0" align="center" border="0" alt="A = P \left(1 + \frac{r}{n}\right)^{nt}" width="126" height="28" />

   - \(P\): Initial investment (Principal)
   - \(r\): Annual interest rate (decimal)
   - \(n\): Number of compounding periods per year (quarterly compounding means \(n = 4\))
   - \(t\): Time in years
   - \(A\): Future value of the initial investment

2. **Future Value of the Regular Contributions (PMT):**

   <img src="http://www.sciweavers.org/tex2img.php?eq=FV_%7B%5Ctext%7Bcontributions%7D%7D%20%3D%20PMT%20%5Ctimes%20%5Csum_%7Bm%3D1%7D%5E%7B12%20%5Ctimes%20t%7D%20%5Cleft%281%20%2B%20%5Cfrac%7Br%7D%7Bn%7D%5Cright%29%5E%7Bn%20%5Ctimes%20%28t%20-%20%5Cfrac%7Bm%7D%7B12%7D%29%7D&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0" align="center" border="0" alt="FV_{\text{contributions}} = PMT \times \sum_{m=1}^{12 \times t} \left(1 + \frac{r}{n}\right)^{n \times (t - \frac{m}{12})}" width="347" height="54" />

   - \(PMT\): Monthly contribution amount
   - \(m\): Month index, representing each contribution month
   - \(r\): Annual interest rate (decimal)
   - \(n\): Number of compounding periods per year
   - \(t\): Time in years
   - \(FV_{\text{contributions}}\): Future value of the series of contributions
