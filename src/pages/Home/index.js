import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import logo from 'src/img/anhhcmut.jpg'; // with import

import CardComponent from './more_info/more_info';

const cx = classNames.bind(styles);
function Home() {
    let namelists = [
        {
            title: 'Thông báo gói học bổng DEF',
            content: 'Là gói học bổng mỗi kỳ dành riêng cho sinh viên DEF có học lực giỏi',
            imag: 'https://up-anh.vi-vn.vn/img/1713061613_68ab8a441e06f10a210471696f775182.png',
            text_more: 'Điều kiện xét học bổng: Điểm trung bình từ 8 trở lên, điểm thành phần trên 5 và điểm rèn luyện trên 80',
        },
        {
            title: 'Thông báo tham gia SHCD định kỳ',
            content: '',
            imag: 'https://nplaw.vn/upload/images/da-cap.jpg',
            text_more:
                'Các lớp khóa K22 thực hiện SHCD định kỳ từ ngày 1/5 đến ngày 5/5 tại hội trường A5 nhằm đẩy mạnh công tác chống đa cấp xấu',
        },
    ];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('home')}>
                <img src={logo} className={cx('img')} alt="Ảnh sự kiện" />
                <h2 className={cx('textmain')}>TRƯỜNG ĐẠI HỌC DEF</h2>
            </div>
            <div className={cx('sec')}>
                <h2 className={cx('sec_title')}>TRƯỜNG ĐẠI HỌC DEF</h2>

                <p className={cx('sec_content')}>
                    <br />
                    Trường Đại học DEF là một tấm gương sáng trong hệ thống giáo dục tiên tiến, đứng đầu tại Việt Nam
                    với bề dày lịch sử và uy tín trong việc đào tạo thế hệ kỹ sư, nhà khoa học và chuyên gia nghiên cứu
                    hàng đầu. Đội ngũ giảng viên giàu kinh nghiệm và đầy đam mê, trường chú trọng vào một chương trình
                    giáo dục chất lượng cao, pha trộn giữa lý thuyết sâu rộng và kỹ năng thực tiễn, bảo đảm rằng sinh
                    viên sau khi tốt nghiệp có đủ năng lực để vượt qua những thách thức không ngừng của thế giới công
                    nghệ tiên tiến. <br />
                    <br />
                    Với cơ sở vật chất hiện đại và môi trường học thuật năng động, Đại học DEF hiện đang điều hành 12
                    khoa cùng các trung tâm đào tạo, đào tạo đến 35 ngành bậc Đại học, 34 ngành bậc Thạc sỹ và 27 ngành
                    bậc Tiến sỹ, với tổng số hơn 23.000 sinh viên, hơn 2.100 cán bộ giảng viên và gần 300 nhà nghiên
                    cứu. Trường không chỉ góp phần vào sự phát triển của hệ thống giáo dục đại học Việt Nam mà còn là
                    nơi đào tạo những nhà lãnh đạo tương lai, những nhà khoa học hàng đầu và các chuyên gia quản lý cấp
                    cao, có ảnh hưởng rộng lớn cả trong và ngoài nước.
                    <br />
                </p>
            </div>

            <div className={cx('more_info')}>
                <h2 className={cx('text_info')}>Thông báo đến sinh viên</h2>
                <div className={cx('team')}>
                    {namelists.map((name, index) => {
                        return (
                            <CardComponent
                                title={name.title}
                                content={name.content}
                                imageUrl={name.imag}
                                text_more={name.text_more}
                                key={index}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Home;
