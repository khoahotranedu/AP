import classNames from 'classnames/bind';
import styles from './itemMenu.module.scss';
import ItemMenu from '../item';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import { Wrapper as ProperWrapper } from '../../proper';
import { useState } from 'react';
const cx = classNames.bind(styles);
function Menu({ children }) {
    const MenuItem = [
        {
            content: 'Đăng ký môn',
        },
        {
            content: 'Lịch',
        },
        {
            content: 'Đăng xuất',
        },
    ];
    return (
        <Tippy
            interactive="true"
            placement="bottom-end"
            delay={[100, 300]}
            render={(attrs) => (
                <div className={cx('menu')} tabIndex="-1" {...attrs}>
                    <ProperWrapper className={cx('propperwrapper')}>
                        {MenuItem.map((item) => {
                            return <ItemMenu key={item.content} content={item.content} icon={item.icon} />;
                        })}
                    </ProperWrapper>
                </div>
            )}
        >
            <div>{children}</div>
        </Tippy>
    );
}

export default Menu;
