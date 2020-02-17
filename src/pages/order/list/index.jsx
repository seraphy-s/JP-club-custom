import {
  Avatar,
  Button,
  Badge,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Divider,
  Form,
  Icon,
  Input,
  Table,
  InputNumber,
  Tag,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Result,
  Upload,
  message,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import styles from './style.less';
import { get } from 'http';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ listBasicList, loading }) => ({
  listBasicList,
  loading: loading.models.listBasicList,
}))
class BasicList extends Component {
  state = {
    visible: false,
    orderUploadVisible: false,
    currentOrder: {},
    done: false,
    current: {},
    extraCol: [],
    currentCondition: '1',
    orderImgLoading: false,
    orderImgUrl: '',
    orderImgUploadKey: '',
    previewVisible: false,
    previewImage: '',
    data: [
      {
        _id: 1,
        title: '收拾收拾',
        update_time: '123',
        type: '电脑',
        price: '22',
        discount: '33',
        commission: '10%',
        end_time: '1995-05-15',
        status: '1',
      },
      {
        _id: 2,
        title: '收拾收拾',
        update_time: '123',
        type: '电脑',
        price: '22',
        discount: '33',
        commission: '10%',
        end_time: '1995-05-15',
        status: '0',
      },
      {
        id: 3,
        title: '收拾收拾',
        update_time: '123',
        type: '电脑',
        price: '22',
        discount: '33',
        commission: '10%',
        end_time: '1995-05-15',
        status: '2',
      },
    ],
  };
  formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };
  addBtn = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/status',
      payload: {
        id: this.state.currentCondition,
      },
    });
    dispatch({
      type: 'listBasicList/getCounts',
    });
    dispatch({
      type: 'listBasicList/check',
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };
  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };
  showOrderUploadModal = item => {
    this.setState({
      orderUploadVisible: true,
      currentOrder: item,
      orderImgLoading: false,
      orderImgUrl: item.orderImgUrl || '',
    });
  };
  //结算
  payOrder = item => {
    const { dispatch } = this.props
    dispatch({
      type: 'listBasicList/pay',
      payload: item
    });
  };
  //图片上传
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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
      dispatch({ type: 'listBasicList/getUploadToken' }).then(function() {
        console.log(_this.props);
        _this.setState({
          orderImgUploadKey: `order/image/${file.name}`,
        });
      })
    );
  };

  handleOrderImgChange = info => {
    const { orderImgUploadKey } = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ orderImgLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, orderImgUrl =>
        this.setState({
          orderImgUrl: `http://pxee13dqq.bkt.clouddn.com/${orderImgUploadKey}`,
          orderImgLoading: false,
        }),
      );
    }
  };

  //上报订单
  handleOrderUploadSubmit = () => {
    // e.preventDefault();
    console.log('上报订单');
    const _this = this;
    const { dispatch, form } = this.props;
    const { currentOrder, orderImgUrl } = this.state;
    // console.log(form)
    form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err, 'validate error');
      }
      dispatch({
        type: 'listBasicList/uploadOrderInfo',
        payload: {
          _id: currentOrder._id,
          order_num: fieldsValue.order_num,
          orderImgUrl: orderImgUrl,
        },
      }).then(function() {
        _this.setState({
          orderUploadVisible: false,
        });
        dispatch({ type: 'listBasicList/getCounts' });
      });
    });
  };
  handleOrderUploadCancel = () => {
    this.setState({
      orderUploadVisible: false,
    });
  };
  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };
  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current._id : '';
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'listBasicList/edit',
        payload: {
          id,
          value: fieldsValue,
        },
      }).then(() => {
        dispatch({
          type: 'listBasicList/status',
          payload: {
            id: this.state.currentCondition,
          },
        });
        dispatch({
          type: 'listBasicList/getCounts',
        });
      });
    });
  };

  handleFetch = id => {
    let extraCol = [];
    console.log(id);
    switch (id) {
      case '4': //被驳回
        console.log(1, extraCol);
        extraCol = [
          {
            title: '驳回原因',
            dataIndex: 'reject_reason',
          },
        ];
        break;
      case '5': // 5 推完待上报
        break;
      case '6': // 6 未结算
        extraCol = [
          {
            title: '服务费总额',
            dataIndex: 'fee',
          },
        ];
        break;
      case '7': //已结算
        console.log(2, extraCol);
        extraCol = [
          {
            title: '结算',
            dataIndex: 'discount',
          },
          {
            title: '订单数',
            dataIndex: 'commission',
          },
        ];
        break;
    }
    console.log(3, extraCol);
    this.setState({
      currentCondition: id,
      extraCol: extraCol,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'listBasicList/status',
      payload: {
        id,
      },
    });
  };
  render() {
    const {
      listBasicList: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current } = this.state;

    // const editAndDelete = (key, currentItem) => {
    //   if (key === 'edit') this.showEditModal(currentItem);
    //   else if (key === 'delete') {
    //     Modal.confirm({
    //       title: '删除任务',
    //       content: '确定删除该任务吗？',
    //       okText: '确认',
    //       cancelText: '取消',
    //       onOk: () => this.deleteItem(currentItem.id),
    //     });
    //   }
    // };

    const modalFooter = done
      ? {
          footer: null,
          onCancel: this.handleDone,
        }
      : {
          okText: '保存',
          onOk: this.handleSubmit,
          onCancel: this.handleCancel,
        };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const badgeStyle = {
      width: 'auto',
      height: 16,
      fontSize: 8,
      lineHeight: '16px',
      borderRadius: '8px',
      minWidth: 16,
      padding: '0 4px',
    };
    const badgeZeroStyle = {
      width: 16,
      height: 16,
      fontSize: 8,
      lineHeight: '16px',
      borderRadius: '50%',
      minWidth: 16,
      padding: 0,
      backgroundColor: '#fff',
      color: '#999',
      boxShadow: '0 0 0 1px #d9d9d9 inset',
    };
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="1">
          <RadioButton value="all" onClick={() => this.handleFetch('all')}>
            全部{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts.all === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts.all || 0}
            />
          </RadioButton>
          <RadioButton value="2" onClick={() => this.handleFetch('2')}>
            未推广{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['2'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['2'] || 0}
            />
          </RadioButton>
          <RadioButton value="3" onClick={() => this.handleFetch('3')}>
            审核中{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['3'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['3'] || 0}
            />
          </RadioButton>
          <RadioButton value="4" onClick={() => this.handleFetch('4')}>
            被驳回{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['4'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['4'] || 0}
            />
          </RadioButton>
          <RadioButton value="1" onClick={() => this.handleFetch('1')}>
            推广中{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['1'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['1'] || 0}
            />
          </RadioButton>
          <RadioButton value="5" onClick={() => this.handleFetch('5')}>
            推完待上报{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['5'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['5'] || 0}
            />
          </RadioButton>
          <RadioButton value="6" onClick={() => this.handleFetch('6')}>
            未结算{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['6'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['6'] || 0}
            />
          </RadioButton>
          <RadioButton value="7" onClick={() => this.handleFetch('7')}>
            已结算{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['7'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['7'] || 0}
            />
          </RadioButton>
          <RadioButton value="0" onClick={() => this.handleFetch('0')}>
            报单失败{' '}
            <Badge
              showZero
              style={this.props.listBasicList.counts['0'] === 0 ? badgeZeroStyle : badgeStyle}
              count={this.props.listBasicList.counts['0'] || 0}
            />
          </RadioButton>
        </RadioGroup>
        {/* <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} /> */}
      </div>
    );
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };
    // { moment(createdAt).format('YYYY-MM-DD HH:mm') }
    const handleDel = item => {
      const { dispatch } = this.props;
      const id = item._id;
      dispatch({
        type: 'listBasicList/del',
        payload: {
          id,
        },
      }).then(() => {
        dispatch({
          type: 'listBasicList/status',
          payload: {
            id: this.state.currentCondition,
          },
        });
        dispatch({
          type: 'listBasicList/getCounts',
        });
      });
    };

    const handlePromote = item => {
      const { dispatch } = this.props;
      const id = item._id;
      dispatch({
        type: 'listBasicList/promote',
        payload: {
          id,
        },
      }).then(() => {
        dispatch({
          type: 'listBasicList/status',
          payload: {
            id: this.state.currentCondition,
          },
        });
        dispatch({
          type: 'listBasicList/getCounts',
        });
      });
    };

    const handleUnPromote = item => {
      const { dispatch } = this.props;
      const id = item._id;
      dispatch({
        type: 'listBasicList/unpromote',
        payload: {
          id,
        },
      }).then(() => {
        dispatch({
          type: 'listBasicList/status',
          payload: {
            id: this.state.currentCondition,
          },
        });
        dispatch({
          type: 'listBasicList/getCounts',
        });
      });
    };

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };

    const columns = [
      {
        title: '推广文案',
        dataIndex: 'link',
        width: 120,
      },
      {
        title: '券领取量',
        dataIndex: 'coupon_gotten',
        render: (o, i) => <span>{i.coupon_total - i.coupon_rest}</span>,
      },
      {
        title: '券总量',
        dataIndex: 'coupon_total',
      },
      {
        title: '券剩余量',
        key: 'coupon_rest',
        dataIndex: 'coupon_rest',
      },
      {
        title: '券开始时间',
        dataIndex: 'coupon_start',
        render: (coupon_start, item) => <span>{moment(coupon_start).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '券结束时间',
        dataIndex: 'coupon_end',
        render: (coupon_start, item) => <span>{moment(coupon_start).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '佣金比例',
        dataIndex: 'commission_propo',
        render: commission_prop => <span>{commission_prop} %</span>,
      },
      {
        title: '券后价',
        dataIndex: 'real_price',
      },
      {
        title: '服务费比例',
        dataIndex: 'fee_propo',
        render: fee_propo => <span>{fee_propo} %</span>,
      },
      {
        title: '单品服务费',
        key: 'single_fee',
        render: (o, i) => <span>{(i.fee_propo * i.real_price * 0.01).toFixed(2)}</span>,
      },
      {
        title: '状态',
        width: 120,
        align: 'center',
        render: item => {
          switch (item.status) {
            case '1':
              return <Badge status="processing" text={<Tag color="green">推广中</Tag>} />;
            case '2':
              return <Badge status="default" text={<Tag color="geekblue">未推广</Tag>} />;
            case '0':
              return <Badge status="warning" text={<Tag color="red">报单失败</Tag>} />;
            case '3':
              return <Badge status="yellow" text={<Tag color="#87d068">审核中</Tag>} />;
            case '4':
              return <Badge status="warning" text={<Tag color="volcano">被驳回</Tag>} />;
            case '5':
              return <Badge status="orange" text={<Tag color="#2db7f5">待上报</Tag>} />;
            case '6':
              return <Badge status="success" text={<Tag color="cyan">未结算</Tag>} />;
            case '7':
              return <Badge status="cyan" text={<Tag color="#108ee9">已结算</Tag>} />;
            default:
              return <></>;
          }
        },
      },
      ...this.state.extraCol,
      {
        title: '操作',
        render: item => {
          switch (item.status) {
            case '1': //推广中
              return (
                <a
                  onClick={() => {
                    Modal.confirm({
                      title: '取消推广',
                      content: (
                        <div>
                          <h4>确定取消推广该商品吗？?</h4>
                          <p>{item.link}</p>
                        </div>
                      ),
                      okText: '确认',
                      cancelText: '取消',
                      onOk: () => handleUnPromote(item),
                    });
                  }}
                >
                  取消推广
                </a>
              );
            case '0': //报单失败
              return (
                <>
                  <a onClick={() => this.showOrderUploadModal(item)}>重新报单</a>
                  <Divider type="vertical" />
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="edit" onClick={() => this.showEditModal(item)}>
                          编辑
                        </Menu.Item>
                        <Menu.Item
                          key="delete"
                          onClick={() => {
                            Modal.confirm({
                              title: '删除商品',
                              content: (
                                <div>
                                  <h4>确定删除该商品吗?</h4>
                                  <p>{item.link}</p>
                                </div>
                              ),
                              okText: '确认',
                              cancelText: '取消',
                              onOk: () => handleDel(item),
                            });
                          }}
                        >
                          删除
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <a>
                      更多 <Icon type="down" />
                    </a>
                  </Dropdown>
                </>
              );
            case '2': //未推广
              return (
                <>
                  <a
                    onClick={() =>
                      Modal.confirm({
                        title: '推广商品',
                        content: (
                          <div>
                            <h4>确定推广该商品吗?</h4>
                            <p>{item.link}</p>
                          </div>
                        ),
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => handlePromote(item),
                      })
                    }
                  >
                    推广
                  </a>
                  <Divider type="vertical" />
                  <Dropdown
                    overlay={
                      <Menu
                      // onClick={({ key }) => editAndDelete(key, item)}
                      >
                        <Menu.Item key="edit" onClick={() => this.showEditModal(item)}>
                          编辑
                        </Menu.Item>
                        <Menu.Item
                          key="delete"
                          onClick={() => {
                            Modal.confirm({
                              title: '删除商品',
                              content: (
                                <div>
                                  <h4>确定删除该商品吗?</h4>
                                  <p>{item.link}</p>
                                </div>
                              ),
                              okText: '确认',
                              cancelText: '取消',
                              onOk: () => handleDel(item),
                            });
                          }}
                        >
                          删除
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <a>
                      更多 <Icon type="down" />
                    </a>
                  </Dropdown>
                </>
              );
            case '3': // 3 审核中
              return <></>;
            case '4': // 4 被驳回
              return (
                <>
                  <a onClick={() => this.showEditModal(item)}>编辑</a>
                  <Divider type="vertical" />
                  <Dropdown
                    overlay={
                      <Menu
                      // onClick={({ key }) => editAndDelete(key, item)}
                      >
                        <Menu.Item
                          key="edit"
                          onClick={() =>
                            Modal.confirm({
                              title: '推广商品',
                              content: (
                                <div>
                                  <h4>确定推广该商品吗?</h4>
                                  <p>{item.link}</p>
                                </div>
                              ),
                              okText: '确认',
                              cancelText: '取消',
                              onOk: () => handlePromote(item),
                            })
                          }
                        >
                          推广
                        </Menu.Item>
                        <Menu.Item
                          key="delete"
                          onClick={() => {
                            Modal.confirm({
                              title: '删除商品',
                              content: (
                                <div>
                                  <h4>确定删除该商品吗?</h4>
                                  <p>{item.link}</p>
                                </div>
                              ),
                              okText: '确认',
                              cancelText: '取消',
                              onOk: () => handleDel(item),
                            });
                          }}
                        >
                          删除
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <a>
                      更多 <Icon type="down" />
                    </a>
                  </Dropdown>
                </>
              );
            case '5': // 5 推完待上报
              return (
                <>
                  <a onClick={() => this.showOrderUploadModal(item)}>上报</a>
                </>
              );
            case '6': // 6 未结算
              return (
              <>
                <a onClick={() => this.payOrder(item)}>结算</a>
              </>);
            case '7': // 7 已结算
              return <></>;
            default:
              return <></>;
          }
        },
      },
    ];
    const expandedRowRender = record => {
      const expandedColumns = [
        {
          title: '商品标题',
          dataIndex: 'title',
          width: 180,
        },
        {
          title: '更新时间',
          // dataIndex: 'update_time',
          render: item => <span>{moment(item.update_time).format('YYYY-MM-DD')}</span>,
        },
        {
          title: '原价',
          dataIndex: 'price',
        },
        {
          title: '券值',
          dataIndex: 'discount',
        },
        {
          title: '佣金',
          dataIndex: 'commission',
          render: commission => <span>{commission.toFixed(2)}</span>,
        },
        // {
        //   title: '券使用量',
        //   dataIndex: 'coupon_used',
        // },
        {
          title: '到期时间',
          render: item => <span>{moment(item.end_time).format('YYYY-MM-DD')}</span>,
        },
      ];
      const data = this.props.listBasicList.list.find(item => item._id === record._id);
      return <Table columns={expandedColumns} dataSource={[data]} pagination={false} />;
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.orderImgLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传订单截图</div>
      </div>
    );
    const { orderImgUrl, orderImgUploadKey } = this.state;
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card bordered={false}>
              <Row>
                <Col sm={8} xs={24}>
                  <Info
                    title="全部商品"
                    value={this.props.listBasicList.counts.all || 0}
                    bordered
                  />
                </Col>
                <Col sm={8} xs={24}>
                  <Info
                    title="正在推广中"
                    value={this.props.listBasicList.counts['1'] || 0}
                    bordered
                  />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="即将到期" value={this.props.listBasicList.counts.invalid || 0} />
                </Col>
              </Row>
            </Card>

            <Card
              className={styles.listCard}
              bordered={false}
              title="商品列表"
              style={{
                marginTop: 24,
              }}
              bodyStyle={{
                padding: '0 32px 40px 32px',
              }}
              extra={extraContent}
            >
              {/* <Button
                type="dashed"
                style={{
                  width: '100%',
                  marginBottom: 8,
                }}
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  // eslint-disable-next-line  react\no-find-dom-node
                  this.addBtn = findDOMNode(component);
                }}
              >
                添加
              </Button> */}
              <Table
                columns={columns}
                size={'small'}
                expandedRowRender={record => expandedRowRender(record)}
                dataSource={this.props.listBasicList.list}
                bordered
                // title={() => {header}}
              />
            </Card>
          </div>
        </PageHeaderWrapper>

        <Modal
          title={done ? null : `商品${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={
            done
              ? {
                  padding: '72px 0',
                }
              : {
                  padding: '28px 0 0',
                }
          }
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {done ? (
            <Result
              status="success"
              title="操作成功"
              subTitle=""
              extra={
                <Button type="primary" onClick={this.handleDone}>
                  知道了
                </Button>
              }
              className={styles.formResult}
            />
          ) : (
            <Form
              onSubmit={this.handleSubmit}
              hideRequiredMark
              style={{
                marginTop: 8,
              }}
            >
              <FormItem {...formItemLayout} label={'服务费比例'}>
                {getFieldDecorator('fee_propo', {
                  initialValue: current._fee_propo,
                  rules: [
                    {
                      required: true,
                      message: '请输入服务费比例',
                    },
                  ],
                })(<InputNumber formatter={value => `${value} %`} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={'推广文案及二合一链接'}>
                {getFieldDecorator('link', {
                  initialValue: current.link,
                  rules: [
                    {
                      required: true,
                      message: '请输入推广文案及二合一链接',
                    },
                  ],
                })(
                  <TextArea
                    style={{
                      minHeight: 32,
                    }}
                    placeholder={
                      'eg: 纸车！抽纸32包 评价不错 卷后26.9，折合一包不到一块钱。 https://u.jd.com/ct0Fq4'
                    }
                    rows={4}
                  />,
                )}
              </FormItem>
              <FormItem
                {...submitFormLayout}
                style={{
                  marginTop: 32,
                }}
              ></FormItem>
            </Form>
          )}
        </Modal>
        <Modal
          title="订单上报"
          visible={this.state.orderUploadVisible}
          onOk={() => this.handleOrderUploadSubmit()}
          onCancel={this.handleOrderUploadCancel}
          confirmLoading={this.props.listBasicList.uploadOrderInfoLoading}
        >
          <Form
            onSubmit={this.handleOrderUploadSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label={'上传订单截图'}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http://up-z2.qiniup.com"
                data={{
                  token: this.props.listBasicList.uploadToken,
                  key: this.state.orderImgUploadKey,
                }}
                beforeUpload={this.beforeUpload}
                onChange={this.handleOrderImgChange}
              >
                {orderImgUrl ? (
                  <img src={orderImgUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label={'订单数'}>
              {getFieldDecorator('order_num', {
                initialValue: this.state.currentOrder.order_num || '',
                rules: [
                  {
                    required: true,
                    message: '请输入订单数',
                  },
                ],
              })(<InputNumber />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'订单图注意事项'}>
              <p>请保证订单截图各项完整。</p>
            </FormItem>
            <div style={{ width: '100%', padding: '0 32px' }}>
              <p>正确示例：</p>
              <img
                style={{ width: 400, height: 400 }}
                onClick={() => {
                  this.setState({
                    previewVisible: true,
                    previewImage: 'http://pxee13dqq.bkt.clouddn.com/image/order/example/right.png',
                  });
                }}
                src="http://pxee13dqq.bkt.clouddn.com/image/order/example/right.png"
              />
              <p>错误示例：</p>
              <img
                style={{ width: 400, height: 400 }}
                onClick={() => {
                  this.setState({
                    previewVisible: true,
                    previewImage: 'http://pxee13dqq.bkt.clouddn.com/image/order/example/wrong.png',
                  });
                }}
                src="http://pxee13dqq.bkt.clouddn.com/image/order/example/wrong.png"
              />
            </div>
          </Form>
        </Modal>
        <Modal
          width={'64%'}
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </>
    );
  }
}

export default Form.create()(BasicList);
