const fs = require('fs');
const path = require('path');
const moment = require("moment");
const crypto = require('crypto');
const UAParser = require('ua-parser-js');

require('dotenv').config();

// กำหนดคีย์และ IV ในรูปแบบ Buffer
// สร้างผ่าน generateKeyAndIV();
const key = Buffer.from(process.env.SECURITY_KEY, 'hex');
const iv = Buffer.from(process.env.SECURITY_IV, 'hex');

/**
 * แปลงค่า string 'True' เป็น boolean
 *
 * @param {boolean} _Boolean - ข้อความที่ต้องการแปลง เช่น 'true' เป็น true
 * @returns {boolean} ค่าที่ถูกแปลงเป็น boolean
 */
const isTrue = function isTrue(_Boolean) {
  return (_Boolean.toUpperCase() === 'TRUE' ? true : false);
};

/**
 * สร้างสตริงสุ่มตามความยาวที่ระบุ
 *
 * @param {number} _length - ความยาวของสตริงที่ต้องการสร้าง
 * @returns {string} สตริงสุ่มที่สร้างขึ้น
 */
const makeId = function makeId(_length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (var i = 0; i < _length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

/**
 * คืนค่าวันที่ในรูปแบบที่ระบุ
 *
 * @param {string} [_format="YYYYMMDDHHmmss"] - รูปแบบของวันที่ที่ต้องการ (ค่าเริ่มต้นคือ "YYYYMMDDHHmmss")
 * @returns {string} วันที่ในรูปแบบที่ระบุ
 */
const getFormatDate = function getFormatDate(_format = "YYYYMMDDHHmmss") {
  const now = new Date();
  const formattedDate = moment(now).format(_format);

  return formattedDate;
};

/**
 * แปลงวันที่และเวลาให้อยู่ในรูปแบบ ISO-8601
 *
 * @param {Date} _DateTime - วันที่และเวลาที่ต้องการแปลง
 * @returns {string} วันที่และเวลาในรูปแบบ ISO-8601
 */
const formatDateSave = function formatDateSave(_DateTime) {
  const formattedDateTime = _DateTime.toISOString(); // ใช้ฟังก์ชัน toISOString() เพื่อรับวันที่และเวลาในรูปแบบ ISO-8601

  return formattedDateTime;
};

/**
 * คืนค่าปีจากข้อมูลที่ระบุ
 *
 * @param {Date} _DateTime - วันที่และเวลาที่ต้องการดึงปี
 * @returns {string} ปีในรูปแบบ "YYYY"
 */
const getYearFromDate = function getYearFromDate(_DateTime) {
  const now = _DateTime;
  const dateStringWithTime = moment(now).format("YYYY");

  return dateStringWithTime;
};

/**
 * แปลง UNIX timestamp เป็นวันที่และเวลาที่อ่านได้ง่าย
 *
 * @param {number} _unixTimestamp - _unixTimestamp ที่ต้องการแปลง
 * @returns {string} เดือนในรูปแบบภาษาอังกฤษ
 *
 * @example
 * // ตัวอย่างการใช้งาน
 * timeConverter(new Date().getTime());
 * timeConverter(1688619561388);
 */
const timeConverter = function timeConverter(_unixTimestamp) {
  const date = new Date(_unixTimestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const time = day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;

  return time;
};

/**
 * แปลงสตริงวันที่เป็นรูปแบบวันที่ในภาษาไทย
 *
 * @param {string} _dateStr - สตริงวันที่ ที่ต้องการแปลง
 * @returns {string} รูปแบบเดือนในภาษาไทย
 */
const formatDateThai = function formatDateThai(_dateStr) {
  const date = new Date(_dateStr);

  const monthNamesThai = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = date.getDate();
  const month = monthNamesThai[date.getMonth()];
  const year = date.getFullYear();

  return day + " " + month + " " + year;
};

/**
 * แปลงสตริงวันที่เป็นรูปแบบวันที่และเวลาในภาษาไทย
 *
 * @param {string} _dateStr - สตริงวันที่ ที่ต้องการแปลง
 * @param {boolean} [_short=false] - กำหนดว่าจะแสดงชื่อเดือนแบบย่อหรือไม่ (ค่าเริ่มต้นคือแบบเต็ม)
 * @returns {string} เดือนในภาษาไทยแบบย่อ หรือแบบเต็ม
 */
const formatDateTimeThai = function formatDateTimeThai(_dateStr, _short = false) {
  const date = new Date(_dateStr);
  let monthNamesThai = undefined;

  if (_short == false) {
    monthNamesThai = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
  } else {
    monthNamesThai = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
  }

  const day = date.getDate();
  const month = monthNamesThai[date.getMonth()];
  const year = date.getFullYear();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return day + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
};

/**
 * สร้าง key และ iv สุ่มสำหรับการเข้ารหัส AES-256
 * @returns {object} - วัตถุที่ประกอบด้วย key และ iv
 */
const generateKeyAndIV = function generateKeyAndIV() {
  const key = crypto.randomBytes(32)?.toString('hex'); // สร้าง key 32 bytes = 256 bits
  const iv = crypto.randomBytes(16)?.toString('hex'); // สร้าง IV สุ่มขนาด 16 bytes = 128 bits

  return { key, iv };
}

/**
 * เข้ารหัสข้อความโดยใช้วิธีการ AES-256-CBC
 *
 * @param {string} _text - ข้อความที่ต้องการเข้ารหัส
 * @returns {string} ข้อความที่เข้ารหัสแล้วในรูปแบบ hex
 */
const encryptText = function encryptText(_encryptText) {
  // const key = process.env.MY_SECRET_KEY;

  // Check if _encryptText is undefined or null
  if (_encryptText === undefined || _encryptText === null) {
    console.error('Encrypted text is undefined or null');
    return undefined;
  }

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(_encryptText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // คืนค่า IV พร้อมกับข้อความที่ถูกเข้ารหัส
  return encrypted;
}

/**
 * ถอดรหัสข้อความที่ถูกเข้ารหัสด้วยวิธีการ AES-256-CBC
 *
 * @param {string} _encryptedText - ข้อความที่เข้ารหัสแล้วในรูปแบบ hex
 * @returns {string} ข้อความที่ถูกถอดรหัส
 */
const decryptText = function decryptText(_encryptedText) {
  // Check if _encryptedText is undefined or null
  if (_encryptedText === undefined || _encryptedText === null) {
    console.error('Encrypted text is undefined or null');
    return undefined;
  }

  // สร้าง Decipher ด้วย key และ IV
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  // ลองถอดรหัสข้อความ
  try {
    let decrypted = decipher.update(_encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error decrypting text:', error);

    return undefined;
  }
}

/**
 * Generates a SHA-256 hash of the input message.
 *
 * @param {string} message - The message to hash.
 * @returns {string} The SHA-256 hash in hexadecimal format.
 */
const generateSHA256Hash = function generateSHA256Hash(message, _length = 64) {
  // Create a SHA-256 hash of the message
  return crypto.createHash('sha256').update(message).digest('hex').substring(0, _length);
}

/**
 * ดึงข้อมูลเกี่ยวกับเครื่องผู้ใช้จากข้อมูล User-Agent ที่กำหนด
 *
 * @param {string} _dataAgent - ข้อมูล User-Agent ของเครื่องผู้ใช้
 * @returns {object} ข้อมูลเกี่ยวกับเครื่องผู้ใช้ที่ได้รับการวิเคราะห์
 */
const getAgentClient = function getAgentClient(_dataAgent) {

  const uaResult = new UAParser().setUA(_dataAgent)?.getResult();

  const browser = uaResult.browser.name.toLowerCase();
  const browserVersion = uaResult.browser.version;

  const device = uaResult.os.name.toLowerCase();
  const deviceVersion = uaResult.os.version;

  const mobileDeviceKeywords = ['android', 'avantgo', 'blackberry', 'bolt', 'boost', 'cricket', 'docomo', 'fone', 'hiptop', 'mini', 'mobi', 'palm', 'phone', 'pie', 'tablet', 'up.browser', 'up.link', 'webos', 'wos'];
  const regex = new RegExp(`(${mobileDeviceKeywords.join('|')})`, 'i');

  return {
    browser: browser,
    browserVersion: browserVersion,
    device: device,
    deviceVersion: deviceVersion,
    platform: regex.test(_dataAgent) ? 'mobile' : 'desktop',
  };
}


/**
 * อัปโหลดไฟล์และคืนค่าข้อมูลไฟล์ที่อัปโหลด
 * 
 * @param {Object} req - คำขอจาก client ที่มีข้อมูลไฟล์
 * @param {string} _tagFilename - คีย์หรือแท็กของไฟล์ในอ็อบเจ็กต์คำขอ
 * @param {string} _keyUpload - รหัสผู้ใช้หรือคีย์อ้างอิงผู้ที่ทำการอัปโหลด
 * @param {string[]} validMimeTypes - ชนิดของไฟล์ที่อนุญาตให้อัปโหลด
 * @param {string} _filePath - ที่อยู่เส้นทางที่ต้องการบันทึกไฟล์ (ค่าเริ่มต้นคือ Folder public)
 * @returns {Promise<Object>} ข้อมูลของไฟล์ที่อัปโหลด
 * @throws {Error} ถ้าไฟล์ไม่พบหรือชนิดของไฟล์ไม่ถูกต้อง
 */
const uploadFile = function uploadFile(req, _tagFilename, _keyUpload, _validMimeTypes, _filePath = '/') {

  if (!req.files) {
    return {
      status: false,
      message: "File Not Found",
    };
  }

  const uploadedFile = req.files[_tagFilename];
  const { size, encoding, mimetype } = uploadedFile;

  // Validate type file
  if (!_validMimeTypes.includes(mimetype)) {
    throw new Error("Invalid file type");
  }

  const originalname = uploadedFile.name;
  const getTypeImage = originalname.split(".");
  const filename = `${_keyUpload}_${this.makeId(5).toUpperCase()}.${getTypeImage[getTypeImage.length - 1]}`;
  const pathfile = `/${_filePath}${filename}`;
  const uploadpath = path.join('public', _filePath, filename);

  uploadedFile.mv(uploadpath);

  return {
    status: true,
    message: "Upload File Success",
    fieldname: "file",
    originalname,
    encoding,
    mimetype,
    filename,
    destination: `/${_filePath}`,
    path: pathfile,
    size,
  };
}

/**
 * Securely deletes a file by overwriting its content multiple times with different patterns before deleting it.
 * ลบไฟล์โดยเขียนข้อมูลทับก่อนลบ ให้กูคืนได้ยาก
 * 
 * @param {string} filePath - The path to the file that needs to be securely deleted.
 * @returns {Promise<void>}
 */
const deleteFile = function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const length = stats.size;

      // Overwrite the file multiple times with different patterns
      for (let i = 0; i < 3; i++) {
        const randomData = crypto.randomBytes(length);
        fs.writeFileSync(filePath, randomData);
      }

      // Overwrite with zeroes
      const zeroData = Buffer.alloc(length, 0);
      fs.writeFileSync(filePath, zeroData);

      // Overwrite with ones
      const oneData = Buffer.alloc(length, 255);
      fs.writeFileSync(filePath, oneData);

      // Delete the file
      fs.unlinkSync(filePath);
      console.log(`File deleted successfully and permanently.`);
    } else {
      console.log(`The file ${filePath} does not exist.`);
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
}

/**
 * Creates a file and writes data to it.
 * 
 * @param {string} filePath - The path to the file to be created.
 * @param {string|Buffer} data - The data to write to the file.
 * @returns {Promise<void>}
 */
const createAndWriteFile = function createAndWriteFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(`An error occurred: ${err}`);
      } else {
        console.log(`File created and data written successfully.`);
        resolve();
      }
    });
  });
}

module.exports = {
  isTrue,
  makeId,
  getFormatDate,
  formatDateSave,
  getYearFromDate,
  timeConverter,
  formatDateThai,
  formatDateTimeThai,
  generateKeyAndIV,
  encryptText,
  decryptText,
  generateSHA256Hash,
  getAgentClient,
  uploadFile,
  deleteFile,
  createAndWriteFile,
};
