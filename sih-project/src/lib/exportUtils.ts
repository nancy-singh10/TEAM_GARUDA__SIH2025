import * as XLSX from 'xlsx';

/**
 * Export data to an Excel file
 * @param data Array of objects to export
 * @param fileName Name of the file without extension
 */
export const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Export data to a CSV file
 * @param data Array of objects to export
 * @param fileName Name of the file without extension
 */
export const exportToCSV = (data: any[], fileName: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data
    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/**
 * Export data to a JSON file
 * @param data Array of objects to export
 * @param fileName Name of the file without extension
 */
export const exportToJSON = (data: any[], fileName: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/**
 * Generate mock data for reports based on type and range
 */
export const generateReportData = (type: string, range: string) => {
    const days = range === 'last-7-days' ? 7 : range === 'last-30-days' ? 30 : range === 'last-90-days' ? 90 : 365;
    const data = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Base mock values
        const consumption = Math.floor(Math.random() * 500) + 1000; // 1000-1500 kWh
        const peak = Math.floor(Math.random() * 50) + 200; // 200-250 kW
        const solar = Math.floor(Math.random() * 300) + 100;
        const wind = Math.floor(Math.random() * 100) + 50;
        const cost = consumption * 0.12; // $0.12 per kWh
        const savings = (solar + wind) * 0.12;

        let row: any = { Date: dateStr };

        if (type === 'comprehensive') {
            row = {
                ...row,
                'Total Consumption (kWh)': consumption,
                'Peak Demand (kW)': peak,
                'Solar Generation (kWh)': solar,
                'Wind Generation (kWh)': wind,
                'Grid Usage (kWh)': consumption - solar - wind,
                'Cost ($)': parseFloat(cost.toFixed(2)),
                'Savings ($)': parseFloat(savings.toFixed(2)),
                'Carbon Offset (kg)': parseFloat(((solar + wind) * 0.4).toFixed(2))
            };
        } else if (type === 'consumption') {
            row = {
                ...row,
                'Total Consumption (kWh)': consumption,
                'Peak Demand (kW)': peak,
                'Building A (kWh)': Math.floor(consumption * 0.4),
                'Building B (kWh)': Math.floor(consumption * 0.35),
                'Building C (kWh)': Math.floor(consumption * 0.25),
            };
        } else if (type === 'savings') {
            row = {
                ...row,
                'Total Bill ($)': parseFloat(cost.toFixed(2)),
                'Savings from Renewables ($)': parseFloat(savings.toFixed(2)),
                'Net Cost ($)': parseFloat((cost - savings).toFixed(2)),
                'ROI (%)': parseFloat((Math.random() * 5 + 10).toFixed(1))
            };
        } else if (type === 'renewable') {
            row = {
                ...row,
                'Solar Generated (kWh)': solar,
                'Wind Generated (kWh)': wind,
                'Total Renewable (kWh)': solar + wind,
                'Grid Consumed (kWh)': consumption - solar - wind,
                'Renewable Share (%)': parseFloat(((solar + wind) / consumption * 100).toFixed(1))
            };
        }

        data.push(row);
    }

    return data;
};
