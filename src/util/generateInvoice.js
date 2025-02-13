import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Alert } from 'react-native';
import { formattedDate } from '.';

const getInvoiceHtml = (info) => {
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
            padding:10px
        }

        .invoice-details .row span {
            font-size: 14px;
            color: #333;
        }
         .invoice-details .row  .text-overflow
            {
            overflow: hidden;
            text-overflow: ellipsis;
            width: 50%;
            white-space: nowrap;
        }

        .invoice-details .row .text-overflow > span
            {
            font-weight: normal;
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
                <span>Invoice #: ${info.id}</span>
                <span>Date: ${formattedDate(info.created_at)}</span>
            </div>
           
            <div class="row">
                <span>Pickup Location:</span>
                <div class="text-overflow">
                  <span>${info.from_location}</span>
                </div>
            </div>
            <div class="row">
                <span>Dropoff Location:</span>
                 <div class="text-overflow">
                  <span>${info.to_location}</span>
                </div>
            </div>
            <div class="row">
                <span>Distance:</span>
                <span>${info.distance} km</span>
            </div>
            <div class="row">
                <span>Duration:</span>
                <span>${info.duration}</span>
            </div>
            <div class="row">
                <span>Fare:</span>
                <span>\u20B9${info?.RequestRides?.fare || 'NA'}</span>
            </div>
        </div>

        <div class="total">
            Total Amount: \u20B9${info?.RequestRides?.fare || 'NA'}
        </div>

        <div class="footer">
            If you have any questions, contact us at 
            <a href="mailto:contact@apnicabi.com">contact@apnicabi.com</a>
        </div>
    </div>
</body>
</html>
`
}
export default generateInvoice = async (info) => {
    try {
        const htmlContent = getInvoiceHtml(info)
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

