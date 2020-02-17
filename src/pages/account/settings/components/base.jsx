import { Button, Form, Input, Select, Upload, message, Icon, Tag, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'dva';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
import styles from './BaseView.less';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能

const options = [
  { key: 'hongbao', name: '红包' },
  { key: 'huafei', name: '话费' },
  { key: 'choujiang', name: '抽奖' },
  { key: 'fuli', name: '福利' },
  { key: 'tmall', name: '天猫包邮' },
];
export const statusTag = info => {
  const { status } = info;
  switch (status) {
    case '1':
      return (
        <>
          <span>
            状态：<Tag color="#87d068">正常</Tag>
          </span>
          <span>
            剩余：{' '}
            <strong style={{ color: '#fe8019' }}>
              {Math.floor(moment(info.end_time).diff(moment(Date.now()), 'minute') / (60 * 24))}
            </strong>
            天
          </span>
        </>
      );
    case '0':
      return (
        <>
          <span>
            状态：<Tag color="orange">过期</Tag>
          </span>
          <span>
            剩余： <strong style={{ color: '#fe8019' }}>0</strong>天
          </span>
        </>
      );
    case '2':
      return (
        <>
          <span>
            状态：<Tag color="#2db7f5">试用</Tag>
          </span>
          <span>
            剩余：{' '}
            <strong style={{ color: '#fe8019' }}>
              {Math.floor(moment(info.end_time).diff(moment(Date.now()), 'minute') / (60 * 24))}
            </strong>
            天
          </span>
        </>
      );
    case '3':
      return (
        <>
          <span>
            状态：<Tag color="green">待定</Tag>
          </span>
          <span>
            剩余： <strong style={{ color: '#fe8019' }}>0</strong>天
          </span>
        </>
      );
    default:
      return (
        <>
          <span>
            状态：<Tag color="#f50">异常</Tag>
          </span>
          <span>
            剩余： <strong style={{ color: '#fe8019' }}>0</strong>天
          </span>
        </>
      );
  }
};

@connect(({ accountSettings }) => ({
  currentUser: accountSettings.currentUser,
  uploadToken: accountSettings.uploadToken,
}))
class BaseView extends Component {
  view = undefined;
  state = {
    clubImgLoading: false,
    clubImgUrl: '',
    clubImgUploadKey: '',
    currentRoute: '',
    copied: false,
    logoLoading: false,
    logo: '',
    logoUploadKey: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    let _this = this;
    dispatch({ type: 'accountSettings/fetchCurrent' }).then(() => {
      const { currentUser } = _this.props;
      this.setBaseInfo();
      this.setState({
        clubImgUrl: currentUser.QQ_qrcode,
        logo: currentUser.logo,
        currentRoute: currentUser.route,
      });
    });
  }

  beforeUpload = file => {
    const { dispatch, currentUser } = this.props;
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
      dispatch({ type: 'accountSettings/getUploadToken' }).then(function() {
        console.log(_this.props);
        _this.setState({
          clubImgUploadKey: `club/image/${localStorage.getItem('id')}${Date.now()}QQqrcode`,
        });
      })
    );
  };
  //图片上传
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleClubImgChange = info => {
    const { clubImgUploadKey } = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ clubImgLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, clubImgUrl =>
        this.setState({
          clubImgUrl: `http://club.shitouboy.com/${clubImgUploadKey}`,
          clubImgLoading: false,
        }),
      );
    }
  };

  beforeLogoUpload = file => {
    const { dispatch, currentUser } = this.props;
    const _this = this;
    console.log(file.type);
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/x-icon';
    if (!isJpgOrPng) {
      message.error('你只能上传 JPG/PNG/ICO 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('图片必须小于 10MB!');
    }
    return (
      isJpgOrPng &&
      isLt2M &&
      dispatch({ type: 'accountSettings/getUploadToken' }).then(function() {
        console.log(_this.props);
        _this.setState({
          logoUploadKey: `club/logo/${localStorage.getItem('id')}${Date.now()}logo`,
        });
      })
    );
  };
  handleLogoChange = info => {
    const { logoUploadKey } = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ logoLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, logo =>
        this.setState({
          logo: `http://club.shitouboy.com/${logoUploadKey}`,
          logoLoading: false,
        }),
      );
    }
  };

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    console.log('currentUser', currentUser);
    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'accountSettings/saveInfo',
          payload: {
            QQ_qrcode: this.state.clubImgUrl,
            logo: this.state.logo,
            ...values,
          },
        });
      }
    });
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.clubImgLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传二维码</div>
      </div>
    );
    const logoUploadButton = (
      <div>
        <Icon type={this.state.logoLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传logo</div>
      </div>
    );
    const { currentUser, form } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView}>
        <div>
          <Form layout="vertical" hideRequiredMark>
            <FormItem>
              开始时间: {moment(currentUser.begin_time).format('YYYY-MM-DD hh:mm')}&nbsp;&nbsp;
              到期时间: {moment(currentUser.end_time).format('YYYY-MM-DD hh:mm')}
            </FormItem>
            <FormItem>{statusTag(currentUser)}</FormItem>
            <FormItem>
              <div>
                当前地址：
                <strong style={{ color: '#f50', marginRight: 12 }}>
                  http://www.172jl.com/{this.state.currentRoute}
                </strong>
                <CopyToClipboard
                  text={`http://www.172jl.com/${this.state.currentRoute}`}
                  onCopy={() => {
                    this.setState({ copied: true });
                    message.success('已复制到粘贴板');
                  }}
                >
                  <Button>点此复制</Button>
                </CopyToClipboard>
                <a
                  href="https://shimo.im/docs/yHVPJRC3phxHYc8t"
                  target="blank"
                  style={{ marginLeft: 12 }}
                >
                  <Button>查看文档</Button>
                </a>
                <a href="http://www.172jl.com/jl" target="blank" style={{ marginLeft: 12 }}>
                  <Button>示例网站</Button>
                </a>
              </div>
            </FormItem>

            <FormItem
              label={
                <Tooltip
                  placement="topLeft"
                  title="重要！页面地址 - 会根据地址生成属于您的页面，生成的网站域名为http://mkstone.club/地址"
                >
                  页面地址 - 会根据地址生成属于您的页面！ <Icon type="question-circle" />
                </Tooltip>
              }
            >
              {getFieldDecorator('route', {
                rules: [
                  {
                    required: true,
                    message: '请输入页面地址，会根据地址生成属于您的页面！',
                  },
                ],
              })(
                <Input
                  placeholder="请输入页面地址"
                  onChange={e => this.setState({ currentRoute: e.target.value })}
                />,
              )}
            </FormItem>
            <FormItem
              label={
                <Tooltip placement="topLeft" title="网站的名称，会显示在网页的导航栏和标题栏">
                  网站名称 <Icon type="question-circle" />
                </Tooltip>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '网站名称',
                  },
                ],
              })(<Input placeholder="请输入网站名称" />)}
            </FormItem>
            <FormItem
              label={
                <Tooltip
                  trigger={['hover']}
                  placement="topLeft"
                  title="网站logo，会显示在网页的导航栏和标题栏，并且会把福利详情页的二维码水印替换为当前logo，宽高比最好为1：1"
                >
                  logo <Icon type="question-circle" />
                </Tooltip>
              }
            >
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http://up-z2.qiniup.com"
                data={{
                  token: this.props.uploadToken,
                  key: this.state.logoUploadKey,
                }}
                beforeUpload={this.beforeLogoUpload}
                onChange={this.handleLogoChange}
              >
                {this.state.logo ? (
                  <img src={this.state.logo} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  logoUploadButton
                )}
              </Upload>
            </FormItem>
            <FormItem
              label={
                <Tooltip
                  trigger={['hover']}
                  placement="topLeft"
                  title="把您的QQ群二维码放在页面上显示出来"
                >
                  QQ官方加群二维码 <Icon type="question-circle" />
                </Tooltip>
              }
            >
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http://up-z2.qiniup.com"
                data={{
                  token: this.props.uploadToken,
                  key: this.state.clubImgUploadKey,
                }}
                beforeUpload={this.beforeUpload}
                onChange={this.handleClubImgChange}
              >
                {this.state.clubImgUrl ? (
                  <img src={this.state.clubImgUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </FormItem>
            <FormItem
              label={
                <Tooltip
                  lacement="topLeft"
                  title="网站显示选项，默认显示全部,当前标签显示顺序即为网站标签显示顺序，想更换顺序请自行调换"
                >
                  网站显示选项 <Icon type="question-circle" />{' '}
                </Tooltip>
              }
            >
              {getFieldDecorator('show_options', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择显示选项">
                  {options.map(option => (
                    <Option key={option.key} value={option.key}>
                      {option.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem
              label={
                <Tooltip lacement="topLeft" title="格式：捡漏社区http://www.172jl.com">
                  选项链接 <Icon type="question-circle" />{' '}
                </Tooltip>
              }
            >
              {getFieldDecorator('links', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Select
                  mode="tags"
                  tokenSeparators={[',']}
                  style={{ width: '100%' }}
                  placeholder="请选择显示选项"
                ></Select>,
              )}
            </FormItem>
            <FormItem
              label={
                <Tooltip
                  lacement="topLeft"
                  title="QQ官方加群链接，会和二维码一起展示出来，用户点击即可加群。示例：“点击链接加入群聊【MK-俱乐部】：https://jq.qq.com/?xxxxxxxx”"
                >
                  QQ官方加群链接 <Icon type="question-circle" />{' '}
                  一定要是带有http://xxxxx或https://xxxxx的链接
                </Tooltip>
              }
            >
              {getFieldDecorator('QQ_url', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={
                <Tooltip
                  placement="topLeft"
                  title="一句话广告, 展示在页面的描述或欢迎的词句。示例：“欢迎来到MK俱乐部，xxxxxxxx”"
                >
                  一句话广告 <Icon type="question-circle" />
                </Tooltip>
              }
            >
              {getFieldDecorator('ad', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input.TextArea rows={4} />)}
            </FormItem>
            <FormItem
              label={
                <Tooltip
                  placement="topLeft"
                  title="查券网站地址, 显示在页面公告栏的链接，用户点击即可跳转"
                >
                  查券网站地址 <Icon type="question-circle" />{' '}
                  一定要是带有http://xxxxx或https://xxxxx的链接
                </Tooltip>
              }
            >
              {getFieldDecorator('coupon_url', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={
                <Tooltip placement="topLeft" title="数据源 使用群内数据源见下文">
                  数据源 <Icon type="question-circle" />
                </Tooltip>
              }
            >
              {getFieldDecorator('data_from', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Select style={{ width: 120 }}>
                  <Option value="group">群内数据源</Option>
                  <Option value="riki">默认数据源</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="群内数据源需知">
              <p>
                群内数据源是需要您用软件<strong>采集您的群内消息，并自动推送到您的网站上</strong>。
                <a
                  href="https://shimo.im/docs/K6xpgDjYjrpJDgQY/"
                  target="blank"
                  style={{ marginLeft: 12 }}
                >
                  <Button>点击查看详细设置</Button>
                </a>
              </p>
              <p>
                您还可以把网站上的线报采集并发送到您的群内
                <a
                  href="https://shimo.im/docs/K6xpgDjYjrpJDgQY/"
                  target="blank"
                  style={{ marginLeft: 12 }}
                >
                  <Button>点击查看详细设置</Button>
                </a>
              </p>
            </FormItem>
            <FormItem
              label={
                <Tooltip placement="topLeft" title="pid与sid同为绑定淘宝联盟所需参数">
                  sid <Icon type="question-circle" />{' '}
                  <a
                    href="https://api.zhetaoke.com:10001/api/open_taokeshouquan.ashx?appkey=451350414c4c496aaa41785e8478c20c&backurl=http://static.shitouboy.com/taobaoauth.html&type=1"
                    target="blank"
                    style={{ marginLeft: 12 }}
                  >
                    <Button>授权地址</Button>
                  </a>
                </Tooltip>
              }
            >
              {getFieldDecorator('sid', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={
                <Tooltip placement="topLeft" title="pid与sid同为绑定淘宝联盟所需参数">
                  pid <Icon type="question-circle" />
                </Tooltip>
              }
            >
              {getFieldDecorator('pid', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              更新信息
            </Button>
          </Form>
        </div>
        {/* <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div> */}
      </div>
    );
  }
}

export default Form.create()(BaseView);
