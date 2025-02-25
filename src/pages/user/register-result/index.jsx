import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import styles from './style.less';
const actions = (
  <div className={styles.actions}>
    {/* <a href="">
      <Button size="large" type="primary">
        <FormattedMessage id="user-register-result.register-result.view-mailbox" />
      </Button>
    </a> */}
    <Link to="/user/login">
      <Button size="large">
        <FormattedMessage id="user-register-result.register-result.back-home" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="user-register-result.register-result.msg"
          values={{
            email: location.state ? location.state.account : '',
          }}
        />
      </div>
    }
    subTitle={formatMessage({
      id: 'user-register-result.register-result.activation-email',
    })}
    extra={actions}
  />
);

export default RegisterResult;
