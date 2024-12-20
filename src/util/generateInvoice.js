import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Alert} from 'react-native';

const getInvoiceHtml = (test = 'Hi') => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taxi Booking Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }

        .invoice-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            margin: 0;
            color: #333;
        }

        .header p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }

        .invoice-details {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 6px;
        }

        .invoice-details .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .invoice-details .row span {
            font-size: 14px;
            color: #333;
        }

        .total {
            text-align: center;
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
            color: #222;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>Taxi Ride Invoice</h1>
            <p>Thank you for choosing our service!</p>
        </div>

        <div class="invoice-details">
            <div class="row">
                <span>Invoice #: 12345</span>
                <span>Date: 2024-12-20</span>
            </div>
            <div class="row">
                <span>Passenger Name:</span>
                <span>Suresh Kumar</span>
            </div>
            <div class="row">
                <span>Pickup Location:</span>
                <span>Main Street, City</span>
            </div>
            <div class="row">
                <span>Dropoff Location:</span>
                <span>Park Avenue, City</span>
            </div>
            <div class="row">
                <span>Distance:</span>
                <span>12 km</span>
            </div>
            <div class="row">
                <span>Duration:</span>
                <span>25 minutes</span>
            </div>
            <div class="row">
                <span>Fare:</span>
                <span>${test}</span>
            </div>
        </div>

        <div class="total">
            Total Amount: $15.00
        </div>

        <div class="footer">
            If you have any questions, contact us at support@taxibooking.com.
        </div>
    </div>
</body>
</html>
`
}
export default generateInvoice = async (info) => {
    try {
        const htmlContent = getInvoiceHtml()
        const pdfOptions = {
            html: htmlContent,
            fileName: 'taxi_invoice',
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(pdfOptions)

        Alert.alert('Invoice generated', `Invoice file saved to ${file.filePath}`);
    } catch (error) {
        Alert.alert('Error', `Failed to generate Invoice: ${error.message}`);
    }
};

