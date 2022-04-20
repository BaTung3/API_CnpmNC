var express = require("express");
var router = express.Router();
var dbcon = require("./connection_config");
const http = require("http");

// function GetPoint(id) {
//   http.get("G01", (req, res) => {
//     dbcon.query(
//       "update cnpm.ROOMTYPE set POINT_HIEN_THI ='" +
//         res.params.Point +
//         "where ID_ROOM='" +
//         id +
//         "'",
//       function (err, result, filesd) {
//         if (err) throw console.log(err);
//         res.json(result);
//       }
//     );
//   });
// }

// UPDATE Hoa Don Status
router.patch("/UpHDStatus/", (req, res) => {
  console.log("Update Hoa Don'" + req.headers.id + "'");
  dbcon.query(
    "update cnpm.HOA_DON set HD_STATUS = 1 where ID_HOA_DON ='" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// HUY DAT PHONG

router.delete("/DeleteHD/", (req, res) => {
  console.log(
    "DELETE FROM cnpm.HOA_DON where ID_HOA_DON = '" + req.headers.id + "'"
  );
  dbcon.query(
    "DELETE FROM Hoa Don where ID_HOA_DON = '" + req.headers.id + "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// LICH SU GIAO DICH -Để hiển thị  trong lịch sử giao dịch ,-Để thống kê donh thu lợi nhuận
router.get("/GetUserTransact/", (req, res) => {
  console.log("USER = '" + req.headers.id + "'");
  dbcon.query(
    "SELECT cnpm.HOA_DON.ID_HOA_DON , MA_DAT_CHO , PAY_TIME ,FINAL_PRICE,HD_STATUS,NGAY_NHAN_PHONG cnpm.HOME.TEN FROM cnpm.HOA_DON, cnpm.HOME, cnpm.ROOMTYPE, cnpm.CHI_TIET_LIEN_HE where cnpm.HOA_DON.ID_ROOMTYPE = cnpm.ROOMTYPE.ID_ROOMTYPE AND cnpm.ROOMTYPE.ID_HOME = cnpm.HOME.ID_HOME and cnpm.HOA_DON.ID_HOA_DON = cnpm.CHI_TIET_LIEN_HE.ID_HOA_DON AND cnpm.CHI_TIET_LIEN_HE.ID_USER = '" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// CHI TIET DAT PHONG -Để hiển thị sau khi User bấm xem trong lịch sử đặt phòng
router.get("/GetUserBookDetail/", (req, res) => {
  console.log(
    "USER = '" + req.headers.id + "id_HD = '" + req.headers.idHD + "'"
  );
  dbcon.query(
    "SELECT *  FROM cnpm.HOA_DON,cnpm.ROOMTYPE,cnpm.HOME,cnpm.LOAI_THANH_TOAN, cnpm.CHI_TIET_LIEN_HE where cnpm.HOA_DON.ID_ROOMTYPE = cnpm.ROOMTYPE.ID_ROOMTYPE AND cnpm.ROOMTYPE.ID_HOME = cnpm.HOME.ID_HOME and cnpm.HOA_DON.ID_HOA_DON = cnpm.CHI_TIET_LIEN_HE.ID_HOA_DON AND cnpm.CHI_TIET_LIEN_HE.ID_LOAI_PAYMENT = cnpm.loai_thanh_toan.ID_LOAI_PAYMENT AND cnpm.CHI_TIET_LIEN_HE.ID_USER = '" +
      req.headers.id +
      "AND cnpm.HOA_DON.ID_HOA_DON = " +
      req.headers.idHD +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// Lấy điểm sau khi thanh toán
router.get("/GetUserPoint/", (req, res) => {
  console.log(
    "USER = '" + req.headers.id + "id_Hoa_Don = '" + req.headers.idHD + "'"
  );
  dbcon.query(
    //"SELECT cnpm.HOA_DON.ID_HOA_DON, (FINAL_PRICE/cong thuc) as Point , HD_STATUS FROM cnpm.HOA_DON,cnpm.CHI_TIET_LIEN_HE where cnpm.HOA_DON.ID_HOA_DON = cnpm.CHI_TIET_LIEN_HE.ID_HOA_DON AND cnpm.HOA_DON.ID_HOA_DON =  '" +

    "SELECT cnpm.HOA_DON.ID_HOA_DON, FINAL_PRICE , HD_STATUS FROM cnpm.HOA_DON,cnpm.CHI_TIET_LIEN_HE where cnpm.HOA_DON.ID_HOA_DON = cnpm.CHI_TIET_LIEN_HE.ID_HOA_DON AND cnpm.HOA_DON.ID_HOA_DON =  '" +
      req.headers.idHD +
      "AND cnpm.CHI_TIET_LIEN_HE.ID_USER='" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// Lấy thông tin Home để tìm kiếm ở Combo
router.get("/GetComboHomeSearch/", (req, res) => {
  console.log(
    "USER = '" +
      req.headers.id +
      "DiaDiem '" +
      req.headers.diaDiem +
      "NgayNhan '" +
      req.headers.ngayNhan +
      "NgayTra '" +
      req.headers.ngayTra +
      "SoKhach '" +
      req.headers.soKhach +
      "SoPhong '" +
      req.headers.soPhong +
      "'"
  );
  dbcon.query(
    "SELECT cnpm.HOME.ID_HOME cnpm.HOME.TEN, cnpm.DIA_DIEM_SEARCH.PHUONG_QUAN,cnpm.DIA_DIEM_SEARCH.HUYEN,cnpm.DIA_DIEM_SEARCH.THANH_PHO, cnpm.ROOMTYPE.PRICE_PHONG from cnpm.HOME, cnpm.DIA_DIEM_SEARCH , cnpm.ROOMTYPE where cnpm.ROOMTYPE.ID_HOME = cnpm.HOME.ID_HOME = AND cnpm.HOME.ID_DIA_DIEM = cnpm.DIA_DIEM_SEARCH.ID_DIA_DIEM AND cnpm.ROOMTYPE.SO_DEM =  (DATEDIFF('" +
      req.headers.ngayTra +
      ",'" +
      req.headers.ngayNhan +
      ")) and cnpm.ROOMTYPE.SO_NGUOI = '" +
      req.headers.soKhach +
      "AND cnpm.ROOMTYPE.SO_PHONG_TRONG >='" +
      req.headers.soPhong +
      "and cnpm.DIA_DIEM_SEARCH.PHUONG_QUAN LIKE %'" +
      req.headers.diaDiem +
      "%'" +
      " OR cnpm.DIA_DIEM_SEARCH.HUYEN LIKE %'" +
      req.headers.diaDiem +
      "%'" +
      " OR cnpm.DIA_DIEM_SEARCH.THANH_PHO LIKE %'" +
      req.headers.diaDiem +
      "%'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//Lấy thông tin Home để tìm kiếm ở Đưa đón sân bay
router.get("/GetTransferHomeSearch/", (req, res) => {
  console.log(
    "User = '" +
      req.headers.id +
      "DiaDiem '" +
      req.headers.diaDiem +
      "HomeName '" +
      req.headers.homeName +
      "'"
  );
  dbcon.query(
    "SELECT cnpm.HOME.TEN , cnpm.HOME.DIA_CHI , cnpm.HOME.TOA_DO_X ,cnpm.HOME.TOA_DO_Y from cnpm.HOME, cnpm.DIA_DIEM_SEARCH Where cnpm.HOME.ID_DIA_DIEM = cnpm.DIA_DIEM_SEARCH.ID_DIA_DIEM and cnpm.HOME.TEN = '" +
      req.headers.homeName +
      "and cnpm.DIA_DIEM_SEARCH.PHUONG_QUAN LIKE %'" +
      req.headers.diaDiem +
      "%'" +
      " OR cnpm.DIA_DIEM_SEARCH.HUYEN LIKE %'" +
      req.headers.diaDiem +
      "%'" +
      " OR cnpm.DIA_DIEM_SEARCH.THANH_PHO LIKE %'" +
      req.headers.diaDiem +
      "%'" +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// G01 nhập thông tin mã Voucher , Stripe , Gift sau khi khách đã thanh toán
router.get("/PatchDiscountId/", (req, res) => {
  console.log(
    "id_hoa_don = '" +
      req.headers.id +
      "id_Vouhcer = '" +
      req.headers.idVC +
      "id_Gift = '" +
      req.headers.idGF +
      "id_Stripe = '" +
      req.headers.idSTRP +
      "'"
  );
  dbcon.query(
    "update cnpm.HOA_DON set cnpm.HOA_DON.ID_VOUCHER='" +
      req.headers.idVC +
      ", cnpm.HOA_DON.ID_GIFT='" +
      req.headers.idGF +
      ", cnpm.HOA_DON.ID_STRIPE='" +
      req.headers.idSTRP +
      "Where cnpm.HOA_DON.ID_HOA_DON ='" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//G01 lấy thông tin liên hệ mà User đã nhập /tạo để đưa vào Passenger Quick Pick
router.get("/GetUserQuickPick/", (req, res) => {
  console.log("User = '" + req.headers.id + "'");
  dbcon.query(
    "SELECT cnpm.CHI_TIET_LIEN_HE.FULL_NAME,cnpm.CHI_TIET_LIEN_HE.EMAIL,cnpm.CHI_TIET_LIEN_HE.MOBILE_PHONE,cnpm.CHI_TIET_LIEN_HE.NAME_KHACH  FROM cnpm.CHI_TIET_LIEN_HE WHERE cnpm.CHI_TIET_LIEN_HE.ID_USER = '" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//G01 lấy thông tin liên hệ mà User đã nhập /tạo để đưa vào Passenger Quick Pick
router.put("/PutUserQuickPick/", (req, res) => {
  console.log("User = '" + req.headers.id + "'");
  dbcon.query(
    "update cnpm.CHI_TIET_LIEN_HE set cnpm.CHI_TIET_LIEN_HE.FULL_NAME  = '" +
      req.headers.name +
      ",cnpm.CHI_TIET_LIEN_HE.EMAIL = '" +
      req.headers.email +
      ",cnpm.CHI_TIET_LIEN_HE.MOBILE_PHONE'" +
      req.headers.email +
      ",cnpm.CHI_TIET_LIEN_HE.NAME_KHACH'" +
      req.headers.nameKhach +
      " Where cnpm.CHI_TIET_LIEN_HE.ID_USER =  '" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//Lấy thông tin khách từ G01 khi khách đã đăng nhập và bấm nút đặt phòng
router.put("/PostUserInFo/", (req, res) => {
  console.log(
    "User = '" + req.headers.id + "id_Hoa_Don'" + req.headers.idHD + "'"
  );
  dbcon.query(
    "update cnpm.CHI_TIET_LIEN_HE set cnpm.CHI_TIET_LIEN_HE.FULL_NAME  = '" +
      req.headers.name +
      ",cnpm.CHI_TIET_LIEN_HE.ID_HOA_DON = '" +
      req.headers.idHD +
      ",cnpm.CHI_TIET_LIEN_HE.EMAIL = '" +
      req.headers.email +
      ",cnpm.CHI_TIET_LIEN_HE.MOBILE_PHONE'" +
      req.headers.email +
      ",cnpm.CHI_TIET_LIEN_HE.NAME_KHACH'" +
      req.headers.nameKhach +
      " Where cnpm.CHI_TIET_LIEN_HE.ID_USER =  '" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//Đẩy khung giá các loại phòngkèm hoa hồng các sản phẩm dịch vụ
router.get("/GetBaremServicePrice/", (req, res) => {
  // console.log("Partner = '" + req.headers.id + "'");
  dbcon.query(
    "SELECT MAX(cnpm.ROOMTYPE.PRICE_PHONG) AS MaxPrice,MIN(cnpm.ROOMTYPE.PRICE_PHONG) AS MINPrice FROM cnpm.ROOMTYPE '" +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//Local :Lấy danh sách chi tiết liên hệ khách đã đặt phòng tương ứng thành công -NGUYEN
router.get("/GetBookUserByRoom/", (req, res) => {
  console.log("Room = '" + req.headers.id + "'");
  dbcon.query(
    "SELECT *  FROM  '" +
      req.headers.id +
      "AND cnpm.HOA_DON.ID_HOA_DON = " +
      req.headers.idHD +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//=======================================================================================================
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Home

router.get("/home", (req, res, next) => {
  console.log("nect");

  dbcon.query("select * from cnpm.HOME", function (err, result, filesd) {
    if (err) throw console.log(err);
    res.json(result);
  });
});

router.get("/home/", (req, res) => {
  console.log("select * from cnpm.HOME where ID_HOME='" + req.headers.id + "'");
  dbcon.query(
    "select * from cnpm.HOME where ID_HOME='" + req.headers.id + "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

router.post("/home-add", (req, res) => {
  dbcon.query(
    "INSERT INTO cnpm.HOME(ID_HOME, TEN, DIA_CHI, DIEN_TICH, SO_TANG)  VALUES ('home09', '" +
      req.headers.name +
      "', '" +
      req.headers.adress +
      "'," +
      req.headers.dientich +
      "," +
      req.headers.sotang +
      " );",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});
router.post("/home-update/", (req, res) => {
  dbcon.query(
    "update cnpm.HOME set TEN='" +
      req.headers.name +
      "',DIA_CHI='" +
      req.headers.adress +
      "',DIEN_TICH='" +
      req.headers.dientich +
      "',SO_TANG='" +
      req.headers.sotang +
      "' where ID_HOME='" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});
router.delete("/home/", (req, res) => {
  console.log("update cnpm.HOME where ID_HOME='" + req.headers.id + "'");
  dbcon.query(
    "update cnpm.HOME set status=false where ID_HOME='" + req.headers.id + "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

//sophong

router.get("/sophong/", (req, res) => {
  console.log("connected");
  dbcon.query(
    "SELECT * FROM cnpm.ROOMTYPE where ID_HOME='" + req.headers.id + "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/sophong-add", (req, res) => {
  const Diem = res.headers.price; // / cong thuc

  dbcon.query(
    "INSERT INTO cnpm.ROOMTYPE(ID_ROOMTYPE,ID_HOME, TEN_PHONG, LOAI_PHONG, LOAI_GIUONG, SO_NGUOI,AN_SANG , SO_PHONG_TRONG, PRICE_PHONG )  VALUES ('" +
      req.headers.idphong +
      "', '" +
      req.headers.idhome +
      "', '" +
      req.headers.name +
      "', '" +
      req.headers.loaiphong +
      "','" +
      req.headers.phong +
      "'," +
      req.headers.songuoi +
      ", " +
      req.headers.ansang +
      "," +
      req.headers.sophong +
      "," +
      req.headers.price +
      ");",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );

  // GetPoint(req.body.idphong);
  // http.get("G01", (req, res) => {
  //   dbcon.query("update cnpm.ROOMTYPE set POINT_HIEN_THI ='" + res.params.Point + "where ID_ROOM='" + req.params.id + "'", function (err, result, filesd) {
  //     if (err) throw console.log(err);
  //     res.json(result);
  //   });

  // });
});
router.post("/sophong-update/", (req, res) => {
  const Diem = res.headers.price; // / cong thuc
  dbcon.query(
    "update cnpm.ROOMTYPE set ID_ROOMTYPE='" +
      req.headers.id_phong +
      "',TEN_PHONG='" +
      req.headers.name +
      "'LOAI_PHONG='" +
      req.headers.loaiphong +
      "'LOAI_GIUONG='" +
      req.headers.loaigiuong +
      "',SO_NGUOI='" +
      req.headers.songuoi +
      "',AN_SANG='" +
      req.headers.ansang +
      "',SO_PHONG_TRONG='" +
      req.headers.sophong +
      "',PRICE_PHONG='" +
      req.headers.price +
      "' where ID_HOME='" +
      req.headers.id +
      "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
  // GetPoint(req.body.idphong);
});
// router.delete("/sophong/:id", (req, res) => {
//   console.log("update cnpm.home where id_home='" + req.params.id + "'");
//   dbcon.query(
//     "update cnpm.home set status=false where id_home='" + req.params.id + "'",
//     function (err, result, filesd) {
//       if (err) throw console.log(err);
//       res.json(result);
//     }
//   );
// });

//contact

router.get("/contact/", (req, res) => {
  console.log("select * from cnpm.HOME where ID_HOME='" + req.headers.id + "'");
  dbcon.query(
    "select * from cnpm.contact where ID_HOME='" + req.headers.id + "'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

router.post("/contact-add", (req, res) => {
  dbcon.query(
    "INSERT INTO cnpm.CONTACT(ID_HOME, FULL_NAME, EMAIL, MOLIBE_PHONE, ONLINE_24H)  VALUES ('" +
      req.headers.idhome +
      "', '" +
      req.headers.name +
      "', '" +
      req.headers.email +
      "'," +
      req.headers.phonenumber +
      "," +
      req.headers.staus24h +
      " );",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// --------------------------------------------------------------------------------------------------------------------------------
// KHONG XAI NUA
// //rule

// router.get("/rules/:id", (req, res) => {
//   dbcon.query(
//     "select * from cnpm.QUY_DINH_HOME where ID_HOME='" + req.params.id + "'",
//     function (err, result, filesd) {
//       if (err) throw console.log(err);
//       res.json(result);
//     }
//   );
// });
// router.post("/rules-add", (req, res) => {
//   dbcon.query(
//     "INSERT INTO cnpm.QUY_DINH_HOME(ID_HOME, QUY_DINH)  VALUES ('" +
//       req.body.idhome +
//       "', '" +
//       req.body.quydinh +
//       "' );",
//     function (err, result, filesd) {
//       if (err) throw console.log(err);
//       res.json(result);
//     }
//   );
// });
// router.delete("/rules/:id", (req, res) => {
//   console.log(
//     "update cnpm.QUY_DINH_HOME where ID_HOME='" + req.params.id + "'"
//   );
//   dbcon.query(
//     "update cnpm.HOME set status=false where ID_HOME='" + req.params.id + "'",
//     function (err, result, filesd) {
//       if (err) throw console.log(err);
//       res.json(result);
//     }
//   );
// });
// ----------------------------------------------------------------------------------------------------------

//seArch

router.get("/search/", (req, res) => {
  dbcon.query(
    "select * from cnpm.HOME where TEN like'" + req.headers.name + "%'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// Search V2
router.get("/searchv2/", (req, res) => {
  console.log(
    "USER = '" +
      req.headers.id +
      "DiaDiem '" +
      req.headers.diaDiem +
      "NgayNhan '" +
      req.headers.ngayNhan +
      "NgayTra '" +
      req.headers.ngayTra +
      "SoKhach '" +
      req.headers.soKhach +
      "SoPhong '" +
      req.headers.soPhong +
      "'"
  );
  dbcon.query(
    "SELECT cnpm.HOME.ID_HOME cnpm.HOME.TEN, cnpm.DIA_DIEM_SEARCH.PHUONG_QUAN,cnpm.DIA_DIEM_SEARCH.HUYEN,cnpm.DIA_DIEM_SEARCH.THANH_PHO, cnpm.ROOMTYPE.PRICE_PHONG , cnpm.ROOMTYPE.PRICE_PHONG.POINT_HIEN_THI from cnpm.HOME, cnpm.DIA_DIEM_SEARCH , cnpm.ROOMTYPE where cnpm.ROOMTYPE.ID_HOME = cnpm.HOME.ID_HOME = AND cnpm.HOME.ID_DIA_DIEM = cnpm.DIA_DIEM_SEARCH.ID_DIA_DIEM AND cnpm.ROOMTYPE.SO_DEM =  '" +
      req.headers.soDem +
      " and cnpm.ROOMTYPE.SO_NGUOI = '" +
      req.headers.soKhach +
      "AND cnpm.ROOMTYPE.SO_PHONG_TRONG >='" +
      req.headers.soPhong +
      "and cnpm.DIA_DIEM_SEARCH.PHUONG_QUAN LIKE %'" +
      req.headers.diaDiem +
      "%'" +
      " OR cnpm.DIA_DIEM_SEARCH.HUYEN LIKE %'" +
      req.headers.diaDiem +
      "%'" +
      " OR cnpm.DIA_DIEM_SEARCH.THANH_PHO LIKE %'" +
      req.headers.diaDiem +
      "%'",
    function (err, result, filesd) {
      if (err) throw console.log(err);
      res.json(result);
    }
  );
});

// ------------------------------------------------------------------------------------------------------
// //xem danh gia

// router.get("/evaluate/:id", (req, res) => {
//   dbcon.query(
//     "select * from cnpm.danh_gia where id_home='" + req.params.id + "'",
//     function (err, result, filesd) {
//       if (err) throw console.log(err);
//       res.json(result);
//     }
//   );
// });

// router.post("/evaluate/:id", (req, res) => {
//   dbcon.query(
//     "INSERT INTO DANH_GIA VALUES ('" +
//       req.body.id_khachhang +
//       "'," +
//       req.body.diem +
//       ", '" +
//       req.body.binhluan +
//       "','dg06','" +
//       req.body.id_home +
//       "');",
//     function (err, result, filesd) {
//       if (err) throw console.log(err);
//       res.json(result);
//     }
//   );
// });
// --------------------------------------------------------------------------------------------------
router.get("/student", (req, res) => {
  dbcon.query("select * from cnpm.student", function (err, result, filesd) {
    if (err) throw console.log(err);
    res.json(result);
  });
});

//Lich su dat
module.exports = router;
