import classNames from 'classnames/bind';
import styles from '../chaoterItem.module.scss';
import { memo } from 'react';
import { UseStore } from '~/Store';
import { useState } from 'react';

const cx = classNames.bind(styles);
function ChapterFile({ type, name, linkfile, onclick }) {
    let [state] = UseStore();
    let { todos } = state;
    let [typePerson] = useState(todos.job);
    return (
        <a href={linkfile} className={cx('chapter-item')}>
            <div className={cx('icon_file')}>
                <i className={cx('fa-regular', `${type}`)}></i>
            </div>
            <div className={cx('content_file')}>{name}</div>
            {typePerson !== 'student' && (
                <i
                    className={cx('icon__delete', 'fa-regular', 'fa-trash-can')}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onclick();
                    }}
                ></i>
            )}
        </a>
    );
}

export default memo(ChapterFile);
