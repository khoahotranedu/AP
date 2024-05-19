import classNames from 'classnames/bind';
import styles from './ItemStudent.module.scss';
import { useState, useRef } from 'react';
import { database, child, ref, set } from '~/pages/Login';
const cx = classNames.bind(styles);
function ItemStudent({ MSSV, Name, Diem, xoa, Chinhsua, index, sua = true, type, courseID, classCourse }) {
    const [diem, setdiem] = useState(`BTL: ${Diem[0] || '10'} KT:  ${Diem[1] || '10'} Thi:  ${Diem[2] || '10'}`);
    const [listdiem, setlistdiem] = useState([[Diem[0]], [Diem[1]], [Diem[2]]]);
    if (MSSV === 'MSSV') {
        sua = false;
        if (diem !== 'Điểm') setdiem('Điểm');
    }
    let classes = cx({
        sua,
    });
    const [show, setshow] = useState(false);
    const btlref = useRef();
    const Ktref = useRef();
    const Thiref = useRef();
    const dbRef = ref(database);

    return (
        <>
            <tr className={cx('tr')}>
                <th className={cx('th', 'notcopy')}>{MSSV}</th>
                <th className={cx('th', 'notcopy')}>{Name}</th>
                <th className={cx('th', 'notcopy')}>{diem}</th>
                {type && (
                    <th className={cx('th', 'notcopy', 'chinhsua')}>
                        <div
                            className={classes}
                            onClick={() => {
                                if (sua !== false) {
                                    setshow(!show);
                                }
                            }}
                        >
                            {Chinhsua}
                        </div>
                    </th>
                )}
                {type && (
                    <th className={cx('th', 'notcopy', 'chinhsua')}>
                        <div
                            className={classes}
                            onClick={() => {
                                if (sua !== false) {
                                    xoa();
                                }
                            }}
                        >
                            Xóa
                        </div>
                    </th>
                )}
            </tr>
            {show && (
                <tr className={cx('tr')} style={{ background: 'rgb(204 204 204 / 39%)' }}>
                    <th className={cx('th', 'notcopy', 'suadiem')}>{MSSV}</th>
                    <th className={cx('th', 'notcopy')}>{Name}</th>
                    <th className={cx('th', 'notcopy', 'boxsua')}>
                        <div className={cx('itembox')}>
                            <label className={cx('inputlabel')}>BTL </label>
                            :<input type="text" placeholder="Nhập điểm mới" ref={btlref} className={cx('iteminput')} />
                        </div>
                        <div className={cx('itembox')}>
                            <label className={cx('inputlabel')}>KT </label>
                            :
                            <input
                                type="text"
                                placeholder="Nhập điểm mới"
                                ref={Ktref}
                                className={cx('iteminput')}
                                id="inputkt"
                            />
                        </div>{' '}
                        <div className={cx('itembox')}>
                            <label className={cx('inputlabel')}>Thi </label>
                            :<input type="text" placeholder="Nhập điểm mới" ref={Thiref} className={cx('iteminput')} />
                        </div>
                    </th>
                    <th className={cx('th', 'notcopy', 'chinhsua')}>
                        <div
                            className={classes}
                            onClick={() => {
                                // eslint-disable-next-line
                                setdiem(
                                    `BTL: ${btlref.current.value || listdiem[0]} KT:  ${
                                        Ktref.current.value || listdiem[1]
                                    } Thi:  ${Thiref.current.value || listdiem[2]}`,
                                );

                                if (btlref.current.value.length > 0) {
                                    setlistdiem([[btlref.current.value], [...listdiem[1]], [...listdiem[2]]]);
                                    set(
                                        child(
                                            dbRef,
                                            `courses/current/score/${courseID}_${classCourse}/${index}/Diem/0`,
                                        ),
                                        btlref.current.value,
                                    );
                                    btlref.current.value = '';
                                }
                                if (Ktref.current.value.length > 0) {
                                    setlistdiem([[...listdiem[0]], [Ktref.current.value], [...listdiem[2]]]);
                                    set(
                                        child(
                                            dbRef,
                                            `courses/current/score/${courseID}_${classCourse}/${index}/Diem/1`,
                                        ),
                                        Ktref.current.value,
                                    );
                                    Ktref.current.value = '';
                                }
                                if (Thiref.current.value.length > 0) {
                                    setlistdiem([[...listdiem[0]], [...listdiem[1]], [Thiref.current.value]]);
                                    set(
                                        child(
                                            dbRef,
                                            `courses/current/score/${courseID}_${classCourse}/${index}/Diem/2`,
                                        ),
                                        Thiref.current.value,
                                    );
                                    Thiref.current.value = '';
                                }

                                setshow(!show);
                            }}
                        >
                            Lưu
                        </div>

                        <div
                            className={classes}
                            onClick={() => {
                                btlref.current.value = '';
                                Ktref.current.value = '';
                                Thiref.current.value = '';
                                setshow(!show);
                            }}
                        >
                            Hủy
                        </div>
                    </th>
                </tr>
            )}
        </>
    );
}

export default ItemStudent;
