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
    state = {};
    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'listBasicList/fetch',
      });
    }
    render() {
      const columns = [
        {
          title: '推广文案',
          dataIndex: 'link',
          width: 240,
        },
        {
          title: '主图',
          dataIndex: 'img',
          render: img => (<img src={img} style={{width: 80, height: 80}}/>)
        },
        {
          title: '原价',
          dataIndex: 'price',
          sorter: (a, b) => a.price - b.price
        },
        {
          title: '券后价',
          dataIndex: 'real_price',
          sorter: (a, b) => a.real_price - b.real_price

        },
        {
          title: '佣金比例',
          dataIndex: 'commission_propo',
          render: commission_prop => <span>{commission_prop} %</span>,
          sorter: (a, b) => a.commission_prop - b.commission_prop
        },
        {
          title: '佣金',
          dataIndex: 'commission',
          render: commission => <span>{commission.toFixed(2)}</span>,
          sorter: (a, b) => a.commission - b.commission
        },
        {
          title: '操作',
          render: item => (<a>复制文案并转链</a>)
        }
      ]
        return ( 
          <> 
            <PageHeaderWrapper>
                <Card
                  className={styles.listCard}
                  bordered={false}
                  title="商品列表"
                  style={{
                    marginTop: 24,
                  }}
                  bodyStyle={{
                    padding: '24px 32px 40px 32px',
                  }}
                >
                  <Table
                    columns={columns}
                    dataSource={this.props.listBasicList.list}
                    bordered
                  />
                </Card>
              </PageHeaderWrapper>
          </>
      );
    }
}

export default Form.create()(BasicList);
