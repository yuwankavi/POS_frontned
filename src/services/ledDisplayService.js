
class LedDisplayService {
  constructor() {
    this.isConnected = false;
    this.baudRate = 2400;
    this.serialPort = null;
    this.writer = null;
    this.reader = null;
    this.autoConnectAttempted = false;
    this.fallbackMode = false;
  }

  
  async initializeDisplay() {
    if (this.autoConnectAttempted) {
      return this.isConnected;
    }
    
    this.autoConnectAttempted = true;
    
    try {
      
      if (!navigator.serial) {

        return this.enableFallbackMode();
      }

      
      const ports = await navigator.serial.getPorts();
      
      
      let targetPort = null;
      
      
      for (const port of ports) {
        try {
          
          
          targetPort = port;
          break;
        } catch (error) {

        }
      }

      
      if (!targetPort) {

        return this.enableFallbackMode();
      }

      
      await targetPort.open({
        baudRate: this.baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      });

      this.serialPort = targetPort;
      this.writer = targetPort.writable.getWriter();
      this.reader = targetPort.readable.getReader();
      this.isConnected = true;
      this.fallbackMode = false;
      
    
      
      
      await this.sendInitializationCommands();
      
      return true;
    } catch (error) {
 
      return this.enableFallbackMode();
    }
  }

  
  enableFallbackMode() {

    this.fallbackMode = true;
    this.isConnected = true; 
    return true;
  }

  
  async sendInitializationCommands() {
    try {
      
      await this.sendCommand('\x1B\x40');
      
      
      await this.clearDisplay();
      
      
      await this.setDisplayMode(2);
      
      
      await this.controlStatusLights(0, 1, 0, 0);
      

    } catch (error) {

    }
  }

  
  async disconnect() {
    try {
      if (this.writer) {
        this.writer.releaseLock();
        this.writer = null;
      }
      if (this.reader) {
        this.reader.releaseLock();
        this.reader = null;
      }
      if (this.serialPort) {
        await this.serialPort.close();
        this.serialPort = null;
      }
      this.isConnected = false;
    } catch (error) {

    }
  }

  
  async sendCommand(command) {
    if (this.fallbackMode) {

      return true;
    }

    if (!this.isConnected || !this.writer) {
      return false;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(command);
      await this.writer.write(data);
      return true;
    } catch (error) {

      this.isConnected = false;
      return false;
    }
  }

  
  commandToString(command) {
    return Array.from(command).map(char => {
      const code = char.charCodeAt(0);
      if (code < 32) {
        switch (code) {
          case 2: return '[STX]';
          case 12: return '[CLR]';
          case 13: return '[CR]';
          case 27: return '[ESC]';
          default: return `[${code}]`;
        }
      }
      return char;
    }).join('');
  }

  
  async clearDisplay() {
    const command = '\x0C'; 
    const result = await this.sendCommand(command);
    
    if (this.fallbackMode) {

    }
    
    return result;
  }

  
  async clearAndResetDisplay() {
    try {
      
      await this.clearDisplay();
      
      
      await this.displayNumber(0.00);
      
      
      await this.setDisplayMode(2);
      
      
      await this.controlStatusLights(0, 1, 0, 0);
      
      if (this.fallbackMode) {

      }
      
      return true;
    } catch (error) {

      return false;
    }
  }

  
  async displayNumber(number) {
    if (!this.isConnected && !this.fallbackMode) {
      return false;
    }

    try {
      
      let numberStr = parseFloat(number).toFixed(2);
      
      
      if (numberStr.length > 15) {
        numberStr = '999999.99'; 
      }

      
      const command = '\x1B\x51\x41' + numberStr + '\x0D';
      const result = await this.sendCommand(command);
      
      if (this.fallbackMode) {

      }
      
      return result;
    } catch (error) {

      return false;
    }
  }

  
  async setDisplayMode(mode) {
    
    
    const command = '\x1B\x73' + String.fromCharCode(48 + mode);
    return await this.sendCommand(command);
  }

  
  async controlStatusLights(price, total, collect, change) {
    
    const d1 = price ? '1' : '0';
    const d2 = total ? '1' : '0';
    const d3 = collect ? '1' : '0';
    const d4 = change ? '1' : '0';
    const command = '\x02\x4C' + d1 + d2 + d3 + d4;
    return await this.sendCommand(command);
  }

  
  isReady() {
    return this.isConnected || this.fallbackMode;
  }

  
  isFallbackMode() {
    return this.fallbackMode;
  }

  
  async close() {
    await this.disconnect();
  }
}


const ledDisplayService = new LedDisplayService();
export default ledDisplayService;


































    

    









      


      
































      

      


      




















      


      


      


      


















































































      








      



      












































