import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormInput, Button } from "shards-react";
import moment from 'moment';
import ReactQuill from "react-quill";
import axios from "axios";
import DeXuatButton from "../../components/post/DeXuatButton";
import { useHistory } from "react-router-dom";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

import PageTitle from "../../components/common/PageTitle";
import SidebarActions from "../../components/add-new-post/SidebarActions";
import SidebarCategories from "../../components/add-new-post/SidebarCategories";

const NewBaiDang = () => {
  const [ newPost, setNewPost ] = useState({
    title: '',
    content: '',
    creator: '01234',
    type: 'NB',
    isPosted: false,
    postedTime: moment().toISOString()
  });
  const [ isShowPreview, setIsShowPreview ] = useState(false);
  let history = useHistory();
  const upsertPost = (post) => {
    console.log(post);
    if (post.title == '' || post.content == '') {
      return;
    }
    axios.post('http://localhost:5000/posts', post)
      .then((res) => {
        console.log(res);
        history.push('/bai-dang');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const onSaveClick = () => {
    upsertPost(newPost);
  }
  const onPostClick = () => {
    const post = { ...newPost, isPosted: true, postedTime: moment().toISOString() };
    upsertPost(post);
  }
  const onPreviewClick = () => {
    setIsShowPreview(true);
  }
  const onBackClick = () => {
    setIsShowPreview(false);
  }
  const onLoaiTinChange = (type) => {
    setNewPost({ ...newPost, type: type });
  }
  return (
    <Container fluid className="main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Soạn Bài đăng" subtitle="Quản lý Bài đăng" className="text-sm-left" />
      </Row>
      {
        !isShowPreview &&
        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <Card small className="mb-3">
              <CardBody>
                <Form className="add-new-post">
                  <FormInput size="lg" className="mb-3" placeholder="Tên bài đăng"
                    value={newPost.title} onChange={(e) => { setNewPost({ ...newPost, title: e.target.value}) }}/>
                  <ReactQuill className="add-new-post__editor mb-1"
                    value={newPost.content} onChange={(html) => { setNewPost({ ...newPost, content: html}) }}/>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* Sidebar Widgets */}
          <Col lg="3" md="12">
            <SidebarActions onSaveClick={onSaveClick} onPreviewClick={onPreviewClick}
              post={newPost} onLoaiTinChange={onLoaiTinChange} onPostClick={onPostClick} />
            {/* <SidebarCategories /> */}
          </Col>
        </Row>
      }
      {
        isShowPreview &&
        <div>
          <Row style={{ display: 'flex', flexDirection: 'row' }}>
          {/* <ReactQuill className="add-new-post__editor mb-1"
            value={content} readOnly={true} theme={"bubble"}/> */}
          <Card small className="mb-3 ml-3" style={{ width: '80%', minWidth: '300px', minHeight: '400px' }}>
            <CardBody>
              {/* <Form className="add-new-post">
                <FormInput size="lg" className="mb-3" placeholder="Tên bài đăng"
                  value={newPost.title} onChange={(e) => { setNewPost({ ...newPost, title: e.target.value}) }}/>
                <ReactQuill className="add-new-post__editor mb-1"
                  value={newPost.content} onChange={(html) => { setNewPost({ ...newPost, content: html}) }}/>
              </Form> */}
              {/* <ReactQuill className="add-new-post__editor mb-1"
                value={newPost.content} readOnly={true} theme={"snow"}/> */}
                <div style={{ border: 'none' }} class="ql-container ql-snow">
                  <div class="ql-editor">
                    <div dangerouslySetInnerHTML={{__html: newPost.content}} />
                  </div>
                </div>
            </CardBody>
          </Card>
        </Row>
        <div style={{ display: 'flex' }}>
          <Button onClick={onBackClick}>Trở về</Button>
          <div style={{ margin: '10px' }} />
          <DeXuatButton />
        </div>
        </div>
      }
    </Container>
  );
}

export default NewBaiDang;
