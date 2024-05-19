import classNames from 'classnames/bind';
import styles from '../subMHList.module.scss';

const cx = classNames.bind(styles);
function IteamSearch({ stt, Id, name, type, onclick, ondelete }) {
    return (
        <div className={cx('search__list-item')} onClick={onclick}>
            <ul className={cx('search__item-base')}>
                <li className={cx('search__item-base-stt')}>{stt}</li>
                <li className={cx('search__item-base-code')}>{Id}</li>
                <li className={cx('search__item-base-name')}>{name}</li>
                {type === 'admin' && (
                    <li
                        className={cx('search__item-base-delete')}
                        onClick={(e) => {
                            e.stopPropagation();

                            e.preventDefault();
                            ondelete();
                        }}
                    >
                        Xóa
                    </li>
                )}
            </ul>
        </div>
    );
}

export default IteamSearch;
