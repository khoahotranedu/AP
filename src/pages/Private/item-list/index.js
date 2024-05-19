import classNames from 'classnames/bind';
import styles from './item-list.module.scss';
import { useState, useRef } from 'react';
const cx = classNames.bind(styles);
function ItemList({ index, MSSV, name, faculty, ondelete, onchange }) {
    const [show, setshow] = useState(false);
    const idref = useRef();
    const nameref = useRef();
    const khoaref = useRef();

    return (
        <>
            <tr>
                <td>{index}</td>
                <td>{MSSV}</td>
                <td>{name}</td>
                <td>{faculty}</td>
                <td>
                    <button onClick={ondelete}>
                        <i className={cx('fas fa-trash')}></i>
                    </button>
                </td>
                <td>
                    <button
                        className={cx('sua')}
                        onClick={() => {
                            setshow(!show);
                        }}
                    >
                        Sửa
                    </button>
                </td>
            </tr>
            {show && (
                <tr>
                    <td>{index}</td>
                    <td>
                        <input
                            type="text"
                            className={cx('input-add-list')}
                            placeholder="Nhập mã mới"
                            id="mssv"
                            ref={idref}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            className={cx('input-add-list')}
                            placeholder="Nhập tên mới"
                            id="name"
                            ref={nameref}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            className={cx('input-add-list')}
                            placeholder="Nhập khoa mới"
                            id="khoa"
                            ref={khoaref}
                        />
                    </td>
                    <td>
                        <button
                            className={cx('sua')}
                            onClick={() => {
                                setshow(!show);
                            }}
                        >
                            Hủy
                        </button>
                    </td>
                    <td>
                        <button
                            className={cx('sua')}
                            onClick={() => {
                                if (
                                    idref.current.value.length > 0 ||
                                    nameref.current.value.length > 0 ||
                                    khoaref.current.value.length > 0
                                ) {
                                    let id = MSSV;
                                    if (idref.current.value.length > 0) {
                                        id = idref.current.value;
                                    }
                                    let ten = name;
                                    if (nameref.current.value.length > 0) {
                                        ten = nameref.current.value;
                                    }
                                    let khoa = faculty;
                                    if (khoaref.current.value.length > 0) {
                                        khoa = khoaref.current.value;
                                    }
                                    onchange(`${id}`, `${ten}`, `${khoa}`);
                                    setshow(!show);
                                } else {
                                    alert('Vui lòng điền ít nhất 1 thông tin');
                                }
                            }}
                        >
                            Lưu
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
}

export default ItemList;
