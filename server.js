const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Resend Client
const resend = new Resend(process.env.RESEND_API_KEY);

// Send Email Route
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const emailResponse = await resend.emails.send({
            from: 'HR <hr@navabharathtechnologies.com>',
            to: 'hr@navabharathtechnologies.com',
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        console.log("✔ Email sent:", emailResponse);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
