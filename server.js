const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email API endpoint
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const data = await resend.emails.send({
            from: "HR <hr@navabharathtechnologies.com>",
            to: "hr@navabharathtechnologies.com",
            subject: `New Contact Form from ${name}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        console.log("✔ Email Sent:", data);
        res.json({ success: true, message: "Email sent successfully!" });

    } catch (error) {
        console.error("❌ Email Send Error:", error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
