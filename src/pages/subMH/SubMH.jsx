import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './subMH.module.scss';
import SubItem from '~/Components/Defaultlayout/SubItem/SubItem';
import { get, child, set, ref, database, remove } from '~/pages/Login';
import { UseStore } from '~/Store';
const cx = classNames.bind(styles);

const SubMH = () => {
    const dbRef = ref(database);
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    const [subItems, setSubItems] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        starttime: '',
        starttime2: '',
        endtime: '',
        endtime2: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSubItem = () => {
        if (
            formData.title.length > 0 &&
            formData.starttime.length > 0 &&
            formData.endtime.length > 0 &&
            formData.endtime2.length > 0 &&
            formData.starttime2.length > 0
        ) {
            setSubItems([{ ...formData }, ...subItems]);
            setModalOpen(false);
            // set to student
            get(child(dbRef, `accounts/${standardizeEmail}/sendTo`)).then((snapshot) => {
                if (snapshot.exists()) {
                    for (let i = 0; i < snapshot.size; i++) {
                        set(child(dbRef, `accounts/${snapshot.val()[i]}/courses/register/regPeriod/${subItems.length}`), formData);
                    }
                }
            });
            // set to admin
            set(child(dbRef, `accounts/${standardizeEmail}/courses/register/regPeriod/${subItems.length}`), formData);

            setFormData({
                title: '',
                starttime: '',
                starttime2: '',
                endtime: '',
                endtime2: '',
                date: '',
            });
        } else {
            alert('Chưa điền đủ dữ liệu');
        }
    };

    const today = new Date();
    const dateString = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    useEffect(() => {
        get(child(dbRef, `accounts/${standardizeEmail}/courses/register/regPeriod`)).then((snapshot) => {
            if (snapshot.exists()) {
                let newRegister = [];
                for (let i = snapshot.size - 1; i >= 0; i--) {
                    newRegister.push({
                        id: i,
                        title: snapshot.val()[i].title,
                        starttime: snapshot.val()[i].starttime,
                        starttime2: snapshot.val()[i].starttime2,
                        endtime: snapshot.val()[i].endtime,
                        endtime2: snapshot.val()[i].endtime2,
                    });
                }
                setSubItems(newRegister);
            }
        });
        // eslint-disable-next-line
    }, []);
    let [state] = UseStore();
    let { todos } = state;
    let [type] = useState(todos.job);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('date_and_time')}>
                <span id="current-date">Time reach: {dateString}</span>
            </div>
            <div className={cx('content')}>
                <div className={cx('content-head')}>
                    Danh sách đợt đăng ký:
                    {type === 'admin' && (
                        <button className={cx('addSub')} onClick={() => setModalOpen(!modalOpen)}>
                            {modalOpen ? 'Đóng' : 'Thêm đợt đăng ký'}
                        </button>
                    )}
                </div>
                <div>
                    {!modalOpen && (
                        <ul className={cx('content__row')}>
                            <li className={cx('content-item', 'STT')}>STT</li>
                            <li className={cx('content-item', 'desc')}>Mô tả</li>
                            <li className={cx('content-item', 'time')}>
                                <div className={cx('content-item--first')}>Bắt đầu</div>
                                <div className={cx('content-item--second')}> Kết thúc </div>
                            </li>
                            <li className={cx('content-item', 'regis')}></li>
                            {type === 'admin' && (<li className={cx('delete')} >Xóa</li>)}
                        </ul>
                    )}
                </div>
                {modalOpen && (
                    <div className={cx('input')}>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Tiêu đề"
                        />
                        <div className={cx('pa')}>Chọn ngày, tháng, năm bắt đầu</div>
                        <input type="date" name="starttime" value={formData.starttime} onChange={handleInputChange} />
                        <div className={cx('pa')}>Chọn giờ, phút bắt đầu</div>
                        <input type="time" name="starttime2" value={formData.starttime2} onChange={handleInputChange} />
                        <div className={cx('pa')}>Chọn ngày, tháng, năm kết thúc</div>
                        <input type="date" name="endtime" value={formData.endtime} onChange={handleInputChange} />
                        <div className={cx('pa')}>Chọn giờ, phút kết thúc</div>
                        <input type="time" name="endtime2" value={formData.endtime2} onChange={handleInputChange} />
                        <button onClick={handleAddSubItem}>Lưu</button>
                    </div>
                )}
                {subItems.map((item, index) => (
                    <SubItem
                        key={index}
                        id={item.id}
                        title={item.title}
                        starttime={item.starttime}
                        starttime2={item.starttime2}
                        endtime={item.endtime}
                        endtime2={item.endtime2}
                        ondelete={() => {
                            subItems.splice(index, 1);
                            let reverse = [];
                            for (let i = subItems.length - 1; i >= 0; i--) {
                                reverse.push(subItems[i]);
                            }
                            // delete to admin
                            set(child(dbRef, `accounts/${standardizeEmail}/courses/register/regPeriod/`), reverse);
                            // delete to student
                            get(child(dbRef, `accounts/${standardizeEmail}/sendTo`)).then((snapshot) => {
                                if (snapshot.exists()) {
                                    for (let i = 0; i < snapshot.size; i++) {
                                        remove(child(dbRef, `accounts/${snapshot.val()[i]}/courses/register/regPeriod/${subItems.length}`));
                                    }
                                }
                            })
                            setSubItems([...subItems]);
                        }}
                        STT={index + 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubMH;
