import HoiDong from '../models/HoiDong.js';

export const getHoiDongs = (req, res) => {
  HoiDong.find()
    .populate('phongHoc').populate('deTais').populate('canBoPhanBien')
    .populate('canBoHuongDan').populate('chuTich').populate('thuKy')
    .populate('uyVien')
    .then((hoiDongs) => {
      res.status(200).json(hoiDongs);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}

export const getHoiDongsWithQuery = (req, res) => {
  const { search, pagingOptions } = req.body;
  const searchRegex = new RegExp("^.*" + search + ".*");
  HoiDong.paginate({ name: { $regex: searchRegex, $options: "i" } }, {
    ...pagingOptions,
    populate: 'phongHoc deTais canBoPhanBien canBoHuongDan chuTich thuKy uyVien'
  }).then((hoiDongs) => {
      res.status(200).json(hoiDongs);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}

export const getHoiDongById = (req, res) => {
  HoiDong.findOne({ _id: req.params.id })
    .populate('phongHoc').populate('deTais').populate('canBoPhanBien')
    .populate('canBoHuongDan').populate('chuTich').populate('thuKy')
    .populate('uyVien')
    .then((hoiDong) => {
      res.status(201).json(hoiDong);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}

export const createHoiDong = (req, res) => {
  const hoiDong = req.body;
  const newHoiDong = new HoiDong(hoiDong);

  var errMsg = checkErrWhenUpserting(newHoiDong, true);

  if (errMsg != '') {
    res.status(400).json({ message: errMsg });
    return;
  }

  newHoiDong.save()
    .then(() => {
      res.status(201).json(newHoiDong);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export const updateHoiDongById = async (req, res) => {
  const hoiDong = req.body;
  const id = req.params.id;

  var errMsg = await checkErrWhenUpserting(hoiDong, false);

  if (errMsg != '') {
    res.status(400).json({ message: errMsg });
    return;
  }

  HoiDong.updateOne({ _id: id }, hoiDong)
    .then(() => {
      res.status(201).json(hoiDong);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}

export const deleteHoiDongById = (req, res) => {
  HoiDong.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(201).json(req.params.id);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}

const checkErrWhenUpserting = async (hoiDong, isNew) => {
  if (hoiDong.startAt >= hoiDong.endAt) {
    return "Th???i gian k???t th??c ph???i sau th???i gian b???t ?????u";
  }

  // console.log(hoiDong.startAt);
  // console.log(HoiDong.find({ 
  //   startAt: { $lt: hoiDong.startAt },
  //   endAt: { $gt: hoiDong.startAt }
  // }));
  if (hoiDong.chuTich == hoiDong.thuKy
    || hoiDong.chuTich == hoiDong.uyVien
    || hoiDong.thuKy == hoiDong.uyVien) {
    return "C??n b??? trong H???i ?????ng kh??ng ???????c tr??ng nhau";
  }

  var hdStartBefore = await HoiDong.find({ 
    startAt: { $lt: hoiDong.startAt },
    endAt: { $gt: hoiDong.startAt },
    phongHoc: hoiDong.phongHoc,
  });
  if (hdStartBefore.length > 0) {
    if (isNew || hdStartBefore.length > 1 || hdStartBefore[0]._id != hoiDong._id) {
      return "Tr??ng th???i gian v?? ?????a ??i???m v???i h???i ?????ng kh??c";
    }
  }
  var hdStartBetween = await HoiDong.find({
    startAt: { $gte: hoiDong.startAt, $lt: hoiDong.endAt },
    phongHoc: hoiDong.phongHoc,
  });
  if (hdStartBetween.length > 0) {
    if (isNew || hdStartBetween.length > 1 || hdStartBetween[0]._id != hoiDong._id) {
      return "Tr??ng th???i gian v?? ?????a ??i???m v???i h???i ?????ng kh??c";
    }
  }

  return '';
}