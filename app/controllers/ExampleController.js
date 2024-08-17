const func = require("../func");

const { validationResult } = require("express-validator");

// Users show
exports.show = async function (req, res, next) {
  try {

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: true,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: "ดึงข้อมูลสำเร็จ",
    });
  } catch ({ name, message }) {
    res.status(500).json({
      status: false,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: message,
    });
  }
};

// Users create
exports.store = async function (req, res, next) {
  try {
    // let dataUse = Authen.decodeJwt(req.headers.authorization);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: true,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: "เพิ่มข้อมูลสำเร็จ",
    });
  } catch ({ name, message }) {
    res.status(500).json({
      status: false,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: message,
    });
  }
};

// Users update
exports.update = async function (req, res, next) {
  try {
    // let dataUse = Authen.decodeJwt(req.headers.authorization);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: true,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: "อัปเดทข้อมูลสำเร็จ",
    });
  } catch ({ name, message }) {
    res.status(500).json({
      status: false,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: message,
    });
  }
};

// Users delete
exports.destroy = async function (req, res, next) {
  try {
    // let dataUse = Authen.decodeJwt(req.headers.authorization);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: true,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: "ลบข้อมูลสำเร็จ",
    });
  } catch ({ name, message }) {
    res.status(500).json({
      status: false,
      datetime: func.getFormatDate('YYYY-MM-DD HH:mm:ss'),
      message: message,
    });
  }
};
