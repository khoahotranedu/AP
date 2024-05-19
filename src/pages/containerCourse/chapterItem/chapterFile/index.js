import classNames from 'classnames/bind';
import styles from '../chaoterItem.module.scss';
import { memo } from 'react';
const cx = classNames.bind(styles);
function ChapterFile({ type, name, linkfile, onclick }) {
    return (
        <a href={linkfile} className={cx('chapter-item')}>
            <div className={cx('icon_file')}>
                <i className={cx('fa-regular', `${type}`)}></i>
            </div>
            <div className={cx('content_file')}>{name}</div>
            {/* <i
                className={cx('icon__delete', 'fa-regular', 'fa-trash-can')}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onclick();
                }}
            ></i> */}
        </a>
    );
}

export default memo(ChapterFile);
