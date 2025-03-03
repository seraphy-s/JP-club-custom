import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import { connect } from 'dva';
import styles from './GeographicView.less';
const { Option } = Select;
const nullSelectItem = {
  label: '',
  key: '',
};

@connect(({ accountSettings, loading }) => {
  const { province, city } = accountSettings;
  return {
    province,
    city,
    loading: loading.models.accountSettings,
  };
})
class GeographicView extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;

    if (dispatch) {
      // dispatch({
      //   type: 'accountSettings/fetchProvince',
      // });
    }
  };

  componentDidUpdate(props) {
    const { dispatch, value } = this.props;

    if (!props.value && !!value && !!value.province) {
      if (dispatch) {
        dispatch({
          type: 'accountSettings/fetchCity',
          payload: value.province.key,
        });
      }
    }
  }

  getProvinceOption() {
    const { province } = this.props;

    if (province) {
      return this.getOption(province);
    }

    return [];
  }

  getCityOption = () => {
    const { city } = this.props;

    if (city) {
      return this.getOption(city);
    }

    return [];
  };
  getOption = list => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={0}>
          没有找到选项
        </Option>
      );
    }

    return list.map(item => (
      <Option key={item.id} value={item.id}>
        {item.name}
      </Option>
    ));
  };
  selectProvinceItem = item => {
    const { dispatch, onChange } = this.props;

    if (dispatch) {
      dispatch({
        type: 'accountSettings/fetchCity',
        payload: item.key,
      });
    }

    if (onChange) {
      onChange({
        province: item,
        city: nullSelectItem,
      });
    }
  };
  selectCityItem = item => {
    const { value, onChange } = this.props;

    if (value && onChange) {
      onChange({
        province: value.province,
        city: item,
      });
    }
  };

  conversionObject() {
    const { value } = this.props;

    if (!value) {
      return {
        province: nullSelectItem,
        city: nullSelectItem,
      };
    }

    const { province, city } = value;
    return {
      province: province || nullSelectItem,
      city: city || nullSelectItem,
    };
  }

  render() {
    const { province, city } = this.conversionObject();
    const { loading } = this.props;
    return (
      <Spin spinning={loading} wrapperClassName={styles.row}>
        <Select
          className={styles.item}
          value={province}
          labelInValue
          showSearch
          onSelect={this.selectProvinceItem}
        >
          {this.getProvinceOption()}
        </Select>
        <Select
          className={styles.item}
          value={city}
          labelInValue
          showSearch
          onSelect={this.selectCityItem}
        >
          {this.getCityOption()}
        </Select>
      </Spin>
    );
  }
}

export default GeographicView;
