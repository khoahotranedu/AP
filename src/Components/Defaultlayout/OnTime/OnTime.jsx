import React from 'react'
import classNames from 'classnames/bind';
import styles from './Ontime.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const OnTime = () => {
  return (
    <Link to="/course/addcourse/list" className={cx('link')}>
                            Đăng ký
                        </Link>
  )
}

export default OnTime