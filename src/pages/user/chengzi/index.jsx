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
  Statistic,
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
@connect(({ chengzi }) => ({
  chengzi,
}))
class TableList extends Component {
  state = {};

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'chengzi/fetchAll',
    // });
  }
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
      chengzi: { orders },
    } = this.props;
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="总订单数"
                        value={0}
                        precision={0}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="本月订单数"
                        value={0}
                        precision={0}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="本月订单金额"
                        value={0}
                        precision={0}
                        valueStyle={{ color: '#cf1322' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
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
