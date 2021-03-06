import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import SelectSearch, { fuzzySearch } from 'react-select-search';
import '../../styles/select-search-styles.css';
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardFooter,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
  Container
} from "shards-react";
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

// import fuzzySearch from '../../components/common/fuzzySearch';
import { getHoiDongById, createHoiDong, updateHoiDongById } from '../../api/hoiDongAPI';
import { getPhongHocs } from '../../api/phongHocAPI';
import { getDeTais } from '../../api/deTaiAPI';
import { getGiangViens } from '../../api/giangVienAPI';
import * as Constants from '../../constants/constants';
import * as Utils from '../../utils/utils';
import PageTitle from "../../components/common/PageTitle";

import toast from 'react-hot-toast';

const CreateOrEditHoiDongPage = () => {
  let { id } = useParams();
  let history = useHistory();
  const [ hoiDong, setHoiDong ] = useState(Utils.getNewHoiDong());
  const [ phongHocs, setPhongHocs ] = useState([]);
  const [ deTais, setDeTais ] = useState([]);
  const [ giangViens, setGiangViens ] = useState([]);
  let isUpdate = (id != null);
  const startAtPickerRef = useRef();
  const endAtPickerRef = useRef();
  // moment.locale("vi");

  useEffect(() => {
    /* getHoiDongById(id)
      .then((res) => {
        console.log(res);
        setGiangVien({ ...res.data });
      })
      .catch((err) => {
        console.log(err);
      }); */
      if (isUpdate) {
        getHoiDongById(id)
          .then((res) => {
            console.log(res);
            setHoiDong(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
      }
      else {

      }
      getDeTais()
        .then((res) => {
          console.log(res);
          setDeTais(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
      getPhongHocs()
        .then((res) => {
          console.log(res);
          setPhongHocs(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
      getGiangViens()
        .then((res) => {
          console.log(res);
          setGiangViens(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
  }, []);

  const onUpdateClick = () => {
    console.log(hoiDong);
    toast.promise(
      updateHoiDongById(id, hoiDong),
      {
        loading: '??ang c???p',
        success: (res) => {
          console.log(res);
          // history.push('/hoi-dong');
          return 'C???p nh???t th??nh c??ng';
        },
        error: (err) => {
          return Utils.getFormattedErrMsg(err);
        }
      },
      Utils.getToastConfig()
    );
    /* updateHoiDongById(id, hoiDong)
      .then((res) => {
        console.log(res);
        history.push('/hoi-dong');
      })
      .catch((err) => {
        console.log(err);
      }); */
  }

  const onCreateClick = () => {
    console.log(hoiDong);
    toast.promise(
      createHoiDong(hoiDong),
      {
        loading: '??ang t???o',
        success: (res) => {
          console.log(res);
          history.push('/hoi-dong');
          return 'T???o th??nh c??ng';
        },
        error: (err) => {
          return Utils.getFormattedErrMsg(err);
        }
      },
      Utils.getToastConfig()
    );
    /* createHoiDong(hoiDong)
      .then((res) => {
        console.log(res);
        history.push('/hoi-dong');
      })
      .catch((err) => {
        console.log(err);
      }) */
  }

  const callStartAtPicker = () => {
    startAtPickerRef.current.click();
  }

  const callEndAtPicker = () => {
    endAtPickerRef.current.click();
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle title={ isUpdate ? 'C???p nh???t th??ng tin H???i ?????ng' : 'T???o H???i ?????ng m???i' }
          subtitle="Qu???n l?? H???i ?????ng ch???m"
          md="12" className="ml-sm-auto mr-sm-auto" />
      </Row>
      <Row>
        <Col sm={{ size: 8, order: 2, offset: 2 }}>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">{ isUpdate ? 'C???p nh???t th??ng tin H???i ?????ng' : 'T???o H???i ?????ng m???i' }</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>
                      <FormGroup>
                        <label htmlFor="feName">T??n H???i ?????ng</label>
                        <FormInput
                          id="feName"
                          value={hoiDong.name}
                          onChange={(e) => { setHoiDong({ ...hoiDong, name: e.target.value }) }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>C??c ????? t??i</label>
                        <SelectSearch
                          value={hoiDong.deTais}
                          search
                          multiple
                          printOptions="on-focus"
                          closeOnSelect={false}
                          filterOptions={fuzzySearch}
                          onChange={(e) => { setHoiDong({ ...hoiDong, deTais: [ ...e ] }) }}
                          placeholder="Ch???n c??c ????? t??i s??? ph???n bi???n"
                          options={deTais.map((deTai) => ({ value: deTai._id, name: deTai.tenDeTai }))}
                        />
                      </FormGroup>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="phongHoc">Ph??ng</label>
                          <SelectSearch
                            value={hoiDong.phongHoc._id}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setHoiDong({ ...hoiDong, phongHoc: e }) }}
                            placeholder="Ch???n ?????a ??i???m t??? ch???c ph???n bi???n"
                            options={phongHocs.map((phong) => ({ value: phong._id, name: phong.name }))}
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="chuTich">Ch??? t???ch</label>
                          <SelectSearch
                            value={hoiDong.chuTich._id}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setHoiDong({ ...hoiDong, chuTich: e }) }}
                            placeholder="Ch???n Ch??? t???ch"
                            options={giangViens.map((gv) => ({ value: gv._id, name: gv.name }))}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="thuKy">Th?? k??</label>
                          <SelectSearch
                            value={hoiDong.thuKy._id}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setHoiDong({ ...hoiDong, thuKy: e }) }}
                            placeholder="Ch???n Th?? k??"
                            options={giangViens.map((gv) => ({ value: gv._id, name: gv.name }))}
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="uyVien">???y vi??n</label>
                          <SelectSearch
                            value={hoiDong.uyVien._id}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setHoiDong({ ...hoiDong, uyVien: e }) }}
                            placeholder="Ch???n ???y vi??n"
                            options={giangViens.map((gv) => ({ value: gv._id, name: gv.name }))}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <FormGroup>
                            <div id="mui-date-hidden" style={{ display: 'none' }}>
                              <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker value={hoiDong.startAt}
                                    onChange={(date) => {
                                      if (date) {
                                        setHoiDong({...hoiDong, startAt: date.toISOString()});
                                      }
                                    }}
                                    innerRef={startAtPickerRef} />
                              </MuiPickersUtilsProvider>
                            </div>
                            <label htmlFor="feStartAt">Th???i gian b???t ?????u</label>
                            <FormInput
                              id="feStartAt"
                              value={Utils.getLocaleDateTimeString(hoiDong.startAt)}
                              onClick={callStartAtPicker}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6" className="form-group">
                          <FormGroup>
                            <div id="mui-date-hidden" style={{ display: 'none' }}>
                              <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker value={hoiDong.endAt}
                                    onChange={(date) => {
                                      if (date) {
                                        setHoiDong({...hoiDong, endAt: date.toISOString()});
                                      }
                                    }}
                                    innerRef={endAtPickerRef} />
                              </MuiPickersUtilsProvider>
                            </div>
                            <label htmlFor="feEndAt">Th???i gian K???t th??c</label>
                            <FormInput
                              id="feEndAt"
                              value={Utils.getLocaleDateTimeString(hoiDong.endAt)}
                              onClick={callEndAtPicker}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feMaGV">M?? Gi???ng vi??n</label>
                          <FormInput
                            id="feMaGV"
                            value={giangVien.maGV}
                            onChange={(e) => { setGiangVien({ ...giangVien, maGV: e.target.value }) }}
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="feHocHam">H???c h??m</label>
                          <FormSelect value={giangVien.hocHam} id="feHocHam"
                              onChange={(e) => { setGiangVien({ ...giangVien, hocHam: e.target.value }) }}>
                            <option value=''>Ch???n...</option>
                            <option value={Constants.GIANG_VIEN_HOC_HAM_THS}>Th???c s??</option>
                            <option value={Constants.GIANG_VIEN_HOC_HAM_PGS_TS}>Ph?? Gi??o s?? Ti???n s??</option>
                            <option value={Constants.GIANG_VIEN_HOC_HAM_TS}>Ti???n s??</option>
                          </FormSelect>
                        </Col>
                      </Row>
                      <FormGroup>
                        <label htmlFor="feName">H??? t??n</label>
                        <FormInput
                          id="feName"
                          value={giangVien.name}
                          onChange={(e) => { setGiangVien({ ...giangVien, name: e.target.value }) }}
                        />
                      </FormGroup>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feEmail">Email</label>
                          <FormInput
                            type="email"
                            id="feEmail"
                            value={giangVien.email}
                            onChange={(e) => { setGiangVien({ ...giangVien, email: e.target.value }) }}
                            autoComplete="email"
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="fePhone">S??? ??i???n tho???i</label>
                          <FormInput
                            type="number"
                            id="fePhone"
                            value={giangVien.phone}
                            onChange={(e) => { setGiangVien({ ...giangVien, phone: e.target.value }) }}
                          />
                        </Col>
                      </Row>
                      <FormGroup>
                        <label htmlFor="feHuongNghienCuu">H?????ng nghi??n c???u</label>
                        <FormInput
                          id="feHuongNghienCuu"
                          value={giangVien.huongNghienCuu}
                          onChange={(e) => { setGiangVien({ ...giangVien, huongNghienCuu: e.target.value }) }}
                        />
                      </FormGroup> */}
                    </Form>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
            <CardFooter>
              { isUpdate
                ? (<Button theme="accent" onClick={onUpdateClick}>C???p nh???t</Button>)
                : (<Button theme="accent" onClick={onCreateClick}>T???o</Button>)
              }
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateOrEditHoiDongPage;
