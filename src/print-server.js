// print-server.js (separate Node.js server)
const express = require('express');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const app = express();
const port = 3001;

app.use(express.json());

app.post('/print', async (req, res) => {
  try {
    const { text, printer = 'thermal-printer', copies = 1 } = req.body;
    
    // Find USB printer
    const device = new escpos.USB();
    const printerDevice = new escpos.Printer(device);
    
    device.open(function(error) {
      if (error) {
        
        return res.status(500).json({ error: 'Printer not available' });
      }
      
      printerDevice
        .text(text)
        .cut()
        .close();
      
      res.json({ success: true, message: 'Print job sent' });
    });
  } catch (error) {
   
    res.status(500).json({ error: 'Print failed' });
  }
});

app.listen(port, () => {
 
});