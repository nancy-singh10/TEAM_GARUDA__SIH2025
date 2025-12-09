import twilio from 'twilio';

// Initialize with environment variables or use a mock if missing
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
} else {
    console.warn("⚠️ Twilio credentials missing. SMS will be logged to console only.");
}

// MessageBird Config
const messageBirdKey = process.env.MESSAGEBIRD_API_KEY;

export async function sendVoucherSMS(phoneNumber: string, tokens: number) {
    const message = `Limitless Energy: Congrats! You reached ${tokens} Green Points and unlocked a 10% Store Voucher!`;

    try {
        // Option 1: MessageBird (Requested by User)
        if (messageBirdKey) {
            console.log("🚀 Sending via MessageBird...");
            const res = await fetch('https://rest.messagebird.com/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `AccessKey ${messageBirdKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipients: [phoneNumber], // e.g., +919876543210
                    originator: 'Limitless',
                    body: message
                })
            });

            if (res.ok) {
                const data = await res.json();
                console.log("✅ MessageBird Sent:", data);
                return { success: true, provider: 'MessageBird' };
            } else {
                const err = await res.json();
                console.error("❌ MessageBird Error:", err);
            }
        }

        // Option 2: Fast2SMS (Backup)
        if (fast2SmsKey) {
            console.log("🚀 Sending via Fast2SMS...");
            const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                method: 'POST',
                headers: {
                    'authorization': fast2SmsKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "route": "q",
                    "message": message,
                    "language": "english",
                    "flash": 0,
                    "numbers": phoneNumber // e.g. "9999999999" (without +91 usually working, or with)
                })
            });

            const data = await res.json();
            console.log("✅ Fast2SMS Response:", data);
            return { success: true, provider: 'Fast2SMS' };
        }

        // Option 2: Twilio
        if (client && fromNumber) {
            // Auto-detect if we are sending via WhatsApp based on the FROM number in env
            let toAddr = phoneNumber;
            if (fromNumber.startsWith('whatsapp:')) {
                // If From is WhatsApp, To must also be WhatsApp
                if (!toAddr.startsWith('whatsapp:')) {
                    toAddr = `whatsapp:${toAddr}`;
                }
            }

            // Real SMS/WhatsApp
            const response = await client.messages.create({
                body: message,
                from: fromNumber,
                to: toAddr
            });

            const type = fromNumber.startsWith('whatsapp:') ? 'WhatsApp' : 'SMS';
            console.log(`✅ ${type} Sent to ${phoneNumber}: SID ${response.sid}`);
            return { success: true, sid: response.sid };
        } else {
            // Mock SMS
            console.log(`[MOCK SMS] To: ${phoneNumber} | Message: "${message}"`);
            return { success: true, mock: true };
        }
    } catch (error: any) {
        console.error("❌ Failed to send SMS:", error.message);
        // We generally don't want to crash the request if SMS fails
        return { success: false, error: error.message };
    }
}
