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
/* eslint react/no-multi-comp:0 */
@connect(({ orderList }) => ({
  orderList,
}))
class TableList extends Component {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchAll',
    });
  }
  pay = info => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/payOrder',
      payload: info,
    });
  };
  render() {
    const orderColumns = [
      {
        title: '商户订单号',
        dataIndex: 'out_trade_no',
        key: 'out_trade_no',
        // width: 200
      },
      {
        title: '购买日期',
        dataIndex: 'create_at',
        key: 'create_at',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => moment(b.create_at).valueOf() - moment(a.create_at).valueOf(),
        render: create_at => <a>{moment(create_at).format('YYYY-MM-DD HH:mm:ss')}</a>,
      },
      {
        title: '标题',
        dataIndex: 'subject',
        key: 'subject',
        render: subject => <a>{subject.replace('企鹅酱插件 ', '')}</a>,
        width: 400,
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '状态',
        key: '状态',
        dataIndex: '状态',
        render: () => (
          <span>
            <Tag color={'green'}>支付成功</Tag>
          </span>
        ),
      },
    ];
    const {
      orderList: { orders },
    } = this.props;
    const products = [
      {
        title: '捡漏社区',
        name: 'club_web',
        peroid: 30,
        price: 38,
        peroid_str: '一个月',
      },
      {
        title: '捡漏社区',
        name: 'club_web',
        peroid: 90,
        price: 90,
        peroid_str: '三个月',
      },
      {
        title: '捡漏社区',
        name: 'club_web',
        peroid: 180,
        price: 170,
        peroid_str: '六个月',
      },
      {
        title: '捡漏社区',
        name: 'club_web',
        peroid: 360,
        price: 318,
        peroid_str: '一年',
      },
    ];
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <h2>产品服务</h2>
              <Row gutter={16}>
                {products.map(product => {
                  return (
                    <Col key={product.peroid} span={6}>
                      <Card
                        style={{ marginTop: 16 }}
                        actions={[
                          <a href="https://shimo.im/docs/kCD3WGGtxGqYwdVG/" target="blank">
                            查看文档
                          </a>,
                          <span onClick={() => this.pay(product)}>立即购买</span>,
                        ]}
                      >
                        <Meta
                          avatar={
                            <Avatar src="http://club.shitouboy.com/club/logo/5db166f31cee01684247201f1581159881342logo" />
                          }
                          title="捡漏社区"
                          description={
                            <div style={{ padding: 24, color: '#666', fontSize: 16 }}>
                              <strong>
                                {product.peroid_str}
                                <span style={{ marginLeft: 16, color: 'rgb(239, 87, 77)' }}>
                                  <span style={{ fontSize: 22 }}>￥{product.price}</span>
                                </span>
                              </strong>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className={styles.tableListOperator}></div>
            <Table
              columns={orderColumns}
              dataSource={orders}
              expandedRowRender={record => (
                <p style={{ margin: 0 }}>支付宝交易号：{record.trade_no}</p>
              )}
              title={() => <strong style={{ width: '100%' }}>我的订单</strong>}
              // scroll={{ y: 400 }}
              // size="small"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
