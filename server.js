const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email Configuration
// IMPORTANT: Replace these with actual credentials or use environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred email service
    auth: {
        user: 'hr@navabharathtechnologies.com', // REPLACE WITH YOUR EMAIL
        pass: 'vycrzwtbmlpieazo'     // REPLACE WITH YOUR APP PASSWORD
    }
});

// Route to handle form submission
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Server-side validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const mailOptions = {
        from: email, // Sender address (from the form)
        to: 'hr@navabharathtechnologies.com', // Recipient
        subject: `New Contact Form Submission from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            
            Message:
            ${message}
        `,
        replyTo: email
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
