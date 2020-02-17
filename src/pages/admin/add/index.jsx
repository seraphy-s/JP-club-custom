import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  message,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class BasicForm extends Component {
  state = {
    skuLoading: false,
    couponLoading: false,
    disabled: true,
  };
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          // type: 'formBasicForm/submitRegularForm',
          type: 'order/submitOrder',
          payload: values,
        });
      }
    });
  };
  getOrderInfo = () => {
    const { dispatch, form } = this.props;
    let sku = form.getFieldValue('sku');
    let discount_link = form.getFieldValue('discount_link');
    var _this = this;
    if (!sku) {
      message.warning('请输入商品sku！');
      return;
    }
    if (!discount_link) {
      message.warning('请输入优惠券链接！');
      return;
    }
    this.setState({
      skuLoading: true,
      couponLoading: true,
      disabled: true,
    });
    console.log(form.getFieldValue('sku'));
    dispatch({ type: 'order/getSkuInfo', sku: sku }).then(function() {
      console.log('props', _this.props);
      const { skuInfo } = _this.props.order;
      console.log(skuInfo);
      if (skuInfo.s === 0) {
        message.warning('商品已下架或商品sku输入错误!');
        _this.setState({
          skuLoading: false,
          couponLoading: false,
          disabled: true,
        });
      } else {
        form.setFields({
          img: { value: skuInfo.data.img },
          price: { value: skuInfo.data.price },
          title: { value: skuInfo.data.title },
          commission_propo: { value: skuInfo.data.rate },
        });
        _this.setState({
          skuLoading: false,
        });
        dispatch({ type: 'order/getCouponInfo', discount_link: discount_link }).then(function() {
          console.log(_this.props.order.couponInfo);
          const { couponInfo } = _this.props.order;
          if (couponInfo.return == 0) {
            let real_price = skuInfo.data.price - couponInfo.result.discount;
            form.setFields({
              discount: { value: couponInfo.result.discount },
              coupon_total: { value: couponInfo.result.num },
              coupon_start: { value: couponInfo.result.beginTime },
              coupon_end: { value: couponInfo.result.endTime },
              coupon_rest: { value: couponInfo.result.remainNum },
              real_price: { value: real_price },
              commission: { value: (real_price * skuInfo.data.rate * 0.01).toFixed(2) },
            });
            _this.setState({
              couponLoading: false,
              disabled: false,
            });
          } else {
            message.warning('优惠券链接已过期或优惠券链接错误！');
            _this.setState({
              couponLoading: false,
              disabled: true,
            });
          }
        });
      }
    });
  };
  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
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
    return (
      <PageHeaderWrapper content={<FormattedMessage id="form-basic-form.basic.description" />}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label={'商品sku'}>
              {getFieldDecorator('sku', {
                initialValue: '11867575754',
                rules: [
                  {
                    required: true,
                    message: '请输入商品sku',
                  },
                ],
              })(<Input placeholder="eg：37073826568" formatter={value => `${value}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'服务费比例'}>
              {getFieldDecorator('fee_propo', {
                rules: [
                  {
                    required: true,
                    message: '请输入服务费比例',
                  },
                ],
              })(<InputNumber formatter={value => `${value} %`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'优惠券链接'}>
              {getFieldDecorator('discount_link', {
                initialValue:
                  'https://coupon.m.jd.com/coupons/show.action?key=888455c900ae433f9bee028769c0b1bf&roleId=22767311&to=fangbeisi.jd.com',
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券链接',
                  },
                ],
              })(
                <Input
                  placeholder={
                    'eg：https://coupon.m.jd.com/coupons/show.action?key=4c83410744244729aa601484411c43e3&roleId=21374723&to=mall.jd.com/index-748821.html'
                  }
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'推广文案及二合一链接'}>
              {getFieldDecorator('link', {
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
            <Button
              type="primary"
              loading={this.state.skuLoading && this.state.couponLoading}
              style={{
                position: 'relative',
                left: '50%',
                marginBottom: 24,
                transform: 'translate(-50%, 0)',
              }}
              onClick={this.getOrderInfo}
            >
              一键获取商品及优惠券信息
            </Button>
            <FormItem {...formItemLayout} label={'商品短标题'}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品短标题',
                  },
                ],
              })(
                <Input
                  disabled
                  // placeholder={'eg：吸黑提亮黑面膜 30片装'}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'原价'}>
              {getFieldDecorator('price', {
                rules: [
                  {
                    required: true,
                    message: '请输入原价',
                  },
                ],
              })(<InputNumber disabled placeholder="原价" formatter={value => `¥ ${value}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'券后价'}>
              {getFieldDecorator('real_price', {
                rules: [
                  {
                    required: true,
                    message: '请输入券后价',
                  },
                ],
              })(<InputNumber disabled formatter={value => `¥ ${value}`} />)}
            </FormItem>
            <FormItem>
              <img
                style={{ position: 'relative', left: '30%' }}
                src={this.props.form.getFieldValue('img')}
                width={100}
                height={100}
              />
            </FormItem>
            <FormItem {...formItemLayout} label={'商品主图'}>
              {getFieldDecorator('img', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品主图',
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'佣金比例'}>
              {getFieldDecorator('commission_propo', {
                rules: [
                  {
                    required: true,
                    message: '请输入佣金比例',
                  },
                ],
              })(<InputNumber Col={30} disabled formatter={value => `${value} %`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'佣金'}>
              {getFieldDecorator('commission', {
                rules: [
                  {
                    required: true,
                    message: '请输入佣金',
                  },
                ],
              })(<InputNumber disabled formatter={value => `¥ ${value}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'优惠券值'}>
              {getFieldDecorator('discount', {
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券值',
                  },
                ],
              })(<InputNumber disabled formatter={value => `¥ ${value}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'优惠券总量'}>
              {getFieldDecorator('coupon_total', {
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券总量',
                  },
                ],
              })(<InputNumber disabled formatter={value => `${value}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'优惠券剩余'}>
              {getFieldDecorator('coupon_rest', {
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券剩余量',
                  },
                ],
              })(<InputNumber disabled formatter={value => `${value}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'优惠券开始时间'}>
              {getFieldDecorator('coupon_start', {
                rules: [
                  {
                    // defaultValue: '3天',
                    required: true,
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'优惠券结束时间'}>
              {getFieldDecorator('coupon_end', {
                rules: [
                  {
                    // defaultValue: '3天',
                    required: true,
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'推广时间'}>
              {getFieldDecorator('time', {
                initialValue: '3天',
              })(<Input disabled />)}
            </FormItem>
            {/* <FormItem
              {...formItemLayout}
              label={'推广结束时间'}
            >
              {getFieldDecorator('end_time', {
                rules: [
                  {
                    required: true,
                    message: '请输入推广结束时间',
                  },
                ],
              })(
                <DatePicker
                  placeholder={'请选择日期'}
                />,
              )}
            </FormItem> */}
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={this.state.disabled}
              >
                <FormattedMessage id="form-basic-form.form.save" />
              </Button>
              {/* <Button
                style={{
                  marginLeft: 8,
                }}
              >
                <FormattedMessage id="form-basic-form.form.save" />
              </Button> */}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ order, loading }) => ({
    order,
    submitting: loading.effects['formBasicForm/submitRegularForm'],
  }))(BasicForm),
);
