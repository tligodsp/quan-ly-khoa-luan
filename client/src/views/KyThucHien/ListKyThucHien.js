import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import { getKyThucHiens, deleteKyThucHienById, updateKyThucHienById, createKyThucHien, getKyThucHiensWithQuery
  } from '../../api/kyThucHienAPI';
import * as Utils from '../../utils/utils';
import * as Constants from '../../constants/constants';
import LaunchIcon from '@material-ui/icons/Launch';

import PageTitle from "../../components/common/PageTitle";
import ActionButtons from '../../components/common/ActionButtons';
import CreateOrEditKyThucHienModal from './CreateOrEditKTHModal';
import LyrTable from '../../components/common/LyrTable/LyrTable';

import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal/ConfirmDeleteModal";

const ListKyThucHien = () => {
  const [ kyThucHiens, setKyThucHiens ] = useState([]);
  const [ selectedKTH, setSelectedKTH ] = useState(Utils.getNewKyThucHien);
  const [ isOpenModal, setIsOpenModal ] = useState(false);
  const [ resData, setResData ] = useState(Utils.getNewPageData());

  let history = useHistory();

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    setKyThucHiens(resData.docs);
  }, [resData]);

  useEffect(() => {
    if (selectedKTH._id != null) {
      setIsOpenModal(true);
    }
  }, [selectedKTH]);

  /* const getList = () => {
    getKyThucHiens()
      .then((res) => {
        console.log(res);
        setKyThucHiens(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } */

  const getList = (search = '', pagingOptions = Utils.getNewPagingOptions(), filters = {}) => {
    getKyThucHiensWithQuery(search, pagingOptions, filters)
      .then((res) => {
        console.log(res);
        setResData(res.data);
      })
      .catch((err) => {
        setResData(Utils.getNewPageData());
        Utils.showErrorToast(Utils.getFormattedErrMsg(err));
        console.log(err.response);
      });
  }

  const onDeleteClick = (id) => {
    console.log('delete');
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmDeleteModal onClose={onClose} onConfirm={() => {
            toast.promise(
              deleteKyThucHienById(id),
              {
                loading: '??ang x??a',
                success: (res) => {
                  getList();
                  onClose();
                  return 'X??a th??nh c??ng';
                },
                error: (err) => {
                  return Utils.getFormattedErrMsg(err);
                }
              },
              Utils.getToastConfig()
            );
          }} />
        );
      }
    });
    /* deleteKyThucHienById(id)
      .then((res) => {
        console.log(res);
        getList();
      })
      .catch((err) => {
        console.log(err);
      }); */
  }

  const onEditClick = (kyThucHien) => {
    // history.push('/giang-vien/edit', { kyThucHienId: id });
    // history.push(`/giang-vien/edit/${id}`);
    setSelectedKTH(kyThucHien);
  }

  const onUpdated = () => {
    setIsOpenModal(false);
    getList();
  }

  const onCreated = () => {
    setIsOpenModal(false);
    getList();
  }

  const onClose = () => {
    setSelectedKTH(Utils.getNewKyThucHien);
  }

  const toggleBModal = () => {
    setIsOpenModal(!isOpenModal);
  }

  const onViewThuMucClick = (kthId) => {
    window.open(`/thu-muc/get-by-kth/${kthId}`, '_blank');
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Danh s??ch c??c K??? th???c hi???n Kh??a lu???n" subtitle="QU???N L?? K??? TH???C HI???N KH??A LU???N" className="text-sm-left" />
      </Row>

      <Row>
        <Col>
          <LyrTable
            buttonSection={
              <Button onClick={() => { setIsOpenModal(true) }}>Th??m K??? th???c hi???n Kh??a lu???n</Button>
            }
            data={resData}
            getList={getList}
            tableMode={true}
            headers={[
              {
                label: "T??n",
                type: Constants.FILTER_TYPE_EQ,
                field: 'name',
              },
              {
                label: "C??c th?? m???c n???p file",
                type: Constants.FILTER_TYPE_NL,
              },
              {
                label: "Tr???ng th??i",
                type: Constants.FILTER_TYPE_SL,
                selectList: Utils.getKyThucHienStatusSL(),
                field: 'status',
              },
              {
                label: "Ng??y b???t ?????u",
                type: Constants.FILTER_TYPE_FTD,
                field: 'startDate',
              },
              {
                label: "Ng??y k???t th??c",
                type: Constants.FILTER_TYPE_FTD,
                field: 'endDate',
              },
              {
                label: "Thao t??c",
                type: Constants.FILTER_TYPE_NL,
              },
            ]}
          >
            <tbody>
              {
                kyThucHiens.map((kyThucHien, index) => (
                  <tr key={`ky-thuc-hien_${index}`}>
                    <td><a href={`/ky-thuc-hien/${kyThucHien._id}`} target="_blank">{kyThucHien.name}</a></td>
                    <td>
                      <LaunchIcon color="primary" className="icon-button"
                          onClick={() => { onViewThuMucClick(kyThucHien._id) }}/>
                    </td>
                    <td>{Utils.getKyThucHienStatusText(kyThucHien.status)}</td>
                    <td>{Utils.getFormattedDate(kyThucHien.startDate)}</td>
                    <td>{Utils.getFormattedDate(kyThucHien.endDate)}</td>
                    <td>
                      <ActionButtons
                        onDeleteClick={() => { onDeleteClick(kyThucHien._id) }}
                        onEditClick={() => { onEditClick(kyThucHien) }} />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </LyrTable>
          {/* <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Button onClick={() => { setIsOpenModal(true) }}>Th??m K??? th???c hi???n Kh??a lu???n</Button>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      T??n
                    </th>
                    <th scope="col" className="border-0">
                      Tr???ng th??i
                    </th>
                    <th scope="col" className="border-0">
                      Ng??y b???t ?????u
                    </th>
                    <th scope="col" className="border-0">
                      Ng??y k???t th??c
                    </th>
                    <th scope="col" className="border-0">
                      Thao t??c
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    kyThucHiens.map((kyThucHien, index) => (
                      <tr key={`ky-thuc-hien_${index}`}>
                        <td>{kyThucHien.name}</td>
                        <td>{Utils.getKyThucHienStatusText(kyThucHien.status)}</td>
                        <td>{kyThucHien.startDate}</td>
                        <td>{kyThucHien.endDate}</td>
                        <td>
                          <ActionButtons
                            onDeleteClick={() => { onDeleteClick(kyThucHien._id) }}
                            onEditClick={() => { onEditClick(kyThucHien) }} />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </CardBody>
          </Card> */}
        </Col>
      </Row>
      <CreateOrEditKyThucHienModal isModalOpen={isOpenModal} toggleModal={toggleBModal} selected={selectedKTH} onClose={onClose} onUpdated={onUpdated}
          onCreated={onCreated}/>
      {/* <EditKyThucHienModal isOpen={isOpenModal}/> */}
    </Container>
  )
};

export default ListKyThucHien;
