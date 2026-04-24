import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const form = new formidable.IncomingForm();
  
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Gagal parse file" });

    // --- ALAMAT RUMAH TERMUX KAMU ---
    const NGROK_URL = "https://assembled-residential-locate-effectiveness.trycloudflare.com"; 

    try {
      const file = files.file[0] || files.file;
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);

      // Kirim foto ke Termux
      const response = await axios.post(`${NGROK_URL}/api/remote-upload`, formData, {
        headers: { ...formData.getHeaders() }
      });

      res.status(200).json({ 
          status: "Success", 
          filename: file.originalFilename 
      });
    } catch (error) {
      res.status(500).json({ error: "Mesin Termux Ino Offline" });
    }
  });
        }
    
