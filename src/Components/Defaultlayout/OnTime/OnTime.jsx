import React from 'react';
import classNames from 'classnames/bind';
import styles from './Ontime.module.scss';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const OnTime = ({ id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem('getIdx', id);
    navigate("/course/addcourse/list");
  };

  return (
    <a className={cx('link')} onClick={handleClick}>
      Đăng ký
    </a>
  );
};

export default OnTime;
