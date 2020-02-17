import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Table,
  Skeleton,
  Tag,
  Upload, 
  Modal
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
// import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;

const { Meta } = Card;

function downloadPic(url, filename) {
  const img = new Image;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  img.onload = function() {
   canvas.width = this.width;
   canvas.height = this.height;
   ctx.drawImage(this, 0, 0);
  
   const elt = document.createElement('a');
   elt.setAttribute('href', canvas.toDataURL('image/png'));
   elt.setAttribute('download', filename);
   elt.style.display = 'none';
   document.body.appendChild(elt);
   elt.click();
   document.body.removeChild(elt);
  };
  img.crossOrigin = 'anonymous';
  img.src = url;
 }
/* eslint react/no-multi-comp:0 */
@connect(({ image }) => ({
  image,
}))
class TableList extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    clubImgUploadKey: '',
    clubImgLoading: false,
    JDfileList: [],
    TBfileList: [],
  };
  
  componentDidMount() {
    const { dispatch } = this.props;
    const _this = this
    dispatch({
      type: 'image/fetchAll',
    }).then(() => {
      let { JDfileList, TBfileList } = _this.props.image
      console.log('filelist', JDfileList, TBfileList)
      _this.setState({
        JDfileList,
        TBfileList
      })
    })
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  
  //图片上传
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  
  handleJDClubImgChange = info => {
    console.log(info)
    const { dispatch } = this.props
    const _this = this
    const { clubImgUploadKey } = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ clubImgLoading: true });
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, orderImgUrl =>
        this.setState({
          clubImgUrl: `http://club.shitouboy.com/${clubImgUploadKey}`,
          clubImgLoading: false,
        }, () => {
          dispatch({
            type: 'image/saveImage',
            payload: {
              uid: localStorage.getItem('id'),
              name: info.file.name,
              url: _this.state.clubImgUrl,
              image_type: 'JD'
            }
          }).then(() => {
            dispatch({
              type: 'image/fetchAll'
            }).then(() => {
              let { JDfileList, TBfileList } = _this.props.image
              console.log('filelist', JDfileList, TBfileList)
              _this.setState({
                JDfileList,
                TBfileList
              })
            })
          })
        })
      );
    }
    this.setState({
      JDfileList: info.fileList.slice(),
    })
  };
  
  handleTBClubImgChange = info => {
    console.log(info)
    const { dispatch } = this.props
    const _this = this
    const { clubImgUploadKey } = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ clubImgLoading: true });
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, orderImgUrl =>
        this.setState({
          clubImgUrl: `http://club.shitouboy.com/${clubImgUploadKey}`,
          clubImgLoading: false,
        }, () => {
          dispatch({
            type: 'image/saveImage',
            payload: {
              uid: localStorage.getItem('id'),
              name: info.file.name,
              url: _this.state.clubImgUrl,
              image_type: 'TB'
            }
          }).then(() => {
            dispatch({
              type: 'image/fetchAll'
            }).then(() => {
              let { JDfileList, TBfileList } = _this.props.image
              console.log('filelist', JDfileList, TBfileList)
              _this.setState({
                JDfileList,
                TBfileList
              })
            })
          })
        })
      );
    }
    this.setState({
      TBfileList: info.fileList.slice(),
    })
  };


  beforeUpload = file => {
    const { dispatch } = this.props;
    const _this = this;
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('你只能上传 JPG/PNG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('图片必须小于 10MB!');
    }
    return (
      isJpgOrPng &&
      isLt2M &&
      dispatch({ type: 'image/getUploadToken' }).then(function() {
        console.log(_this.props);
        _this.setState({
          clubImgUploadKey: `club/image/${localStorage.getItem('id')}_${Date.now()}`,
        });
      })
    );
  };
  onDownload = (file) => {
    downloadPic(file.url, file.name)
    // const blob = new Blob([file.url])
    // const aLink = document.createElement('a')
    // aLink.style.display = 'none'
    // aLink.href = blob
    // aLink.download = file.name
    // document.body.appendChild(aLink)
    // aLink.click()
    // document.body.removeChild(aLink)
  }
  render() {
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    }
    const { previewVisible, previewImage, TBfileList, JDfileList } = this.state
    const uploadButton = (
      <div>
        <Icon type={this.state.clubImgLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {/* <h2>MK豪车图共享</h2> */}
              <Row gutter={16}>
                <Col span={12}>
                  <h2>京东</h2>
                  <div className="clearfix">
                    <Upload
                      name="file"
                      showUploadList={
                        {showRemoveIcon: false}
                      }
                      action="http://up-z2.qiniup.com"
                      listType="picture-card"
                      fileList={JDfileList.length > 0 ? JDfileList:false}
                      onPreview={this.handlePreview}
                      data={{
                        token: this.props.image.uploadToken,
                        key: this.state.clubImgUploadKey,
                      }}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleJDClubImgChange}
                      onDownload={this.onDownload}
                    >
                      {uploadButton}
                    </Upload>
                  </div>
                </Col>
                <Col span={12}>
                  <h2>淘宝</h2>
                  <div className="clearfix">
                    <Upload
                      name="file"
                      showUploadList={
                        {showRemoveIcon: false}
                      }
                      action="http://up-z2.qiniup.com"
                      listType="picture-card"
                      fileList={TBfileList.length > 0 ? TBfileList:false}
                      onPreview={this.handlePreview}
                      data={{
                        token: this.props.image.uploadToken,
                        key: this.state.clubImgUploadKey,
                      }}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleTBClubImgChange}
                      onDownload={this.onDownload}
                    >
                      {uploadButton}
                    </Upload>
                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles.tableListOperator}></div>

            <Modal width={600} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
