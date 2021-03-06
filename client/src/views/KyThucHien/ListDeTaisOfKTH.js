import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import XLSX from 'sheetjs-style';
import { useHistory, useParams } from "react-router-dom";
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import { getDeTaisByKTHId, getDeTaisWithHoiDong } from '../../api/deTaiAPI';
import * as Utils from '../../utils/utils';
import * as Constants from '../../constants/constants';

import PageTitle from "../../components/common/PageTitle";
import ActionButtons from '../../components/common/ActionButtons';
import DeTaiInfoCard from '../../components/common/InfoCard/DeTaiInfoCard';
import CreateOrEditKyThucHienModal from './CreateOrEditKTHModal';
import LyrTable from '../../components/common/LyrTable/LyrTable';
import './styles.css';

const ListKyThucHien = () => {
  const [ kyThucHien, setKyThucHien ] = useState(Utils.getNewKyThucHien);
  const [ deTais, setDeTais ] = useState([]);
  const [ deTaisWHD, setDeTaisWHD ] = useState([]);

  let history = useHistory();
  let { id } = useParams();

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (deTais.length > 0) {
      setKyThucHien(deTais[0].kyThucHien);
    }
  }, [deTais]);

  const getList = () => {
    getDeTaisByKTHId(id)
      .then((res) => {
        console.log(res);
        setDeTais(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        Utils.showErrorToast(Utils.getFormattedErrMsg(err));
      });
    getDeTaisWithHoiDong()
      .then((res) => {
        console.log(res);
        setDeTaisWHD(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        Utils.showErrorToast(Utils.getFormattedErrMsg(err));
      });
  }

  const onDeTaiClick = (id) => {
    history.push(`/de-tai/detail/${id}`);
  }

  const onExportClick = () => {
    var exportData = {};
    exportData.cols = [
      { name:"STT", key: 0 },
      { name:"MSSV", key: 1 },
      { name:"HỌ TÊN", key: 2 },
      { name:"TÊN ĐỀ TÀI TIẾNG VIỆT", key: 3 },
      { name:"TÊN ĐỀ TÀI TIẾNG ANH", key: 4 },
      { name:"TÊN CB HƯỚNG DẪN", key: 5 },
      { name:"GHI CHÚ", key: 6 },
    ];
    var data = [];
    var merge = [];
    data.push([ "STT", "MSSV", "HỌ TÊN", "TÊN ĐỀ TÀI TIẾNG VIỆT", "TÊN ĐỀ TÀI TIẾNG ANH", "TÊN CB HƯỚNG DẪN", "GHI CHÚ" ]);
    var stt = 0;
    deTais.forEach((deTai) => {
      if (deTai.trangThaiDuyet != Constants.DE_TAI_APPROVE_STATUS_APPROVED
          || !deTai.sinhVienThucHien || deTai.sinhVienThucHien.length < 1) {
        return;
      }
      for (var i = 0; i < deTai.sinhVienThucHien.length; i++) {
        var sinhVien = deTai.sinhVienThucHien[i];
        if (i == 0) {
          data.push([ (stt + 1) + '', sinhVien.maSV, sinhVien.name, deTai.tenDeTai, deTai.englishName || '', deTai.giangVien.name, '' ]);
          stt++;
        }
        else {
          data.push([ 'merge_up', sinhVien.maSV, sinhVien.name, 'merge_up', 'merge_up', 'merge_up', 'merge_up' ]);
          merge = [
            ...merge,
            { s: { r: data.length - 2, c: 0}, e: { r: data.length - 1, c: 0 } },
            { s: { r: data.length - 2, c: 3}, e: { r: data.length - 1, c: 3 } },
            { s: { r: data.length - 2, c: 4}, e: { r: data.length - 1, c: 4 } },
            { s: { r: data.length - 2, c: 5}, e: { r: data.length - 1, c: 5 } },
            { s: { r: data.length - 2, c: 6}, e: { r: data.length - 1, c: 6 } },
          ]
        }
      }
    });
    exportData.data = data;
    console.log(exportData);

    /* convert state.data to worksheet */
    const ws = XLSX.utils.aoa_to_sheet(exportData.data);
    ws["!merges"] = merge;

    var wscols = [
      {wch:5},
      {wch:10},
      {wch:15},
      {wch:30},
      {wch:30},
      {wch:15},
      {wch:20},
    ];
    ws['!cols'] = wscols;

    for (var i = 0; i < exportData.data.length; i++) {
      for (var j = 0; j < exportData.cols.length; j++) {
        ws[XLSX.utils.encode_cell({ c: j, r: i })].s = {
          alignment: {
            vertical: "center"
          },
          border: {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            },
          }
        }
        if (i == 0 || j == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.alignment.horizontal = "center";
        }
        if (i == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.font = {
            bold: true,
          };
        }

      }
    };

    console.log(ws);
    /* build a workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachDeTai");
    var defaultCellStyle = { font: { name: "Times New Roman ", sz: 13}};

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "danh_sach_de_tai.xlsx", { defaultCellStyle: defaultCellStyle });
  }

  const onDSBVExportClick = () => {
    var exportData = {};
    exportData.cols = [
      { name:"STT", key: 0 },
      { name:"MSSV", key: 1 },
      { name:"HỌ TÊN", key: 2 },
      { name:"TÊN ĐỀ TÀI TIẾNG VIỆT", key: 3 },
      { name:"TÊN ĐỀ TÀI TIẾNG ANH", key: 4 },
      { name:"TÊN CB HƯỚNG DẪN", key: 5 },
      { name:"CHỮ KÝ CBHD", key: 6 },
      { name:"GHI CHÚ", key: 7 },
    ];
    var data = [];
    var merge = [];
    data.push([ "STT", "MSSV", "HỌ TÊN", "TÊN ĐỀ TÀI TIẾNG VIỆT", "TÊN ĐỀ TÀI TIẾNG ANH", "TÊN CB HƯỚNG DẪN", "CHỮ KÝ CBHD", "GHI CHÚ" ]);
    var stt = 0;
    deTais.forEach((deTai) => {
      if (deTai.trangThaiDuyet != Constants.DE_TAI_APPROVE_STATUS_APPROVED
          || !deTai.sinhVienThucHien || deTai.sinhVienThucHien.length < 1) {
        return;
      }
      for (var i = 0; i < deTai.sinhVienThucHien.length; i++) {
        var sinhVien = deTai.sinhVienThucHien[i];
        if (i == 0) {
          data.push([ (stt + 1) + '', sinhVien.maSV, sinhVien.name, deTai.tenDeTai, deTai.englishName || '', deTai.giangVien.name, '', '' ]);
          stt++;
        }
        else {
          data.push([ 'merge_up', sinhVien.maSV, sinhVien.name, 'merge_up', 'merge_up', 'merge_up', 'merge_up', 'merge_up' ]);
          merge = [
            ...merge,
            { s: { r: data.length - 2, c: 0}, e: { r: data.length - 1, c: 0 } },
            { s: { r: data.length - 2, c: 3}, e: { r: data.length - 1, c: 3 } },
            { s: { r: data.length - 2, c: 4}, e: { r: data.length - 1, c: 4 } },
            { s: { r: data.length - 2, c: 5}, e: { r: data.length - 1, c: 5 } },
            { s: { r: data.length - 2, c: 6}, e: { r: data.length - 1, c: 6 } },
            { s: { r: data.length - 2, c: 7}, e: { r: data.length - 1, c: 7 } },
          ]
        }
      }
    });
    exportData.data = data;
    console.log(exportData);

    /* convert state.data to worksheet */
    const ws = XLSX.utils.aoa_to_sheet(exportData.data);
    ws["!merges"] = merge;

    var wscols = [
      {wch:5},
      {wch:10},
      {wch:15},
      {wch:30},
      {wch:30},
      {wch:15},
      {wch:15},
      {wch:20},
    ];
    ws['!cols'] = wscols;

    for (var i = 0; i < exportData.data.length; i++) {
      for (var j = 0; j < exportData.cols.length; j++) {
        ws[XLSX.utils.encode_cell({ c: j, r: i })].s = {
          alignment: {
            vertical: "center"
          },
          border: {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            },
          }
        }
        if (i == 0 || j == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.alignment.horizontal = "center";
        }
        if (i == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.font = {
            bold: true,
          };
        }

      }
    };

    console.log(ws);
    /* build a workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachBaoVe");
    var defaultCellStyle = { font: { name: "Times New Roman ", sz: 13}};

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "danh_sach_bao_ve.xlsx", { defaultCellStyle: defaultCellStyle });
  }

  const onBangDiemExportClick = () => {
    var exportData = {};
    exportData.cols = [
      { name:"STT", key: 0 },
      { name:"MSSV", key: 1 },
      { name:"HỌ TÊN", key: 2 },
      { name:"TÊN ĐỀ TÀI TIẾNG VIỆT", key: 3 },
      { name:"TÊN ĐỀ TÀI TIẾNG ANH", key: 4 },
      { name:"CÁN BỘ HƯỚNG DẪN", key: 5 },
      { name:"CÁN BỘ PHẢN BIỆN", key: 6 },
      { name:"ĐIỂM", key: 7 },
      { name:"GHI CHÚ", key: 8 },
    ];
    var data = [];
    var merge = [];
    data.push([ "STT", "MSSV", "HỌ TÊN", "TÊN ĐỀ TÀI TIẾNG VIỆT", "TÊN ĐỀ TÀI TIẾNG ANH", "CÁN BỘ HƯỚNG DẪN", "CÁN BỘ PHẢN BIỆN", "ĐIỂM", "GHI CHÚ" ]);
    var stt = 0;
    deTais.forEach((deTai) => {
      if (deTai.trangThaiDuyet != Constants.DE_TAI_APPROVE_STATUS_APPROVED
          || !deTai.sinhVienThucHien || deTai.sinhVienThucHien.length < 1) {
        return;
      }
      for (var i = 0; i < deTai.sinhVienThucHien.length; i++) {
        var canBoPhanBien = '';
        if (deTai.canBoPhanBien && deTai.canBoPhanBien.name) {
          canBoPhanBien = deTai.canBoPhanBien.name;
        }
        var diemSo = 0;
        if (i == 0 && deTai.diemSo && deTai.diemSo[0]) {
          diemSo = deTai.diemSo[0];
        }
        if (i == 1 && deTai.diemSo && deTai.diemSo[1]) {
          diemSo = deTai.diemSo[1];
        }
        var sinhVien = deTai.sinhVienThucHien[i];
        if (i == 0) {
          data.push([ (stt + 1) + '', sinhVien.maSV, sinhVien.name, deTai.tenDeTai, deTai.englishName || '', deTai.giangVien.name,
            canBoPhanBien, diemSo, '']);
          stt++;
        }
        else {
          data.push([ 'merge_up', sinhVien.maSV, sinhVien.name, 'merge_up', 'merge_up', 'merge_up', 'merge_up', diemSo, '' ]);
          merge = [
            ...merge,
            { s: { r: data.length - 2, c: 0}, e: { r: data.length - 1, c: 0 } },
            { s: { r: data.length - 2, c: 3}, e: { r: data.length - 1, c: 3 } },
            { s: { r: data.length - 2, c: 4}, e: { r: data.length - 1, c: 4 } },
            { s: { r: data.length - 2, c: 5}, e: { r: data.length - 1, c: 5 } },
            { s: { r: data.length - 2, c: 6}, e: { r: data.length - 1, c: 6 } },
          ]
        }
      }
    });
    exportData.data = data;
    console.log(exportData);

    /* convert state.data to worksheet */
    const ws = XLSX.utils.aoa_to_sheet(exportData.data);
    ws["!merges"] = merge;

    var wscols = [
      {wch:5},
      {wch:10},
      {wch:15},
      {wch:30},
      {wch:30},
      {wch:15},
      {wch:15},
      {wch:10},
      {wch:20},
    ];
    ws['!cols'] = wscols;

    for (var i = 0; i < exportData.data.length; i++) {
      for (var j = 0; j < exportData.cols.length; j++) {
        ws[XLSX.utils.encode_cell({ c: j, r: i })].s = {
          alignment: {
            vertical: "center"
          },
          border: {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            },
          }
        }
        if (i == 0 || j == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.alignment.horizontal = "center";
        }
        if (i == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.font = {
            bold: true,
          };
        }

      }
    };

    console.log(ws);
    /* build a workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BangDiem");
    var defaultCellStyle = { font: { name: "Times New Roman ", sz: 13}};

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "bang_diem.xlsx", { defaultCellStyle: defaultCellStyle });
  }

  const onNameChangeExportClick = () => {
    var exportData = {};
    exportData.cols = [
      { name:"STT", key: 0 },
      { name:"MSSV", key: 1 },
      { name:"HỌ TÊN", key: 2 },
      { name:"TÊN ĐỀ TÀI CŨ", key: 3 },
      { name:"TÊN ĐỀ TÀI MỚI", key: 4 },
      { name:"TÊN ĐỀ TÀI MỚI TIẾNG ANH", key: 5 },
      { name:"CB HƯỚNG DẪN", key: 6 },
      { name:"GHI CHÚ", key: 7 },
    ];
    var data = [];
    var merge = [];
    data.push([ "STT", "MSSV", "HỌ TÊN", "TÊN ĐỀ TÀI CŨ", "TÊN ĐỀ TÀI MỚI", "TÊN ĐỀ TÀI MỚI TIẾNG ANH", "CB HƯỚNG DẪN", "GHI CHÚ" ]);
    var stt = 0;
    deTais.forEach((deTai) => {
      if (deTai.trangThaiDuyet != Constants.DE_TAI_APPROVE_STATUS_APPROVED
          || !deTai.sinhVienThucHien || deTai.sinhVienThucHien.length < 1) {
        return;
      }
      if (!deTai.xacNhanGiuaKi || !deTai.xacNhanGiuaKi.pending == true) {
        return;
      }
      for (var i = 0; i < deTai.sinhVienThucHien.length; i++) {
        var newName = '';
        var newEnglishName = '';
        if (deTai.xacNhanGiuaKi && deTai.xacNhanGiuaKi.newName && deTai.xacNhanGiuaKi.newName != '') {
          newName = deTai.xacNhanGiuaKi.newName;
        }
        if (deTai.xacNhanGiuaKi && deTai.xacNhanGiuaKi.newEnglishName && deTai.xacNhanGiuaKi.newEnglishName != '') {
          newEnglishName = deTai.xacNhanGiuaKi.newEnglishName;
        }
        var sinhVien = deTai.sinhVienThucHien[i];
        if (i == 0) {
          data.push([ (stt + 1) + '', sinhVien.maSV, sinhVien.name, deTai.tenDeTai, newName, newEnglishName, deTai.giangVien.name, '' ]);
          stt++;
        }
        else {
          data.push([ 'merge_up', sinhVien.maSV, sinhVien.name, 'merge_up', 'merge_up', 'merge_up', 'merge_up', 'merge_up' ]);
          merge = [
            ...merge,
            { s: { r: data.length - 2, c: 0}, e: { r: data.length - 1, c: 0 } },
            { s: { r: data.length - 2, c: 3}, e: { r: data.length - 1, c: 3 } },
            { s: { r: data.length - 2, c: 4}, e: { r: data.length - 1, c: 4 } },
            { s: { r: data.length - 2, c: 5}, e: { r: data.length - 1, c: 5 } },
            { s: { r: data.length - 2, c: 6}, e: { r: data.length - 1, c: 6 } },
            { s: { r: data.length - 2, c: 7}, e: { r: data.length - 1, c: 7 } },
          ]
        }
      }
    });
    exportData.data = data;
    console.log(exportData);

    /* convert state.data to worksheet */
    const ws = XLSX.utils.aoa_to_sheet(exportData.data);
    ws["!merges"] = merge;

    var wscols = [
      {wch:5},
      {wch:10},
      {wch:15},
      {wch:30},
      {wch:30},
      {wch:30},
      {wch:15},
      {wch:20},
    ];
    ws['!cols'] = wscols;

    for (var i = 0; i < exportData.data.length; i++) {
      for (var j = 0; j < exportData.cols.length; j++) {
        ws[XLSX.utils.encode_cell({ c: j, r: i })].s = {
          alignment: {
            vertical: "center"
          },
          border: {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            },
          }
        }
        if (i == 0 || j == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.alignment.horizontal = "center";
        }
        if (i == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.font = {
            bold: true,
          };
        }

      }
    };

    console.log(ws);
    /* build a workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachThayDoiTen");
    var defaultCellStyle = { font: { name: "Times New Roman ", sz: 13}};

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "danh_sach_thay_doi_ten.xlsx", { defaultCellStyle: defaultCellStyle });
  }

  const onBCGKExportClick = () => {
    var exportData = {};
    exportData.cols = [
      { name:"STT", key: 0 },
      { name:"MSSV", key: 1 },
      { name:"HỌ TÊN", key: 2 },
      { name:"TÊN ĐỀ TÀI TIẾNG VIỆT", key: 3 },
      { name:"TÊN ĐỀ TÀI TIẾNG ANH", key: 4 },
      { name:"TÊN CBHD", key: 5 },
      { name:"XÁC NHẬN CỦA CBHD", key: 6 },
      { name:"merge_left", key: 7 },
      { name:"LÝ DO DỪNG", key: 8 },
    ];
    var data = [];
    var merge = [];
    data.push([ "STT", "MSSV", "HỌ TÊN", "TÊN ĐỀ TÀI TIẾNG VIỆT", "TÊN ĐỀ TÀI TIẾNG ANH",
      "TÊN CBHD", "XÁC NHẬN CỦA CBHD", "merge_left", "LÝ DO DỪNG" ]);
    data.push([ "merge_up", "merge_up", "merge_up", "merge_up", "merge_up",
      "merge_up", "TIẾP TỤC", "DỪNG", "merge_up" ]);
    var stt = 0;
    merge = [
      ...merge,
      { s: { r: data.length - 2, c: 0}, e: { r: data.length - 1, c: 0 } },
      { s: { r: data.length - 2, c: 1}, e: { r: data.length - 1, c: 1 } },
      { s: { r: data.length - 2, c: 2}, e: { r: data.length - 1, c: 2 } },
      { s: { r: data.length - 2, c: 3}, e: { r: data.length - 1, c: 3 } },
      { s: { r: data.length - 2, c: 4}, e: { r: data.length - 1, c: 4 } },
      { s: { r: data.length - 2, c: 5}, e: { r: data.length - 1, c: 5 } },
      { s: { r: data.length - 2, c: 8}, e: { r: data.length - 1, c: 8 } },
      { s: { r: data.length - 2, c: 6}, e: { r: data.length - 2, c: 7 } },
    ]
    deTais.forEach((deTai) => {
      if (deTai.trangThaiDuyet != Constants.DE_TAI_APPROVE_STATUS_APPROVED
          || !deTai.sinhVienThucHien || deTai.sinhVienThucHien.length < 1) {
        return;
      }
      for (var i = 0; i < deTai.sinhVienThucHien.length; i++) {
        var sinhVien = deTai.sinhVienThucHien[i];
        var lyDoDung = '';
        if (i == 0 && deTai.xacNhanGiuaKi && deTai.xacNhanGiuaKi.sinhVien1) {
          lyDoDung = deTai.xacNhanGiuaKi.sinhVien1.lyDoDung || '';
        }
        if (i == 1 && deTai.xacNhanGiuaKi && deTai.xacNhanGiuaKi.sinhVien2) {
          lyDoDung = deTai.xacNhanGiuaKi.sinhVien2.lyDoDung || '';
        }
        if (i == 0) {
          data.push([ (stt + 1) + '', sinhVien.maSV, sinhVien.name, deTai.tenDeTai,
            deTai.englishName || '', deTai.giangVien.name, '', '', lyDoDung ]);
          stt++;
        }
        else {
          data.push([ 'merge_up', sinhVien.maSV, sinhVien.name, 'merge_up', 'merge_up', 'merge_up', '', '', lyDoDung ]);
          merge = [
            ...merge,
            { s: { r: data.length - 2, c: 0}, e: { r: data.length - 1, c: 0 } },
            { s: { r: data.length - 2, c: 3}, e: { r: data.length - 1, c: 3 } },
            { s: { r: data.length - 2, c: 4}, e: { r: data.length - 1, c: 4 } },
            { s: { r: data.length - 2, c: 5}, e: { r: data.length - 1, c: 5 } },
          ]
        }
      }
    });
    exportData.data = data;
    console.log(exportData);

    /* convert state.data to worksheet */
    const ws = XLSX.utils.aoa_to_sheet(exportData.data);
    ws["!merges"] = merge;

    var wscols = [
      {wch:5},
      {wch:10},
      {wch:15},
      {wch:30},
      {wch:30},
      {wch:15},
      {wch:10},
      {wch:10},
      {wch:20},
    ];
    ws['!cols'] = wscols;

    for (var i = 0; i < exportData.data.length; i++) {
      for (var j = 0; j < exportData.cols.length; j++) {
        if (!ws[XLSX.utils.encode_cell({ c: j, r: i })]) {
          console.log(j);
          console.log(i);
          break;
        }
        ws[XLSX.utils.encode_cell({ c: j, r: i })].s = {
          alignment: {
            vertical: "center"
          },
          border: {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            },
          }
        }
        if (i == 0 || i == 1 || j == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.alignment.horizontal = "center";
        }
        if (i == 0 || i == 1) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.font = {
            bold: true,
          };
        }

      }
    };

    console.log(ws);
    /* build a workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachBaoCaoTienDoGK");
    var defaultCellStyle = {
      font: { name: "Times New Roman ", sz: 13},
      border: {
        top: {
          style: 'thin'
        },
        bottom: {
          style: 'thin'
        },
        left: {
          style: 'thin'
        },
        right: {
          style: 'thin'
        },
      }
    };

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "danh_sach_bao_cao_tien_do_gk.xlsx", { defaultCellStyle: defaultCellStyle });
  }

  const onHDExportClick = () => {
    var exportData = {};
    exportData.cols = [
      { name:"STT", key: 0 },
      { name:"MSSV", key: 1 },
      { name:"HỌ TÊN", key: 2 },
      { name:"TÊN ĐỀ TÀI TIẾNG VIỆT", key: 3 },
      { name:"TÊN ĐỀ TÀI TIẾNG ANH", key: 4 },
      { name:"CÁN BỘ HƯỚNG DẪN", key: 5 },
      { name:"CÁN BỘ PHẢN BIỆN", key: 6 },
      { name:"HỘI ĐỒNG CHẤM KHÓA LUẬN (Ghi rõ chức vụ trong HĐ)", key: 7 },
      { name:"GHI CHÚ", key: 8 },
    ];
    var data = [];
    var merge = [];
    data.push([
      "STT",
      "MSSV",
      "HỌ TÊN",
      "TÊN ĐỀ TÀI TIẾNG VIỆT",
      "TÊN ĐỀ TÀI TIẾNG ANH",
      "CÁN BỘ HƯỚNG DẪN",
      "CÁN BỘ PHẢN BIỆN",
      "HỘI ĐỒNG CHẤM KHÓA LUẬN (Ghi rõ chức vụ trong HĐ)",
      "GHI CHÚ"
    ]);
    var stt = 0;
    deTaisWHD.forEach((deTai) => {
      if (deTai.trangThaiDuyet != Constants.DE_TAI_APPROVE_STATUS_APPROVED
          || !deTai.sinhVienThucHien || deTai.sinhVienThucHien.length < 1) {
        return;
      }
      for (var i = 0; i < deTai.sinhVienThucHien.length; i++) {
        var sinhVien = deTai.sinhVienThucHien[i];
        var canBoPhanBien = '';
        if (deTai.canBoPhanBien && deTai.canBoPhanBien.name) {
          canBoPhanBien = deTai.canBoPhanBien.name;
        }
        if (i == 0) {
          data.push([ (stt + 1) + '', sinhVien.maSV, sinhVien.name, deTai.tenDeTai, deTai.englishName || '', deTai.giangVien.name,
            canBoPhanBien, `Chủ tịch: ${deTai.chuTich.name}\nThư ký: ${deTai.thuKy.name}\nỦy viên: ${deTai.uyVien.name}`, '' ]);
          stt++;
        }
        else {
          data.push([ 'merge_up', sinhVien.maSV, sinhVien.name, 'merge_up', 'merge_up', 'merge_up', 'merge_up', 'merge_up', 'merge_up' ]);
          merge = [
            ...merge,
            { s: { r: data.length - 2, c: 0}, e: { r: data.length - 1, c: 0 } },
            { s: { r: data.length - 2, c: 3}, e: { r: data.length - 1, c: 3 } },
            { s: { r: data.length - 2, c: 4}, e: { r: data.length - 1, c: 4 } },
            { s: { r: data.length - 2, c: 5}, e: { r: data.length - 1, c: 5 } },
            { s: { r: data.length - 2, c: 6}, e: { r: data.length - 1, c: 6 } },
            { s: { r: data.length - 2, c: 7}, e: { r: data.length - 1, c: 7 } },
            { s: { r: data.length - 2, c: 8}, e: { r: data.length - 1, c: 8 } },
          ]
        }
      }
    });
    exportData.data = data;
    console.log(exportData);

    /* convert state.data to worksheet */
    const ws = XLSX.utils.aoa_to_sheet(exportData.data);
    ws["!merges"] = merge;

    var wscols = [
      {wch:5},
      {wch:10},
      {wch:15},
      {wch:30},
      {wch:30},
      {wch:15},
      {wch:15},
      {wch:32},
      {wch:20},
    ];
    ws['!cols'] = wscols;

    for (var i = 0; i < exportData.data.length; i++) {
      for (var j = 0; j < exportData.cols.length; j++) {
        if (!ws[XLSX.utils.encode_cell({ c: j, r: i })]) {
          break;
        }
        ws[XLSX.utils.encode_cell({ c: j, r: i })].s = {
          alignment: {
            vertical: "center"
          },
          border: {
            top: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            },
          }
        }
        if (i == 0 || j == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.alignment.horizontal = "center";
        }
        if (i == 0) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.font = {
            bold: true,
          };
        }
        if (j == 7) {
          ws[XLSX.utils.encode_cell({ c: j, r: i })].s.alignment.wrapText = true;
        }
      }
    };

    console.log(ws);
    /* build a workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachHoiDong");
    var defaultCellStyle = { font: { name: "Times New Roman ", sz: 13}};

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "danh_sach_hoi_dong.xlsx", { defaultCellStyle: defaultCellStyle });
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title={"Danh sách các đề tài" + (kyThucHien.name.length > 0 ? ` thuộc ${kyThucHien.name}` : "")}
            subtitle="QUẢN LÝ KỲ THỰC HIỆN KHÓA LUẬN" className="text-sm-left" />
      </Row>
      <Row>
        <div style={{ marginBottom: '10px' }}>
          <Button className="export-button" onClick={() => { onExportClick() }}>Xuất DS Sinh Viên Thực hiện</Button>
          <span class="pr-05r"/>
          <Button className="export-button" onClick={() => { onBCGKExportClick() }}>Xuất DS Báo cáo tiến độ GK</Button>
          <span class="pr-05r"/>
          <Button className="export-button" onClick={() => { onNameChangeExportClick() }}>Xuất DS Thay đổi tên</Button>
          <span class="pr-05r"/>
          <Button className="export-button" onClick={() => { onDSBVExportClick() }}>Xuất DS Sinh viên bảo vệ KLTN</Button>
          <span class="pr-05r"/>
          <Button className="export-button" onClick={() => { onHDExportClick() }}>Xuất DS Hội đồng bảo vệ</Button>
          <span class="pr-05r"/>
          <Button className="export-button" onClick={() => { onBangDiemExportClick() }}>Xuất Bảng điểm KLTN</Button>
        </div>
        <div className="de_tai_card_container">
          { deTais.map((deTai) => (
            <div className="de_tai_card" >
              <DeTaiInfoCard deTai={deTai} onClick={() => { onDeTaiClick(deTai._id) }} />
            </div>
          )) }
        </div>
      </Row>
    </Container>
  )
};

export default ListKyThucHien;
