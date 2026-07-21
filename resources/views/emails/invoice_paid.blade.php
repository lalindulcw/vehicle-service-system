<!DOCTYPE html>
<html>
<head>
    <title>Payment Receipt</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Payment Receipt Received</h2>
        <p>Dear {{ $invoice->booking->customer->name }},</p>
        <p>Thank you for choosing VMS Pro Service Center. We have received your payment for service invoice <strong>{{ $invoice->invoice_no }}</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Invoice No</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">{{ $invoice->invoice_no }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Vehicle Registration</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">{{ $invoice->booking->vehicle->registration_no }}</td>
            </tr>
            <tr style="background: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Total Amount Paid</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #059669;">LKR {{ number_format($invoice->total_amount, 2) }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Payment Method</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-transform: uppercase;">{{ $invoice->payment_method }}</td>
            </tr>
        </table>

        <p>If you have any questions or queries regarding this receipt, please do not hesitate to contact us at support@vmspro.com.</p>
        <br>
        <p>Best Regards,<br><strong>VMS Pro Service Center</strong></p>
    </div>
</body>
</html>
