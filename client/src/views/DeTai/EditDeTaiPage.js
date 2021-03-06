import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useRecoilValue } from 'recoil';
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

// import fuzzySearch from '../../components/common/fuzzySearch';
import { getDeTaiById, updateDeTaiById } from '../../api/deTaiAPI';
import { getGiangViens } from '../../api/giangVienAPI';
import { getSinhViens } from '../../api/sinhVienAPI';
import { getKyThucHiens } from '../../api/kyThucHienAPI';
import * as Constants from '../../constants/constants';
import * as Utils from '../../utils/utils';
import PageTitle from "../../components/common/PageTitle";
import userAtom from '../../recoil/user';

import toast from 'react-hot-toast';

const EditDeTaiPage = () => {
  let { id } = useParams();
  let history = useHistory();
  const [ deTai, setDeTai ] = useState(Utils.getNewDeTai());
  const [ giangViens, setGiangViens ] = useState([]);
  const [ sinhViens, setSinhViens ] = useState([]);
  const [ kyThucHiens, setKyThucHiens ] = useState([]);
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    /* getDeTaiById(id)
      .then((res) => {
        console.log(res);
        setGiangVien({ ...res.data });
      })
      .catch((err) => {
        console.log(err);
      }); */
      getDeTaiById(id)
        .then((res) => {
          console.log('deTai');
          console.log(res);
          setDeTai(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
      getGiangViens()
        .then((res) => {
          console.log(res);
          setGiangViens(res.data);
          // setGiangViens([ null, ...res.data ]);
        })
        .catch((err) => {
          console.log(err.response);
        });
      getSinhViens()
        .then((res) => {
          console.log(res);
          setSinhViens(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
      getKyThucHiens()
        .then((res) => {
          console.log(res);
          setKyThucHiens(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        })
  }, []);
  const onUpdateClick = () => {
    console.log(deTai);
    toast.promise(
      updateDeTaiById(id, deTai),
      {
        loading: '??ang c???p nh???t',
        success: (res) => {
          // history.push('/de-tai');
          return 'C???p nh???t th??nh c??ng';
        },
        error: (err) => {
          return Utils.getFormattedErrMsg(err);
        }
      },
      Utils.getToastConfig()
    );
    /* updateDeTaiById(id, deTai)
      .then((res) => {
        console.log(res);
        history.push('/de-tai');
      })
      .catch((err) => {
        console.log(err.response);
      }); */
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle title="C???p nh???t ????? t??i"
          subtitle="Qu???n l?? ????? t??i"
          md="12" className="ml-sm-auto mr-sm-auto" />
      </Row>
      <Row>
        <Col sm={{ size: 8, order: 2, offset: 2 }}>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">C???p nh???t ????? t??i</h6>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form>
                      <FormGroup>
                        <label htmlFor="feName">T??n ????? t??i</label>
                        <FormInput
                          id="feName"
                          value={deTai.tenDeTai}
                          onChange={(e) => { setDeTai({ ...deTai, tenDeTai: e.target.value }) }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="feName">T??n ????? t??i Ti???ng Anh</label>
                        <FormInput
                          id="feEngName"
                          value={deTai.englishName}
                          onChange={(e) => { setDeTai({ ...deTai, englishName: e.target.value }) }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor={`feMoTa`}>M?? t???</label>
                        <FormTextarea
                          id={`feMoTa`}
                          value={deTai.moTa}
                          onChange={(e) => { setDeTai({ ...deTai, moTa: e.target.value }) }}
                        />
                      </FormGroup>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label>K??? th???c hi???n</label>
                          {/* <SelectSearch
                            value={deTai.kyThucHien != null ? deTai.kyThucHien._id : null}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setDeTai({ ...deTai, kyThucHien: e }) }}
                            placeholder="Ch???n K??? th???c hi???n Kh??a lu???n"
                            options={kyThucHiens.map((kth) => ({ value: kth._id, name: kth.name }))}
                          /> */}
                          <FormInput
                            id="feKTH"
                            value={deTai.kyThucHien.name}
                            disabled={true}
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label>Gi???ng vi??n H?????ng d???n</label>
                          {/* <SelectSearch
                            value={deTai.giangVien._id}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setDeTai({ ...deTai, giangVien: e }) }}
                            placeholder="Ch???n Gi???ng vi??n H?????ng d???n"
                            options={giangViens.map((gv) => ({ value: gv._id, name: gv.name }))}
                          /> */}
                          <FormInput
                            id="feGVHD"
                            value={deTai.giangVien.name}
                            disabled={true}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label>Sinh vi??n 1</label>
                          {/* <SelectSearch
                            value={deTai.sinhVienThucHien[0] != null ? deTai.sinhVienThucHien[0]._id : ''}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setDeTai({ ...deTai, sinhVienThucHien: [ e, ...deTai.sinhVienThucHien.slice(1) ] }) }}
                            placeholder="Ch???n Sinh vi??n 1"
                            options={sinhViens.map((sv) => ({ value: sv._id, name: sv.name }))}
                          /> */}
                          <FormInput
                            id="feSV1"
                            value={deTai.sinhVienThucHien[0] ? deTai.sinhVienThucHien[0].name : '-'}
                            disabled={true}
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label>Sinh vi??n 2</label>
                          {/* <SelectSearch
                            value={deTai.sinhVienThucHien[1] != null ? deTai.sinhVienThucHien[1]._id : ''}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => { setDeTai({ ...deTai, sinhVienThucHien: [ ...deTai.sinhVienThucHien.slice(0, 1), e ] }) }}
                            placeholder="Ch???n Sinh vi??n 2"
                            options={sinhViens.map((sv) => ({ value: sv._id, name: sv.name }))}
                          /> */}
                          <FormInput
                            id="feSV2"
                            value={deTai.sinhVienThucHien[1] ? deTai.sinhVienThucHien[1].name : '-'}
                            disabled={true}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feTTDuyet">Tr???ng th??i Duy???t</label>
                          <FormSelect value={deTai.trangThaiDuyet} id="feTTDuyet" disabled={!currentUser.canApprove}
                              onChange={(e) => { setDeTai({ ...deTai, trangThaiDuyet: e.target.value }) }}>
                            <option value=''>Ch???n...</option>
                            <option value={Constants.DE_TAI_APPROVE_STATUS_NOT_APPROVED}>Ch??a duy???t</option>
                            <option value={Constants.DE_TAI_APPROVE_STATUS_APPROVED}>???? duy???t</option>
                            <option value={Constants.DE_TAI_APPROVE_STATUS_REJECTED}>???? t??? ch???i</option>
                          </FormSelect>
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="feTTThucHien">Tr???ng th??i Th???c hi???n</label>
                          <FormSelect value={deTai.trangThaiThucHien} id="feTTThucHien"
                              onChange={(e) => { setDeTai({ ...deTai, trangThaiThucHien: e.target.value }) }}>
                            <option value=''>Ch???n...</option>
                            <option value={Constants.DE_TAI_PROGRESS_STATUS_AVAILABLE}>Ch??? ????ng k??</option>
                            <option value={Constants.DE_TAI_PROGRESS_STATUS_IN_PROGRESS}>??ang th???c hi???n</option>
                            <option value={Constants.DE_TAI_PROGRESS_STATUS_DONE}>???? ho??n th??nh</option>
                            <option value={Constants.DE_TAI_PROGRESS_STATUS_ABANDONED}>???? d???ng</option>
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feHeDT">H??? ????o t???o</label>
                          <FormSelect value={deTai.heDaoTao} id="feHeDT"
                              onChange={(e) => { setDeTai({ ...deTai, heDaoTao: e.target.value }) }}>
                            <option value=''>Ch???n...</option>
                            <option value={Constants.DE_TAI_HDT_DAI_TRA}>?????i tr??</option>
                            <option value={Constants.DE_TAI_HDT_CHAT_LUONG_CAO}>Ch???t l?????ng cao</option>
                          </FormSelect>
                        </Col>
                        <Col md="6" className="form-group">
                          <label>Gi???ng vi??n Ph???n bi???n</label>
                          <SelectSearch
                            value={deTai.canBoPhanBien ? deTai.canBoPhanBien._id : null}
                            search
                            filterOptions={fuzzySearch}
                            onChange={(e) => {
                              console.log(e);
                              if (e == 'not_selected') {
                                setDeTai({ ...deTai, canBoPhanBien: null });
                              }
                              else {
                                setDeTai({ ...deTai, canBoPhanBien: e });
                              }
                            }}
                            placeholder="Ch???n Gi???ng vi??n Ph???n bi???n"
                            options={[ { value: 'not_selected', name: 'Ch???n Gi???ng vi??n Ph???n bi???n' }, ...giangViens.map((gv) => ({ value: gv._id, name: gv.name }))]}
                          />
                        </Col>
                      </Row>
                      <Row form>
                      <Col md="6" className="form-group">
                          <label htmlFor="fePhone">??i???m SV1</label>
                          <FormInput
                            disabled={deTai.sinhVienThucHien[0] == null || deTai.sinhVienThucHien[0]._id == null}
                            type="number"
                            id="feResult"
                            value={deTai.diemSo[0]}
                            onChange={(e) => {
                              let newDeTai = { ...deTai };
                              newDeTai.diemSo[0] = e.target.value;
                              setDeTai(newDeTai)
                            }}
                          />
                        </Col>
                        <Col md="6" className="form-group">
                          <label htmlFor="fePhone">??i???m SV2</label>
                          <FormInput
                            disabled={deTai.sinhVienThucHien[1] == null || deTai.sinhVienThucHien[1]._id == null}
                            type="number"
                            id="feResult"
                            value={deTai.diemSo[1]}
                            onChange={(e) => {
                              let newDeTai = { ...deTai };
                              newDeTai.diemSo[1] = e.target.value;
                              setDeTai(newDeTai)
                            }}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
            <CardFooter>
              <Button theme="accent" onClick={onUpdateClick}>C???p nh???t</Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditDeTaiPage;
