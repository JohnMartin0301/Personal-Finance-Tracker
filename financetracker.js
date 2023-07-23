// This program allows users to track their finances by entering their allowance for the month and then adding expenses in various categories.

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let totalAmount;
let transactions = [];
let allowanceLeft;

function calculateFinances() {
  rl.question("Enter your allowance: ", function(amount) {
    totalAmount = parseFloat(amount);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.log("Invalid input. Please enter a valid amount.");
      rl.close();
      return;
    }

    allowanceLeft = totalAmount;

    // My personal way of managing finances
    const needsPercentage = 50;  // Needs for 50%
    const savingsPercentage = 30; // Savings for 30% 
    const wantsPercentage = 20;   // Wants for 20%

    const needsAmount = (totalAmount * needsPercentage) / 100;
    const savingsAmount = (totalAmount * savingsPercentage) / 100;
    const wantsAmount = (totalAmount * wantsPercentage) / 100;

    console.log("Amount for Needs: $" + needsAmount.toFixed(2));
    console.log("Amount for Savings: $" + savingsAmount.toFixed(2));
    console.log("Amount for Wants: $" + wantsAmount.toFixed(2));

    rl.question("Do you want to enter expenses for this month? (yes/no): ", function(answer) {
      if (answer.toLowerCase() === "yes") {
        enterExpenses();
      } else {
        console.log("Allowance left for this month: $" + allowanceLeft.toFixed(2));
        rl.close();
      }
    });
  });
}

function enterExpenses() {
  rl.question("Enter the expense category (Needs/Savings/Wants): ", function(category) {
    const categoryLower = category.toLowerCase();
    if (categoryLower === "needs" || categoryLower === "savings" || categoryLower === "wants") {
      rl.question("Enter the transaction description: ", function(description) {
        rl.question("Enter the transaction amount: ", function(amount) {
          amount = parseFloat(amount);

          if (isNaN(amount) || amount <= 0) {
            console.log("Invalid input. Please enter a valid amount.");
            enterExpenses();
            return;
          }

          transactions.push({ description, amount, category: categoryLower });
          allowanceLeft -= amount;   // Deduct the expense amount from the allowance
          console.log("Expense added successfully!");
          console.log("Allowance left for this month: $" + allowanceLeft.toFixed(2));

          rl.question("Do you want to add more expenses? (yes/no): ", function(answer) {
            if (answer.toLowerCase() === "yes") {
              enterExpenses();   // Recursively call enterExpenses to add more expenses
            } else {
              console.log("Expenses for this month (" + getCurrentMonth() + "):");
              transactions.forEach((transaction, index) => {
                console.log(`${index + 1}. ${transaction.description}: $${transaction.amount.toFixed(2)} (${transaction.category})`);
              });

              console.log("Amount spent for month of " + getCurrentMonth() + ": $" + (totalAmount - allowanceLeft).toFixed(2));

              rl.question("Do you want to track finances for another month? (yes/no): ", function(answer) {
                if (answer.toLowerCase() === "yes") {
                  transactions = [];   // Clear the transactions array for the next month
                  calculateFinances();   // Start the process again for the next month
                } else {
                  rl.close();   // Close the readline interface to terminate the program
                }
              });
            }
          });
        });
      });
    } else {
      console.log("Invalid category. Please choose from Needs, Savings, or Wants.");
      enterExpenses();
    }
  });
}

function getCurrentMonth() {
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  const currentDate = new Date();
  return months[currentDate.getMonth()];
}

// Run the function to track finances for the first time
calculateFinances();