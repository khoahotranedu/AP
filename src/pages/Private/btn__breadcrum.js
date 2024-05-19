import classNames from 'classnames/bind';
import styles from './Private.module.scss';
const cx = classNames.bind(styles);
function BreadcrumbIteam({ children, icon, active, onClick }) {
    return (
        <div className={cx('btn_bread', { active })} onClick={onClick}>
            {children}
            {icon && <span className={cx('icon-close')}>{icon}</span>}
        </div>
    );
}

export default BreadcrumbIteam;
