const { exec } = require('child_process');
const path = require('path');

// Function to execute the Python script
async function runDemandForecast() {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../../forecast_scripts/demand_forecast.py'); // Path to your Python script

        exec(`python ${scriptPath}`, (error, stdout, stderr) => {
            console.log("Python script output:", stdout);  // Debugging
        
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                reject(new Error(`Python script failed: ${stderr || error.message}`));
                return;
            }
        
            if (!stdout.trim()) {  // Ensure non-empty output
                reject(new Error("No output received from Python script."));
                return;
            }
        
            try {
                const forecastData = JSON.parse(stdout);  // Parse the Python output
                resolve(forecastData);
            } catch (parseError) {
                console.error("Error parsing forecast output:", parseError);
                reject(parseError);
            }
        });
        
    });
}

// Function to parse the Python script output.  Adapt this to your output format.
function parseForecastOutput(output) {
  try {
    const forecastData = JSON.parse(output);  // Parse the entire JSON output
    return forecastData; // Return the parsed JSON object
  } catch (error) {
    console.error("Error parsing JSON output:", error);
    throw error;
  }
}

module.exports = { runDemandForecast };