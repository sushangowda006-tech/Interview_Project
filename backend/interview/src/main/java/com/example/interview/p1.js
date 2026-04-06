const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

rl.question('Enter the temperature (e.g., 25C, 77F): ', (input) => {
  const temp = parseFloat(input.slice(0, -1));
  const scale = input.slice(-1).toUpperCase();

  if (isNaN(temp) || (scale !== 'C' && scale !== 'F')) {
    console.log('Invalid input. Please enter a valid temperature with the scale (C or F).');
  } else {
    if (scale === 'C') {
      const fahrenheit = celsiusToFahrenheit(temp);
      console.log(`${temp}C is ${fahrenheit.toFixed(2)}F`);
    } else if (scale === 'F') {
      const celsius = fahrenheitToCelsius(temp);
      console.log(`${temp}F is ${celsius.toFixed(2)}C`);
    }
  }

  rl.close();
});