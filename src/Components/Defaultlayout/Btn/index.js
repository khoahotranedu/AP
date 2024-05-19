import classNames from 'classnames/bind';
import styles from './Btn.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
function Button({
    to,
    href,
    size,
    className,
    rounded = false,
    iconleft = false,
    iconright = false,
    primary = false,
    outline = false,
    text = false,
    disabled = false,
    onClick,
    children,
}) {
    let Comp = 'button';
    const props = { onClick };
    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    if (disabled) {
        delete props.onClick;
    }
    const classes = cx('wrapper', `size__${size}`, {
        primary,
        outline,
        text,
        disabled,
        rounded,
        [className]: { className },
    });

    return (
        <Comp className={classes} {...props}>
            {iconleft && <span className={cx('icon')}>{iconleft}</span>}
            <span className={cx('content')}>{children}</span>
        </Comp>
    );
}

export default Button;
