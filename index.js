const express = require("express");
const process = require('process');
const dotenv = require('dotenv');
const { google } = require('googleapis');

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID

app.post("/signup", async (req, res) => {

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        })
    
        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });
    
        await sheets.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: SPREADSHEET_ID,
            range: "Contacts!A:D",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [req.body.first, req.body.last, req.body.email, req.body.organization]
                ]
            }
        })
    
        res.json({ success: true });

    } catch (e) {
        console.error(e);
        res.json({ success: false });
    }
});

app.get("*", (req, res) => {
    res.json({ message: "Incorrect address. Please try again." });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});